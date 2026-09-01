import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Exec, engineLabel, executive, initEngine } from "./duck";

function money(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  const a = Math.abs(n);
  const s = n < 0 ? "-" : "";
  if (a >= 1e6) return `$${s}${(a / 1e6).toFixed(2)}M`;
  if (a >= 1e3) return `$${s}${(a / 1e3).toFixed(0)}K`;
  return `$${s}${Math.round(a)}`;
}

export default function Demo() {
  const [ready, setReady] = useState(false);
  const [rev, setRev] = useState(0);
  const [opex, setOpex] = useState(0);
  const [exec, setExec] = useState<Exec | null>(null);

  useEffect(() => {
    initEngine().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    executive(rev, opex).then(setExec);
  }, [ready, rev, opex]);

  const label = useMemo(() => engineLabel(), [ready]);

  return (
    <div className="demo">
      <div className="slider-row" style={{ justifyContent: "space-between" }}>
        <div>
          <strong>Executive Overview</strong>{" "}
          <span className="badge live">live · {label}</span>
        </div>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>Sample SaaS company · 2025</span>
      </div>

      {!exec ? (
        <p style={{ color: "var(--muted)" }}>
          <span className="badge load">loading engine…</span> spinning up the analytics engine in your browser.
        </p>
      ) : (
        <>
          <div className="kpis">
            <div className="kpi"><div className="lab">Revenue (yr)</div><div className="val" style={{ color: "#2f6bff" }}>{money(exec.revenue)}</div></div>
            <div className="kpi"><div className="lab">EBITDA</div><div className="val" style={{ color: "#7048e8" }}>{money(exec.ebitda)}</div><div className="lab">{exec.ebitda_margin.toFixed(1)}% margin</div></div>
            <div className="kpi"><div className="lab">Cash on hand</div><div className="val" style={{ color: "#0ca678" }}>{money(exec.cash_on_hand)}</div></div>
            <div className="kpi"><div className="lab">Runway</div><div className="val" style={{ color: "#e8590c" }}>{exec.runway == null ? "∞" : `${exec.runway.toFixed(1)} mo`}</div><div className="lab">{exec.net_burn > 0 ? `${money(exec.net_burn)}/mo burn` : "cash positive"}</div></div>
          </div>

          <div style={{ width: "100%", height: 300, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 10 }}>
            <ResponsiveContainer>
              <ComposedChart data={exec.series} margin={{ left: 6, right: 10, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.35} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={money} width={54} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => money(v)} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#2f6bff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gross_profit" name="Gross profit" fill="#12b886" radius={[4, 4, 0, 0]} />
                <Line dataKey="ebitda" name="EBITDA" stroke="#7048e8" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: 16 }}>
            <strong style={{ fontSize: 14 }}>What-if scenario</strong>
            <div className="slider-row" style={{ marginTop: 8 }}>
              <label style={{ minWidth: 150 }}>Revenue {rev >= 0 ? "+" : ""}{rev}%</label>
              <input type="range" min={-30} max={50} value={rev} onChange={(e) => setRev(+e.target.value)} style={{ flex: 1 }} />
            </div>
            <div className="slider-row" style={{ marginTop: 8 }}>
              <label style={{ minWidth: 150 }}>Opex {opex >= 0 ? "+" : ""}{opex}%</label>
              <input type="range" min={-30} max={50} value={opex} onChange={(e) => setOpex(+e.target.value)} style={{ flex: 1 }} />
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 8 }}>
              Drag the sliders — EBITDA, burn, and runway recompute instantly. This is the real analytics engine
              running entirely in your browser; the desktop app does the same over <em>your</em> data, offline.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
