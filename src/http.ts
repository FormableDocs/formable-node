import { FormableError } from "./error";

export const DEFAULT_BASE_URL = "https://api.formabledocs.com/v1";

export interface FormableOptions {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
}

type Query = Record<string, string | undefined>;

interface RequestOptions {
  query?: Query | undefined;
  body?: unknown;
  form?: FormData | undefined;
}

export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchFn: typeof globalThis.fetch;

  constructor({ apiKey, baseUrl, fetch: fetchFn }: FormableOptions) {
    if (!apiKey) {
      throw new Error("Formable API key is required");
    }
    this.apiKey = apiKey;
    this.baseUrl = (baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.fetchFn = fetchFn ?? globalThis.fetch;
  }

  get = <T>(path: string, query?: Query): Promise<T> =>
    this.request<T>("GET", path, { query });

  post = <T>(path: string, body?: unknown): Promise<T> =>
    this.request<T>("POST", path, { body });

  put = <T>(path: string, body?: unknown): Promise<T> =>
    this.request<T>("PUT", path, { body });

  postForm = <T>(path: string, form: FormData): Promise<T> =>
    this.request<T>("POST", path, { form });

  private request = async <T>(
    method: string,
    path: string,
    { query, body, form }: RequestOptions = {}
  ): Promise<T> => {
    const url = new URL(this.baseUrl + path);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, value);
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
    };
    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await this.fetchFn(url, {
      method,
      headers,
      body: form ?? (body !== undefined ? JSON.stringify(body) : null),
    });

    const data = parseJson(await response.text());
    if (!response.ok) {
      const message =
        (data as { error?: string } | undefined)?.error ??
        `Request failed with status ${response.status}`;
      throw new FormableError(message, response.status, data);
    }
    return data as T;
  };
}

const parseJson = (text: string): unknown => {
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
