const role = [
  "Implemented Freshworks CRM from scratch company-wide",
  "Collaborated with stakeholders across departments",
  "Designed lead lifecycle stages tied to business goals",
  "Configured workflows, routing and automation systems",
  "Coordinated API integrations with website developers",
  "Integrated chatbot directly with the CRM",
  "Optimized operational workflows for sales velocity",
];

const outcomes = [
  { value: "1", label: "Centralized lead visibility across teams" },
  { value: "100%", label: "Standardized lead intake process" },
  { value: "↑", label: "Improved workflow efficiency" },
  { value: "∞", label: "Scalable CRM foundation" },
];

const chatbotRole = [
  "Defined chatbot lead capture requirements",
  "Collaborated with website developers throughout implementation",
  "Coordinated API integration requirements end-to-end",
  "Mapped chatbot fields to CRM fields with validation rules",
  "Designed lead intake workflows and routing logic",
  "Validated lead creation logic across edge cases",
  "Tested data transfer and routing processes",
  "Ensured alignment with business and stakeholder requirements",
];

const chatbotOutcomes = [
  { value: "⚡", label: "Faster lead capture — inquiries auto-enter CRM workflow" },
  { value: "0", label: "Manual lead entry tasks eliminated" },
  { value: "👁", label: "Improved lead visibility across the funnel" },
  { value: "∞", label: "Scalable integration foundation for future automation" },
];

const capabilities = [
  "CRM Integration",
  "API Coordination",
  "Workflow Design",
  "Lead Management",
  "Chatbot Integration",
  "Data Mapping",
  "Process Optimization",
  "Stakeholder Collaboration",
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="px-6 py-24">
      <div className="reveal mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">Featured Work</p>
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Company-Wide Freshworks CRM Implementation
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card/70">
          <div className="grid lg:grid-cols-[1.3fr_1fr]">
            <div className="p-8 lg:p-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">The Challenge</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    A disorganized lead management process with no unified CRM. Leads were arriving from multiple channels with no consistent owner, no follow-up SLA, and no visibility for leadership.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">The Approach</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Deployed Freshworks CRM end-to-end, mapped lead lifecycle stages to real sales motions, and shipped automation + integrations that the team actually adopted.
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent">My Role</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {role.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
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
              <p className="mt-8 text-sm italic leading-relaxed text-muted-foreground">
                The CRM is now the operating system for sales — every lead tracked, every stage measured, every workflow accountable.
              </p>
            </div>
          </div>
        </div>

        {/* Chatbot ↔ CRM Integration Sprint */}
        <div className="mt-10 max-w-2xl">
          <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
            Chatbot ↔ CRM Integration Sprint
          </h2>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card/70">
          <div className="grid lg:grid-cols-[1.3fr_1fr]">
            <div className="p-8 lg:p-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">The Challenge</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Website inquiries and customer interactions needed to be captured efficiently and routed into the CRM without manual intervention. The goal: a seamless flow between the website chatbot and the CRM with accurate lead capture, data consistency, and operational visibility.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">The Solution</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Implemented a chatbot-to-CRM integration workflow that automatically transferred captured lead information into the CRM environment — focused on automated capture, structured data mapping, API-based lead creation, consistent routing, and reduced manual admin work.
                  </p>
                </div>
              </div>

              {/* Integration flow visual */}
              <div className="mt-8 rounded-2xl border border-border bg-background/40 p-5">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-accent">Integration Flow</p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                  {["Chatbot", "API Layer", "Field Mapping", "Lead Routing", "CRM Record"].map((step, i, arr) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="rounded-lg border border-border bg-card px-3 py-2 text-foreground">
                        {step}
                      </div>
                      {i < arr.length - 1 && <span className="text-accent">→</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent">My Role</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {chatbotRole.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Capabilities Demonstrated</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {capabilities.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border bg-gradient-to-br from-accent/10 to-transparent p-8 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Operational Impact</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {chatbotOutcomes.map((o) => (
                  <div key={o.label} className="rounded-xl border border-border bg-background/40 p-5">
                    <div className="text-3xl font-bold text-accent">{o.value}</div>
                    <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{o.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-sm italic leading-relaxed text-muted-foreground">
                "By connecting chatbot interactions directly with CRM workflows, customer inquiries became part of a structured, trackable lead management process — improving operational efficiency and supporting faster follow-up."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
