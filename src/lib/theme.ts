import type { Appearance } from "@/lib/settings";

/** Read synchronously by public/theme-init.js before first paint. */
export const APPEARANCE_STORAGE_KEY = "my-homepage:appearance";

/** Applies the appearance to <html> and returns a cleanup that stops following the system. */
export function applyAppearance(appearance: Appearance): () => void {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const update = () => {
    const dark = appearance === "dark" || (appearance === "auto" && systemDark.matches);
    document.documentElement.classList.toggle("dark", dark);
  };

  update();
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
  } catch {
    // Storage unavailable: theme-init.js falls back to Auto on the next load.
  }

  if (appearance !== "auto") return () => {};
  systemDark.addEventListener("change", update);
  return () => systemDark.removeEventListener("change", update);
}
