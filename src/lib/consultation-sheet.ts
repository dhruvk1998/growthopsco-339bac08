import { DIAGNOSTIC_ENQUIRY } from "./diagnostic-contact";
import { DiagnosticSchema, buildSheetRow } from "./diagnostic";

export type SheetLead = {
  fullName: string; email: string; companyName: string; phone: string;
  website: string; crmUsed: string; requirements: string;
  preferredMeetingTime: string; leadSource: string; engagementType: string;
  companySize: string;
};

/** Read the existing diagnostic-to-contact contract without discarding its fields. */
export function consultationSheetEntry(data: SheetLead, timestamp: string, id: string) {
  if (data.engagementType !== DIAGNOSTIC_ENQUIRY) return {
    range: "Database!A:L",
    row: [timestamp, data.fullName, data.companyName, data.email, data.phone,
      data.website, data.crmUsed, data.requirements, data.preferredMeetingTime,
      data.leadSource, data.engagementType, data.companySize],
  };
  const match = /^CRM Revenue Diagnostic\n\nMain CRM or Revenue Challenge:\n([\s\S]*)\n\nAreas for Improvement: ([^\n]*)\nFee Acknowledged \(CA\$199\): Yes\nAppointment and payment to be confirmed manually\.$/.exec(data.requirements);
  if (!match) throw new Error("Invalid diagnostic field mapping");
  const diagnostic = DiagnosticSchema.parse({
    fullName: data.fullName, email: data.email, companyName: data.companyName,
    website: data.website, currentCrm: data.crmUsed, companySize: data.companySize,
    challenge: match[1], improvementAreas: match[2] === "—" ? [] : match[2].split(", "),
    preferredMeetingTime: data.preferredMeetingTime, feeAcknowledged: true,
  });
  const row = buildSheetRow(diagnostic, id, timestamp);
  row[13] = data.phone ? `Phone: ${data.phone}` : "";
  return { range: "'Diagnostic Requests'!A:N", row };
}