"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useConfirmPayment } from "@/hooks/use-rentals";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const confirm = useConfirmPayment();
  const { status } = useAuth();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No payment session found.");
      return;
    }
    confirm.mutateAsync(sessionId).then(
      () => setVerified(true),
      (err) => setError((err as Error).message)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Payment could not be verified</h1>
        <p className="mt-3 text-sm text-slate-500">{error}</p>
        <Link href="/dashboard/tenant" className="mt-6 inline-block">
          <Button>Go to dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center animate-fade-in">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        {verified ? (
          <CheckCircle2 className="h-11 w-11 text-emerald-600" />
        ) : (
          <Loader2 className="h-11 w-11 animate-spin text-emerald-600" />
        )}
      </span>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Payment successful!</h1>
      <p className="mt-3 text-sm text-slate-500">
        {verified
          ? "Thank you! Your rental payment has been received. The rental is now active."
          : "Verifying your payment with the gateway..."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {status === "authenticated" && (
          <Link href="/dashboard/tenant">
            <Button>View my dashboard</Button>
          </Link>
        )}
        <Link href="/properties">
          <Button variant="outline">Continue browsing</Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm text-slate-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
