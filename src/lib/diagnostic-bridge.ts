/**
 * Bridge to the published Lovable diagnostic endpoint, used when this host
 * (e.g. Vercel) lacks the connector secrets. Extracted from the route so the
 * forwarding contract — header, body pass-through, failure semantics — is
 * unit-testable with an injected fetch.
 */

export const PUBLISHED_DIAGNOSTIC_ENDPOINT =
  "https://growthopsco.lovable.app/api/diagnostic-request";

export const BRIDGE_HEADER = "X-GrowthOps-Remote-Bridge";

import { readDeliveryBridge, type DeliveryResult } from "./form-delivery";
export type BridgeResult = DeliveryResult;

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
  const result = await readDeliveryBridge(res);
  if (result.status === "unknown") throw new Error(`Bridge failed (${res.status}): outcome unknown; do not retry automatically`);
  return result;
}
