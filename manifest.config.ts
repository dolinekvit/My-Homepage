import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json" with { type: "json" };

export default defineManifest({
  manifest_version: 3,
  name: "My Homepage",
  description: "A calm, Apple-style new tab page.",
  version: pkg.version,
  icons: {
    16: "icons/icon-16.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  },
  chrome_url_overrides: {
    newtab: "src/pages/newtab/index.html",
  },
  options_ui: {
    page: "src/pages/options/index.html",
    open_in_tab: true,
  },
  permissions: ["storage", "favicon"],
  // Open-Meteo sends CORS headers, so these aren't strictly required; they document every host
  // the extension talks to and keep the pattern ready for APIs without CORS.
  host_permissions: ["https://api.open-meteo.com/*", "https://geocoding-api.open-meteo.com/*"],
});
