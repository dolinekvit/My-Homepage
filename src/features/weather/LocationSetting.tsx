import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationNotFoundError } from "@/features/weather/api";
import { useSetLocation } from "@/features/weather/useSetLocation";
import type { SavedLocation } from "@/lib/settings";
import { useSettings } from "@/lib/useSettings";
import { cn } from "@/lib/utils";

function describeStatus(error: Error | null, location: SavedLocation | null): string {
  if (error instanceof LocationNotFoundError) return `No place found for "${error.query}"`;
  if (error) return "Couldn't look up that place. Try again.";
  if (location) return [location.name, location.country].filter(Boolean).join(", ");
  return "Not set";
}

export function LocationSetting() {
  const { settings } = useSettings();
  const setLocation = useSetLocation();
  const [city, setCity] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (city.trim() === "") return;
    setLocation.mutate(city, { onSuccess: () => setCity("") });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-end gap-1.5">
      <div className="flex gap-2">
        <Input
          aria-label="City"
          placeholder="City"
          value={city}
          onChange={(event) => {
            setCity(event.target.value);
            if (setLocation.isError) setLocation.reset();
          }}
          className="w-44"
        />
        <Button type="submit" disabled={setLocation.isPending}>
          Save
        </Button>
      </div>
      <p
        aria-live="polite"
        className={cn(
          "text-xs",
          setLocation.isError ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {describeStatus(setLocation.error, settings.location)}
      </p>
    </form>
  );
}
