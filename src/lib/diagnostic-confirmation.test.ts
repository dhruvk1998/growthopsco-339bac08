import { describe, expect, it } from "vitest";
import { diagnosticConfirmationMessage, diagnosticGreeting, needsDiagnosticConfirmation } from "./diagnostic-confirmation";

describe("diagnostic confirmation email", () => {
  it("is sent only for diagnostic enquiries", () => {
    expect(needsDiagnosticConfirmation("CRM Revenue Diagnostic")).toBe(true);
    expect(needsDiagnosticConfirmation("Consultation")).toBe(false);
    expect(needsDiagnosticConfirmation(undefined)).toBe(false);
  });
  it("personalizes with only the captured first name, including Unicode", () => {
    expect(diagnosticGreeting("  Sam Patel  ")).toBe("Hi Sam,");
    expect(diagnosticGreeting("Élodie Martin")).toBe("Hi Élodie,");
    expect(diagnosticGreeting("O'Neil Smith")).toBe("Hi O'Neil,");
  });
  it("uses a safe fallback for missing or invalid names", () => {
    for (const value of [undefined, null, "", "  ", "<script>alert(1)</script>", "Sam\r\nBcc: other@example.com", "123"]) {
      expect(diagnosticGreeting(value)).toBe("Hello,");
    }
  });
  it("preserves recipient and reply-to with independently decodable UTF-8 alternatives", () => {
    const raw = diagnosticConfirmationMessage("customer@example.com", "Élodie Martin", "dhruvozone38@gmail.com");
    expect(raw.split("\r\n")[0]).toBe("To: customer@example.com");
    expect(raw.split("\r\n")[1]).toBe("Reply-To: dhruvozone38@gmail.com");
    const boundary = raw.match(/boundary="([^"]+)"/)?.[1];
    expect(boundary).toBeTruthy();
    const parts = raw.split(`--${boundary}`).slice(1, 3);
    expect(parts).toHaveLength(2);
    const decoded = parts.map((part) => {
      const separator = part.indexOf("\r\n\r\n");
      return Buffer.from(part.slice(separator + 4).trim(), "base64").toString("utf8");
    });
    expect(decoded[0]).toContain("Hi Élodie,");
    expect(decoded[1]).toContain("Hi Élodie,");
    expect(raw.endsWith(`--${boundary}--\r\n`)).toBe(true);
  });
  it("rejects header injection instead of redirecting the email", () => {
    expect(() => diagnosticConfirmationMessage("customer@example.com\r\nBcc: attacker@example.com", "Sam", "owner@example.com")).toThrow("Invalid email header");
    expect(() => diagnosticConfirmationMessage("customer@example.com", "Sam", "owner@example.com\nBcc: attacker@example.com")).toThrow("Invalid email header");
  });
});
