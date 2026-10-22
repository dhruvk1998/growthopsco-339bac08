import { createFileRoute } from "@tanstack/react-router";
import { DiagnosticSchema } from "@/lib/diagnostic";
import { toContactEnquiry } from "@/lib/diagnostic-contact";
import { handleConsultationRequest } from "./consultation-lead";

/** Compatibility endpoint: same validation, preview isolation, storage and delivery contract as the active form. */
export async function handleDiagnosticRequest(request: Request, development: boolean) {
  const json = await request.json().catch(() => null);
  if (json && typeof json._honeypot === "string" && json._honeypot.length > 0) {
    return handleConsultationRequest(new Request(request.url, { method: "POST", headers: request.headers, body: JSON.stringify(json) }), development);
  }
  const parsed = DiagnosticSchema.safeParse(json);
  if (!parsed.success) return Response.json({ ok: false, error: "Please check the highlighted fields.", details: parsed.error.flatten() }, { status: 400 });
  const data = toContactEnquiry(parsed.data);
  return handleConsultationRequest(new Request(request.url, { method: "POST", headers: request.headers, body: JSON.stringify(data) }), development);
}

export const Route = createFileRoute("/api/diagnostic-request")({
  server: { handlers: { POST: async ({ request }) => handleDiagnosticRequest(request, import.meta.env.DEV) } },
});
