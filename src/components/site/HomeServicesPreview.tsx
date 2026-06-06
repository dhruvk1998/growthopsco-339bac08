import { useState } from "react";
import { Link } from "@tanstack/react-router";

export const standardServices = [
  {
    title: "Set Up a CRM That Actually Gets Used",
    engagement: "CRM Implementation",
    problem: "Sales and marketing operate without a single source of truth. Leads, activity, and forecasts live in disconnected tools and spreadsheets.",
    deliverables: [
      "Discovery, lifecycle, and pipeline architecture",
      "Custom fields, roles, permissions, and reporting model",
      "Data migration, team onboarding, and adoption tracking",
    ],
    outcomes: "A CRM the team actually lives in — centralized lead visibility, accountable pipeline, and a foundation that scales.",
  },
  {
    title: "Reduce Manual CRM Work",
    engagement: "Workflow Automation",
    problem: "Reps lose hours every week to manual updates, follow-up triage, and routing decisions that should run themselves.",
    deliverables: [
      "Lead routing, round-robin, and ownership rules",
      "Trigger-based sequences, alerts, and SLA timers",
      "Stuck-deal recovery and re-engagement automations",
    ],
    outcomes: "Reps move from administrative work to selling. Pipeline data stays clean without nightly cleanup.",
  },
  {
    title: "Fix Lead Leakage & Ownership Issues",
    engagement: "Lead Process Design",
    problem: "Lifecycle stages don't match how the business actually sells. Leads sit unassigned, ownership is unclear, and reporting is unreliable.",
    deliverables: [
      "End-to-end lead lifecycle from capture to close",
      "Source attribution, scoring, and qualification rules",
      "Routing matrix, SLAs, and escalation paths",
    ],
    outcomes: "A lead process every stakeholder understands and trusts — with clear ownership and zero unassigned leads.",
  },
  {
    title: "Connect Your Website to Your CRM",
    engagement: "Integration Project",
    problem: "Web forms, chatbots, and the CRM live in silos. Leads are entered manually, lost between systems, or duplicated.",
    deliverables: [
      "API specs in partnership with web developers",
      "Field mapping, validation, and deduplication rules",
      "QA, monitoring, and fallback handling",
    ],
    outcomes: "Inquiries land in the CRM in seconds with clean data, the right owner, and reliable attribution.",
  },
  {
    title: "Capture Chatbot Inquiries Inside Your CRM",
    engagement: "Chatbot Integration",
    problem: "Chatbot conversations don't reach sales fast enough. Qualified visitors slip through before anyone can follow up.",
    deliverables: [
      "Conversation-to-lead capture flows",
      "Qualification logic and CRM synchronization",
      "Instant routing and assignment to the right rep",
    ],
    outcomes: "Conversational leads become structured CRM records with measurable follow-up and conversion.",
  },
  {
    title: "Identify What's Slowing Down Your CRM",
    engagement: "CRM Audit",
    problem: "The CRM is underused, full of bad data, or quietly leaking leads — but no one can pinpoint where the breakdowns are.",
    deliverables: [
      "Lifecycle, pipeline, and automation audit",
      "Data quality, duplication, and adoption review",
      "Prioritized 30/60/90 roadmap of fixes and quick wins",
    ],
    outcomes: "A concrete, sequenced plan to turn an underperforming CRM into a revenue engine — no guesswork.",
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
              Engagements named after the problem they solve.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Every service is scoped around a business outcome — not a tool, feature, or technical checklist.
            </p>
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
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{s.engagement}</p>
                    <h3 className="mt-1.5 text-lg font-bold leading-tight">{s.title}</h3>
                  </div>
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
