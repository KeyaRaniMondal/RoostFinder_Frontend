"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Paginated, Property } from "@/app/types";

export interface PropertyFilters {
  searchTerm?: string;
  minPrice?: string;
  maxPrice?: string;
  propertyType?: string;
  purpose?: string;
  page?: number;
  limit?: number;
}

export function toQueryString(filters: PropertyFilters) {
  const params = new URLSearchParams();
  if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.propertyType) params.set("propertyType", filters.propertyType);
  if (filters.purpose) params.set("purpose", filters.purpose);
  params.set("page", String(filters.page ?? 1));
  params.set("limit", String(filters.limit ?? 10));
  return params.toString();
}

export function useProperties(filters: PropertyFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => api.get<Paginated<Property>>(`/api/properties?${toQueryString(filters)}`),
    enabled,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => api.get<Property>(`/api/properties/${id}`),
    enabled: !!id,
  });
}

export function useLandlordProperties(landlordId?: string | null) {
  return useQuery({
    queryKey: ["landlord-properties", landlordId],
    queryFn: async () => {
      const res = await api.get<Paginated<Property>>("/api/properties?limit=200");
      const all = res.data ?? [];
      if (!landlordId) return all;
      return all.filter((p) => p.landlordId === landlordId);
    },
    enabled: !!landlordId,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post<Property>("/api/properties", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api.put<Property>(`/api/properties/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      qc.invalidateQueries({ queryKey: ["my-properties"] });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<Property>(`/api/properties/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<string[]>("/api/categories"),
  });
}
