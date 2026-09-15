import type { SavedLocation } from "@/lib/settings";

export const PRAGUE: SavedLocation = {
  name: "Prague",
  country: "Czechia",
  latitude: 50.08804,
  longitude: 14.42076,
};

/** Trimmed real response from /v1/forecast. */
export const FORECAST_RESPONSE = {
  latitude: 50.08,
  longitude: 14.42,
  timezone: "Europe/Prague",
  current: {
    time: "2026-09-15T14:00",
    interval: 900,
    temperature_2m: 21.6,
    weather_code: 2,
    is_day: 1,
  },
  daily: {
    time: ["2026-09-15"],
    temperature_2m_max: [24.8],
    temperature_2m_min: [12.9],
  },
};

/** Trimmed real response from geocoding-api /v1/search. */
export const GEOCODING_RESPONSE = {
  results: [
    {
      id: 3067696,
      name: "Prague",
      latitude: 50.08804,
      longitude: 14.42076,
      country_code: "CZ",
      country: "Czechia",
      timezone: "Europe/Prague",
    },
  ],
  generationtime_ms: 0.61,
};
