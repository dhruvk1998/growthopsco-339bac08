const segments = [
  {
    title: "Growing service businesses",
    body: "Scaling past the spreadsheet phase and need a CRM that matches how the team actually sells.",
  },
  {
    title: "First-time CRM implementations",
    body: "Selecting and rolling out a CRM for the first time — and want it done right instead of redone in a year.",
  },
  {
    title: "Teams migrating from spreadsheets",
    body: "Moving lead, deal, and customer data out of disconnected sheets into one source of truth.",
  },
  {
    title: "Struggling lead management",
    body: "Leads going cold, ownership unclear, follow-ups inconsistent, and no SLA enforcement.",
  },
  {
    title: "Workflow automation needs",
    body: "Repetitive manual work, slow handoffs, and missed follow-ups draining rep productivity.",
  },
  {
    title: "Freshworks or LeadSquared users",
    body: "Already on the platform but underutilizing it — looking to optimize, audit, or extend the implementation.",
  },
];

export function WhoIHelp() {
  return (
    <section id="who-i-help" className="px-6 py-20">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Who I Help</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Built for operators ready to professionalize their revenue process.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Engagements are scoped for businesses with real lead volume, real teams, and real operational complexity — not pre-revenue setups.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
