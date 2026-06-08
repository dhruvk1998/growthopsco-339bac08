import { Link } from "@tanstack/react-router";

export const standardServices = [
  {
    title: "CRM Implementation",
    engagement: "Engagement",
    summary: "Build a sales process your team actually follows.",
  },
  {
    title: "Workflow Automation",
    engagement: "Engagement",
    summary: "Reduce manual work and improve response times.",
  },
  {
    title: "Lead Process Design",
    engagement: "Engagement",
    summary: "Make sure no inquiry falls through the cracks.",
  },
  {
    title: "Integration Project",
    engagement: "Engagement",
    summary: "Connect your website and tools to your CRM.",
  },
  {
    title: "Chatbot & AI Integration",
    engagement: "Engagement",
    summary: "Turn chatbot conversations into real opportunities.",
  },
  {
    title: "CRM Audit",
    engagement: "Engagement",
    summary: "Identify where leads, visibility, and accountability are breaking down.",
  },
];

export function HomeServicesPreview() {
  return (
    <section id="services" className="px-6 py-16">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Services</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Services named after the business problem they solve.
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
          {standardServices.map((s) => (
            <Link
              key={s.title}
              to="/services"
              className="group rounded-2xl border border-border bg-card/70 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
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
