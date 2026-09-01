# Insight Deck — marketing & live demo site

Public landing page for **Insight Deck** with an interactive, in-browser demo of
the analytics engine (powered by **DuckDB-WASM**, with a pure-JS fallback). This
repo is intentionally public and contains **no product source** — the app itself
lives in a private repository.

- **Live site:** https://bmcmbuenviaje.github.io/insight-deck-site/
- Built with React + Vite; deployed to GitHub Pages via `.github/workflows/deploy.yml`.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/insight-deck-site/
npm run build    # -> dist/
```

## Downloads

The download buttons point at this repo's **Releases**. Because the product repo
is private (its release assets aren't publicly downloadable), publish the built
installers here (or to any public host) so prospective clients can download them.
