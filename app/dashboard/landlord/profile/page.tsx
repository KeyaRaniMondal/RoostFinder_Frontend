"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  useMyLandlordProfile,
  useCreateLandlordProfile,
  useUpdateLandlordProfile,
} from "@/hooks/use-landlord";
import { landlordProfileSchema, LandlordProfileFormValues } from "@/schemas/landlord";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FullPageSpinner } from "@/components/ui/spinner";
import { Landlord } from "@/types";

function toFormValues(landlord: Landlord): LandlordProfileFormValues {
  return {
    phone: landlord.phone,
    address: landlord.address ?? "",
    dateOfBirth: landlord.dateOfBirth ? landlord.dateOfBirth.slice(0, 10) : "",
    occupation: landlord.occupation ?? "",
    companyName: landlord.companyName ?? "",
    nidNumber: landlord.nidNumber ?? "",
    profilePhoto: landlord.profilePhoto ?? "",
    bio: landlord.bio ?? "",
  };
}

export default function LandlordProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: landlord, isLoading } = useMyLandlordProfile(user?.id);
  const createProfile = useCreateLandlordProfile();
  const updateProfile = useUpdateLandlordProfile();
  const [isNew, setIsNew] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LandlordProfileFormValues>({
    resolver: zodResolver(landlordProfileSchema),
    defaultValues: {
      phone: "",
      address: "",
      dateOfBirth: "",
      occupation: "",
      companyName: "",
      nidNumber: "",
      profilePhoto: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (isLoading) return;
    if (landlord) {
      setIsNew(false);
      reset(toFormValues(landlord));
    } else {
      setIsNew(true);
    }
  }, [landlord, isLoading, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      if (isNew) {
        await createProfile.mutateAsync(values);
        toast.success("Landlord profile created");
      } else {
        await updateProfile.mutateAsync(values);
        toast.success("Profile updated");
      }
      router.refresh();
    } catch (error) {
      setServerError((error as Error).message);
      toast.error(isNew ? "Could not create profile" : "Could not update profile", {
        description: (error as Error).message,
      });
    }
  });

  if (isLoading) return <FullPageSpinner label="Loading profile..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Landlord profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isNew
            ? "Complete your profile to start listing properties."
            : "Update your details below."}
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {serverError}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact & verification details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" placeholder="+880 1XXXXXXXXX" {...register("phone")} />
                <FormError message={errors.phone?.message} />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                <FormError message={errors.dateOfBirth?.message} />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" placeholder="Business owner" {...register("occupation")} />
                <FormError message={errors.occupation?.message} />
              </div>
              <div>
                <Label htmlFor="companyName">Company name</Label>
                <Input id="companyName" placeholder="ABC Holdings" {...register("companyName")} />
                <FormError message={errors.companyName?.message} />
              </div>
              <div>
                <Label htmlFor="nidNumber">NID number</Label>
                <Input id="nidNumber" placeholder="NID number" {...register("nidNumber")} />
                <FormError message={errors.nidNumber?.message} />
              </div>
              <div>
                <Label htmlFor="profilePhoto">Profile photo URL</Label>
                <Input id="profilePhoto" placeholder="https://example.com/photo.jpg" {...register("profilePhoto")} />
                <FormError message={errors.profilePhoto?.message} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Full address" {...register("address")} />
                <FormError message={errors.address?.message} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} placeholder="Tell tenants about yourself..." {...register("bio")} />
                <FormError message={errors.bio?.message} />
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-border pt-5">
              <Button type="submit" loading={createProfile.isPending || updateProfile.isPending} size="lg">
                {isNew ? "Create profile" : "Save changes"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
