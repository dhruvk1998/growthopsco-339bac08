import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Consultation lead submission endpoint — portable across Vercel, Lovable, and
 * any Node/Worker host. No platform-specific secrets required.
 *
 * Transport order (first one that's configured / works):
 *   1. FormSubmit.co (DEFAULT — zero setup, just an email address).
 *      One-time: Dhruv must click the activation link in the first email
 *      FormSubmit sends to dhruv.kaushik866@gmail.com after the first submit.
 *   2. APPS_SCRIPT_URL env var — Google Apps Script Web App (writes to Sheet).
 *   3. Lovable connector gateway (only inside *.lovable.app runtime).
 */

const NOTIFY_EMAIL = "dhruvozone38@gmail.com";
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

// --- Transport 1: FormSubmit.co (default, no setup) ------------------------

async function submitViaFormSubmit(data: Lead, timestamp: string) {
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
  const res = await fetch(FORMSUBMIT_ENDPOINT, {
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
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`FormSubmit failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
  // FormSubmit returns `{ success: "true" }` on success and `{ success: "false", message }` on first call (activation).
  // We treat the activation response as success since the lead is queued and Dhruv just needs to confirm once.
  if (json && json.success === false) {
    throw new Error("FormSubmit rejected the submission");
  }
}

// --- Transport 2: Google Apps Script (optional override) -------------------

async function submitViaAppsScript(appsScriptUrl: string, data: Lead, timestamp: string) {
  const res = await fetch(appsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ timestamp, notifyEmail: NOTIFY_EMAIL, ...data }),
    redirect: "follow",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Apps Script failed (${res.status}): ${body.slice(0, 300)}`);
  }
}

// --- Transport 3: Lovable Connector Gateway (Lovable-only fallback) --------

async function appendToSheetViaGateway(row: string[]) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey || !sheetsKey) throw new Error("Missing Lovable gateway secrets");

  const url = `${GATEWAY}/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_RANGE}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetsKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets append failed (${res.status}): ${body}`);
  }
}

async function submitViaPublishedLovableEndpoint(data: Lead) {
  const res = await fetch(PUBLISHED_LOVABLE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-GrowthOps-Remote-Bridge": "1",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Published Lovable endpoint failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!json.ok) {
    throw new Error(json.error || "Published Lovable endpoint rejected the submission");
  }
}

// --- Route -----------------------------------------------------------------

export const Route = createFileRoute("/api/consultation-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const json = await request.json().catch(() => null);
          const parsed = LeadSchema.safeParse(json);
          if (!parsed.success) {
            return Response.json(
              { ok: false, error: "Invalid form submission", details: parsed.error.flatten() },
              { status: 400 },
            );
          }
          const data = parsed.data;
          const timestamp = new Date().toISOString();
          const appsScriptUrl = process.env.APPS_SCRIPT_URL;
          const requestHost = new URL(request.url).host;
          const isLovableHost = requestHost.endsWith("lovable.app");
          const isRemoteBridge = request.headers.get("X-GrowthOps-Remote-Bridge") === "1";

          // Sheet-write transports (first success wins).
          const sheetAttempts: Array<{ name: string; fn: () => Promise<void> }> = [];
          if (process.env.LOVABLE_API_KEY && process.env.GOOGLE_SHEETS_API_KEY) {
            sheetAttempts.push({
              name: "LovableGateway",
              fn: () =>
                appendToSheetViaGateway([
                  timestamp,
                  data.fullName,
                  data.companyName,
                  data.email,
                  data.phone,
                  data.website,
                  data.crmUsed,
                  data.requirements,
                  data.preferredMeetingTime,
                  data.leadSource,
                  data.engagementType,
                  data.companySize,
                ]),
            });
          }

          // Email-notify transports (first success wins). Apps Script writes
          // the sheet AND emails Dhruv in one call, so it counts for both.
          const emailAttempts: Array<{ name: string; fn: () => Promise<void> }> = [];
          if (appsScriptUrl) {
            emailAttempts.push({
              name: "AppsScript",
              fn: () => submitViaAppsScript(appsScriptUrl, data, timestamp),
            });
          }
          emailAttempts.push({
            name: "FormSubmit",
            fn: () => submitViaFormSubmit(data, timestamp),
          });

          const bridgeAttempt =
            !isLovableHost && !isRemoteBridge
              ? { name: "PublishedLovable", fn: () => submitViaPublishedLovableEndpoint(data) }
              : null;

          const errors: string[] = [];
          let sheetDelivered = false;
          let emailDelivered = false;

          for (const attempt of sheetAttempts) {
            try {
              await attempt.fn();
              sheetDelivered = true;
              break;
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              console.error(`[consultation-lead] ${attempt.name} transport failed:`, msg);
              errors.push(`${attempt.name}: ${msg}`);
            }
          }

          for (const attempt of emailAttempts) {
            try {
              await attempt.fn();
              emailDelivered = true;
              if (attempt.name === "AppsScript") sheetDelivered = true;
              break;
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              console.error(`[consultation-lead] ${attempt.name} transport failed:`, msg);
              errors.push(`${attempt.name}: ${msg}`);
            }
          }

          if (!sheetDelivered && !emailDelivered && bridgeAttempt) {
            try {
              await bridgeAttempt.fn();
              sheetDelivered = true;
              emailDelivered = true;
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              console.error(`[consultation-lead] ${bridgeAttempt.name} transport failed:`, msg);
              errors.push(`${bridgeAttempt.name}: ${msg}`);
            }
          }

          if (!sheetDelivered && !emailDelivered) {
            throw new Error(`All transports failed. ${errors.join(" | ")}`);
          }

          return Response.json({ ok: true });
        } catch (err) {
          const detail = err instanceof Error ? err.message : String(err);
          console.error("Consultation lead error:", detail);
          return Response.json(
            {
              ok: false,
              error:
                "We couldn't save your request right now. Please email dhruv.kaushik866@gmail.com or try again in a moment.",
              detail,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});

/* ---------------------------------------------------------------------------
 * GOOGLE APPS SCRIPT SNIPPET — paste into Extensions → Apps Script on the
 * target spreadsheet, save, and deploy as a Web App ("Anyone" access).
 * Then set APPS_SCRIPT_URL in your Vercel env to the deployed /exec URL.
 *
 *   const SHEET_NAME = 'Sheet1';
 *
 *   function doPost(e) {
 *     try {
 *       const data = JSON.parse(e.postData.contents);
 *       const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
 *       sheet.appendRow([
 *         data.timestamp || new Date().toISOString(),
 *         data.fullName || '',
 *         data.companyName || '',
 *         data.email || '',
 *         data.phone || '',
 *         data.website || '',
 *         data.crmUsed || '',
 *         data.requirements || '',
 *         data.preferredMeetingTime || '',
 *         data.leadSource || 'Website Contact Form',
 *         data.engagementType || '',
 *         data.companySize || '',
 *       ]);
 *
 *       if (data.notifyEmail) {
 *         const subject = 'New CRM Consultation Request - ' + (data.fullName || 'Unknown');
 *         const body =
 *           'A new consultation request has been submitted.\n\n' +
 *           'Name: '            + (data.fullName || '—') + '\n' +
 *           'Company: '         + (data.companyName || '—') + '\n' +
 *           'Company Size: '    + (data.companySize || '—') + '\n' +
 *           'Email: '           + (data.email || '—') + '\n' +
 *           'Phone: '           + (data.phone || '—') + '\n' +
 *           'Website: '         + (data.website || '—') + '\n' +
 *           'Engagement Type: ' + (data.engagementType || '—') + '\n' +
 *           'Current CRM: '     + (data.crmUsed || '—') + '\n' +
 *           'Preferred Time: '  + (data.preferredMeetingTime || '—') + '\n\n' +
 *           'Requirements:\n'   + (data.requirements || '') + '\n\n' +
 *           'Submitted At: '    + (data.timestamp || '');
 *         MailApp.sendEmail({
 *           to: data.notifyEmail,
 *           replyTo: data.email || undefined,
 *           subject: subject,
 *           body: body,
 *         });
 *       }
 *
 *       return ContentService
 *         .createTextOutput(JSON.stringify({ ok: true }))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     } catch (err) {
 *       return ContentService
 *         .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
 *         .setMimeType(ContentService.MimeType.JSON);
 *     }
 *   }
 * ------------------------------------------------------------------------ */
