import { Settings as SettingsIcon } from "lucide-react";
import { FavoriteSites } from "@/components/favorite-site/FavoriteSites";
import { LocalClock } from "@/components/LocalClock";
import { SearchBar } from "@/components/search-bar/SearchBar";
import { Button } from "@/components/ui/button";
import { WidgetBoundary } from "@/components/WidgetBoundary";
import { WeatherWidget } from "@/features/weather/WeatherWidget";
import { ELEVATION } from "@/lib/styles";
import { useSettings } from "@/lib/useSettings";
import { cn } from "@/lib/utils";

export function NewTab() {
  const { isLoading } = useSettings();

  return (
    <div className="relative min-h-dvh wallpaper">
      <Button
        variant="ghost"
        size="icon-lg"
        aria-label="Open settings"
        className={cn("absolute top-6 right-6 rounded-full glass", ELEVATION)}
        onClick={() => void chrome.runtime.openOptionsPage()}
      >
        <SettingsIcon />
      </Button>

      {!isLoading && (
        <>
          <div className="flex w-64 flex-col gap-4 px-6 pt-6 lg:absolute lg:top-6 lg:left-6 lg:px-0 lg:pt-0">
            <WidgetBoundary name="Weather">
              <WeatherWidget />
            </WidgetBoundary>
          </div>

          <main className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-9 px-6 py-16 lg:min-h-dvh">
            <LocalClock />
            <div className="w-full max-w-2xl">
              <WidgetBoundary name="Search">
                <SearchBar />
              </WidgetBoundary>
            </div>
            <WidgetBoundary name="Favorite sites">
              <FavoriteSites />
            </WidgetBoundary>
          </main>
        </>
      )}
    </div>
  );
}
