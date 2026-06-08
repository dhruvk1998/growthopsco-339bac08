const roles = [
  {
    company: "Ozone Overseas Pvt. Ltd.",
    title: "CRM Automation Executive",
    period: "2023 — 2024",
    summary:
      "Owned LeadSquared and Freshworks automation end-to-end. Re-architected lead intake, routing, and SLA logic — cutting average first-response time from ~20 minutes to under 1 minute and improving conversion across the funnel.",
    highlights: [
      "Designed lifecycle stages and routing rules adopted company-wide",
      "Coordinated API integrations between website, chatbot and CRM",
      "Aligned automation with stakeholder needs across sales & marketing",
    ],
  },
  {
    company: "Areneva Technologies Pvt. Ltd.",
    title: "Business Analyst Intern",
    period: "2022",
    summary:
      "Built Power BI reporting systems that replaced manual stakeholder reports — reducing reporting effort by 80% and giving leadership real-time visibility into operations.",
    highlights: [
      "Translated business questions into reusable dashboards",
      "Standardized KPI definitions across teams",
      "Automated weekly operational reporting workflows",
    ],
  },
  {
    company: "Saurabhi Media Pvt. Ltd.",
    title: "Python Developer / Systems Engineer",
    period: "2021 — 2022",
    summary:
      "Shipped operational monitoring systems used in production by NDTV and TV18 — improving process visibility and reducing manual checks by 90%.",
    highlights: [
      "Built always-on file/event monitoring with audit trails",
      "Integrated alerting with SMTP for anomaly response",
      "Improved cross-team accountability through structured logs",
    ],
  },
];

const education = [
  { school: "University Canada West", program: "MBA — Vancouver, BC", period: "Present" },
  { school: "Guru Gobind Singh Indraprastha University", program: "BCA — New Delhi", period: "Completed" },
];

export function Experience() {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Experience</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            A track record across CRM, analytics and operational systems.
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-accent/50 via-border to-transparent md:left-6" />
          <ol className="space-y-6">
            {roles.map((r) => (
              <li key={r.company} className="relative pl-12 md:pl-16">
                <span className="absolute left-2 top-6 grid size-5 place-items-center rounded-full border border-accent/40 bg-background md:left-4">
                  <span className="size-2 rounded-full bg-accent" />
                </span>
                <div className="rounded-2xl border border-border bg-card/70 p-6 transition-colors hover:border-accent/40">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{r.title}</h3>
                      <p className="text-sm text-accent">{r.company}</p>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {r.period}
                    </span>
                  </div>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{r.summary}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                    {r.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {education.map((e) => (
            <div key={e.school} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Education</div>
              <div className="mt-1 font-bold">{e.program}</div>
              <div className="text-sm text-muted-foreground">
                {e.school} · {e.period}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
