const reasons = [
  {
    title: "CRM Implementation Experience",
    body: "Hands-on Freshworks and LeadSquared rollouts across departments — from architecture to adoption.",
  },
  {
    title: "Workflow Automation Expertise",
    body: "Automation that removes manual steps without breaking the way the team already works.",
  },
  {
    title: "Revenue Operations Mindset",
    body: "Decisions framed around pipeline impact, conversion, and forecasting — not vanity configuration.",
  },
  {
    title: "Business Analysis Background",
    body: "Stakeholder discovery and process mapping that surfaces the real problem before any tool is touched.",
  },
  {
    title: "CRM Adoption Focus",
    body: "Engagements measured by whether the team actually lives in the system, not whether it was launched.",
  },
  {
    title: "Website Integration Experience",
    body: "API coordination with developers to make forms, chatbots, and CRM behave as one connected system.",
  },
  {
    title: "Chatbot Deployment Experience",
    body: "Conversational lead capture wired into qualification, routing, and CRM workflows end-to-end.",
  },
  {
    title: "Process Improvement Expertise",
    body: "Continuous audit, optimization, and roadmap work — turning underperforming CRMs into revenue engines.",
  },
];

export function WhyWorkWithMe() {
  return (
    <section id="why-work-with-me" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Why Work With Me</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            An independent consultant — not an agency.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Direct engagement, operator-level thinking, and accountability for real outcomes across CRM, automation, and revenue operations.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <h3 className="text-base font-bold text-foreground">{r.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
