/** Offline browser preparation. Call after hydration only; active forms do not import this yet. */
export interface KeyStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export function canonicalWriterPayload(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonicalWriterPayload).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonicalWriterPayload((v as Record<string, unknown>)[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
export async function writerHash(payload: unknown): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalWriterPayload(payload)));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
export interface SubmissionIdentity { key: string; id: string; timestamp: string; businessHash: string }
export async function prepareStableSubmission(form: "contact" | "diagnostic", validatedPayload: unknown, storage: KeyStorage): Promise<SubmissionIdentity> {
  const businessHash = await writerHash(validatedPayload);
  const slot = `growthops-writer-v1-${form}`;
  const prior = storage.getItem(slot);
  if (prior) {
    const parsed: unknown = JSON.parse(prior);
    if (!parsed || typeof parsed !== "object" || !("key" in parsed) || !("id" in parsed) || !("timestamp" in parsed) || !("businessHash" in parsed) || typeof parsed.key !== "string" || typeof parsed.id !== "string" || typeof parsed.timestamp !== "string" || parsed.businessHash !== businessHash) throw new Error("Existing request must be reconciled before starting a changed request");
    return { key: parsed.key, id: parsed.id, timestamp: parsed.timestamp, businessHash };
  }
  const identity = { key: crypto.randomUUID(), id: crypto.randomUUID(), timestamp: new Date().toISOString(), businessHash };
  storage.setItem(slot, JSON.stringify(identity)); // fail closed if storage is unavailable; no volatile fallback
  return identity;
}
