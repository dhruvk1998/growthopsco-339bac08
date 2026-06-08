import { Link } from "@tanstack/react-router";

export function HealthCheckTeaser() {
  return (
    <section id="health-check-teaser" className="px-6 py-12">
      <div className="reveal mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/50 px-6 py-5 sm:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Free Assessment</p>
          <p className="mt-1 text-base font-bold text-foreground sm:text-lg">
            Not ready to talk? See where your CRM is leaking leads.
          </p>
        </div>
        <Link
          to="/crm-assessment"
          className="rounded-xl border border-border bg-transparent px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:border-accent/50 hover:text-accent"
        >
          Take the CRM Health Check →
        </Link>
      </div>
    </section>
  );
}
