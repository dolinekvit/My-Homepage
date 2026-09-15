/** Replaces window.matchMedia (missing in jsdom) with a controllable dark-mode query. */
export function mockMatchMedia(initialMatches = false): { setMatches(next: boolean): void } {
  let matches = initialMatches;
  const listeners = new Set<() => void>();
  const mediaQueryList = {
    get matches() {
      return matches;
    },
    media: "(prefers-color-scheme: dark)",
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  };

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => mediaQueryList,
  });

  return {
    setMatches(next) {
      matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}
