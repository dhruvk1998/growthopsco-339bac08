const role = [
  "Implemented Freshworks CRM from scratch company-wide",
  "Collaborated with stakeholders across departments",
  "Designed lead lifecycle stages tied to business goals",
  "Configured workflows, routing and automation systems",
  "Coordinated API integrations with website developers",
  "Integrated chatbot directly with the CRM",
  "Optimized operational workflows for sales velocity",
];

const outcomes = [
  { value: "1", label: "Centralized lead visibility across teams" },
  { value: "100%", label: "Standardized lead intake process" },
  { value: "↑", label: "Improved workflow efficiency" },
  { value: "∞", label: "Scalable CRM foundation" },
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Featured Work</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Company-Wide Freshworks CRM Implementation
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card/70">
          <div className="grid lg:grid-cols-[1.3fr_1fr]">
            <div className="p-8 lg:p-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">The Challenge</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    A disorganized lead management process with no unified CRM. Leads were arriving from multiple channels with no consistent owner, no follow-up SLA, and no visibility for leadership.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">The Approach</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Deployed Freshworks CRM end-to-end, mapped lead lifecycle stages to real sales motions, and shipped automation + integrations that the team actually adopted.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent">My Role</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {role.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border bg-gradient-to-br from-accent/10 to-transparent p-8 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Outcome</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {outcomes.map((o) => (
                  <div key={o.label} className="rounded-xl border border-border bg-background/40 p-5">
                    <div className="text-3xl font-bold text-accent">{o.value}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{o.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm italic leading-relaxed text-muted-foreground">
                The CRM is now the operating system for sales — every lead tracked, every stage measured, every workflow accountable.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {["LeadSquared Lifecycle Redesign", "Chatbot ↔ CRM Integration Sprint"].map((t) => (
            <div
              key={t}
              className="flex items-center justify-between rounded-2xl border border-dashed border-border bg-card/40 p-6 text-muted-foreground"
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent/70">Upcoming Case Study</p>
                <p className="mt-1 font-semibold text-foreground">{t}</p>
              </div>
              <span className="text-xs">Coming soon</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
