"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, Inbox, CheckCircle2, Wallet, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useMyLandlordProfile, useLandlordRequests } from "@/hooks/use-landlord";
import { useLandlordProperties, useDeleteProperty } from "@/hooks/use-properties";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { FALLBACK_IMAGE, PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteImageUrl, formatPrice } from "@/lib/utils";

export default function LandlordOverviewPage() {
  const { user } = useAuth();
  const { data: landlord } = useMyLandlordProfile(user?.id);
  const { data: requests, isLoading: requestsLoading } = useLandlordRequests(user?.id);
  const { data: properties, isLoading: propertiesLoading } = useLandlordProperties(landlord?.id);
  const deleteProperty = useDeleteProperty();

  const pendingRequests = (requests ?? []).filter((r) => r.status === "PENDING").length;
  const approvedRequests = (requests ?? []).filter((r) => r.status === "APPROVED").length;
  const earnings = (requests ?? [])
    .filter((r) => r.status === "APPROVED" || r.payment?.status === "SUCCEEDED")
    .reduce((sum, r) => sum + (r.property?.price ?? 0), 0);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteProperty.mutateAsync(id);
      toast.success("Property deleted");
    } catch (error) {
      toast.error("Could not delete property", { description: (error as Error).message });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Landlord dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {user?.name}. Manage your portfolio.
          </p>
        </div>
        <Link href="/dashboard/landlord/properties/new">
          <Button>
            <Plus className="h-4 w-4" /> Add property
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total properties" value={properties?.length ?? 0} icon={<Building2 className="h-5 w-5" />} />
        <StatCard label="Pending requests" value={pendingRequests} icon={<Inbox className="h-5 w-5" />} tone="warning" />
        <StatCard label="Approved requests" value={approvedRequests} icon={<CheckCircle2 className="h-5 w-5" />} tone="info" />
        <StatCard
          label="Potential earnings"
          value={formatPrice(earnings)}
          icon={<Wallet className="h-5 w-5" />}
          tone="success"
          hint="From approved requests"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-600" /> My properties
          </CardTitle>
          <Link href="/dashboard/landlord/properties">
            <span className="text-xs font-medium text-brand-600 hover:text-brand-700">Manage all →</span>
          </Link>
        </CardHeader>
        <CardContent>
          {propertiesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : properties?.length ? (
            <div className="divide-y divide-slate-100">
              {properties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex items-center gap-4 py-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={absoluteImageUrl(property.images?.[0]) ?? FALLBACK_IMAGE}
                      alt={property.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/properties/${property.id}`}
                      className="line-clamp-1 text-sm font-semibold text-slate-900 hover:text-brand-700"
                    >
                      {property.title}
                    </Link>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                      <span>{PROPERTY_TYPES[property.propertyType]}</span>·
                      <span>{PROPERTY_PURPOSES[property.purpose]}</span>·
                      <span className="font-semibold text-slate-700">{formatPrice(property.price)}</span>
                    </div>
                  </div>
                  <Badge variant={property.status === "ACTIVE" ? "success" : property.status === "REJECTED" ? "danger" : "warning"}>
                    {property.status}
                  </Badge>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                      <Button variant="ghost" size="icon" aria-label="Edit property">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(property.id, property.title)}
                      aria-label="Delete property"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No properties yet"
              description="Create your first listing to start receiving rental requests."
              action={
                <Link href="/dashboard/landlord/properties/new">
                  <Button variant="outline"><Plus className="h-4 w-4" /> Create property</Button>
                </Link>
              }
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-brand-600" /> Recent requests
          </CardTitle>
          <Link href="/dashboard/landlord/requests">
            <span className="text-xs font-medium text-brand-600 hover:text-brand-700">View all →</span>
          </Link>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : requests?.length ? (
            <div className="divide-y divide-slate-100">
              {requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-medium text-slate-900">
                      {request.property?.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      From {request.tenant?.name} · {request.tenant?.email}
                    </p>
                  </div>
                  <Badge variant={request.status === "PENDING" ? "warning" : request.status === "APPROVED" ? "info" : "danger"}>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No requests yet"
              description="When tenants request your properties, they'll appear here."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
