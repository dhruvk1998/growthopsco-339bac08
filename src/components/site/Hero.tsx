export function Hero() {
  const scrollToCases = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("featured-case-studies")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative px-6 pt-40 pb-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-accent"></span>
          </span>
          Available for Consulting
        </div>
        <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight lg:text-7xl">
          CRM, Automation & <span className="text-accent">Revenue Operations</span> Consultant
        </h1>
        <p className="mx-auto mb-5 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
          Helping growing businesses eliminate manual processes, improve lead management, automate workflows, integrate systems, and optimize revenue operations through practical CRM and automation solutions.
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">
          Supporting CRM implementation, workflow automation, chatbot integration, and revenue operations improvement initiatives across sales and marketing operations.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="#featured-case-studies"
            onClick={scrollToCases}
            className="rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground transition-all hover:opacity-90"
          >
            Explore Case Studies
          </a>
          <a
            href="/contact"
            className="rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:bg-white/5"
          >
            Schedule a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}
