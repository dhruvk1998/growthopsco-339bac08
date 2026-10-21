import { describe, expect, it } from "vitest";
import { DiagnosticSchema, buildSheetRow } from "./diagnostic";

const valid = {
  fullName: "Test User",
  email: "test@example.com",
  companyName: "Acme",
  currentCrm: "HubSpot",
  companySize: "11–50",
  challenge: "Leads slip through",
  improvementAreas: ["Automation"],
  preferredMeetingTime: "Weekday mornings PT",
  feeAcknowledged: true,
};

describe("diagnostic request rules", () => {
  it("accepts a complete request", () => {
    expect(DiagnosticSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects a request without fee acknowledgement", () => {
    expect(DiagnosticSchema.safeParse({ ...valid, feeAcknowledged: false }).success).toBe(false);
  });
  it("rejects an invalid email", () => {
    expect(DiagnosticSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
  it("rejects a missing preferred meeting time", () => {
    expect(DiagnosticSchema.safeParse({ ...valid, preferredMeetingTime: " " }).success).toBe(false);
  });
  it("stores new requests with status New", () => {
    const d = DiagnosticSchema.parse(valid);
    expect(buildSheetRow(d, "id1", "t")[12]).toBe("New");
  });
});
