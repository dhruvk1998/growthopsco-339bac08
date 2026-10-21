import { z } from "zod";
import { DiagnosticSchema, DIAGNOSTIC_FEE, type DiagnosticRequest } from "./diagnostic";

export const ENQUIRY_ENDPOINT = "/api/consultation-lead";
export const DIAGNOSTIC_ENQUIRY = "CRM Revenue Diagnostic";

function requirements(d: DiagnosticRequest) {
  return [
    DIAGNOSTIC_ENQUIRY,
    "",
    "Main CRM or Revenue Challenge:",
    d.challenge,
    "",
    `Areas for Improvement: ${d.improvementAreas.join(", ") || "—"}`,
    `Fee Acknowledged (${DIAGNOSTIC_FEE}): Yes`,
    "Appointment and payment to be confirmed manually.",
  ].join("\n");
}

/** Preserve all text; reject oversized enquiries rather than silently truncating them. */
export const DiagnosticContactSchema = DiagnosticSchema.extend({
  phone: z.string().trim().max(40).default(""),
}).superRefine((d, context) => {
  if (requirements(d).length > 4000) context.addIssue({
    code: "custom", path: ["challenge"],
    message: "Please shorten your challenge slightly so your complete diagnostic enquiry fits in the form.",
  });
});

export function toContactEnquiry(raw: unknown, assessment?: unknown, honeypot = "") {
  const d = DiagnosticContactSchema.parse(raw);
  return {
    fullName: d.fullName, companyName: d.companyName, email: d.email,
    phone: d.phone, website: d.website, crmUsed: d.currentCrm,
    companySize: d.companySize, preferredMeetingTime: d.preferredMeetingTime,
    requirements: requirements(d), engagementType: DIAGNOSTIC_ENQUIRY,
    leadSource: assessment ? "Website CRM Revenue Diagnostic (CRM Health Check)" : "Website CRM Revenue Diagnostic",
    assessment, _honeypot: honeypot,
  };
}