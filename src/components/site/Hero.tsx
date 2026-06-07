import { Link } from "@tanstack/react-router";

export function Hero() {
  const scrollToProblems = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("does-this-sound-familiar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="relative px-6 pt-32 pb-12">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-accent"></span>
          </span>
          CRM, Automation & Business Systems Consultant
        </div>
        <h1 className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
          Stop losing leads. <span className="text-accent">Run a sales process you can actually see.</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
          I help growing businesses organize sales, automate the manual work, and get clear pipeline visibility — so leadership can scale with confidence, not chaos.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            hash="consultation-form"
            className="rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground transition-all hover:opacity-90"
          >
            Book a Free Consultation
          </Link>
          <a
            href="#does-this-sound-familiar"
            onClick={scrollToProblems}
            className="rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:bg-white/5"
          >
            See if this sounds familiar
          </a>
        </div>
      </div>
    </section>
  );
}
