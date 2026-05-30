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
    ],
    links: [{ rel: "canonical", href: "/contact" }],
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
