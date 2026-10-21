/** OFFLINE CUTOVER PROPOSAL. No route or active form imports this file.
 * Both handlers use only the writer (or one same-key bridge); no Sheets/Gmail/FormSubmit fallback.
 */
import { z } from "zod";
import { DiagnosticSchema, buildSheetRow, DIAGNOSTIC_FEE, REPORT_DELIVERY, type DiagnosticRequest } from "./diagnostic";
import { submitToWriter, WriterResultSchema, type WriterConfig, type WriterSubmission, type WriterSubmitResult } from "./apps-script-writer";
import { writerHash } from "./proposed-submission-keys";
const NOTIFY_EMAIL = "dhruvozone38@gmail.com";
const SHEET_NAME = "Diagnostic Requests";
const AssessmentSchema = z
  .object({
    score: z.number().min(0).max(100).optional(),
    rating: z.string().max(40).optional(),
    summary: z.string().max(2000).optional(),
    problemAreas: z.array(z.string().max(60)).max(20).optional(),
    answers: z
      .array(
        z.object({
          id: z.string().max(20),
          question: z.string().max(500),
          category: z.string().max(60),
          answer: z.union([z.literal("yes"), z.literal("no"), z.null()]),
        }),
      )
      .max(40)
      .optional(),
    completedAt: z.string().max(40).optional(),
  })
  .optional();

const LeadSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  requirements: z.string().trim().min(1).max(4000),
  companyName: z.string().trim().max(200).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  crmUsed: z.string().trim().max(120).optional().default(""),
  preferredMeetingTime: z.string().trim().max(200).optional().default(""),
  engagementType: z.string().trim().max(120).optional().default(""),
  companySize: z.string().trim().max(40).optional().default(""),
  leadSource: z.string().trim().max(120).optional().default("Website Contact Form"),
  assessment: AssessmentSchema,
});

type Lead = z.infer<typeof LeadSchema>;

function buildEmailBody(data: Lead, timestamp: string) {
  const a = data.assessment;
  const lines = [
    "A new consultation request has been submitted.",
    "",
    `Name: ${data.fullName || "—"}`,
    `Company: ${data.companyName || "—"}`,
    `Company Size: ${data.companySize || "—"}`,
    `Email: ${data.email || "—"}`,
    `Phone: ${data.phone || "—"}`,
    `Website: ${data.website || "—"}`,
    `Engagement Type: ${data.engagementType || "—"}`,
    `Current CRM: ${data.crmUsed || "—"}`,
    `Preferred Time: ${data.preferredMeetingTime || "—"}`,
    `Lead Source: ${data.leadSource || "—"}`,
    "",
    "Requirements:",
    data.requirements || "",
    "",
    `Submitted At: ${timestamp}`,
  ];
  if (a) {
    lines.push(
      "",
      "— CRM Health Check —",
      `Score: ${a.score ?? "—"}`,
      `Rating: ${a.rating ?? "—"}`,
      `Problem Areas: ${(a.problemAreas ?? []).join(", ") || "—"}`,
      `Summary: ${a.summary ?? "—"}`,
      `Completed At: ${a.completedAt ?? "—"}`,
    );
    if (a.answers?.length) {
      lines.push("", "Answers:");
      for (const x of a.answers) {
        lines.push(`  • [${x.category}] ${x.question} → ${x.answer ?? "—"}`);
      }
    }
  }
  return lines.join("\n");
}

function ownerEmail(d: DiagnosticRequest, id: string, ts: string) {
  return [
    "A new CRM Revenue Diagnostic request has been submitted.",
    "",
    `Submission ID: ${id}`,
    `Submitted At: ${ts}`,
    `Name: ${d.fullName}`,
    `Email: ${d.email}`,
    `Company: ${d.companyName}`,
    `Website: ${d.website || "—"}`,
    `Current CRM: ${d.currentCrm}`,
    `Company Size: ${d.companySize}`,
    `Improvement Areas: ${d.improvementAreas.join(", ") || "—"}`,
    `Preferred Meeting Time: ${d.preferredMeetingTime}`,
    `Fee Acknowledged (${DIAGNOSTIC_FEE}): Yes`,
    "",
    "Main Challenge:",
    d.challenge,
    "",
    `Saved to the "${SHEET_NAME}" worksheet with status: New.`,
  ].join("\n");
}

function prospectEmail(d: DiagnosticRequest) {
  return [
    `Hi ${d.fullName},`,
    "",
    "Thank you for requesting a CRM Revenue Diagnostic with GrowthOpsCo. Your request has been received.",
    "",
    "Please note: your appointment and payment are not yet confirmed. I will review your details and contact you to confirm availability, payment arrangements for the " +
      `${DIAGNOSTIC_FEE} fee, and the next steps. Your appointment is not confirmed until we agree on a time.`,
    "",
    `Report delivery: ${REPORT_DELIVERY}`,
    "",
    "Best regards,",
    "Dhruv Kaushik",
    "GrowthOpsCo",
  ].join("\n");
}


const IdentitySchema = z.object({
  key: z.string().regex(/^[a-zA-Z0-9_-]{16,100}$/),
  id: z.string().uuid(), timestamp: z.string().datetime(), businessHash: z.string().regex(/^[a-f0-9]{64}$/),
}).strict();
export const ProposedContactSchema = LeadSchema;
export interface ProposedDependencies {
  writer?: WriterConfig;
  // Server configuration only, allowlisted at deployment; not derived from browser input.
  bridgeEndpoint?: string;
  alreadyBridged?: boolean;
  fetchImpl?: typeof fetch;
}
async function run(form: "contact" | "diagnostic", raw: unknown, deps: ProposedDependencies): Promise<WriterSubmitResult> {
  const envelope = z.object({ identity: IdentitySchema, payload: z.record(z.unknown()) }).strict().parse(raw);
  const data = form === "contact" ? LeadSchema.parse(envelope.payload) : DiagnosticSchema.parse(envelope.payload);
  if (await writerHash(data) !== envelope.identity.businessHash) throw new Error("key_payload_mismatch");
  const fetchImpl = deps.fetchImpl ?? fetch;
  if (!deps.writer) {
    if (!deps.bridgeEndpoint || deps.alreadyBridged) throw new Error("Writer not configured");
    const endpoint = new URL(deps.bridgeEndpoint);
    if (endpoint.origin !== "https://growthopsco.lovable.app" || endpoint.pathname !== `/api/${form === "contact" ? "consultation-lead" : "diagnostic-request"}` || endpoint.search || endpoint.hash || endpoint.username || endpoint.password) throw new Error("Invalid bridge configuration");
    const res = await fetchImpl(endpoint.href, { method: "POST", headers: { "Content-Type": "application/json", "X-GrowthOps-Remote-Bridge": "1" }, body: JSON.stringify({ identity: envelope.identity, payload: data }), redirect: "error" });
    const parsed = WriterResultSchema.safeParse(await res.json().catch(() => null));
    if (!res.ok || !parsed.success || parsed.data.key !== envelope.identity.key) throw new Error("Bridge rejected or malformed response");
    return parsed.data;
  }
  const { id, timestamp: ts, key } = envelope.identity;
  let submission: WriterSubmission;
  if (form === "contact") {
    const d = LeadSchema.parse(data);
    submission = { form, row: [ts,d.fullName,d.companyName,d.email,d.phone,d.website,d.crmUsed,d.requirements,d.preferredMeetingTime,d.leadSource,d.engagementType,d.companySize],
      emails: { owner: { to: NOTIFY_EMAIL, replyTo: d.email, subject: `New CRM Consultation Request — ${d.fullName}`, body: buildEmailBody(d,ts) } },
      ...(d.assessment ? { assessment: d.assessment } : {}),
    };
  } else {
    const d = DiagnosticSchema.parse(data);
    submission = { form, row: buildSheetRow(d,id,ts), emails: {
      owner: { to: NOTIFY_EMAIL, replyTo: d.email, subject: `New CRM Revenue Diagnostic Request — ${d.fullName}`, body: ownerEmail(d,id,ts) },
      prospect: { to: d.email, subject: "Your CRM Revenue Diagnostic request has been received", body: prospectEmail(d) },
    }};
  }
  return submitToWriter(deps.writer, { action: "submit", key, payloadHash: await writerHash(submission), submission }, fetchImpl);
}
export function proposedContactHandler(raw: unknown, deps: ProposedDependencies) { return run("contact", raw, deps); }
export function proposedDiagnosticHandler(raw: unknown, deps: ProposedDependencies) { return run("diagnostic", raw, deps); }
/** Acceptance is processing only, never delivery. UI must not issue a new identity on partial/ambiguous results. */
export function processingComplete(result: WriterSubmitResult): boolean {
  return result.persistence === "written" && Object.values(result.emails).every(outcome => outcome.state === "accepted" || outcome.state === "na");
}
