"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";
import { FormError } from "@/components/ui/form-error";
import { reviewSchema, ReviewFormValues } from "@/schemas/review";
import { useCreateReview } from "@/hooks/use-reviews";

export function ReviewDialog({
  open,
  onClose,
  rentalRequestId,
  propertyTitle,
}: {
  open: boolean;
  onClose: () => void;
  rentalRequestId: string;
  propertyTitle: string;
}) {
  const mutation = useCreateReview();
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ rating: 0, comment: "" });
      setRating(0);
    }
  }, [open, reset]);

  const submit = handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ rentalRequestId, rating: values.rating, comment: values.comment });
      toast.success("Review submitted — thanks for your feedback!");
      onClose();
    } catch (error) {
      toast.error("Could not submit review", { description: (error as Error).message });
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Leave a review"
      description={propertyTitle}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label>Your rating</Label>
          <div className="mt-1">
            <Stars
              value={rating}
              size="lg"
              onChange={(value) => {
                setRating(value);
                setValue("rating", value, { shouldValidate: true });
              }}
            />
          </div>
          <FormError message={errors.rating?.message} />
        </div>

        <div>
          <Label htmlFor="comment">Comment (optional)</Label>
          <Textarea
            id="comment"
            rows={4}
            placeholder="Share your experience with this rental..."
            {...register("comment")}
          />
          <FormError message={errors.comment?.message} />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Submit review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
