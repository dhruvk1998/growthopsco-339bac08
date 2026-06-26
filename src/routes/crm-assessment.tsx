import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HealthCheck } from "@/components/site/HealthCheck";


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
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dhruv Kaushik" },
      { property: "og:url", content: "https://growthopsco.vercel.app/crm-assessment" },
      { property: "og:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Dhruv Kaushik — CRM, Automation & Revenue Operations" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.vercel.app/crm-assessment" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "CRM Health Check",
        "url": "https://growthopsco.vercel.app/crm-assessment",
        "description": "Free 8-question CRM assessment tool. Get a CRM Health Score and identify gaps in lead management, automation, integration, and reporting.",
        "applicationCategory": "BusinessApplication",
        "isAccessibleForFree": true,
        "author": {
          "@type": "Person",
          "name": "Dhruv Kaushik",
        },
      }),
    }],
  }),
  component: CRMAssessmentPage,
});

function CRMAssessmentPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="CRM Health Check"
        title="Find out where your CRM is losing leads."
        description="Eight quick questions across lead management, automation, integration, and reporting. Get a CRM Health Score, identified problem areas, and recommended next steps — in under two minutes."
      />
      <HealthCheck />
    </SiteLayout>
  );
}
