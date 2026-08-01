"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, Star } from "lucide-react";
import { RentalRequest } from "@/types";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { absoluteImageUrl, formatDate, formatPrice } from "@/lib/utils";
import { RentalStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status-badge";
import { deriveDisplayStatus } from "@/components/dashboard/request-status";
import { ReviewDialog } from "@/components/dashboard/review-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

function TenantRequestRow({
  request,
  onReview,
}: {
  request: RentalRequest;
  onReview: (r: RentalRequest) => void;
}) {
  const router = useRouter();
  const display = deriveDisplayStatus(request);
  const property = request.property;
  const image = property?.images?.[0] ? absoluteImageUrl(property.images[0]) ?? FALLBACK_IMAGE : FALLBACK_IMAGE;

  const handlePay = () => {
    router.push(`/dashboard/tenant/requests/${request.id}/pay`);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 py-4 last:border-0 sm:flex-row sm:items-center">
      {property && (
        <Link href={`/properties/${property.id}`} className="shrink-0">
          <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="96px"
              className="object-cover"
              onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)}
            />
          </div>
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <Link
          href={`/properties/${property?.id ?? ""}`}
          className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-brand-700"
        >
          {property?.title ?? "Property"}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <RentalStatusBadge status={display} />
            {request.payment && <PaymentStatusBadge status={request.payment.status} />}
          </span>
          <span>Requested {formatDate(request.createdAt)}</span>
          {request.moveInDate && <span>Move-in {formatDate(request.moveInDate)}</span>}
          {property && <span className="font-semibold text-slate-700">{formatPrice(property.price)}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {display === "APPROVED" && (
          <Button size="sm" onClick={handlePay}>
            <CreditCard className="h-3.5 w-3.5" /> Pay Now
          </Button>
        )}
        {(display === "ACTIVE" || display === "COMPLETED") && (
          <Button size="sm" variant="outline" onClick={() => onReview(request)}>
            <Star className="h-3.5 w-3.5 text-amber-500" /> Leave Review
          </Button>
        )}
      </div>
    </div>
  );
}

export function TenantRequestsList({
  requests,
  isLoading,
}: {
  requests?: RentalRequest[];
  isLoading: boolean;
}) {
  const [reviewTarget, setReviewTarget] = useState<RentalRequest | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!requests?.length) {
    return (
      <EmptyState
        title="No rental requests yet"
        description="Browse properties and request to rent to get started."
        action={
          <Link href="/properties">
            <Button variant="outline">Browse properties</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {requests.map((request) => (
        <TenantRequestRow
          key={request.id}
          request={request}
          onReview={(r) => setReviewTarget(r)}
        />
      ))}
      <ReviewDialog
        open={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        rentalRequestId={reviewTarget?.id ?? ""}
        propertyTitle={reviewTarget?.property?.title ?? "Rental"}
      />
    </div>
  );
}
