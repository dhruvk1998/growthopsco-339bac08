import { Link } from "@tanstack/react-router";

export function HealthCheckTeaser() {
  return (
    <section id="health-check-teaser" className="px-6 py-24">
      <div className="reveal mx-auto max-w-4xl overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/10 via-card/80 to-transparent p-10 text-center sm:p-14">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Free Assessment</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
          Is your CRM losing leads?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
          Most businesses lose opportunities through broken follow-up, poor routing, disconnected systems, and low CRM adoption — without realizing it. Find out where you stand in under two minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/crm-assessment"
            className="rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground transition-all hover:shadow-glow"
          >
            Take the CRM Health Check →
          </Link>
        </div>
      </div>
    </section>
  );
}
