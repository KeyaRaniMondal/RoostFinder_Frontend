"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, AlertTriangle } from "lucide-react";
import { useRentalRequest } from "@/hooks/use-rentals";
import { useCreatePaymentSession } from "@/hooks/use-rentals";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RentalStatusBadge, PaymentStatusBadge } from "@/components/dashboard/status-badge";
import { FullPageSpinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";
import { FALLBACK_IMAGE, PROPERTY_TYPES } from "@/lib/constants";
import { absoluteImageUrl } from "@/lib/utils";

export default function PayPage() {
  const params = useParams<{ id: string }>();
  const requestId = params.id;
  const { data: request, isLoading, isError } = useRentalRequest(requestId);
  const paymentMutation = useCreatePaymentSession();
  const [starting, setStarting] = useState(false);

  if (isLoading) return <FullPageSpinner label="Loading request..." />;

  if (isError || !request) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
        <h1 className="mt-3 text-xl font-bold text-slate-900">Request not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This request doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link href="/dashboard/tenant">
          <Button className="mt-6" variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const property = request.property;
  const payment = request.payment;
  const alreadyPaid = payment?.status === "SUCCEEDED";

  const startPayment = async () => {
    setStarting(true);
    try {
      const { checkoutUrl } = await paymentMutation.mutateAsync(requestId);
      if (!checkoutUrl) throw new Error("No checkout URL returned");
      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error("Could not start payment", { description: (error as Error).message });
      setStarting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Complete payment</h1>
        <p className="mt-1 text-sm text-slate-500">
          Secure payment via Stripe checkout. You will be redirected to complete the purchase.
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4">
          {property && (
            <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={absoluteImageUrl(property.images?.[0]) ?? FALLBACK_IMAGE}
                alt={property.title}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-400">
              {property ? PROPERTY_TYPES[property.propertyType] : "Property"}
            </p>
            <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
              {property?.title ?? "Property"}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <RentalStatusBadge status={request.status} />
              {payment && <PaymentStatusBadge status={payment.status} />}
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-400">Amount due</p>
            <p className="text-2xl font-bold text-brand-700">
              {property ? formatPrice(property.price) : formatPrice(payment?.amount ?? 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      {request.status !== "APPROVED" && !alreadyPaid && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-3 text-sm text-amber-800">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>
              This request is <b>{request.status}</b>. Payment is only possible after the
              landlord approves your request.
            </p>
          </CardContent>
        </Card>
      )}

      {alreadyPaid ? (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Payment already completed</h2>
            <p className="text-sm text-slate-600">
              This rental has been paid for. No further action is needed.
            </p>
            <Link href="/dashboard/tenant" className="mt-2">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Button
          size="lg"
          className="w-full"
          onClick={startPayment}
          loading={starting || paymentMutation.isPending}
          disabled={request.status !== "APPROVED"}
        >
          <CreditCard className="h-4 w-4" />
          {starting ? "Redirecting to Stripe..." : "Proceed to payment"}
        </Button>
      )}

      <p className="text-center text-xs text-slate-400">
        Payments are processed securely by Stripe. We never store your card details.
      </p>
    </div>
  );
}
