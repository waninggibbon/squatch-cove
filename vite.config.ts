import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// Repo is published at https://<user>.github.io/dnd2026/, so assets must
// resolve under the /dnd2026/ subpath. Dev server still serves from root.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/dnd2026/" : "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // app_icon.png is the source; the rest are generated from it (see README).
      includeAssets: ["app_icon.png", "apple-touch-icon.png"],
      manifest: {
        name: "Scouts of Squatch Cove",
        short_name: "Squatch Cove",
        description: "Character companion for the Scouts of Squatch Cove campaign.",
        theme_color: "#1a1410",
        background_color: "#1a1410",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
