"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function TenantDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="Tenant">{children}</DashboardShell>;
}
