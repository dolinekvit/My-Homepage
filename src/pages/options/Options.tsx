import type { ReactNode } from "react";
import { SegmentedControl, type SegmentedOption } from "@/components/SegmentedControl";
import { LocationSetting } from "@/features/weather/LocationSetting";
import type { Appearance, TemperatureUnit } from "@/lib/settings";
import { useSettings } from "@/lib/useSettings";

const APPEARANCE_OPTIONS: readonly SegmentedOption<Appearance>[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const TEMPERATURE_OPTIONS: readonly SegmentedOption<TemperatureUnit>[] = [
  { value: "celsius", label: "°C" },
  { value: "fahrenheit", label: "°F" },
];

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-sm font-semibold">{title}</h2>
      <div className="divide-y divide-border rounded-xl bg-card shadow-xs ring-1 ring-border">
        {children}
      </div>
    </section>
  );
}

function SettingsRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 px-4 py-2.5">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

export function Options() {
  const { settings, isLoading, updateSettings } = useSettings();
  if (isLoading) return null;

  return (
    <main className="mx-auto max-w-xl space-y-8 px-6 py-12">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Settings</h1>

      <SettingsGroup title="General">
        <SettingsRow label="Appearance">
          <SegmentedControl
            label="Appearance"
            value={settings.appearance}
            options={APPEARANCE_OPTIONS}
            onChange={(appearance) => updateSettings({ appearance })}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Weather">
        <SettingsRow label="Location">
          <LocationSetting />
        </SettingsRow>
        <SettingsRow label="Temperature">
          <SegmentedControl
            label="Temperature unit"
            value={settings.temperatureUnit}
            options={TEMPERATURE_OPTIONS}
            onChange={(temperatureUnit) => updateSettings({ temperatureUnit })}
          />
        </SettingsRow>
      </SettingsGroup>
    </main>
  );
}
