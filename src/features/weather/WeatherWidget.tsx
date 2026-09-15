import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "@/components/WidgetCard";
import { useWeather } from "@/features/weather/useWeather";
import { describeWeather } from "@/features/weather/weather-codes";
import { useSettings } from "@/lib/useSettings";

export function WeatherWidget() {
  const { settings, isLoading } = useSettings();
  const { location, temperatureUnit } = settings;
  const weather = useWeather(location, temperatureUnit);

  if (isLoading) return <WeatherPlaceholder />;

  if (location === null) {
    return (
      <WidgetCard aria-label="Weather" className="flex flex-col items-start gap-1">
        <p className="text-sm text-muted-foreground">Weather for your city will appear here.</p>
        <Button
          variant="link"
          className="h-auto p-0"
          onClick={() => void chrome.runtime.openOptionsPage()}
        >
          Set your location in Settings
        </Button>
      </WidgetCard>
    );
  }

  // Cached data wins over errors: a failed background refresh keeps the last forecast visible.
  if (weather.data) {
    const { temperature, high, low, code, isDay } = weather.data;
    const { label, icon: Icon } = describeWeather(code, isDay);

    return (
      <WidgetCard aria-label="Weather">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">{location.name}</p>
            <p className="font-heading text-6xl font-extralight tracking-tight">{temperature}°</p>
          </div>
          <Icon aria-hidden className="mt-1 size-9 text-primary" strokeWidth={1.5} />
        </div>
        <p className="mt-2 text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{`H:${high}° L:${low}°`}</p>
      </WidgetCard>
    );
  }

  if (weather.isError) {
    return (
      <WidgetCard aria-label="Weather" className="flex flex-col items-start gap-2">
        <p className="text-sm font-medium">{location.name}</p>
        <p className="text-sm text-muted-foreground">Weather is unavailable right now.</p>
        <Button
          variant="secondary"
          size="sm"
          disabled={weather.isFetching}
          onClick={() => void weather.refetch()}
        >
          <RefreshCw />
          Retry
        </Button>
      </WidgetCard>
    );
  }

  return <WeatherPlaceholder />;
}

function WeatherPlaceholder() {
  return (
    <WidgetCard aria-label="Weather" aria-busy="true">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-14 w-28" />
      <Skeleton className="mt-3 h-4 w-32" />
    </WidgetCard>
  );
}
