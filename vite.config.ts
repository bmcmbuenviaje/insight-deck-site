import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://<user>.github.io/insight-deck-site/ — base must match.
export default defineConfig({
  base: "/insight-deck-site/",
  plugins: [react()],
  build: { target: "es2021", chunkSizeWarningLimit: 4000 },
});
