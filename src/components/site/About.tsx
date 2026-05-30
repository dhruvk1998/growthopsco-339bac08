const facts = [
  { label: "Years in CRM Ops", value: "5+" },
  { label: "Departments Aligned", value: "12" },
  { label: "Workflows Automated", value: "40+" },
  { label: "Platforms Mastered", value: "Freshworks · LeadSquared" },
];

const bullets = [
  "Set up Freshworks CRM company-wide from the ground up",
  "Designed lead process flows aligned to business operations",
  "Built workflow automations across the lead lifecycle",
  "Coordinated API integrations with website development teams",
  "Implemented chatbot ↔ CRM integration for instant capture",
  "Optimized stakeholder reporting and pipeline visibility",
];

export function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="reveal mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">About</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            I build the operational backbone behind growing sales teams.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            I'm Dhruv — a CRM Implementation & Workflow Automation consultant based in Canada. I partner with founders, sales leaders, and operations heads to translate messy lead processes into structured, automated, measurable systems.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            My background isn't pure engineering. It's <span className="text-foreground">business operations meets technical fluency</span> — which is exactly what makes CRM implementations succeed.
          </p>
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
