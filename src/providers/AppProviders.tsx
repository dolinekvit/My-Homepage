import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useEffect, useState, type ReactNode } from "react";
import { createPersistOptions, createQueryClient } from "@/lib/query-client";
import { applyAppearance } from "@/lib/theme";
import { useSettings, useSettingsSync } from "@/lib/useSettings";

function SettingsEffects() {
  useSettingsSync();
  const { settings, isLoading } = useSettings();

  useEffect(() => {
    // Wait for real settings; applying the defaults first would flash and overwrite the mirror.
    if (isLoading) return;
    return applyAppearance(settings.appearance);
  }, [isLoading, settings.appearance]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  const [persistOptions] = useState(createPersistOptions);

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <SettingsEffects />
      {children}
    </PersistQueryClientProvider>
  );
}
