import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { About } from "@/components/site/About";
import { Experience } from "@/components/site/Experience";
import { FinalCTA } from "@/components/site/FinalCTA";

const approach = [
  { step: "Discovery", desc: "Understand the business, sales motion, stakeholders and current friction." },
  { step: "Design", desc: "Map lead lifecycle, pipeline stages, ownership and SLA rules." },
  { step: "Implement", desc: "Build the CRM, configure fields, permissions and reporting structure." },
  { step: "Automate", desc: "Routing, follow-ups, alerts, escalations — engineered for adoption." },
  { step: "Optimize", desc: "Measure, audit, and continuously improve workflows and visibility." },
];

const title = "About — Dhruv Kaushik | CRM Implementation Consultant";
const description =
  "CRM Implementation & Workflow Automation consultant with hands-on experience in Freshworks, LeadSquared, lead lifecycle design, API coordination, and operational efficiency.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="A CRM operator who understands the business behind the pipeline."
        description="I implement CRM systems, design lead workflows, build automations, integrate business systems, and work closely with stakeholders to improve operational efficiency."
      />
      <About />

      <section className="px-6 py-20">
        <div className="reveal mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">My Approach</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Discovery → Design → Implement → Automate → Optimize
            </h2>
          </div>

          <ol className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {approach.map((a, i) => (
              <li
                key={a.step}
                className="relative rounded-2xl border border-border bg-card/70 p-6 transition-colors hover:border-accent/40"
              >
                <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Phase 0{i + 1}</div>
                <div className="mt-2 text-lg font-bold">{a.step}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Experience />
      <FinalCTA />
    </SiteLayout>
  );
}
