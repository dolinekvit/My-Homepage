import { describe, expect, it } from "vitest";
import { fetchForecast, geocodeCity, LocationNotFoundError } from "@/features/weather/api";
import { HttpError } from "@/lib/fetch-json";
import { mockFetchJson } from "@/test/fetch";
import { FORECAST_RESPONSE, GEOCODING_RESPONSE, PRAGUE } from "@/test/fixtures/open-meteo";

const PRAGUE_COORDS = { latitude: PRAGUE.latitude, longitude: PRAGUE.longitude };

function requestedUrl(fetchMock: ReturnType<typeof mockFetchJson>): URL {
  return new URL(String(fetchMock.mock.calls[0]?.[0]));
}

describe("fetchForecast", () => {
  it("requests current conditions and today's range for the location and unit", async () => {
    const fetchMock = mockFetchJson(FORECAST_RESPONSE);

    await fetchForecast({ ...PRAGUE_COORDS, unit: "fahrenheit" });

    const url = requestedUrl(fetchMock);
    expect(`${url.origin}${url.pathname}`).toBe("https://api.open-meteo.com/v1/forecast");
    expect(Object.fromEntries(url.searchParams)).toEqual({
      latitude: "50.08804",
      longitude: "14.42076",
      current: "temperature_2m,weather_code,is_day",
      daily: "temperature_2m_max,temperature_2m_min",
      temperature_unit: "fahrenheit",
      timezone: "auto",
      forecast_days: "1",
    });
  });

  it("maps the response to rounded temperatures", async () => {
    mockFetchJson(FORECAST_RESPONSE);

    await expect(fetchForecast({ ...PRAGUE_COORDS, unit: "celsius" })).resolves.toEqual({
      temperature: 22,
      high: 25,
      low: 13,
      code: 2,
      isDay: true,
    });
  });

  it("throws HttpError when the API responds with an error", async () => {
    mockFetchJson({ error: true, reason: "Latitude must be in range" }, 400);

    await expect(fetchForecast({ ...PRAGUE_COORDS, unit: "celsius" })).rejects.toBeInstanceOf(
      HttpError,
    );
  });
});

describe("geocodeCity", () => {
  it("returns the best match as a saved location", async () => {
    const fetchMock = mockFetchJson(GEOCODING_RESPONSE);

    await expect(geocodeCity("  prague ")).resolves.toEqual(PRAGUE);

    const url = requestedUrl(fetchMock);
    expect(`${url.origin}${url.pathname}`).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(url.searchParams.get("name")).toBe("prague");
    expect(url.searchParams.get("count")).toBe("1");
  });

  it("throws LocationNotFoundError carrying the query when nothing matches", async () => {
    mockFetchJson({ generationtime_ms: 0.3 });

    const error = await geocodeCity("Atlantis").catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(LocationNotFoundError);
    expect(error).toMatchObject({ query: "Atlantis" });
  });
});
