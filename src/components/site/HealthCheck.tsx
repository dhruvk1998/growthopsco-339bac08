import { useMemo, useState } from "react";

const questions = [
  "Are leads assigned automatically to the right rep?",
  "Is follow-up sequenced and automated?",
  "Is your website integrated with your CRM via API?",
  "Are you confident no leads are slipping through the cracks?",
  "Do stakeholders have real-time visibility into pipeline stages?",
];

type Answer = "yes" | "no" | null;

export function HealthCheck() {
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => answers.filter((a) => a === "yes").length * (100 / questions.length),
    [answers]
  );

  const verdict =
    score >= 80
      ? { label: "Mature", color: "text-accent", note: "Your CRM is in great shape — let's push optimization further." }
      : score >= 50
        ? { label: "Developing", color: "text-yellow-400", note: "A few targeted automations will compound quickly." }
        : { label: "At Risk", color: "text-red-400", note: "You're likely losing leads. A structured audit is the fastest win." };

  const allAnswered = answers.every((a) => a !== null);

  return (
    <section id="health-check" className="px-6 py-24">
      <div className="reveal mx-auto max-w-4xl rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/10 via-card/80 to-transparent p-8 sm:p-12">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Interactive Audit</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight lg:text-5xl">Is Your CRM Losing Leads?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Answer five quick questions to get your CRM maturity score and a recommended next step.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {questions.map((q, i) => (
            <div
              key={q}
              className="flex flex-col gap-3 rounded-xl border border-border bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm font-medium sm:text-base">
                <span className="mr-2 font-mono text-xs text-accent">0{i + 1}</span>
                {q}
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

        {!submitted ? (
          <button
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="mt-8 w-full rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40"
          >
            {allAnswered ? "Calculate My Score" : `Answer all 5 questions (${answers.filter(Boolean).length}/5)`}
          </button>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-background/60 p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">CRM Maturity Score</p>
            <div className={`mt-2 text-6xl font-bold ${verdict.color}`}>{Math.round(score)}<span className="text-2xl text-muted-foreground">/100</span></div>
            <p className={`mt-2 text-lg font-bold ${verdict.color}`}>{verdict.label}</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{verdict.note}</p>
            <a
              href="#contact"
              className="mt-6 inline-block rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground transition-all hover:opacity-90"
            >
              Let's optimize your CRM system
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
