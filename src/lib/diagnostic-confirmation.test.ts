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
  it("leaves authenticated sender and authentication headers to Gmail", () => {
    const raw = diagnosticConfirmationMessage("customer@example.com", "Sam", "dhruv.growthops@gmail.com");
    const headers = raw.slice(0, raw.indexOf("\r\n\r\n"));
    expect(headers.match(/^To:/gm)).toHaveLength(1);
    expect(headers.match(/^Reply-To:/gm)).toHaveLength(1);
    expect(headers).toContain("Reply-To: dhruv.growthops@gmail.com");
    expect(headers).not.toMatch(/^(From|Sender|Return-Path|Authentication-Results|DKIM-Signature|Bcc|Cc):/im);
    expect(headers).toContain("MIME-Version: 1.0");
  });
  it("encodes both UTF-8 alternatives as bounded MIME lines without exposing unsafe names", () => {
    const raw = diagnosticConfirmationMessage("customer@example.com", "<script>unsafe</script>", "owner@example.com");
    const boundary = raw.match(/boundary="([^"]+)"/)?.[1];
    if (!boundary) throw new Error("Missing MIME boundary");
    const parts = raw.split(`--${boundary}`).slice(1, 3);
    expect(parts).toHaveLength(2);
    for (const [index, part] of parts.entries()) {
      const separator = part.indexOf("\r\n\r\n");
      expect(separator).toBeGreaterThan(0);
      expect(part.slice(0, separator)).toContain(`Content-Type: text/${index === 0 ? "plain" : "html"}; charset="UTF-8"`);
      expect(part.slice(0, separator)).toContain("Content-Transfer-Encoding: base64");
      const encoded = part.slice(separator + 4).trim();
      for (const line of encoded.split("\r\n")) {
        expect(line.length).toBeLessThanOrEqual(76);
        expect(line).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
      }
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      expect(decoded).not.toContain("<script>");
      expect(decoded).not.toContain("unsafe");
      expect(decoded).not.toContain("\ufffd");
    }
    expect(raw.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
  });
});
