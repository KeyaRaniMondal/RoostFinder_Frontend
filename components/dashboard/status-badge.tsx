import { Badge } from "@/components/ui/badge";
import { RENTAL_STATUS_LABELS, PAYMENT_STATUS_LABELS, ACTIVE_STATUS_LABELS } from "@/lib/constants";
import { RentalStatus, PaymentStatus, ActiveStatus } from "@/types";

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "secondary";

function rentalTone(status: RentalStatus): BadgeTone {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "info";
    case "REJECTED":
      return "danger";
    case "ACTIVE":
      return "success";
    case "COMPLETED":
      return "neutral";
  }
}

function paymentTone(status: PaymentStatus): BadgeTone {
  switch (status) {
    case "SUCCEEDED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "danger";
    case "REFUNDED":
      return "secondary";
  }
}

function activeTone(status: ActiveStatus): BadgeTone {
  return status === "ACTIVE" ? "success" : "danger";
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <Badge variant={rentalTone(status)}>{RENTAL_STATUS_LABELS[status] ?? status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={paymentTone(status)}>{PAYMENT_STATUS_LABELS[status] ?? status}</Badge>;
}

export function ActiveStatusBadge({ status }: { status: ActiveStatus }) {
  return <Badge variant={activeTone(status)}>{ACTIVE_STATUS_LABELS[status] ?? status}</Badge>;
}
