import { skipToken, useQuery } from "@tanstack/react-query";
import { fetchForecast } from "@/features/weather/api";
import type { SavedLocation, TemperatureUnit } from "@/lib/settings";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export function useWeather(location: SavedLocation | null, unit: TemperatureUnit) {
  return useQuery({
    queryKey: ["weather", location?.latitude, location?.longitude, unit],
    // skipToken keeps the query idle (and type-safe) until a location is saved.
    queryFn: location
      ? () => fetchForecast({ latitude: location.latitude, longitude: location.longitude, unit })
      : skipToken,
    staleTime: FIFTEEN_MINUTES,
  });
}
