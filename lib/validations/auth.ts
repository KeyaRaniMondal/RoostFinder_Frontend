import { z } from "zod";

export const ROLES = ["tenant", "landlord", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(2, "Name must be at least 2 characters")
            .max(60, "Name must be under 60 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Enter a valid email address"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must include an uppercase letter")
            .regex(/[a-z]/, "Password must include a lowercase letter")
            .regex(/[0-9]/, "Password must include a number"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        role: z
            .enum(ROLES, {
                message: "Select a valid role",
            })
            .default("tenant"),
        terms: z.literal(true, {
            message: "You must accept the terms to continue",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormValues = z.input<typeof registerSchema>;
export type RegisterFormOutput = z.output<typeof registerSchema>;