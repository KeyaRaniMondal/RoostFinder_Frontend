"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();

  // Remove authentication cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // Redirect to login page
  redirect("/login");
}