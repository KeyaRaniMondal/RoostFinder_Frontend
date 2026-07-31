"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AmenitySelector } from "../_components/amenitySelector";
import { PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/constants";
import { PropertyAmenity } from "@/app/types";

export interface PropertyFilterState {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  purpose: string;
  amenities: PropertyAmenity[];
}

export const defaultFilters: PropertyFilterState = {
  searchTerm: "",
  minPrice: "",
  maxPrice: "",
  propertyType: "",
  purpose: "",
  amenities: [],
};

export function FilterSidebar({
  filters,
  onChange,
  totalCount,
}: {
  filters: PropertyFilterState;
  onChange: (next: PropertyFilterState) => void;
  totalCount?: number;
}) {
  const [search, setSearch] = useState(filters.searchTerm);

  useEffect(() => {
    setSearch(filters.searchTerm);
  }, [filters.searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, searchTerm: search });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const update = (patch: Partial<PropertyFilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" /> Filters
        </h2>
        <button
          onClick={() => onChange(defaultFilters)}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          Reset all
        </button>
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="search"
              placeholder="Title, area, district..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="purpose">Purpose</Label>
          <Select
            id="purpose"
            value={filters.purpose}
            onChange={(e) => update({ purpose: e.target.value })}
          >
            <option value="">Any purpose</option>
            {Object.entries(PROPERTY_PURPOSES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="propertyType">Property type</Label>
          <Select
            id="propertyType"
            value={filters.propertyType}
            onChange={(e) => update({ propertyType: e.target.value })}
          >
            <option value="">Any type</option>
            {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Price range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
            />
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Amenities</Label>
          <AmenitySelector
            value={filters.amenities}
            onChange={(amenities) => update({ amenities })}
          />
        </div>

        {typeof totalCount === "number" && (
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
            {totalCount} propert{totalCount === 1 ? "y" : "ies"} found
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onChange(defaultFilters)}
        >
          <X className="h-4 w-4" /> Clear filters
        </Button>
      </div>
    </div>
  );
}
