import { createFileRoute } from "@tanstack/react-router";
import { DiagnosticSchema, SHEET_HEADERS, buildSheetRow, DIAGNOSTIC_FEE, REPORT_DELIVERY, type DiagnosticRequest } from "@/lib/diagnostic";
import { bridgeToPublished } from "@/lib/diagnostic-bridge";

/**
 * CRM Revenue Diagnostic request endpoint. Mirrors /api/consultation-lead:
 * Google Sheets + Gmail via the Lovable connector gateway, with a bridge to the
 * published Lovable endpoint when running on hosts without those secrets (Vercel).
 * Success is returned only once the request is stored in the sheet.
 */

const NOTIFY_EMAIL = "dhruvozone38@gmail.com";
const SPREADSHEET_ID = "1gR6UwaZ6zG2FmBVFBoKv9XbUcaqQC-k7pqsefQTC0c4";
const SHEET_NAME = "Diagnostic Requests";
const GATEWAY = "https://connector-gateway.lovable.dev";

function gatewayHeaders(connKey: string) {
  return {
    Authorization: `Bearer ${process.env.LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": connKey,
    "Content-Type": "application/json",
  };
}

async function ensureSheet(sheetsKey: string) {
  const base = `${GATEWAY}/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}`;
  const meta = await fetch(`${base}?fields=sheets.properties.title`, { headers: gatewayHeaders(sheetsKey) });
  if (!meta.ok) throw new Error(`Sheet metadata failed (${meta.status})`);
  const json = (await meta.json()) as { sheets?: { properties?: { title?: string } }[] };
  if (json.sheets?.some((s) => s.properties?.title === SHEET_NAME)) return;
  const add = await fetch(`${base}:batchUpdate`, {
    method: "POST",
    headers: gatewayHeaders(sheetsKey),
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }),
  });
  if (!add.ok) throw new Error(`Create worksheet failed (${add.status})`);
  await appendRow(sheetsKey, SHEET_HEADERS);
}

async function appendRow(sheetsKey: string, row: string[]) {
  const range = encodeURIComponent(`'${SHEET_NAME}'!A:N`);
  const url = `${GATEWAY}/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, { method: "POST", headers: gatewayHeaders(sheetsKey), body: JSON.stringify({ values: [row] }) });
  if (!res.ok) throw new Error(`Sheet append failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
}

function b64url(input: string) {
  return btoa(unescape(encodeURIComponent(input))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function encodeSubject(s: string) {
  return `=?UTF-8?B?${btoa(unescape(encodeURIComponent(s)))}?=`;
}

async function sendGmail(mailKey: string, to: string, subject: string, body: string, replyTo?: string) {
  const raw = [
    `To: ${to}`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    `Subject: ${encodeSubject(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "",
    body,
  ].join("\r\n");
  const res = await fetch(`${GATEWAY}/google_mail/gmail/v1/users/me/messages/send`, {
    method: "POST",
    headers: gatewayHeaders(mailKey),
    body: JSON.stringify({ raw: b64url(raw) }),
  });
  if (!res.ok) throw new Error(`Gmail send failed (${res.status})`);
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

const ERROR_MSG =
  "We couldn't submit your request right now. Your details are still in the form — please try again, or email dhruvozone38@gmail.com.";

export const Route = createFileRoute("/api/diagnostic-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        if (json && typeof json._honeypot === "string" && json._honeypot.length > 0) {
          return Response.json({ ok: true });
        }
        const parsed = DiagnosticSchema.safeParse(json);
        if (!parsed.success) {
          return Response.json({ ok: false, error: "Please check the highlighted fields.", details: parsed.error.flatten() }, { status: 400 });
        }
        const d = parsed.data;
        const sheetsKey = process.env.GOOGLE_SHEETS_API_KEY;
        const mailKey = process.env.GOOGLE_MAIL_API_KEY;
        const isBridge = request.headers.get("X-GrowthOps-Remote-Bridge") === "1";

        try {
          if (!process.env.LOVABLE_API_KEY || !sheetsKey) {
            if (isBridge) throw new Error("Sheets not configured on bridge host");
            const r = await bridgeToPublished(d);
            return Response.json({ ok: true, id: r.id });
          }
          const id = crypto.randomUUID();
          const ts = new Date().toISOString();
          await ensureSheet(sheetsKey);
          await appendRow(sheetsKey, buildSheetRow(d, id, ts));

          const emails: string[] = [];
          if (mailKey) {
            const results = await Promise.allSettled([
              sendGmail(mailKey, NOTIFY_EMAIL, `New CRM Revenue Diagnostic Request — ${d.fullName}`, ownerEmail(d, id, ts), d.email),
              sendGmail(mailKey, d.email, "Your CRM Revenue Diagnostic request has been received", prospectEmail(d)),
            ]);
            results.forEach((r, i) => {
              const name = i === 0 ? "owner" : "prospect";
              if (r.status === "fulfilled") emails.push(name);
              else console.error(`[diagnostic-request] ${name} email failed:`, r.reason instanceof Error ? r.reason.message : r.reason);
            });
          }
          return Response.json({ ok: true, id, emails });
        } catch (err) {
          console.error("[diagnostic-request] failed:", err instanceof Error ? err.message : String(err));
          return Response.json({ ok: false, error: ERROR_MSG }, { status: 500 });
        }
      },
    },
  },
});
