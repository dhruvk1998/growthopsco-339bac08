import { useState } from "react";
import {
  COMPANY_SIZES,
  CRM_OPTIONS,
  DIAGNOSTIC_FEE,
  DiagnosticSchema,
  IMPROVEMENT_AREAS,
} from "@/lib/diagnostic";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<string, string>>;

const input =
  "w-full rounded-lg border border-border bg-background p-3 text-sm outline-none transition-colors focus:border-accent aria-[invalid=true]:border-destructive";

export function DiagnosticForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      companyName: String(fd.get("companyName") || ""),
      website: String(fd.get("website") || ""),
      currentCrm: String(fd.get("currentCrm") || ""),
      companySize: String(fd.get("companySize") || ""),
      challenge: String(fd.get("challenge") || ""),
      improvementAreas: fd.getAll("improvementAreas").map(String),
      preferredMeetingTime: String(fd.get("preferredMeetingTime") || ""),
      feeAcknowledged: fd.get("feeAcknowledged") === "on",
    };
    const parsed = DiagnosticSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0]);
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      document.getElementById(`dx-${first}`)?.focus();
      return;
    }
    setErrors({});
    setServerError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/diagnostic-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, _honeypot: String(fd.get("_honeypot") || "") }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Submission failed. Please try again.");
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Request Received</p>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed">
          Your diagnostic request has been received. I will review your details and contact you to confirm availability,
          payment arrangements, and the next steps. Your appointment is not confirmed until we agree on a time.
        </p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`dx-${k}-err`} className="mt-1 text-xs text-destructive">
        {errors[k]}
      </p>
    ) : null;
  const a11y = (k: string) => ({
    id: `dx-${k}`,
    name: k,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `dx-${k}-err` : undefined,
  });
  const label = (k: string, text: string, required = true) => (
    <label htmlFor={`dx-${k}`} className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
      {text}
      {required && <span className="text-accent"> *</span>}
    </label>
  );

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 sm:p-8">
      <input type="text" name="_honeypot" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>{label("fullName", "Full Name")}<input {...a11y("fullName")} autoComplete="name" className={input} />{err("fullName")}</div>
        <div>{label("email", "Business Email")}<input {...a11y("email")} type="email" autoComplete="email" className={input} />{err("email")}</div>
        <div>{label("companyName", "Company Name")}<input {...a11y("companyName")} autoComplete="organization" className={input} />{err("companyName")}</div>
        <div>{label("website", "Company Website", false)}<input {...a11y("website")} type="url" placeholder="https://" className={input} />{err("website")}</div>
        <div>
          {label("currentCrm", "Current CRM")}
          <select {...a11y("currentCrm")} defaultValue="" className={input}>
            <option value="" disabled>Select…</option>
            {CRM_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          {err("currentCrm")}
        </div>
        <div>
          {label("companySize", "Company Size")}
          <select {...a11y("companySize")} defaultValue="" className={input}>
            <option value="" disabled>Select…</option>
            {COMPANY_SIZES.map((o) => <option key={o} value={o}>{o} employees</option>)}
          </select>
          {err("companySize")}
        </div>
      </div>
      <div>
        {label("challenge", "Main CRM or Revenue Challenge")}
        <textarea {...a11y("challenge")} rows={4} className={input} />
        {err("challenge")}
      </div>
      <fieldset>
        <legend className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Areas for Improvement</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {IMPROVEMENT_AREAS.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background/50 p-3 text-sm has-[:checked]:border-accent">
              <input type="checkbox" name="improvementAreas" value={a} className="accent-[var(--accent)]" />
              {a}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        {label("preferredMeetingTime", "Preferred Meeting Time")}
        <input {...a11y("preferredMeetingTime")} placeholder="e.g. Weekday mornings, Pacific Time" className={input} />
        {err("preferredMeetingTime")}
      </div>
      <div>
        <label className="flex gap-3 rounded-lg border border-border bg-background/50 p-4 text-sm leading-relaxed">
          <input {...a11y("feeAcknowledged")} type="checkbox" className="mt-1 accent-[var(--accent)]" />
          <span>
            I understand that the CRM Revenue Diagnostic costs {DIAGNOSTIC_FEE}. Submitting this form is a request, not a
            confirmed appointment or payment. GrowthOpsCo will contact me to confirm availability and payment arrangements.
          </span>
        </label>
        {err("feeAcknowledged")}
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm">
          {serverError}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-accent px-8 py-4 font-bold text-accent-foreground transition-all hover:shadow-glow disabled:cursor-wait disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit Diagnostic Request"}
      </button>
    </form>
  );
}
