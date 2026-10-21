/**
 * Mechanism-agnostic helpers for duplicate/retry safety and partial-failure
 * handling. Pure functions only — no storage or network — so they can be
 * shared by the browser, the request handlers, and any future durable ledger
 * (Apps Script writer or database table) without change.
 */

export type EmailOutcome = "sent" | "failed" | "unknown";

export interface EmailOutcomes {
  owner: EmailOutcome;
  prospect: EmailOutcome;
}

/**
 * A provider 4xx means the send was definitively rejected (bad request,
 * scope, address). Anything else — 5xx, timeout, network reset — is
 * ambiguous: the provider may have accepted the message before the
 * connection failed. Ambiguous outcomes must be reconciled, never blindly
 * resent.
 */
export function classifySendError(err: unknown): Exclude<EmailOutcome, "sent"> {
  const msg = err instanceof Error ? err.message : String(err);
  const match = msg.match(/\((\d{3})\)/);
  if (match) {
    const code = Number(match[1]);
    return code >= 400 && code < 500 ? "failed" : "unknown";
  }
  return "unknown";
}

/** Map Promise.allSettled results ([owner, prospect]) to per-recipient outcomes. */
export function classifyEmailOutcomes(
  results: readonly [PromiseSettledResult<unknown>, PromiseSettledResult<unknown>],
): EmailOutcomes {
  const one = (r: PromiseSettledResult<unknown>): EmailOutcome =>
    r.status === "fulfilled" ? "sent" : classifySendError(r.reason);
  return { owner: one(results[0]), prospect: one(results[1]) };
}

/** Deterministic JSON: object keys sorted recursively so logically identical payloads serialize identically. */
export function canonicalPayload(data: Record<string, unknown>): string {
  const sort = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(sort)
      : v !== null && typeof v === "object"
        ? Object.fromEntries(
            Object.entries(v as Record<string, unknown>)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, val]) => [k, sort(val)]),
          )
        : v;
  return JSON.stringify(sort(data));
}

/**
 * SHA-256 of the canonical payload. A submission key is only valid for the
 * exact payload it was created with — a replay carrying the same key but a
 * different hash is a key/payload mismatch and must be rejected, not stored.
 */
export async function hashPayload(data: Record<string, unknown>): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalPayload(data));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export type ProcessingVerdict =
  | { kind: "complete" } // row saved, both emails sent
  | { kind: "partial"; failed: (keyof EmailOutcomes)[] } // row saved, some email definitively failed
  | { kind: "ambiguous"; unknown: (keyof EmailOutcomes)[] } // row saved, some email outcome unknown
  | { kind: "unsaved" }; // nothing persisted

/**
 * The handler must never report unconditional success when required
 * processing failed or is ambiguous. The row is always preserved; the
 * verdict tells the caller exactly what still needs follow-up.
 */
export function decideVerdict(saved: boolean, outcomes: EmailOutcomes): ProcessingVerdict {
  if (!saved) return { kind: "unsaved" };
  const keys = ["owner", "prospect"] as const;
  const unknown = keys.filter((k) => outcomes[k] === "unknown");
  if (unknown.length) return { kind: "ambiguous", unknown };
  const failed = keys.filter((k) => outcomes[k] === "failed");
  if (failed.length) return { kind: "partial", failed };
  return { kind: "complete" };
}
