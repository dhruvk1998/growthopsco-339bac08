import { describe, expect, it, vi } from "vitest";
import {
  submitToWriter,
  finalizeWriter,
  KeyPayloadMismatchError,
  type WriterSubmitRequest,
} from "./apps-script-writer";

const WRITER_URL = "https://script.google.com/macros/s/AKfyc_test/exec";

const baseReq: WriterSubmitRequest = {
  action: "submit",
  form: "diagnostic",
  key: "key-1",
  payloadHash: "hash-1",
  row: ["id1", "2026-10-21T22:00:00Z", "Test User"],
  emails: {
    owner: { to: "owner@example.com", subject: "s", body: "b" },
    prospect: { to: "prospect@example.com", subject: "s", body: "b" },
  },
};

/**
 * In-memory simulation of writer.gs semantics: a serialized lock around
 * claim + write, a persistent ledger, and one data append per key. Counts
 * data writes and email rounds so tests can assert exactly-once effects.
 */
function makeScriptSim(opts: { dieBeforeDataWrite?: boolean } = {}) {
  const ledger = new Map<string, { hash: string; status: string; owner: string; prospect: string }>();
  let dataWrites = 0;
  let emailRounds = 0;
  let queue: Promise<void> = Promise.resolve();

  const handler = async (_url: string, init?: RequestInit) => {
    const req = JSON.parse(init?.body as string);
    // Serialize like LockService.getScriptLock().
    const prev = queue;
    let release!: () => void;
    queue = new Promise<void>((r) => (release = r));
    await prev;
    try {
      if (req.action === "submit") {
        const existing = ledger.get(req.key);
        if (existing) {
          if (existing.hash !== req.payloadHash) {
            return new Response(JSON.stringify({ ok: false, error: "key_payload_mismatch" }), { status: 200 });
          }
          return new Response(
            JSON.stringify({ ok: true, key: req.key, duplicate: true, status: existing.status, emails: { owner: existing.owner, prospect: existing.prospect } }),
            { status: 200 },
          );
        }
        ledger.set(req.key, { hash: req.payloadHash, status: "claimed", owner: "na", prospect: "na" });
        if (opts.dieBeforeDataWrite) {
          return new Response(JSON.stringify({ ok: false, error: "Script timed out" }), { status: 500 });
        }
        dataWrites++;
        emailRounds++;
        ledger.set(req.key, { hash: req.payloadHash, status: "finalized", owner: "sent", prospect: "sent" });
        return new Response(
          JSON.stringify({ ok: true, key: req.key, duplicate: false, status: "finalized", emails: { owner: "sent", prospect: "sent" } }),
          { status: 200 },
        );
      }
      if (req.action === "finalize") {
        const existing = ledger.get(req.key);
        if (!existing) return new Response(JSON.stringify({ ok: false, error: "unknown_key" }), { status: 200 });
        if (existing.hash !== req.payloadHash) {
          return new Response(JSON.stringify({ ok: false, error: "key_payload_mismatch" }), { status: 200 });
        }
        existing.owner = req.emails.owner;
        existing.prospect = req.emails.prospect;
        existing.status = req.emails.owner === "unknown" || req.emails.prospect === "unknown" ? "ambiguous" : "finalized";
        return new Response(JSON.stringify({ ok: true, key: req.key, status: existing.status }), { status: 200 });
      }
      return new Response(JSON.stringify({ ok: false, error: "unknown_action" }), { status: 200 });
    } finally {
      release();
    }
  };

  return { handler: handler as unknown as typeof fetch, stats: () => ({ dataWrites, emailRounds, ledger }) };
}

describe("Apps Script writer client", () => {
  it("concurrent duplicate submissions produce exactly one data write and one email round", async () => {
    const sim = makeScriptSim();
    const results = await Promise.all([
      submitToWriter(WRITER_URL, baseReq, sim.handler),
      submitToWriter(WRITER_URL, baseReq, sim.handler),
      submitToWriter(WRITER_URL, baseReq, sim.handler),
    ]);
    expect(sim.stats().dataWrites).toBe(1);
    expect(sim.stats().emailRounds).toBe(1);
    expect(results.filter((r) => !r.duplicate)).toHaveLength(1);
    expect(results.filter((r) => r.duplicate)).toHaveLength(2);
    for (const r of results) expect(r.emails).toEqual({ owner: "sent", prospect: "sent" });
  });

  it("a retry after a lost response returns the recorded result without rewriting or resending", async () => {
    const sim = makeScriptSim();
    const first = await submitToWriter(WRITER_URL, baseReq, sim.handler);
    expect(first.duplicate).toBe(false);
    const retry = await submitToWriter(WRITER_URL, baseReq, sim.handler);
    expect(retry.duplicate).toBe(true);
    expect(retry.status).toBe("finalized");
    expect(sim.stats().dataWrites).toBe(1);
    expect(sim.stats().emailRounds).toBe(1);
  });

  it("rejects the same key with a different payload (key/payload mismatch)", async () => {
    const sim = makeScriptSim();
    await submitToWriter(WRITER_URL, baseReq, sim.handler);
    await expect(
      submitToWriter(WRITER_URL, { ...baseReq, payloadHash: "hash-2" }, sim.handler),
    ).rejects.toBeInstanceOf(KeyPayloadMismatchError);
    expect(sim.stats().dataWrites).toBe(1);
  });

  it("an interrupted write leaves a claimed entry for reconciliation, and a retry completes it once", async () => {
    const sim = makeScriptSim({ dieBeforeDataWrite: true });
    await expect(submitToWriter(WRITER_URL, baseReq, sim.handler)).rejects.toThrow("Writer unreachable (500)");
    expect(sim.stats().ledger.get("key-1")?.status).toBe("claimed");

    // Retry against a recovered writer: the claimed entry is found, hashes
    // match, and the recorded (still unwritten) result is returned — the
    // reconcile flow, not a blind resend, completes it.
    const recovered = makeScriptSim();
    recovered.stats().ledger.set("key-1", { hash: "hash-1", status: "claimed", owner: "na", prospect: "na" });
    const retry = await submitToWriter(WRITER_URL, baseReq, recovered.handler);
    expect(retry.duplicate).toBe(true);
    expect(retry.status).toBe("claimed");
    expect(recovered.stats().dataWrites).toBe(0);
    expect(recovered.stats().emailRounds).toBe(0);
  });

  it("finalize records ambiguous email outcomes without resending", async () => {
    const sim = makeScriptSim();
    await submitToWriter(WRITER_URL, baseReq, sim.handler);
    const res = await finalizeWriter(
      WRITER_URL,
      { action: "finalize", key: "key-1", payloadHash: "hash-1", emails: { owner: "sent", prospect: "unknown" } },
      sim.handler,
    );
    expect(res.status).toBe("ambiguous");
    expect(sim.stats().emailRounds).toBe(1); // no resend
  });

  it("finalize with a mismatched hash is rejected", async () => {
    const sim = makeScriptSim();
    await submitToWriter(WRITER_URL, baseReq, sim.handler);
    await expect(
      finalizeWriter(WRITER_URL, { action: "finalize", key: "key-1", payloadHash: "wrong", emails: { owner: "sent", prospect: "sent" } }, sim.handler),
    ).rejects.toBeInstanceOf(KeyPayloadMismatchError);
  });

  it("throws when the writer is unreachable so the handler fails instead of falling back to a direct write", async () => {
    const down = vi.fn(async () => new Response("Service Unavailable", { status: 503 }));
    await expect(submitToWriter(WRITER_URL, baseReq, down)).rejects.toThrow("Writer unreachable (503)");
  });

  it("sends the request as text/plain JSON to the writer URL", async () => {
    const sim = makeScriptSim();
    const spy = vi.fn(sim.handler);
    await submitToWriter(WRITER_URL, baseReq, spy);
    const [url, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(WRITER_URL);
    expect((init.headers as Record<string, string>)["Content-Type"]).toContain("text/plain");
    expect(JSON.parse(init.body as string).key).toBe("key-1");
  });
});
