import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, KeyRound, ShieldCheck, Search } from "lucide-react";
import { serverFetch } from "@/lib/api";
import { Paginated, Property } from "@/types";
import { PropertyGrid } from "@/components/properties/property-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default async function HomePage() {
  const featured = await getFeaturedProperties();

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
            <form action="/properties" className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  name="searchTerm"
                  placeholder="Search by title, area or district..."
                  className="h-11 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="sm:w-auto">
                Search properties <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured rentals</h2>
            <p className="mt-1 text-sm text-slate-500">
              Popular properties to rent right now
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-slate-100"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6">
          {featured.length ? (
            <PropertyGrid properties={featured} />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              No featured properties yet. <Link href="/auth/register?role=Landlord" className="font-medium text-brand-600">Be the first to list one →</Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="rounded-2xl border border-slate-200 p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <perk.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{perk.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{perk.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Own a property? List it today.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
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
