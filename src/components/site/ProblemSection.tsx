const problems = [
  {
    icon: "📊",
    title: "Leads scattered everywhere",
    body: "Inquiries live across spreadsheets, inboxes, WhatsApp, and notebooks — and no one has the full picture.",
  },
  {
    icon: "⏰",
    title: "Follow-ups depend on memory",
    body: "Whether a lead gets called back depends on which rep remembers — not on a process that runs reliably.",
  },
  {
    icon: "🔍",
    title: "Customer info is hard to track",
    body: "Conversations, history, and next steps are spread across people and tools, so nothing is easy to find.",
  },
  {
    icon: "📈",
    title: "Reporting takes hours of manual work",
    body: "Leadership reports are stitched together in Excel every week — and the numbers rarely agree.",
  },
  {
    icon: "🧭",
    title: "Sales processes are inconsistent",
    body: "Every rep sells a little differently. New hires take months to ramp because nothing is documented.",
  },
  {
    icon: "⚙️",
    title: "Growth is creating chaos",
    body: "More leads, more people, more tools — and the operational seams are starting to show.",
  },
];

export function ProblemSection() {
  return (
    <section id="does-this-sound-familiar" className="px-6 py-16">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">The Problem</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Does this sound familiar?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Most growing businesses don't have a software problem — they have a process problem that software keeps making worse. If one or more of these feels like your reality, you're not alone.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-xl">
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
