import { fetchJson } from "@/lib/fetch-json";
import type { SavedLocation, TemperatureUnit } from "@/lib/settings";

export type Weather = {
  temperature: number;
  high: number;
  low: number;
  /** WMO weather interpretation code; see weather-codes.ts. */
  code: number;
  isDay: boolean;
};

export class LocationNotFoundError extends Error {
  readonly query: string;

  constructor(query: string) {
    super(`No place found for "${query}"`);
    this.name = "LocationNotFoundError";
    this.query = query;
  }
}

type ForecastResponse = {
  current: { temperature_2m: number; weather_code: number; is_day: number };
  daily: { temperature_2m_max: number[]; temperature_2m_min: number[] };
};

type GeocodingResponse = {
  results?: { name: string; country?: string; latitude: number; longitude: number }[];
};

export async function fetchForecast({
  latitude,
  longitude,
  unit,
}: {
  latitude: number;
  longitude: number;
  unit: TemperatureUnit;
}): Promise<Weather> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,weather_code,is_day",
    daily: "temperature_2m_max,temperature_2m_min",
    temperature_unit: unit,
    timezone: "auto",
    forecast_days: "1",
  }).toString();

  const { current, daily } = await fetchJson<ForecastResponse>(url);
  return {
    temperature: Math.round(current.temperature_2m),
    high: Math.round(daily.temperature_2m_max[0] ?? current.temperature_2m),
    low: Math.round(daily.temperature_2m_min[0] ?? current.temperature_2m),
    code: current.weather_code,
    isDay: current.is_day === 1,
  };
}

export async function geocodeCity(query: string): Promise<SavedLocation> {
  const name = query.trim();
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({ name, count: "1", language: "en", format: "json" }).toString();

  const { results } = await fetchJson<GeocodingResponse>(url);
  const match = results?.[0];
  if (!match) throw new LocationNotFoundError(name);

  return {
    name: match.name,
    country: match.country ?? "",
    latitude: match.latitude,
    longitude: match.longitude,
  };
}
