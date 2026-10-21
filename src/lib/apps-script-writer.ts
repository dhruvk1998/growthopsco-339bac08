/**
 * Client for the authoritative Apps Script writer (apps-script/writer.gs).
 * Both form handlers must route every sheet write through this writer — a
 * direct Sheets append bypasses the shared lock and ledger and is not
 * allowed once the writer is deployed.
 *
 * If the writer is unreachable or rejects the request, the caller must FAIL
 * the submission — never fall back to a direct write.
 */

export type WriterEmailOutcome = "sent" | "failed" | "unknown" | "na";

export interface WriterEmail {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}

export interface WriterSubmitRequest {
  action: "submit";
  form: "diagnostic" | "contact";
  key: string;
  payloadHash: string;
  row: string[];
  emails?: { owner?: WriterEmail; prospect?: WriterEmail };
}

export interface WriterSubmitResult {
  ok: boolean;
  key: string;
  duplicate: boolean;
  status: "written" | "finalized" | "partial" | "ambiguous" | string;
  emails: { owner: WriterEmailOutcome; prospect: WriterEmailOutcome };
}

export class KeyPayloadMismatchError extends Error {
  constructor() {
    super("key_payload_mismatch");
    this.name = "KeyPayloadMismatchError";
  }
}

async function postWriter(url: string, body: unknown, fetchImpl: typeof fetch) {
  const res = await fetchImpl(url, {
    method: "POST",
    // text/plain avoids an Apps Script preflight redirect quirk.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
    redirect: "follow",
  });
  const json = (await res.json().catch(() => null)) as
    | ({ ok?: boolean; error?: string } & Record<string, unknown>)
    | null;
  if (!res.ok || !json) throw new Error(`Writer unreachable (${res.status})`);
  if (json.error === "key_payload_mismatch") throw new KeyPayloadMismatchError();
  if (!json.ok) throw new Error(`Writer rejected: ${json.error ?? "unknown"}`);
  return json;
}

export async function submitToWriter(
  url: string,
  req: WriterSubmitRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<WriterSubmitResult> {
  return (await postWriter(url, req, fetchImpl)) as WriterSubmitResult;
}

export async function finalizeWriter(
  url: string,
  req: { action: "finalize"; key: string; payloadHash: string; emails: { owner: WriterEmailOutcome; prospect: WriterEmailOutcome } },
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: boolean; status: string }> {
  return (await postWriter(url, req, fetchImpl)) as { ok: boolean; status: string };
}
