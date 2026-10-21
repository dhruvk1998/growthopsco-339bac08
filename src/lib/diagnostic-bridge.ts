/**
 * Bridge to the published Lovable diagnostic endpoint, used when this host
 * (e.g. Vercel) lacks the connector secrets. Extracted from the route so the
 * forwarding contract — header, body pass-through, failure semantics — is
 * unit-testable with an injected fetch.
 */

export const PUBLISHED_DIAGNOSTIC_ENDPOINT =
  "https://growthopsco.lovable.app/api/diagnostic-request";

export const BRIDGE_HEADER = "X-GrowthOps-Remote-Bridge";

export interface BridgeResult {
  ok?: boolean;
  id?: string;
}

export async function bridgeToPublished(
  body: unknown,
  fetchImpl: typeof fetch = fetch,
  endpoint: string = PUBLISHED_DIAGNOSTIC_ENDPOINT,
): Promise<BridgeResult> {
  const res = await fetchImpl(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      [BRIDGE_HEADER]: "1",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as BridgeResult;
  if (!res.ok || !json.ok) throw new Error(`Bridge failed (${res.status})`);
  return json;
}
