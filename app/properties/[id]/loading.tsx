"use client";

import { PropertyGridSkeleton } from "@/components/properties/property-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-48" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
