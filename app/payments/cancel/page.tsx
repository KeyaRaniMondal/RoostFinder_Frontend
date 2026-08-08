import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
        <XCircle className="h-11 w-11 text-red-600 dark:text-red-400" />
      </span>
      <h1 className="mt-6 text-3xl font-bold text-foreground">Payment cancelled</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        You cancelled the payment. No money was charged. You can try again whenever you&apos;re
        ready.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard/tenant">
          <Button>Back to my requests</Button>
        </Link>
        <Link href="/properties">
          <Button variant="outline">Continue browsing</Button>
        </Link>
      </div>
    </div>
  );
}
