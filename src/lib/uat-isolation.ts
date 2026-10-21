/** Local development only. Hosted previews fail closed; production keeps its existing workflow. */
export const UAT_SPREADSHEET_ID = "1hDoV5j9pICnP0i8uInGcmUXTXCfWFaF9IVt1PDvt47Q";
export const UAT_OWNER_EMAIL = "dhruvozone38@gmail.com";
// Confirmed by Dhruv for local isolated UAT (owner and prospect copies).
export const UAT_RECIPIENT: string | null = "dhruvozone38@gmail.com";

export function submissionEnvironment(url: string, development: boolean) {
  const host = new URL(url).hostname;
  if (development && (host === "localhost" || host === "127.0.0.1")) return "uat";
  if (development || host.startsWith("id-preview--") || host.endsWith(".vercel.app") && host !== "growthopsco.vercel.app") return "blocked-preview";
  return "production";
}

export async function isolatedSubmission(
  data: { fullName: string; email: string },
  recipient: string | null,
  write: () => Promise<void>,
  notify: () => Promise<void>,
) {
  if (!recipient || data.email !== recipient || !data.fullName.startsWith("UAT-")) {
    return { ok: false, error: "UAT is paused until the test recipient is confirmed. No request was saved or emailed." };
  }
  // Never invoke notification if persistence failed. No fallback or bridge here.
  await write();
  await notify();
  return { ok: true, tried: ["sheet:UAT", "email:UAT"], succeeded: ["sheet:UAT", "email:UAT"], errors: [] };
}