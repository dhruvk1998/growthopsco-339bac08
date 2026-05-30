import { useState } from "react";

const services = [
  {
    title: "CRM Setup & Implementation",
    summary: "Ground-up Freshworks or LeadSquared deployment across departments.",
    details: [
      "Account structure, pipelines, custom fields & roles",
      "Stakeholder discovery and process mapping",
      "Team onboarding, training & adoption tracking",
    ],
  },
  {
    title: "Lead Process Design",
    summary: "Lead lifecycle stages engineered to match how your business actually sells.",
    details: [
      "End-to-end lifecycle from capture to close",
      "Source attribution, lead scoring & qualification rules",
      "SLA design and ownership matrices",
    ],
  },
  {
    title: "CRM Automation",
    summary: "Workflow automations that remove manual steps and accelerate response time.",
    details: [
      "Lead routing & round-robin assignment",
      "Trigger-based sequences and internal alerts",
      "Escalations, stuck-deal recovery, re-engagement loops",
    ],
  },
  {
    title: "Website ↔ CRM Integration",
    summary: "Coordinated API integration between marketing site, chatbot, and CRM.",
    details: [
      "Webform & chatbot lead capture into CRM",
      "API specs in partnership with web developers",
      "QA, monitoring, and fallback handling",
    ],
  },
  {
    title: "CRM Optimization & Audit",
    summary: "A health check of your current CRM — where leads leak, where automation breaks.",
    details: [
      "Lifecycle audit & pipeline-stage diagnostic",
      "Data quality, duplication, and adoption review",
      "Prioritized roadmap of fixes and quick wins",
    ],
  },
];

export function Services() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="services" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Services</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Consulting engagements built for operators.
          </h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div
                key={s.title}
                className={`rounded-2xl border bg-card/70 p-6 transition-all ${
                  isOpen ? "border-accent/50" : "border-border hover:border-accent/30"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <div>
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                  </div>
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg viewBox="0 0 20 20" className="size-4" fill="currentColor">
                      <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <ul className="min-h-0 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-3">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
