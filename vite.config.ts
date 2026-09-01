import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/insight-deck-site/ — base must match.
export default defineConfig({
  base: "/insight-deck-site/",
  plugins: [react()],
  // duckdb-wasm ships worker + wasm assets; exclude from pre-bundling so Vite
  // serves them correctly, and allow the large wasm in the bundle.
  optimizeDeps: { exclude: ["@duckdb/duckdb-wasm"] },
  build: { target: "es2021", chunkSizeWarningLimit: 4000 },
});
