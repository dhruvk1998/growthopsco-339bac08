import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Workflow } from "@/components/site/Workflow";
import { HealthCheck } from "@/components/site/HealthCheck";
import { FinalCTA } from "@/components/site/FinalCTA";

const framework = [
  { step: "Discovery", desc: "Stakeholder interviews, channel mapping, current-state diagnostic." },
  { step: "Process Mapping", desc: "Lead journey, ownership, hand-offs, and SLA expectations." },
  { step: "CRM Design", desc: "Pipelines, lifecycle stages, fields, permissions and reporting model." },
  { step: "Automation", desc: "Routing, follow-up sequences, alerts, escalations, stuck-deal recovery." },
  { step: "Integration", desc: "Website forms, chatbot, APIs, and downstream business systems." },
  { step: "Optimization", desc: "Adoption tracking, audits, leak analysis, and continuous improvement." },
];

const title = "CRM Implementation Framework — A Repeatable Operator Playbook";
const description =
  "A six-stage CRM implementation framework: Discovery → Process Mapping → CRM Design → Automation → Integration → Optimization. Used on every consulting engagement.";

export const Route = createFileRoute("/framework")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.vercel.app/framework" }],
  }),
  component: FrameworkPage,
});

function FrameworkPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="CRM Framework"
        title="My CRM Implementation Framework."
        description="A repeatable, six-stage operator playbook I run on every CRM engagement — engineered to make lead management structured, automated and measurable."
      />

      <section className="px-6 py-16">
        <div className="reveal mx-auto max-w-7xl">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {framework.map((f, i) => (
              <div
                key={f.step}
                className="relative rounded-2xl border border-border bg-card/70 p-6 transition-colors hover:border-accent/40"
              >
                <div className="text-[11px] font-bold uppercase tracking-widest text-accent">
                  Stage 0{i + 1}
                </div>
                <h3 className="mt-2 text-xl font-bold">{f.step}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Workflow />
      <HealthCheck />
      <FinalCTA />
    </SiteLayout>
  );
}
