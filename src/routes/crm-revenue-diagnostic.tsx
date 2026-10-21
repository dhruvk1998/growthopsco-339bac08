import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { DiagnosticForm } from "@/components/site/DiagnosticForm";
import { diagnosticDeliverables, diagnosticDetails } from "@/components/site/DiagnosticPromo";
import { DIAGNOSTIC_FEE, REPORT_DELIVERY } from "@/lib/diagnostic";

const title = "CRM Revenue Diagnostic | GrowthOpsCo";
const description = `A one-time ${DIAGNOSTIC_FEE} review of your CRM, lead management, automation, integrations and reporting — with a personalized written report.`;

export const Route = createFileRoute("/crm-revenue-diagnostic")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiagnosticPage,
});

const steps = [
  { t: "Submit Your Request", d: "Share your business, CRM setup, and main challenges using the form below." },
  { t: "Review and Confirm Next Steps", d: `I review your request, contact you to agree on scope and a time, and arrange the ${DIAGNOSTIC_FEE} payment separately.` },
  { t: "Attend the Consultation", d: "A 60–90 minute 1:1 session to walk through your CRM, processes, and data." },
  { t: "Receive Your Personalized Report", d: REPORT_DELIVERY },
];

const audience = [
  "Founders and business owners who suspect leads are slipping through the cracks.",
  "Sales and operations leaders who don't trust their CRM reporting.",
  "Teams doing repetitive manual work that should be automated.",
  "Businesses evaluating a CRM change or a new implementation.",
];

const faqs = [
  { q: "How much does it cost?", a: `The CRM Revenue Diagnostic is a one-time fee of ${DIAGNOSTIC_FEE}. There is no obligation to purchase any additional services.` },
  { q: "How do I pay?", a: "There is no online checkout. After reviewing your request, I'll contact you to confirm the scope and arrange payment separately before the appointment is confirmed." },
  { q: "Is my appointment confirmed when I submit the form?", a: "No. Submitting the form is a request. Your appointment is confirmed only after we agree on a time and payment arrangements are complete." },
  { q: "When will I receive my report?", a: REPORT_DELIVERY },
  { q: "Which CRMs do you review?", a: "HubSpot, Salesforce, Zoho, Pipedrive, Freshworks, LeadSquared, Dynamics and others — or your current process if you're not using a CRM yet." },
  { q: "Do I need to share system access?", a: "Only what we agree is necessary for the review. Never send passwords through the form." },
];

function DiagnosticPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="CRM REVENUE DIAGNOSTIC"
        title="Turn Your CRM Into a Growth Engine"
        description="A personalized, one-time review of your CRM, lead management, automation, integrations, reporting, and revenue processes — with a written report of prioritized recommendations."
      />

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {diagnosticDeliverables.map((d, i) => (
            <div key={d.title} className="rounded-2xl border border-border bg-card/70 p-6">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-bold">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
        <dl className="mx-auto mt-6 grid max-w-7xl gap-4 rounded-2xl border border-accent/25 bg-accent/5 p-6 sm:grid-cols-2 lg:grid-cols-5">
          {diagnosticDetails.map((d) => (
            <div key={d.label}>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-accent">{d.label}</dt>
              <dd className="mt-1 text-sm font-medium">{d.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">How It Works</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.t} className="rounded-2xl border border-border bg-card/60 p-6">
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent">Step {i + 1}</span>
                <h3 className="mt-2 font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Who This Is For</p>
            <ul className="mt-6 space-y-3">
              {audience.map((a) => (
                <li key={a} className="flex gap-3 rounded-xl border border-border bg-background/50 p-4 text-sm">
                  <span className="text-accent" aria-hidden>✓</span>{a}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Payment & Appointment Confirmation</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              There's no online checkout or automatic booking. After you submit a request, I'll personally review it and
              contact you to agree on scope and availability. I'll then confirm the {DIAGNOSTIC_FEE} fee and arrange
              payment separately. Your appointment is confirmed only once those arrangements are complete. The diagnostic
              is a standalone service — you're never required to purchase anything further.
            </p>
          </div>
        </div>
      </section>

      <section id="diagnostic-form" className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Request Your Diagnostic</p>
          <h2 className="mt-2 mb-6 text-3xl font-bold tracking-tight">Tell me about your CRM.</h2>
          <DiagnosticForm />
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">FAQs</p>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-border bg-card/60 p-5">
                <summary className="cursor-pointer font-bold">{f.q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
