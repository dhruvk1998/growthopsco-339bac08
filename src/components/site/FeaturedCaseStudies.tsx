import { Link } from "@tanstack/react-router";

const cases = [
  {
    slug: "freshworks-crm-rollout",
    category: "CRM Implementation",
    title: "Company-Wide Freshworks CRM Rollout",
    metric: "Centralized pipeline across departments",
    challenge:
      "Leads scattered across channels with no unified owner, no SLA, and zero leadership visibility.",
    solution:
      "Deployed Freshworks CRM end-to-end, mapped lifecycle stages to real sales motions, and shipped routing automation the team adopted.",
  },
  {
    slug: "sales-pipeline-automation",
    category: "Workflow Automation",
    title: "Sales Pipeline & Workflow Automation",
    metric: "~50% productivity improvement",
    challenge:
      "Reps spent hours on manual data entry, stage updates, and reporting instead of selling.",
    solution:
      "Built automation flows for stage transitions, task creation, follow-up reminders, and pipeline hygiene.",
  },
  {
    slug: "chatbot-crm-integration",
    category: "Website ↔ CRM Integration",
    title: "Chatbot ↔ CRM Integration Sprint",
    metric: "Up to 95% faster lead response",
    challenge:
      "Website inquiries were captured manually, slow to route, and frequently lost before follow-up.",
    solution:
      "Designed an API integration mapping chatbot fields to CRM records with validation, routing, and instant assignment.",
  },
  {
    slug: "ai-lead-qualification",
    category: "AI Automation",
    title: "AI-Powered Lead Qualification System",
    metric: "~99% qualified lead growth",
    challenge:
      "High lead volume with low MQL-to-SQL conversion — sales wasted time on poor-fit prospects.",
    solution:
      "Integrated an AI scoring layer with CRM workflows to auto-qualify, prioritize, and route only sales-ready leads.",
  },
];

export function FeaturedCaseStudies() {
  return (
    <section id="featured-case-studies" className="relative px-6 py-16">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Featured Case Studies
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Proof from real consulting engagements.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A snapshot of CRM, Revenue Operations, Marketing Automation, Website Integration, and AI Automation projects. Tap any card to reveal the engagement summary.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <FlipCard key={c.slug} c={c} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-bold text-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            View All Case Studies →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FlipCard({ c }: { c: (typeof cases)[number] }) {
  return (
    <div className="group [perspective:1600px] min-h-[300px]">
      <div className="relative h-full w-full min-h-[300px] transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] [.is-flipped_&]:[transform:rotateY(180deg)]">
        {/* FRONT */}
        <div
          tabIndex={0}
          onClick={(e) => {
            const parent = (e.currentTarget.parentElement?.parentElement) as HTMLElement | null;
            parent?.classList.toggle("is-flipped");
          }}
          className="absolute inset-0 flex cursor-pointer flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm [backface-visibility:hidden] transition-shadow duration-300 group-hover:border-accent/40 group-hover:shadow-[0_0_40px_-8px_hsl(var(--accent)/0.35)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
              {c.category}
            </span>
            <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight lg:text-2xl">
              {c.title}
            </h3>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Key Outcome
              </p>
              <p className="mt-1 text-base font-bold text-foreground">{c.metric}</p>
            </div>
            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Tap to Reveal
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
          className="absolute inset-0 flex cursor-pointer flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-accent/40 bg-card/70 p-6 backdrop-blur-md [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_40px_-8px_hsl(var(--accent)/0.4)]"
        >
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Challenge
              </p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                {c.challenge}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Solution
              </p>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                {c.solution}
              </p>
            </div>
          </div>

          <Link
            to="/case-studies"
            hash={c.slug}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground transition-all hover:opacity-90"
          >
            View Full Case Study →
          </Link>
        </div>
      </div>
    </div>
  );
}
