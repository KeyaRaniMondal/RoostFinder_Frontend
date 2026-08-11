import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(80, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  profilePhoto: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio is too long").optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
