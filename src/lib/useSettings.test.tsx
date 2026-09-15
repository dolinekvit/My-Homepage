import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "@/lib/settings";
import { useSettings, useSettingsSync } from "@/lib/useSettings";
import { readStorage } from "@/test/chrome-mock";
import { createWrapper } from "@/test/query";

function renderSettings() {
  return renderHook(
    () => {
      useSettingsSync();
      return useSettings();
    },
    { wrapper: createWrapper() },
  );
}

// react-query notifies React on a batched timeout, so cache changes are awaited with waitFor.
describe("useSettings", () => {
  it("loads the defaults on first run", async () => {
    const { result } = renderSettings();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it("updates optimistically, before the storage write finishes", async () => {
    const { result } = renderSettings();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    vi.mocked(chrome.storage.sync.set).mockImplementationOnce(() => new Promise(() => {}));

    act(() => result.current.updateSettings({ temperatureUnit: "fahrenheit" }));

    await waitFor(() => expect(result.current.settings.temperatureUnit).toBe("fahrenheit"));
    expect(readStorage(SETTINGS_STORAGE_KEY)).toBeUndefined();
  });

  it("saves updates to chrome.storage.sync", async () => {
    const { result } = renderSettings();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.updateSettings({ temperatureUnit: "fahrenheit" }));

    await waitFor(() =>
      expect(readStorage(SETTINGS_STORAGE_KEY)).toMatchObject({ temperatureUnit: "fahrenheit" }),
    );
  });

  it("picks up settings saved by another tab", async () => {
    const { result } = renderSettings();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: { appearance: "dark" } }));

    await waitFor(() =>
      expect(result.current.settings).toEqual({ ...DEFAULT_SETTINGS, appearance: "dark" }),
    );
  });
});
