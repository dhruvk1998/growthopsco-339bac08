import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: 95, suffix: "%", label: "Lead Response Time Reduction" },
  { value: 99, suffix: "%", label: "Manual Process Reduction" },
  { value: 50, suffix: "%", label: "Productivity Improvement" },
  { value: 99, suffix: "%", label: "Qualified Lead Growth" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const dur = 1400;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / dur);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function CredibilityMetrics() {
  return (
    <section className="px-6 pb-12 pt-4">
      <div className="reveal mx-auto max-w-6xl rounded-2xl border border-border bg-card/60 px-6 py-8 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-4xl font-bold tracking-tight text-accent lg:text-5xl">
                <CountUp to={m.value} suffix={m.suffix} />
              </div>
              <div className="mt-2 text-xs font-medium leading-snug text-muted-foreground sm:text-sm">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
