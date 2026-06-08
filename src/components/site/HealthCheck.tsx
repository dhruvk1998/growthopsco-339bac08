import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

type Category = "Lead Management" | "Automation" | "Integration" | "Reporting";

type Question = { id: string; text: string; category: Category };

const questions: Question[] = [
  { id: "q1", text: "Are leads assigned automatically to the right rep within minutes?", category: "Lead Management" },
  { id: "q2", text: "Is follow-up sequenced, tracked, and enforced by SLA?", category: "Lead Management" },
  { id: "q3", text: "Is your website (forms / chatbot) integrated with your CRM via API?", category: "Integration" },
  { id: "q4", text: "Are you confident no inbound leads are slipping through the cracks?", category: "Lead Management" },
  { id: "q5", text: "Do stakeholders have real-time visibility into pipeline stages?", category: "Reporting" },
  { id: "q6", text: "Are repetitive tasks (stage updates, alerts, routing) automated?", category: "Automation" },
  { id: "q7", text: "Is your CRM data clean — minimal duplicates, consistent fields, governed picklists?", category: "Reporting" },
  { id: "q8", text: "Does your team consistently use the CRM as their daily workspace?", category: "Lead Management" },
];

const recommendations: Record<Category, string> = {
  "Lead Management": "Redesign lead capture, routing, and SLA enforcement so every inbound lead has a clear owner and follow-up clock.",
  Automation: "Build trigger-based automations to remove the manual steps draining rep capacity — stage updates, alerts, routing, escalations.",
  Integration: "Connect website forms, chatbot, and downstream systems so leads enter the CRM clean, structured, and routed instantly.",
  Reporting: "Standardize fields, stage-exit criteria, and dashboards so leadership can trust the numbers and forecast confidently.",
};

type Answer = "yes" | "no" | null;

const STORAGE_KEY = "crmHealthCheck";

export function HealthCheck() {
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => Math.round(answers.filter((a) => a === "yes").length * (100 / questions.length)),
    [answers]
  );

  const problemAreas = useMemo(() => {
    const byCat: Record<string, { total: number; no: number }> = {};
    questions.forEach((q, i) => {
      byCat[q.category] = byCat[q.category] || { total: 0, no: 0 };
      byCat[q.category].total += 1;
      if (answers[i] === "no") byCat[q.category].no += 1;
    });
    return (Object.entries(byCat) as [Category, { total: number; no: number }][])
      .filter(([, v]) => v.no > 0)
      .sort((a, b) => b[1].no / b[1].total - a[1].no / a[1].total);
  }, [answers]);

  const verdict =
    score >= 90
      ? { label: "Excellent", color: "text-accent", note: "Your CRM is in great shape — optimization will compound." }
      : score >= 70
        ? { label: "Good", color: "text-accent", note: "Solid foundation. A few targeted improvements will unlock more capacity." }
        : score >= 40
          ? { label: "Needs Attention", color: "text-yellow-400", note: "Important gaps are slowing your team and risking leads. Worth addressing soon." }
          : { label: "Critical", color: "text-red-400", note: "You're likely losing leads daily. A structured audit is the fastest win." };

  const allAnswered = answers.every((a) => a !== null);

  const summary = useMemo(() => {
    if (problemAreas.length === 0) {
      return "Your assessment shows strong fundamentals across lead management, automation, integration, and reporting.";
    }
    const areas = problemAreas.map(([cat]) => cat.toLowerCase());
    const joined =
      areas.length === 1
        ? areas[0]
        : areas.slice(0, -1).join(", ") + " and " + areas[areas.length - 1];
    return `Your assessment suggests opportunities to improve ${joined}.`;
  }, [problemAreas]);

  // Persist results to sessionStorage so the consultation form can attach them
  // when (and only when) the visitor later books a call.
  useEffect(() => {
    if (!submitted) return;
    if (typeof window === "undefined") return;
    try {
      const payload = {
        score,
        rating: verdict.label,
        summary,
        problemAreas: problemAreas.map(([cat]) => cat),
        answers: questions.map((q, i) => ({
          id: q.id,
          question: q.text,
          category: q.category,
          answer: answers[i],
        })),
        completedAt: new Date().toISOString(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, [submitted, score, verdict.label, summary, problemAreas, answers]);

  return (
    <section id="health-check" className="px-6 py-24">
      <div className="reveal mx-auto max-w-4xl rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/10 via-card/80 to-transparent p-8 sm:p-12">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">CRM Assessment Tool</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight lg:text-5xl">Is Your CRM Losing Leads?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Eight quick questions across lead management, automation, integration, and reporting. Get a CRM Health Score, identified problem areas, and recommended next steps.
          </p>
        </div>

        {!submitted && (
          <>
            <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Progress</span>
              <span>
                {answers.filter(Boolean).length} / {questions.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${(answers.filter(Boolean).length / questions.length) * 100}%` }}
              />
            </div>
          </>
        )}

        {!submitted && (
          <div className="mt-6 space-y-3">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm font-medium sm:text-base">
                  <span className="mr-2 font-mono text-xs text-accent">0{i + 1}</span>
                  {q.text}
                </span>
                <div className="flex shrink-0 gap-2">
                  {(["yes", "no"] as const).map((opt) => {
                    const isSelected = answers[i] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          const next = [...answers];
                          next[i] = opt;
                          setAnswers(next);
                        }}
                        className={`min-w-16 rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                          isSelected
                            ? opt === "yes"
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-red-400/60 bg-red-400/10 text-red-300"
                            : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {!submitted ? (
          <button
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="mt-8 w-full rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            {allAnswered ? "Calculate My CRM Health Score" : `Answer all ${questions.length} questions (${answers.filter(Boolean).length}/${questions.length})`}
          </button>
        ) : (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-border bg-background/60 p-8 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your CRM Health Score</p>
              <div className={`mt-2 text-6xl font-bold ${verdict.color}`}>
                {score}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <p className={`mt-2 text-lg font-bold ${verdict.color}`}>{verdict.label}</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{verdict.note}</p>
            </div>

            {problemAreas.length > 0 && (
              <div className="rounded-2xl border border-border bg-background/60 p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Identified Problem Areas</p>
                <ul className="mt-3 space-y-3">
                  {problemAreas.map(([cat]) => (
                    <li key={cat} className="rounded-xl border border-border bg-card/50 p-4">
                      <p className="text-sm font-bold text-foreground">{cat}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{recommendations[cat]}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-background/60 p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Recommendation Summary</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
            </div>

            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-7 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Next Step</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight">Want a deeper review of your results?</h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Book a CRM Strategy Call and we'll review your assessment together, identify the biggest opportunities for improvement, and discuss practical next steps.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/contact"
                  hash="consultation-form"
                  className="inline-block rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] hover:opacity-95"
                >
                  Schedule Consultation →
                </Link>
                <Link
                  to="/case-studies"
                  className="inline-block rounded-xl border border-border bg-transparent px-7 py-3.5 font-bold text-foreground transition-all hover:border-accent/50 hover:text-accent"
                >
                  Explore Case Studies
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
