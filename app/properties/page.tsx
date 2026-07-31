"use client";

import { useState } from "react";
import { useProperties } from "@/app/hooks/useProperty";
import { PropertyAmenity } from "@/app/types";
import { FilterSidebar, defaultFilters, PropertyFilterState } from "./_components/filterSidebar";
import { PropertyGrid, PropertyGridSkeleton } from "./_components/propertyGrid";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function filterByAmenities(properties: any[], amenities: PropertyAmenity[]) {
  if (!amenities.length) return properties;
  return properties.filter((p) => amenities.every((a) => (p.amenities ?? []).includes(a)));
}

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilterState>(defaultFilters);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useProperties({
    searchTerm: filters.searchTerm || undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    propertyType: filters.propertyType || undefined,
    purpose: filters.purpose || undefined,
    page,
    limit: 9,
  });

  const all = data?.data ?? [];
  const filtered = filterByAmenities(all, filters.amenities);
  const totalPages = Math.max(1, Math.ceil((data?.meta.total ?? 0) / 9));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Browse properties</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search, filter and find your next place.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <FilterSidebar
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
          totalCount={isLoading ? undefined : data?.meta.total}
        />

        <div>
          {isLoading || (isFetching && !data) ? (
            <PropertyGridSkeleton count={9} />
          ) : isError ? (
            <EmptyState
              title="Failed to load properties"
              description="We couldn't reach the server. Check that the API is running and try again."
              action={<Button onClick={() => refetch()}>Retry</Button>}
            />
          ) : filtered.length ? (
            <>
              <PropertyGrid properties={filtered} />
              {filters.amenities.length > 0 && data && filtered.length < data.data.length && (
                <p className="mt-4 text-center text-xs text-slate-400">
                  Amenity filter applied — showing {filtered.length} of {data.meta.total} total
                </p>
              )}
              {data && <Pagination meta={{ page, limit: 9, total: totalPages }} onPageChange={setPage} />}
            </>
          ) : (
            <EmptyState
              title="No properties found"
              description="Try adjusting your search or filters to find more results."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters(defaultFilters);
                    setPage(1);
                  }}
                >
                  Clear all filters
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
