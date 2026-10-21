/** OFFLINE PROPOSAL. Do not replace the existing deployment until coordinated cutover approval.
 * Script Properties: SPREADSHEET_ID, WRITER_TOKEN, OPERATOR_TOKEN (distinct secrets).
 * All writes AND sends use this script. No legacy unauthenticated adapter or external finalize sender.
 * Script lock coordinates cooperating executions, not a Sheets transaction.
 */
var LEDGER_NAME = 'Submission Ledger';
var MARKER_HEADER = 'Writer Reservation v1';
var OWNER_ADDRESS = 'dhruvozone38@gmail.com';
var OUTCOMES = ['not_started', 'sending', 'accepted', 'unknown', 'failed', 'na'];

function doPost(e) {
  try {
    if (!e || !e.postData || typeof e.postData.contents !== 'string' || e.postData.contents.length > 45000) return respond({ok:false,error:'bad_request'});
    var req = JSON.parse(e.postData.contents);
    authorize(req);
    validate(req);
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(25000)) return respond({ok:false,error:'busy'});
    try {
      var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
      var sh = getLedger(ss);
      if (req.action === 'submit') return respond(submit(ss, sh, req));
      if (req.action === 'reconcile') return respond(reconcile(ss, sh, req));
      return respond(finalize(ss, sh, req));
    } finally { lock.releaseLock(); }
  } catch (err) {
    var allowed = ['unauthorized','bad_request','key_payload_mismatch','unknown_key','missing_configuration','ledger_conflict','data_conflict','missing_data_sheet','marker_column_conflict','invalid_transition'];
    return respond({ok:false,error:allowed.indexOf(err.message) >= 0 ? err.message : 'operation_interrupted'});
  }
}
function respond(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function fail(message) { throw new Error(message); }
function constantEqual(a,b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  var diff = a.length ^ b.length;
  for (var i=0;i<Math.max(a.length,b.length);i++) diff |= (a.charCodeAt(i)||0) ^ (b.charCodeAt(i)||0);
  return diff === 0;
}
function authorize(req) {
  if (!req || typeof req !== 'object' || Array.isArray(req)) fail('unauthorized');
  var props = PropertiesService.getScriptProperties();
  var writer = props.getProperty('WRITER_TOKEN'), operator = props.getProperty('OPERATOR_TOKEN');
  if (!writer || !operator || writer.length < 32 || operator.length < 32 || writer === operator || !props.getProperty('SPREADSHEET_ID')) fail('missing_configuration');
  if (!constantEqual(req.token, req.action === 'submit' ? writer : operator)) fail('unauthorized');
}
function text(v,max) { return typeof v === 'string' && v.length <= max; }
function address(v) { return text(v,200) && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v); }
function only(obj,keys) { if (!obj || typeof obj !== 'object' || Array.isArray(obj) || Object.keys(obj).some(function(k){return keys.indexOf(k)<0;})) fail('bad_request'); }
function canonical(v) {
  if (Array.isArray(v)) return '['+v.map(canonical).join(',')+']';
  if (v && typeof v === 'object') return '{'+Object.keys(v).sort().map(function(k){return JSON.stringify(k)+':'+canonical(v[k]);}).join(',')+'}';
  return JSON.stringify(v);
}
function digest(v) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,canonical(v),Utilities.Charset.UTF_8).map(function(b){return ('0'+((b+256)%256).toString(16)).slice(-2);}).join(''); }
function validate(req) {
  if (['submit','reconcile','finalize'].indexOf(req.action)<0 || !/^[a-zA-Z0-9_-]{16,100}$/.test(req.key || '') || !/^[a-f0-9]{64}$/.test(req.payloadHash || '')) fail('bad_request');
  if (req.action === 'submit') {
    only(req,['action','token','key','payloadHash','submission']);
    var s=req.submission;
    only(s,['form','row','emails','assessment']);
    if (['contact','diagnostic'].indexOf(s.form)<0 || !Array.isArray(s.row) || s.row.length !== (s.form==='contact'?12:14) || !s.row.every(function(v){return text(v,5000);})) fail('bad_request');
    var email=s.row[s.form==='contact'?3:3];
    if (!address(email) || !text(s.row[0],100) || !s.row[0] || !s.row[1]) fail('bad_request');
    if (s.form==='diagnostic' && (s.row[11]!=='Yes' || s.row[12]!=='New' || s.row[13]!=='')) fail('bad_request');
    only(s.emails,['owner','prospect']);
    if (!s.emails.owner || (s.form==='contact' ? !!s.emails.prospect : !s.emails.prospect)) fail('bad_request');
    ['owner','prospect'].forEach(function(role){
      var m=s.emails[role]; if (!m) return;
      only(m,['to','subject','body','replyTo']);
      if (!address(m.to) || m.to !== (role==='owner'?OWNER_ADDRESS:email) || !text(m.subject,300) || !m.subject || /[\r\n]/.test(m.subject) || !text(m.body,20000) || !m.body || (role==='owner' && m.replyTo!==email) || (m.replyTo!==undefined && !address(m.replyTo))) fail('bad_request');
    });
    if (s.assessment !== undefined && (s.form!=='contact' || canonical(s.assessment).length>15000)) fail('bad_request');
    if (canonical(s).length>38000 || digest(s)!==req.payloadHash) fail('key_payload_mismatch');
  } else if (req.action==='reconcile') {
    only(req,['action','token','key','payloadHash']);
  } else {
    only(req,['action','token','key','payloadHash','role','decision','evidence']);
    if (['owner','prospect'].indexOf(req.role)<0 || ['accepted','delivered','bounced','confirmed_not_sent'].indexOf(req.decision)<0 || !text(req.evidence,2000) || req.evidence.length<10) fail('bad_request');
  }
}
function getLedger(ss) {
  var sh=ss.getSheetByName(LEDGER_NAME);
  if (!sh) { sh=ss.insertSheet(LEDGER_NAME); sh.getRange(1,1,1,2).setValues([['Key','Record JSON v1']]); SpreadsheetApp.flush(); }
  var header=sh.getRange(1,1,1,2).getValues()[0];
  if (header[0]!=='Key' || header[1]!=='Record JSON v1') fail('ledger_conflict');
  return sh;
}
function entries(sh) {
  return sh.getDataRange().getValues().slice(1).filter(function(r){return r[0];}).map(function(r,i){
    var entry=JSON.parse(r[1]); if(entry.key!==r[0]) fail('ledger_conflict'); return {row:i+2,entry:entry};
  });
}
function find(sh,key,hash) {
  var matches=entries(sh).filter(function(r){return r.entry.key===key;});
  if(matches.length>1) fail('ledger_conflict');
  if(matches.length && matches[0].entry.payloadHash!==hash) fail('key_payload_mismatch');
  return matches[0];
}
function save(sh,r) { r.entry.updatedAt=new Date().toISOString(); sh.getRange(r.row,1,1,2).setValues([[r.entry.key,JSON.stringify(r.entry)]]); SpreadsheetApp.flush(); }
function dataSheet(ss,form) {
  var ds=ss.getSheetByName(form==='contact'?'Database':'Diagnostic Requests');
  if(!ds) fail('missing_data_sheet');
  var col=form==='contact'?13:15;
  var header=ds.getRange(1,col).getValue();
  if(header!==MARKER_HEADER) {
    if(header || ds.getRange(1,col,Math.max(ds.getLastRow(),1),1).getValues().some(function(r){return r[0]!=='';})) fail('marker_column_conflict');
    ds.getRange(1,col).setValue(MARKER_HEADER); SpreadsheetApp.flush();
  }
  return ds;
}
function submit(ss,sh,req) {
  var r=find(sh,req.key,req.payloadHash), duplicate=!!r;
  if(!r) {
    var ds=dataSheet(ss,req.submission.form);
    var reserved=entries(sh).filter(function(x){return x.entry.submission.form===req.submission.form;}).map(function(x){return x.entry.dataRow;});
    var row=Math.max.apply(null,[ds.getLastRow(),1].concat(reserved))+1;
    r={row:sh.getLastRow()+1,entry:{key:req.key,payloadHash:req.payloadHash,submission:req.submission,dataRow:row,persistence:'claimed',emails:{owner:{state:'not_started',delivery:'unconfirmed'},prospect:{state:req.submission.emails.prospect?'not_started':'na',delivery:req.submission.emails.prospect?'unconfirmed':'na'}},audit:[],createdAt:new Date().toISOString()}};
    save(sh,r); // stores full recoverable payload AND reserved row before any data write
  }
  return resume(ss,sh,r,duplicate);
}
function safeCell(v) { return /^[=+\-@]/.test(v)?'\u200b'+v:v; }
function resume(ss,sh,r,duplicate) {
  var en=r.entry, ds=dataSheet(ss,en.submission.form);
  var expected=en.submission.row.map(safeCell).concat(['writer:'+en.key+':'+en.payloadHash]);
  var actual=ds.getRange(en.dataRow,1,1,expected.length).getValues()[0];
  if(actual.every(function(v){return v==='';})) {
    if(en.persistence==='written') fail('data_conflict'); // never recreate a deleted/moved verified row
    ds.getRange(en.dataRow,1,1,expected.length).setValues([expected]); SpreadsheetApp.flush();
  } else if(!actual.every(function(v,i){return String(v)===expected[i];})) fail('data_conflict');
  // Same reserved range + marker avoids an append even after a lost write response.
  if(en.persistence!=='written') { en.persistence='written'; save(sh,r); }
  ['owner','prospect'].forEach(function(role){
    var out=en.emails[role], message=en.submission.emails[role];
    if(out.state==='sending') { out.state='unknown'; save(sh,r); }
    if(out.state!=='not_started' || !message) return;
    if(MailApp.getRemainingDailyQuota()<1) return; // safe pending, no call initiated
    out.state='sending'; save(sh,r); // durable BEFORE send; interruption becomes unknown
    try { MailApp.sendEmail(message); out.state='accepted'; }
    catch(err) { out.state='unknown'; }
    save(sh,r); // per-recipient checkpoint, never defer until both sends
  });
  return result(en,duplicate);
}
function result(en,duplicate) {
  var states=[en.emails.owner.state,en.emails.prospect.state];
  var status=states.some(function(s){return s==='sending'||s==='unknown';})?'ambiguous':states.every(function(s){return s==='accepted'||s==='na';})?'finalized':'partial';
  if(en.persistence!=='written') status='claimed';
  return {ok:true,key:en.key,duplicate:duplicate,persistence:en.persistence,status:status,emails:en.emails};
}
function reconcile(ss,sh,req) { var r=find(sh,req.key,req.payloadHash); if(!r) fail('unknown_key'); return resume(ss,sh,r,true); }
function finalize(ss,sh,req) {
  var r=find(sh,req.key,req.payloadHash); if(!r) fail('unknown_key');
  var out=r.entry.emails[req.role];
  if(out.state==='na' || r.entry.audit.length>=20) fail('invalid_transition');
  if(req.decision==='confirmed_not_sent') {
    if(['unknown','sending','failed'].indexOf(out.state)<0 || out.delivery!=='unconfirmed') fail('invalid_transition');
    out.state='not_started'; // explicit operator evidence only; finalize itself never sends
  } else {
    if(['unknown','sending','accepted'].indexOf(out.state)<0) fail('invalid_transition');
    if(req.decision==='accepted') { if(out.delivery!=='unconfirmed') fail('invalid_transition'); out.state='accepted'; }
    else { if(out.delivery!=='unconfirmed') fail('invalid_transition'); out.state='accepted'; out.delivery=req.decision==='delivered'?'confirmed':'bounced'; }
  }
  r.entry.audit.push({at:new Date().toISOString(),role:req.role,decision:req.decision,evidence:req.evidence});
  save(sh,r); return result(r.entry,true);
}
