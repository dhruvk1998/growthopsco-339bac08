const principles = [
  {
    title: "Transparent",
    body: "Clear scope, clear trade-offs, clear status. No black-box engagements.",
    icon: (
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 100-6 3 3 0 000 6z" />
    ),
  },
  {
    title: "Reliable",
    body: "Systems your team can trust, with documentation that outlasts the engagement.",
    icon: <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />,
  },
  {
    title: "Continuous",
    body: "Iterate against real adoption — not a launch checklist.",
    icon: (
      <path d="M12 4V1L7 6l5 5V7a5 5 0 11-5 5H5a7 7 0 107-8z" />
    ),
  },
  {
    title: "Business First",
    body: "Pipeline economics and operator reality lead — tooling follows.",
    icon: (
      <path d="M3 13l4 4 14-14-1.5-1.5L7 14l-2.5-2.5L3 13z" />
    ),
  },
];

export function CorePrinciples() {
  return (
    <section id="core-principles" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Core Principles
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            How every engagement is run.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-border bg-card/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_hsl(var(--accent)/0.45)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                  {p.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
