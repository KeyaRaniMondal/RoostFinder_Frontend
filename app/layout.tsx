import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/lib/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RoostFinder — Find your next home",
    template: "%s · RoostFinder",
  },
  description:
    "Browse rental properties, request to rent, and manage your listings — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
