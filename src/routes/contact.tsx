import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHeader } from "@/components/site/PageHeader";
import { Contact } from "@/components/site/Contact";

const title = "Contact — Let's Improve Your CRM Process";
const description =
  "Get in touch about CRM implementation, workflow automation, lead process design, or a CRM audit. Based in Burnaby, BC — working with clients across Canada.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Dhruv Kaushik" },
      { property: "og:url", content: "https://growthopsco.vercel.app/contact" },
      { property: "og:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Dhruv Kaushik — CRM, Automation & Revenue Operations" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://growthopsco.vercel.app/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://growthopsco.vercel.app/contact" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Dhruv Kaushik",
        "url": "https://growthopsco.vercel.app/contact",
        "mainEntity": {
          "@type": "Person",
          "name": "Dhruv Kaushik",
          "email": "dhruv.kaushik866@gmail.com",
          "telephone": "+17786799471",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Burnaby",
            "addressRegion": "BC",
            "addressCountry": "CA",
          },
        },
      }),
    }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Let's improve your CRM process."
        description="Tell me a little about your current CRM setup. I'll respond within one business day with next steps and a free initial assessment."
      />
      <Contact />
    </SiteLayout>
  );
}
