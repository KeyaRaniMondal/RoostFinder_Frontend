"use client";

import { useEffect, useState } from "react";
import { Search, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ActiveStatusBadge } from "@/components/dashboard/status-badge";
import { formatDate } from "@/lib/utils";
import { ROLES } from "@/lib/constants";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, activeStatus]);

  const { data, isLoading, isError, refetch } = useAdminUsers({
    searchTerm: debouncedSearch || undefined,
    role: role || undefined,
    activeStatus: activeStatus || undefined,
    page,
    limit: 8,
  });

  const updateStatus = useUpdateUserStatus();

  const toggleStatus = async (id: string, current: "ACTIVE" | "BANNED") => {
    const next = current === "BANNED" ? "ACTIVE" : "BANNED";
    const label = next === "BANNED" ? "ban" : "unban";
    if (!confirm(`Are you sure you want to ${label} this user?`)) return;
    try {
      await updateStatus.mutateAsync({ id, activeStatus: next });
      toast.success(`User ${label}ned`, {
        description: next === "BANNED" ? "They can no longer sign in." : "They can sign in again.",
      });
    } catch (error) {
      toast.error(`Could not ${label} user`, { description: (error as Error).message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">User management</h1>
        <span className="text-sm text-muted-foreground">{data?.meta.total ?? 0} users</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="Tenant">Tenant</option>
          <option value="Landlord">Landlord</option>
          <option value="Admin">Admin</option>
        </Select>
        <Select value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="BANNED">Banned</option>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">Failed to load users.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : data?.data.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-semibold">User</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Joined</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="secondary">{ROLES[user.role].label}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <ActiveStatusBadge status={user.activeStatus} />
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-3.5 text-right">
                        {user.activeStatus === "ACTIVE" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-400"
                            onClick={() => toggleStatus(user.id, user.activeStatus)}
                            loading={updateStatus.isPending}
                          >
                            <ShieldBan className="h-3.5 w-3.5" /> Ban
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950 dark:hover:text-emerald-400"
                            onClick={() => toggleStatus(user.id, user.activeStatus)}
                            loading={updateStatus.isPending}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" /> Unban
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No users found" description="Try adjusting your search filters." />
          )}
        </CardContent>
      </Card>

      {data && (
        <Pagination
          meta={{ page, limit: 8, total: Math.max(1, Math.ceil(data.meta.total / 8)) }}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
