import { useMutation, useQueryClient } from "@tanstack/react-query";
import { geocodeCity } from "@/features/weather/api";
import { SETTINGS_QUERY_KEY, updateSettings } from "@/lib/settings";

/** Resolves a typed city to coordinates and saves it, so the new tab never has to guess. */
export function useSetLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (city: string) => updateSettings({ location: await geocodeCity(city) }),
    onSuccess: (settings) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, settings);
    },
  });
}
