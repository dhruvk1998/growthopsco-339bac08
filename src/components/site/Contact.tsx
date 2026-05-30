import { useState } from "react";

export function Contact() {
  const [sent, setSent] = useState(false);

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
              <div className="mt-1 font-semibold">Burnaby, BC · Canada</div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-2xl border border-border bg-card/80 p-7 sm:p-9"
        >
          <h3 className="text-lg font-bold">Consultation Inquiry</h3>
          <p className="mt-1 text-sm text-muted-foreground">No-pressure intro call to scope your CRM needs.</p>

          <div className="mt-6 space-y-4">
            <Field label="Full Name">
              <input
                required
                className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </Field>
            <Field label="Work Email">
              <input
                type="email"
                required
                className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </Field>
            <Field label="Current CRM">
              <input
                placeholder="e.g. Freshworks, LeadSquared, none yet"
                className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </Field>
            <Field label="What's the goal?">
              <textarea
                rows={4}
                required
                placeholder="Tell me about your lead process and what's getting in the way…"
                className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent"
              />
            </Field>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground transition-all hover:shadow-glow"
          >
            {sent ? "Thanks — I'll be in touch shortly" : "Request Consultation"}
          </button>
        </form>
      </div>

    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
