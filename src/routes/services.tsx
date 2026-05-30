import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Services } from "@/components/site/Services";
import { FinalCTA } from "@/components/site/FinalCTA";

const detailed = [
  {
    title: "CRM Setup & Implementation",
    bullets: ["CRM architecture", "Pipeline creation", "User permissions & roles", "Lead lifecycle design"],
  },
  {
    title: "Workflow Automation",
    bullets: ["Lead assignment & routing", "Follow-up automation", "Task automation", "Notification workflows"],
  },
  {
    title: "Website ↔ CRM Integration",
    bullets: ["API coordination", "Lead capture systems", "Data mapping", "Workflow synchronization"],
  },
  {
    title: "Chatbot Integration",
    bullets: ["Lead qualification", "Automated intake", "CRM synchronization", "Field mapping & validation"],
  },
  {
    title: "CRM Audit & Optimization",
    bullets: ["Process review", "Automation audit", "Lead leakage identification", "Improvement recommendations"],
  },
];

const title = "Services — CRM Implementation, Automation & Optimization";
const description =
  "CRM setup, workflow automation, lead process design, website-to-CRM integration, chatbot integration, and CRM audits for growing sales teams.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Services"
        title="Boutique CRM consulting engagements built for operators."
        description="Pick a single engagement or combine them into an end-to-end transformation. Every service is designed around business outcomes, not feature checklists."
      />
      <Services />

      <section className="px-6 py-20">
        <div className="reveal mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Detailed Scope</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              What's included in each engagement.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {detailed.map((d) => (
              <div key={d.title} className="rounded-2xl border border-border bg-card/70 p-6">
                <h3 className="text-lg font-bold text-foreground">{d.title}</h3>
                <ul className="mt-4 space-y-2">
                  {d.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </SiteLayout>
  );
}
