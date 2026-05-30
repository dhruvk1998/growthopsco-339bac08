const items = [
  {
    quote:
      "Dhruv rebuilt our lead intake from the ground up. Within weeks our reps trusted the CRM enough to actually live in it — that alone changed our forecasting.",
    name: "Head of Sales",
    role: "B2B SaaS · Series A",
  },
  {
    quote:
      "He doesn't just configure software — he asks the business questions first. Our workflow finally matches how we actually sell.",
    name: "Revenue Operations Lead",
    role: "Education Tech",
  },
  {
    quote:
      "The chatbot-to-CRM integration cut our response time from hours to seconds. The ROI was obvious in the first month.",
    name: "Marketing Director",
    role: "Professional Services",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">What Clients Say</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Trusted by operators who care about pipeline.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name + t.role}
              className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card/70 p-7 transition-all hover:border-accent/40"
            >
              <svg viewBox="0 0 32 32" className="size-7 text-accent" fill="currentColor" aria-hidden>
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
              </svg>
              <blockquote className="mt-5 text-base leading-relaxed text-foreground">"{t.quote}"</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
