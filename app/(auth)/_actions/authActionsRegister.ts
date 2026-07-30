"use server";

import { registerSchema } from "@/lib/validations/registerAuth";

export type RegisterActionState = {
  success: boolean;
  message?: string;
  errors?: Partial<
    Record<"name" | "email" | "password" | "confirmPassword" | "role" | "terms", string>
  >;
};

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5000";

export async function registerUser(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role") || "tenant",
    terms: formData.get("terms") === "on" || formData.get("terms") === "true",
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: RegisterActionState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<RegisterActionState["errors"]>;
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, errors: fieldErrors };
  }

  const { name, email, password, role } = parsed.data;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (data?.errors && typeof data.errors === "object") {
        return { success: false, errors: data.errors };
      }
      if (data?.field && data?.message) {
        return { success: false, errors: { [data.field]: data.message } };
      }
      if (response.status === 409) {
        return {
          success: false,
          errors: { email: data?.message ?? "An account with this email already exists" },
        };
      }
      return {
        success: false,
        message: data?.message ?? "Registration failed. Please try again.",
      };
    }

    return { success: true, message: data?.message ?? "Account created successfully" };
  } catch (error) {
    console.error("Registration request failed:", error);
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
    };
  }
}