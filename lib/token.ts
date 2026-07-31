import { AuthTokens, JwtPayload } from "@/app/types";

export const AUTH_COOKIE = "rf_token";
export const ACCESS_TOKEN_KEY = "rf_access_token";
export const REFRESH_TOKEN_KEY = "rf_refresh_token";
export const USER_KEY = "rf_user";

export function decodeJwt<T = JwtPayload>(token?: string | null): T | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1] as string;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

export function parseAuthToken(token?: string | null): JwtPayload | null {
  const payload = decodeJwt<JwtPayload>(token);
  if (!payload?.id || !payload?.role) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload;
}

export function isClient() {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isClient()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isClient()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): JwtPayload | null {
  if (!isClient()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as JwtPayload;
  } catch {
    return null;
  }
}

export function persistAuth(tokens: AuthTokens, user: JwtPayload) {
  if (!isClient()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  writeAuthCookie(tokens.accessToken);
}

export function clearAuth() {
  if (!isClient()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function writeAuthCookie(token?: string | null) {
  if (!isClient()) return;
  if (token) {
    document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}
