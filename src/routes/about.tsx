import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { About } from "@/components/site/About";
import { Experience } from "@/components/site/Experience";
import { FinalCTA } from "@/components/site/FinalCTA";

const whyThisWork = [
  {
    title: "A technical foundation",
    body: "Started in software engineering and systems work — shipping production monitoring tools used by NDTV and TV18. That foundation makes API integrations, data modeling, and platform decisions a strength, not a blocker.",
  },
  {
    title: "Business analysis instincts",
    body: "Power BI reporting and BA work taught me that the right question matters more than the right query. Stakeholder discovery comes before configuration on every engagement.",
  },
  {
    title: "Operator-level CRM experience",
    body: "Owned Freshworks and LeadSquared end-to-end inside growing businesses — lead routing, automation, integrations, reporting. Lived with the trade-offs, not just designed around them.",
  },
  {
    title: "An MBA lens on operations",
    body: "MBA work at University Canada West reframed CRM and automation as revenue operations problems — pipeline economics, conversion math, and forecast confidence, not platform configuration.",
  },
];

const howIWork = [
  { title: "Business-first approach", body: "Every recommendation traces back to a business outcome — pipeline, conversion, response time, adoption — not a feature." },
  { title: "Practical recommendations", body: "Roadmaps are sequenced by impact and effort, not platform novelty. Quick wins ship before structural rebuilds." },
  { title: "Direct consultant involvement", body: "You work with me, not a delivery team behind me. No account managers, no handoffs, no diluted execution." },
  { title: "Adoption is the deliverable", body: "A CRM nobody uses is a failed engagement. Enablement and adoption tracking are scoped in, not bolted on." },
  { title: "Usability over complexity", body: "Workflows are designed for the rep at 4pm on a Friday — not the architecture diagram in the deck." },
  { title: "Honest scoping", body: "If your situation doesn't need an implementation or doesn't fit my experience, I'll say so on the first call." },
];

const title = "About — Dhruv Kaushik | CRM, Automation & RevOps Consultant";
const description =
  "An independent CRM, Workflow Automation, and Revenue Operations consultant. MBA at University Canada West, hands-on Freshworks and LeadSquared implementation experience, and a technical background spanning software and business analysis.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://dhruvrevops.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="A consultant who understands both the business and the system behind it."
        description="Combining business analysis, CRM implementation experience, workflow automation, and revenue operations to help growing businesses operate more effectively."
      />
      <About />

      <section className="px-6 py-20">
        <div className="reveal mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Why This Work</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              The throughline: process problems wearing technology costumes.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Most operational inefficiency in growing businesses doesn't come from missing software. It comes from broken processes, unclear ownership, and operational systems that were never designed — they accumulated. CRM and automation are how those problems get solved at scale.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {whyThisWork.map((w) => (
              <div key={w.title} className="rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-accent/40">
                <h3 className="text-lg font-bold">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="reveal mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">How I Work</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Engagement principles, not just a methodology.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {howIWork.map((h) => (
              <div key={h.title} className="rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-accent/40">
                <h3 className="text-base font-bold">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Experience />
      <FinalCTA />
    </SiteLayout>
  );
}
