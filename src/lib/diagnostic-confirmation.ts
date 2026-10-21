import { DIAGNOSTIC_FEE, REPORT_DELIVERY } from "./diagnostic";

export const DIAGNOSTIC_ENGAGEMENT = "CRM Revenue Diagnostic";
export const DIAGNOSTIC_CONFIRMATION_SUBJECT = "Your CRM Revenue Diagnostic request has been received";

/** Only diagnostic enquiries get a prospect confirmation; contact enquiries do not. */
export function needsDiagnosticConfirmation(engagementType: string | undefined) {
  return engagementType === DIAGNOSTIC_ENGAGEMENT;
}

export function diagnosticConfirmationBody(fullName: string) {
  return [
    `Hi ${fullName},`,
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
