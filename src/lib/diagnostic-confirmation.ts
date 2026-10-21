export const DIAGNOSTIC_ENGAGEMENT = "CRM Revenue Diagnostic";
export const DIAGNOSTIC_CONFIRMATION_SUBJECT = "We've Received Your CRM Revenue Diagnostic Request";

const intro = "Thank you for choosing GrowthOpsCo for your CRM Revenue Diagnostic. Your request has been successfully received.";
const review = "I'll review the information you've provided and reach out shortly to coordinate a suitable consultation time and outline the next steps.";
const steps = [
  { title: "Request Review", body: "I'll review your submitted details to understand your business and CRM requirements." },
  { title: "Consultation Scheduling", body: "We'll coordinate a suitable time for your diagnostic session and confirm the arrangements." },
  { title: "Diagnostic Report", body: "You'll receive your report within one business day after the consultation, provided all necessary information has been received." },
] as const;
const closing = "I look forward to learning more about your business and identifying opportunities to improve your CRM processes, sales operations, and automation workflows.";

/** Email clients don't load app CSS; these semantic tokens are inlined below. */
const emailTheme = {
  background: "#f5f7f6", surface: "#ffffff", text: "#202926",
  muted: "#56635d", accent: "#247455", border: "#dce5df",
} as const;

export function diagnosticGreeting(fullName?: string | null) {
  const name = fullName?.trim();
  if (!name || name.length > 120 || /[\r\n\u0000-\u001f\u007f]/u.test(name)) return "Hello,";
  const firstName = name.split(/\s+/u)[0];
  if (!firstName || !/^[\p{L}\p{M}][\p{L}\p{M}'’.-]*$/u.test(firstName)) return "Hello,";
  return `Hi ${firstName},`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

/** Only diagnostic enquiries get a prospect confirmation; contact enquiries do not. */
export function needsDiagnosticConfirmation(engagementType: string | undefined) {
  return engagementType === DIAGNOSTIC_ENGAGEMENT;
}

export function diagnosticConfirmationBody(fullName?: string | null) {
  return [
    diagnosticGreeting(fullName), "", intro, "", review, "",
    "What happens next?", "",
    ...steps.flatMap((step, i) => [`${i + 1}. ${step.title}`, step.body, ""]),
    closing, "", "Best regards,", "Dhruv Kaushik", "GrowthOpsCo",
    "Revenue Operations & CRM Automation Consulting",
  ].join("\n");
}

export function diagnosticConfirmationHtml(fullName?: string | null) {
  const t = emailTheme;
  const paragraph = `margin:0 0 22px;font-size:16px;line-height:26px;color:${t.text};overflow-wrap:anywhere;`;
  return `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(DIAGNOSTIC_CONFIRMATION_SUBJECT)}</title></head>
<body style="margin:0;padding:0;background-color:${t.background};color:${t.text};font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${t.background};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:${t.surface};"><tr><td style="padding:28px 24px;border-top:3px solid ${t.accent};">
<p style="margin:0 0 28px;font-size:20px;line-height:28px;font-weight:bold;color:${t.accent};">GrowthOpsCo</p>
<p style="${paragraph}">${escapeHtml(diagnosticGreeting(fullName))}</p>
<p style="${paragraph}">${escapeHtml(intro)}</p>
<p style="${paragraph}">${escapeHtml(review)}</p>
<h1 style="margin:28px 0 8px;font-size:20px;line-height:28px;color:${t.accent};">What happens next?</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps.map((step, i) => `<tr><td style="padding:16px 0;border-bottom:1px solid ${t.border};"><h2 style="margin:0 0 6px;font-size:16px;line-height:24px;color:${t.text};">${i + 1}. ${escapeHtml(step.title)}</h2><p style="margin:0;font-size:16px;line-height:26px;color:${t.muted};">${escapeHtml(step.body)}</p></td></tr>`).join("")}</table>
<p style="${paragraph}margin-top:26px;">${escapeHtml(closing)}</p>
<p style="margin:28px 0 0;font-size:16px;line-height:26px;color:${t.text};">Best regards,<br><strong>Dhruv Kaushik</strong><br>GrowthOpsCo<br><span style="font-size:14px;color:${t.muted};">Revenue Operations &amp; CRM Automation Consulting</span></p>
</td></tr></table></td></tr></table></body></html>`;
}

/** Pure MIME construction: the existing route still owns validation and delivery. */
export function diagnosticConfirmationMessage(email: string, fullName: string, replyTo: string) {
  if ([email, replyTo].some((value) => /[\r\n]/u.test(value))) throw new Error("Invalid email header");
  const boundary = `growthops_diagnostic_${crypto.randomUUID()}`;
  const encoded = (value: string) => {
    const bytes = new TextEncoder().encode(value);
    const base64 = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
    return base64.match(/.{1,76}/g)?.join("\r\n") ?? "";
  };
  return [
    `To: ${email}`, `Reply-To: ${replyTo}`, `Subject: ${DIAGNOSTIC_CONFIRMATION_SUBJECT}`,
    "MIME-Version: 1.0", `Content-Type: multipart/alternative; boundary="${boundary}"`, "",
    `--${boundary}`, 'Content-Type: text/plain; charset="UTF-8"', "Content-Transfer-Encoding: base64", "",
    encoded(diagnosticConfirmationBody(fullName)),
    `--${boundary}`, 'Content-Type: text/html; charset="UTF-8"', "Content-Transfer-Encoding: base64", "",
    encoded(diagnosticConfirmationHtml(fullName)), `--${boundary}--`, "",
  ].join("\r\n");
}
