import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-dashboard.jpg";

const trustItems = [
  "Freshworks CRM",
  "LeadSquared",
  "Workflow Automation",
  "API Integration",
  "Chatbot Integration",
  "Lead Lifecycle Design",
];

export function Hero() {
  return (
    <section className="relative px-6 pt-40 pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-accent"></span>
            </span>
            Available for Consulting
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight lg:text-7xl">
            CRM Implementation & <span className="text-accent">Workflow Automation</span> Specialist
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
            Helping businesses streamline lead management, automate workflows, optimize sales pipelines, and improve CRM operations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/case-studies"
              className="rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground transition-all hover:opacity-90"
            >
              View Case Studies
            </Link>
            <Link
              to="/contact"
              className="rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:bg-white/5"
            >
              Schedule a Consultation
            </Link>
          </div>
          <div className="mt-14">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Capabilities & Platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {trustItems.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-accent/15 blur-3xl"></div>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <img
              src={heroImage}
              alt="Sales pipeline dashboard built in Freshworks CRM showing lead stages and automation flows"
              width={1280}
              height={960}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur md:block">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Lead Response</div>
            <div className="text-2xl font-bold">‹ 60s</div>
            <div className="text-xs text-muted-foreground">Automated routing</div>
          </div>
          <div className="absolute -top-6 -right-6 hidden rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur md:block">
            <div className="text-[10px] font-bold uppercase tracking-widest text-accent">Lead Leakage</div>
            <div className="text-2xl font-bold">‒ 92%</div>
            <div className="text-xs text-muted-foreground">After implementation</div>
          </div>
        </div>
      </div>
    </section>
  );
}
