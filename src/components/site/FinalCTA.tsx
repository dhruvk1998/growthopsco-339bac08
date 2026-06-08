import { Link } from "@tanstack/react-router";

export function FinalCTA({
  eyebrow = "Let's Talk",
  title = "Let's Improve Your CRM Operations",
  subtitle = "If your team is struggling with manual processes, inconsistent follow-up, disconnected systems, or CRM adoption challenges, let's discuss how your operations can be streamlined.",
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="px-6 py-20">
      <div className="reveal mx-auto max-w-6xl overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/15 via-card/80 to-transparent p-10 text-center sm:p-14">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">{eyebrow}</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{subtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            hash="consultation-form"
            className="rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground transition-all hover:shadow-glow"
          >
            Schedule a Consultation
          </Link>
          <Link
            to="/case-studies"
            className="rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:bg-white/5"
          >
            Explore Case Studies
          </Link>
        </div>
      </div>
    </section>
  );
}
