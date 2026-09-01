import { useMemo, useState } from "react";
import {
  Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  TARGETS, computeAdOps, computeCurrency, computeExecutive, computeSaas, money, pct,
} from "./demoData";

const TABS = ["Executive", "SaaS metrics", "Multi-currency", "Ad-Ops", "Market Intel"] as const;
type Tab = (typeof TABS)[number];

function Kpi({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="kpi">
      <div className="lab">{label}</div>
      <div className="val" style={{ color }}>{value}</div>
      {sub && <div className="lab">{sub}</div>}
    </div>
  );
}

function ExecutiveTab() {
  const [rev, setRev] = useState(0);
  const [opex, setOpex] = useState(0);
  const e = useMemo(() => computeExecutive(rev, opex), [rev, opex]);
  return (
    <>
      <div className="kpis">
        <Kpi label="Revenue (yr)" value={money(e.revenue)} color="#2f6bff" />
        <Kpi label="EBITDA" value={money(e.ebitda)} sub={`${e.ebitdaMargin.toFixed(1)}% margin`} color="#7048e8" />
        <Kpi label="Cash on hand" value={money(e.cashOnHand)} color="#0ca678" />
        <Kpi label="Runway" value={e.runway == null ? "∞" : `${e.runway.toFixed(1)} mo`} sub={e.netBurn > 0 ? `${money(e.netBurn)}/mo burn` : "cash positive"} color="#e8590c" />
      </div>
      <div className="chartbox">
        <ResponsiveContainer>
          <ComposedChart data={e.series} margin={{ left: 6, right: 10, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => money(v)} width={54} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => money(v)} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#2f6bff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="grossProfit" name="Gross profit" fill="#12b886" radius={[4, 4, 0, 0]} />
            <Line dataKey="ebitda" name="EBITDA" stroke="#7048e8" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 14 }}>
        <strong style={{ fontSize: 14 }}>What-if scenario</strong>
        <div className="slider-row" style={{ marginTop: 8 }}>
          <label style={{ minWidth: 150 }}>Revenue {rev >= 0 ? "+" : ""}{rev}%</label>
          <input type="range" min={-30} max={50} value={rev} onChange={(e2) => setRev(+e2.target.value)} style={{ flex: 1 }} />
        </div>
        <div className="slider-row" style={{ marginTop: 8 }}>
          <label style={{ minWidth: 150 }}>Opex {opex >= 0 ? "+" : ""}{opex}%</label>
          <input type="range" min={-30} max={50} value={opex} onChange={(e2) => setOpex(+e2.target.value)} style={{ flex: 1 }} />
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
          Drag the sliders — EBITDA, burn, and runway recompute instantly. The desktop app does this over <em>your</em> P&amp;L, offline.
        </p>
      </div>
    </>
  );
}

function SaasTab() {
  const s = useMemo(() => computeSaas(), []);
  return (
    <>
      <div className="kpis">
        <Kpi label="MRR" value={money(s.mrr)} color="#2f6bff" />
        <Kpi label="ARR" value={money(s.arr)} color="#7048e8" />
        <Kpi label="Customers" value={s.customers.toLocaleString()} color="#0ca678" />
        <Kpi label="Gross churn" value={pct(s.grossChurn)} color="#e8590c" />
      </div>
      <div className="kpis">
        <Kpi label="ARPU" value={money(s.arpu)} />
        <Kpi label="Net revenue retention" value={pct(s.nrr)} />
        <Kpi label="Est. LTV" value={money(s.ltv)} />
        <Kpi label="LTV / ARPU" value={`${(s.ltv / s.arpu).toFixed(0)}×`} />
      </div>
      <div className="chartbox">
        <ResponsiveContainer>
          <ComposedChart data={s.series} margin={{ left: 6, right: 10, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="l" tickFormatter={(v) => money(v)} width={54} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="r" orientation="right" width={44} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="l" dataKey="mrr" name="MRR" fill="#2f6bff" radius={[4, 4, 0, 0]} />
            <Line yAxisId="r" dataKey="customers" name="Customers" stroke="#12b886" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>Auto-derived from a subscriptions dataset — connect Stripe in the app for live MRR/ARR/churn.</p>
    </>
  );
}

function CurrencyTab() {
  const c = useMemo(() => computeCurrency(), []);
  return (
    <>
      <div className="kpis">
        <Kpi label="Total (base USD)" value={money(c.total)} color="#0ca678" />
        <Kpi label="Regions" value={String(c.rows.length)} />
        <Kpi label="Currencies" value={String(new Set(c.rows.map((r) => r.currency)).size)} />
        <Kpi label="Largest market" value={c.rows.slice().sort((a, b) => b.base - a.base)[0].region} />
      </div>
      <table className="tbl">
        <thead><tr><th>Region</th><th>Currency</th><th>Local amount</th><th>In base (USD)</th></tr></thead>
        <tbody>
          {c.rows.map((r) => (
            <tr key={r.region}>
              <td>{r.region}</td><td>{r.currency}</td>
              <td>{money(r.amount, r.currency === "USD" ? "$" : "")} {r.currency !== "USD" ? r.currency : ""}</td>
              <td><b>{money(r.base)}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>Mixed-currency sales normalized to a base currency using your FX rates — no more apples-to-oranges totals.</p>
    </>
  );
}

function AdOpsTab() {
  const a = useMemo(() => computeAdOps(), []);
  return (
    <>
      <div className="kpis">
        <Kpi label="Spend" value={money(a.spend)} color="#e8590c" />
        <Kpi label="Revenue" value={money(a.revenue)} color="#2f6bff" />
        <Kpi label="Blended ROAS" value={`${a.roas.toFixed(2)}×`} color="#0ca678" />
        <Kpi label="Campaigns" value={String(a.rows.length)} />
      </div>
      <div className="chartbox" style={{ height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={a.rows} margin={{ left: 6, right: 10, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-12} height={50} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => `${v.toFixed(2)}×`} />
            <Bar dataKey="roas" name="ROAS" radius={[4, 4, 0, 0]} fill="#2f6bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <table className="tbl">
        <thead><tr><th>Campaign</th><th>Spend</th><th>ROAS</th><th>CTR</th><th>Fatigue</th></tr></thead>
        <tbody>
          {a.rows.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td><td>{money(r.spend)}</td><td>{r.roas.toFixed(2)}×</td><td>{pct(r.ctr)}</td>
              <td><span className="badge" style={{ background: r.fatigue > 60 ? "rgba(232,89,12,.15)" : "rgba(18,184,134,.15)", color: r.fatigue > 60 ? "#e8590c" : "#0b8a63" }}>{r.fatigue}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function MarketTab() {
  return (
    <>
      <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 0 }}>
        Ranked BD targets, scored by fusing your knowledge base with live news signals. Each comes with a human-readable “why”.
      </p>
      {TARGETS.map((t) => (
        <div key={t.name} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{t.name}</h3>
            <span className="badge live" style={{ fontSize: 15 }}>{t.score}</span>
          </div>
          <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "var(--muted)", fontSize: 13 }}>
            {t.why.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
      ))}
    </>
  );
}

export default function Demo() {
  const [tab, setTab] = useState<Tab>("Executive");
  return (
    <div className="demo">
      <div className="slider-row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <div><strong>Interactive demo</strong> <span className="badge live">live · in your browser</span></div>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>Sample data · fully synthetic</span>
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={"tab" + (t === tab ? " active" : "")} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        {tab === "Executive" && <ExecutiveTab />}
        {tab === "SaaS metrics" && <SaasTab />}
        {tab === "Multi-currency" && <CurrencyTab />}
        {tab === "Ad-Ops" && <AdOpsTab />}
        {tab === "Market Intel" && <MarketTab />}
      </div>
    </div>
  );
}
