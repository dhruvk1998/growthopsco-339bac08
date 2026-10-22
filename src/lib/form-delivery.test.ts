import { describe, expect, it, vi } from "vitest";
import { DEFAULT_OWNER_EMAIL, DeliveryFailure, deliveryResult, formDeliveryView, ownerNotificationAddress, parseDeliveryResult, readDeliveryBridge, runFormDelivery } from "./form-delivery";
import { acknowledgedRequest } from "./delivery-provider";

describe("form delivery rules", () => {
  it("defaults owner notifications to the renamed account and validates overrides", () => {
    expect(DEFAULT_OWNER_EMAIL).toBe("dhruv.growthops@gmail.com");
    expect(ownerNotificationAddress()).toBe("dhruv.growthops@gmail.com");
    expect(ownerNotificationAddress("owner@example.com")).toBe("owner@example.com");
    expect(() => ownerNotificationAddress("owner@example.com\r\nBcc: attacker@example.com")).toThrow();
  });
  it("saves requests but reports missing mail configuration explicitly", async () => {
    expect(await runFormDelivery({ write: async () => {}, diagnostic: true })).toEqual(deliveryResult("saved", "not_configured", "not_configured"));
  });
  it.each(["owner", "prospect"] as const)("keeps persistence when %s notification fails", async (which) => {
    const fail = vi.fn().mockRejectedValue(new DeliveryFailure("failed", "Gmail", 403));
    const success = vi.fn().mockResolvedValue(undefined);
    const result = await runFormDelivery({ write: async () => {}, diagnostic: true, owner: which === "owner" ? fail : success, prospect: which === "prospect" ? fail : success });
    expect(result.ok).toBe(false); expect(result.status).toBe("partial"); expect(result.persistence).toBe("saved");
    expect(result.notifications[which]).toBe("failed"); expect(success).toHaveBeenCalledTimes(1); expect(fail).toHaveBeenCalledTimes(1);
  });
  it("reports complete only for saved requests and both accepted diagnostic emails", async () => {
    expect(await runFormDelivery({ write: async () => {}, owner: async () => {}, prospect: async () => {}, diagnostic: true })).toEqual(deliveryResult("saved", "accepted", "accepted"));
  });
  it("contact does not claim a prospect confirmation", async () => {
    const prospect = vi.fn();
    expect((await runFormDelivery({ write: async () => {}, owner: async () => {}, prospect, diagnostic: false })).notifications.prospect).toBe("not_required");
    expect(prospect).not.toHaveBeenCalled();
  });
  it.each(["failed", "unknown"] as const)("does not send after %s persistence", async (outcome) => {
    const owner = vi.fn(), prospect = vi.fn();
    expect((await runFormDelivery({ write: async () => { throw new DeliveryFailure(outcome, "Sheets"); }, owner, prospect, diagnostic: true })).persistence).toBe(outcome);
    expect(owner).not.toHaveBeenCalled(); expect(prospect).not.toHaveBeenCalled();
  });
  it("never retries an ambiguous mail attempt", async () => {
    const owner = vi.fn().mockRejectedValue(new Error("timeout"));
    const result = await runFormDelivery({ write: async () => {}, owner, diagnostic: false });
    expect(result.notifications.owner).toBe("unknown"); expect(owner).toHaveBeenCalledTimes(1);
  });
});

describe("provider acknowledgments", () => {
  it.each([false, "false", undefined])("does not treat FormSubmit success=%s as accepted", async (success) => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ success }));
    await expect(acknowledgedRequest("FormSubmit", "https://example.com", {}, fetcher)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each(["Gmail", "Sheets"] as const)("rejects %s bare success", async (service) => {
    await expect(acknowledgedRequest(service, "https://example.com", {}, vi.fn().mockResolvedValue(Response.json({ ok: true })))).rejects.toThrow();
  });
  it.each([400, 401, 403, 502])("exposes only safe status for provider %s", async (status) => {
    await expect(acknowledgedRequest("Gmail", "https://example.com", {}, vi.fn().mockResolvedValue(new Response("private provider body", { status })))).rejects.toThrow(`Gmail: ${status < 500 ? "failed" : "unknown"} (${status})`);
  });
});

describe("bridge contract", () => {
  it.each([null, { ok: true }, { ok: false }, { ...deliveryResult("saved", "failed", "accepted"), ok: true }])("rejects malformed or contradictory downstream result", async (body) => {
    expect((await readDeliveryBridge(Response.json(body))).status).toBe("unknown");
  });
  it("preserves downstream partial outcomes", async () => {
    const partial = deliveryResult("saved", "failed", "accepted");
    expect(await readDeliveryBridge(Response.json(partial))).toEqual(partial);
    expect(() => parseDeliveryResult({ ok: true })).toThrow();
  });
  it("never trusts a failed HTTP response claiming complete", async () => {
    expect((await readDeliveryBridge(Response.json(deliveryResult("saved", "accepted", "accepted"), { status: 500 }))).status).toBe("unknown");
    expect((await readDeliveryBridge(new Response("<html>404</html>", { status: 404 }))).status).toBe("unknown");
  });
});

describe.each([false, true])("UI outcomes diagnostic=%s", (diagnostic) => {
  it("allows complete state without implying inbox delivery", () => {
    expect(formDeliveryView(deliveryResult("saved", "accepted", diagnostic ? "accepted" : "not_required"), diagnostic)).toMatchObject({ state: "success", terminal: true });
  });
  it("makes saved-but-email-failed terminal to avoid duplicate resubmission", () => {
    expect(formDeliveryView(deliveryResult("saved", "failed", diagnostic ? "failed" : "not_required"), diagnostic)).toMatchObject({ state: "partial", terminal: true });
  });
  it("permits retry only after definitive failure", () => {
    expect(formDeliveryView(deliveryResult("failed", "not_attempted", diagnostic ? "not_attempted" : "not_required"), diagnostic)).toMatchObject({ state: "error", terminal: false });
    expect(formDeliveryView({ ok: true }, diagnostic)).toMatchObject({ state: "unknown", terminal: true });
  });
});