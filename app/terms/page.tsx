import type { Metadata } from "next";
import { FileText, Mail, CalendarDays } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "Read the terms and conditions for using the RoostFinder rental platform.",
};

const sections = [
    {
        number: "01",
        title: "Acceptance of Terms",
        content: (
            <p>
                By accessing or using RoostFinder, you agree to be bound by these
                Terms of Service. If you do not agree with any part of these terms,
                please do not use our platform or services.
            </p>
        ),
    },
    {
        number: "02",
        title: "Use of the Platform",
        content: (
            <p>
                You agree to use RoostFinder only for lawful purposes and in
                accordance with these Terms. You are responsible for the accuracy of
                any information you provide, including property listings, personal
                details, and account information. You are also responsible for
                maintaining the confidentiality of your account credentials.
            </p>
        ),
    },
    {
        number: "03",
        title: "Property Listings",
        content: (
            <p>
                Property owners and landlords are responsible for ensuring that the
                information they provide about their properties is accurate and
                up-to-date. RoostFinder does not guarantee the accuracy, completeness,
                availability, or condition of any property listing. Users should
                independently verify property details before entering into any rental
                agreement or making a payment.
            </p>
        ),
    },
    {
        number: "04",
        title: "User Responsibilities",
        content: (
            <ul className="space-y-3">
                {[
                    "Provide accurate and truthful information",
                    "Use the platform respectfully and lawfully",
                    "Do not create fraudulent or misleading property listings",
                    "Do not attempt to gain unauthorized access to other accounts",
                    "Do not use the platform to engage in fraudulent or harmful activities",
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
        number: "05",
        title: "Payments and Transactions",
        content: (
            <p>
                Any payments made through RoostFinder may be subject to the terms and
                conditions of the applicable payment provider. RoostFinder facilitates
                certain transactions but does not guarantee the outcome of agreements
                between tenants and landlords. Users are responsible for reviewing
                payment details before completing a transaction.
            </p>
        ),
    },
    {
        number: "06",
        title: "Limitation of Liability",
        content: (
            <p>
                RoostFinder is provided on an "as is" and "as available" basis. To the
                extent permitted by applicable law, we are not responsible for losses,
                damages, disputes, or other consequences resulting from your use of
                the platform, reliance on property listings, or agreements between
                users.
            </p>
        ),
    },
    {
        number: "07",
        title: "Account Suspension and Termination",
        content: (
            <p>
                We reserve the right to suspend or terminate accounts that violate
                these Terms, misuse the platform, provide fraudulent information, or
                engage in activities that may harm other users or RoostFinder. Users
                may also stop using the platform at any time.
            </p>
        ),
    },
    {
        number: "08",
        title: "Governing Law",
        content: (
            <p>
                These Terms are governed by the applicable laws of the jurisdiction
                in which RoostFinder operates, unless otherwise required by applicable
                law. Any disputes should first be addressed by contacting our team so
                that we can attempt to resolve the matter.
            </p>
        ),
    },
    {
        number: "09",
        title: "Changes to These Terms",
        content: (
            <p>
                We may update these Terms of Service from time to time. When
                significant changes are made, we will update the date shown at the top
                of this page and, where appropriate, notify users through the
                platform.
            </p>
        ),
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <section className="border-b bg-muted/30">
                <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
                    <div className="flex flex-col items-start gap-6">
                        {/* Icon */}
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                            <FileText className="h-7 w-7" />
                        </div>

                        {/* Heading */}
                        <div>
                            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                                RoostFinder
                            </p>

                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Terms of Service
                            </h1>

                            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
                                Please read these terms carefully before using RoostFinder.
                                They explain your responsibilities and the rules that apply
                                when using our platform.
                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-foreground/60">
                                <CalendarDays className="h-4 w-4" />
                                Last updated: August 9, 2026
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
                <div className="space-y-5">
                    {sections.map((section) => (
                        <article
                            key={section.number}
                            className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
                        >
                            <div className="flex gap-5">
                                {/* Section Number */}
                                <div className="hidden shrink-0 sm:flex">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                                        {section.number}
                                    </div>
                                </div>

                                {/* Content */}
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

                {/* Contact Card */}
                <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Mail className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Questions about these terms?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-foreground/70">
                                If you have questions about these Terms of Service or need
                                clarification about using RoostFinder, contact our team at:
                            </p>

                            <a
                                href="mailto:legal@roostfinder.com"
                                className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
                            >
                                legal@roostfinder.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}