const facts = [
  { label: "Education", value: "MBA — UCW" },
  { label: "Years in CRM Ops", value: "3+" },
  { label: "Departments Aligned", value: "12" },
  { label: "Workflows Automated", value: "40+" },
];

const bullets = [
  "Designed and rolled out Freshworks CRM company-wide across sales, marketing, and support",
  "Owned LeadSquared automation end-to-end — re-architected lead intake, routing, and SLA logic",
  "Translated stakeholder needs into lead lifecycle, pipeline, and reporting architecture",
  "Coordinated API integrations between website, chatbot, and CRM with developer teams",
  "Built Power BI reporting systems replacing manual leadership reports",
  "Shipped production-grade Python monitoring systems used at NDTV and TV18",
];

export function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="reveal mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">About</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            A consultant who understands the business — and can build the systems behind it.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            I'm <span className="text-foreground">Dhruv Kaushik</span> — a CRM, Automation, and Business Systems consultant based in Burnaby, BC. I help founders and operations leaders turn messy, manual ways of working into structured systems that create visibility, consistency, and room to grow.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            My background combines an <span className="text-foreground">MBA at University Canada West</span>, hands-on experience implementing CRMs and automation inside growing businesses, and a technical foundation in software, integrations, and Python. That mix — <span className="text-foreground">business strategy, operator instinct, and technical execution</span> — is what makes these engagements actually deliver results.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Most operational pain in growing businesses isn't a software problem. It's a process problem dressed up as a tooling problem — and that's exactly what I help fix.
          </p>
          <a
            href="https://www.linkedin.com/in/dhruv-kaushik-95231a175/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
            Connect on LinkedIn
          </a>
        </div>

        <div>
          <ul className="space-y-3">
            {bullets.map((b) => (
              <li
                key={b}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card/60 p-4 transition-all hover:border-accent/40 hover:bg-card"
              >
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
                  <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor">
                    <path d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed text-foreground">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-xl font-bold text-accent">{f.value}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
