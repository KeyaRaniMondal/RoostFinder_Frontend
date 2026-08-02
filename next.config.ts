import type { NextConfig } from "next";

const API_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

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
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
