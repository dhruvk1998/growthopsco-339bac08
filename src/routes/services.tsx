import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Services } from "@/components/site/Services";
import { ServicesDecisionCTA } from "@/components/site/ServiceDetails";

const title = "Services — CRM, Automation, Integration & Revenue Operations";
const description =
  "CRM setup, workflow automation, lead process design, website ↔ CRM integration, chatbot integration, and CRM audits for growing operations teams.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dhruv Kaushik" },
      { property: "og:url", content: "https://growthopsco.vercel.app/services" },
      { property: "og:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Dhruv Kaushik — CRM, Automation & Revenue Operations" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.vercel.app/services" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "CRM Implementation & Automation Consulting",
        "provider": {
          "@type": "Person",
          "name": "Dhruv Kaushik",
          "url": "https://growthopsco.vercel.app",
        },
        "description": "CRM setup, workflow automation, lead process design, website–CRM integration, chatbot integration, and CRM audits for growing operations teams.",
        "areaServed": "CA",
        "url": "https://growthopsco.vercel.app/services",
      }),
    }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Services"
        title="Consulting engagements built for operators."
        description="Pick a single engagement or combine them into an end-to-end transformation. Every service is designed around business outcomes, not feature checklists."
      />
      <Services />
      <ServicesDecisionCTA />
    </SiteLayout>
  );
}
