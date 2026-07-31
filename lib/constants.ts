import { PropertyAmenity, PropertyPurpose, PropertyType} from "@/app/types";

export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

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


export const FALLBACK_IMAGE = "/placeholder.svg";