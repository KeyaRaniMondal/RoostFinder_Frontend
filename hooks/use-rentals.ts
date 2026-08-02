"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Payment, RentalRequest } from "@/types";

export function useMyRentalRequests(userId?: string) {
  return useQuery({
    queryKey: ["my-rental-requests", userId],
    queryFn: () => api.get<RentalRequest[]>("/api/rentals"),
    enabled: !!userId,
  });
}

export function useRentalRequest(id: string) {
  return useQuery({
    queryKey: ["rental-request", id],
    queryFn: () => api.get<RentalRequest>(`/api/rentals/${id}`),
    enabled: !!id,
  });
}

export function useCreateRentalRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { propertyId: string; message?: string; move_in_date?: string }) =>
      api.post<RentalRequest>("/api/rentals", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-rental-requests"] });
    },
  });
}

export function useMyPayments(userId?: string) {
  return useQuery({
    queryKey: ["my-payments", userId],
    queryFn: () => api.get<Payment[]>("/api/payments"),
    enabled: !!userId,
  });
}

export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: (rentalRequestId: string) =>
      api.post<{ payment: Payment; checkoutUrl: string }>("/api/payments/create", {
        rentalRequestId,
      }),
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: (stripeSessionId: string) =>
      api.post<Payment>("/api/payments/confirm", { stripeSessionId }),
  });
}
