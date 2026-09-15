import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LocationSetting } from "@/features/weather/LocationSetting";
import { SETTINGS_STORAGE_KEY } from "@/lib/settings";
import { readStorage } from "@/test/chrome-mock";
import { mockFetchJson } from "@/test/fetch";
import { GEOCODING_RESPONSE, PRAGUE } from "@/test/fixtures/open-meteo";
import { createWrapper } from "@/test/query";

async function submitCity(city: string) {
  const user = userEvent.setup();
  render(<LocationSetting />, { wrapper: createWrapper() });
  await user.type(screen.getByRole("textbox", { name: "City" }), city);
  await user.click(screen.getByRole("button", { name: "Save" }));
}

describe("LocationSetting", () => {
  it("shows that no location is set yet", async () => {
    render(<LocationSetting />, { wrapper: createWrapper() });

    expect(await screen.findByText("Not set")).toBeInTheDocument();
  });

  it("looks up the city, saves it and shows the resolved place", async () => {
    mockFetchJson(GEOCODING_RESPONSE);

    await submitCity("prague");

    expect(await screen.findByText("Prague, Czechia")).toBeInTheDocument();
    expect(readStorage(SETTINGS_STORAGE_KEY)).toMatchObject({ location: PRAGUE });
    expect(screen.getByRole("textbox", { name: "City" })).toHaveValue("");
  });

  it("explains when no place matches and leaves settings untouched", async () => {
    mockFetchJson({ generationtime_ms: 0.2 });

    await submitCity("Atlantis");

    expect(await screen.findByText('No place found for "Atlantis"')).toBeInTheDocument();
    expect(readStorage(SETTINGS_STORAGE_KEY)).toBeUndefined();
  });

  it("asks to try again when the lookup fails", async () => {
    mockFetchJson({ error: true }, 500);

    await submitCity("Prague");

    expect(await screen.findByText("Couldn't look up that place. Try again.")).toBeInTheDocument();
  });
});
