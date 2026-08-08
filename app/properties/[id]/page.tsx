import { notFound } from "next/navigation";
import { BedDouble, Bath, Building2, Compass, MapPin, Ruler, Layers, Sofa } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { Property } from "@/types";
import { AMENITIES, PROPERTY_PURPOSES, PROPERTY_TYPES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { RequestRentCTA } from "@/components/properties/request-rent-cta";
import { ReviewSection } from "@/components/properties/review-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getProperty(id: string) {
  try {
    return await serverFetch<Property>(`/api/properties/${id}`);
  } catch {
    return null;
  }
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const facts = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms ?? "—" },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms ?? "—" },
    { icon: Ruler, label: "Area", value: property.areaSize ? `${property.areaSize} sqft` : "—" },
    { icon: Layers, label: "Floor", value: property.floor ? `${property.floor} of ${property.totalFloors ?? "—"}` : "—" },
    { icon: Sofa, label: "Furnished", value: property.furnished ? "Yes" : "No" },
  ];

  const landlord = property.landlord;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <a href="/properties" className="hover:text-brand-600">Properties</a>
        <span>/</span>
        <span className="line-clamp-1 text-foreground">{property.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <PropertyGallery images={property.images} title={property.title} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-brand-200">{PROPERTY_TYPES[property.propertyType]}</Badge>
              <Badge className={property.purpose === "RENT" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-foreground"}>
                {PROPERTY_PURPOSES[property.purpose]}
              </Badge>
              {property.status !== "ACTIVE" && (
                <Badge variant="outline">{property.status}</Badge>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{property.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {[property.address, property.area, property.city, property.district, property.division, property.country]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="mt-3 text-3xl font-bold text-brand-700">
              {formatPrice(property.price)}
              <span className="text-base font-medium text-muted-foreground">
                {property.purpose === "RENT" ? " / month" : ""}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-border bg-card p-3 text-center">
                <fact.icon className="mx-auto h-5 w-5 text-brand-600" />
                <p className="mt-2 text-lg font-bold text-foreground">{fact.value}</p>
                <p className="text-xs text-muted-foreground">{fact.label}</p>
              </div>
            ))}
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
                    {AMENITIES[amenity] ?? amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-foreground">About this property</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {property.description}
            </p>
          </div>

          <ReviewSection propertyId={property.id} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card>
            <CardContent className="space-y-4">
              <p className="text-2xl font-bold text-foreground">
                {formatPrice(property.price)}
                <span className="text-sm font-medium text-muted-foreground">
                  {property.purpose === "RENT" ? " /month" : ""}
                </span>
              </p>
              <RequestRentCTA propertyId={property.id} propertyTitle={property.title} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-brand-600" /> Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg bg-muted">
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="h-8 w-8" />
                  <p className="px-4 text-center text-xs">
                    {property.city}, {property.district}
                    <br />
                    {property.area}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{property.address}</p>
            </CardContent>
          </Card>

          {landlord && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-brand-600" /> Landlord
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700 dark:bg-brand-900 dark:text-brand-200">
                    {landlord.user?.name?.charAt(0)?.toUpperCase() ?? "L"}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{landlord.user?.name ?? "Landlord"}</p>
                    <p className="text-sm text-muted-foreground">{landlord.phone}</p>
                  </div>
                </div>
                {landlord.bio && <p className="mt-3 text-sm text-muted-foreground">{landlord.bio}</p>}
                <div className="mt-3 flex gap-4 border-t border-border pt-3 text-sm">
                  <span className="text-muted-foreground">
                    ⭐ <b>{landlord.averageRating?.toFixed(1) ?? "0.0"}</b>
                  </span>
                  <span className="text-muted-foreground">
                    <b>{landlord.totalReviews}</b> reviews
                  </span>
                  {landlord.isVerified && (
                    <span className="text-emerald-600 font-medium dark:text-emerald-400">✓ Verified</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
