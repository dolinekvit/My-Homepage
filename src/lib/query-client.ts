import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import type { PersistQueryClientProviderProps } from "@tanstack/react-query-persist-client";
import { SETTINGS_QUERY_KEY } from "@/lib/settings";

const ONE_DAY = 24 * 60 * 60 * 1000;

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        // Must be at least the persister's maxAge, or restored data is garbage-collected at once.
        gcTime: ONE_DAY,
        refetchOnWindowFocus: true,
      },
    },
  });
}

/**
 * Every new tab is a fresh page with an empty cache. Persisting to localStorage lets a new tab
 * paint the last data instantly and refresh only what is stale.
 */
export function createPersistOptions(): PersistQueryClientProviderProps["persistOptions"] {
  return {
    persister: createAsyncStoragePersister({
      storage: window.localStorage,
      key: "my-homepage:query-cache",
    }),
    maxAge: ONE_DAY,
    buster: chrome.runtime.getManifest().version,
    dehydrateOptions: {
      // chrome.storage.sync stays the only source of truth for settings.
      shouldDehydrateQuery: (query) =>
        query.state.status === "success" && query.queryKey[0] !== SETTINGS_QUERY_KEY[0],
    },
  };
}
