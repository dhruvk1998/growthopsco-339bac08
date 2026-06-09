import { Link } from "@tanstack/react-router";

type ServiceDetail = {
  title: string;
  whatYouGet: string[];
  bestFor?: string[];
  outcomes?: string[];
};

const services: ServiceDetail[] = [
  {
    title: "CRM Implementation",
    whatYouGet: [
      "CRM platform selection guidance",
      "Pipeline architecture",
      "Custom field configuration",
      "Dashboard and reporting setup",
      "User onboarding and adoption support",
    ],
    bestFor: [
      "Teams currently using spreadsheets",
      "Businesses implementing a CRM for the first time",
      "Organizations struggling with visibility",
    ],
  },
  {
    title: "Workflow Automation",
    whatYouGet: [
      "Lead routing automation",
      "Follow-up automation",
      "Task creation workflows",
      "Internal notifications",
      "Process optimization",
    ],
    outcomes: ["Faster response times", "Reduced manual work", "Improved accountability"],
  },
  {
    title: "Lead Process Design",
    whatYouGet: [
      "Lead lifecycle mapping",
      "Qualification framework design",
      "Sales handoff process",
      "Pipeline stage optimization",
      "Ownership definitions",
    ],
    outcomes: [
      "Fewer lost opportunities",
      "Consistent sales execution",
      "Better conversion visibility",
    ],
  },
  {
    title: "Integration Project",
    whatYouGet: [
      "Website-to-CRM integration",
      "Form integration",
      "Marketing platform integration",
      "Data synchronization",
      "Workflow connectivity",
    ],
    outcomes: [
      "Elimination of duplicate data entry",
      "Better system visibility",
      "Unified operations",
    ],
  },
  {
    title: "Chatbot & AI Integration",
    whatYouGet: [
      "AI chatbot implementation",
      "Lead capture workflows",
      "CRM synchronization",
      "Automated qualification",
      "AI-assisted routing",
    ],
    outcomes: ["Faster engagement", "Better lead qualification", "Increased efficiency"],
  },
  {
    title: "CRM Audit",
    whatYouGet: [
      "Current-state assessment",
      "Process review",
      "Pipeline analysis",
      "Automation review",
      "Reporting evaluation",
    ],
    outcomes: [
      "Identification of bottlenecks",
      "Improved visibility",
      "Actionable recommendations",
    ],
  },
];

function List({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{label}</p>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-3">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceDetails() {
  return (
    <section id="service-details" className="px-6 py-20">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
            Service Details
          </p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            What each engagement includes.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card/70 p-7 transition-all hover:border-accent/40"
            >
              <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <List label="What You'll Get" items={s.whatYouGet} />
                {s.bestFor && <List label="Best For" items={s.bestFor} />}
                {s.outcomes && <List label="Expected Outcomes" items={s.outcomes} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesDecisionCTA() {
  return (
    <section className="px-6 py-20">
      <div className="reveal mx-auto max-w-4xl rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-card/80 to-transparent p-10 text-center sm:p-12">
        <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Next Step</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Not sure which service you need?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Take the CRM Health Check and receive tailored recommendations based on your current
          systems, processes, and growth objectives.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/crm-assessment"
            className="inline-block rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
          >
            Take CRM Health Check →
          </Link>
          <Link
            to="/contact"
            className="inline-block rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
