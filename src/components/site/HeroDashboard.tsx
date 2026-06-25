import { useEffect, useRef, useState } from "react";

type KPI = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: string;
};

const kpis: KPI[] = [
  { label: "Leads Captured", value: 1284, delta: "+18%" },
  { label: "Conversion Rate", value: 34, suffix: "%", delta: "+6.2%" },
  { label: "Tasks Automated", value: 962, delta: "+24%" },
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
  const points = [12, 22, 18, 30, 26, 38, 34, 48, 52, 62, 58, 74];
  const W = 400;
  const H = 120;
  const stepX = W / (points.length - 1);
  const maxY = 80;
  const toY = (v: number) => H - (v / maxY) * (H - 16) - 8;
  const coords = points.map((p, i) => ({ x: i * stepX, y: toY(p) }));

  // Smooth Catmull-Rom -> Bezier path
  const smooth = (() => {
    if (coords.length < 2) return "";
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i - 1] ?? coords[i];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] ?? p2;
      const t = 0.18;
      const c1x = p1.x + (p2.x - p0.x) * t;
      const c1y = p1.y + (p2.y - p0.y) * t;
      const c2x = p2.x - (p3.x - p1.x) * t;
      const c2y = p2.y - (p3.y - p1.y) * t;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  })();
  const area = `${smooth} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="group/chart rounded-xl border border-border bg-background/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Pipeline Velocity · last 12 weeks
        </div>
        <div className="text-[11px] font-bold text-accent">+42%</div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hgArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <filter id="hgGlow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="0"
            x2={W}
            y1={(H / 3) * i + 4}
            y2={(H / 3) * i + 4}
            stroke="var(--foreground)"
            strokeOpacity="0.06"
            strokeWidth="0.5"
          />
        ))}
        <path
          d={area}
          fill="url(#hgArea)"
          opacity={start ? 1 : 0}
          style={{ transition: "opacity 800ms ease 500ms" }}
        />
        <path
          d={smooth}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#hgGlow)"
          style={{
            strokeDasharray: 1400,
            strokeDashoffset: start ? 0 : 1400,
            transition: "stroke-dashoffset 900ms ease-out",
          }}
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r="3"
            fill="var(--accent)"
            stroke="var(--background)"
            strokeWidth="1.5"
            filter="url(#hgGlow)"
            className="opacity-0 transition-opacity duration-300 group-hover/chart:opacity-100"
          />
        ))}
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
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent" />
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Revenue Operations · Live
              </div>
            </div>
            <div className="pl-4 text-[10px] italic text-muted-foreground/60">
              Typical client outcomes across active engagements
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
