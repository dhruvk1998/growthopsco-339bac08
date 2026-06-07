const pillars = [
  { icon: "🗂️", title: "One place for leads & customers" },
  { icon: "📞", title: "Consistent, reliable follow-up" },
  { icon: "👁️", title: "Visibility and accountability" },
  { icon: "📈", title: "A foundation built to scale" },
];

export function WhatIsCRM() {
  return (
    <section id="what-is-crm" className="px-6 py-20">
      <div className="reveal mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">The Solution</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
            Why a well-run CRM matters.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A CRM is simply the central place your business manages leads, customers, and the conversations that turn one into the other. Done right, it removes guesswork and gives leadership a clear view of what's actually happening.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-accent/40"
            >
              <div className="mb-3 grid size-10 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-lg">
                {p.icon}
              </div>
              <p className="text-sm font-bold text-foreground">{p.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
