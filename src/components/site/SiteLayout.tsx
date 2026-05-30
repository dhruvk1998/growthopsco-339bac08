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

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground text-sm font-bold">
              DK
            </span>
            <span className="text-base">Dhruv Kaushik</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            CRM Implementation & Workflow Automation Specialist. Helping businesses
            streamline lead management and scale CRM operations.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-accent">Services</Link></li>
            <li><Link to="/case-studies" className="hover:text-accent">Case Studies</Link></li>
            <li><Link to="/framework" className="hover:text-accent">CRM Framework</Link></li>
            <li><Link to="/tools" className="hover:text-accent">Tools & Expertise</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:dhruv.kaushik866@gmail.com" className="hover:text-accent">dhruv.kaushik866@gmail.com</a></li>
            <li><a href="tel:+17786799471" className="hover:text-accent">+1 (778) 679-9471</a></li>
            <li>Burnaby, BC · Canada</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Dhruv Kaushik · CRM Implementation & Workflow Automation</div>
          <div>Built for operators who care about pipeline.</div>
        </div>
      </div>
    </footer>
  );
}
