const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5000";

export type BackendLoginResult =
    | { ok: true; accessToken: string; refreshToken: string }
    | { ok: false; status: number; message?: string; errors?: Record<string, string> };


export async function backendLogin(
    email: string,
    password: string
): Promise<BackendLoginResult> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 401) {
            return { ok: false, status: 401, message: data?.message ?? "Incorrect email or password" };
        }
        if (data?.errors && typeof data.errors === "object") {
            return { ok: false, status: response.status, errors: data.errors };
        }
        return {
            ok: false,
            status: response.status,
            message: data?.message ?? "Login failed. Please try again.",
        };
    }

    const accessToken = data?.data?.accessToken ?? data?.accessToken;
    const refreshToken = data?.data?.refreshToken ?? data?.refreshToken;

    if (!accessToken || !refreshToken) {
        console.error("Login response missing tokens:", data);
        return { ok: false, status: 500, message: "Unexpected response from server." };
    }

    return { ok: true, accessToken, refreshToken };
}

export { API_BASE_URL };