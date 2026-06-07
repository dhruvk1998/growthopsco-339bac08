const segments = [
  {
    title: "Professional Service Firms",
    body: "Consultancies, accountants, lawyers, and agencies that win business through relationships and need every inquiry handled well.",
  },
  {
    title: "Education Providers",
    body: "Institutes, training companies, and ed-tech businesses managing high inquiry volumes across multiple programs and counsellors.",
  },
  {
    title: "Real Estate Businesses",
    body: "Brokerages and developers juggling buyer leads, site visits, and follow-up across distributed sales teams.",
  },
  {
    title: "Agencies",
    body: "Marketing, creative, and services agencies that need to professionalize how they capture, qualify, and convert opportunities.",
  },
  {
    title: "Growing Small & Medium Businesses",
    body: "Owner-led businesses past the startup phase, hiring their second or third salesperson and feeling the seams of informal process.",
  },
  {
    title: "Businesses Scaling Beyond Spreadsheets",
    body: "Teams who built their process in Excel and Google Sheets — and now need a real system that grows with them.",
  },
];

export function WhoIHelp() {
  return (
    <section id="who-i-help" className="px-6 py-20">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Who I Help</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Built for growing businesses ready to operate with structure.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Engagements work best for owner-led and growth-stage businesses with real customers, real teams, and operational complexity that's outgrown spreadsheets and informal process.
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
