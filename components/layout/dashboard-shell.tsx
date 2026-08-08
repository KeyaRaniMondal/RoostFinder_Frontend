"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Inbox,
  User as UserIcon,
  Users,
  ClipboardList,
  CreditCard,
  Search,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { FullPageSpinner } from "@/components/ui/spinner";
import { Role } from "@/types";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

const roleNav: Record<Role, NavItem[]> = {
  Tenant: [
    { href: "/dashboard/tenant", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/tenant/requests", label: "My Requests", icon: Inbox },
    { href: "/dashboard/tenant/payments", label: "Payments", icon: CreditCard },
  ],
  Landlord: [
    { href: "/dashboard/landlord", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/landlord/properties", label: "My Properties", icon: Building2 },
    { href: "/dashboard/landlord/properties/new", label: "Add Property", icon: Building2 },
    { href: "/dashboard/landlord/requests", label: "Requests", icon: Inbox },
    { href: "/dashboard/landlord/profile", label: "Profile", icon: UserIcon },
  ],
  Admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/properties", label: "Properties", icon: Building2 },
    { href: "/dashboard/admin/rentals", label: "Rental Requests", icon: ClipboardList },
  ],
};

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?next=${pathname}`);
    } else if (status === "authenticated" && user && user.role !== role) {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [status, user, role, pathname, router]);

  if (status !== "authenticated" || !user) {
    return <FullPageSpinner label="Checking your session..." />;
  }

  const navItems = roleNav[role];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-2 lg:flex-col">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-600 text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-auto hidden border-t border-border pt-2 lg:block">
              <Link
                href="/properties"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Search className="h-4 w-4" /> Browse properties
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
