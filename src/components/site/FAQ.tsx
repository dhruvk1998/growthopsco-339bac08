import { useState } from "react";

const faqs = [
  {
    q: "Do you only work with Freshworks and LeadSquared?",
    a: "Those are the platforms I've implemented most deeply, but engagements are platform-neutral. The framework — discovery, lifecycle design, automation, integration, adoption — applies regardless of CRM. I'll be candid if a different platform is the better fit for your situation.",
  },
  {
    q: "Can you help if we currently use spreadsheets?",
    a: "Yes. A common starting point is selecting and rolling out a first CRM, migrating data, and designing the lead process from scratch — often more effective than retrofitting a CRM around legacy spreadsheet habits.",
  },
  {
    q: "Do you provide CRM training and adoption support?",
    a: "Yes. Role-specific enablement, playbooks, and adoption tracking are part of every implementation. Adoption is treated as the deliverable, not an afterthought.",
  },
  {
    q: "Do you offer ongoing support after implementation?",
    a: "Yes. Many engagements continue as a monthly optimization retainer — covering audits, new automations, reporting changes, and process improvements as the business evolves.",
  },
  {
    q: "Can you optimize an existing CRM instead of replacing it?",
    a: "Often the right call. A structured CRM audit identifies data, process, automation, and adoption gaps — then sequences a 30/60/90 roadmap of fixes by impact and effort.",
  },
  {
    q: "How long do implementations typically take?",
    a: "A focused CRM rollout typically runs 6–12 weeks depending on scope, integrations, and stakeholder availability. Audits and targeted automation engagements are shorter — usually 2–4 weeks.",
  },
  {
    q: "Can you work with our current CRM if it isn't Freshworks or LeadSquared?",
    a: "Yes. The methodology transfers across most modern CRMs. I'll be upfront about any platform-specific limits during the discovery conversation.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-6 py-24">
      <div className="reveal mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">FAQ</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Frequently asked questions.
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`rounded-2xl border bg-card/60 transition-all ${
                  isOpen ? "border-accent/40" : "border-border hover:border-accent/30"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-bold text-foreground">{f.q}</span>
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg viewBox="0 0 20 20" className="size-3.5" fill="currentColor">
                      <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 px-6 pb-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
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
