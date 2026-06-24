import { testimonials } from "./testimonials-data";

function Stars() {
  return (
    <div className="flex gap-0.5 text-accent" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.9L10 14.9l-5.3 2.8 1-5.9L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsFull() {
  return (
    <section id="testimonials" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Testimonials
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            What clients say about working together.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-2xl border border-border bg-card/70 p-7 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_hsl(var(--accent)/0.45)]"
            >
              <Stars />
              <blockquote className="mt-5 flex-1 whitespace-pre-line text-[15px] leading-relaxed text-foreground">
                "{t.full}"
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t.title ? `${t.title} · ` : ""}{t.company}
                  </div>
                </div>
                <div className="grid h-10 w-20 shrink-0 place-items-center rounded-md bg-white/95 px-2">
                  <img
                    src={t.logo}
                    alt={t.logoAlt}
                    className="max-h-8 w-auto max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
