const pillars = [
  {
    title: "One place for every lead and customer",
    body: "Instead of inboxes, spreadsheets, and chat threads — a single system where every contact, conversation, and next step lives.",
  },
  {
    title: "Consistent, reliable follow-up",
    body: "Reminders, sequences, and ownership rules make sure no lead falls through the cracks — even on a busy week.",
  },
  {
    title: "Visibility and accountability",
    body: "Leadership can see what's happening in the pipeline in real time — who owns what, what's stuck, and what's likely to close.",
  },
  {
    title: "A foundation built to scale",
    body: "When the team grows or volume doubles, the process keeps working — because it was designed, not improvised.",
  },
];

export function WhatIsCRM() {
  return (
    <section id="what-is-crm" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">The Solution</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            What is a CRM, and why does it matter?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            A CRM (Customer Relationship Management system) is simply the central place where your business manages leads, customers, and the conversations that turn one into the other. Done right, it removes guesswork, makes the team accountable, and gives leadership a clear view of what's actually happening.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="relative rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-accent/40"
            >
              <div className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                0{i + 1}
              </div>
              <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
