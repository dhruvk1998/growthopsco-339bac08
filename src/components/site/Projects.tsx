import { useState } from "react";

type Project = {
  title: string;
  tag: string;
  summary: string;
  problem: string;
  approach: string[];
  tools: string[];
  value: string[];
  metric?: { value: string; label: string };
};

const categories: { id: string; label: string; description: string; projects: Project[] }[] = [
  {
    id: "crm",
    label: "CRM & Workflow Systems",
    description: "Direct CRM implementation, lifecycle design, and automation engagements.",
    projects: [
      {
        title: "Company-Wide Freshworks & LeadSquared Automation",
        tag: "Flagship · Ozone Overseas",
        summary:
          "Re-architected the entire lead intake, routing, and follow-up engine across LeadSquared and Freshworks CRM.",
        problem:
          "Lead intake was fragmented across channels with no unified ownership, no SLA enforcement, and slow manual response times that were leaking pipeline.",
        approach: [
          "Mapped lead lifecycle stages to the actual sales motion",
          "Configured routing, ownership rules and SLA-based escalation",
          "Built automation flows for assignment, follow-up and re-engagement",
          "Coordinated API integration between the marketing website, chatbot and CRM",
          "Aligned the system to stakeholder reporting requirements",
        ],
        tools: ["Freshworks CRM", "LeadSquared", "Workflow Automation", "API Integration", "Chatbot Integration"],
        value: [
          "95% reduction in lead response time",
          "Centralized lead visibility across teams",
          "Standardized intake and follow-up process",
          "Scalable foundation for future CRM growth",
        ],
        metric: { value: "‑95%", label: "Lead response time" },
      },
      {
        title: "SLA & Business-Hours Automation Engine",
        tag: "WorkCalendar · Production-ready",
        summary:
          "A precision SLA engine for CRM environments — handles timezones, holidays and after-hour rollovers so escalations never fire late or early.",
        problem:
          "Manual SLA calculation across timezones produced inconsistent escalation timelines and missed handoffs between regional teams.",
        approach: [
          "Modeled timezone-aware deadline logic for global sales teams",
          "Built holiday/weekend skip rules and after-hour rollover handling",
          "Added configuration validation and safety guards for production use",
        ],
        tools: ["LeadSquared", "HubSpot-ready", "SLA Design", "Process Automation"],
        value: [
          "100% removal of manual SLA miscalculations",
          "Accurate escalation timelines across regions",
          "Reliable handoffs between sales reps",
        ],
        metric: { value: "100%", label: "SLA accuracy" },
      },
    ],
  },
  {
    id: "ops",
    label: "Automation & Operational Systems",
    description:
      "Operational tooling built to improve process visibility, accountability and team efficiency.",
    projects: [
      {
        title: "Real-Time Operations Monitoring System",
        tag: "Watch Folder · NDTV & TV18",
        summary:
          "Always-on monitoring and audit-trail system used inside live media production environments to keep operations accountable.",
        problem:
          "Production teams had no reliable way to track file movements, identify missing assets, or audit operational activity across servers.",
        approach: [
          "Designed parallel real-time monitoring across multiple workflows",
          "Stored structured audit logs for accountability and review",
          "Configured alerting so anomalies reached the right operator immediately",
          "Delivered a non-technical UI so operators could self-serve",
        ],
        tools: ["Process Monitoring", "Audit Logging", "Alerting", "Operational Tooling"],
        value: [
          "90% reduction in manual operational checks",
          "Full audit trail across production workflows",
          "Faster anomaly response and incident handling",
        ],
        metric: { value: "‑90%", label: "Manual checks" },
      },
      {
        title: "Controlled-Access QR System",
        tag: "Internal operations tooling",
        summary:
          "A traceable QR-based access tool for restricted documentation and internal access points across departments.",
        problem:
          "Internal documentation and access points lacked traceability — no way to verify who accessed what, when, or whether codes were duplicated.",
        approach: [
          "Built unique-identifier generation with validation rules",
          "Supported batch operations for rollouts across departments",
          "Added optional encryption for sensitive use cases",
        ],
        tools: ["Access Control", "Operational Workflow Tooling", "Process Standardization"],
        value: [
          "70% faster issuance across teams",
          "Reliable access control and audit trail",
          "Lower operational risk on sensitive resources",
        ],
        metric: { value: "‑70%", label: "Issuance time" },
      },
    ],
  },
  {
    id: "reporting",
    label: "Reporting & Business Visibility",
    description: "Reporting systems that replace manual effort with leadership-ready visibility.",
    projects: [
      {
        title: "Stakeholder Reporting Dashboards",
        tag: "Power BI · Areneva Technologies",
        summary:
          "Reusable reporting systems that replaced manual stakeholder reports with real-time operational visibility.",
        problem:
          "Leadership relied on manually compiled reports — slow, inconsistent and disconnected from real operational data.",
        approach: [
          "Translated business questions into reusable dashboards",
          "Standardized KPI definitions across teams",
          "Automated weekly operational reporting workflows",
        ],
        tools: ["Power BI", "Data Modeling", "KPI Standardization", "Operational Reporting"],
        value: [
          "80% reduction in manual reporting time",
          "Real-time visibility for leadership",
          "Consistent KPIs across departments",
        ],
        metric: { value: "‑80%", label: "Reporting effort" },
      },
      {
        title: "ESG & Sustainability Analytics Framework",
        tag: "MBA Capstone · UCW",
        summary:
          "Analytics framework across 5,000 global fashion brands — turning raw operational data into ESG decision-making recommendations.",
        problem:
          "Companies lacked a structured way to measure, compare and report on sustainability performance across regions and operations.",
        approach: [
          "Cleaned and modeled cross-brand operational data",
          "Built regional dashboards for emissions, water and recycling KPIs",
          "Recommended lifecycle-tracking frameworks for ongoing reporting",
        ],
        tools: ["Tableau", "Python (Pandas)", "Data Analytics", "Business Strategy"],
        value: [
          "Actionable ESG reporting strategy",
          "Region-by-region performance benchmarking",
          "Framework for data-driven sustainability decisions",
        ],
      },
    ],
  },
];

export function Projects() {
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const cat = categories.find((c) => c.id === activeCat)!;

  return (
    <section id="projects" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
              Selected Projects & Systems Experience
            </p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Systems I've built and operated.
            </h2>
            <p className="mt-4 text-muted-foreground">{cat.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCat(c.id);
                  setOpenIdx(0);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  c.id === activeCat
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {cat.projects.map((p, i) => {
            const isOpen = openIdx === i;
            return (
              <article
                key={p.title}
                className={`overflow-hidden rounded-2xl border bg-card/70 transition-all ${
                  isOpen ? "border-accent/50 shadow-glow" : "border-border hover:border-accent/30"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full flex-col items-start justify-between gap-4 p-6 text-left sm:flex-row sm:items-center sm:p-7"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-accent">{p.tag}</div>
                    <h3 className="mt-2 text-xl font-bold leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                  </div>
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    {p.metric && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{p.metric.value}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {p.metric.label}
                        </div>
                      </div>
                    )}
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <svg viewBox="0 0 20 20" className="size-4" fill="currentColor">
                        <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                      </svg>
                    </span>
                  </div>
                </button>

                <div
                  className={`grid overflow-hidden transition-all duration-500 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0">
                    <div className="grid gap-8 border-t border-border bg-background/40 p-6 sm:p-8 lg:grid-cols-4">
                      <Block heading="Problem">
                        <p className="text-sm leading-relaxed text-muted-foreground">{p.problem}</p>
                      </Block>
                      <Block heading="Approach">
                        <ul className="space-y-1.5">
                          {p.approach.map((a) => (
                            <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </Block>
                      <Block heading="Systems & Tools">
                        <div className="flex flex-wrap gap-1.5">
                          {p.tools.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </Block>
                      <Block heading="Business Value">
                        <ul className="space-y-1.5">
                          {p.value.map((v) => (
                            <li key={v} className="flex items-start gap-2 text-sm text-foreground">
                              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                              {v}
                            </li>
                          ))}
                        </ul>
                      </Block>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-accent">{heading}</h4>
      {children}
    </div>
  );
}
