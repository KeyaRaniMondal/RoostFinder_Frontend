"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validations/loginAuth";

export type LoginActionState = {
    success: boolean;
    message?: string;
    errors?: Partial<Record<"email" | "password", string>>;
};

const API_BASE_URL =
    process.env.API_BASE_URL ?? "http://localhost:5000";

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

        for (const issue of parsed.error.issues) {
            const key = issue.path[0] as keyof NonNullable<LoginActionState["errors"]>;

            if (key && !errors[key]) {
                errors[key] = issue.message;
            }
        }

        return {
            success: false, errors,
        };
    }

    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsed.data),
            cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: result.message ?? "Login failed",
            };
        }

        accessToken = result?.data?.accessToken;
        refreshToken = result?.data?.refreshToken;

        if (!accessToken || !refreshToken) {
            return {
                success: false,
                message: "Authentication tokens not received.",
            };
        }
    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: "Unable to connect to server.",
        };
    }

    const cookieStore = await cookies();

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/home");
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    redirect("/login");
}