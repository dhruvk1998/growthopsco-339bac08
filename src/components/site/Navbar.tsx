import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Framework", to: "/framework" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Contact", to: "/contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll, ESC to close, focus trap
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // Focus first link
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 60);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      // Return focus to toggle
      toggleRef.current?.focus();
    };
  }, [open]);

  const handleNavClick = (to: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (location.pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    setOpen(false);
    if (location.pathname === "/contact") {
      e.preventDefault();
      const el = document.getElementById("consultation-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "border-b border-border/60 bg-background/85 backdrop-blur-lg"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            onClick={handleNavClick("/")}
            className="relative z-10 flex items-center gap-2.5 font-bold tracking-tight"
          >
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
                onClick={handleNavClick(n.to)}
                className="transition-colors hover:text-accent data-[status=active]:text-accent"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              hash="consultation-form"
              onClick={handleBookClick}
              className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-all hover:shadow-glow"
            >
              Book CRM Strategy Call
            </Link>
          </div>

          <button
            ref={toggleRef}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] grid size-10 place-items-center rounded-lg border border-border bg-card/60 lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ease-out ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ease-out ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={panelRef}
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`absolute inset-0 flex flex-col bg-background transition-all duration-300 ease-out ${
            open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          }`}
        >
          <div className="h-20 shrink-0" />
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-10 pt-6">
            <ul className="flex flex-col gap-1">
              {navItems.map((n, i) => (
                <li
                  key={n.to}
                  style={{
                    transitionDelay: open ? `${120 + i * 50}ms` : "0ms",
                  }}
                  className={`transition-all duration-300 ease-out ${
                    open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                >
                  <Link
                    to={n.to}
                    onClick={handleNavClick(n.to)}
                    className="flex items-center justify-between border-b border-border/40 py-5 text-2xl font-semibold tracking-tight text-foreground transition-colors hover:text-accent data-[status=active]:text-accent"
                  >
                    <span>{n.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>

            <div
              style={{ transitionDelay: open ? `${120 + navItems.length * 50}ms` : "0ms" }}
              className={`mt-10 transition-all duration-300 ease-out ${
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Ready to start?
              </p>
              <Link
                to="/contact"
                hash="consultation-form"
                onClick={handleBookClick}
                className="flex w-full items-center justify-center rounded-full bg-accent px-6 py-4 text-base font-semibold text-accent-foreground shadow-glow"
              >
                Book CRM Strategy Call
              </Link>
              <div className="mt-6 space-y-1.5 text-sm text-muted-foreground">
                <a href="mailto:dhruv.kaushik866@gmail.com" className="block hover:text-accent">
                  dhruv.kaushik866@gmail.com
                </a>
                <a href="tel:+17786799471" className="block hover:text-accent">
                  +1 (778) 679-9471
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
