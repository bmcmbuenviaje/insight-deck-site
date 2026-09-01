// Self-contained demo analytics: realistic sample data + pure-TS computations
// that mirror what the desktop engine does. No external engine or WASM needed,
// so the demo always renders instantly. Numbers are illustrative but internally
// consistent, chosen to showcase every module for a client walkthrough.

export const money = (n: number | null | undefined, cur = "$"): string => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const a = Math.abs(n), s = n < 0 ? "-" : "";
  if (a >= 1e9) return `${s}${cur}${(a / 1e9).toFixed(2)}B`;
  if (a >= 1e6) return `${s}${cur}${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `${s}${cur}${(a / 1e3).toFixed(1)}K`;
  return `${s}${cur}${Math.round(a).toLocaleString()}`;
};
export const pct = (n: number | null | undefined): string =>
  n === null || n === undefined || Number.isNaN(n) ? "—" : `${n.toFixed(1)}%`;

// --- Finance: 12-month P&L + cashflow (a fictional SaaS company, USD) --------
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const REV = [82, 88, 95, 101, 110, 118, 127, 134, 142, 151, 163, 178].map((x) => x * 1000);
const COGS = [24, 25.5, 27, 28.5, 30, 31.5, 33, 34.5, 36, 37.5, 39, 41].map((x) => x * 1000);
const OPEX = [61, 62, 63.5, 65, 66.5, 68, 70, 72, 74, 76, 79, 82].map((x) => x * 1000);
const CASH_IN = REV.map((r) => r * 0.98);
const CASH_OUT = [95, 96, 98, 101, 103, 105, 108, 110, 113, 116, 120, 124].map((x) => x * 1000);

export interface ExecResult {
  revenue: number; grossProfit: number; ebitda: number; ebitdaMargin: number;
  cashOnHand: number; netBurn: number; runway: number | null;
  series: { month: string; revenue: number; grossProfit: number; ebitda: number; cash: number }[];
}
export function computeExecutive(revDeltaPct = 0, opexDeltaPct = 0): ExecResult {
  const rf = 1 + revDeltaPct / 100, of = 1 + opexDeltaPct / 100;
  let cash = 540000;
  const series = MONTHS.map((m, i) => {
    const revenue = REV[i] * rf;
    const grossProfit = revenue - COGS[i];
    const ebitda = revenue - COGS[i] - OPEX[i] * of;
    const net = CASH_IN[i] * rf - CASH_OUT[i] - OPEX[i] * (of - 1);
    cash += net;
    return { month: m, revenue, grossProfit, ebitda, cash };
  });
  const revenue = series.reduce((a, s) => a + s.revenue, 0);
  const grossProfit = series.reduce((a, s) => a + s.grossProfit, 0);
  const ebitda = series.reduce((a, s) => a + s.ebitda, 0);
  const cashOnHand = series[series.length - 1].cash;
  const monthlyNet = MONTHS.map((_, i) => CASH_IN[i] * rf - CASH_OUT[i] - OPEX[i] * (of - 1));
  const avgNet = monthlyNet.reduce((a, n) => a + n, 0) / monthlyNet.length;
  const netBurn = Math.max(0, -avgNet);
  return {
    revenue, grossProfit, ebitda,
    ebitdaMargin: (ebitda / revenue) * 100,
    cashOnHand, netBurn,
    runway: netBurn > 0 ? cashOnHand / netBurn : null,
    series,
  };
}

// --- SaaS metrics ------------------------------------------------------------
const SAAS = MONTHS.map((m, i) => {
  const customers = 320 + i * 34;
  const newC = 40 + i * 3;
  const churned = Math.round(customers * 0.02);
  const mrr = customers * (95 + i * 2); // ARPU creeps up
  return { month: m, customers, newC, churned, mrr };
});
export function computeSaas() {
  const last = SAAS[SAAS.length - 1], prev = SAAS[SAAS.length - 2];
  const mrr = last.mrr;
  const arpu = mrr / last.customers;
  const grossChurn = (last.churned / prev.customers) * 100;
  const ltv = arpu / (grossChurn / 100);
  const nrr = ((prev.mrr + (mrr - prev.mrr)) / prev.mrr) * 100; // simplified NRR
  return {
    mrr, arr: mrr * 12, customers: last.customers, arpu, grossChurn, nrr, ltv,
    series: SAAS.map((s) => ({ month: s.month, mrr: s.mrr, customers: s.customers, churned: s.churned })),
  };
}

// --- Multi-currency ----------------------------------------------------------
export const FX: Record<string, number> = { USD: 1, EUR: 1.09, GBP: 1.27, PHP: 0.0176, SGD: 0.74 };
const SALES = [
  { region: "North America", currency: "USD", amount: 412000 },
  { region: "Europe", currency: "EUR", amount: 286000 },
  { region: "UK", currency: "GBP", amount: 141000 },
  { region: "Philippines", currency: "PHP", amount: 9800000 },
  { region: "Singapore", currency: "SGD", amount: 190000 },
];
export function computeCurrency() {
  const rows = SALES.map((s) => ({ ...s, base: s.amount * FX[s.currency] }));
  const total = rows.reduce((a, r) => a + r.base, 0);
  return { rows, total, base: "USD" };
}

// --- Ad-Ops ------------------------------------------------------------------
const CAMPAIGNS = [
  { name: "Search — Brand", spend: 42000, impressions: 1_200_000, clicks: 54000, conv: 2100, revenue: 231000 },
  { name: "Search — Generic", spend: 68000, impressions: 3_400_000, clicks: 61000, conv: 1650, revenue: 181500 },
  { name: "Meta — Retarget", spend: 31000, impressions: 5_800_000, clicks: 92000, conv: 2450, revenue: 269500 },
  { name: "Meta — Prospecting", spend: 55000, impressions: 9_100_000, clicks: 73000, conv: 1320, revenue: 132000 },
  { name: "LinkedIn — ABM", spend: 24000, impressions: 640_000, clicks: 8200, conv: 410, revenue: 205000 },
];
export function computeAdOps() {
  const rows = CAMPAIGNS.map((c) => ({
    ...c,
    ctr: (c.clicks / c.impressions) * 100,
    cpc: c.spend / c.clicks,
    roas: c.revenue / c.spend,
    // crude "fatigue" proxy: high frequency (impr/click) + low ROAS
    fatigue: Math.min(100, Math.round((c.impressions / c.clicks) * 4 + (c.revenue / c.spend < 2 ? 35 : 0))),
  }));
  const spend = rows.reduce((a, r) => a + r.spend, 0);
  const revenue = rows.reduce((a, r) => a + r.revenue, 0);
  return { rows, spend, revenue, roas: revenue / spend };
}

// --- Market Intel ------------------------------------------------------------
export const TARGETS = [
  { name: "Globex Corp", score: 92, why: ["Just raised Series C ($80M)", "No incumbent analytics vendor", "2 execs from a churned rival"] },
  { name: "Initech", score: 84, why: ["Hiring 3 FP&A roles", "Competitor renewal in 60 days", "Positive news sentiment"] },
  { name: "Umbrella Ltd", score: 78, why: ["Expanding to 4 new markets", "Multi-currency pain (public)", "Warm intro available"] },
  { name: "Stark Industries", score: 71, why: ["New CFO (ex-customer)", "Consolidating 3 BI tools"] },
  { name: "Wayne Enterprises", score: 65, why: ["RFP rumored Q3", "Data-quality complaints on forums"] },
];
