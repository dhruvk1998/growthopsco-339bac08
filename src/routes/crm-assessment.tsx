import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HealthCheck } from "@/components/site/HealthCheck";
import { FinalCTA } from "@/components/site/FinalCTA";

const title = "CRM Health Check — Free 8-Question Assessment | Dhruv Kaushik";
const description =
  "Take the free CRM Health Check. Eight quick questions across lead management, automation, integration, and reporting reveal where your CRM is losing leads — and what to fix first.";

export const Route = createFileRoute("/crm-assessment")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://dhruvrevops.lovable.app/crm-assessment" }],
  }),
  component: CRMAssessmentPage,
});

function CRMAssessmentPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="CRM Health Check"
        title="Find out where your CRM is losing leads."
        subtitle="Eight quick questions across lead management, automation, integration, and reporting. Get a CRM Health Score, identified problem areas, and recommended next steps — in under two minutes."
      />
      <HealthCheck />
      <FinalCTA
        eyebrow="Next Step"
        title="Want a deeper review of your results?"
        subtitle="Book a free 30-minute strategy call. We'll walk through your score, the problem areas, and the right path forward."
      />
    </SiteLayout>
  );
}
