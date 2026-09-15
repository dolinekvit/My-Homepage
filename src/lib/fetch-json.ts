export class HttpError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(status: number, url: string) {
    super(`Request failed with status ${status}: ${url}`);
    this.name = "HttpError";
    this.status = status;
    this.url = url;
  }
}

/** fetch() that throws HttpError for non-2xx responses and parses the JSON body otherwise. */
export async function fetchJson<T>(url: string | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new HttpError(response.status, String(url));
  return (await response.json()) as T;
}
