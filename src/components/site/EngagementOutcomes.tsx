const outcomes = [
  { title: "Better lead management", body: "Every inbound lead captured, owned, and worked under a defined SLA." },
  { title: "Stronger CRM adoption", body: "The team lives in the CRM by default — not as a system of record after the fact." },
  { title: "Reduced manual work", body: "Routing, follow-ups, alerts, and updates run automatically across the lifecycle." },
  { title: "Reporting leadership trusts", body: "Pipeline, activity, and forecast views built on clean, governed data." },
  { title: "Process consistency", body: "Standardized stages, exit criteria, and handoffs across sales and marketing." },
  { title: "Operational efficiency", body: "Fewer tools, cleaner integrations, and workflows engineered for scale." },
];

export function EngagementOutcomes() {
  return (
    <section id="outcomes" className="px-6 py-20">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Typical Engagement Outcomes</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            What changes after we work together.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Engagements are scoped around operational outcomes — not feature checklists or platform configuration for its own sake.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o) => (
            <div
              key={o.title}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-accent/40"
            >
              <h3 className="text-base font-bold text-foreground">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
