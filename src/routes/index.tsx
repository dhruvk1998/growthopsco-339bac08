import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { WhoIHelp } from "@/components/site/WhoIHelp";
import { About } from "@/components/site/About";
import { Workflow } from "@/components/site/Workflow";
import { HomeServicesPreview } from "@/components/site/HomeServicesPreview";
import { FeaturedCaseStudies } from "@/components/site/FeaturedCaseStudies";
import { HealthCheck } from "@/components/site/HealthCheck";
import { Contact } from "@/components/site/Contact";


const title = "Dhruv Kaushik — Independent CRM & Revenue Operations Consultant";
const description =
  "Independent CRM and RevOps consultant helping growing teams fix lead leakage, automate manual work, and build a pipeline leadership can trust. Freshworks and LeadSquared specialist.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://dhruvrevops.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dhruv Kaushik",
          jobTitle: "CRM, Automation & Revenue Operations Consultant",
          url: "https://dhruvrevops.lovable.app",
          sameAs: ["https://www.linkedin.com/in/dhruv-kaushik-95231a175/"],
          address: { "@type": "PostalAddress", addressLocality: "Burnaby", addressRegion: "BC", addressCountry: "CA" },
          knowsAbout: [
            "CRM Implementation",
            "Workflow Automation",
            "Revenue Operations",
            "Lead Lifecycle Management",
            "Website Integration",
            "Business Process Optimization",
            "Freshworks",
            "LeadSquared",
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
      <WhoIHelp />
      <HomeServicesPreview />
      <Workflow />
      <FeaturedCaseStudies />
      <HealthCheck />
      <FinalCTA />
    </SiteLayout>
  );
}
