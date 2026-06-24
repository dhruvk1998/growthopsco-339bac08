import { Link } from "@tanstack/react-router";
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

export function TestimonialsPreview() {
  return (
    <section id="home-testimonials" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Trusted by Clients & Teams
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Real feedback from businesses I've worked with.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_hsl(var(--accent)/0.45)]"
            >
              <Stars />
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-foreground">
                "{t.excerpt}"
              </blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t.title ? `${t.title} · ` : ""}{t.company}
                  </div>
                </div>
                <div className="grid h-10 w-20 shrink-0 place-items-center rounded-md bg-white/90 px-2">
                  <img
                    src={t.logo}
                    alt={t.logoAlt}
                    className="max-h-8 w-auto max-w-full object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                    loading="lazy"
                  />
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/about"
            hash="testimonials"
            className="inline-flex items-center gap-2 text-sm font-bold text-accent transition-all hover:gap-3"
          >
            Read full testimonials <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
