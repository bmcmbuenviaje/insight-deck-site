// In-browser analytics for the live demo. Uses DuckDB-WASM to run real SQL over
// bundled sample data; if the wasm bundle can't load (rare), it falls back to an
// equivalent pure-JS computation so the demo still works.
import * as duckdb from "@duckdb/duckdb-wasm";

// A synthetic 12-month P&L + cashflow for a fictional SaaS company (USD).
export const SAMPLE_PNL = `month,revenue,cogs,opex,depreciation,cash_in,cash_out,cash_balance
2025-01-01,82000,24000,61000,3000,80000,95000,540000
2025-02-01,88000,25500,62000,3000,86000,96000,530000
2025-03-01,95000,27000,63500,3000,93000,98000,525000
2025-04-01,101000,28500,65000,3000,99000,101000,523000
2025-05-01,110000,30000,66500,3000,108000,103000,528000
2025-06-01,118000,31500,68000,3000,116000,105000,539000
2025-07-01,127000,33000,70000,3200,125000,108000,556000
2025-08-01,134000,34500,72000,3200,132000,110000,578000
2025-09-01,142000,36000,74000,3200,140000,113000,605000
2025-10-01,151000,37500,76000,3200,149000,116000,638000
2025-11-01,163000,39000,79000,3400,161000,120000,679000
2025-12-01,178000,41000,82000,3400,176000,124000,731000`;

export interface Row {
  [k: string]: number | string;
}

let conn: duckdb.AsyncDuckDBConnection | null = null;
let backend: "duckdb-wasm" | "js" = "js";
export function engineLabel() {
  return backend === "duckdb-wasm" ? "DuckDB-WASM" : "in-browser";
}

const rows: Row[] = SAMPLE_PNL.trim()
  .split("\n")
  .slice(1)
  .map((line) => {
    const [month, revenue, cogs, opex, depreciation, cash_in, cash_out, cash_balance] = line.split(",");
    return {
      month,
      revenue: +revenue,
      cogs: +cogs,
      opex: +opex,
      depreciation: +depreciation,
      cash_in: +cash_in,
      cash_out: +cash_out,
      cash_balance: +cash_balance,
    };
  });

export async function initEngine(): Promise<void> {
  try {
    // Prefer the single-threaded MVP bundle: it doesn't need cross-origin
    // isolation (COOP/COEP), which GitHub Pages doesn't send. The CDN worker is
    // cross-origin, so wrap it in a same-origin blob (the documented pattern).
    const bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle({ mvp: bundles.mvp, eh: bundles.mvp });
    const workerUrl = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" })
    );
    const worker = new Worker(workerUrl);
    const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.ERROR);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(workerUrl);
    conn = await db.connect();
    await db.registerFileText("pnl.csv", SAMPLE_PNL);
    await conn.query("CREATE TABLE pnl AS SELECT * FROM read_csv_auto('pnl.csv', header=true)");
    backend = "duckdb-wasm";
  } catch {
    // Fall back to an equivalent pure-JS computation so the demo always works.
    conn = null;
    backend = "js";
  }
}

async function q(sql: string): Promise<Row[]> {
  if (!conn) return [];
  const res = await conn.query(sql);
  return res.toArray().map((r: any) => r.toJSON());
}

export interface Exec {
  revenue: number;
  gross_profit: number;
  ebitda: number;
  ebitda_margin: number;
  cash_on_hand: number;
  net_burn: number;
  runway: number | null;
  series: { month: string; revenue: number; gross_profit: number; ebitda: number; cash_balance: number }[];
}

/** Compute executive KPIs, optionally under revenue/opex deltas (scenario). */
export async function executive(revDeltaPct = 0, opexDeltaPct = 0): Promise<Exec> {
  const rf = 1 + revDeltaPct / 100;
  const of = 1 + opexDeltaPct / 100;

  let series: Exec["series"];
  if (backend === "duckdb-wasm") {
    const r = await q(
      `SELECT month::VARCHAR AS month,
              revenue*${rf} AS revenue,
              revenue*${rf}-cogs AS gross_profit,
              revenue*${rf}-cogs-opex*${of} AS ebitda,
              cash_balance AS cash_balance
       FROM pnl ORDER BY month`
    );
    series = r.map((x) => ({
      month: String(x.month).slice(0, 7),
      revenue: +x.revenue,
      gross_profit: +x.gross_profit,
      ebitda: +x.ebitda,
      cash_balance: +x.cash_balance,
    }));
  } else {
    series = rows.map((x) => ({
      month: String(x.month).slice(0, 7),
      revenue: (x.revenue as number) * rf,
      gross_profit: (x.revenue as number) * rf - (x.cogs as number),
      ebitda: (x.revenue as number) * rf - (x.cogs as number) - (x.opex as number) * of,
      cash_balance: x.cash_balance as number,
    }));
  }

  const revenue = series.reduce((a, s) => a + s.revenue, 0);
  const gross_profit = series.reduce((a, s) => a + s.gross_profit, 0);
  const ebitda = series.reduce((a, s) => a + s.ebitda, 0);
  const cash_on_hand = series[series.length - 1]?.cash_balance ?? 0;

  // Net monthly burn under the scenario (avg of monthly net cash flow).
  const monthlyNet = rows.map(
    (x) => (x.cash_in as number) - (x.cash_out as number) + ((x.revenue as number) * (rf - 1) - (x.opex as number) * (of - 1))
  );
  const avgNet = monthlyNet.reduce((a, n) => a + n, 0) / monthlyNet.length;
  const net_burn = Math.max(0, -avgNet);
  const runway = net_burn > 0 ? cash_on_hand / net_burn : null;

  return {
    revenue,
    gross_profit,
    ebitda,
    ebitda_margin: revenue ? (ebitda / revenue) * 100 : 0,
    cash_on_hand,
    net_burn,
    runway,
    series,
  };
}
