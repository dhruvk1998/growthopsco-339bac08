import { Link } from "@tanstack/react-router";

const outcomes = [
  { value: "<1 min", label: "First response time (from ~20 min)" },
  { value: "5", label: "Departments onboarded" },
  { value: "100%", label: "Standardized intake" },
  { value: "↑", label: "Pipeline visibility" },
];

export function FeaturedCaseStudy() {
  return (
    <section className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Featured Case Study</p>
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Company-Wide Freshworks CRM Implementation
            </h2>
          </div>
          <Link
            to="/case-studies"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            All case studies →
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card/70">
          <div className="grid lg:grid-cols-[1.3fr_1fr]">
            <div className="p-8 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">The Challenge</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                A disorganized lead management process with no unified CRM. Leads arriving from multiple channels with no consistent owner, no follow-up SLA, and no visibility for leadership.
              </p>
              <p className="mt-8 text-[11px] font-bold uppercase tracking-widest text-accent">The Approach</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Deployed Freshworks CRM end-to-end, mapped lead lifecycle stages to real sales motions, and shipped automation + integrations that the team actually adopted.
              </p>
              <Link
                to="/case-studies"
                className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:opacity-90"
              >
                Read the full case study →
              </Link>
            </div>
            <div className="border-t border-border bg-gradient-to-br from-accent/10 to-transparent p-8 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Outcome</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {outcomes.map((o) => (
                  <div key={o.label} className="rounded-xl border border-border bg-background/40 p-5">
                    <div className="text-3xl font-bold text-accent">{o.value}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{o.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
