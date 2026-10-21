/** OFFLINE client; not wired to production. Tokens are server-only and never forwarded by browsers. */
import { z } from "zod";
export type WriterEmailOutcome = "not_started" | "sending" | "accepted" | "unknown" | "failed" | "na";
export interface WriterEmail { to: string; subject: string; body: string; replyTo?: string }
export interface WriterSubmission {
  form: "contact" | "diagnostic";
  row: string[];
  emails: { owner: WriterEmail; prospect?: WriterEmail };
  assessment?: unknown;
}
export interface WriterSubmitRequest { action: "submit"; key: string; payloadHash: string; submission: WriterSubmission }
const OutcomeSchema = z.object({
  state: z.enum(["not_started", "sending", "accepted", "unknown", "failed", "na"]),
  delivery: z.enum(["unconfirmed", "confirmed", "bounced", "na"]),
}).strict();
export const WriterResultSchema = z.object({
  ok: z.literal(true), key: z.string(), duplicate: z.boolean(),
  persistence: z.enum(["claimed", "written"]),
  status: z.enum(["claimed", "partial", "ambiguous", "finalized"]),
  emails: z.object({ owner: OutcomeSchema, prospect: OutcomeSchema }).strict(),
}).strict();
export type WriterSubmitResult = z.infer<typeof WriterResultSchema>;
export class KeyPayloadMismatchError extends Error {
  constructor() { super("key_payload_mismatch"); this.name = "KeyPayloadMismatchError"; }
}
export interface WriterConfig { url: string; token: string }
export async function postWriter(config: WriterConfig, req: { key: string } & Record<string, unknown>, fetchImpl: typeof fetch = fetch): Promise<WriterSubmitResult> {
  // Apps Script redirects responses to googleusercontent; fetch's body is never sent to that GET.
  const url = new URL(config.url);
  if (url.protocol !== "https:" || url.hostname !== "script.google.com" || !/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname) || url.search || url.hash || url.username || url.password || config.token.length < 32) throw new Error("Writer not configured");
  const res = await fetchImpl(config.url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ ...req, token: config.token }), redirect: "follow" });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`Writer unreachable (${res.status})`);
  if (json && typeof json === "object" && "error" in json && json.error === "key_payload_mismatch") throw new KeyPayloadMismatchError();
  const parsed = WriterResultSchema.safeParse(json);
  if (!parsed.success || parsed.data.key !== req.key) throw new Error("Writer rejected or malformed response");
  return parsed.data;
}
export function submitToWriter(config: WriterConfig, req: WriterSubmitRequest, fetchImpl: typeof fetch = fetch) { return postWriter(config, { ...req }, fetchImpl); }
export function finalizeWriter(config: WriterConfig, req: { action: "finalize"; key: string; payloadHash: string; role: "owner" | "prospect"; decision: "accepted" | "delivered" | "bounced" | "confirmed_not_sent"; evidence: string }, fetchImpl: typeof fetch = fetch) { return postWriter(config, { ...req }, fetchImpl); }
