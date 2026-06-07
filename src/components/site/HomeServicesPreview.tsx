// useState no longer needed — cards are now plain links
import { Link } from "@tanstack/react-router";

export const standardServices = [
  {
    title: "Give Your Team One Sales System That Works",
    engagement: "CRM Implementation",
    problem: "Sales visibility is low and the team operates from scattered tools. Leadership can't answer simple questions about pipeline or performance.",
    deliverables: [
      "Discovery, lifecycle, and pipeline architecture",
      "Custom fields, roles, permissions, and reporting model",
      "Data migration, team onboarding, and adoption tracking",
    ],
    outcomes: "Clear sales visibility, accountable pipeline, and a process the team actually uses every day — powered by the right CRM for the business.",
  },
  {
    title: "Reduce Manual Work and Speed Up Response Times",
    engagement: "Workflow Automation",
    problem: "The team loses hours every week to repetitive updates, manual follow-up, and routing decisions — slowing response and frustrating customers.",
    deliverables: [
      "Lead routing, round-robin, and ownership rules",
      "Trigger-based sequences, alerts, and SLA timers",
      "Stuck-deal recovery and re-engagement automations",
    ],
    outcomes: "More selling, less admin. Faster follow-up, consistent execution, and clean data without the nightly cleanup.",
  },
  {
    title: "Make Sure No Lead Falls Through the Cracks",
    engagement: "Lead Process Design",
    problem: "Leads sit unowned, follow-ups depend on memory, and no one is sure where opportunities are leaking out of the funnel.",
    deliverables: [
      "End-to-end lead lifecycle from capture to close",
      "Source attribution, scoring, and qualification rules",
      "Routing matrix, SLAs, and escalation paths",
    ],
    outcomes: "A reliable, transparent lead process — every inquiry owned, every follow-up tracked, every stage measurable.",
  },
  {
    title: "Connect Your Website and Tools to Your CRM",
    engagement: "Integration Project",
    problem: "Web forms, chatbots, marketing tools, and the CRM live in silos. Leads are entered manually, lost between systems, or duplicated.",
    deliverables: [
      "API specs in partnership with web developers",
      "Field mapping, validation, and deduplication rules",
      "QA, monitoring, and fallback handling",
    ],
    outcomes: "Inquiries flow automatically into the right system with clean data, the right owner, and reliable attribution — no manual handoffs.",
  },
  {
    title: "Turn Chatbot Conversations Into Real Opportunities",
    engagement: "Chatbot & AI Integration",
    problem: "Website visitors get answers from a chatbot, but qualified prospects rarely reach sales fast enough to convert.",
    deliverables: [
      "Conversation-to-lead capture flows",
      "Qualification logic and CRM synchronization",
      "Instant routing and assignment to the right rep",
    ],
    outcomes: "Conversational interest becomes structured pipeline — with measurable follow-up, response time, and conversion.",
  },
  {
    title: "Find Out Why Your Current CRM Isn't Working",
    engagement: "CRM Audit",
    problem: "The CRM is underused, full of bad data, or quietly losing leads — but no one can pinpoint exactly where it's breaking down.",
    deliverables: [
      "Lifecycle, pipeline, and automation audit",
      "Data quality, duplication, and adoption review",
      "Prioritized 30/60/90 roadmap of fixes and quick wins",
    ],
    outcomes: "A clear, sequenced plan to turn an underperforming CRM into a system the business can rely on — no guesswork, no rebuild from scratch.",
  },
];

export function HomeServicesPreview() {
  return (
    <section id="services" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Services</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Services named after the business problem they solve.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Every engagement starts with a business outcome — then brings in the right CRM, automation, or integration to make it real.
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
          {standardServices.map((s) => (
            <Link
              key={s.title}
              to="/services"
              className="group rounded-2xl border border-border bg-card/70 p-6 text-left transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{s.engagement}</p>
              <h3 className="mt-1.5 text-base font-bold leading-snug">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{s.outcomes}</p>
              <p className="mt-4 text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Learn more →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
