const groups = [
  {
    title: "Platforms",
    items: ["Freshworks CRM", "LeadSquared", "Freshsales", "Freshdesk"],
  },
  {
    title: "Process & Strategy",
    items: ["Lead Lifecycle Management", "Sales Pipeline Design", "Business Process Mapping", "Stakeholder Management"],
  },
  {
    title: "Automation & Integration",
    items: ["CRM Automation", "Workflow Design", "Lead Routing", "API Integration", "Chatbot Integration"],
  },
  {
    title: "Optimization",
    items: ["CRM Audit", "Process Optimization", "Adoption & Training", "Reporting & Visibility"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Skills & Tools</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            The toolkit behind every engagement.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-border bg-card/70 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent">{g.title}</h3>
              <ul className="mt-5 space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="size-1.5 rounded-full bg-accent/70" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
