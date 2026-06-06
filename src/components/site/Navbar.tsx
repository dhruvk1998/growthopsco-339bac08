import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { label: "Services", to: "/services" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Framework", to: "/framework" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

const LINKEDIN_URL = "https://www.linkedin.com/in/dhruv-kaushik-95231a175/";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-border/60 bg-background/85 backdrop-blur-lg"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground text-sm font-bold">
            DK
          </span>
          <span className="text-base">Dhruv Kaushik</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="transition-colors hover:text-accent data-[status=active]:text-accent"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
          <Link
            to="/contact"
            className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-all hover:shadow-glow"
          >
            Book CRM Strategy Call
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg border border-border bg-card/60 lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-accent data-[status=active]:bg-card data-[status=active]:text-accent"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-accent"
            >
              LinkedIn ↗
            </a>
            <Link
              to="/contact"
              className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-accent-foreground"
            >
              Book CRM Strategy Call
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
