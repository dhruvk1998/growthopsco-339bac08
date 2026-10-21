import { z } from "zod";

/** Shared (browser + server) rules for the CRM Revenue Diagnostic request form. */

export const DIAGNOSTIC_FEE = "CA$199";
export const REPORT_DELIVERY =
  "Delivered within 1 business day after the consultation and receipt of all necessary information.";
export const DIAGNOSTIC_PATH = "/crm-revenue-diagnostic";

export const CRM_OPTIONS = [
  "HubSpot",
  "Salesforce",
  "Zoho CRM",
  "Pipedrive",
  "Microsoft Dynamics",
  "Other",
  "Not Using a CRM",
] as const;

export const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"] as const;

export const IMPROVEMENT_AREAS = [
  "Lead Management",
  "Automation",
  "Integrations",
  "Reporting and Dashboards",
  "Data Quality",
  "Other",
] as const;

export const DiagnosticSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your full name.").max(120),
  email: z.string().trim().min(1, "Please enter your business email.").email("Please enter a valid email address.").max(200),
  companyName: z.string().trim().min(1, "Please enter your company name.").max(200),
  website: z.string().trim().max(300).optional().default(""),
  currentCrm: z.enum(CRM_OPTIONS, { message: "Please select your current CRM." }),
  companySize: z.enum(COMPANY_SIZES, { message: "Please select your company size." }),
  challenge: z.string().trim().min(1, "Please describe your main challenge.").max(4000),
  improvementAreas: z.array(z.enum(IMPROVEMENT_AREAS)).max(IMPROVEMENT_AREAS.length).default([]),
  preferredMeetingTime: z.string().trim().min(1, "Please share a preferred meeting time.").max(200),
  feeAcknowledged: z.literal(true, { message: "Please confirm you understand the fee and request terms." }),
});

export type DiagnosticRequest = z.infer<typeof DiagnosticSchema>;

export const SHEET_HEADERS = [
  "Submission ID",
  "Submitted At",
  "Full Name",
  "Business Email",
  "Company Name",
  "Company Website",
  "Current CRM",
  "Company Size",
  "Main Challenge",
  "Improvement Areas",
  "Preferred Meeting Time",
  "Fee Acknowledged",
  "Status",
  "Internal Notes",
];

export function buildSheetRow(d: DiagnosticRequest, id: string, timestamp: string): string[] {
  return [
    id,
    timestamp,
    d.fullName,
    d.email,
    d.companyName,
    d.website,
    d.currentCrm,
    d.companySize,
    d.challenge,
    d.improvementAreas.join(", "),
    d.preferredMeetingTime,
    d.feeAcknowledged ? "Yes" : "No",
    "New",
    "",
  ];
}
