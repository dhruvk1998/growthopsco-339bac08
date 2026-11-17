import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { ProblemSection } from "@/components/site/ProblemSection";
import { WhatIsCRM } from "@/components/site/WhatIsCRM";
import { HomeServicesPreview } from "@/components/site/HomeServicesPreview";
import { BeyondCRM } from "@/components/site/BeyondCRM";
import { FeaturedCaseStudies } from "@/components/site/FeaturedCaseStudies";
import { TestimonialsPreview } from "@/components/site/TestimonialsPreview";
import { HealthCheckTeaser } from "@/components/site/HealthCheckTeaser";
import { FinalCTA } from "@/components/site/FinalCTA";


const title = "Dhruv Kaushik — CRM, Automation & Business Systems Consultant";
const description =
  "I help growing businesses stop losing leads, organize their sales process, automate manual work, and get clear visibility into their pipeline — through the right mix of CRM, automation, integrations, and business systems.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://growthopsco.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Dhruv Kaushik — CRM, Automation & Revenue Operations" },
      { name: "twitter:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dhruv Kaushik",
          jobTitle: "CRM, Automation & Business Systems Consultant",
          url: "https://growthopsco.lovable.app",
          sameAs: ["https://www.linkedin.com/in/dhruv-kaushik-95231a175/"],
          address: { "@type": "PostalAddress", addressLocality: "Burnaby", addressRegion: "BC", addressCountry: "CA" },
          knowsAbout: [
            "CRM Strategy",
            "CRM Implementation",
            "Workflow Automation",
            "API Integrations",
            "AI Assistants & Chatbots",
            "Python Automation",
            "Reporting & Business Intelligence",
            "Revenue Operations",
            "Business Process Optimization",
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
      <ProblemSection />
      <WhatIsCRM />
      <HomeServicesPreview />
      <FeaturedCaseStudies />
      <TestimonialsPreview />
      <BeyondCRM />
      <HealthCheckTeaser />
      <FinalCTA />

    </SiteLayout>
  );
}
