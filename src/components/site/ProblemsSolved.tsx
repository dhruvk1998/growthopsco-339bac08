const problems = [
  {
    problem: "Lost leads",
    solution: "Designed automated routing.",
  },
  {
    problem: "Manual reporting",
    solution: "Built reporting automation.",
  },
  {
    problem: "CRM migration",
    solution: "Rolled out company-wide implementation.",
  },
  {
    problem: "Disconnected marketing",
    solution: "Integrated website, chatbot and CRM.",
  },
  {
    problem: "Poor visibility",
    solution: "Built dashboards and business reporting.",
  },
];

export function ProblemsSolved() {
  return (
    <section id="problems-solved" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Real Business Problems Solved
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Outcomes over software names.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.problem}
              className="group rounded-2xl border border-border bg-card/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_hsl(var(--accent)/0.45)]"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Problem
              </div>
              <h3 className="mt-2 text-xl font-bold text-foreground">{p.problem}</h3>
              <div className="my-5 flex items-center gap-3 text-accent">
                <span className="h-px flex-1 bg-accent/30" />
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
                  <path d="M12 4l-1.4 1.4L16.2 11H4v2h12.2l-5.6 5.6L12 20l8-8z" />
                </svg>
                <span className="h-px flex-1 bg-accent/30" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-accent">
                Solution
              </div>
              <p className="mt-2 text-base leading-relaxed text-foreground">{p.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
