import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  getSettings,
  SETTINGS_STORAGE_KEY,
  updateSettings,
} from "@/lib/settings";
import { readStorage, seedStorage } from "@/test/chrome-mock";

describe("getSettings", () => {
  it("returns the defaults when nothing is stored", async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("merges stored values over the defaults so newly added settings get defaults", async () => {
    seedStorage({ [SETTINGS_STORAGE_KEY]: { temperatureUnit: "fahrenheit" } });

    expect(await getSettings()).toEqual({ ...DEFAULT_SETTINGS, temperatureUnit: "fahrenheit" });
  });

  it("falls back to the defaults when the stored value is not an object", async () => {
    seedStorage({ [SETTINGS_STORAGE_KEY]: "corrupt" });

    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});

describe("updateSettings", () => {
  it("merges the patch into the stored settings, saves and returns the result", async () => {
    seedStorage({ [SETTINGS_STORAGE_KEY]: { appearance: "dark" } });

    const saved = await updateSettings({ temperatureUnit: "fahrenheit" });

    expect(saved).toEqual({
      ...DEFAULT_SETTINGS,
      appearance: "dark",
      temperatureUnit: "fahrenheit",
    });
    expect(readStorage(SETTINGS_STORAGE_KEY)).toEqual(saved);
  });
});
