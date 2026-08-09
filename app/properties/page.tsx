"use client";

import { useState } from "react";
import { useProperties } from "@/hooks/use-properties";
import { PropertyAmenity } from "@/types";
import { FilterSidebar, defaultFilters, PropertyFilterState } from "@/components/properties/filter-sidebar";
import { PropertyGrid, PropertyGridSkeleton } from "@/components/properties/property-grid";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function filterByAmenities(properties: any[], amenities: PropertyAmenity[]) {
  if (!amenities.length) return properties;
  return properties.filter((p) => amenities.every((a) => (p.amenities ?? []).includes(a)));
}

function filterByPriceRange(properties: any[], minPrice: string, maxPrice: string) {
  const min = minPrice !== "" ? Number(minPrice) : undefined;
  const max = maxPrice !== "" ? Number(maxPrice) : undefined;

  return properties.filter((property) => {
    if (typeof property.price !== "number") return true;
    if (min !== undefined && !Number.isNaN(min) && property.price < min) return false;
    if (max !== undefined && !Number.isNaN(max) && property.price > max) return false;
    return true;
  });
}

function sortByPrice(properties: any[]) {
  return [...properties].sort((a, b) => a.price - b.price);
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
  const priced = filterByPriceRange(all, filters.minPrice, filters.maxPrice);
  const filtered = filterByAmenities(priced, filters.amenities);
  const sorted = (filters.minPrice !== "" || filters.maxPrice !== "") ? sortByPrice(filtered) : filtered;

  const totalPages = Math.max(
    1,
    Math.ceil((data?.meta?.total ?? 0) / 9)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Browse properties</h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
              <PropertyGrid properties={sorted} />
              {filters.amenities.length > 0 && data && filtered.length < data.data.length && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
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
