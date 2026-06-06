import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Skills } from "@/components/site/Skills";
import { Projects } from "@/components/site/Projects";
import { FinalCTA } from "@/components/site/FinalCTA";

const title = "Technology & Delivery Stack — CRM Platforms, Automation, Integrations";
const description =
  "The CRM platforms, automation patterns, integration methods, process design approaches, and business analysis disciplines used across every engagement.";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://dhruvrevops.lovable.app/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Technology & Delivery Stack"
        title="The platforms, methods, and disciplines behind every engagement."
        description="Specialist depth in Freshworks and LeadSquared. Platform-neutral methodology covering automation design, integration architecture, process improvement, and business analysis."
      />
      <Skills />
      <Projects />
      <FinalCTA />
    </SiteLayout>
  );
}
