"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Home, Building2, ShieldCheck, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, RegisterFormValues } from "@/schemas/auth";
import { DASHBOARD_ROLE_BASE_URL, ROLES } from "@/lib/constants";
import { Role } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { cn } from "@/lib/utils";

const roleIcons: Record<Role, typeof Home> = {
  Tenant: Home,
  Landlord: Building2,
  Admin: ShieldCheck,
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const initialRole = (searchParams.get("role") as Role) ?? "Tenant";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: initialRole in ROLES ? initialRole : "Tenant",
      profilePhoto: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const payload = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        profilePhoto: values.profilePhoto || undefined,
      });
      toast.success("Account created — welcome to RoostFinder!");
      router.push(DASHBOARD_ROLE_BASE_URL[payload.role]);
    } catch (error) {
      setServerError((error as Error).message);
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose your role to get started.
      </p>

      {serverError && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {serverError}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
        <div>
          <Label>I am a...</Label>
          <div className="grid grid-cols-3 gap-2">
            {(["Tenant", "Landlord", "Admin"] as Role[]).map((role) => {
              const Icon = roleIcons[role];
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue("role", role, { shouldValidate: true })}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition-colors",
                    active
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-900"
                      : "border-border bg-card hover:border-border"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      active ? "bg-brand-600 text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={cn("text-sm font-semibold", active ? "text-brand-800" : "text-foreground")}>
                    {ROLES[role].label}
                  </span>
                  {active && <Check className="h-4 w-4 text-brand-600" />}
                </button>
              );
            })}
          </div>
          <FormError message={errors.role?.message} />
        </div>

        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Jane Doe"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          <FormError message={errors.name?.message} />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <FormError message={errors.password?.message} />
        </div>

        <div>
          <Label htmlFor="profilePhoto">Profile photo URL (optional)</Label>
          <Input
            id="profilePhoto"
            placeholder="https://example.com/photo.jpg"
            aria-invalid={!!errors.profilePhoto}
            {...register("profilePhoto")}
          />
          <FormError message={errors.profilePhoto?.message} />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
      <RegisterForm />
    </Suspense>
  );
}
