import { z } from "zod";
import { Role } from "@/types";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  role: z.enum(["Tenant", "Landlord", "Admin"], {
    message: "Please choose a role",
  }),
  profilePhoto: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;

export const roleOptions: Role[] = ["Tenant", "Landlord", "Admin"];
