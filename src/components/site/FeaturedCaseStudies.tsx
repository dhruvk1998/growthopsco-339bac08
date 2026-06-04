import { Link } from "@tanstack/react-router";

const cases = [
  {
    industry: "SaaS / B2B",
    category: "CRM Implementation",
    title: "Company-Wide Freshworks CRM Rollout",
    metric: "100% lead capture accuracy",
    challenge:
      "Leads scattered across channels with no unified owner, no SLA, and zero leadership visibility.",
    solution:
      "Deployed Freshworks CRM end-to-end, mapped lifecycle stages to real sales motions, and shipped routing automation the team adopted.",
    result: "100% lead capture accuracy with full pipeline visibility.",
  },
  {
    industry: "Revenue Ops",
    category: "Workflow Automation",
    title: "Sales Pipeline & Workflow Automation",
    metric: "18 hrs/week saved",
    challenge:
      "Reps spent hours on manual data entry, stage updates, and reporting instead of selling.",
    solution:
      "Built automation flows for stage transitions, task creation, follow-up reminders, and pipeline hygiene.",
    result: "18 hours/week saved per rep through automation.",
  },
  {
    industry: "Marketing Ops",
    category: "Website ↔ CRM Integration",
    title: "Chatbot ↔ CRM Integration Sprint",
    metric: "92% faster response time",
    challenge:
      "Website inquiries were captured manually, slow to route, and frequently lost before follow-up.",
    solution:
      "Designed an API integration mapping chatbot fields to CRM records with validation, routing, and instant assignment.",
    result: "92% faster lead response with zero manual entry.",
  },
  {
    industry: "AI Automation",
    category: "AI Chatbot Automation",
    title: "AI-Powered Lead Qualification",
    metric: "35% more qualified leads",
    challenge:
      "High lead volume with low MQL-to-SQL conversion — sales wasted time on poor-fit prospects.",
    solution:
      "Integrated an AI scoring layer with CRM workflows to auto-qualify, prioritize, and route only sales-ready leads.",
    result: "35% increase in qualified opportunities reaching sales.",
  },
];

export function FeaturedCaseStudies() {
  return (
    <section id="featured-case-studies" className="relative px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Featured Case Studies
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Featured Case Studies
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Explore real CRM, Revenue Operations, Marketing Automation, Website Integration, and AI Automation projects through an interactive case study portfolio.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <FlipCard key={c.title} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ c }: { c: (typeof cases)[number] }) {
  return (
    <div className="group [perspective:1600px] min-h-[420px]">
      <div className="relative h-full w-full min-h-[420px] transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)] [.is-flipped_&]:[transform:rotateY(180deg)]">
        {/* FRONT */}
        <div
          tabIndex={0}
          onClick={(e) => {
            // mobile tap toggle
            const parent = (e.currentTarget.parentElement?.parentElement) as HTMLElement | null;
            parent?.classList.toggle("is-flipped");
          }}
          className="absolute inset-0 flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm [backface-visibility:hidden] transition-shadow duration-300 group-hover:border-accent/40 group-hover:shadow-[0_0_40px_-8px_hsl(var(--accent)/0.35)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
              {c.industry}
            </span>
            <h3 className="mt-5 text-2xl font-bold leading-tight tracking-tight">
              {c.title}
            </h3>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {c.category}
            </p>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Key Outcome
              </p>
              <p className="mt-1 text-xl font-bold text-foreground">{c.metric}</p>
            </div>
            <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Click to View Summary
            </p>
          </div>
        </div>

        {/* BACK */}
        <div
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest("a")) return;
            const parent = (e.currentTarget.parentElement?.parentElement) as HTMLElement | null;
            parent?.classList.toggle("is-flipped");
          }}
          className="absolute inset-0 flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-accent/40 bg-card/70 p-8 backdrop-blur-md [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_40px_-8px_hsl(var(--accent)/0.4)]"
        >
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Challenge
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {c.challenge}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Solution
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {c.solution}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Result
              </p>
              <p className="mt-1.5 text-sm font-semibold leading-relaxed text-foreground">
                {c.result}
              </p>
            </div>
          </div>

          <Link
            to="/case-studies"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-all hover:opacity-90"
          >
            View Full Case Study
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
