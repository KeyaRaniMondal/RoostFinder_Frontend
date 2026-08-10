import type { NextConfig } from "next";

const API_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

/**
 * Backend auth endpoints that live under `/api/auth/*`. These must be proxied
 * to the backend in `beforeFiles` (before the NextAuth `[...nextauth]` route
 * handler is matched), otherwise the catch-all handler swallows them and
 * returns 404. NextAuth's own routes (`/signin`, `/callback`, `/session`,
 * `/csrf`, `/signout`, `/providers`, `/error`) are intentionally NOT listed so
 * they keep hitting the NextAuth handler.
 */
const BACKEND_AUTH_PATHS = [
  "/api/auth/google",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/me",
  "/api/auth/refresh-token",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // eslint: { ignoreDuringBuilds: true },
  outputFileTracingRoot: process.cwd(),
  images: {
     remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ],
  },
  async rewrites() {
    return {
      beforeFiles: BACKEND_AUTH_PATHS.map((path) => ({
        source: path,
        destination: `${API_URL}${path}`,
      })),
      afterFiles: [
        {
          // Everything under /api/* except /api/auth/* goes to the backend.
          // /api/auth/* is left to NextAuth's [...nextauth] route handler
          // (signin, callback, session, csrf, providers, signout, error).
          source: "/api/:path((?!auth/).*)",
          destination: `${API_URL}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
