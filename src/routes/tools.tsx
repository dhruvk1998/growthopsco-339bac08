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
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dhruv Kaushik" },
      { property: "og:url", content: "https://growthopsco.vercel.app/tools" },
      { property: "og:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Dhruv Kaushik — CRM, Automation & Revenue Operations" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.vercel.app/tools" }],
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
