import { apiErrorFromResponse, apiNetworkError } from "./api-client-errors";

export type RequestOptions = Omit<RequestInit, "credentials">;
const localeStorageKey = "qitu.locale";
const localeHeaderName = "x-qitu-locale";

export {
  ApiRequestError,
  apiErrorFromResponse,
  apiNetworkError,
  type ApiErrorIssue,
} from "./api-client-errors";

export async function apiJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  if (import.meta.env.VITE_QITU_API_MODE === "mock") {
    const { handleMockApiRequest } = await import("./mock-api");
    return handleMockApiRequest<T>(url, options);
  }

  const headers = new Headers(options.headers);
  const locale = readLocalePreference();
  if (locale && !headers.has(localeHeaderName)) {
    headers.set(localeHeaderName, locale);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw apiNetworkError();
  }

  if (!response.ok) {
    throw await apiErrorFromResponse(response);
  }

  return response.json() as Promise<T>;
}

export function withSearch(path: string, search: URLSearchParams): string {
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

function readLocalePreference(): string | null {
  return window.localStorage.getItem(localeStorageKey);
}
