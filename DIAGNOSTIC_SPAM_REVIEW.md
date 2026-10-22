# Customer diagnostic confirmation Spam review

## Conclusion

The root cause remains **unconfirmed**. Dhruv reports that customer confirmations reached Inbox before the same Google Account was renamed to dhruv.growthops@gmail.com, then reached Spam; internal notifications still reach Inbox. The reported sample has SPF PASS, DKIM PASS with gmail.com, and DMARC PASS. Those results establish authentication for that sample, not Inbox placement, and were supplied by Dhruv rather than independently inspected here. No received original or deployed revision was supplied that links a last-known Inbox message to a repository commit.

No evidence warrants changing the production sender, Reply-To, copy, sending integration, DNS or retry architecture to address Spam. Runtime code is unchanged. New regression tests protect the existing payload and uncertain-send behavior; they do not test or promise Gmail classification.

## Current production-intended path

- DiagnosticForm validates and adapts through diagnostic-contact; ENQUIRY_ENDPOINT is `/api/consultation-lead`.
- `/api/diagnostic-request` is a compatibility adapter to the same handler. It does not independently send a second confirmation.
- The consultation handler forwards the whole request to the published Lovable consultation endpoint before side effects when an eligible non-Lovable host lacks Sheets configuration. vercel.json has headers, not a form forwarding rewrite.
- The standalone diagnostic-bridge helper is not used by active routes; its response-validation tests remain relevant compatibility coverage.
- Production persistence uses the existing Diagnostic Requests mapping. Persistence must be acknowledged before either notification is attempted.
- Both diagnostic notifications use the authenticated Gmail connector `users/me/messages/send`, with server-only LOVABLE_API_KEY and GOOGLE_MAIL_API_KEY. Diagnostics do not use FormSubmit or Apps Script fallback.
- Customer MIME supplies To and the validated owner Reply-To (default dhruv.growthops@gmail.com, optional existing server-only override). Owner mail Reply-To is the prospect. No From, Sender, Return-Path or authentication headers are invented by the app. Actual delivered From and connector identity require received-message evidence.
- Subject is `We've Received Your CRM Revenue Diagnostic Request`. Plain text and inline, table-based HTML contain matching text, safe first-name personalization, review/scheduling/report steps and the approved team signature. There are no links, remote images, tracking resources, scripts or external styles to repair.
- Gmail acceptance requires a nonempty message ID, not just HTTP 200. Saved requests with failed, missing or uncertain mail remain explicitly partial. UI wording refers to acceptance for sending, not Inbox delivery or appointment confirmation.
- Each handler invocation makes at most one customer send attempt. There is no fallback after a send attempt or automatic retry of an ambiguous result. Browser in-flight/terminal guards reduce duplicates, but separate manual requests can still duplicate rows/emails: no durable server deduplication ledger is active.

## Verified history, not a proven Inbox baseline

| Commit | Verified change |
| --- | --- |
| ee1e2fb | Added active diagnostic confirmation to consultation handler: old subject, full-name greeting, plain text, fee/manual appointment wording and personal signature. Gmail sending was best effort. |
| 33d8ffb | Changed subject and wording; introduced escaped HTML, first-name fallback and UTF-8/base64 multipart alternatives; removed fee/payment wording from acknowledgment. Gmail integration retained. |
| babeb65 | Changed individual wording/signature to team wording. Last change to current template. |
| 1e706dc | Replaced old hardcoded owner address with validated default/override, also changing customer Reply-To. Gmail endpoint and no-explicit-From behavior retained. Added acknowledgment validation and safer forwarding/failure handling. |
| affe86d | Made standalone diagnostic endpoint delegate to the shared handler; added UI in-flight/terminal guards. Previously that standalone endpoint constructed old plain-text customer mail without Reply-To. |
| 63f0855 | Changed diagnostic bridge to structured outcome validation. |
| 23e9faf | Integrated form success-reporting work; a commit title does not establish a production deployment. |
| 70a3cf3 | Latest diagnostic test work changed isolated-UAT configuration/tests and roadmap, not production sender or confirmation template. |

The active workflow and the older standalone endpoint must not be treated as equivalent historical message paths. Their headers/content differed. Repository history does not identify which generated the user's earlier Inbox sample, or which commits are deployed on Vercel and published Lovable. Existing Sent evidence is not recipient Inbox evidence. The account rename is not proof of a new account, broken authentication or a code-caused Spam decision.

## Changes and verification

Changed only:

- `src/lib/diagnostic-confirmation.test.ts`: two regression cases for provider-owned sender/authentication headers, To/Reply-To, MIME boundaries, safe personalization, UTF-8/base64 alternatives and 76-character encoded lines.
- `src/lib/form-handlers.test.ts`: five cases covering identical authenticated customer sending through active/compatibility handlers, validated Reply-To override, uncertain send without retry and malformed Gmail acknowledgment without false acceptance.
- `roadmap.md`: this investigation's scope and result.
- `DIAGNOSTIC_SPAM_REVIEW.md`: this report.

Exact automated suite command: `bunx vitest run src/lib` (output captured in `/tmp/diagnostic-spam-tests.log`): **10 files, 125 tests passed, exit 0**. Tests use literal mock credentials and mocked fetch; no real provider requests.

Additional local-only fixture check: `bun -e` imported diagnosticConfirmationMessage and wrote `/tmp/diagnostic-spam/confirmation.eml`; `python3` parsed it with email.parser/standard email policy and lxml. Final check passed: no MIME defects, correct UTF-8 alternatives, matching visible content, parseable HTML and no external resources. The first comparison assertion failed because HTML element text was concatenated without break separators; the corrected comparison joins text nodes before normalizing spaces. No message or production code was changed to satisfy this check.

Automatic build report inspected at `/tmp/observability/build-errors.log`: **build OK at 2026-10-22T01:12:15Z**. No manual build or typecheck was run; the environment automatically checks app builds. Existing content-route metadata was inspected without changes.

## Smallest next diagnostic step

Use the **existing customer Spam message**, without sending anything new: provide the exact Gmail “Why is this message in spam?” banner and a privacy-redacted Show original from that message, plus one earlier customer confirmation that reached Inbox if available. Keep From, Reply-To, Return-Path, Authentication-Results, MIME structure, timestamps and relevant Received headers; remove unrelated personal content and redact addresses consistently where needed. Never include account credentials, tokens or connector keys. Matching deployed revisions/times would let the old and new messages be tied to actual runtime code rather than presumed commit history.

This distinguishes an actual delivered header/body change from recipient filtering. SPF/DKIM/DMARC PASS does not expose Gmail's complete filtering rationale. Internal Inbox delivery does not establish external recipient placement. Sender reputation and recipient history/filtering are possible factors, not a confirmed diagnosis. Do not change DNS, reauthorize Gmail or rewrite the template merely on that speculation.

## Production actions

**None.** No live forms, real emails, provider calls, spreadsheet changes, deployments, environment-variable changes, identity changes, recipient changes, OAuth reauthorization or offline Apps Script edits/cutover.