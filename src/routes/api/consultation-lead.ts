import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

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

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function base64UrlEncode(input: string) {
  // Encode UTF-8 safely
  const bytes = new TextEncoder().encode(input);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function appendToSheet(row: string[]) {
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

async function sendNotificationEmail(data: z.infer<typeof LeadSchema>, timestamp: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const mailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !mailKey) {
    // Email is best-effort — do not throw if Gmail isn't connected
    console.warn("Gmail connector not configured, skipping notification email");
    return;
  }

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

  // Encode subject (RFC 2047) to safely include non-ASCII or special chars
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
    // Do not throw — lead is already saved.
  }
}

// Silence unused import warning in case escapeHtml isn't used yet
void escapeHtml;

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

          await appendToSheet([
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

          // Best-effort notification email
          try {
            await sendNotificationEmail(data, timestamp);
          } catch (err) {
            console.error("Notification email error:", err);
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
