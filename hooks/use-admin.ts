"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Paginated, Property, RentalRequest, User } from "@/types";

export interface AdminUsersParams {
  searchTerm?: string;
  role?: string;
  activeStatus?: string;
  page?: number;
  limit?: number;
}

export function useAdminUsers(params: AdminUsersParams = {}) {
  const search = new URLSearchParams();
  if (params.searchTerm) search.set("searchTerm", params.searchTerm);
  if (params.role) search.set("role", params.role);
  if (params.activeStatus) search.set("activeStatus", params.activeStatus);
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 10));
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => api.get<Paginated<User>>(`/api/admin/users?${search.toString()}`),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, activeStatus }: { id: string; activeStatus: "ACTIVE" | "BANNED" }) =>
      api.patch<User>(`/api/admin/users/${id}`, { activeStatus }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export interface AdminPropertiesParams {
  searchTerm?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export function useAdminProperties(params: AdminPropertiesParams = {}) {
  const search = new URLSearchParams();
  if (params.searchTerm) search.set("searchTerm", params.searchTerm);
  if (params.status) search.set("status", params.status);
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 10));
  return useQuery({
    queryKey: ["admin-properties", params],
    queryFn: () => api.get<Paginated<Property>>(`/api/admin/properties?${search.toString()}`),
  });
}

export function useAdminRentals(params: { status?: string; page?: number; limit?: number } = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 10));
  return useQuery({
    queryKey: ["admin-rentals", params],
    queryFn: () => api.get<Paginated<RentalRequest>>(`/api/admin/rentals?${search.toString()}`),
  });
}
