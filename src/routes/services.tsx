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
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.vercel.app/services" }],
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
