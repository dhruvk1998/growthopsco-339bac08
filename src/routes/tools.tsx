import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Skills } from "@/components/site/Skills";
import { Projects } from "@/components/site/Projects";
import { FinalCTA } from "@/components/site/FinalCTA";

const title = "Tools & Expertise — CRM Platforms, Automation, Integrations";
const description =
  "Platforms (Freshworks, LeadSquared), automation (workflow design, lead routing, lifecycle management), integrations (APIs, chatbots, data mapping), and operations expertise.";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Tools & Expertise"
        title="The toolkit behind every CRM engagement."
        description="Platforms, automation patterns, integrations, and operational disciplines I deploy to make CRM systems scalable and adoptable."
      />
      <Skills />
      <Projects />
      <FinalCTA />
    </SiteLayout>
  );
}
