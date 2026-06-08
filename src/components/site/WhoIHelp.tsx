const segments = [
  { title: "Professional Service Firms", body: "Consultants, accountants, legal practices." },
  { title: "Education Providers", body: "Training companies and educational organizations." },
  { title: "Real Estate Businesses", body: "Brokerages and development teams." },
  { title: "Agencies", body: "Marketing, creative, and services agencies." },
  { title: "Growing SMBs", body: "Owner-led businesses scaling their first sales team." },
  { title: "Scaling Beyond Spreadsheets", body: "Teams outgrowing Excel and Google Sheets." },
];

export function WhoIHelp() {
  return (
    <section id="who-i-help" className="px-6 py-16">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Who I Help</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Built for growing businesses ready to operate with structure.
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {segments.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card/60 p-5 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
