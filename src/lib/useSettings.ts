import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  DEFAULT_SETTINGS,
  getSettings,
  mergeWithDefaults,
  SETTINGS_QUERY_KEY,
  SETTINGS_STORAGE_KEY,
  updateSettings,
  type Settings,
} from "@/lib/settings";

/** Settings from chrome.storage.sync, cached in react-query as the single source of truth. */
export function useSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSettings,
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });
      const previous = queryClient.getQueryData<Settings>(SETTINGS_QUERY_KEY);
      queryClient.setQueryData<Settings>(SETTINGS_QUERY_KEY, {
        ...(previous ?? DEFAULT_SETTINGS),
        ...patch,
      });
      return { previous };
    },
    onError: (error, _patch, context) => {
      console.error("Failed to save settings", error);
      if (context?.previous) queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previous);
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, saved);
    },
  });

  return {
    settings: query.data ?? DEFAULT_SETTINGS,
    isLoading: query.isPending,
    updateSettings: mutation.mutate,
  };
}

/** Keeps every open page in sync when settings change anywhere (e.g. in the settings tab). */
export function useSettingsSync(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const listener = (changes: Record<string, chrome.storage.StorageChange>, areaName: string) => {
      const change = changes[SETTINGS_STORAGE_KEY];
      if (areaName !== "sync" || !change) return;
      queryClient.setQueryData(SETTINGS_QUERY_KEY, mergeWithDefaults(change.newValue));
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [queryClient]);
}
