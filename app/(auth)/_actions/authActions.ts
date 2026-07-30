"use server";

import { registerSchema } from "@/lib/validations/auth";

export type RegisterActionState = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<"name" | "email" | "password" | "confirmPassword" | "terms", string>>;
};

export async function registerUser(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  // Re-parse raw form data on the server — never trust client-side validation alone.
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
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

  const { name, email, password } = parsed.data;

  try {
    // Replace with your real logic: hash the password, check for
    // an existing user, write to your database, etc.
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return {
        success: false,
        errors: { email: "An account with this email already exists" },
      };
    }

    await createUser({ name, email, password });

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    console.error("Registration failed:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// --- Stubs: swap these for your real database/((auth)) layer ---

async function findUserByEmail(_email: string): Promise<{ id: string } | null> {
  return null;
}

async function createUser(_data: { name: string; email: string; password: string }) {
  // e.g. await db.user.create({ data: { ...data, password: await hash(data.password) } });
  return;
}