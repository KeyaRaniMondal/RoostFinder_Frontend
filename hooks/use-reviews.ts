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
    },
  });
}
