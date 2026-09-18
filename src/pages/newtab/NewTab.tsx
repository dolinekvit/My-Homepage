import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WidgetBoundary } from "@/components/WidgetBoundary";
import { WeatherWidget } from "@/features/weather/WeatherWidget";
import { useSettings } from "@/lib/useSettings";
import { SearchBar } from "@/components/search-bar/SearchBar";
import { FavoriteSites } from '@/components/favorite-site/FavoriteSites';

export function NewTab() {
  const { isLoading } = useSettings();

  return (
    <div className="min-h-dvh wallpaper">
      <header className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Open settings"
          className="rounded-full glass"
          // Called from a new tab page, Chrome turns this tab into Settings (no extra tab).
          onClick={() => void chrome.runtime.openOptionsPage()}
        >
          <SettingsIcon />
        </Button>
      </header>

      {!isLoading && (
        <main className="mx-auto grid max-w-5xl grid-cols-[1fr_2fr] gap-4 px-6 pt-[12vh]">
          <WidgetBoundary name="Weather">
            <WeatherWidget />
          </WidgetBoundary>
          <div className="flex flex-col gap-8">
            <WidgetBoundary name="Search">
              <SearchBar />
            </WidgetBoundary>
            <WidgetBoundary name="Favorite sites">
              <FavoriteSites />
            </WidgetBoundary>
          </div>
        </main>
      )}
    </div>
  );
}
