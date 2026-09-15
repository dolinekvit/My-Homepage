import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";
import { installChromeMock } from "@/test/chrome-mock";
import { mockMatchMedia } from "@/test/match-media";

beforeEach(() => {
  installChromeMock();
  mockMatchMedia(false);
  localStorage.clear();
  document.documentElement.className = "";
});
