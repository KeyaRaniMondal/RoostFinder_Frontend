"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useAdminProperties } from "@/hooks/use-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FALLBACK_IMAGE, PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteImageUrl, formatPrice } from "@/lib/utils";

export default function AdminPropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data, isLoading, isError, refetch } = useAdminProperties({
    searchTerm: debouncedSearch || undefined,
    status: status || undefined,
    page,
    limit: 8,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Content moderation</h1>
        <span className="text-sm text-muted-foreground">{data?.meta.total ?? 0} listings</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or city..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SOLD">Sold</option>
          <option value="RENTED">Rented</option>
          <option value="REJECTED">Rejected</option>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All property listings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">Failed to load properties.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : data?.data.length ? (
            <div className="divide-y divide-border">
              {data.data.map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-4">
                  <Link href={`/properties/${property.id}`} className="shrink-0">
                    <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={absoluteImageUrl(property.images?.[0]) ?? FALLBACK_IMAGE}
                        alt={property.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                        onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)}
                      />
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/properties/${property.id}`}
                      className="line-clamp-1 font-semibold text-foreground hover:text-brand-700"
                    >
                      {property.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {PROPERTY_TYPES[property.propertyType]} · {PROPERTY_PURPOSES[property.purpose]} ·{" "}
                      {property.city}, {property.district} ·{" "}
                      <span className="font-semibold text-foreground">{formatPrice(property.price)}</span>
                    </p>
                    {property.landlord?.user && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Listed by {property.landlord.user.name} ({property.landlord.user.email})
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      property.status === "ACTIVE"
                        ? "success"
                        : property.status === "REJECTED"
                          ? "danger"
                          : "warning"
                    }
                    className="shrink-0"
                  >
                    {property.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No properties found" description="Try adjusting your filters." />
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
