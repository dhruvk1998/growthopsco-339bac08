import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Consultation lead submission endpoint.
 *
 * This route is environment-portable. It writes the lead to a Google Sheet
 * (and optionally sends an email notification) using ONE of two transports:
 *
 *  1. Google Apps Script Web App (PREFERRED — works on Vercel, Netlify, Lovable, anywhere)
 *     Set `APPS_SCRIPT_URL` (a deployed `doPost` web-app URL) in the host env.
 *     This is the same pattern that worked on Vercel before the redesign.
 *     The Apps Script owns the spreadsheet write + Gmail notification, so no
 *     Google Cloud project, service account, or OAuth setup is required.
 *
 *  2. Lovable Connector Gateway (fallback — only works inside Lovable runtime)
 *     Used automatically when running on *.lovable.app where
 *     `LOVABLE_API_KEY` + `GOOGLE_SHEETS_API_KEY` are auto-provisioned.
 *
 * Why both?
 *   - Vercel production has no Lovable secrets, so the gateway path 500s there.
 *   - The Apps Script path needs no platform-specific secrets and is the
 *     simplest production-ready fix.
 *
 * SETUP for Vercel (one-time, ~3 minutes):
 *   1. Open your Google Sheet (id `1gR6UwaZ6zG2FmBVFBoKv9XbUcaqQC-k7pqsefQTC0c4`).
 *   2. Extensions → Apps Script. Paste the snippet at the bottom of this file
 *      (also reproduced in the comment block below). Save.
 *   3. Deploy → New deployment → Type: Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the resulting `/exec` URL.
 *   4. In Vercel → Project Settings → Environment Variables, add:
 *        APPS_SCRIPT_URL = <the /exec URL>
 *      Redeploy.
 *
 * That's it. The form will write directly to the same Sheet and send the same
 * notification email from your own Google account.
 */

const SPREADSHEET_ID = "1gR6UwaZ6zG2FmBVFBoKv9XbUcaqQC-k7pqsefQTC0c4";
const SHEET_RANGE = "Sheet1!A:L";
const NOTIFY_EMAIL = "dhruvozone38@gmail.com";
const GATEWAY = "https://connector-gateway.lovable.dev";

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
});

type Lead = z.infer<typeof LeadSchema>;

function base64UrlEncode(input: string) {
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// --- Transport 1: Google Apps Script (Vercel-friendly) ---------------------

async function submitViaAppsScript(appsScriptUrl: string, data: Lead, timestamp: string) {
  // Use text/plain to dodge CORS preflight on the Apps Script side
  // (Apps Script web apps don't return CORS headers on OPTIONS).
  const res = await fetch(appsScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      timestamp,
      notifyEmail: NOTIFY_EMAIL,
      ...data,
    }),
    redirect: "follow",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Apps Script failed (${res.status}): ${body.slice(0, 500)}`);
  }
  // Apps Script returns JSON if our script does; tolerate non-JSON too.
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    if (j && j.ok === false) throw new Error(`Apps Script error: ${j.error || "unknown"}`);
  } catch {
    // non-JSON response is fine as long as status was 2xx
  }
}

// --- Transport 2: Lovable Connector Gateway (Lovable-only fallback) --------

async function appendToSheetViaGateway(row: string[]) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!lovableKey) throw new Error("Missing LOVABLE_API_KEY");
  if (!sheetsKey) throw new Error("Missing GOOGLE_SHEETS_API_KEY");

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

async function sendNotificationEmailViaGateway(data: Lead, timestamp: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const mailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !mailKey) return;

  const subject = `New CRM Consultation Request - ${data.fullName}`;
  const text = [
    "A new consultation request has been submitted.",
    "",
    `Name: ${data.fullName}`,
    `Company: ${data.companyName || "—"}`,
    `Company Size: ${data.companySize || "—"}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Website: ${data.website || "—"}`,
    `Engagement Type: ${data.engagementType || "—"}`,
    `Current CRM: ${data.crmUsed || "—"}`,
    `Preferred Meeting Time: ${data.preferredMeetingTime || "—"}`,
    "",
    "Requirements:",
    data.requirements,
    "",
    "Submitted At:",
    timestamp,
  ].join("\r\n");

  const encodedSubject = `=?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const rfc2822 = [
    `To: ${NOTIFY_EMAIL}`,
    `From: ${NOTIFY_EMAIL}`,
    `Reply-To: ${data.email}`,
    `Subject: ${encodedSubject}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "MIME-Version: 1.0",
    "",
    text,
  ].join("\r\n");

  const raw = base64UrlEncode(rfc2822);
  const res = await fetch(`${GATEWAY}/google_mail/gmail/v1/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": mailKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Gmail send failed (${res.status}): ${body}`);
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

          if (appsScriptUrl) {
            // Preferred path: works on Vercel + Lovable + anywhere.
            await submitViaAppsScript(appsScriptUrl, data, timestamp);
          } else if (process.env.LOVABLE_API_KEY && process.env.GOOGLE_SHEETS_API_KEY) {
            // Fallback for Lovable runtime where the gateway secrets exist.
            await appendToSheetViaGateway([
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
            ]);
            try {
              await sendNotificationEmailViaGateway(data, timestamp);
            } catch (err) {
              console.error("Notification email error:", err);
            }
          } else {
            throw new Error(
              "No submission transport configured. Set APPS_SCRIPT_URL (recommended for Vercel) " +
                "or run inside Lovable where LOVABLE_API_KEY + GOOGLE_SHEETS_API_KEY are provisioned.",
            );
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
