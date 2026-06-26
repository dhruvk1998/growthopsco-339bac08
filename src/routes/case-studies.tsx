import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { CaseStudyDirectory } from "@/components/site/CaseStudyDirectory";
import { FinalCTA } from "@/components/site/FinalCTA";

const title = "Case Studies — CRM, Automation & Revenue Operations Engagements";
const description =
  "Anonymized case studies across CRM implementation, workflow automation, revenue operations, website integration, chatbot integration, and AI automation engagements.";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dhruv Kaushik" },
      { property: "og:url", content: "https://growthopsco.vercel.app/case-studies" },
      { property: "og:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Dhruv Kaushik — CRM, Automation & Revenue Operations" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.vercel.app/case-studies" }],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Case Studies"
        title="Real engagements. Real operational outcomes."
        description="Browse anonymized consulting engagements across CRM, automation, integration, and revenue operations. Filter by category or jump directly to a project."
      />
      <CaseStudyDirectory />
      <FinalCTA
        title="Have a similar challenge?"
        subtitle="If your CRM, automation, or revenue operations need a structured assessment, let's scope the right engagement."
      />
    </SiteLayout>
  );
}
