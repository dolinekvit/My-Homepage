import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

export type WeatherCondition = { label: string; icon: LucideIcon };

/** Maps a WMO weather interpretation code (as returned by Open-Meteo) to a label and icon. */
export function describeWeather(code: number, isDay: boolean): WeatherCondition {
  if (code === 0) return { label: "Clear", icon: isDay ? Sun : Moon };
  if (code === 1) return { label: "Mostly Clear", icon: isDay ? CloudSun : CloudMoon };
  if (code === 2) return { label: "Partly Cloudy", icon: isDay ? CloudSun : CloudMoon };
  if (code === 3) return { label: "Cloudy", icon: Cloud };
  if (code === 45 || code === 48) return { label: "Fog", icon: CloudFog };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: CloudDrizzle };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return { label: "Rain", icon: CloudRain };
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return { label: "Snow", icon: CloudSnow };
  }
  if (code === 95) return { label: "Thunderstorm", icon: CloudLightning };
  if (code === 96 || code === 99) return { label: "Thunderstorm with Hail", icon: CloudHail };
  return { label: "Unknown", icon: Cloud };
}
