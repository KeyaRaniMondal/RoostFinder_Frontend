import Link from "next/link";
import { Building2 } from "lucide-react";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/properties", label: "All properties" },
      { href: "/properties?purpose=RENT", label: "Rentals" },
      { href: "/properties?purpose=SALE", label: "Sales" },
      { href: "/about", label: "About us" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
  {
    title: "For Tenants",
    links: [
      { href: "/auth/register?role=Tenant", label: "Create tenant account" },
      { href: "/auth/login", label: "Log in" },
    ],
  },
  {
    title: "For Landlords",
    links: [
      { href: "/auth/register?role=Landlord", label: "List your property" },
      { href: "/auth/login", label: "Manage requests" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Roost<span className="text-brand-600">Finder</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Find your next home or list your property. Rent with confidence.
            </p>
            <p className="mt-3 max-w-xs text-sm text-foreground">
              Contact us: +880 123-XXXXXXX
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} RoostFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
