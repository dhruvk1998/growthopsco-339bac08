import { describe, expect, it, vi } from "vitest";
import {
  canonicalPayload,
  hashPayload,
  classifySendError,
  classifyEmailOutcomes,
  decideVerdict,
} from "./submission-integrity";
import { bridgeToPublished, BRIDGE_HEADER, PUBLISHED_DIAGNOSTIC_ENDPOINT } from "./diagnostic-bridge";

const payload = {
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

describe("payload hashing and key/payload binding", () => {
  it("produces the same hash regardless of key order (retry-safe)", async () => {
    const reordered = Object.fromEntries(Object.entries(payload).reverse());
    expect(await hashPayload(reordered)).toBe(await hashPayload(payload));
  });

  it("produces a different hash when any field changes (key/payload mismatch is detectable)", async () => {
    const tampered = { ...payload, email: "other@example.com" };
    expect(await hashPayload(tampered)).not.toBe(await hashPayload(payload));
  });

  it("canonical serialization sorts nested keys deterministically", () => {
    expect(canonicalPayload({ b: 1, a: { d: 2, c: 3 } })).toBe('{"a":{"c":3,"d":2},"b":1}');
  });
});

describe("email outcome classification", () => {
  it("treats a provider 4xx as a definitive failure", () => {
    expect(classifySendError(new Error("Gmail send failed (403)"))).toBe("failed");
  });

  it("treats 5xx and network errors as ambiguous, never as safe to resend", () => {
    expect(classifySendError(new Error("Gmail send failed (502)"))).toBe("unknown");
    expect(classifySendError(new Error("fetch failed"))).toBe("unknown");
  });

  it("maps settled results to per-recipient outcomes", () => {
    const outcomes = classifyEmailOutcomes([
      { status: "fulfilled", value: "ok" },
      { status: "rejected", reason: new Error("Gmail send failed (500)") },
    ]);
    expect(outcomes).toEqual({ owner: "sent", prospect: "unknown" });
  });
});

describe("processing verdict", () => {
  it("is complete only when the row is saved and both emails sent", () => {
    expect(decideVerdict(true, { owner: "sent", prospect: "sent" })).toEqual({ kind: "complete" });
  });

  it("never reports unconditional success when an email definitively failed", () => {
    expect(decideVerdict(true, { owner: "sent", prospect: "failed" })).toEqual({
      kind: "partial",
      failed: ["prospect"],
    });
  });

  it("flags ambiguous sends for reconciliation instead of blind resend", () => {
    expect(decideVerdict(true, { owner: "unknown", prospect: "sent" })).toEqual({
      kind: "ambiguous",
      unknown: ["owner"],
    });
  });

  it("reports unsaved when nothing was persisted", () => {
    expect(decideVerdict(false, { owner: "sent", prospect: "sent" })).toEqual({ kind: "unsaved" });
  });
});

describe("bridge forwarding", () => {
  it("forwards the body verbatim with the bridge header to the published endpoint", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: true, id: "x" }), { status: 200 }));
    const body = { ...payload, submissionKey: "key-123" };
    const result = await bridgeToPublished(body, fetchImpl);
    expect(result).toEqual({ ok: true, id: "x" });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(PUBLISHED_DIAGNOSTIC_ENDPOINT);
    expect((init.headers as Record<string, string>)[BRIDGE_HEADER]).toBe("1");
    expect(JSON.parse(init.body as string)).toEqual(body);
  });

  it("throws on a non-OK bridge response so the caller never claims success", async () => {
    const fetchImpl = vi.fn(async () => new Response("<html>not found</html>", { status: 404 }));
    await expect(bridgeToPublished(payload, fetchImpl)).rejects.toThrow("Bridge failed (404)");
  });

  it("throws when the bridge responds OK but ok:false", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: false }), { status: 200 }));
    await expect(bridgeToPublished(payload, fetchImpl)).rejects.toThrow();
  });
});
