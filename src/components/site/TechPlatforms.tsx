const groups = [
  {
    title: "CRM Platforms",
    note: "Examples of platforms I work with — the right choice depends on your business.",
    items: ["Freshworks", "LeadSquared", "HubSpot", "Zoho CRM", "Salesforce", "Pipedrive"],
  },
  {
    title: "Automation & Integration",
    note: "Connecting tools and removing manual handoffs.",
    items: ["Zapier", "Make (Integromat)", "n8n", "Native CRM Workflows", "Webhooks", "REST APIs"],
  },
  {
    title: "AI & Conversational",
    note: "AI assistants and chatbots integrated with your CRM and content.",
    items: ["OpenAI / GPT", "Custom GPTs", "Chatbot Platforms", "RAG / Knowledge Bots"],
  },
  {
    title: "Data, Reporting & Custom Tooling",
    note: "From dashboards to scripts that quietly run the back office.",
    items: ["Power BI", "Looker Studio", "Python", "SQL", "Excel / Sheets Automation"],
  },
];

export function TechPlatforms() {
  return (
    <section id="platforms" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Technology Platforms</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Tools I work with — chosen to fit the business.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            I'm platform-agnostic by design. The right CRM, automation tool, or AI stack depends on your team, budget, and what you're trying to achieve — not on what I happen to know.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-border bg-card/70 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent">{g.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{g.note}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground"
                  >
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
