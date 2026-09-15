import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { createPersistOptions } from "@/lib/query-client";

describe("createPersistOptions", () => {
  it("discards the persisted cache when the extension version changes", () => {
    expect(createPersistOptions().buster).toBe("0.0.0-test");
  });

  it("persists successful queries except settings", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await client.prefetchQuery({ queryKey: ["weather"], queryFn: async () => ({ temp: 20 }) });
    await client.prefetchQuery({ queryKey: ["settings"], queryFn: async () => ({}) });
    await client.prefetchQuery({
      queryKey: ["broken"],
      queryFn: async () => {
        throw new Error("offline");
      },
    });

    const { dehydrateOptions } = createPersistOptions();
    const persisted = client
      .getQueryCache()
      .getAll()
      .filter((query) => dehydrateOptions?.shouldDehydrateQuery?.(query))
      .map((query) => query.queryKey[0]);

    expect(persisted).toEqual(["weather"]);
  });
});
