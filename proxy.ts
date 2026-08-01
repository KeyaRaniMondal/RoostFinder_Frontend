import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, AUTH_COOKIE } from "@/lib/token";
import { JwtPayload } from "@/types";

const LOGIN_URL = "/auth/login";

function roleBaseUrl(role: string) {
    if (role === "Tenant") return "/dashboard/tenant";
    if (role === "Landlord") return "/dashboard/landlord";
    if (role === "Admin") return "/dashboard/admin";
    return null;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/dashboard")) {
        return NextResponse.next();
    }

    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const payload = token ? decodeJwt<JwtPayload>(token) : null;

    const dashboardMatch = pathname.match(/^\/dashboard\/(tenant|landlord|admin)(\/|$)/);
    const requiredRole = dashboardMatch?.[1];

    // Not logged in (missing or expired token) -> send to login, remember destination
    if (!payload?.id || !payload.role) {
        const loginUrl = new URL(LOGIN_URL, request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Logged in but trying to access another role's area -> bounce to their own dashboard
    const hasValidRole = !requiredRole || payload.role.toLowerCase() === requiredRole;
    if (!hasValidRole) {
        const base = roleBaseUrl(payload.role);
        if (base && base !== pathname) {
            return NextResponse.redirect(new URL(base, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
