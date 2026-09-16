export type Appearance = "auto" | "light" | "dark";
export type TemperatureUnit = "celsius" | "fahrenheit";
export type SearchProvider = "google" | "bing" | "duckduckgo" | "brave"

export type SavedLocation = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type Settings = {
  appearance: Appearance;
  temperatureUnit: TemperatureUnit;
  location: SavedLocation | null;
  searchProvider: SearchProvider;
};

/** All settings live under one key in chrome.storage.sync (small quota: keep it tiny). */
export const SETTINGS_STORAGE_KEY = "settings";
export const SETTINGS_QUERY_KEY = ["settings"] as const;

export const DEFAULT_SETTINGS: Settings = {
  appearance: "auto",
  temperatureUnit: "celsius",
  location: null,
  searchProvider: "duckduckgo"
};

export function mergeWithDefaults(stored: unknown): Settings {
  if (typeof stored !== "object" || stored === null) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(stored as Partial<Settings>) };
}

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
  return mergeWithDefaults(result[SETTINGS_STORAGE_KEY]);
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const next = { ...(await getSettings()), ...patch };
  await chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: next });
  return next;
}
