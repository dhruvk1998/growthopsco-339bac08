import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const navItems = [
  { label: "Workflow", href: "#workflow" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border/60 bg-background/75 backdrop-blur-lg" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground text-sm font-bold">DK</span>
          <span className="text-base">Dhruv Kaushik</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {navItems.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-accent">
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-accent px-5 py-2.5 font-semibold text-accent-foreground transition-all hover:shadow-glow"
          >
            Book Consultation
          </a>
        </div>
        <a
          href="#contact"
          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground md:hidden"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
