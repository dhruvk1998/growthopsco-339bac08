import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { HomeServicesPreview } from "@/components/site/HomeServicesPreview";
import { FeaturedCaseStudies } from "@/components/site/FeaturedCaseStudies";
import { Workflow } from "@/components/site/Workflow";
import { Testimonials } from "@/components/site/Testimonials";
import { FinalCTA } from "@/components/site/FinalCTA";

const title = "Dhruv Kaushik — CRM Implementation & Workflow Automation Specialist";
const description =
  "Helping businesses streamline lead management, automate workflows, optimize sales pipelines, and improve CRM operations. Freshworks & LeadSquared specialist based in Canada.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dhruv Kaushik",
          jobTitle: "CRM Implementation & Workflow Automation Specialist",
          address: { "@type": "PostalAddress", addressCountry: "CA" },
          knowsAbout: [
            "Freshworks CRM",
            "LeadSquared",
            "Workflow Automation",
            "Lead Lifecycle Management",
            "Sales Process Design",
            "API Integration",
            "Chatbot Integration",
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <FeaturedCaseStudies />
      <HomeServicesPreview />
      <Workflow />
      <Testimonials />
      <FinalCTA />
    </SiteLayout>
  );
}
