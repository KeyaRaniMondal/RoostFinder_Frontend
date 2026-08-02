import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Please pick a rating")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().max(600, "Comment is too long").optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
