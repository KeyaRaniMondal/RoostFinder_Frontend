"use client";

import { useState } from "react";
import {
  ChevronDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};


export default function ContactPage() {
  const [form, setForm] = useState(initialForm);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Replace with your actual API endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <MessageCircle className="h-7 w-7" />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              RoostFinder Support
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Contact Us
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
              Have a question, need help with your account, or found an issue?
              We&apos;d love to hear from you. Send us a message and our team
              will get back to you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
          >
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-foreground">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-foreground/65">
                Fill out the form below and tell us how we can help.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:ring-2 focus:ring-ring"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:ring-2 focus:ring-ring"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:ring-2 focus:ring-ring"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:ring-2 focus:ring-ring"
                  placeholder="Tell us more about your question..."
                />
              </div>

              <Button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </Button>

              {status === "success" && (
                <p className="text-sm font-medium text-green-600">
                  Thanks! Your message has been sent successfully.
                </p>
              )}

              {status === "error" && (
                <p className="text-sm font-medium text-destructive">
                  Something went wrong. Please try again later.
                </p>
              )}
            </div>
          </form>

          {/* Contact Information */}
          <div className="space-y-4">
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              value="support@roostfinder.com"
            />

            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              title="Phone"
              value="+880 1XXX-XXXXXX"
            />

            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              title="Location"
              value={
                <>
                  RoostFinder Support
                  <br />
                  Bangladesh
                </>
              }
            />

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm font-semibold text-foreground">
                Need a quick answer?
              </p>

              <p className="mt-2 text-sm leading-6 text-foreground/65">
                Check our frequently asked questions below before sending us a
                message.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>

          <div className="mt-1 text-sm leading-6 text-foreground/65">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}