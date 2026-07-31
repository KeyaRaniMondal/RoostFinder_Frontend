"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, Menu, Search, Settings, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/validations/loginAuth";

type NavItem = { href: string; label: string };

const NAV_ITEMS: Record<"general" | Role, NavItem[]> = {
  general: [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Properties" },
  ],
  landlord: [
    // { href: "/dashboard/landlord", label: "Dashboard" },
    // { href: "/properties", label: "My Properties" },
    // { href: "/requests", label: "Rental Requests" },
  ],
  tenant: [
    // { href: "/dashboard/tenant", label: "Dashboard" },
    // { href: "/my-requests", label: "My Requests" },
    // { href: "/bookmarks", label: "Saved Properties" },
  ],
  admin: [
    // { href: "/admin", label: "Admin Panel" },
    // { href: "/admin/moderation", label: "Moderation" },
    // { href: "/admin/users", label: "Users" },
  ],
};

type NavbarProps = {
  isAuthenticated: boolean;
  role: Role | null;
  /** Server Action — passed down from a Server Component parent, called directly as a form action. */
  logoutAction: () => Promise<void>;
};

export function Navbar({ isAuthenticated, role, logoutAction }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  // General links always show; role-specific links are appended once we know who's logged in.
  const navItems = [
    ...NAV_ITEMS.general,
    ...(isAuthenticated && role ? NAV_ITEMS[role] : []),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <div className="w-full max-w-6xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <Link
                href="/"
                className="text-white font-medium text-sm tracking-wide hover:opacity-80 transition-opacity"
              >
                RoostFinder
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${isActive(item.href)
                        ? "bg-white text-slate-900 shadow-lg"
                        : "text-white hover:text-white/90"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {role && <span className="capitalize">{role}</span>}
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                        <form action={logoutAction}>
                          <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="hidden md:block">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 hover:from-lime-500 hover:via-green-500 hover:to-emerald-600 text-slate-900 font-semibold rounded-full px-6 transition-all duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsOpen((v) => !v)}
                  className="md:hidden p-1 text-white hover:text-white/80 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="md:hidden mt-3 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block w-full text-left px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${isActive(item.href)
                        ? "bg-white text-slate-900"
                        : "text-white hover:bg-white/20"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-2 border-t border-white/10 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white hover:bg-white/20"
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white hover:bg-white/20"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </form>
                    </>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 hover:from-lime-500 hover:via-green-500 hover:to-emerald-600 text-slate-900 font-semibold rounded-full"
                      >
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="h-20" />
    </>
  );
}