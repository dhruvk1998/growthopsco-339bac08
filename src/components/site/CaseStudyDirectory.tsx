import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  challenge: string;
  solution: string;
  role: string[];
  activities: string[];
  flow: string[];
  impact: string;
  metrics: { value: string; label: string }[];
  outcome: string;
  lessons: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "freshworks-crm-rollout",
    title: "Company-Wide Freshworks CRM Rollout",
    category: "CRM Implementation",
    summary: "End-to-end Freshworks deployment across sales, marketing, and support — establishing one operating system for revenue.",
    challenge: "Leads were scattered across email, spreadsheets, and disconnected tools. There was no consistent owner per lead, no SLA, and leadership had no real pipeline visibility.",
    solution: "Designed and deployed Freshworks CRM end-to-end. Lifecycle stages were mapped to how the business actually sells, with routing, ownership, and reporting baked in from day one.",
    role: [
      "Stakeholder discovery across departments",
      "Lifecycle and pipeline architecture",
      "Workflow and automation configuration",
      "Team onboarding and adoption tracking",
    ],
    activities: [
      "Mapped business processes to CRM stages",
      "Configured custom fields, roles, and permissions",
      "Built routing and notification automations",
      "Ran enablement sessions for each user group",
    ],
    flow: ["Discovery", "Architecture", "Configuration", "Migration", "Enablement", "Adoption"],
    impact: "Single source of truth for sales operations with consistent ownership and measurable pipeline.",
    metrics: [
      { value: "~50%", label: "Productivity improvement" },
      { value: "100%", label: "Lead capture coverage" },
      { value: "↑", label: "Reporting visibility for leadership" },
    ],
    outcome: "The CRM became the operating system for revenue — every lead tracked, every stage measured, every workflow accountable.",
    lessons: "Adoption is the real deliverable. Architecture and automation only compound when stakeholders trust the system enough to live in it.",
  },
  {
    slug: "sales-pipeline-automation",
    title: "Sales Pipeline & Workflow Automation",
    category: "Workflow Automation",
    summary: "Automated stage transitions, task creation, and pipeline hygiene so reps spend their time selling.",
    challenge: "Reps were losing hours per week to manual data entry, stage updates, follow-up triage, and ad-hoc reporting.",
    solution: "Built a layered automation system covering stage transitions, task generation, follow-up reminders, and pipeline hygiene rules.",
    role: [
      "Audit of manual rep activities",
      "Automation design and prioritization",
      "Build and QA of workflows",
      "Change management with the sales team",
    ],
    activities: [
      "Documented repeatable manual workflows",
      "Built trigger-based automations and SLA timers",
      "Standardized stage-exit criteria",
      "Created reporting tied to automated activity",
    ],
    flow: ["Audit", "Design", "Build", "QA", "Rollout", "Iterate"],
    impact: "Reps moved from administrative work to selling, with leadership gaining a cleaner pipeline view.",
    metrics: [
      { value: "~50%", label: "Productivity uplift" },
      { value: "↓", label: "Manual data entry" },
      { value: "↑", label: "Pipeline hygiene" },
    ],
    outcome: "A pipeline that maintains itself, with consistent stage data and faster forecasting cycles.",
    lessons: "Automate the boring parts first — trust grows fast when reps see their day get shorter.",
  },
  {
    slug: "chatbot-crm-integration",
    title: "Chatbot ↔ CRM Integration Sprint",
    category: "Chatbot Integration",
    summary: "API-driven integration that pushed chatbot conversations directly into the CRM with structured routing.",
    challenge: "Website inquiries were being captured manually, routed slowly, and frequently lost before any follow-up could occur.",
    solution: "Designed an API integration mapping chatbot fields to CRM records, with validation, deduplication, routing, and instant assignment.",
    role: [
      "Integration requirements with vendors and developers",
      "Field mapping and validation rules",
      "Routing and assignment logic",
      "QA across edge cases",
    ],
    activities: [
      "Authored API specs with the web team",
      "Built deduplication and validation rules",
      "Configured routing and SLA timers",
      "End-to-end test scenarios and monitoring",
    ],
    flow: ["Chatbot", "API Layer", "Field Mapping", "Lead Routing", "CRM Record"],
    impact: "Inquiries entered the CRM in seconds with the right owner and clean data.",
    metrics: [
      { value: "Up to 95%", label: "Faster lead response" },
      { value: "~99%", label: "Reduction in manual lead entry" },
      { value: "0", label: "Lost inquiries" },
    ],
    outcome: "Chatbot interactions became part of a structured, trackable lead management process.",
    lessons: "Clean field contracts between systems matter more than the platform choice itself.",
  },
  {
    slug: "ai-lead-qualification",
    title: "AI-Powered Lead Qualification System",
    category: "AI Automation",
    summary: "An AI scoring layer wired into CRM workflows so sales only receives lead-ready prospects.",
    challenge: "High lead volume with low MQL-to-SQL conversion. Sales was burning time on poor-fit prospects while qualified leads aged.",
    solution: "Integrated an AI scoring layer with CRM workflows to auto-qualify, prioritize, and route only sales-ready leads.",
    role: [
      "Qualification criteria design",
      "AI model integration with CRM",
      "Routing and prioritization logic",
      "Closed-loop measurement",
    ],
    activities: [
      "Defined scoring inputs and thresholds",
      "Connected scoring outputs to CRM workflows",
      "Built priority queues and rep dashboards",
      "Tuned the model against closed-won data",
    ],
    flow: ["Capture", "Enrich", "Score", "Prioritize", "Route", "Measure"],
    impact: "Sales worked a smaller, higher-quality queue with shorter cycle times.",
    metrics: [
      { value: "~99%", label: "Growth in qualified leads" },
      { value: "↑", label: "MQL-to-SQL conversion" },
      { value: "↓", label: "Time on poor-fit prospects" },
    ],
    outcome: "A leaner, sharper top-of-funnel where reps spent time on opportunities that actually closed.",
    lessons: "AI scoring is only as good as the closed-loop feedback running back into the model.",
  },
  {
    slug: "crm-data-cleanup-governance",
    title: "CRM Data Cleanup & Governance Initiative",
    category: "CRM Optimization",
    summary: "Deduplicated, normalized, and governed CRM data so reporting and automation could be trusted again.",
    challenge: "Years of unstructured entries created duplicates, inconsistent fields, and reporting nobody trusted.",
    solution: "Ran a structured cleanup followed by a lightweight governance model — required fields, picklists, and ownership rules.",
    role: ["Data audit", "Cleanup execution", "Governance design", "Stakeholder alignment"],
    activities: [
      "Profiled duplicates and field-level quality",
      "Standardized picklists and required fields",
      "Built deduplication and merge logic",
      "Defined ongoing data ownership",
    ],
    flow: ["Audit", "Standardize", "Cleanse", "Govern", "Monitor"],
    impact: "Reports started matching reality and automations stopped misfiring on bad data.",
    metrics: [
      { value: "↓", label: "Duplicate records" },
      { value: "↑", label: "Reporting accuracy" },
      { value: "↑", label: "Automation reliability" },
    ],
    outcome: "A CRM dataset stakeholders trusted enough to make decisions on.",
    lessons: "Governance beats cleanup. Without rules, the same mess returns within a quarter.",
  },
  {
    slug: "lead-assignment-routing",
    title: "Lead Assignment & Routing Optimization",
    category: "Lead Management",
    summary: "Redesigned lead routing across territory, product line, and intent — with full ownership trails.",
    challenge: "Leads were sitting unassigned or landing with the wrong rep, and accountability was unclear.",
    solution: "Built a routing matrix with fallback rules, SLA timers, and escalation paths tied to ownership.",
    role: ["Routing design", "SLA and escalation rules", "Reporting", "Rep enablement"],
    activities: [
      "Mapped territory, product, and intent rules",
      "Built round-robin and load-balanced queues",
      "Implemented SLA and escalation logic",
      "Created routing health dashboards",
    ],
    flow: ["Capture", "Classify", "Route", "Accept", "Escalate"],
    impact: "Leads reached the right rep in seconds, with no ambiguity about ownership.",
    metrics: [
      { value: "Up to 95%", label: "Faster lead response" },
      { value: "0", label: "Unassigned leads" },
      { value: "↑", label: "Acceptance rate" },
    ],
    outcome: "A predictable lead distribution system reps and managers could trust.",
    lessons: "Every rule needs a fallback. Routing fails when edge cases have nowhere to go.",
  },
  {
    slug: "crm-adoption-enablement",
    title: "CRM Adoption & User Enablement Program",
    category: "CRM Implementation",
    summary: "Structured enablement program that drove sustained CRM usage across sales, marketing, and support.",
    challenge: "A capable CRM was technically live but underused — reps reverted to spreadsheets and email threads.",
    solution: "Built a role-specific enablement program with guided playbooks, training cohorts, and adoption tracking.",
    role: ["Adoption analysis", "Enablement design", "Training delivery", "Manager coaching"],
    activities: [
      "Diagnosed adoption gaps by role",
      "Designed role-specific playbooks",
      "Ran live training cohorts",
      "Tracked usage and follow-up metrics",
    ],
    flow: ["Diagnose", "Design", "Train", "Coach", "Measure"],
    impact: "CRM became the daily home for reps and managers — not an after-the-fact system of record.",
    metrics: [
      { value: "↑", label: "Daily active CRM usage" },
      { value: "↑", label: "Activity logging" },
      { value: "↑", label: "Manager visibility" },
    ],
    outcome: "Adoption shifted from forced to default — the CRM became where the work happened.",
    lessons: "Enablement is a program, not an event. Reinforcement beats kickoff training every time.",
  },
  {
    slug: "website-lead-capture-standardization",
    title: "Website Lead Capture Standardization",
    category: "Website Integration",
    summary: "Unified form, chatbot, and campaign intake into a single CRM-ready schema with validation and routing.",
    challenge: "Forms across pages and campaigns captured different fields with different rules — CRM data was inconsistent.",
    solution: "Standardized lead capture schema, validation, and CRM mapping across every website surface.",
    role: ["Schema design", "Validation rules", "Web developer coordination", "QA"],
    activities: [
      "Audited every public lead capture surface",
      "Designed a unified schema and required fields",
      "Mapped fields end-to-end into the CRM",
      "Implemented validation and error handling",
    ],
    flow: ["Form", "Validation", "Mapping", "CRM Insert", "Routing"],
    impact: "Marketing and sales worked from the same clean, consistent lead records.",
    metrics: [
      { value: "↑", label: "Lead data completeness" },
      { value: "~99%", label: "Reduction in manual cleanup" },
      { value: "↑", label: "Attribution accuracy" },
    ],
    outcome: "A clean intake layer that made every downstream campaign and report more reliable.",
    lessons: "The CRM only behaves as well as the boundary where leads enter it.",
  },
  {
    slug: "sales-activity-forecast",
    title: "Sales Activity Tracking & Forecast Visibility",
    category: "Revenue Operations",
    summary: "Activity capture and pipeline reporting redesigned for confident forecasting.",
    challenge: "Forecasts were anecdotal — leadership could not tie pipeline movement to rep activity.",
    solution: "Designed activity capture, stage-exit criteria, and pipeline reports tied directly to forecast methodology.",
    role: ["Activity model design", "Stage criteria", "Reporting build", "Forecast cadence"],
    activities: [
      "Defined the activity model per role",
      "Standardized stage-exit criteria",
      "Built reps, manager, and exec dashboards",
      "Ran a weekly forecast cadence",
    ],
    flow: ["Activity", "Stage Movement", "Pipeline", "Forecast", "Review"],
    impact: "Forecasting shifted from guesswork to a repeatable process backed by data.",
    metrics: [
      { value: "↑", label: "Forecast accuracy" },
      { value: "↑", label: "Activity visibility" },
      { value: "↓", label: "Surprise slipped deals" },
    ],
    outcome: "Leadership gained confidence in the pipeline and could reinvest based on real signal.",
    lessons: "Forecasts only get better when activity and stage definitions are non-negotiable.",
  },
  {
    slug: "crm-audit-process-optimization",
    title: "CRM Audit & Process Optimization",
    category: "CRM Optimization",
    summary: "Diagnostic audit of an underperforming CRM with a prioritized roadmap of quick wins and structural fixes.",
    challenge: "A mature CRM was leaking leads and frustrating users, but no one could pinpoint where.",
    solution: "Ran a structured audit across lifecycle, automation, data, and adoption, then sequenced fixes by impact and effort.",
    role: ["Audit framework", "Diagnostic interviews", "Roadmap design", "Executive readout"],
    activities: [
      "Audited lifecycle and pipeline configuration",
      "Reviewed automations and integrations",
      "Assessed data quality and ownership",
      "Built a 30/60/90 fix roadmap",
    ],
    flow: ["Audit", "Diagnose", "Prioritize", "Roadmap", "Execute"],
    impact: "The team had a concrete, prioritized plan instead of a vague sense of dysfunction.",
    metrics: [
      { value: "↑", label: "Leadership clarity" },
      { value: "↓", label: "Lead leakage" },
      { value: "↑", label: "Process throughput" },
    ],
    outcome: "An underperforming CRM was repositioned as a revenue engine with a clear execution path.",
    lessons: "Audits are most valuable when they end in a sequenced roadmap — not a list of complaints.",
  },
  {
    slug: "marketing-sales-handoff",
    title: "Marketing-to-Sales Handoff Redesign",
    category: "Revenue Operations",
    summary: "Redefined MQL criteria, SLAs, and the operational handoff between marketing and sales.",
    challenge: "Marketing and sales argued about lead quality while qualified leads aged or disappeared between teams.",
    solution: "Co-designed a shared MQL definition, handoff SLA, and feedback loop with reporting that exposed where the funnel broke.",
    role: ["Cross-team facilitation", "MQL definition", "SLA design", "Feedback loop reporting"],
    activities: [
      "Aligned marketing and sales on MQL criteria",
      "Defined handoff SLAs and ownership",
      "Built shared funnel and feedback dashboards",
      "Ran a recurring funnel review",
    ],
    flow: ["MQL", "Handoff", "Acceptance", "Working", "Feedback"],
    impact: "Marketing and sales operated as one funnel with shared accountability.",
    metrics: [
      { value: "↑", label: "MQL acceptance rate" },
      { value: "↓", label: "Handoff drop-off" },
      { value: "↑", label: "Conversion to opportunity" },
    ],
    outcome: "Conflict turned into collaboration around a shared, measurable funnel.",
    lessons: "Handoffs only work when both sides own the metric on the other side of the line.",
  },
  {
    slug: "multi-channel-lead-intake",
    title: "Multi-Channel Lead Intake Integration",
    category: "Website Integration",
    summary: "Consolidated lead intake from web, chatbot, paid, and partner channels into one normalized CRM pipeline.",
    challenge: "Each channel had its own intake path, format, and routing — making attribution and follow-up unreliable.",
    solution: "Built a normalized intake layer that ingested every channel, validated and enriched data, and inserted into the CRM with consistent routing.",
    role: ["Channel inventory", "Normalization layer design", "Routing rules", "Monitoring"],
    activities: [
      "Catalogued every active intake channel",
      "Designed a normalized lead schema",
      "Implemented enrichment and routing",
      "Built channel-level health monitoring",
    ],
    flow: ["Channel", "Normalize", "Enrich", "Insert", "Route"],
    impact: "Every channel landed in the same clean pipeline with reliable attribution.",
    metrics: [
      { value: "~99%", label: "Manual intake eliminated" },
      { value: "↑", label: "Attribution accuracy" },
      { value: "↑", label: "Channel performance visibility" },
    ],
    outcome: "Marketing could compare channels fairly and invest where pipeline actually came from.",
    lessons: "A normalization layer is the cheapest investment with the highest downstream payoff.",
  },
];

export const categories = [
  "All",
  "CRM Implementation",
  "Workflow Automation",
  "Revenue Operations",
  "CRM Optimization",
  "Lead Management",
  "Website Integration",
  "Chatbot Integration",
  "AI Automation",
] as const;

export function CaseStudyDirectory() {
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(
    () => (active === "All" ? caseStudies : caseStudies.filter((c) => c.category === active)),
    [active]
  );

  // Scroll to hash anchor on load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (!hash) return;
    const t = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="px-6 py-20">
      <div className="reveal mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-card/60 text-muted-foreground hover:border-accent/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="space-y-8">
          {filtered.map((c) => (
            <CaseStudyCard key={c.slug} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ c }: { c: CaseStudy }) {
  return (
    <article
      id={c.slug}
      className="scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card/70"
    >
      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        <div className="p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
              {c.category}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight lg:text-3xl">
            {c.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.summary}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Business Challenge</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.challenge}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Solution Designed</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.solution}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">My Role</p>
              <ul className="mt-2 space-y-1.5">
                {c.role.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Implementation Activities</p>
              <ul className="mt-2 space-y-1.5">
                {c.activities.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background/40 p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Workflow</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium">
              {c.flow.map((step, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-foreground">{step}</span>
                  {i < arr.length - 1 && <span className="text-accent">→</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Lessons Learned</p>
            <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">{c.lessons}</p>
          </div>
        </div>

        <div className="border-t border-border bg-gradient-to-br from-accent/10 to-transparent p-8 lg:border-l lg:border-t-0 lg:p-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Operational Impact</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{c.impact}</p>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-accent">Key Metrics</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {c.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border bg-background/40 p-4">
                <div className="text-2xl font-bold text-accent">{m.value}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-accent">Business Outcome</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">{c.outcome}</p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-all hover:opacity-90"
          >
            Discuss a Similar Engagement →
          </Link>
        </div>
      </div>
    </article>
  );
}
