import { z } from "zod";

export const DEFAULT_OWNER_EMAIL = "dhruv.growthops@gmail.com";
export function ownerNotificationAddress(value?: string) {
  return z.string().trim().email().max(200).parse(value ?? DEFAULT_OWNER_EMAIL);
}

export const MailState = z.enum(["accepted", "failed", "unknown", "not_configured", "not_required", "not_attempted"]);
export const PersistenceState = z.enum(["saved", "failed", "unknown", "not_configured"]);
export type MailOutcome = z.infer<typeof MailState>;
export type PersistenceOutcome = z.infer<typeof PersistenceState>;
export const DeliverySchema = z.object({
  ok: z.boolean(), status: z.enum(["complete", "partial", "failed", "unknown"]),
  persistence: PersistenceState,
  notifications: z.object({ owner: MailState, prospect: MailState }),
});
export type DeliveryResult = z.infer<typeof DeliverySchema>;

export function deliveryResult(persistence: PersistenceOutcome, owner: MailOutcome, prospect: MailOutcome): DeliveryResult {
  const complete = persistence === "saved" && owner === "accepted" && (prospect === "accepted" || prospect === "not_required");
  const status = complete ? "complete" : persistence === "saved" || owner === "accepted" ? "partial" : persistence === "unknown" || owner === "unknown" ? "unknown" : "failed";
  return { ok: complete, status, persistence, notifications: { owner, prospect } };
}

export class DeliveryFailure extends Error {
  constructor(public readonly outcome: "failed" | "unknown", public readonly service: string, public readonly httpStatus?: number) {
    super(`${service}: ${outcome}${httpStatus ? ` (${httpStatus})` : ""}`);
  }
}
export function failureOutcome(error: unknown): "failed" | "unknown" {
  return error instanceof DeliveryFailure ? error.outcome : "unknown";
}

/** One persistence attempt, then independent notification attempts. Never retry an ambiguous send. */
export async function runFormDelivery(deps: {
  write: () => Promise<void>; owner?: () => Promise<void>; prospect?: () => Promise<void>; diagnostic: boolean;
}): Promise<DeliveryResult> {
  try { await deps.write(); }
  catch (error) { return deliveryResult(failureOutcome(error), "not_attempted", deps.diagnostic ? "not_attempted" : "not_required"); }
  const send = async (fn?: () => Promise<void>): Promise<MailOutcome> => {
    if (!fn) return "not_configured";
    try { await fn(); return "accepted"; } catch (error) { return failureOutcome(error); }
  };
  const [owner, prospect] = await Promise.all([send(deps.owner), deps.diagnostic ? send(deps.prospect) : Promise.resolve("not_required" as const)]);
  return deliveryResult("saved", owner, prospect);
}

/** Reject legacy bare ok:true and contradictory results: neither proves persistence or notifications. */
export function parseDeliveryResult(value: unknown): DeliveryResult {
  const result = DeliverySchema.parse(value);
  const expected = deliveryResult(result.persistence, result.notifications.owner, result.notifications.prospect);
  if (result.ok !== expected.ok || result.status !== expected.status) throw new Error("Invalid delivery result");
  return result;
}

export async function readDeliveryBridge(response: Response): Promise<DeliveryResult> {
  try {
    const result = parseDeliveryResult(await response.json());
    if (!response.ok && result.status === "complete") throw new Error("Invalid bridge success");
    return result;
  } catch { return deliveryResult("unknown", "unknown", "unknown"); }
}

export function formDeliveryView(value: unknown, diagnostic: boolean) {
  let result: DeliveryResult;
  try { result = parseDeliveryResult(value); }
  catch { return { state: "unknown" as const, terminal: true, message: "We couldn't confirm the outcome of your request. Please contact GrowthOpsCo before submitting again to avoid a duplicate." }; }
  if (result.status === "complete") return {
    state: "success" as const, terminal: true,
    message: diagnostic ? "Your diagnostic request has been saved and the notification and acknowledgment emails were accepted for sending. We will coordinate a consultation time after review; your appointment is not yet confirmed." : "Your consultation inquiry has been saved and the notification was accepted for sending. GrowthOpsCo will review your requirements and follow up.",
  };
  if (result.persistence === "saved") return {
    state: "partial" as const, terminal: true,
    message: "Your request has been saved, but we couldn't confirm all notification emails were accepted for sending. Please contact GrowthOpsCo if you need assistance; do not submit this request again. Your appointment is not confirmed.",
  };
  if (result.status === "partial" || result.status === "unknown") return {
    state: "unknown" as const, terminal: true,
    message: "We couldn't confirm that your request was saved. An email may have been sent. Please contact GrowthOpsCo before submitting again to avoid a duplicate.",
  };
  return { state: "error" as const, terminal: false, message: "Your request was not saved and no emails were accepted for sending. Please try again or contact GrowthOpsCo." };
}