import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { HomeServicesPreview } from "@/components/site/HomeServicesPreview";
import { ServiceDetails, ServicesDecisionCTA } from "@/components/site/ServiceDetails";

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
    links: [{ rel: "canonical", href: "/services" }],
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
      <HomeServicesPreview
        showCTA={false}
        heading="Six engagements, one operating model."
        description="A quick look at each engagement. Detailed scope, deliverables, and outcomes are below."
      />
      <ServiceDetails />
      <ServicesDecisionCTA />
    </SiteLayout>
  );
}
