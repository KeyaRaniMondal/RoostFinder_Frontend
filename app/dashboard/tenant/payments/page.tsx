"use client";

import { useAuth } from "@/hooks/use-auth";
import { useMyPayments } from "@/hooks/use-rentals";
import { PaymentsTable } from "@/components/dashboard/payments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function TenantPaymentsPage() {
  const { user } = useAuth();
  const { data: payments, isLoading } = useMyPayments(user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Payment history</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-600" /> All payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable payments={payments} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
