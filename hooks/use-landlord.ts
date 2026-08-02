"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Landlord, RentalRequest } from "@/types";
import { LandlordProfileFormValues } from "@/schemas/landlord";

export function useMyLandlordProfile(userId?: string) {
  return useQuery({
    queryKey: ["landlord-profile", userId],
    queryFn: () => api.get<Landlord>("/api/landlord/me"),
    enabled: !!userId,
  });
}

export function useCreateLandlordProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<LandlordProfileFormValues>) =>
      api.post<Landlord>("/api/landlord", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-profile"] });
    },
  });
}

export function useUpdateLandlordProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<LandlordProfileFormValues>) =>
      api.patch<Landlord>("/api/landlord/me", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["landlord-profile"] });
    },
  });
}

export function useLandlordRequests(userId?: string) {
  return useQuery({
    queryKey: ["landlord-requests", userId],
    queryFn: () => api.get<RentalRequest[]>("/api/landlord/requests"),
    enabled: !!userId,
  });
}

export function useUpdateRentalRequestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      api.patch<RentalRequest>(`/api/landlord/requests/${id}`, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["landlord-requests"] });
      const previous = qc.getQueryData<RentalRequest[]>(["landlord-requests"]);
      qc.setQueryData<RentalRequest[]>(["landlord-requests"], (old) =>
        old?.map((r) => (r.id === id ? { ...r, status } : r)) ?? old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(["landlord-requests"], context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["landlord-requests"] });
      qc.invalidateQueries({ queryKey: ["my-rental-requests"] });
    },
  });
}
