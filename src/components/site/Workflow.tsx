const steps = [
  {
    n: "01",
    title: "Lead Capture",
    detail: "Unify intake across website forms, chatbots, paid campaigns, and inbound channels into one structured pipeline.",
  },
  {
    n: "02",
    title: "Data Hygiene",
    detail: "Standardize fields, deduplicate, and enrich incoming leads so every downstream automation runs on clean data.",
  },
  {
    n: "03",
    title: "Lead Assignment",
    detail: "Routing by territory, product, or intent — with ownership trails and escalation rules built in.",
  },
  {
    n: "04",
    title: "Automation",
    detail: "Triggered sequences, internal alerts, SLA timers, and re-assignment rules that keep leads moving without manual nudging.",
  },
  {
    n: "05",
    title: "Follow-Up",
    detail: "Templated cadences with automatic activity logging, so reps work a single prioritized task list.",
  },
  {
    n: "06",
    title: "Reporting",
    detail: "Closed-loop visibility across channels, stages, and reps for confident forecasting and reinvestment.",
  },
];

export function Workflow() {
  return (
    <section id="framework" className="px-6 py-24">
      <div className="reveal mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Framework</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            The Lead Management Framework
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A six-stage lifecycle I apply to every CRM engagement.
          </p>
        </div>

        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="group rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-accent/40"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-bold tracking-widest text-accent">{s.n}</span>
                <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
