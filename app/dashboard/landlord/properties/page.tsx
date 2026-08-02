"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useMyLandlordProfile } from "@/hooks/use-landlord";
import { useLandlordProperties, useDeleteProperty } from "@/hooks/use-properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { FALLBACK_IMAGE, PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteImageUrl, formatPrice } from "@/lib/utils";
import { Property } from "@/types";

export default function LandlordPropertiesPage() {
  const { user } = useAuth();
  const { data: landlord } = useMyLandlordProfile(user?.id);
  const { data: properties, isLoading } = useLandlordProperties(landlord?.id);
  const deleteProperty = useDeleteProperty();

  const handleDelete = async (property: Property) => {
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    try {
      await deleteProperty.mutateAsync(property.id);
      toast.success("Property deleted");
    } catch (error) {
      toast.error("Could not delete property", { description: (error as Error).message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">My properties</h1>
        <Link href="/dashboard/landlord/properties/new">
          <Button><Plus className="h-4 w-4" /> Add property</Button>
        </Link>
      </div>

      {isLoading ? (
        <Card><CardContent className="space-y-3 py-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
        </CardContent></Card>
      ) : properties?.length ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {properties.map((property) => (
                <div key={property.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={absoluteImageUrl(property.images?.[0]) ?? FALLBACK_IMAGE}
                      alt={property.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/properties/${property.id}`}
                      className="line-clamp-1 font-semibold text-slate-900 hover:text-brand-700"
                    >
                      {property.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {PROPERTY_TYPES[property.propertyType]} · {PROPERTY_PURPOSES[property.purpose]} ·{" "}
                      {[property.city, property.area].filter(Boolean).join(", ")}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-sm">
                      <span className="font-bold text-brand-700">{formatPrice(property.price)}</span>
                      <Badge variant={property.status === "ACTIVE" ? "success" : property.status === "REJECTED" ? "danger" : "warning"}>
                        {property.status}
                      </Badge>
                      {property.amenities?.length > 0 && (
                        <span className="hidden text-xs text-slate-400 sm:inline">
                          {property.amenities.length} amenities
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="outline" size="sm"><Eye className="h-3.5 w-3.5" /> View</Button>
                    </Link>
                    <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                      <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(property)}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title="No properties yet"
          description="Create your first listing to start receiving rental requests."
          action={
            <Link href="/dashboard/landlord/properties/new">
              <Button><Plus className="h-4 w-4" /> Create property</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
