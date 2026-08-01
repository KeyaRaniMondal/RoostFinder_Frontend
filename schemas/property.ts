import { z } from "zod";
import { PropertyAmenity, PropertyStatus } from "@/types";

const AMENITIES: PropertyAmenity[] = [
  "SECURITY_24_7",
  "ELEVATOR",
  "GENERATOR_BACKUP",
  "CCTV_SURVEILLANCE",
  "CENTRAL_AC",
  "ROOFTOP_GARDEN",
  "GYM_ACCESS",
  "WIFI",
  "PARKING",
  "PREPAID_GAS",
];

export const propertySchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(120, "Title is too long"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(2000, "Description is too long"),
    propertyType: z.enum(
      ["APARTMENT", "HOUSE", "VILLA", "OFFICE", "LAND", "SHOP"] as const,
      { message: "Select a property type" }
    ),
    purpose: z.enum(["SALE", "RENT"] as const, { message: "Select a purpose" }),
    price: z.coerce
      .number({ message: "Price must be a number" })
      .positive("Price must be greater than 0")
      .max(100_000_000, "Price is unrealistically high"),
    country: z.string().min(2, "Country is required"),
    division: z.string().min(1, "Division is required"),
    district: z.string().min(1, "District is required"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    address: z.string().min(3, "Address is required"),
    bedrooms: z.coerce.number().int("Must be a whole number").min(0).max(50).optional(),
    bathrooms: z.coerce.number().int("Must be a whole number").min(0).max(50).optional(),
    balconies: z.coerce.number().int("Must be a whole number").min(0).max(20).optional(),
    floor: z.coerce.number().int("Must be a whole number").min(0).max(300).optional(),
    totalFloors: z.coerce.number().int("Must be a whole number").min(0).max(300).optional(),
    areaSize: z.coerce.number().min(0).optional(),
    furnished: z.boolean().default(false),
    images: z
      .array(z.string().url("Each image must be a valid URL"))
      .min(1, "Add at least one image URL")
      .max(12, "Up to 12 images"),
    amenities: z.array(z.enum(AMENITIES as [PropertyAmenity, ...PropertyAmenity[]])).default([]),
    status: z
      .enum(["ACTIVE", "PENDING", "SOLD", "RENTED", "REJECTED"] as const)
      .default("ACTIVE"),
  })
  .superRefine((val, ctx) => {
    if (val.purpose === "RENT") {
      if (!val.areaSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["areaSize"],
          message: "Area size (sqft) is required for rentals",
        });
      }
      if (val.propertyType !== "LAND" && !val.bedrooms && !val.bathrooms) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bedrooms"],
          message: "Add at least bedrooms or bathrooms for this property type",
        });
      }
    }
  });

export type PropertyFormValues = z.infer<typeof propertySchema>;

export function propertyToFormValues(property: {
  title: string;
  description: string;
  propertyType: PropertyFormValues["propertyType"];
  purpose: PropertyFormValues["purpose"];
  price: number;
  country: string;
  division: string;
  district: string;
  city: string;
  area: string;
  address: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  balconies?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  areaSize?: number | null;
  furnished: boolean;
  images: string[];
  amenities: PropertyAmenity[];
  status?: PropertyStatus;
}): PropertyFormValues {
  return {
    title: property.title,
    description: property.description,
    propertyType: property.propertyType,
    purpose: property.purpose,
    price: property.price,
    country: property.country,
    division: property.division,
    district: property.district,
    city: property.city,
    area: property.area,
    address: property.address,
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined,
    balconies: property.balconies ?? undefined,
    floor: property.floor ?? undefined,
    totalFloors: property.totalFloors ?? undefined,
    areaSize: property.areaSize ?? undefined,
    furnished: property.furnished,
    images: property.images,
    amenities: property.amenities,
    status: property.status ?? "ACTIVE",
  };
}
