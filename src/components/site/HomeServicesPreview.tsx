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

type Props = {
  showCTA?: boolean;
  heading?: string;
  description?: string;
};

export function HomeServicesPreview({
  showCTA = true,
  heading = "Solutions built for growing businesses.",
  description = "CRM, automation, integrations, and process design that help teams scale without operational chaos.",
}: Props) {
  return (
    <section id="services" className="px-6 py-16">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Services</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {standardServices.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card/70 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
            </div>
          ))}
        </div>

        {showCTA && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/services"
              className="inline-block rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
            >
              Explore All Services →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
