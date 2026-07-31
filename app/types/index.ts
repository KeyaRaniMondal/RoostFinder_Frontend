"use server";

export type Role = "Tenant" | "Landlord" | "Admin";
export type PropertyType = "APARTMENT" | "HOUSE" | "VILLA" | "OFFICE" | "LAND" | "SHOP";
export type PropertyPurpose = "SALE" | "RENT";
export type PropertyStatus = "ACTIVE" | "PENDING" | "SOLD" | "RENTED" | "REJECTED";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
    landLoard?: Landlord | null;
}

export interface ApiMeta {
    page: number;
    limit: number;
    total: number;
}

export type PropertyAmenity =
    | "SECURITY_24_7"
    | "ELEVATOR"
    | "GENERATOR_BACKUP"
    | "CCTV_SURVEILLANCE"
    | "CENTRAL_AC"
    | "ROOFTOP_GARDEN"
    | "GYM_ACCESS"
    | "WIFI"
    | "PARKING"
    | "PREPAID_GAS";

export interface Paginated<T> {
    data: T[];
    meta: ApiMeta;
}

export interface Property {
    id: string;
    title: string;
    description: string;
    propertyType: PropertyType;
    purpose: PropertyPurpose;
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
    status: PropertyStatus;
    landlordId: string;
    landlord?: Landlord;
    createdAt: string;
    updatedAt: string;
}

export interface Landlord {
    id: string;
    userId: string;
    phone: string;
    address?: string | null;
    dateOfBirth?: string | null;
    occupation?: string | null;
    companyName?: string | null;
    nidNumber?: string | null;
    profilePhoto?: string | null;
    bio?: string | null;
    isVerified: boolean;
    averageRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
    user?: Pick<User, "id" | "name" | "email" | "role">;
}

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: ApiMeta;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}
