import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNow } from "@/lib/useNow";

const START = new Date(2026, 8, 18, 14, 32, 20);
const NEXT_MINUTE = new Date(2026, 8, 18, 14, 33, 0);

describe("useNow", () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: START });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at the current time", () => {
    const { result } = renderHook(() => useNow());

    expect(result.current.getTime()).toBe(START.getTime());
  });

  it("updates at the start of the next minute, not before", async () => {
    const { result } = renderHook(() => useNow());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(39_999);
    });
    expect(result.current.getTime()).toBe(START.getTime());

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(result.current.getTime()).toBe(NEXT_MINUTE.getTime());
  });

  it("stops ticking once unmounted", async () => {
    const { unmount } = renderHook(() => useNow());

    unmount();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(120_000);
    });

    expect(vi.getTimerCount()).toBe(0);
  });
});
