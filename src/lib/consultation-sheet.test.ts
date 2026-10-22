import { describe, expect, it } from "vitest";
import { consultationSheetEntry } from "./consultation-sheet";
import { toContactEnquiry } from "./diagnostic-contact";

const diagnostic = toContactEnquiry({
  fullName: "Test Person", email: "test@example.com", companyName: "Test Co",
  phone: "123456", website: "https://example.com", currentCrm: "HubSpot",
  companySize: "1–10", challenge: "First line\nSecond line",
  improvementAreas: ["Automation", "Data Quality"],
  preferredMeetingTime: "Monday afternoon", feeAcknowledged: true,
});

describe("consultation worksheet routing", () => {
  it("routes diagnostics into the existing Diagnostic Requests headers", () => {
    expect(consultationSheetEntry(diagnostic, "2026-10-22T00:01:00Z", "test-id")).toEqual({
      range: "'Diagnostic Requests'!A:N",
      row: ["test-id", "2026-10-22T00:01:00Z", "Test Person", "test@example.com",
        "Test Co", "https://example.com", "HubSpot", "1–10", "First line\nSecond line",
        "Automation, Data Quality", "Monday afternoon", "Yes", "New", "Phone: 123456"],
    });
  });
  it("keeps contact enquiries in Database with the original twelve columns", () => {
    const contact = { ...diagnostic, engagementType: "CRM Consulting", requirements: "Contact request" };
    expect(consultationSheetEntry(contact, "timestamp", "unused")).toEqual({
      range: "Database!A:L", row: ["timestamp", "Test Person", "Test Co", "test@example.com",
        "123456", "https://example.com", "HubSpot", "Contact request", "Monday afternoon",
        "Website CRM Revenue Diagnostic", "CRM Consulting", "1–10"],
    });
  });
  it("rejects unmappable diagnostics instead of falling back to Database", () => {
    expect(() => consultationSheetEntry({ ...diagnostic, requirements: "incomplete" }, "timestamp", "id")).toThrow("Invalid diagnostic field mapping");
  });
});