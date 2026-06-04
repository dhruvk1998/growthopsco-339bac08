import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: 12, suffix: "+", label: "CRM Implementations" },
  { value: 40, suffix: "+", label: "Workflow Automations" },
  { value: 25, suffix: "+", label: "Website Integrations" },
  { value: 8, suffix: "+", label: "AI Chatbot Deployments" },
];

const cases = [
  {
    industry: "SaaS / B2B",
    title: "Company-Wide Freshworks CRM Implementation",
    problem:
      "Leads scattered across channels with no unified owner, no SLA, and zero leadership visibility.",
    solution:
      "Deployed Freshworks CRM end-to-end, mapped lifecycle stages to real sales motions, and shipped routing automation the team adopted.",
    result: "100% lead capture accuracy",
  },
  {
    industry: "Marketing Ops",
    title: "Chatbot ↔ CRM Integration Sprint",
    problem:
      "Website inquiries were captured manually, slow to route, and frequently lost before follow-up.",
    solution:
      "Designed an API integration mapping chatbot fields to CRM records with validation, routing, and instant assignment.",
    result: "92% faster lead response time",
  },
  {
    industry: "Revenue Ops",
    title: "Sales Pipeline & Workflow Automation",
    problem:
      "Reps spent hours on manual data entry, stage updates, and reporting instead of selling.",
    solution:
      "Built automation flows for stage transitions, task creation, follow-up reminders, and pipeline hygiene checks.",
    result: "18 hours/week saved through automation",
  },
  {
    industry: "AI Automation",
    title: "AI-Powered Lead Qualification System",
    problem:
      "High lead volume with low MQL-to-SQL conversion — sales wasted time on poor-fit prospects.",
    solution:
      "Integrated an AI scoring layer with CRM workflows to auto-qualify, prioritize, and route only sales-ready leads.",
    result: "35% increase in qualified opportunities",
  },
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1400;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(end * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export function FeaturedCaseStudies() {
  return (
    <section id="featured-case-studies" className="relative px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            Featured Case Studies
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Featured Case Studies
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Real CRM, Revenue Operations, Marketing Automation, Website Integration, and AI Automation projects that delivered measurable business outcomes.
          </p>
        </div>

        {/* Animated metrics bar */}
        <div className="mb-14 overflow-hidden rounded-2xl border border-border/80 bg-card/40 backdrop-blur-sm">
          <div className="grid grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
            {metrics.map((m) => (
              <div key={m.label} className="px-6 py-7 text-center">
                <div className="text-3xl font-bold text-accent lg:text-4xl">
                  <CountUp end={m.value} suffix={m.suffix} />
                </div>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Case study cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((c) => (
            <Link
              key={c.title}
              to="/case-studies"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-card/80 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                  {c.industry}
                </span>
                <h3 className="mt-5 text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-accent">
                  {c.title}
                </h3>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Problem
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {c.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Solution
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {c.solution}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                    Key Result
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">{c.result}</p>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Read Full Case Study
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
