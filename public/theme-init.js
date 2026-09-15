// Runs before first paint (classic, render-blocking script) so a saved Light/Dark choice never
// flashes the wrong theme. Keep in sync with applyAppearance() in src/lib/theme.ts.
(function () {
  var appearance = "auto";
  try {
    appearance = localStorage.getItem("my-homepage:appearance") || "auto";
  } catch {
    // localStorage unavailable; fall back to following the system.
  }
  var dark =
    appearance === "dark" ||
    (appearance === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
})();
