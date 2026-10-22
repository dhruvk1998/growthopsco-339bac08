import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { submissionEnvironment, UAT_OWNER_EMAIL, UAT_RECIPIENT, UAT_SPREADSHEET_ID } from "@/lib/uat-isolation";
import { diagnosticConfirmationMessage, needsDiagnosticConfirmation } from "@/lib/diagnostic-confirmation";
import { acknowledgedRequest } from "@/lib/delivery-provider";
import { DeliveryFailure, deliveryResult, ownerNotificationAddress, readDeliveryBridge, runFormDelivery } from "@/lib/form-delivery";
import { consultationSheetEntry } from "@/lib/consultation-sheet";

/** Both forms share this handler. Forward before side effects on hosts without Sheets secrets.
 * Persistence and each notification are tracked independently. No fallback after ambiguous sends.
 */
const PUBLISHED_LOVABLE_ENDPOINT = "https://growthopsco.lovable.app/api/consultation-lead";
const SPREADSHEET_ID = "1gR6UwaZ6zG2FmBVFBoKv9XbUcaqQC-k7pqsefQTC0c4";
const SHEET_RANGE = "Database!A:L";
const GATEWAY = "https://connector-gateway.lovable.dev";

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
  email: z.string().trim().email().max(200).refine((value) => !/[\r\n]/.test(value)),
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

export type Lead = z.infer<typeof LeadSchema>;

// --- Transport 0: Gmail via Lovable connector gateway ----------------------

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

function base64UrlEncode(input: string) {
  // btoa works on latin1; encode UTF-8 first.
  const utf8 = unescape(encodeURIComponent(input));
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function submitViaGmail(data: Lead, timestamp: string, notifyEmail: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) {
    throw new Error("Missing Gmail connector secrets");
  }
  const subject = `New CRM Consultation Request — ${data.fullName}`;
  const body = buildEmailBody(data, timestamp);
  const rfc2822 = [
    `To: ${notifyEmail}`,
    `Reply-To: ${data.email}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].join("\r\n");

  await acknowledgedRequest("Gmail",
    "https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: base64UrlEncode(rfc2822) }),
    },
  );
}

async function sendDiagnosticConfirmation(data: Lead, replyTo: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) throw new DeliveryFailure("failed", "Gmail configuration");
  await acknowledgedRequest("Gmail", `${GATEWAY}/google_mail/gmail/v1/users/me/messages/send`, {
    method: "POST", headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": gmailKey, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: base64UrlEncode(diagnosticConfirmationMessage(data.email, data.fullName, replyTo)) }),
  });
}

// --- Transport 1: FormSubmit.co (default, no setup) ------------------------

async function submitViaFormSubmit(data: Lead, timestamp: string, notifyEmail: string) {
  const a = data.assessment;
  const assessmentFields = a
    ? {
        crm_health_score: a.score ?? "",
        crm_health_rating: a.rating ?? "",
        crm_health_problem_areas: (a.problemAreas ?? []).join(", "),
        crm_health_summary: a.summary ?? "",
        crm_health_completed_at: a.completedAt ?? "",
        crm_health_answers: (a.answers ?? [])
          .map((x) => `${x.category} — ${x.question} → ${x.answer ?? "—"}`)
          .join("\n"),
      }
    : {};
  await acknowledgedRequest("FormSubmit", `https://formsubmit.co/ajax/${notifyEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `New CRM Consultation Request — ${data.fullName}`,
      _replyto: data.email,
      _template: "table",
      submitted_at: timestamp,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      company_name: data.companyName,
      company_size: data.companySize,
      website: data.website,
      engagement_type: data.engagementType,
      current_crm: data.crmUsed,
      preferred_meeting_time: data.preferredMeetingTime,
      lead_source: data.leadSource,
      requirements: data.requirements,
      ...assessmentFields,
    }),
  });
}

// Legacy Apps Script combines a write and a send without verifiable separate outcomes.
// It is not a safe notification fallback after a gateway append; leave its deployment untouched.
async function appendToSheetViaGateway(row: string[], spreadsheetId = SPREADSHEET_ID, range = SHEET_RANGE) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey || !sheetsKey) throw new Error("Missing Lovable gateway secrets");

  const url = `${GATEWAY}/google_sheets/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  await acknowledgedRequest("Sheets", url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetsKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });
}

export async function handleConsultationRequest(request: Request, development: boolean) {
  const environment = submissionEnvironment(request.url, development);
  if (environment === "blocked-preview") return Response.json({ ok: false, error: "Hosted preview submissions are paused. Isolated UAT runs only in the local test preview." }, { status: 403 });
  const json = await request.json().catch(() => null);
  if (json && typeof json._honeypot === "string" && json._honeypot.length > 0) {
    // Silent bot response, deliberately indistinguishable from a completed request.
    return Response.json(deliveryResult("saved", "accepted", "not_required"));
  }
  const parsed = LeadSchema.safeParse(json);
  if (!parsed.success) return Response.json({ ok: false, error: "Invalid form submission", details: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  if (environment === "uat" && (!UAT_RECIPIENT || data.email !== UAT_RECIPIENT || !data.fullName.startsWith("UAT-"))) {
    return Response.json({ ok: false, error: "UAT is paused for this recipient. No request was saved or emailed." }, { status: 403 });
  }
  const hasSheets = Boolean(process.env.LOVABLE_API_KEY && process.env.GOOGLE_SHEETS_API_KEY);
  const hasMail = Boolean(process.env.LOVABLE_API_KEY && process.env.GOOGLE_MAIL_API_KEY);
  const diagnostic = needsDiagnosticConfirmation(data.engagementType);
  // On Vercel, delegate the entire operation before local writes or sends. Never bridge a partial attempt.
  if (environment !== "uat" && !hasSheets) {
    const host = new URL(request.url).hostname;
    if (!host.endsWith("lovable.app") && request.headers.get("X-GrowthOps-Remote-Bridge") !== "1") {
      try {
        const response = await fetch(PUBLISHED_LOVABLE_ENDPOINT, {
          method: "POST", headers: { "Content-Type": "application/json", "X-GrowthOps-Remote-Bridge": "1" },
          body: JSON.stringify(data), signal: AbortSignal.timeout(20000),
        });
        return Response.json(await readDeliveryBridge(response));
      } catch { return Response.json(deliveryResult("unknown", "unknown", diagnostic ? "unknown" : "not_required")); }
    }
    return Response.json(deliveryResult("not_configured", "not_attempted", diagnostic ? "not_attempted" : "not_required"));
  }
  try {
    const timestamp = new Date().toISOString();
    const owner = environment === "uat" ? UAT_OWNER_EMAIL : ownerNotificationAddress(process.env.OWNER_NOTIFICATION_EMAIL);
    const entry = environment === "uat" ? {
      range: SHEET_RANGE,
      row: [timestamp, data.fullName, data.companyName, data.email, data.phone, data.website, data.crmUsed, data.requirements, data.preferredMeetingTime, data.leadSource, data.engagementType, data.companySize],
    } : consultationSheetEntry(data, timestamp, crypto.randomUUID());
    const result = await runFormDelivery({
      write: () => appendToSheetViaGateway(entry.row, environment === "uat" ? UAT_SPREADSHEET_ID : SPREADSHEET_ID, entry.range),
      owner: hasMail ? () => submitViaGmail(data, timestamp, owner)
        : environment !== "uat" && !diagnostic ? () => submitViaFormSubmit(data, timestamp, owner) : undefined,
      prospect: hasMail ? () => sendDiagnosticConfirmation(data, owner) : undefined,
      diagnostic,
    });
    console.info(`[consultation-lead] persistence=${result.persistence} owner=${result.notifications.owner} prospect=${result.notifications.prospect}`);
    return Response.json(result);
  } catch {
    // Mapping/configuration validation happens before side effects. Never log private payloads/provider bodies.
    return Response.json(deliveryResult("failed", "not_attempted", diagnostic ? "not_attempted" : "not_required"));
  }
}

export const Route = createFileRoute("/api/consultation-lead")({
  server: { handlers: { POST: async ({ request }) => handleConsultationRequest(request, import.meta.env.DEV) } },
});
