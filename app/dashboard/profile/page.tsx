"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { profileSchema, ProfileFormValues } from "@/schemas/profile";
import { ACTIVE_STATUS_LABELS, DASHBOARD_ROLE_BASE_URL, ROLES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user, me, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      profilePhoto: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        profilePhoto: me?.profiel?.profilePhoto ?? "",
        bio: me?.profiel?.bio ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, me?.profiel?.profilePhoto, me?.profiel?.bio]);

  const avatarUrl = me?.profiel?.profilePhoto || "";

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile(values);
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Could not update profile", { description: (error as Error).message });
    }
  });

  if (!user) return null;

  const dashboardUrl = DASHBOARD_ROLE_BASE_URL[user.role];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={dashboardUrl}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-slate-900">My profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and update your personal information.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name *</Label>
                  <Input id="name" placeholder="Your name" {...register("name")} />
                  <FormError message={errors.name?.message} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  <FormError message={errors.email?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="profilePhoto">Profile photo URL</Label>
                  <Input
                    id="profilePhoto"
                    placeholder="https://example.com/photo.jpg"
                    {...register("profilePhoto")}
                  />
                  <FormError message={errors.profilePhoto?.message} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell other users about yourself..."
                    {...register("bio")}
                  />
                  <FormError message={errors.bio?.message} />
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                <Button type="submit" loading={isSubmitting} size="lg">
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center py-8 text-center">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={user.name ?? "Profile"}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-brand-100"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </span>
              )}
              <p className="mt-4 text-lg font-bold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              <Badge className="mt-3 bg-brand-50 text-brand-700">{ROLES[user.role].label}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-slate-900">
                  {me ? ACTIVE_STATUS_LABELS[me.activeStatus] : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Member since</span>
                <span className="font-medium text-slate-900">{formatDate(me?.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
