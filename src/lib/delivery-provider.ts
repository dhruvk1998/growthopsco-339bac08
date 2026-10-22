import { DeliveryFailure } from "./form-delivery";

/** Provider errors are deliberately reduced to service/status, never bodies or credentials. */
export async function acknowledgedRequest(service: "Gmail" | "Sheets" | "FormSubmit", url: string, init: RequestInit, fetchImpl: typeof fetch = fetch) {
  let response: Response;
  try { response = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(12000) }); }
  catch { throw new DeliveryFailure("unknown", service); }
  if (!response.ok) throw new DeliveryFailure(response.status >= 400 && response.status < 500 ? "failed" : "unknown", service, response.status);
  const body = await response.json().catch(() => null);
  const valid = service === "Gmail" ? typeof body?.id === "string" && body.id.length > 0
    : service === "Sheets" ? body?.updates?.updatedRows === 1
    : body?.success === true || body?.success === "true";
  if (!valid) throw new DeliveryFailure(service === "FormSubmit" && (body?.success === false || body?.success === "false") ? "failed" : "unknown", service, response.status);
}