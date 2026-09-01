import Demo from "./Demo";

const RELEASES = "https://github.com/bmcmbuenviaje/insight-deck-site/releases/latest";

// Replace these with your Stripe Payment Link URLs (Dashboard → Payment Links).
// A Payment Link is a hosted checkout — no server needed. After payment, email
// the customer a license key (issued with scripts/superadmin.py license-issue),
// or wire the online-activation server later.
const STRIPE_PRO = "https://buy.stripe.com/test_REPLACE_PRO";
const STRIPE_BUSINESS = "https://buy.stripe.com/test_REPLACE_BUSINESS";

const PLANS: { name: string; price: string; blurb: string; features: string[]; cta: string; href: string; highlight?: boolean }[] = [
  {
    name: "Free",
    price: "$0",
    blurb: "For individuals getting started.",
    features: ["Finance & BD module", "Executive overview", "Import CSV / Excel / Parquet", "Export CSV / XLSX / PDF", "Runs fully offline"],
    cta: "Download",
    href: RELEASES,
  },
  {
    name: "Pro",
    price: "$19",
    blurb: "per month · for operators & small teams.",
    features: ["Everything in Free", "Ad-Ops & Market Intel", "CFO Tools: multi-currency, AR, forecast, scenario", "SaaS metrics & custom KPIs", "Connectors, scheduled reports & alerts", "Local AI assistant & narratives"],
    cta: "Start free trial",
    href: STRIPE_PRO,
    highlight: true,
  },
  {
    name: "Business",
    price: "$49",
    blurb: "per month · for companies.",
    features: ["Everything in Pro", "Multi-user, roles & audit log", "White-label branding", "Database connectors & data quality", "Multi-entity consolidation", "Priority support"],
    cta: "Contact / buy",
    href: STRIPE_BUSINESS,
  },
];

const FEATURES = [
  ["Finance & BD", "Revenue, pipeline, margins, collections — mapped from any spreadsheet, no fixed schema."],
  ["Executive Overview", "Gross profit, EBITDA, net burn, and cash runway with trend charts, at a glance."],
  ["CFO Tools", "Multi-currency, budgets vs actual, AR aging & DSO, 13-week cash forecast, what-if scenarios."],
  ["Ad-Ops", "Creative fatigue, anomaly detection, forecasting, and budget pacing for marketing."],
  ["Market Intel", "A company knowledge base, BD-target scoring, and a live relationship graph."],
  ["Local AI & alerts", "Ask your data in plain English, get board-style commentary, and threshold alerts to Slack/email."],
];

const WHY = [
  ["Runs anywhere", "One installer for Windows, macOS, Linux — even a Raspberry Pi. No cloud, no Docker."],
  ["Offline & private", "Your data stays on your device in an embedded database. Nothing leaves unless you connect it."],
  ["Own your data", "Import CSV/Excel/Parquet or connect Google Sheets & Stripe. Export to CSV/XLSX/PDF anytime."],
];

export default function App() {
  return (
    <>
      <div className="nav">
        <div className="wrap row">
          <div className="brand">
            <span className="mark" /> Insight Deck
          </div>
          <span className="spacer" />
          <a className="hide" href="#demo">Live demo</a>
          <a className="hide" href="#features">Features</a>
          <a className="hide" href="#pricing">Pricing</a>
          <a className="hide" href="#docs">Docs</a>
          <a className="btn primary" href="#download">Download</a>
        </div>
      </div>

      <header className="hero">
        <div className="wrap">
          <div className="pills">
            <span className="pill">Windows</span>
            <span className="pill">macOS</span>
            <span className="pill">Linux</span>
            <span className="pill">Raspberry Pi</span>
            <span className="pill">Offline-first</span>
          </div>
          <h1>Your whole business, on one deck.</h1>
          <p className="lead">
            Insight Deck turns spreadsheets into live finance, ad-ops, and market dashboards — in a single app
            that installs anywhere and runs fully offline. Try the real analytics engine right here in your browser.
          </p>
          <div className="cta">
            <a className="btn primary" href="#demo">Try the live demo ↓</a>
            <a className="btn ghost" href="#download">Download the app</a>
          </div>
        </div>
      </header>

      <section id="demo">
        <div className="wrap">
          <h2 className="sec">Live, in your browser</h2>
          <p className="sub">
            This is the actual analytics engine — not a video. It's computing on sample data locally; the desktop app
            does the same over your data.
          </p>
          <Demo />
        </div>
      </section>

      <section id="features" style={{ background: "var(--soft)" }}>
        <div className="wrap">
          <h2 className="sec">Everything, in one place</h2>
          <p className="sub">Six modules that used to be six tools.</p>
          <div className="grid">
            {FEATURES.map(([t, d]) => (
              <div className="card" key={t}>
                <div className="ico" />
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why">
        <div className="wrap">
          <h2 className="sec">Why Insight Deck</h2>
          <p className="sub">Built to be owned, not rented.</p>
          <div className="grid">
            {WHY.map(([t, d]) => (
              <div className="card" key={t}>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="wrap">
          <h2 className="sec">Simple, honest pricing</h2>
          <p className="sub">Own the app — no per-seat cloud tax. 14-day Pro trial, no account needed.</p>
          <div className="grid">
            {PLANS.map((p) => (
              <div className="card" key={p.name} style={p.highlight ? { borderColor: "var(--primary)", boxShadow: "0 8px 30px rgba(47,107,255,.12)" } : undefined}>
                {p.highlight && <span className="pill" style={{ marginBottom: 8, display: "inline-block" }}>Most popular</span>}
                <h3 style={{ fontSize: 20 }}>{p.name}</h3>
                <div style={{ fontSize: 30, fontWeight: 800 }}>{p.price}</div>
                <p style={{ marginBottom: 12 }}>{p.blurb}</p>
                <ul style={{ paddingLeft: 18, margin: "0 0 16px", color: "var(--muted)", fontSize: 14 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ marginBottom: 4 }}>{f}</li>
                  ))}
                </ul>
                <a className={"btn " + (p.highlight ? "primary" : "ghost")} href={p.href} style={{ width: "100%", textAlign: "center", boxSizing: "border-box" }}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="docs" style={{ background: "var(--soft)" }}>
        <div className="wrap">
          <h2 className="sec">Get started in 2 minutes</h2>
          <p className="sub">No servers, no setup.</p>
          <div className="grid">
            <div className="card"><h3>1 · Install</h3><p>Download for your platform and run the installer. Everything is bundled — no Python, no database, no Docker.</p></div>
            <div className="card"><h3>2 · Import</h3><p>Drag a CSV / Excel / Parquet file in, or load the built-in sample datasets. Columns are auto-detected.</p></div>
            <div className="card"><h3>3 · Explore</h3><p>Open Finance, Executive, and CFO Tools. Map a few columns and your dashboards light up instantly.</p></div>
          </div>
          <p className="sub" style={{ marginTop: 20 }}>
            Everything runs locally in an embedded database. Connect Google Sheets, Stripe, or a Postgres/MySQL database
            when you want live data, and export to CSV/XLSX/PDF anytime.
          </p>
        </div>
      </section>

      <section id="download">
        <div className="wrap">
          <h2 className="sec">Download &amp; try free</h2>
          <p className="sub">
            Install and start a 14-day trial of every Pro feature — no account needed. Pick your platform:
          </p>
          <div className="dl">
            <a href={RELEASES}>Windows<small>.msi / .exe</small></a>
            <a href={RELEASES}>macOS<small>.dmg (Apple Silicon)</small></a>
            <a href={RELEASES}>Linux<small>.deb / .AppImage</small></a>
            <a href={RELEASES}>Raspberry Pi<small>arm64 .deb / .AppImage</small></a>
          </div>
          <p className="sub" style={{ marginTop: 16 }}>
            Not code-signed yet, so your OS may warn on first launch — choose “Run anyway” / right-click “Open”.
          </p>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="brand" style={{ marginBottom: 8 }}>
            <span className="mark" /> Insight Deck
          </div>
          Offline-first analytics for individuals and companies. © 2026 · Runs on Windows, macOS, Linux &amp; Raspberry Pi.
        </div>
      </footer>
    </>
  );
}
