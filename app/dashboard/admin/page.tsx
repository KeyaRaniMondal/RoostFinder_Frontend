"use client";

import Link from "next/link";
import { Users, Building2, Inbox, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminUsers, useAdminProperties, useAdminRentals } from "@/hooks/use-admin";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { data: users, isLoading: usersLoading } = useAdminUsers({ page: 1, limit: 1 });
  const { data: properties, isLoading: propsLoading } = useAdminProperties({ page: 1, limit: 1 });
  const { data: rentals, isLoading: rentalsLoading } = useAdminRentals({ page: 1, limit: 1 });

  const banned = users?.data.filter((u) => u.activeStatus === "BANNED").length ?? 0;
  const pendingRentals =
    rentals?.data.filter((r) => r.status === "PENDING").length ??
    (rentalsLoading ? 0 : undefined);

  const loading = usersLoading || propsLoading || rentalsLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Platform overview, {user?.name}.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total users" value={users?.meta.total ?? 0} icon={<Users className="h-5 w-5" />} />
          <StatCard label="Banned users" value={banned} icon={<Users className="h-5 w-5" />} tone="danger" />
          <StatCard label="Total properties" value={properties?.meta.total ?? 0} icon={<Building2 className="h-5 w-5" />} />
          <StatCard
            label="Pending requests"
            value={pendingRentals ?? rentals?.meta.total ?? 0}
            icon={<Clock className="h-5 w-5" />}
            tone="warning"
          />
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-brand-600" /> Recent rental requests
          </CardTitle>
          <Link href="/dashboard/admin/rentals" className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {rentalsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : rentals?.data.length ? (
            <div className="divide-y divide-slate-100">
              {rentals.data.slice(0, 6).map((rental) => (
                <div key={rental.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-slate-900">
                      {rental.property?.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {rental.tenant?.name} · {rental.tenant?.email}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      rental.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : rental.status === "APPROVED"
                          ? "bg-blue-100 text-blue-800"
                          : rental.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {rental.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">No rental requests yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
