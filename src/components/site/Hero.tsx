export function Hero() {
  const scrollToCases = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("featured-case-studies")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative px-6 pt-32 pb-12">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-accent"></span>
          </span>
          Independent Consultant · Available
        </div>
        <h1 className="mb-5 text-4xl font-bold leading-[1.05] tracking-tight lg:text-6xl">
          CRM & Revenue Ops that <span className="text-accent">actually closes the loop</span>.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
          I'm Dhruv Kaushik — an independent CRM and RevOps consultant. I help growing teams fix lead leakage, automate the manual work, and give leadership a pipeline they can trust. Specialist in Freshworks and LeadSquared.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/contact"
            className="rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground transition-all hover:opacity-90"
          >
            Book a CRM Strategy Call
          </a>
          <a
            href="#featured-case-studies"
            onClick={scrollToCases}
            className="rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:bg-white/5"
          >
            See Case Studies
          </a>
        </div>
      </div>
    </section>
  );
}
