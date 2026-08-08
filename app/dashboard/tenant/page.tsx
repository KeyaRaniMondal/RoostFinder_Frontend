"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Inbox, Clock, CheckCircle2, XCircle, CreditCard, Wallet, Trash2, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMyRentalRequestsWithPayments, useMyPayments } from "@/hooks/use-rentals";
import { useMyReviews, useDeleteReview } from "@/hooks/use-reviews";
import { deriveDisplayStatus } from "@/components/dashboard/request-status";
import { StatCard } from "@/components/dashboard/stat-card";
import { TenantRequestsList } from "@/components/dashboard/tenant-requests";
import { PaymentsTable } from "@/components/dashboard/payments-table";
import { Stars } from "@/components/ui/stars";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice } from "@/lib/utils";

export default function TenantOverviewPage() {
  const { user } = useAuth();
  const { data: requests, isLoading: requestsLoading } = useMyRentalRequestsWithPayments(user?.id);
  const { data: payments, isLoading: paymentsLoading } = useMyPayments(user?.id);
  const { data: reviews, isLoading: reviewsLoading } = useMyReviews();
  const deleteReview = useDeleteReview();

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview.mutateAsync(id);
      toast.success("Review deleted");
    } catch (error) {
      toast.error("Could not delete review", { description: (error as Error).message });
    }
  };

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
        <h1 className="text-2xl font-bold text-foreground">Tenant dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
          <span className="text-xs text-muted-foreground">
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
          <span className="text-sm font-semibold text-foreground">
            Total paid: {formatPrice(totalSpent)}
          </span>
        </CardHeader>
        <CardContent>
          <PaymentsTable payments={payments} isLoading={paymentsLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" /> My reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : reviews?.length ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="flex items-start gap-3 rounded-xl border border-border p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">
                        {review.property?.title ?? "Property"}
                      </p>
                      <Stars value={review.rating} readonly size="sm" />
                    </div>
                    {review.comment && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{review.comment}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-400"
                    onClick={() => handleDeleteReview(review.id)}
                    disabled={deleteReview.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reviews yet"
              description="Review your completed rentals to help other tenants."
            />
          )}
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
