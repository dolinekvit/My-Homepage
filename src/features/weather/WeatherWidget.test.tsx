import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WeatherWidget } from "@/features/weather/WeatherWidget";
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY, type Settings } from "@/lib/settings";
import { seedStorage } from "@/test/chrome-mock";
import { mockFetchJson, mockFetchPending } from "@/test/fetch";
import { FORECAST_RESPONSE, PRAGUE } from "@/test/fixtures/open-meteo";
import { createWrapper } from "@/test/query";

function renderWidget(settings: Partial<Settings> = {}) {
  seedStorage({ [SETTINGS_STORAGE_KEY]: { ...DEFAULT_SETTINGS, ...settings } });
  return render(<WeatherWidget />, { wrapper: createWrapper() });
}

describe("WeatherWidget", () => {
  it("asks for a location when none is set and opens Settings", async () => {
    const user = userEvent.setup();
    renderWidget();

    await user.click(await screen.findByRole("button", { name: "Set your location in Settings" }));

    expect(chrome.runtime.openOptionsPage).toHaveBeenCalledOnce();
  });

  it("shows a placeholder while the first forecast loads", async () => {
    const fetchMock = mockFetchPending();
    renderWidget({ location: PRAGUE });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    expect(screen.getByRole("region", { name: "Weather" })).toHaveAttribute("aria-busy", "true");
  });

  it("shows the current weather for the saved location", async () => {
    mockFetchJson(FORECAST_RESPONSE);
    renderWidget({ location: PRAGUE });

    expect(await screen.findByText("22°")).toBeInTheDocument();
    expect(screen.getByText("Prague")).toBeInTheDocument();
    expect(screen.getByText("Partly Cloudy")).toBeInTheDocument();
    expect(screen.getByText("H:25° L:13°")).toBeInTheDocument();
  });

  it("offers a retry when the forecast can't be loaded", async () => {
    const user = userEvent.setup();
    mockFetchJson({ error: true }, 500);
    renderWidget({ location: PRAGUE });

    expect(await screen.findByText("Weather is unavailable right now.")).toBeInTheDocument();

    mockFetchJson(FORECAST_RESPONSE);
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("22°")).toBeInTheDocument();
  });
});
