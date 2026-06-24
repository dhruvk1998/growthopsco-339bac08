import { Link } from "@tanstack/react-router";
import { HeroDashboard } from "./HeroDashboard";

export function Hero() {
  return (
    <section id="hero" className="relative px-6 pt-24 pb-12 lg:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            CRM · Automation · Business Systems
          </div>
          <h1 className="text-5xl font-bold leading-[1.04] tracking-tight md:text-6xl lg:text-[3.75rem]">
            Stop losing leads.{" "}
            <span className="text-accent">Run a sales process you can actually see.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            I help businesses implement CRM, automate workflows, and build systems that bring clarity to customer operations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/contact"
              hash="consultation-form"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground transition-all hover:opacity-90"
            >
              Book a Free Consultation
              <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>→</span>
            </Link>
            <Link
              to="/case-studies"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:border-accent/50 hover:bg-white/5 hover:text-accent"
            >
              View Case Studies
              <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="lg:pl-4">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
