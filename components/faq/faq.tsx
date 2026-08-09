"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        question: "How do I find a property on RoostFinder?",
        answer:
            "Go to the Browse Properties page and use the available search and filter options to find properties based on your preferred location, price, property type, and other criteria.",
    },
    {
        question: "How can I request a property?",
        answer:
            "After signing in as a tenant, open the property you are interested in and submit a rental request. You can track the status of your requests from your dashboard.",
    },
    {
        question: "How can I list my property?",
        answer:
            "Landlords can sign in to their account and use the dashboard to create and manage property listings. You can provide details such as location, rent, property type, amenities, and images.",
    },
    {
        question: "How do I know whether my rental request was approved?",
        answer:
            "You can check the status of your rental requests from your dashboard. Requests may be pending, approved, rejected, or cancelled depending on the landlord's decision.",
    },
    {
        question: "Are payments made through RoostFinder secure?",
        answer:
            "RoostFinder uses an integrated payment provider to process supported transactions. Payment information is handled by the payment provider rather than being stored directly by RoostFinder.",
    },
    {
        question: "Can I update my account information?",
        answer:
            "Yes. Once you are signed in, you can manage your account information from your dashboard and profile settings.",
    },
    {
        question: "What should I do if I find an incorrect or suspicious listing?",
        answer:
            "Please contact our support team and provide the property details and a description of the issue. Our team can review the listing and take appropriate action.",
    },
    {
        question: "I still have a question. How can I contact RoostFinder?",
        answer:
            "You can use the contact form on this page to send us a message. Our support team will review your request and get back to you as soon as possible.",
    },
];

export default function frequentlyAsked() {

    const [openFaq, setOpenFaq] = useState<number | null>(0);



    return (
        <main className="min-h-screen bg-background">
            {/* FAQ */}
            <section className="bg-background py-20 sm:py-24">
                <div className="mx-auto max-w-5xl px-6">
                    {/* Section Header */}
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                            Frequently Asked Questions
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Everything you need to know
                        </h2>

                        <p className="mt-4 text-base leading-7 text-foreground/65">
                            Have questions about finding a home, listing a property, or using
                            RoostFinder? Find quick answers to the most common questions below.
                        </p>
                    </div>

                    {/* FAQ List */}
                    <div className="mx-auto max-w-3xl space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;

                            return (
                                <div
                                    key={faq.question}
                                    className={`overflow-hidden rounded-2xl border bg-card transition-all duration-200 ${isOpen
                                            ? "border-primary/30 shadow-sm"
                                            : "border-border hover:border-primary/20"
                                        }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
                                        aria-expanded={isOpen}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Number */}
                                            <span
                                                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${isOpen
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-primary/10 text-primary"
                                                    }`}
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <span className="text-sm font-semibold leading-6 text-foreground sm:text-base">
                                                {faq.question}
                                            </span>
                                        </div>

                                        <ChevronDown
                                            className={`h-5 w-5 shrink-0 text-foreground/50 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""
                                                }`}
                                        />
                                    </button>

                                    <div
                                        className={`grid transition-all duration-200 ${isOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="border-t px-5 pb-5 pt-4 sm:px-6 sm:pl-[4.25rem]">
                                                <p className="text-sm leading-7 text-foreground/65">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-primary/5 px-6 py-7 text-center ring-1 ring-primary/10">
                        <h3 className="text-base font-semibold text-foreground">
                            Still have questions?
                        </h3>

                        <p className="mt-2 text-sm text-foreground/65">
                            Our team is happy to help you with anything about RoostFinder.
                        </p>

                        <a
                            href="/contact"
                            className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
                        >
                            Contact our team
                            <span className="ml-1">→</span>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

