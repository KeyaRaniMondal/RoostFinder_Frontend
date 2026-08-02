import { z } from "zod";

export const rentalRequestSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  message: z.string().max(500, "Message is too long").optional(),
  move_in_date: z.string().min(1, "Move-in date is required"),
});

export type RentalRequestFormValues = z.infer<typeof rentalRequestSchema>;
