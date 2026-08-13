"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, ChevronDown, Home, LogOut, Menu, UserCircle2, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { DASHBOARD_ROLE_BASE_URL, ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const { user, status, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardUrl = user ? DASHBOARD_ROLE_BASE_URL[user.role] : null;
  const isDashboardPage = pathname.startsWith("/dashboard");

  const links = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Browse Properties" },
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ];

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        pathname === href ? "text-brand-700" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Roost<span className="text-brand-600">Finder</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => navLink(l.href, l.label))}
          {isDashboardPage && dashboardUrl && navLink(dashboardUrl, "Dashboard")}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {status === "loading" ? null : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-30 truncate">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg animate-fade-in">
                  <div className="border-b border-border px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      {ROLES[user.role].label}
                    </span>
                  </div>
                  {dashboardUrl && (
                    <Link
                      href={dashboardUrl}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                    >
                      <Home className="h-4 w-4" /> Go to dashboard
                    </Link>
                  )}
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted"
                  >
                    <UserCircle2 className="h-4 w-4" /> My profile
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/auth/login")}>
                Log in
              </Button>
              <Button size="sm" onClick={() => router.push("/auth/register")}>
                Sign up
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {links.map((l) => navLink(l.href, l.label))}
            {isDashboardPage && dashboardUrl && navLink(dashboardUrl, "Dashboard")}
          </nav>
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <ThemeToggle />
            {user ? (
              <>
                <span className="flex-1 truncate text-sm font-medium text-foreground">
                  Signed in as {user.name}
                </span>
                <Link
                  href="/dashboard/profile"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    My profile
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/auth/login");
                  }}
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/auth/register");
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
