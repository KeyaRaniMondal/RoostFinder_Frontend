"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, KeyRound, LogIn, Send } from "lucide-react";
import { RequestRentModal } from "@/components/properties/request-rent-modal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function RequestRentCTA({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const { user, status } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link href={`/auth/login?next=/properties/${propertyId}`} className="block">
        <Button size="lg" className="w-full">
          <LogIn className="h-4 w-4" /> Log in to request this rental
        </Button>
      </Link>
    );
  }

  if (user.role !== "Tenant") {
    return (
      <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        <KeyRound className="mb-1 h-4 w-4 text-slate-400" />
        Only tenants can request rentals. If you&apos;re a landlord, you can list your own
        properties instead.
      </div>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full"
        loading={status === "loading"}
        onClick={() => setOpen(true)}
      >
        <Send className="h-4 w-4" /> Request to Rent
      </Button>
      <p className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-400">
        <CalendarClock className="h-3 w-3" /> Free request — you only pay after approval
      </p>
      <RequestRentModal
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
