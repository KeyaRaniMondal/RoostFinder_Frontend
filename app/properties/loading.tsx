import { PropertyGridSkeleton } from "@/components/properties/property-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <Skeleton className="h-[500px] w-full rounded-xl" />
        <PropertyGridSkeleton count={6} />
      </div>
    </div>
  );
}
