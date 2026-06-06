import { useEffect, useRef, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first input if user lands on the form via hash
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#consultation-form") {
      requestAnimationFrame(() => {
        firstInputRef.current?.focus({ preventScroll: false });
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return; // prevent duplicate submits

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      fullName: String(fd.get("fullName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      requirements: String(fd.get("requirements") || "").trim(),
      companyName: String(fd.get("companyName") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      website: String(fd.get("website") || "").trim(),
      crmUsed: String(fd.get("crmUsed") || "").trim(),
      preferredMeetingTime: String(fd.get("preferredMeetingTime") || "").trim(),
      engagementType: String(fd.get("engagementType") || "").trim(),
      companySize: String(fd.get("companySize") || "").trim(),
      leadSource: "Website Contact Form",
    };

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/consultation-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to submit. Please try again.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unable to submit. Please try again.");
    }
  }

  return (
    <section id="contact" className="px-6 py-24">
      <div className="reveal mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Get in Touch</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Let's improve your CRM process.
          </h2>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Tell me a little about your current CRM setup. I'll respond within one business day with next steps and a free initial assessment.
          </p>

          <div className="mt-10 space-y-4">
            <a
              href="mailto:dhruv.kaushik866@gmail.com"
              className="flex items-center justify-between rounded-xl border border-border bg-card/70 p-5 transition-all hover:border-accent/50"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Email</div>
                <div className="mt-1 font-semibold">dhruv.kaushik866@gmail.com</div>
              </div>
              <span className="text-accent">→</span>
            </a>
            <a
              href="tel:+17786799471"
              className="flex items-center justify-between rounded-xl border border-border bg-card/70 p-5 transition-all hover:border-accent/50"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Phone</div>
                <div className="mt-1 font-semibold">+1 (778) 679-9471</div>
              </div>
              <span className="text-accent">→</span>
            </a>
            <a
              href="https://www.linkedin.com/in/dhruv-kaushik-95231a175/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border bg-card/70 p-5 transition-all hover:border-accent/50"
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-accent">LinkedIn</div>
                <div className="mt-1 font-semibold">Connect with Dhruv Kaushik</div>
              </div>
              <span className="text-accent">→</span>
            </a>
            <div className="rounded-xl border border-border bg-card/70 p-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Based in</div>
              <div className="mt-1 font-semibold">Burnaby, BC</div>
            </div>
          </div>
        </div>

        <div id="consultation-form" className="scroll-mt-28">
          <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
            Complete the form below and I'll get back to you within 24 hours.
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-border bg-card/80 p-7 transition-all duration-300 sm:p-9"
          >
            <h3 className="text-lg font-bold">Consultation Inquiry</h3>
            <p className="mt-1 text-sm text-muted-foreground">No-pressure intro call to scope your CRM needs.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *" className="sm:col-span-2">
                <input
                  ref={firstInputRef}
                  name="fullName"
                  required
                  maxLength={120}
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
              <Field label="Email Address *">
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
              <Field label="Phone Number">
                <input
                  name="phone"
                  type="tel"
                  maxLength={40}
                  autoComplete="tel"
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
              <Field label="Company Name">
                <input
                  name="companyName"
                  maxLength={200}
                  autoComplete="organization"
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
              <Field label="Business Website">
                <input
                  name="website"
                  type="url"
                  placeholder="https://"
                  maxLength={300}
                  autoComplete="url"
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
              <Field label="CRM Currently Used">
                <input
                  name="crmUsed"
                  placeholder="e.g. Freshworks, LeadSquared, none yet"
                  maxLength={120}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
              <Field label="Preferred Meeting Time">
                <input
                  name="preferredMeetingTime"
                  placeholder="e.g. Weekday mornings PT"
                  maxLength={200}
                  className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
              <Field label="Brief Description of Requirements *" className="sm:col-span-2">
                <textarea
                  name="requirements"
                  rows={4}
                  required
                  maxLength={4000}
                  placeholder="Tell me about your lead process and what's getting in the way…"
                  className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </Field>
            </div>

            {status === "error" && (
              <div className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMsg || "Something went wrong. Please try again."}
              </div>
            )}

            {status === "success" ? (
              <div className="mt-6 rounded-xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm text-foreground">
                <p className="font-semibold text-accent">Thank you for your inquiry.</p>
                <p className="mt-1 text-muted-foreground">
                  Your consultation request has been received. We will contact you shortly.
                </p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 w-full rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Request Consultation"}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
