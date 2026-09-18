import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalClock } from "@/components/LocalClock";

describe("LocalClock", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date(2026, 8, 18, 14, 32, 20) });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the time and the date", () => {
    render(<LocalClock locales="en-GB" />);

    expect(screen.getByText("14:32")).toBeInTheDocument();
    expect(screen.getByText(/Friday.*18 September/)).toBeInTheDocument();
  });
});
