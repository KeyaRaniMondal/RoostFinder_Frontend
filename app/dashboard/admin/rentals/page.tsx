"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAdminRentals } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { RentalStatusBadge } from "@/components/dashboard/status-badge";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { absoluteImageUrl, formatDate, formatPrice } from "@/lib/utils";

export default function AdminRentalsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useAdminRentals({
    status: status || undefined,
    page,
    limit: 8,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Rental requests</h1>
        <span className="text-sm text-slate-500">{data?.meta.total ?? 0} requests</span>
      </div>

      <div className="w-full sm:max-w-xs">
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All rental requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">Failed to load rental requests.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : data?.data.length ? (
            <div className="divide-y divide-slate-100">
              {data.data.map((rental) => (
                <div key={rental.id} className="flex items-center gap-4 p-4">
                  {rental.property && (
                    <Link href={`/properties/${rental.property.id}`} className="shrink-0">
                      <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={absoluteImageUrl(rental.property.images?.[0]) ?? FALLBACK_IMAGE}
                          alt={rental.property.title}
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
                      href={`/properties/${rental.propertyId}`}
                      className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                    >
                      {rental.property?.title ?? "Property"}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {rental.tenant?.name} ({rental.tenant?.email}) · {formatDate(rental.createdAt)}
                      {rental.property && <> · {formatPrice(rental.property.price)}</>}
                    </p>
                    {rental.message && (
                      <p className="mt-1 line-clamp-1 text-xs text-slate-400">“{rental.message}”</p>
                    )}
                  </div>
                  <RentalStatusBadge status={rental.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No rental requests" description="Requests will appear here as tenants apply." />
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
