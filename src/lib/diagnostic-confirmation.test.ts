import { describe, expect, it } from "vitest";
import { diagnosticConfirmationBody, needsDiagnosticConfirmation } from "./diagnostic-confirmation";

describe("diagnostic confirmation email", () => {
  it("is sent only for diagnostic enquiries", () => {
    expect(needsDiagnosticConfirmation("CRM Revenue Diagnostic")).toBe(true);
    expect(needsDiagnosticConfirmation("Consultation")).toBe(false);
    expect(needsDiagnosticConfirmation(undefined)).toBe(false);
  });
  it("states the CA$199 fee and that nothing is confirmed yet", () => {
    const body = diagnosticConfirmationBody("Sam");
    expect(body).toContain("CA$199");
    expect(body).toContain("not yet confirmed");
  });
});
