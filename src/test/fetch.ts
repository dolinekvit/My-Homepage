import { vi } from "vitest";

/** Stubs global fetch to answer every request with this JSON body and status. */
export function mockFetchJson(body: unknown, status = 200) {
  const fetchMock = vi.fn<typeof fetch>(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** Stubs global fetch with requests that never settle, to observe loading states. */
export function mockFetchPending() {
  const fetchMock = vi.fn<typeof fetch>(() => new Promise<Response>(() => {}));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
