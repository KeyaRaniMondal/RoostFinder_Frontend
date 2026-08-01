import { z } from "zod";

export const landlordProfileSchema = z.object({
    phone: z
        .string()
        .min(7, "Enter a valid phone number")
        .max(20, "Phone number is too long"),
    address: z.string().max(300).optional(),
    dateOfBirth: z.string().optional(),
    occupation: z.string().max(100).optional(),
    companyName: z.string().max(120).optional(),
    nidNumber: z.string().max(40).optional(),
    profilePhoto: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    bio: z.string().max(500).optional(),
});

export type LandlordProfileFormValues = z.infer<typeof landlordProfileSchema>;
