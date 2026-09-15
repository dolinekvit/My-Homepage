import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import manifest from "./manifest.config.ts";

/**
 * Adds public/theme-init.js as a render-blocking script to production pages only. In dev, CRXJS
 * turns every <script src> into a module import, and Vite refuses to import files from public/,
 * which aborts the page's other scripts.
 */
function themeInitScript(): Plugin {
  return {
    name: "my-homepage:theme-init",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler: () => [{ tag: "script", attrs: { src: "/theme-init.js" }, injectTo: "head" }],
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest }), themeInitScript()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  server: {
    port: 5173,
    strictPort: true,
    // CRXJS loads modules from the dev server into chrome-extension:// pages.
    cors: { origin: [/chrome-extension:\/\//] },
  },
});
