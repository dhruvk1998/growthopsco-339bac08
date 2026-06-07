const expertise = [
  {
    icon: "🧩",
    title: "CRM Platforms",
    body: "Implementation, optimization, and audit across leading sales and operations CRMs.",
  },
  {
    icon: "⚡",
    title: "Workflow Automation",
    body: "Native CRM automation plus tools like Zapier and Make to eliminate manual handoffs.",
  },
  {
    icon: "🔌",
    title: "API Integrations",
    body: "Connecting websites, forms, marketing tools, finance systems, and CRMs into a single stack.",
  },
  {
    icon: "🐍",
    title: "Python Automation",
    body: "Custom scripts and tools for data movement, monitoring, and back-office automation.",
  },
  {
    icon: "🤖",
    title: "AI Assistants & Chatbots",
    body: "AI-powered assistants for sales, support, and internal operations — integrated with your data.",
  },
  {
    icon: "🗂️",
    title: "Data Management",
    body: "Data cleanup, deduplication, migration, and ongoing data quality systems.",
  },
  {
    icon: "📊",
    title: "Reporting & Dashboards",
    body: "Power BI and CRM dashboards that turn operational data into decision-ready insight.",
  },
  {
    icon: "🧭",
    title: "Process Optimization",
    body: "Mapping, simplifying, and redesigning operational workflows for measurable efficiency gains.",
  },
];

export function TechExpertise() {
  return (
    <section id="technology-expertise" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Technology & Automation Expertise</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Bridging business strategy and technical execution.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            My background in technology lets me bridge the gap between business strategy and execution. Beyond CRM implementation, I help organizations automate workflows, connect systems, reduce manual effort, and improve operational efficiency through practical technology solutions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {expertise.map((e) => (
            <div
              key={e.title}
              className="rounded-2xl border border-border bg-card/60 p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-xl">
                {e.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground">{e.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{e.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
