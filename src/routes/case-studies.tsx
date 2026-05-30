import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { CaseStudies } from "@/components/site/CaseStudies";
import { FinalCTA } from "@/components/site/FinalCTA";

const title = "Case Studies — Freshworks Implementation & Chatbot Integration";
const description =
  "Full case studies covering company-wide Freshworks CRM implementation and a Chatbot ↔ CRM integration sprint, with challenges, approach, my role and operational outcomes.";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Case Studies"
        title="Real CRM engagements. Real operational outcomes."
        description="Each case study breaks down the business challenge, the workflow I designed, and the measurable impact on lead management and sales operations."
      />
      <CaseStudies />
      <FinalCTA
        title="Have a similar challenge?"
        subtitle="If your CRM isn't matching how you actually sell, let's scope the right engagement."
      />
    </SiteLayout>
  );
}
