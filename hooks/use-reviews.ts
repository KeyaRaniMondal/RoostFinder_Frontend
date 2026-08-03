"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Review } from "@/types";

export function usePropertyReviews(propertyId: string) {
  return useQuery({
    queryKey: ["property-reviews", propertyId],
    queryFn: () => api.get<Review[]>(`/api/reviews/property/${propertyId}`),
    enabled: !!propertyId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rentalRequestId: string; rating: number; comment?: string }) =>
      api.post<Review>("/api/reviews", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["property-reviews"] });
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
    },
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: ["my-reviews"],
    queryFn: () => api.get<Review[]>("/api/reviews/my-reviews"),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<Review>(`/api/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-reviews"] });
      qc.invalidateQueries({ queryKey: ["property-reviews"] });
    },
  });
}
