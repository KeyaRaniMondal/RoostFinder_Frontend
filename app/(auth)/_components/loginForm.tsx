"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/loginAuth";
import { loginUser, type LoginActionState } from "@/app/(auth)/_actions/authActionLogin";

const initialState: LoginActionState = { success: false };

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [actionState, setActionState] = useState<LoginActionState>(initialState);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        if (actionState.errors) {
            for (const [field, message] of Object.entries(actionState.errors)) {
                setError(field as keyof LoginFormValues, { message });
            }
        }
    }, [actionState, setError]);

    const onSubmit = (values: LoginFormValues) => {
        const formData = new FormData();
        formData.set("email", values.email);
        formData.set("password", values.password);

        startTransition(async () => {
            const result = await loginUser(actionState, formData);
            setActionState(result);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
                <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                        Password
                    </label>
                    <a href="/forgot-password" className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800">
                        Forgot password?
                    </a>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
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
                {errors.password && (
                    <p id="password-error" className="mt-1 text-xs text-red-600">
                        {errors.password.message}
                    </p>
                )}
            </div>
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
                {isPending ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
}