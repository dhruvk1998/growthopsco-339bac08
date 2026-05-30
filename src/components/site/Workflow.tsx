import { useState } from "react";

const steps = [
  {
    n: "01",
    title: "Lead Capture",
    short: "Multi-source ingestion",
    detail:
      "Unify lead capture across website forms, chatbots, paid campaigns, and inbound channels. Every prospect lands in one structured pipeline — no spreadsheets, no inbox triage.",
  },
  {
    n: "02",
    title: "CRM Lead Insert",
    short: "API + data hygiene",
    detail:
      "Clean, deduplicate, and enrich incoming leads via API before insertion into Freshworks or LeadSquared. Standardized fields make every downstream automation reliable.",
  },
  {
    n: "03",
    title: "Lead Assignment",
    short: "Routing logic",
    detail:
      "Round-robin, geography, product line, or intent-based routing. Leads land with the right rep within seconds, with full ownership trails and escalation rules.",
  },
  {
    n: "04",
    title: "Automation & Routing",
    short: "Workflows that fire",
    detail:
      "Triggered nurture sequences, internal Slack/email alerts, SLA timers, and re-assignment rules — engineered to keep every lead moving without manual nudging.",
  },
  {
    n: "05",
    title: "Sales Follow-Up",
    short: "Standardized cadences",
    detail:
      "Reps work from a single, prioritized task list. Cadences are templated, calls and emails logged automatically, and pipeline stages reflect real-time activity.",
  },
  {
    n: "06",
    title: "Conversion Tracking",
    short: "Full-funnel attribution",
    detail:
      "Closed-loop reporting across channels, stages, and reps. Stakeholders get the pipeline visibility they need to forecast and reinvest with confidence.",
  },
];

export function Workflow() {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section id="workflow" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">The Method</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            How I Optimize Lead Management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A six-stage lifecycle I deploy for every CRM engagement. Click a stage to see how it works.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {steps.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.n}
                onClick={() => setActive(i)}
                className={`group relative rounded-2xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-accent/60 bg-accent/[0.06] shadow-glow"
                    : "border-border bg-card hover:border-accent/40 hover:-translate-y-0.5"
                }`}
              >
                <div className={`mb-4 text-sm font-bold ${isActive ? "text-accent" : "text-accent/70"}`}>{s.n}</div>
                <div className="text-sm font-bold text-foreground">{s.title}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{s.short}</div>
                {i < steps.length - 1 && (
                  <span className="pointer-events-none absolute right-[-0.5rem] top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-accent/40 to-transparent lg:block" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/70 p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent/10 font-bold text-accent">
              {step.n}
            </span>
            <div>
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{step.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
