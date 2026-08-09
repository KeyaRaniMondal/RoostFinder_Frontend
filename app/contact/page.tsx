"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const metadataInfo = {
  title: "Contact Us",
};

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      // TODO: replace with your actual API endpoint, e.g. /api/contact
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Contact Us</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Have a question or need help? We'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-xs font-medium text-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="mb-1 block text-xs font-medium text-foreground">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-xs font-medium text-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={handleChange}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Tell us more..."
            />
          </div>

          <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
            {status === "submitting" ? "Sending..." : "Send Message"}
          </Button>

          {status === "success" && (
            <p className="text-sm text-green-600">Thanks! Your message has been sent.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-destructive">
              Something went wrong. Please try again later.
            </p>
          )}
        </form>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">Email</h2>
            <p className="mt-1 text-sm text-muted-foreground">support@yourcompany.com</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">Phone</h2>
            <p className="mt-1 text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">Office</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              123 Market Street, Suite 400
              <br />
              San Francisco, CA 94103
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}