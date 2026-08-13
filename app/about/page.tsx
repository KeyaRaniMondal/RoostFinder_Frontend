import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CreditCard,
  Eye,
  KeyRound,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about RoostFinder — the trusted platform connecting tenants with verified landlords for simple, secure renting.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & transparency",
    text: "Every listing is reviewed before it goes live, so what you see is what you get — no surprises.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    text: "Rent securely through Stripe checkout. Payments are processed reliably, and history is tracked.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Accounts are checked and community reviews keep both tenants and landlords accountable.",
  },
  {
    icon: Users,
    title: "Community-driven",
    text: "Genuine reviews from real renters help everyone make confident decisions about their next home.",
  },
];

const tenantSteps = [
  {
    icon: Search,
    step: "01",
    title: "Browse & request",
    text: "Search verified properties by location, type, and budget, then request to rent in a few clicks.",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Pay securely",
    text: "Once a landlord approves your request, complete payment through a secure Stripe checkout.",
  },
  {
    icon: KeyRound,
    step: "03",
    title: "Move in & review",
    text: "Move into your new home and leave a review to help future tenants find the right place.",
  },
];

const landlordSteps = [
  {
    icon: Building2,
    step: "01",
    title: "Create your profile",
    text: "Sign up as a landlord and tell tenants who you are and what you manage.",
  },
  {
    icon: MapPin,
    step: "02",
    title: "List your property",
    text: "Add photos, amenities, and pricing to showcase your property to interested tenants.",
  },
  {
    icon: Users,
    step: "03",
    title: "Manage requests",
    text: "Review incoming rental requests, approve the right tenant, and get paid securely.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
              <Sparkles className="h-3.5 w-3.5" /> About RoostFinder
            </Badge>

            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Making renting simpler for{" "}
                <span className="text-brand-600">everyone</span>
              </h1>

              <p className="mt-5 text-base leading-7 text-foreground/70 sm:text-lg">
                RoostFinder is a trusted rental platform that connects tenants with
                verified landlords — combining verified listings, secure online
                payments, and a community of real reviews in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our story
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Finding a home should feel easy, not stressful
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-foreground/75">
              <p>
                Renting a property often means endless scrolling, unverified
                listings, and risky cash payments. We started RoostFinder to
                fix that — a single place where tenants can find genuine homes
                and landlords can find genuine tenants.
              </p>
              <p>
                Today our platform connects thousands of tenants and landlords
                every day, handling everything from the initial request to the
                final review. Every listing is checked, every payment is
                protected, and every voice is heard through community reviews.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Our mission</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  To make finding and renting a home transparent, secure, and
                  stress-free for everyone — one verified listing at a time.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-4 border-t pt-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900 dark:text-brand-200">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Our vision</h3>
                <p className="mt-2 text-sm leading-6 text-foreground/70">
                  A world where anyone can find their next home with complete
                  confidence and rent without ever worrying about trust or
                  payment safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              What we stand for
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Built on trust, backed by community
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-brand-300 hover:shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900 dark:text-brand-200">
                <value.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{value.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Simple for tenants, simple for landlords
            </h2>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <BadgeCheck className="h-5 w-5 text-brand-600" /> For tenants
              </h3>
              <div className="mt-6 space-y-6">
                {tenantSteps.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">{s.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Building2 className="h-5 w-5 text-brand-600" /> For landlords
              </h3>
              <div className="mt-6 space-y-6">
                {landlordSteps.map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">{s.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to find your next home?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Browse verified rentals, or own a property? List it today and start
            receiving rental requests — all free.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/properties">
              <Button size="lg" className="w-full bg-brand-500 text-white hover:bg-brand-600 sm:w-auto">
                Browse properties <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register?role=Landlord">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/25 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                Become a landlord
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Mail className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Get in touch
              </h2>
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                Have a question, feedback, or want to partner with us? We&apos;d
                love to hear from you.
              </p>
              <a
                href="mailto:hello@roostfinder.com"
                className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
              >
                hello@roostfinder.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
