import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({ createFileRoute: () => (options: unknown) => options }));
import { handleConsultationRequest } from "../routes/api/consultation-lead";
import { handleDiagnosticRequest } from "../routes/api/diagnostic-request";
import { deliveryResult } from "./form-delivery";
import { toContactEnquiry } from "./diagnostic-contact";

const diagnostic = { fullName: "Mock Customer", email: "prospect@example.com", companyName: "Mock Company", currentCrm: "HubSpot", companySize: "11–50", challenge: "Follow-up", improvementAreas: ["Automation"], preferredMeetingTime: "Morning PT", feeAcknowledged: true };
const contact = { fullName: "Mock Customer", email: "prospect@example.com", requirements: "Follow-up", engagementType: "CRM Audit" };
const request = (body: unknown, host = "growthopsco.lovable.app", bridge = false) => new Request(`https://${host}/api/consultation-lead`, {
  method: "POST", headers: { "Content-Type": "application/json", ...(bridge ? { "X-GrowthOps-Remote-Bridge": "1" } : {}) }, body: JSON.stringify(body),
});

describe("active handlers with no real provider access", () => {
  let fetcher: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    // Literal mock credentials only. Never use installed secrets in test requests.
    vi.stubEnv("LOVABLE_API_KEY", "mock-only"); vi.stubEnv("GOOGLE_MAIL_API_KEY", "mock-only"); vi.stubEnv("GOOGLE_SHEETS_API_KEY", "mock-only");
    vi.stubEnv("OWNER_NOTIFICATION_EMAIL", "dhruv.growthops@gmail.com");
    fetcher = vi.fn(async (url: string) => url.includes("google_sheets") ? Response.json({ updates: { updatedRows: 1 } }) : Response.json({ id: "mock-message" }));
    vi.stubGlobal("fetch", fetcher);
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it.each([false, true])("persists to the correct existing worksheet and notifies the owner diagnostic=%s", async (isDiagnostic) => {
    const result = await handleConsultationRequest(request(isDiagnostic ? toContactEnquiry(diagnostic) : contact), false);
    expect(await result.json()).toEqual(deliveryResult("saved", "accepted", isDiagnostic ? "accepted" : "not_required"));
    const calls = fetcher.mock.calls as unknown as [string, RequestInit][];
    expect(calls[0][0]).toContain(isDiagnostic ? "'Diagnostic Requests'!A:N" : "Database!A:L");
    expect(calls.length).toBe(isDiagnostic ? 3 : 2);
    const raw = JSON.parse(calls[1][1].body as string).raw;
    const decoded = new TextDecoder().decode(Uint8Array.from(atob(raw.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0)));
    expect(decoded).toContain("To: dhruv.growthops@gmail.com");
    expect(decoded).toContain("Reply-To: prospect@example.com");
    expect(decoded).not.toContain("From:");
  });
  it("reports missing diagnostic mail configuration without FormSubmit or Apps Script fallback", async () => {
    vi.stubEnv("GOOGLE_MAIL_API_KEY", "");
    expect(await (await handleConsultationRequest(request(toContactEnquiry(diagnostic)), false)).json()).toEqual(deliveryResult("saved", "not_configured", "not_configured"));
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each([1, 2])("returns partial and does not fallback when diagnostic email attempt %s fails", async (which) => {
    fetcher.mockImplementation(async (url: string) => {
      const index = fetcher.mock.calls.length - 1;
      if (url.includes("google_sheets")) return Response.json({ updates: { updatedRows: 1 } });
      return index === which ? new Response("private failure body", { status: 403 }) : Response.json({ id: "mock-message" });
    });
    const result = await (await handleConsultationRequest(request(toContactEnquiry(diagnostic)), false)).json();
    expect(result.persistence).toBe("saved"); expect(result.status).toBe("partial"); expect(result.ok).toBe(false);
    expect(result.notifications[which === 1 ? "owner" : "prospect"]).toBe("failed");
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(JSON.stringify(result)).not.toContain("private failure body");
  });
  it("keeps a contact request saved when Gmail fails without invoking legacy write/send fallback", async () => {
    fetcher.mockImplementation(async (url: string) => url.includes("google_sheets") ? Response.json({ updates: { updatedRows: 1 } }) : new Response("failed", { status: 403 }));
    expect(await (await handleConsultationRequest(request(contact), false)).json()).toEqual(deliveryResult("saved", "failed", "not_required"));
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("sends nothing when sheet persistence is rejected", async () => {
    fetcher.mockResolvedValue(new Response("private sheet error", { status: 400 }));
    expect(await (await handleConsultationRequest(request(toContactEnquiry(diagnostic)), false)).json()).toEqual(deliveryResult("failed", "not_attempted", "not_attempted"));
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("delegates Vercel before any local side effects and preserves partial bridge results", async () => {
    vi.stubEnv("GOOGLE_SHEETS_API_KEY", "");
    const partial = deliveryResult("saved", "failed", "accepted");
    fetcher.mockResolvedValue(Response.json(partial));
    expect(await (await handleConsultationRequest(request(toContactEnquiry(diagnostic), "growthopsco.vercel.app"), false)).json()).toEqual(partial);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe("https://growthopsco.lovable.app/api/consultation-lead");
  });
  it("does not resend after a lost or malformed bridge result", async () => {
    vi.stubEnv("GOOGLE_SHEETS_API_KEY", ""); fetcher.mockResolvedValue(new Response("<html>not found</html>", { status: 404 }));
    expect((await (await handleConsultationRequest(request(contact, "growthopsco.vercel.app"), false)).json()).status).toBe("unknown");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("fails closed without Sheets configuration on bridge destination", async () => {
    vi.stubEnv("GOOGLE_SHEETS_API_KEY", "");
    expect((await (await handleConsultationRequest(request(contact, "growthopsco.lovable.app", true), false)).json()).persistence).toBe("not_configured");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([false, true])("blocks hosted previews for both endpoints compatibility=%s", async (compatibility) => {
    const response = compatibility ? await handleDiagnosticRequest(request(diagnostic, "id-preview--mock.lovable.app"), false) : await handleConsultationRequest(request(contact, "id-preview--mock.lovable.app"), false);
    expect(response.status).toBe(403); expect(fetcher).not.toHaveBeenCalled();
  });
  it("preserves honeypot and validation without any external actions", async () => {
    expect((await handleConsultationRequest(request({}), false)).status).toBe(400);
    expect((await (await handleConsultationRequest(request({ _honeypot: "bot" }), false)).json()).ok).toBe(true);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([false, true])("uses the same authenticated Gmail confirmation with correct reply address compatibility=%s", async (compatibility) => {
    vi.stubEnv("OWNER_NOTIFICATION_EMAIL", "team@example.com");
    const response = compatibility
      ? await handleDiagnosticRequest(request(diagnostic), false)
      : await handleConsultationRequest(request(toContactEnquiry(diagnostic)), false);
    expect(await response.json()).toEqual(deliveryResult("saved", "accepted", "accepted"));
    const calls = fetcher.mock.calls as unknown as [string, RequestInit][];
    expect(calls).toHaveLength(3);
    const [url, init] = calls[2];
    expect(url).toBe("https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Authorization: "Bearer mock-only", "X-Connection-Api-Key": "mock-only" });
    const { raw } = JSON.parse(init.body as string);
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    const headers = decoded.slice(0, decoded.indexOf("\r\n\r\n"));
    expect(headers).toContain("To: prospect@example.com\r\nReply-To: team@example.com\r\n");
    expect(headers).toContain("Content-Type: multipart/alternative;");
    expect(headers).not.toMatch(/^(From|Sender|Return-Path|Bcc|Cc):/im);
  });
  it.each([false, true])("does not retry uncertain customer confirmations compatibility=%s", async (compatibility) => {
    fetcher.mockImplementation(async (url: string) => {
      if (url.includes("google_sheets")) return Response.json({ updates: { updatedRows: 1 } });
      if (fetcher.mock.calls.length === 3) throw new Error("Mock lost Gmail response");
      return Response.json({ id: "mock-owner-message" });
    });
    const response = compatibility
      ? await handleDiagnosticRequest(request(diagnostic), false)
      : await handleConsultationRequest(request(toContactEnquiry(diagnostic)), false);
    expect(await response.json()).toEqual(deliveryResult("saved", "accepted", "unknown"));
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
  it("does not count a malformed Gmail customer acknowledgment as accepted or resend it", async () => {
    fetcher.mockImplementation(async (url: string) => {
      if (url.includes("google_sheets")) return Response.json({ updates: { updatedRows: 1 } });
      return Response.json(fetcher.mock.calls.length === 3 ? { ok: true } : { id: "mock-owner-message" });
    });
    expect(await (await handleConsultationRequest(request(toContactEnquiry(diagnostic)), false)).json())
      .toEqual(deliveryResult("saved", "accepted", "unknown"));
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});