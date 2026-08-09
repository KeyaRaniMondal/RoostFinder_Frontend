import type { Metadata } from "next";
import { ShieldCheck, Mail, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how RoostFinder collects, uses, and protects your personal information.",
};

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content: (
      <p>
        We collect information you provide directly to us, such as your{" "}
        <strong>name, email address, and phone number</strong> when you create
        an account, list a property, or contact us. We also automatically
        collect certain information about your device and usage of our
        platform, including IP address, browser type, and pages visited.
      </p>
    ),
  },
  {
    number: "02",
    title: "How We Use Your Information",
    content: (
      <ul className="space-y-3">
        {[
          "To provide, maintain, and improve our services",
          "To communicate with you about your account or inquiries",
          "To personalize your search results and recommendations",
          "To detect, prevent, and address fraud or security issues",
        ].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    number: "03",
    title: "Sharing of Information",
    content: (
      <p>
        We do not sell your personal information. We may share it with
        service providers who help us operate our platform, when required by
        law, or with your consent. For example, information may be shared when
        you contact a property owner through our platform.
      </p>
    ),
  },
  {
    number: "04",
    title: "Cookies",
    content: (
      <p>
        We use cookies and similar technologies to keep you signed in,
        remember your preferences, and understand how you use our platform.
        You can control cookies through your browser settings.
      </p>
    ),
  },
  {
    number: "05",
    title: "Data Security",
    content: (
      <p>
        We implement reasonable technical and organizational measures to
        protect your information. However, no method of transmission over the
        internet is completely secure, and we cannot guarantee absolute
        security.
      </p>
    ),
  },
  {
    number: "06",
    title: "Your Rights",
    content: (
      <p>
        Depending on your location, you may have the right to access, correct,
        or delete your personal information. To exercise these rights, contact
        us using the email address provided below.
      </p>
    ),
  },
  {
    number: "07",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. We&apos;ll notify
        you of any material changes by posting the updated policy on this page.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="flex flex-col items-start gap-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                RoostFinder
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Privacy Policy
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
                Your privacy matters to us. This policy explains what
                information we collect, how we use it, and how we protect your
                data while you use RoostFinder.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground/60">
                <CalendarDays className="h-4 w-4" />
                Last updated: August 9, 2026
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <div className="space-y-5">
          {sections.map((section) => (
            <article
              key={section.number}
              className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
            >
              <div className="flex gap-5">
                {/* Number */}
                <div className="hidden shrink-0 sm:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {section.number}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {section.title}
                  </h2>

                  <div className="mt-4 text-[15px] leading-7 text-foreground/75 [&_strong]:font-semibold [&_strong]:text-foreground">
                    {section.content}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Mail className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Questions about your privacy?
              </h2>

              <p className="mt-2 text-sm leading-6 text-foreground/70">
                If you have questions about this Privacy Policy or want to
                exercise your privacy rights, contact our privacy team at:
              </p>

              <a
                href="mailto:privacy@roostfinder.com"
                className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
              >
                privacy@roostfinder.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}