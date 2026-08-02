import { RentalRequest } from "@/types";

export type DisplayStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export function deriveDisplayStatus(request: RentalRequest): DisplayStatus {
  if (request.status === "PENDING") return "PENDING";
  if (request.status === "REJECTED") return "REJECTED";
  if (request.status === "COMPLETED") return "COMPLETED";
  if (request.status === "ACTIVE") return "ACTIVE";
  if (request.status === "APPROVED") {
    if (request.payment?.status === "SUCCEEDED") return "ACTIVE";
    return "APPROVED";
  }
  return "PENDING";
}
