import Demo from "./Demo";

const RELEASES = "https://github.com/bmcmbuenviaje/insight-deck-site/releases/latest";

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
          <a className="hide" href="#why">Why</a>
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

      <section id="download" style={{ background: "var(--soft)" }}>
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
