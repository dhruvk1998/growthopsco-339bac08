import { describe, expect, it } from "vitest";
import { DiagnosticContactSchema, ENQUIRY_ENDPOINT, toContactEnquiry } from "./diagnostic-contact";

const diagnostic = {
  fullName: "Preview Example", email: "preview@example.com", companyName: "Example Co",
  phone: "+1 555 0100", website: "https://example.com", currentCrm: "Pipedrive",
  companySize: "201–500", challenge: "Improve follow-up", improvementAreas: ["Automation", "Reporting and Dashboards"],
  preferredMeetingTime: "Tuesday mornings PT", feeAcknowledged: true,
};
describe("diagnostic enquiries through existing contact workflow", () => {
  it("uses the existing contact submission path", () => {
    expect(ENQUIRY_ENDPOINT).toBe("/api/consultation-lead");
  });
  it("retains customer and CRM fields in the contact contract", () => {
    const lead = toContactEnquiry(diagnostic);
    expect(lead).toMatchObject({fullName:"Preview Example",email:"preview@example.com",companyName:"Example Co",phone:"+1 555 0100",website:"https://example.com",crmUsed:"Pipedrive",companySize:"201–500",preferredMeetingTime:"Tuesday mornings PT",engagementType:"CRM Revenue Diagnostic",leadSource:"Website CRM Revenue Diagnostic"});
    expect(lead.requirements).toContain("Improve follow-up");
    expect(lead.requirements).toContain("Automation, Reporting and Dashboards");
  });
  it("preserves CA$199 acknowledgement and manual confirmation terms", () => {
    const lead = toContactEnquiry(diagnostic);
    expect(lead.requirements).toContain("Fee Acknowledged (CA$199): Yes");
    expect(lead.requirements).toContain("Appointment and payment to be confirmed manually.");
    expect(DiagnosticContactSchema.safeParse({...diagnostic,feeAcknowledged:false}).success).toBe(false);
  });
  it("retains assessment information and honeypot", () => {
    const assessment = {score:72,rating:"Moderate",summary:"Improve automation",answers:[]};
    expect(toContactEnquiry(diagnostic,assessment,"bot")).toMatchObject({assessment,_honeypot:"bot",leadSource:"Website CRM Revenue Diagnostic (CRM Health Check)"});
  });
  it("rejects oversized requirements rather than losing diagnostic details", () => {
    expect(DiagnosticContactSchema.safeParse({...diagnostic,challenge:"x".repeat(4000)}).success).toBe(false);
    expect(toContactEnquiry({...diagnostic,challenge:"x".repeat(3500)}).requirements.length).toBeLessThanOrEqual(4000);
  });
  it("keeps optional phone empty and limits it to the contact handler's 40 characters", () => {
    expect(toContactEnquiry({...diagnostic,phone:undefined}).phone).toBe("");
    expect(DiagnosticContactSchema.safeParse({...diagnostic,phone:"x".repeat(41)}).success).toBe(false);
  });
});