import { Link } from "@tanstack/react-router";

const services = [
  {
    title: "CRM Setup & Implementation",
    desc: "Architect Freshworks or LeadSquared end-to-end — pipelines, lifecycle, permissions.",
  },
  {
    title: "Workflow Automation",
    desc: "Lead routing, follow-up sequences, task automation, internal alerts and SLAs.",
  },
  {
    title: "Lead Process Design",
    desc: "Lifecycle stages mapped to how your team actually sells, with scoring and ownership.",
  },
  {
    title: "Website ↔ CRM Integration",
    desc: "API coordination, lead capture, field mapping, and synchronized workflows.",
  },
  {
    title: "Chatbot Integration",
    desc: "Lead qualification, automated intake, and CRM synchronization in one flow.",
  },
  {
    title: "CRM Audit & Optimization",
    desc: "Process review, automation audit, lead leakage analysis, and a fix roadmap.",
  },
];

export function HomeServicesPreview() {
  return (
    <section className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Services</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Consulting built around your CRM lifecycle.
            </h2>
          </div>
          <Link
            to="/services"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            View all services →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-border bg-card/70 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              <Link
                to="/services"
                className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent opacity-0 transition-opacity group-hover:opacity-100"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
