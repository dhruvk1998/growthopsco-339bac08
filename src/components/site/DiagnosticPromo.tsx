import { Link } from "@tanstack/react-router";
import { DIAGNOSTIC_FEE, REPORT_DELIVERY } from "@/lib/diagnostic";

const benefits = [
  "Identify potential revenue and lead-management gaps.",
  "Discover practical automation opportunities.",
  "Improve reporting and operational visibility.",
  "Prioritize the next steps for your business.",
];

export const diagnosticDeliverables = [
  { title: "1:1 Discovery Call", desc: "Understand the business, existing CRM setup, and primary challenges." },
  { title: "Detailed Review", desc: "Examine the agreed CRM configuration, processes, available data, and automation opportunities." },
  { title: "Personalized Report", desc: "Document findings and prioritized recommendations based on available evidence." },
  { title: "Next Steps", desc: "Discuss appropriate implementation options and practical recommendations." },
];

export const diagnosticDetails = [
  { label: "Consultation", value: "60–90 minutes" },
  { label: "Deliverable", value: "Written report with personalized findings and recommendations" },
  { label: "Report Delivery", value: REPORT_DELIVERY },
  { label: "Fee", value: DIAGNOSTIC_FEE },
  { label: "Service Type", value: "One-time diagnostic" },
];

export function DiagnosticPromo() {
  return (
    <section id="crm-revenue-diagnostic" className="px-6 py-24">
      <div className="reveal mx-auto max-w-5xl rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/10 via-card/80 to-transparent p-8 sm:p-12">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">CRM Revenue Diagnostic</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight lg:text-5xl">Turn Your CRM Into a Growth Engine</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Get a personalized review of your CRM, lead management, automation, integrations, reporting, and revenue
            processes. Identify what's working, what's holding you back, and which improvements to prioritize.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {benefits.map((b) => (
            <li key={b} className="flex gap-3 rounded-xl border border-border bg-background/50 p-4 text-sm">
              <span className="text-accent" aria-hidden>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 text-xs font-bold uppercase tracking-widest text-accent">What You'll Receive</h3>
        <ol className="mt-4 grid gap-4 md:grid-cols-2">
          {diagnosticDeliverables.map((d, i) => (
            <li key={d.title} className="rounded-2xl border border-border bg-card/60 p-5">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <p className="mt-1 font-bold">{d.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
            </li>
          ))}
        </ol>

        <dl className="mt-10 grid gap-3 rounded-2xl border border-border bg-background/60 p-6 sm:grid-cols-2">
          {diagnosticDetails.map((d) => (
            <div key={d.label}>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{d.label}</dt>
              <dd className="mt-1 text-sm font-medium">{d.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 text-center">
          <Link
            to="/crm-revenue-diagnostic"
            className="inline-block rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
          >
            Book Your Diagnostic
          </Link>
        </div>
      </div>
    </section>
  );
}
