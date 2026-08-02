"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function LandlordDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="Landlord">{children}</DashboardShell>;
}
