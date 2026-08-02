import { API_BASE_URL } from "@/lib/constants";
import { getAccessToken } from "@/lib/token";
import { ApiResponse } from "@/types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function extractErrorMessage(body: any, res: Response) {
  return body?.error || body?.message || `Request failed (${res.status})`;
}

/**
 * Normalize the backend envelope { success, statusCode, message, data, meta? }.
 * Paginated endpoints put the array in `data` and `meta` as a top-level sibling,
 * so we re-wrap them into the frontend's Paginated<T> = { data, meta } shape.
 * Non-paginated endpoints just return the raw `data` payload.
 */
function unwrapBody<T>(body: any): T {
  if (!body || typeof body !== "object") return body as T;
  if ("meta" in body && "data" in body) {
    return { data: body.data, meta: body.meta } as T;
  }
  return (body as ApiResponse<T>)?.data;
}

async function parseResponse(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(extractErrorMessage(body, res), res.status);
  }
  return unwrapBody<any>(body);
}

/**
 * Client-side fetcher. Uses the Next.js /api proxy (same-origin) so the
 * browser never hits CORS issues, and attaches the access token as a
 * Bearer header (the backend middleware supports both cookies and headers).
 */
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  return parseResponse(res);
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};

/**
 * Server-component fetcher. Talks straight to the backend (server-to-server,
 * no CORS involved) for public data.
 */
export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(extractErrorMessage(body, res), res.status);
  }
  return unwrapBody<T>(body);
}
