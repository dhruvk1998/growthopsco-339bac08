import { useState } from "react";

type ServiceSection = {
  label: string;
  items: string[];
};

type Service = {
  title: string;
  summary: string;
  sections: ServiceSection[];
};

const services: Service[] = [
  {
    title: "CRM Implementation",
    summary: "Build a sales process your team actually follows.",
    sections: [
      {
        label: "What You'll Get",
        items: [
          "CRM platform selection guidance",
          "Pipeline architecture",
          "Custom field configuration",
          "Dashboard and reporting setup",
          "User onboarding and adoption support",
        ],
      },
      {
        label: "Best For",
        items: [
          "Teams currently using spreadsheets",
          "Businesses implementing a CRM for the first time",
          "Organizations struggling with visibility",
        ],
      },
    ],
  },
  {
    title: "Workflow Automation",
    summary: "Reduce manual work and improve response times.",
    sections: [
      {
        label: "What You'll Get",
        items: [
          "Lead routing automation",
          "Follow-up automation",
          "Task creation workflows",
          "Internal notifications",
          "Process optimization",
        ],
      },
      {
        label: "Expected Outcomes",
        items: [
          "Faster response times",
          "Reduced manual work",
          "Improved accountability",
        ],
      },
    ],
  },
  {
    title: "Lead Process Design",
    summary: "Make sure no inquiry falls through the cracks.",
    sections: [
      {
        label: "What You'll Get",
        items: [
          "Lead lifecycle mapping",
          "Qualification framework design",
          "Sales handoff process",
          "Pipeline stage optimization",
          "Ownership definitions",
        ],
      },
      {
        label: "Expected Outcomes",
        items: [
          "Fewer lost opportunities",
          "Consistent sales execution",
          "Better conversion visibility",
        ],
      },
    ],
  },
  {
    title: "Integration Project",
    summary: "Connect your website and tools to your CRM.",
    sections: [
      {
        label: "What You'll Get",
        items: [
          "Website-to-CRM integration",
          "Form integration",
          "Marketing platform integration",
          "Data synchronization",
          "Workflow connectivity",
        ],
      },
      {
        label: "Expected Outcomes",
        items: [
          "Elimination of duplicate data entry",
          "Better system visibility",
          "Unified operations",
        ],
      },
    ],
  },
  {
    title: "Chatbot & AI Integration",
    summary: "Turn chatbot conversations into real opportunities.",
    sections: [
      {
        label: "What You'll Get",
        items: [
          "AI chatbot implementation",
          "Lead capture workflows",
          "CRM synchronization",
          "Automated qualification",
          "AI-assisted routing",
        ],
      },
      {
        label: "Expected Outcomes",
        items: [
          "Faster engagement",
          "Better lead qualification",
          "Increased efficiency",
        ],
      },
    ],
  },
  {
    title: "CRM Audit",
    summary: "Identify where leads, visibility, and accountability are breaking down.",
    sections: [
      {
        label: "What You'll Get",
        items: [
          "Current-state assessment",
          "Process review",
          "Pipeline analysis",
          "Automation review",
          "Reporting evaluation",
        ],
      },
      {
        label: "Expected Outcomes",
        items: [
          "Identification of bottlenecks",
          "Improved visibility",
          "Actionable recommendations",
        ],
      },
    ],
  },
];

export function Services() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="services" className="px-6 py-16">
      <div className="reveal mx-auto max-w-[88rem]">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Services</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Six engagements, one operating model.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            A quick look at each engagement. Click a card to see detailed scope, deliverables, and outcomes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div
                key={s.title}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                  isOpen
                    ? "border-accent/40 bg-card/70"
                    : "border-border bg-card/70 hover:-translate-y-0.5 hover:border-accent/40"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
                  </div>
                  <span
                    className={`mt-1 shrink-0 text-sm text-accent transition-transform duration-300 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? "▼" : "▶"}
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 space-y-5 border-t border-border pt-5">
                    {s.sections.map((section) => (
                      <div key={section.label}>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
                          {section.label}
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          {section.items.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
