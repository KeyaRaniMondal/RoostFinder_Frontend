"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, ROLES, type RegisterFormValues } from "@/lib/validations/registerAuth";
import { registerUser, type RegisterActionState } from "@/app/(auth)/_actions/authActionsRegister";

const initialState: RegisterActionState = { success: false };

export function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const [actionState, setActionState] = useState<RegisterActionState>(initialState);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
        defaultValues: { role: "tenant" },
    });

    useEffect(() => {
        if (actionState.errors) {
            for (const [field, message] of Object.entries(actionState.errors)) {
                setError(field as keyof RegisterFormValues, { message });
            }
        }
    }, [actionState, setError]);

    const onSubmit = (values: RegisterFormValues) => {
        const formData = new FormData();
        formData.set("name", values.name);
        formData.set("email", values.email);
        formData.set("password", values.password);
        formData.set("confirmPassword", values.confirmPassword);
        formData.set("role", values.role ?? "tenant");
        formData.set("terms", String(values.terms));

        startTransition(async () => {
            const result = await registerUser(actionState, formData);
            setActionState(result);
        });
    };

    if (actionState.success) {
        return (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                <p className="text-sm font-medium text-green-800">
                    Account created. You can now sign in.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Name */}
            <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-900">
                    Full name
                </label>
                <input id="name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${errors.name
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                        }`}
                />
                {errors.name && (
                    <p id="name-error" className="mt-1 text-xs text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-900">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${errors.email
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                        }`}
                />
                {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-900">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
                        {...register("password")}
                        className={`w-full rounded-md border px-3 py-2 pr-16 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${errors.password
                                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {errors.password ? (
                    <p id="password-error" className="mt-1 text-xs text-red-600">
                        {errors.password.message}
                    </p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">
                        At least 8 characters, with an uppercase letter, lowercase letter, and a number.
                    </p>
                )}
            </div>

            {/* Confirm password */}
            <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-900">
                    Confirm password
                </label>
                <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    {...register("confirmPassword")}
                    className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${errors.confirmPassword
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                        }`}
                />
                {errors.confirmPassword && (
                    <p id="confirmPassword-error" className="mt-1 text-xs text-red-600">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Role */}
            <div>
                <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-gray-900">
                    Account type
                </label>
                <select
                    id="role"
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? "role-error" : undefined}
                    {...register("role")}
                    className={`w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-offset-0 ${errors.role
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-100"
                        }`}
                >
                    {ROLES.map((role) => (
                        <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                    ))}
                </select>
                {errors.role ? (
                    <p id="role-error" className="mt-1 text-xs text-red-600">
                        {errors.role.message}
                    </p>
                ) : (
                    <p className="mt-1 text-xs text-gray-500">Defaults to Tenant if not changed.</p>
                )}
            </div>

            {/* Terms */}
            <div>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        {...register("terms")}
                        aria-invalid={!!errors.terms}
                        aria-describedby={errors.terms ? "terms-error" : undefined}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                    />
                    <span>
                        I agree to the <a href="/terms" className="underline underline-offset-2">Terms of Service</a> and{" "}
                        <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
                    </span>
                </label>
                {errors.terms && (
                    <p id="terms-error" className="mt-1 text-xs text-red-600">
                        {errors.terms.message as string}
                    </p>
                )}
            </div>

            {/* Server-level error not tied to a field */}
            {actionState.message && !actionState.success && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2">
                    <p className="text-xs text-red-700">{actionState.message}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Creating account…" : "Create account"}
            </button>
        </form>
    );
}