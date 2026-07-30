import { cookies } from "next/headers";

export async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("accessToken")?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();

  return cookieStore.get("refreshToken")?.value;
}

export async function isAuthenticated() {
  const accessToken = await getAccessToken();

  return !!accessToken;
}