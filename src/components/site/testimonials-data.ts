import corbettLogo from "@/assets/CORBETT-e1726479103131.png";
import ozoneLogo from "@/assets/oz6849ac6d-ozone-logo-amazon-in-ozone.png";

export type Testimonial = {
  name: string;
  title: string;
  company: string;
  logo: string;
  logoAlt: string;
  excerpt: string;
  full: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sunakshi Vashisht",
    title: "",
    company: "Corbett Vanvaas Resort",
    logo: corbettLogo,
    logoAlt: "Corbett Vanvaas Resort logo",
    excerpt:
      "We've had a great experience working with GrowthOps. Their team is proactive, professional, and genuinely invested in our success. They took the time to understand our business, provided valuable insights, and delivered exactly what was promised.",
    full: "We've had a great experience working with GrowthOps. Their team is proactive, professional, and genuinely invested in our success. They took the time to understand our business, provided valuable insights, and delivered exactly what was promised. Communication was always smooth, timelines were met, and the overall process was hassle-free. It's refreshing to work with a team that combines expertise with a personal touch. We highly recommend GrowthOps to anyone looking for a reliable growth partner.",
  },
  {
    name: "Vaibhav Gupta",
    title: "Customer Service Manager",
    company: "Ozone Group",
    logo: ozoneLogo,
    logoAlt: "Ozone Group logo",
    excerpt:
      "I had the opportunity to work closely with Dhruv during our CRM modernization initiative, where we transitioned from LeadSquared to Freshworks. He quickly understood our operational requirements and translated them into efficient workflows and automations that simplified our processes and improved team efficiency.",
    full: "I had the opportunity to work closely with Dhruv during our CRM modernization initiative, where we transitioned from LeadSquared to Freshworks. He quickly understood our operational requirements and translated them into efficient workflows and automations that simplified our processes and improved team efficiency.\n\nWhat stood out most was his ability to bridge business requirements with technical execution. He approached every challenge with a solution-oriented mindset, communicated clearly with stakeholders, and consistently delivered reliable results. His professionalism, attention to detail, and commitment to continuous improvement made the implementation process smooth and effective.\n\nDhruv combines strong CRM expertise with a practical understanding of business operations, making him an excellent partner for organizations looking to optimize their CRM, automate workflows, and build scalable customer processes. I would confidently recommend his consulting services to any growing business.",
  },
  {
    name: "Ekta Verma",
    title: "Digital Commerce Head",
    company: "Ozone Group",
    logo: ozoneLogo,
    logoAlt: "Ozone Group logo",
    excerpt:
      "Working with Dhruv was a seamless experience. He quickly understood our marketing and business requirements and translated them into practical solutions that improved our lead management process.",
    full: "Working with Dhruv was a seamless experience. He quickly understood our marketing and business requirements and translated them into practical solutions that improved our lead management process. From website form integrations to ensuring lead data flowed efficiently into our systems, he consistently delivered reliable and well-structured solutions.\n\nWhat sets Dhruv apart is his ability to bridge the gap between marketing and technology. He communicates clearly, takes ownership of his work, and focuses on building processes that are scalable and easy to manage. His proactive approach and attention to detail made him a valuable partner for our digital initiatives.\n\nI would confidently recommend Dhruv to any business looking to streamline customer acquisition, automate workflows, and build efficient CRM and marketing systems.",
  },
];

function Stars() {
  return null;
}
export { Stars };
