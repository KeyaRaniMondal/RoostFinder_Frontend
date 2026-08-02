"use client";

import { Payment } from "@/types";
import { PaymentStatusBadge } from "@/components/dashboard/status-badge";
import { formatDate, formatDateTime, formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentsTable({
  payments,
  isLoading,
}: {
  payments?: Payment[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (!payments?.length) {
    return (
      <EmptyState
        title="No payments yet"
        description="Once a rental request is approved you can pay here securely."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2.5 font-semibold">Property</th>
            <th className="px-3 py-2.5 font-semibold">Amount</th>
            <th className="px-3 py-2.5 font-semibold">Status</th>
            <th className="px-3 py-2.5 font-semibold">Date</th>
            <th className="hidden px-3 py-2.5 font-semibold sm:table-cell">Reference</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
              <td className="px-3 py-3 font-medium text-slate-900">
                {payment.property?.title ?? "Property"}
              </td>
              <td className="px-3 py-3 font-semibold text-slate-800">
                {formatPrice(payment.amount, payment.currency)}
              </td>
              <td className="px-3 py-3">
                <PaymentStatusBadge status={payment.status} />
              </td>
              <td className="px-3 py-3 text-slate-600">{formatDateTime(payment.createdAt)}</td>
              <td className="hidden px-3 py-3 font-mono text-xs text-slate-400 sm:table-cell">
                {payment.stripePaymentIntentId?.slice(0, 18) ?? payment.stripeSessionId?.slice(0, 18) ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
