import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { CredibilityMetrics } from "@/components/site/CredibilityMetrics";
import { HomeServicesPreview } from "@/components/site/HomeServicesPreview";
import { FeaturedCaseStudies } from "@/components/site/FeaturedCaseStudies";
import { WhyWorkWithMe } from "@/components/site/WhyWorkWithMe";
import { Workflow } from "@/components/site/Workflow";
import { FinalCTA } from "@/components/site/FinalCTA";

const title = "Dhruv Kaushik — CRM, Automation & Revenue Operations Consultant";
const description =
  "Helping growing businesses streamline lead management, automate workflows, integrate systems, and optimize revenue operations through practical CRM and automation solutions.";

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
          jobTitle: "CRM, Automation & Revenue Operations Consultant",
          address: { "@type": "PostalAddress", addressCountry: "CA" },
          knowsAbout: [
            "CRM Implementation",
            "Workflow Automation",
            "Revenue Operations",
            "Lead Lifecycle Management",
            "Website Integration",
            "Chatbot Integration",
            "AI Automation",
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
      <CredibilityMetrics />
      <FeaturedCaseStudies />
      <HomeServicesPreview />
      <WhyWorkWithMe />
      <Workflow />
      <FinalCTA />
    </SiteLayout>
  );
}
