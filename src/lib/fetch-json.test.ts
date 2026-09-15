import { describe, expect, it } from "vitest";
import { fetchJson, HttpError } from "@/lib/fetch-json";
import { mockFetchJson } from "@/test/fetch";

const URL_UNDER_TEST = "https://example.com/data";

describe("fetchJson", () => {
  it("returns the parsed JSON body", async () => {
    const fetchMock = mockFetchJson({ hello: "world" });

    await expect(fetchJson(URL_UNDER_TEST)).resolves.toEqual({ hello: "world" });
    expect(fetchMock).toHaveBeenCalledWith(URL_UNDER_TEST, undefined);
  });

  it("throws an HttpError with the status and URL for non-2xx responses", async () => {
    mockFetchJson({ reason: "down" }, 503);

    const error = await fetchJson(URL_UNDER_TEST).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ status: 503, url: URL_UNDER_TEST });
  });
});
