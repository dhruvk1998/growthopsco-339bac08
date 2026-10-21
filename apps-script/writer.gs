/**
 * GrowthOpsCo — authoritative submission writer (Google Apps Script).
 *
 * PROPOSED — not yet deployed. Deploy steps (Dhruv):
 *   1. Open spreadsheet 1gR6UwaZ6zG2FmBVFBoKv9XbUcaqQC-k7pqsefQTC0c4
 *      → Extensions → Apps Script.
 *   2. Replace the existing script with this file (the old contact snippet's
 *      behavior is preserved via action "submit" with form "contact").
 *   3. Set a Script Property: RECONCILE_TOKEN = <random string> (Project
 *      Settings → Script Properties) — protects the reconcile action.
 *   4. Deploy → Manage deployments → New version → Web app:
 *      Execute as: Me, Access: Anyone. (Access "Anyone" is required — the
 *      previous deployment returned 401 because it required sign-in.)
 *   5. Keep APPS_SCRIPT_URL pointing at the /exec URL.
 *
 * Contract (POST JSON, Content-Type text/plain is fine):
 *   submit    { action, form: "diagnostic"|"contact", key, payloadHash, row: [...],
 *               emails?: { owner?: {to,subject,body,replyTo?}, prospect?: {...} } }
 *   finalize  { action, key, payloadHash, emails: { owner, prospect } }  // record outcomes only
 *   reconcile { action, token }  // list claimed/ambiguous entries needing follow-up
 *
 * Guarantees:
 *   - A script-wide lock serializes claim + data write, so one idempotency
 *     key produces at most one data row and one round of emails.
 *   - A replay with the same key and same payload hash returns the recorded
 *     result without rewriting or resending.
 *   - The same key with a different payload hash is rejected
 *     (key_payload_mismatch), never stored.
 *   - If the script dies between ledger claim and data write, the entry
 *     stays "claimed" and surfaces via reconcile — no blind resend.
 *   - MailApp throw = outcome "unknown" (MailApp cannot distinguish a
 *     rejection from a send that succeeded before the error). "sent" means
 *     accepted by Gmail, NOT delivered to the recipient's inbox.
 */

var LEDGER_SHEET = "Submission Ledger";
var DIAGNOSTIC_SHEET = "Diagnostic Requests";
var CONTACT_SHEET = "Database";
var LOCK_TIMEOUT_MS = 25000;

var LEDGER_HEADERS = [
  "Key", "Form", "Payload Hash", "Status", "Data Row",
  "Owner Email", "Prospect Email", "Created At", "Updated At", "Notes",
];

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    switch (req.action) {
      case "submit": return respond(submit(req));
      case "finalize": return respond(finalize(req));
      case "reconcile": return respond(reconcile(req));
      default: return respond({ ok: false, error: "unknown_action" });
    }
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function ledger() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(LEDGER_SHEET);
  if (!sh) {
    sh = ss.insertSheet(LEDGER_SHEET);
    sh.appendRow(LEDGER_HEADERS);
  }
  return sh;
}

function findKey(sh, key) {
  var vals = sh.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][0] === key) return { row: i + 1, vals: vals[i] };
  }
  return null;
}

function dataSheetFor(form) {
  if (form === "diagnostic") return DIAGNOSTIC_SHEET;
  if (form === "contact") return CONTACT_SHEET;
  throw new Error("unknown_form");
}

function trySend(email) {
  if (!email) return "na";
  try {
    MailApp.sendEmail({
      to: email.to,
      subject: email.subject,
      body: email.body,
      replyTo: email.replyTo || undefined,
    });
    return "sent"; // accepted by Gmail — not proof of recipient delivery
  } catch (err) {
    return "unknown"; // ambiguous: reconcile before any resend
  }
}

function submit(req) {
  if (!req.key || !req.payloadHash || !req.form || !Array.isArray(req.row)) {
    throw new Error("bad_request");
  }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LOCK_TIMEOUT_MS)) throw new Error("busy");
  try {
    var sh = ledger();
    var existing = findKey(sh, req.key);
    if (existing) {
      if (existing.vals[2] !== req.payloadHash) {
        return { ok: false, error: "key_payload_mismatch" };
      }
      return {
        ok: true,
        key: req.key,
        duplicate: true,
        status: existing.vals[3],
        emails: { owner: existing.vals[5], prospect: existing.vals[6] },
      };
    }

    var now = new Date().toISOString();
    sh.appendRow([req.key, req.form, req.payloadHash, "claimed", "", "na", "na", now, now, ""]);
    var ledgerRow = sh.getLastRow();

    // If anything below throws, the ledger keeps "claimed" for reconciliation.
    var sheetName = dataSheetFor(req.form);
    var ds = SpreadsheetApp.getActive().getSheetByName(sheetName);
    if (!ds) throw new Error("missing_data_sheet");
    ds.appendRow(req.row);
    var dataRow = ds.getLastRow();
    sh.getRange(ledgerRow, 4, 1, 2).setValues([["written", sheetName + "!" + dataRow]]);

    var emails = req.emails || {};
    var owner = trySend(emails.owner);
    var prospect = trySend(emails.prospect);
    var status = (owner === "unknown" || prospect === "unknown") ? "ambiguous"
      : (owner === "failed" || prospect === "failed") ? "partial"
      : "finalized";
    sh.getRange(ledgerRow, 4, 1, 4).setValues([[status, sheetName + "!" + dataRow, owner, prospect]]);
    sh.getRange(ledgerRow, 9).setValue(new Date().toISOString());

    return { ok: true, key: req.key, duplicate: false, status: status, emails: { owner: owner, prospect: prospect } };
  } finally {
    lock.releaseLock();
  }
}

function finalize(req) {
  // Records email outcomes for submissions whose emails were sent outside
  // this script (e.g. the contact form's existing transport chain).
  if (!req.key || !req.payloadHash || !req.emails) throw new Error("bad_request");
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(LOCK_TIMEOUT_MS)) throw new Error("busy");
  try {
    var sh = ledger();
    var existing = findKey(sh, req.key);
    if (!existing) return { ok: false, error: "unknown_key" };
    if (existing.vals[2] !== req.payloadHash) return { ok: false, error: "key_payload_mismatch" };
    var owner = req.emails.owner || "na";
    var prospect = req.emails.prospect || "na";
    var status = (owner === "unknown" || prospect === "unknown") ? "ambiguous"
      : (owner === "failed" || prospect === "failed") ? "partial"
      : "finalized";
    sh.getRange(existing.row, 4, 1, 4).setValues([[status, existing.vals[4], owner, prospect]]);
    sh.getRange(existing.row, 9).setValue(new Date().toISOString());
    return { ok: true, key: req.key, status: status };
  } finally {
    lock.releaseLock();
  }
}

function reconcile(req) {
  var token = PropertiesService.getScriptProperties().getProperty("RECONCILE_TOKEN");
  if (!token || req.token !== token) return { ok: false, error: "unauthorized" };
  var vals = ledger().getDataRange().getValues();
  var pending = [];
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][3] === "claimed" || vals[i][3] === "ambiguous" ||
        vals[i][5] === "unknown" || vals[i][6] === "unknown") {
      pending.push({
        key: vals[i][0], form: vals[i][1], status: vals[i][3], dataRow: vals[i][4],
        owner: vals[i][5], prospect: vals[i][6], createdAt: vals[i][7],
      });
    }
  }
  return { ok: true, pending: pending };
}
