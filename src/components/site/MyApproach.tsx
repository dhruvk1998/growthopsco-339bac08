const principles = [
  {
    title: "Understand the business first",
    body: "Every engagement starts with how the business actually operates, sells, and grows — not with software features or platform demos.",
  },
  {
    title: "Simplify before you systemize",
    body: "Bad process plus good software equals expensive bad process. Workflows get cleaned up before they get automated.",
  },
  {
    title: "Build solutions people actually use",
    body: "Adoption is the deliverable. If the team doesn't trust it on a busy Friday afternoon, the project failed.",
  },
  {
    title: "Focus on measurable outcomes",
    body: "Pipeline visibility, response time, follow-up rate, conversion, hours saved — outcomes that leadership can see and feel.",
  },
  {
    title: "Use technology as an enabler",
    body: "CRM, automation, integrations, and AI are tools in service of the business — not the point of the engagement.",
  },
  {
    title: "Stay honest about scope",
    body: "If your situation doesn't need an implementation, or doesn't fit my experience, you'll hear that on the first call.",
  },
];

export function MyApproach() {
  return (
    <section id="my-approach" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">My Approach</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Consulting principles, not just a methodology.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            The way I work is shaped by years of sitting on both sides of the table — building systems as an engineer, owning operations as a CRM lead, and advising as a consultant.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-accent/40"
            >
              <h3 className="text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
