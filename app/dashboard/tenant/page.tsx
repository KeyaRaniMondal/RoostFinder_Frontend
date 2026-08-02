"use client";

import Link from "next/link";
import { Inbox, Clock, CheckCircle2, XCircle, CreditCard, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMyRentalRequests, useMyPayments } from "@/hooks/use-rentals";
import { deriveDisplayStatus } from "@/components/dashboard/request-status";
import { StatCard } from "@/components/dashboard/stat-card";
import { TenantRequestsList } from "@/components/dashboard/tenant-requests";
import { PaymentsTable } from "@/components/dashboard/payments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function TenantOverviewPage() {
  const { user } = useAuth();
  const { data: requests, isLoading: requestsLoading } = useMyRentalRequests(user?.id);
  const { data: payments, isLoading: paymentsLoading } = useMyPayments(user?.id);

  const statuses = (requests ?? []).map(deriveDisplayStatus);
  const pending = statuses.filter((s) => s === "PENDING").length;
  const approved = statuses.filter((s) => s === "APPROVED").length;
  const active = statuses.filter((s) => s === "ACTIVE").length;
  const rejected = statuses.filter((s) => s === "REJECTED").length;
  const completed = statuses.filter((s) => s === "COMPLETED").length;

  const totalSpent = (payments ?? [])
    .filter((p) => p.status === "SUCCEEDED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tenant dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back, {user?.name}. Track your requests and payments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total requests" value={requests?.length ?? 0} icon={<Inbox className="h-5 w-5" />} />
        <StatCard label="Pending" value={pending} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved" value={approved} icon={<CheckCircle2 className="h-5 w-5" />} tone="info" />
        <StatCard label="Active" value={active} icon={<Wallet className="h-5 w-5" />} tone="success" />
        <StatCard label="Rejected" value={rejected} icon={<XCircle className="h-5 w-5" />} tone="danger" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-brand-600" /> Rental requests
          </CardTitle>
          <span className="text-xs text-slate-400">
            {completed > 0 ? `${completed} completed` : ""}
          </span>
        </CardHeader>
        <CardContent>
          <TenantRequestsList requests={requests} isLoading={requestsLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-600" /> Payment history
          </CardTitle>
          <span className="text-sm font-semibold text-slate-700">
            Total paid: {formatPrice(totalSpent)}
          </span>
        </CardHeader>
        <CardContent>
          <PaymentsTable payments={payments} isLoading={paymentsLoading} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/properties">
          <Button>Browse properties</Button>
        </Link>
        <Link href="/dashboard/tenant/requests">
          <Button variant="outline">View all requests</Button>
        </Link>
        <Link href="/dashboard/tenant/payments">
          <Button variant="outline">Payment history</Button>
        </Link>
      </div>
    </div>
  );
}
