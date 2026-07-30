"use server";

import { loginSchema } from "@/lib/validations/loginAuth";

export type LoginActionState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<"email" | "password", string>>;
};

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5000";

export async function loginUser(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: LoginActionState["errors"] = {};

    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as "email" | "password";
      if (!errors[key]) {
        errors[key] = issue.message;
      }
    });

    return {
      success: false,
      errors,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Login failed",
      };
    }

    return {
      success: true,
      message: data?.message || "Login successful",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to connect to the server.",
    };
  }
}