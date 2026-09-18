import { vi } from "vitest";

type StorageListener = (
  changes: Record<string, chrome.storage.StorageChange>,
  areaName: string,
) => void;

let store: Record<string, unknown> = {};
let listeners = new Set<StorageListener>();

function pick(keys?: string | string[] | null): Record<string, unknown> {
  if (keys == null) return structuredClone(store);
  const list = Array.isArray(keys) ? keys : [keys];
  return Object.fromEntries(
    list.filter((key) => key in store).map((key) => [key, structuredClone(store[key])]),
  );
}

/** Installs an in-memory `chrome` global covering the APIs this extension uses. */
export function installChromeMock(): void {
  store = {};
  listeners = new Set();

  vi.stubGlobal("chrome", {
    storage: {
      sync: {
        get: vi.fn(async (keys?: string | string[] | null) => pick(keys)),
        set: vi.fn(async (items: Record<string, unknown>) => {
          const changes: Record<string, chrome.storage.StorageChange> = {};
          for (const [key, value] of Object.entries(items)) {
            changes[key] = { oldValue: store[key], newValue: structuredClone(value) };
            store[key] = structuredClone(value);
          }
          listeners.forEach((listener) => listener(changes, "sync"));
        }),
      },
      onChanged: {
        addListener: vi.fn((listener: StorageListener) => {
          listeners.add(listener);
        }),
        removeListener: vi.fn((listener: StorageListener) => {
          listeners.delete(listener);
        }),
      },
    },
    runtime: {
      openOptionsPage: vi.fn(async () => {}),
      getManifest: vi.fn(() => ({ version: "0.0.0-test" })),
      getURL: vi.fn((path: string) => `chrome-extension://test-extension-id${path}`),
    },
  });
}

/** Puts values into storage without firing change events, as if saved in an earlier session. */
export function seedStorage(items: Record<string, unknown>): void {
  Object.assign(store, structuredClone(items));
}

export function readStorage(key: string): unknown {
  return structuredClone(store[key]);
}
