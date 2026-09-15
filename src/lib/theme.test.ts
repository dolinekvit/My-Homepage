import { describe, expect, it } from "vitest";
import { APPEARANCE_STORAGE_KEY, applyAppearance } from "@/lib/theme";
import { mockMatchMedia } from "@/test/match-media";

const html = document.documentElement;

describe("applyAppearance", () => {
  it("adds the dark class for Dark and remembers the choice for theme-init.js", () => {
    applyAppearance("dark");

    expect(html).toHaveClass("dark");
    expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("dark");
  });

  it("removes the dark class for Light even when the system is dark", () => {
    mockMatchMedia(true);
    html.classList.add("dark");

    applyAppearance("light");

    expect(html).not.toHaveClass("dark");
  });

  it("follows the system in Auto and reacts until cleaned up", () => {
    const media = mockMatchMedia(true);

    const cleanup = applyAppearance("auto");
    expect(html).toHaveClass("dark");

    media.setMatches(false);
    expect(html).not.toHaveClass("dark");

    cleanup();
    media.setMatches(true);
    expect(html).not.toHaveClass("dark");
  });
});
