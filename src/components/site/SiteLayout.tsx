import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { useReveal } from "@/hooks/use-reveal";

export function SiteLayout({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/30 selection:text-accent-foreground">
      <Navbar />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

const expertise = [
  "CRM Implementation",
  "Workflow Automation",
  "Revenue Operations",
  "Website Integrations",
  "Chatbot Integrations",
  "Lead Lifecycle Design",
];

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground text-sm font-bold">
              DK
            </span>
            <span className="text-base">Dhruv Kaushik</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            CRM, Automation & Revenue Operations Consultant. Helping growing businesses streamline lead management and scale operational efficiency.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/case-studies" className="hover:text-accent">Case Studies</Link></li>
            <li><Link to="/framework" className="hover:text-accent">CRM Framework</Link></li>
            <li><Link to="/about" className="hover:text-accent">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Expertise</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {expertise.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:dhruv.kaushik866@gmail.com" className="hover:text-accent">dhruv.kaushik866@gmail.com</a></li>
            <li><a href="tel:+17786799471" className="hover:text-accent">+1 (778) 679-9471</a></li>
            <li>
              <a
                href="https://www.linkedin.com/in/dhruv-kaushik-95231a175/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent"
              >
                <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                </svg>
                LinkedIn
              </a>
            </li>
            <li>Burnaby, BC · Canada</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Dhruv Kaushik · CRM, Automation & Revenue Operations</div>
          <div>Built for operators who care about pipeline.</div>
        </div>
      </div>
    </footer>
  );
}
