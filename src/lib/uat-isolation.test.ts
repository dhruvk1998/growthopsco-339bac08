import { describe, expect, it, vi } from "vitest";
import { isolatedSubmission, submissionEnvironment, UAT_OWNER_EMAIL, UAT_SPREADSHEET_ID, UAT_RECIPIENT } from "./uat-isolation";

describe("UAT isolation", () => {
  it("keeps localhost development in UAT and blocks hosted previews", () => {
    expect(submissionEnvironment("http://localhost:8080/api/consultation-lead", true)).toBe("uat");
    expect(submissionEnvironment("https://id-preview--example.lovable.app/api/consultation-lead", false)).toBe("blocked-preview");
    expect(submissionEnvironment("https://growthopsco-test.vercel.app/api/consultation-lead", false)).toBe("blocked-preview");
    expect(submissionEnvironment("https://growthopsco.lovable.app/api/consultation-lead", false)).toBe("production");
    expect(submissionEnvironment("https://growthopsco.vercel.app/api/consultation-lead", false)).toBe("production");
  });
  it("uses separate storage and the authorized UAT owner, with sending paused", () => {
    expect(UAT_SPREADSHEET_ID).not.toBe("1gR6UwaZ6zG2FmBVFBoKv9XbUcaqQC-k7pqsefQTC0c4");
    expect(UAT_OWNER_EMAIL).toBe("dhruvozone38@gmail.com");
    expect(UAT_RECIPIENT).toBe("dhruvozone38@gmail.com");
  });
  it("performs no external action before recipient confirmation", async () => {
    const write = vi.fn(), notify = vi.fn();
    expect((await isolatedSubmission({ fullName: "UAT-Contact", email: "test@example.com" }, null, write, notify)).ok).toBe(false);
    expect(write).not.toHaveBeenCalled(); expect(notify).not.toHaveBeenCalled();
  });
  it("rejects unapproved addresses and unlabelled records without external actions", async () => {
    const write = vi.fn(), notify = vi.fn();
    await isolatedSubmission({ fullName: "UAT-Contact", email: "other@example.com" }, "test@example.com", write, notify);
    await isolatedSubmission({ fullName: "Customer", email: "test@example.com" }, "test@example.com", write, notify);
    expect(write).not.toHaveBeenCalled(); expect(notify).not.toHaveBeenCalled();
  });
  it("does not notify or report success when storage fails", async () => {
    const notify = vi.fn();
    await expect(isolatedSubmission({ fullName: "UAT-Contact", email: "test@example.com" }, "test@example.com", async () => { throw new Error("storage unavailable"); }, notify)).rejects.toThrow("storage unavailable");
    expect(notify).not.toHaveBeenCalled();
  });
  it("does not swallow email failures or invoke alternative transports", async () => {
    const write = vi.fn().mockResolvedValue(undefined), notify = vi.fn().mockRejectedValue(new Error("email unavailable"));
    await expect(isolatedSubmission({ fullName: "UAT-Contact", email: "test@example.com" }, "test@example.com", write, notify)).rejects.toThrow("email unavailable");
    expect(write).toHaveBeenCalledTimes(1); expect(notify).toHaveBeenCalledTimes(1);
  });
});