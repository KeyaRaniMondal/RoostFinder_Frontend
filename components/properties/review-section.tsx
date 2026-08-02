"use client";

import { usePropertyReviews } from "@/hooks/use-reviews";
import { Stars } from "@/components/ui/stars";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function ReviewSection({ propertyId }: { propertyId: string }) {
  const { data: reviews, isLoading, isError } = usePropertyReviews(propertyId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-red-600">Failed to load reviews.</p>;
  }

  if (!reviews?.length) {
    return (
      <EmptyState
        title="No reviews yet"
        description="Be the first tenant to review this property after your rental completes."
      />
    );
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
          <Stars value={Math.round(average)} readonly size="sm" />
          <span className="text-sm font-semibold text-slate-700">
            {average.toFixed(1)} ({reviews.length})
          </span>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {review.tenant?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{review.tenant?.name ?? "Tenant"}</p>
                  <p className="text-xs text-slate-400">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              <Stars value={review.rating} readonly size="sm" />
            </div>
            {review.comment && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
