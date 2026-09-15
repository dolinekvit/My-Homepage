# My Homepage

A calm, Apple-style new tab page for Chromium browsers (Chrome, Arc, Edge, Brave), built with React.

- **New tab override:** `src/pages/newtab`
- **Settings page**, opened in its own tab: `src/pages/options`
- **Weather widget** example using [Open-Meteo](https://open-meteo.com) (no API key)

## Stack

Vite 8 + [CRXJS](https://crxjs.dev) · React 19 · TypeScript 6 · TanStack Query 5 (cache persisted
to `localStorage`) · Tailwind CSS 4 · shadcn/ui · Vitest + Testing Library · ESLint · Prettier

## Getting started

Requirements: Node 24 and pnpm 11.

```bash
pnpm install
pnpm dev
```

Then load the extension once:

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose the `dist/` folder.
3. Open a new tab. If Chrome asks whether to keep the changed new tab page, choose **Keep it**.

While `pnpm dev` runs, edits to the pages update instantly. After changing
`manifest.config.ts`, reload the extension on `chrome://extensions`.

For a production build, run `pnpm build` and load `dist/` the same way.

## Scripts

| Script                              | What it does                                                            |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`                          | Dev server with instant updates; writes a loadable extension to `dist/` |
| `pnpm build`                        | Type-check, then production build into `dist/`                          |
| `pnpm typecheck`                    | `tsc --noEmit`                                                          |
| `pnpm lint`                         | ESLint                                                                  |
| `pnpm format` / `pnpm format:check` | Prettier, with Tailwind class sorting                                   |
| `pnpm test` / `pnpm test:watch`     | Vitest                                                                  |

## Project structure

```text
manifest.config.ts       Extension manifest (becomes dist/manifest.json)
public/                  Copied as-is: icons, theme-init.js
src/
  pages/newtab/          New tab page: HTML entry, React root, layout
  pages/options/         Settings page
  features/<name>/       One folder per widget: API calls, hooks, components, settings rows
  components/            Shared components: WidgetCard, WidgetBoundary, SegmentedControl
  components/ui/         shadcn/ui components (generated; excluded from Prettier)
  lib/                   Settings, query client, fetch helper, theme
  providers/             AppProviders, shared by both pages
  styles/globals.css     Tailwind, Apple theme tokens, glass and wallpaper utilities
  test/                  Test setup, chrome/fetch mocks, fixtures
```

## How it works

- **Settings** live in `chrome.storage.sync` (`src/lib/settings.ts`) and are read through
  `useSettings()`. Changes made in the settings tab reach every open new tab via
  `chrome.storage.onChanged`.
- **Data fetching** uses TanStack Query. The cache is persisted to `localStorage`, so a new tab
  shows the last data immediately and refreshes it in the background once it is stale. Settings are
  never stored in that cache.
- **Appearance** (Auto / Light / Dark) toggles the `dark` class on `<html>`.
  `public/theme-init.js` applies the saved choice before first paint. A small plugin in
  `vite.config.ts` adds that script to production builds only: in dev, CRXJS would load it as a
  module, which Vite refuses for `public/` files. So a brief theme flash is possible in dev only.

## Adding a widget

1. Create `src/features/<name>/` with:
   - `api.ts`: fetch functions built on `fetchJson()` from `@/lib/fetch-json`
   - `use<Name>.ts`: a `useQuery` hook with a `staleTime` that suits the data
   - `<Name>Widget.tsx`: renders inside `WidgetCard` and handles its loading, error and data
     states
2. If it calls a new host, add it to `host_permissions` in `manifest.config.ts`.
3. If it needs settings, add fields and defaults to `Settings` in `src/lib/settings.ts` and a row
   in `src/pages/options/Options.tsx`.
4. Add it to the grid in `src/pages/newtab/NewTab.tsx`, wrapped in `<WidgetBoundary name="…">`.
5. Put tests next to the files; `src/features/weather/*.test.ts(x)` shows the patterns.

## Adding shadcn/ui components

```bash
pnpm dlx shadcn@latest add <component>
```

Components pick up the Apple look from the tokens in `src/styles/globals.css`.
