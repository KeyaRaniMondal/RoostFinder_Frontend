"use client";

import { useState } from "react";
import { useProperties } from "@/hooks/use-properties";
import { PropertyAmenity } from "@/app/types";
import { Button } from "@/components/ui/button";

function filterByAmenities(properties: any[], amenities: PropertyAmenity[]) {
  if (!amenities.length) return properties;
  return properties.filter((p) => amenities.every((a) => (p.amenities ?? []).includes(a)));
}

export default function PropertiesPage() {

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Browse properties</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search, filter and find your next place.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <div>
          {isLoading || (isFetching && !data) ? (
            <PropertyGridSkeleton count={9} />
          ) 
            <EmptyState
              title="Failed to load properties"
              description="We couldn't reach the server. Check that the API is running and try again."
              action={<Button onClick={() => refetch()}>Retry</Button>}
            />
       
            <>
              <PropertyGrid properties={filtered} />
              {filters.amenities.length > 0 && data && filtered.length < data.data.length && (
                <p className="mt-4 text-center text-xs text-slate-400">
                  Amenity filter applied — showing {filtered.length} of {data.meta.total} total
                </p>
              )}
              
            </>
        </div>
      </div>
    </div>
  );
}
