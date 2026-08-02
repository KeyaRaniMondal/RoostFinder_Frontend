import {
  ActiveStatus,
  PaymentStatus,
  PropertyAmenity,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
  RentalStatus,
  Role,
} from "@/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const ROLES: Record<Role, { label: string; description: string }> = {
  Tenant: {
    label: "Tenant",
    description: "Find your next home and rent it",
  },
  Landlord: {
    label: "Landlord",
    description: "List properties and manage tenants",
  },
  Admin: {
    label: "Admin",
    description: "Moderate the platform",
  },
};

export const PROPERTY_TYPES: Record<PropertyType, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  VILLA: "Villa",
  OFFICE: "Office",
  LAND: "Land",
  SHOP: "Shop",
};

export const PROPERTY_PURPOSES: Record<PropertyPurpose, string> = {
  SALE: "For Sale",
  RENT: "For Rent",
};

export const PROPERTY_STATUS: Record<PropertyStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  SOLD: "Sold",
  RENTED: "Rented",
  REJECTED: "Rejected",
};

export const AMENITIES: Record<PropertyAmenity, string> = {
  SECURITY_24_7: "24/7 Security",
  ELEVATOR: "Elevator",
  GENERATOR_BACKUP: "Generator Backup",
  CCTV_SURVEILLANCE: "CCTV Surveillance",
  CENTRAL_AC: "Central AC",
  ROOFTOP_GARDEN: "Rooftop Garden",
  GYM_ACCESS: "Gym Access",
  WIFI: "Wi-Fi",
  PARKING: "Parking",
  PREPAID_GAS: "Prepaid Gas",
};

export const RENTAL_STATUS_LABELS: Record<RentalStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ACTIVE: "Active",
  COMPLETED: "Completed",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  SUCCEEDED: "Succeeded",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const ACTIVE_STATUS_LABELS: Record<ActiveStatus, string> = {
  ACTIVE: "Active",
  BANNED: "Banned",
};

export const DASHBOARD_ROLE_BASE_URL: Record<Role, string> = {
  Tenant: "/dashboard/tenant",
  Landlord: "/dashboard/landlord",
  Admin: "/dashboard/admin",
};

export const FALLBACK_IMAGE = "/placeholder.svg";
