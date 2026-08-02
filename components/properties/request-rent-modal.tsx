"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { rentalRequestSchema, RentalRequestFormValues } from "@/schemas/rental";
import { useCreateRentalRequest } from "@/hooks/use-rentals";
import { useAuth } from "@/hooks/use-auth";

interface RequestRentModalProps {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onClose: () => void;
}

export function RequestRentModal({ propertyId, propertyTitle, open, onClose }: RequestRentModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const mutation = useCreateRentalRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RentalRequestFormValues>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: { propertyId, message: "", move_in_date: "" },
  });

  useEffect(() => {
    if (open) reset({ propertyId, message: "", move_in_date: "" });
  }, [open, propertyId, reset]);

  const submit = handleSubmit(async (values) => {
    if (!user) {
      router.push(`/auth/login?next=/properties/${propertyId}`);
      return;
    }
    try {
      await mutation.mutateAsync(values);
      toast.success("Rental request submitted", {
        description: "The landlord will review your request soon.",
      });
      onClose();
    } catch (error) {
      toast.error("Could not submit request", {
        description: (error as Error).message,
      });
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request to Rent"
      description={`Send a rental request for "${propertyTitle}"`}
    >
      {!user ? (
        <div className="py-4 text-center">
          <p className="text-sm text-slate-600">You need to log in before requesting a rental.</p>
          <Button
            className="mt-4"
            onClick={() => router.push(`/auth/login?next=/properties/${propertyId}`)}
          >
            Log in
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="move_in_date">Desired move-in date *</Label>
            <Input
              id="move_in_date"
              type="date"
              {...register("move_in_date")}
              aria-invalid={!!errors.move_in_date}
            />
            <FormError message={errors.move_in_date?.message} />
          </div>
          <div>
            <Label htmlFor="message">Message to landlord (optional)</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Tell the landlord about yourself, your plans, questions..."
              {...register("message")}
              aria-invalid={!!errors.message}
            />
            <FormError message={errors.message?.message} />
          </div>
          <input type="hidden" {...register("propertyId")} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit request"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
