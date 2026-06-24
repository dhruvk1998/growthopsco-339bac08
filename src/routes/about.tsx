import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { About } from "@/components/site/About";
import { MyApproach } from "@/components/site/MyApproach";
import { TechExpertise } from "@/components/site/TechExpertise";
import { TechPlatforms } from "@/components/site/TechPlatforms";
import { ConsultingPhilosophy } from "@/components/site/ConsultingPhilosophy";
import { ProblemsSolved } from "@/components/site/ProblemsSolved";
import { CorePrinciples } from "@/components/site/CorePrinciples";
import { TestimonialsFull } from "@/components/site/TestimonialsFull";
import { FinalCTA } from "@/components/site/FinalCTA";

const journey = [
  {
    phase: "Technology foundation",
    body: "Started as a Python developer and systems engineer — shipping production monitoring tools used by NDTV and TV18. That foundation makes APIs, data, and integrations a strength, not a blocker.",
  },
  {
    phase: "Business analysis",
    body: "Power BI reporting and BA work taught me that the right question matters more than the right query. Stakeholder discovery comes before configuration on every engagement.",
  },
  {
    phase: "CRM & operations",
    body: "Owned CRM platforms end-to-end inside growing businesses — lead routing, automation, integrations, reporting, and adoption. Lived with the trade-offs, not just designed around them.",
  },
  {
    phase: "Business education",
    body: "MBA work at University Canada West reframed CRM and automation as business problems — pipeline economics, conversion math, and operational leverage, not platform configuration.",
  },
  {
    phase: "Independent consulting",
    body: "Today I work with founders and operations leaders to translate business goals into CRM, automation, and business-system solutions that the team actually uses.",
  },
];

const title = "About — Dhruv Kaushik | CRM, Automation & Business Systems Consultant";
const description =
  "An independent CRM, Automation, and Business Systems consultant helping growing businesses create structure, visibility, and efficiency. MBA from University Canada West, with deep technical execution capability across CRMs, integrations, AI, and Python.";

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
        title="Helping businesses create structure, visibility, and scalable systems."
        description="A business-focused consultant with strong technical execution — combining strategy, CRM, automation, and integrations to help growing organizations operate with confidence."
      />

      {/* Section 1: Personal introduction */}
      <About />

      {/* Section 2: Professional journey */}
      <section id="journey" className="px-6 py-24">
        <div className="reveal mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Professional Journey</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              A path through technology, operations, and business strategy.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              The throughline across every role: process problems wearing technology costumes. Each step added a new lens for solving them.
            </p>
          </div>
          <ol className="relative space-y-5 border-l border-border pl-6">
            {journey.map((j) => (
              <li key={j.phase} className="relative">
                <span className="absolute -left-[31px] top-2 grid size-4 place-items-center rounded-full border border-accent/40 bg-background">
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>
                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-accent">{j.phase}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{j.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Consulting Philosophy */}
      <ConsultingPhilosophy />

      {/* My Approach */}
      <MyApproach />

      {/* Technology & Automation Expertise */}
      <TechExpertise />

      {/* Real Business Problems Solved (replaces resume-style Experience) */}
      <ProblemsSolved />

      {/* Core Principles */}
      <CorePrinciples />

      {/* Technology platforms */}
      <TechPlatforms />

      {/* Testimonials */}
      <TestimonialsFull />

      {/* Contact CTA */}
      <FinalCTA />
    </SiteLayout>
  );
}
