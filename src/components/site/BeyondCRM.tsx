const capabilities = [
  {
    icon: "🧩",
    title: "CRM Implementation & Optimization",
    outcome: "Give your team a sales process they actually use — and leadership a pipeline they can trust.",
    detail: "Setup, cleanup, or optimization of platforms like Freshworks, LeadSquared, HubSpot, Zoho, and Salesforce.",
  },
  {
    icon: "⚡",
    title: "Workflow Automation",
    outcome: "Cut hours of repetitive work every week and make sure nothing slips through the cracks.",
    detail: "Lead routing, follow-up sequences, alerts, approvals, and stuck-deal recovery — running on their own.",
  },
  {
    icon: "🔌",
    title: "API & System Integrations",
    outcome: "Get your business tools talking to each other so data flows where it's needed, automatically.",
    detail: "Connect your website, forms, chatbot, marketing tools, finance system, and CRM into one connected stack.",
  },
  {
    icon: "🤖",
    title: "AI Assistants & Chatbots",
    outcome: "Respond to inquiries instantly, qualify leads around the clock, and free your team for higher-value work.",
    detail: "AI assistants for sales, support, and internal teams — integrated with your CRM and knowledge base.",
  },
  {
    icon: "🐍",
    title: "Python-Based Automation",
    outcome: "Eliminate repetitive manual processes that no off-the-shelf tool can fully handle.",
    detail: "Custom scripts and lightweight tools for data movement, monitoring, and back-office automation.",
  },
  {
    icon: "📊",
    title: "Reporting & Business Intelligence",
    outcome: "Replace hours of manual reporting with dashboards leadership can trust at a glance.",
    detail: "Power BI and CRM dashboards that turn operational data into clear, decision-ready insight.",
  },
];

export function BeyondCRM() {
  return (
    <section id="beyond-crm" className="px-6 py-16">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Capabilities</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Beyond CRM: automation & business systems.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Connect your business tools, automate routine tasks, and create efficient workflows that save time, improve consistency, and support growth. A CRM is often the starting point — but rarely the whole solution.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="group rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-xl">
                {c.icon}
              </div>
              <h3 className="text-base font-bold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{c.outcome}</p>
              <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                {c.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
