"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, MapPin, Ruler, Building2 } from "lucide-react";
import { Property } from "@/types";
import { FALLBACK_IMAGE, PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteImageUrl, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0] ? absoluteImageUrl(property.images[0]) : FALLBACK_IMAGE;

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={image ?? FALLBACK_IMAGE}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-white/90 backdrop-blur">{PROPERTY_TYPES[property.propertyType]}</Badge>
          <Badge
            className={
              property.purpose === "RENT"
                ? "bg-emerald-600 text-white"
                : "bg-brand-600 text-white"
            }
          >
            {PROPERTY_PURPOSES[property.purpose]}
          </Badge>
        </div>
        {property.status !== "ACTIVE" && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800">
              {property.status}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-semibold text-slate-900 group-hover:text-brand-700">
            {property.title}
          </h3>
          <p className="shrink-0 text-base font-bold text-brand-700">
            {formatPrice(property.price)}
            <span className="text-xs font-medium text-slate-400">
              {property.purpose === "RENT" ? "/mo" : ""}
            </span>
          </p>
        </div>

        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {[property.city, property.district, property.area].filter(Boolean).join(", ")}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
          {typeof property.bedrooms === "number" && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-slate-400" /> {property.bedrooms} beds
            </span>
          )}
          {typeof property.bathrooms === "number" && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-slate-400" /> {property.bathrooms} baths
            </span>
          )}
          {typeof property.areaSize === "number" && (
            <span className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5 text-slate-400" /> {property.areaSize} sqft
            </span>
          )}
        </div>

        {property.amenities?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
              >
                <Building2 className="h-3 w-3" />
                {amenity.replaceAll("_", " ").toLowerCase()}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="aspect-[4/3] animate-pulse bg-slate-200" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
