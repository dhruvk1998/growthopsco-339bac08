import { useEffect, useRef, useState } from "react";

type KPI = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: string;
};

const kpis: KPI[] = [
  { label: "New Leads", value: 1284, delta: "+18%" },
  { label: "Conversion Rate", value: 34, suffix: "%", delta: "+6.2%" },
  { label: "Tasks Completed", value: 962, delta: "+24%" },
  { label: "Revenue Impact", value: 412, prefix: "$", suffix: "K", delta: "+31%" },
];

function useCountUp(target: number, start: boolean, durationMs = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, durationMs]);
  return n;
}

function KpiCard({ kpi, start }: { kpi: KPI; start: boolean }) {
  const n = useCountUp(kpi.value, start);
  return (
    <div className="rounded-xl border border-border bg-background/60 p-4 transition-colors hover:border-accent/40">
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {kpi.label}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {kpi.prefix ?? ""}
          {n.toLocaleString()}
          {kpi.suffix ?? ""}
        </div>
        <div className="text-[11px] font-bold text-accent">{kpi.delta}</div>
      </div>
    </div>
  );
}

function LineChart({ start }: { start: boolean }) {
  // Build a smooth path
  const points = [12, 22, 18, 30, 26, 38, 34, 48, 52, 62, 58, 74];
  const W = 400;
  const H = 120;
  const stepX = W / (points.length - 1);
  const maxY = 80;
  const toY = (v: number) => H - (v / maxY) * (H - 16) - 8;
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${toY(p)}`)
    .join(" ");
  const area = `${d} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="rounded-xl border border-border bg-background/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Pipeline Velocity · last 12 weeks
        </div>
        <div className="text-[11px] font-bold text-accent">+42%</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hgArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="0"
            x2={W}
            y1={(H / 3) * i + 4}
            y2={(H / 3) * i + 4}
            stroke="hsl(var(--border))"
            strokeDasharray="2 4"
            strokeWidth="0.5"
          />
        ))}
        <path d={area} fill="url(#hgArea)" opacity={start ? 1 : 0} style={{ transition: "opacity 800ms ease 600ms" }} />
        <path
          d={d}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: start ? 0 : 1200,
            transition: "stroke-dashoffset 1400ms ease-out",
          }}
        />
      </svg>
    </div>
  );
}

export function HeroDashboard() {
  const [start, setStart] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => setStart(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl border border-border bg-card/70 p-5 shadow-[0_30px_80px_-30px_hsl(var(--accent)/0.45)] backdrop-blur"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-accent" />
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Revenue Operations · Live
            </div>
          </div>
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-accent/70" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} kpi={k} start={start} />
          ))}
        </div>

        <div className="mt-3">
          <LineChart start={start} />
        </div>
      </div>
    </div>
  );
}
