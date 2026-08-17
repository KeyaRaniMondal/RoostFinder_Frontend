export type Role = "Tenant" | "Landlord" | "Admin";
export type ActiveStatus = "ACTIVE" | "BANNED";
export type PropertyType = "APARTMENT" | "HOUSE" | "VILLA" | "OFFICE" | "LAND" | "SHOP";
export type PropertyPurpose = "SALE" | "RENT";
export type PropertyStatus = "ACTIVE" | "PENDING" | "SOLD" | "RENTED" | "REJECTED";
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
export type RentalStatus = "APPROVED" | "PENDING" | "REJECTED" | "COMPLETED" | "ACTIVE";
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface Paginated<T> {
  data: T[];
  meta: ApiMeta;
}

export interface Profile {
  id: string;
  profilePhoto?: string | null;
  bio?: string | null;
  userId: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeStatus: ActiveStatus;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  createdAt: string;
  updatedAt: string;
  profiel?: Profile | null;
  landLoard?: Landlord | null;
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

export interface RentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  status: RentalStatus;
  message?: string | null;
  moveInDate?: string | null;
  property?: Property;
  tenant?: Pick<User, "id" | "name" | "email">;
  payment?: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string | null;
  stripeSessionId?: string | null;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  property?: Property;
  rentalRequest?: RentalRequest;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  tenantId: string;
  propertyId: string;
  rentalRequestId: string;
  tenant?: Pick<User, "id" | "name">;
  property?: Property;
  createdAt: string;
  updatedAt: string;
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
