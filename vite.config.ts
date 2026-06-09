import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Repo is published at https://<user>.github.io/dnd2026/, so assets must
// resolve under the /dnd2026/ subpath. Dev server still serves from root.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/dnd2026/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
