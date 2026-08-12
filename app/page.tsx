import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, KeyRound, ShieldCheck, Search, Home, Castle, Briefcase, LandPlot, Store } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { Paginated, Property, PropertyType } from "@/types";
import { PropertyGrid } from "@/components/properties/property-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PROPERTY_TYPES } from "@/lib/constants";
import FrequentlyAsked from "@/components/faq/faq";

const heroImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=80";

const perks = [
  {
    icon: Building2,
    title: "Verified listings",
    text: "Every property is checked by our team before it goes live.",
  },
  {
    icon: KeyRound,
    title: "Request & pay online",
    text: "Request a rental and pay securely through Stripe checkout.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted tenants",
    text: "Reviews and verified profiles keep the community safe.",
  },
];

export const dynamic = "force-dynamic";

async function getFeaturedProperties() {
  try {
    const data = await serverFetch<Paginated<Property>>("/api/properties?limit=6&purpose=RENT");
    return data.data ?? [];
  } catch {
    return [] as Property[];
  }
}

const propertyTypeIcons: Record<PropertyType, typeof Home> = {
  APARTMENT: Building2,
  HOUSE: Home,
  VILLA: Castle,
  OFFICE: Briefcase,
  LAND: LandPlot,
  SHOP: Store,
};

const PROPERTY_TYPE_ORDER: PropertyType[] = [
  "APARTMENT",
  "HOUSE",
  "VILLA",
  "OFFICE",
  "SHOP",
  "LAND",
];


async function getCategories(): Promise<PropertyType[]> {
  try {
    const categories = await serverFetch<PropertyType[]>("/api/categories");
    return Array.isArray(categories) ? categories : [];
  } catch {
    return [];
  }
}

async function getRentTypeCounts(
  categories: PropertyType[]
): Promise<Array<{ type: PropertyType; count: number }>> {
  try {
    const types = categories.length > 0 ? categories : PROPERTY_TYPE_ORDER;
    const results = await Promise.all(
      types.map(async (type) => {
        const data = await serverFetch<Paginated<Property>>(
          `/api/properties?purpose=RENT&propertyType=${type}&limit=1`
        );
        return { type, count: data.meta?.total ?? 0 };
      })
    );
    return results;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProperties();
  const categories = await getCategories();
  const typeCounts = await getRentTypeCounts(categories);
  const typesWithRentals = typeCounts.filter((t) => t.count > 0);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
        <Image
          src={heroImage}
          alt="A beautiful property"
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <Badge className="mb-5 bg-white/15 text-white backdrop-blur">
            Find your next home
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Discover a place you&apos;ll love to call home
          </h1>
          <p className="mt-5 max-w-2xl text-base text-brand-100/90 sm:text-lg">
            Browse apartments, houses and villas, request to rent in a few clicks, and pay
            securely online.
          </p>
          <div className="mt-9 w-full max-w-2xl">
            <form action="/properties" className="flex flex-col gap-2 rounded-2xl bg-card p-2 shadow-2xl sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <input
                  name="searchTerm"
                  placeholder="Search by title, area or district..."
                  className="h-11 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="sm:w-auto">
                Search properties <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>
      {typesWithRentals.length > 0 && (
        <section className=" mx-auto max-w-7xl px-4 py-16 mt-10 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-6 py-4 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Types of properties</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore the different types of properties we have for rent
              </p>
            </div>
            <Link
              href="/properties?purpose=RENT"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-muted"
            >
              Browse all rentals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
            {typesWithRentals.map(({ type, count }) => {
              const Icon = propertyTypeIcons[type];
              return (
                <Link
                  key={type}
                  href={`/properties?purpose=RENT&propertyType=${type}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-brand-300 hover:shadow-card"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950 dark:text-brand-200">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1 ">
                    <h3 className="text-base font-semibold text-foreground">
                      {PROPERTY_TYPES[type]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {count} {count === 1 ? "listing" : "listings"} for rent
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured rentals</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Popular properties to rent right now
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-muted"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6">
          {featured.length ? (
            <PropertyGrid properties={featured} />
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No featured properties yet. <Link href="/auth/register?role=Landlord" className="font-medium text-brand-600">Be the first to list one →</Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="rounded-2xl border border-border p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900 dark:text-brand-200">
                  <perk.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{perk.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{perk.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

<FrequentlyAsked />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Own a property? List it today.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Create your landlord profile, add your listings, and start receiving rental
            requests — all free.
          </p>
          <Link href="/auth/register?role=Landlord">
            <Button size="lg" className="mt-7 bg-brand-500 text-white hover:bg-brand-600">
              Become a landlord
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
