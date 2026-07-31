"use client";

import { AMENITIES } from "@/lib/constants";
import { PropertyAmenity } from "@/app/types";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function AmenitySelector({
  value,
  onChange,
}: {
  value: PropertyAmenity[];
  onChange: (next: PropertyAmenity[]) => void;
}) {
  const toggle = (amenity: PropertyAmenity) => {
    onChange(
      value.includes(amenity)
        ? value.filter((a) => a !== amenity)
        : [...value, amenity]
    );
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {(Object.keys(AMENITIES) as PropertyAmenity[]).map((amenity) => {
        const active = value.includes(amenity);
        return (
          <button
            key={amenity}
            type="button"
            onClick={() => toggle(amenity)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors",
              active
                ? "border-brand-500 bg-brand-50 text-brand-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white"
              )}
            >
              {active && <Check className="h-3 w-3" />}
            </span>
            {AMENITIES[amenity]}
          </button>
        );
      })}
    </div>
  );
}
