import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetCard } from "@/components/WidgetCard";
import { useWeather } from "@/features/weather/useWeather";
import { describeWeather } from "@/features/weather/weather-codes";
import { ELEVATION } from "@/lib/styles";
import { useSettings } from "@/lib/useSettings";
import { cn } from "@/lib/utils";

const CARD = cn("w-64", ELEVATION);

export function WeatherWidget() {
  const { settings, isLoading } = useSettings();
  const { location, temperatureUnit } = settings;
  const weather = useWeather(location, temperatureUnit);

  if (isLoading) return <WeatherPlaceholder />;

  if (location === null) {
    return (
      <WidgetCard aria-label="Weather" className={cn(CARD, "flex flex-col items-start gap-1")}>
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

  if (weather.data) {
    const { temperature, high, low, code, isDay } = weather.data;
    const { label, icon: Icon } = describeWeather(code, isDay);

    return (
      <WidgetCard aria-label="Weather" className={cn(CARD, "flex flex-col gap-6")}>
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate text-base font-medium">{location.name}</p>
          <p className="font-heading text-4xl leading-none font-extralight tracking-tight">
            {temperature}°
          </p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <Icon aria-hidden className="size-5 text-primary" strokeWidth={1.75} />
            <p className="text-sm font-medium">{label}</p>
          </div>
          <p className="text-sm text-muted-foreground">{`H:${high}° L:${low}°`}</p>
        </div>
      </WidgetCard>
    );
  }

  if (weather.isError) {
    return (
      <WidgetCard aria-label="Weather" className={cn(CARD, "flex flex-col items-start gap-2")}>
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
    <WidgetCard aria-label="Weather" aria-busy="true" className={CARD}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-6 h-8 w-20" />
      <Skeleton className="mt-6 h-4 w-32" />
    </WidgetCard>
  );
}
