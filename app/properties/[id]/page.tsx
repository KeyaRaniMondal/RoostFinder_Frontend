"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BedDouble,
  Bath,
  MapPin,
  Ruler,
  Building2,
  Armchair,
  Building,
  Layers,
  Sofa,
} from "lucide-react";
import { useProperty } from "@/hooks/usePeoperties";
import { AMENITIES, FALLBACK_IMAGE, PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteImageUrl, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: property, isLoading, isError, refetch } = useProperty(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-6 aspect-[16/9] w-full" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Property not found"
          description="We couldn't load this property. It may have been removed."
          action={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" /> Go back
              </Button>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          }
        />
      </div>
    );
  }

  const image = property.images?.[0]
    ? (absoluteImageUrl(property.images[0]) ?? FALLBACK_IMAGE)
    : FALLBACK_IMAGE;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="relative aspect-[16/9] w-full bg-slate-100">
          <Image
            src={image}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)}
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{property.title}</h1>
                <Badge variant={property.status === "ACTIVE" ? "success" : "warning"}>
                  {property.status}
                </Badge>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-4 w-4 shrink-0" />
                {[property.address, property.city, property.district, property.division, property.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-brand-700">
                {formatPrice(property.price)}
                <span className="text-base font-medium text-slate-400">
                  {property.purpose === "RENT" ? "/month" : ""}
                </span>
              </p>
              <div className="mt-1 flex gap-2">
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  {PROPERTY_PURPOSES[property.purpose]}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  {PROPERTY_TYPES[property.propertyType]}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {typeof property.bedrooms === "number" && (
              <DetailStat icon={<BedDouble className="h-4 w-4" />} label="Bedrooms" value={String(property.bedrooms)} />
            )}
            {typeof property.bathrooms === "number" && (
              <DetailStat icon={<Bath className="h-4 w-4" />} label="Bathrooms" value={String(property.bathrooms)} />
            )}
            {typeof property.areaSize === "number" && (
              <DetailStat icon={<Ruler className="h-4 w-4" />} label="Area" value={`${property.areaSize} sqft`} />
            )}
            {typeof property.floor === "number" && (
              <DetailStat icon={<Layers className="h-4 w-4" />} label="Floor" value={String(property.floor)} />
            )}
            <DetailStat
              icon={<Sofa className="h-4 w-4" />}
              label="Furnished"
              value={property.furnished ? "Yes" : "No"}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">About this property</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {property.description || "No description provided."}
            </p>
          </div>

          {property.amenities?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Amenities</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    <Building2 className="h-4 w-4 text-brand-600" />
                    {AMENITIES[amenity] ?? amenity.replaceAll("_", " ").toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                <Building className="h-4 w-4 inline text-brand-600" /> {property.landlord?.user?.name ?? "Property owner"}
              </span>
            </div>
            {property.status === "ACTIVE" && (
              <Link href="/auth/login">
                <Button className="w-full sm:w-auto">
                  <Armchair className="h-4 w-4" /> Request to rent
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
      <span className="text-brand-600">{icon}</span>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
