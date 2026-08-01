import { cookies } from "next/headers";
import type { Role } from "@/types";

const ACCESS_COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE_NAME)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  return !!(await getAuthToken());
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day — match backend's accessToken expiry
  });

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days — match backend's refreshToken expiry
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

type JwtPayload = {
  role?: Role;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<JwtPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return decodeJwtPayload(token);
}