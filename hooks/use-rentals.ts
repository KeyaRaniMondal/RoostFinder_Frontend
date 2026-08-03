"use client";

import { useMemo } from "react";
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

export function useMyRentalRequestsWithPayments(userId?: string) {
  const requestsQuery = useMyRentalRequests(userId);
  const paymentsQuery = useMyPayments(userId);

  const data = useMemo(() => {
    const requests = requestsQuery.data ?? [];
    const paymentsByRequest = new Map(
      (paymentsQuery.data ?? []).map((p) => [p.rentalRequestId, p])
    );
    return requests.map((r) =>
      r.payment
        ? r
        : { ...r, payment: paymentsByRequest.get(r.id) ?? r.payment ?? null }
    );
  }, [requestsQuery.data, paymentsQuery.data]);

  return {
    ...requestsQuery,
    data,
    isLoading: requestsQuery.isLoading || paymentsQuery.isLoading,
  };
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
