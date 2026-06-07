import { useEffect, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";

const navItems = [
  { label: "Home", hash: "hero" },
  { label: "About", hash: "about" },
  { label: "Services", hash: "services" },
  { label: "Framework", hash: "framework" },
  { label: "Case Studies", hash: "case-studies" },
  { label: "Contact", hash: "contact" },
] as const;

function smoothScrollTo(hash: string) {
  if (typeof window === "undefined") return;
  if (hash === "hero" || hash === "") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleAnchorClick = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== "/") {
      navigate({ to: "/", hash: hash === "hero" ? undefined : hash });
      // After navigation, scroll smoothly
      setTimeout(() => smoothScrollTo(hash), 80);
    } else {
      smoothScrollTo(hash);
      // Update the URL hash without jumping
      const newHash = hash === "hero" ? " " : `#${hash}`;
      history.replaceState(null, "", newHash === " " ? location.pathname : newHash);
    }
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-border/60 bg-background/85 backdrop-blur-lg"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          onClick={handleAnchorClick("hero")}
          className="flex items-center gap-2.5 font-bold tracking-tight"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground text-sm font-bold">
            DK
          </span>
          <span className="text-base">Dhruv Kaushik</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          {navItems.map((n) => (
            <a
              key={n.hash}
              href={n.hash === "hero" ? "/" : `/#${n.hash}`}
              onClick={handleAnchorClick(n.hash)}
              className="transition-colors hover:text-accent"
            >
              {n.label}
            </a>
          ))}
          <a
            href="/#consultation-form"
            onClick={handleAnchorClick("consultation-form")}
            className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-all hover:shadow-glow"
          >
            Book CRM Strategy Call
          </a>
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
              <a
                key={n.hash}
                href={n.hash === "hero" ? "/" : `/#${n.hash}`}
                onClick={handleAnchorClick(n.hash)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-accent"
              >
                {n.label}
              </a>
            ))}
            <a
              href="/#consultation-form"
              onClick={handleAnchorClick("consultation-form")}
              className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-accent-foreground"
            >
              Book CRM Strategy Call
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
