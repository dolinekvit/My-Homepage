import { render, screen } from '@testing-library/react';
import { AddFavoriteButton, FavoriteSite } from './FavoriteSite';
import { createWrapper } from '@/test/query';
import userEvent from '@testing-library/user-event';
import { useSettings } from '@/lib/useSettings';
import { DEFAULT_SETTINGS } from '@/lib/settings';

vi.mock("../../lib/useSettings.ts", { spy: true })

describe(FavoriteSite.name, () => {
  it("should render", () => {
    render(<FavoriteSite name="DuckDuckGo" url="https://duckduckgo.com" />, { wrapper: createWrapper() })

    expect(screen.getByRole('link', { name: /duckduckgo/i })).toBeInTheDocument();
  })

  it("should remove the site from favorites", async () => {
    const user = userEvent.setup();
    const useSettingsMocked = vi.mocked(useSettings);
    const updateSettingsMocked = vi.fn();
    const favoriteSites = [
      { url: "https://duckduckgo.com", name: "DuckDuckGo" },
      { url: "https://github.com", name: "GitHub" },
    ];

    useSettingsMocked.mockImplementation(() => ({
      settings: { ...DEFAULT_SETTINGS, favoriteSites },
      isLoading: false,
      updateSettings: updateSettingsMocked,
    }));

    render(<FavoriteSite name="DuckDuckGo" url="https://duckduckgo.com" />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /remove duckduckgo/i }));

    expect(updateSettingsMocked).toHaveBeenCalledWith({
      favoriteSites: [{ url: "https://github.com", name: "GitHub" }],
    });
  })
})

describe(AddFavoriteButton.name, () => {
  it("should render", () => {
    render(<AddFavoriteButton />, { wrapper: createWrapper() })

    expect(screen.getByRole('button', { name: /add site/i })).toBeInTheDocument()
  })

  it("should open add site popover", async () => {
    const user = userEvent.setup()

    render(<AddFavoriteButton />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: /add site/i }))

    expect(screen.getByRole('dialog', { name: /add new favorite site/i })).toBeInTheDocument()
  })

  it("should update settings with new favorite site", async () => {
    const user = userEvent.setup()
    const useSettingsMocked = vi.mocked(useSettings)
    const updateSettingsMocked = vi.fn()

    useSettingsMocked.mockImplementation(() => ({ settings: {...DEFAULT_SETTINGS }, isLoading: false, updateSettings: updateSettingsMocked }))

    render(<AddFavoriteButton />, { wrapper: createWrapper() })

    await user.click(screen.getByRole('button', { name: /add site/i }))
    await user.type(screen.getByRole('textbox', { name: /site url/i }), "https://duckduckgo.com")
    await user.type(screen.getByRole('textbox', { name: /site name/i }), "DuckDuckGo")
    await user.click(screen.getByRole('button', { name: /^add$/i }))

    expect(updateSettingsMocked).toHaveBeenCalledWith({ favoriteSites: [{ url: "https://duckduckgo.com", name: "DuckDuckGo" }]})
  })
})
