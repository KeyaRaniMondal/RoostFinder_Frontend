"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useLandlordRequests, useUpdateRentalRequestStatus } from "@/hooks/use-landlord";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { RentalStatusBadge } from "@/components/dashboard/status-badge";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { absoluteImageUrl, formatDate } from "@/lib/utils";
import { RentalRequest } from "@/types";

export default function LandlordRequestsPage() {
  const { user } = useAuth();
  const { data: requests, isLoading, isError } = useLandlordRequests(user?.id);
  const updateStatus = useUpdateRentalRequestStatus();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const decide = async (request: RentalRequest, status: "APPROVED" | "REJECTED") => {
    setProcessingId(request.id);
    try {
      await updateStatus.mutateAsync({ id: request.id, status });
      toast.success(
        status === "APPROVED" ? "Request approved" : "Request rejected",
        {
          description:
            status === "APPROVED"
              ? "The tenant can now proceed to payment."
              : "The tenant has been notified.",
        }
      );
    } catch (error) {
      toast.error("Action failed", { description: (error as Error).message });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Incoming requests</h1>
        <Badge variant="outline" className="px-3 py-1">
          {requests?.length ?? 0} total
        </Badge>
      </div>

      {isLoading ? (
        <Card><CardContent className="space-y-3 py-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
        </CardContent></Card>
      ) : isError ? (
        <EmptyState title="Failed to load requests" description="Please try again later." />
      ) : requests?.length ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {request.property && (
                  <Link href={`/properties/${request.property.id}`} className="shrink-0">
                    <div className="relative h-24 w-32 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={absoluteImageUrl(request.property.images?.[0]) ?? FALLBACK_IMAGE}
                        alt={request.property.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                        onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)}
                      />
                    </div>
                  </Link>
                )}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/properties/${request.propertyId}`}
                      className="line-clamp-1 font-semibold text-foreground hover:text-brand-700"
                    >
                      {request.property?.title ?? "Property"}
                    </Link>
                    <RentalStatusBadge status={request.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{request.tenant?.name}</span>{" "}
                    ({request.tenant?.email})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested {formatDate(request.createdAt)}
                    {request.moveInDate && ` · Move-in ${formatDate(request.moveInDate)}`}
                  </p>
                  {request.message && (
                    <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                      “{request.message}”
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {request.status === "PENDING" ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        loading={processingId === request.id}
                        onClick={() => decide(request, "APPROVED")}
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={processingId === request.id}
                        onClick={() => decide(request, "REJECTED")}
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Decision made</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No incoming requests"
          description="When tenants request to rent your properties, they'll show up here for you to approve or reject."
        />
      )}
    </div>
  );
}
