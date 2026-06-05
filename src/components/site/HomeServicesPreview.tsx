import { useState } from "react";
import { Link } from "@tanstack/react-router";

export const standardServices = [
  {
    title: "CRM Setup & Implementation",
    problem: "Sales and marketing operate without a single source of truth, leaving leads, activity, and forecasts fragmented across tools.",
    deliverables: [
      "Account, pipeline, and lifecycle architecture",
      "Custom fields, roles, and permissions",
      "Team onboarding, training, and adoption tracking",
    ],
    outcomes: "A CRM the team actually lives in — with centralized lead visibility and a foundation that scales.",
  },
  {
    title: "Workflow Automation",
    problem: "Reps lose hours to manual updates, follow-up triage, and routing decisions that should run themselves.",
    deliverables: [
      "Lead routing and round-robin assignment",
      "Trigger-based sequences, alerts, and SLA timers",
      "Stuck-deal recovery and re-engagement loops",
    ],
    outcomes: "Up to 50% productivity improvement and dramatically faster lead response.",
  },
  {
    title: "Lead Process Design",
    problem: "Lifecycle stages don't match how the business actually sells, so reporting and accountability break down.",
    deliverables: [
      "End-to-end lifecycle from capture to close",
      "Source attribution, scoring, and qualification rules",
      "SLA design and ownership matrices",
    ],
    outcomes: "A lead process every stakeholder understands and trusts.",
  },
  {
    title: "Website ↔ CRM Integration",
    problem: "Web forms, chatbots, and CRM live in silos — leads are entered manually, lost, or duplicated.",
    deliverables: [
      "API specs in partnership with web developers",
      "Field mapping, validation, and routing rules",
      "QA, monitoring, and fallback handling",
    ],
    outcomes: "~99% reduction in manual lead intake and clean, structured CRM records.",
  },
  {
    title: "Chatbot Integration",
    problem: "Chatbot inquiries don't reach sales fast enough, and qualified leads slip through the cracks.",
    deliverables: [
      "Conversation-to-lead capture flows",
      "Qualification logic and CRM synchronization",
      "Routing and instant assignment to reps",
    ],
    outcomes: "Up to 95% faster response time and meaningful growth in qualified inquiries.",
  },
  {
    title: "CRM Audit & Optimization",
    problem: "The current CRM is underused, full of bad data, or quietly leaking leads — but no one can pinpoint where.",
    deliverables: [
      "Lifecycle audit and pipeline-stage diagnostic",
      "Data quality, duplication, and adoption review",
      "Prioritized roadmap of fixes and quick wins",
    ],
    outcomes: "A clear, prioritized plan to turn an underperforming CRM into a revenue engine.",
  },
];

export function HomeServicesPreview() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="services" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Services</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Consulting built around your CRM lifecycle.
            </h2>
          </div>
          <Link
            to="/services"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            View all services →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {standardServices.map((s, i) => {
            const isOpen = open === i;
            return (
              <button
                key={s.title}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`group rounded-2xl border bg-card/70 p-6 text-left transition-all hover:-translate-y-0.5 ${
                  isOpen ? "border-accent/50" : "border-border hover:border-accent/40"
                }`}
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor">
                      <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                    </svg>
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.problem}</p>

                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 border-t border-border pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Typical Deliverables</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-accent">Expected Outcomes</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground">{s.outcomes}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
