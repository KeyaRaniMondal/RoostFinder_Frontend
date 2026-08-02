"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, LoginFormValues } from "@/schemas/auth";
import { DASHBOARD_ROLE_BASE_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const payload = await login(values.email, values.password);
      toast.success("Welcome back!");
      const next = searchParams.get("next");
      router.push(next || DASHBOARD_ROLE_BASE_URL[payload.role]);
    } catch (error) {
      setServerError((error as Error).message);
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
      <p className="mt-1 text-sm text-slate-500">
        Welcome back! Log in to manage your rentals and listings.
      </p>

      {serverError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          <FormError message={errors.email?.message} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FormError message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium text-brand-600 hover:text-brand-700">
          Sign up for free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-400">Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
