# GrowthOpsCo form delivery review — 22 October 2026

## Findings and implemented changes

Both active browser forms send `/api/consultation-lead`; the diagnostic form uses the existing diagnostic-to-contact adapter. `/api/diagnostic-request` is a compatibility endpoint, not the active diagnostic form target. It now delegates to the same handler, preserving diagnostic validation and applying the same preview guard. No spreadsheet tabs, headers, rows, pricing or acknowledgment template changed.

`vite.config.ts` selects Nitro's Vercel preset. `vercel.json` has headers only, not forwarding rewrites. Forwarding is application code: when production Vercel lacks Sheets connector credentials, the whole validated enquiry goes to `https://growthopsco.lovable.app/api/consultation-lead` **before** any local persistence or email attempt. The bridge header prevents loops. Recognized hosted previews still reject submissions; local UAT retains its isolated sheet and recipient allowlist. Custom preview domains outside the existing naming rules require separate review before any real-service test.

### Proven repository failure modes (not proof of the latest inbox failure)

- The active handler previously accepted sheet success OR email success for contacts, and treated diagnostic acknowledgment as best-effort with unconditional `ok:true` after saving. Both UIs ignored email outcomes.
- Missing Gmail configuration could leave a saved diagnostic without its acknowledgment. The separate diagnostic handler explicitly allowed `emails:[]` success.
- Bridge callers discarded downstream email detail and asserted both persistence and email success.
- FormSubmit accepted string `"false"`, absent success flags and malformed HTTP-200 replies. Legacy Apps Script trusted HTTP status without independent write/send acknowledgment.
- Email fallback after a timeout, and bridging after local notification, could duplicate messages. Apps Script fallback could also duplicate a gateway sheet write.
- Owner destinations were still the old address. This fact does **not** prove that renaming the same Google Account invalidated authorization or prevented alternate-address delivery.

### Current behavior

Responses separately report `persistence` and `notifications.owner/prospect`. `status` is `complete`, `partial`, `failed`, or `unknown`; `ok:true` means saved plus all required emails **accepted by the provider**, never independently confirmed inbox delivery. Saved requests remain saved when either email fails. Missing diagnostic mail configuration is explicit `not_configured`, not empty-email success. Contact confirmations remain `not_required`.

There is one persistence attempt followed by independent owner/prospect sends. No emails are sent after a failed or uncertain append. Gmail is preferred; contact-only FormSubmit is selected solely when Gmail is unconfigured, after persistence succeeds. FormSubmit must explicitly acknowledge success. No fallback follows an attempted Gmail send. The deployed legacy Apps Script is untouched but is no longer used as an automatic combined write/send fallback: its separate outcomes cannot be established and it can duplicate persisted rows. The offline writer and proposed adapters remain disconnected and unchanged.

Gmail requires a message ID; Sheets requires one acknowledged updated row. Provider requests have bounded timeouts. Failed/ambiguous requests expose only service/status classifications, not private response bodies, payloads or credentials. Bridge HTTP/JSON results are validated and partial outcomes preserved; malformed, old bare `ok:true`, failed-HTTP success claims and lost replies become uncertain, with no retry/fallback.

Owner notifications default to `dhruv.growthops@gmail.com`; optional **server-only** `OWNER_NOTIFICATION_EMAIL` overrides it after validation. The owner notification Reply-To remains the prospect email. Diagnostic acknowledgments retain the existing template and owner Reply-To. No From header, OAuth integration, secret or sender identity was changed. Local UAT addresses remain the previously authorized isolated values.

Both forms display accessible complete/partial/failed/uncertain outcomes. Saved or uncertain requests remove the submit action; synchronous in-flight guards prevent repeated event submissions. Definitively rejected requests permit retry. No durable cross-session/server idempotency ledger exists: manual reposts, reloads or external concurrent requests can still duplicate rows; exactly-once delivery is not claimed.

## Verification

- `bunx vitest run src/lib` — **118 tests passed, 10 test files**. Includes unchanged offline-proposal tests; all provider access in new handler tests is globally mocked with literal fake credentials.
- Earlier focused command: `bunx vitest run src/lib/form-delivery.test.ts src/lib/diagnostic-contact.test.ts src/lib/consultation-sheet.test.ts src/lib/diagnostic-confirmation.test.ts src/lib/submission-integrity.test.ts src/lib/uat-isolation.test.ts` — **63 passed**.
- `python3 /tmp/browser/form-delivery/check_forms.py` — eight actual UI flows passed: both forms × complete/partial/failed/uncertain; all POSTs intercepted, one request per flow, no browser runtime errors. Status screenshots inspected.
- Automatic compilation evidence: latest observed entry **build OK, 2026-10-22T00:30:25Z**. Manual build/typecheck commands were not run because the project harness owns compilation. No separate typecheck result claimed.
- No real forms, Google calls, emails, spreadsheet writes, environment changes, credential rotation, OAuth changes or deployment occurred.

## Changed source files

- `src/lib/form-delivery.ts`, `src/lib/delivery-provider.ts`: shared result contract, safe provider acknowledgment, partial/unknown outcomes and UI interpretation.
- `src/routes/api/consultation-lead.ts`, `src/routes/api/diagnostic-request.ts`: single delivery path, safe pre-side-effect forwarding and configuration-aware notifications.
- `src/lib/diagnostic-bridge.ts`: validated downstream outcomes.
- `src/components/site/Contact.tsx`, `src/components/site/DiagnosticForm.tsx`: truthful accessible messages and in-flight/terminal guards.
- `src/lib/form-delivery.test.ts`, `src/lib/form-handlers.test.ts`, `src/lib/submission-integrity.test.ts`: mocked regression coverage.
- `AGENTS.md`, `roadmap.md`, this review: updated architecture/release evidence. Owner preference updated in project memory.

## Unverified dependencies and exact release steps

Production release remains **on hold**. This repository fix does not establish inbox delivery or diagnose the actual latest production provider response; the contact form's latest production failure is unconfirmed.

1. Identify the Git commit/version currently deployed on Vercel and published Lovable. Inspect Vercel POST logs and Lovable handler/provider status for the reported diagnostic test; do not repeat it merely to gather evidence. Determine whether its row exists in `Diagnostic Requests`, read-only, without deleting or editing records. Never copy customer payloads or provider credentials into reports.
2. Verify linked Gmail connection identity and granted `gmail.send` scope after the same-account rename. If the existing connection is valid, no reauthorization or transport change is necessary. Reauthorize only if provider/configuration evidence shows invalid credentials or missing scope. No such provider probe was made in this task.
3. Lovable's published handler requires server-only `LOVABLE_API_KEY`, `GOOGLE_SHEETS_API_KEY`, and `GOOGLE_MAIL_API_KEY`. All three names are present in project secret inventory; their validity and published availability are unverified. Confirm the executing Google account still has access to spreadsheet `1gR6UwaZ6zG2FmBVFBoKv9XbUcaqQC-k7pqsefQTC0c4`, existing `Database!A:L` and `'Diagnostic Requests'!A:N`, without structure changes.
4. The optional `OWNER_NOTIFICATION_EMAIL` is not currently configured; the code defaults to the requested `dhruv.growthops@gmail.com`. If an override is desired, set it only in the server host performing delivery, never as a VITE variable. Do not copy managed connector secrets into Vercel: with no local Sheets configuration, Vercel delegates the entire operation to Lovable. Verify no stale local credential set changes that path.
5. If contact-only FormSubmit is intentionally used without Gmail, verify activation for the selected owner address; explicit rejection now reports partial notification failure instead of false success. Diagnostics require Gmail for the owner and prospect. Apps Script is not a substitute in this fix.
6. After explicit deployment approval, publish the updated Lovable handler **before** releasing the matching GitHub/Vercel UI. Older published bare-success responses are intentionally treated as uncertain. Confirm Vercel builds the Nitro Vercel output using the repository settings; no rewrite is required. Retain a rollback version, but do not selectively roll back the result contract on only one host.
7. After separate approval for real-service tests, use authorized recipients and isolated test storage/destinations first. Verify one row in the correct tab, each intended email's provider acceptance and independently confirmed inbox receipt separately. Do not infer receipt from Sent folders. Do not replay uncertain submissions; inspect the stored row/provider evidence first. Retain test records. Only then authorize a controlled production smoke test and inspect both UI outcomes and read-only persistence/receipt evidence.