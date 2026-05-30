import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Workflow } from "@/components/site/Workflow";
import { Services } from "@/components/site/Services";
import { CaseStudies } from "@/components/site/CaseStudies";
import { Projects } from "@/components/site/Projects";
import { Experience } from "@/components/site/Experience";
import { HealthCheck } from "@/components/site/HealthCheck";
import { Skills } from "@/components/site/Skills";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { useReveal } from "@/hooks/use-reveal";

const title = "Dhruv Kaushik — CRM Implementation & Workflow Automation Specialist";
const description =
  "CRM consultant based in Canada specializing in Freshworks, LeadSquared, sales process design, workflow automation, API integration, and lead lifecycle optimization.";

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
  component: Index,
});

function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/30 selection:text-accent-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Workflow />
        <Services />
        <CaseStudies />
        <Projects />
        <Experience />
        <HealthCheck />
        <Skills />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}
