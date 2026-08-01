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

interface ErrorResponse {
  error?: string;
  message?: string;
}

function extractErrorMessage(
  body: ErrorResponse | null,
  res: Response
): string {
  return body?.error ?? body?.message ?? `Request failed (${res.status})`;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const body: ApiResponse<T> | ErrorResponse | null = await res
    .json()
    .catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      extractErrorMessage(body as ErrorResponse | null, res),
      res.status
    );
  }

  return (body as ApiResponse<T>).data;
}

/**
 * Client-side fetcher. Uses the Next.js /api proxy (same-origin)
 * and attaches the access token as a Bearer token.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  return parseResponse<T>(res);
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),

  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "POST",
      body: JSON.stringify(body ?? {}),
    }),

  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "PUT",
      body: JSON.stringify(body ?? {}),
    }),

  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body ?? {}),
    }),

  delete: <T>(path: string) =>
    apiRequest<T>(path, {
      method: "DELETE",
    }),
};

/**
 * Server-side fetcher. Used in Server Components.
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
      ...(options.headers ?? {}),
    },
  });

  const body: ApiResponse<T> | ErrorResponse | null = await res
    .json()
    .catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      extractErrorMessage(body as ErrorResponse | null, res),
      res.status
    );
  }

  return (body as ApiResponse<T>).data;
}