import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Reveal elements with `.reveal` class as they enter the viewport.
 *
 * Bug history: previously used a single IntersectionObserver with
 * threshold: 0.12 across all .reveal elements. When a `.reveal` container
 * was very tall (e.g. the Case Study Directory wrapping ~12k px of cards),
 * the viewport-to-element ratio never reached 12% on first paint, so the
 * observer never fired until a resize/zoom forced re-evaluation. Page
 * appeared blank until the user resized.
 *
 * Fix: re-run on route change, immediately reveal anything already in (or
 * past) the viewport, and use threshold 0 for everything else.
 */
export function useReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reveal = (el: Element) => el.classList.add("in");

    const run = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in)"));
      const vh = window.innerHeight || document.documentElement.clientHeight;

      const pending: HTMLElement[] = [];
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        // Eagerly reveal anything visible-now or above the fold.
        if (r.top < vh * 0.95) {
          reveal(el);
        } else {
          pending.push(el);
        }
      });

      if (pending.length === 0) return undefined;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              reveal(e.target);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -5% 0px" }
      );
      pending.forEach((el) => io.observe(el));
      return io;
    };

    let io: IntersectionObserver | undefined;
    // Run after layout settles (route just mounted).
    const raf = requestAnimationFrame(() => {
      io = run();
    });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);
}

