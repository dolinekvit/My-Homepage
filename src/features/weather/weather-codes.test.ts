import { Cloud, CloudMoon, CloudRain, Moon, Sun } from "lucide-react";
import { describe, expect, it } from "vitest";
import { describeWeather } from "@/features/weather/weather-codes";

describe("describeWeather", () => {
  it("uses a sun by day and a moon by night for clear skies", () => {
    expect(describeWeather(0, true)).toEqual({ label: "Clear", icon: Sun });
    expect(describeWeather(0, false)).toEqual({ label: "Clear", icon: Moon });
  });

  it("uses day and night variants for partly cloudy skies", () => {
    expect(describeWeather(2, false)).toEqual({ label: "Partly Cloudy", icon: CloudMoon });
  });

  it.each([61, 63, 65, 80, 82])("groups WMO code %i as rain", (code) => {
    expect(describeWeather(code, true)).toEqual({ label: "Rain", icon: CloudRain });
  });

  it("falls back to a neutral description for unknown codes", () => {
    expect(describeWeather(1234, true)).toEqual({ label: "Unknown", icon: Cloud });
  });
});
