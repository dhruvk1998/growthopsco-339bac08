import { describe, expect, it, vi } from "vitest";
import { makeHarness, TEST_WRITER_TOKEN, TEST_OPERATOR_TOKEN } from "../../apps-script/writer-harness";
import { submitToWriter, KeyPayloadMismatchError, type WriterSubmitRequest, type WriterSubmission } from "./apps-script-writer";
import { writerHash } from "./proposed-submission-keys";
const config = {url:"https://script.google.com/macros/s/test/exec",token:TEST_WRITER_TOKEN};
async function request(): Promise<WriterSubmitRequest> {
  const submission: WriterSubmission = { form:"diagnostic", row:["08ce1011-fd6e-4e03-8833-2d649c33c135","2026-10-21T22:00:00.000Z","Test","prospect@example.com","Company","","HubSpot","1–10","Challenge","Automation","Tuesday","Yes","New",""], emails:{owner:{to:"dhruvozone38@gmail.com",replyTo:"prospect@example.com",subject:"Subject",body:"Body"},prospect:{to:"prospect@example.com",subject:"Receipt",body:"Body"}} };
  return {action:"submit",key:"test-key-123456789",payloadHash:await writerHash(submission),submission};
}
describe("actual proposed Apps Script writer",()=>{
  it.each(["submit","finalize","reconcile"])("authenticates %s before storage or sends",async action=>{
    const h=makeHarness(), req=await request();
    expect(h.post({...req,action,token:"wrong"})).toEqual({ok:false,error:"unauthorized"});
    expect(h.records()).toHaveLength(0);expect(h.sends).toHaveLength(0);expect(h.sheets.has("Submission Ledger")).toBe(false);
  });
  it("requires distinct credentials and operator privilege for finalize",async()=>{
    const h=makeHarness(), req=await request();
    expect(h.post({action:"finalize",key:req.key,payloadHash:req.payloadHash,token:TEST_WRITER_TOKEN})).toEqual({ok:false,error:"unauthorized"});
    h.props.OPERATOR_TOKEN=TEST_WRITER_TOKEN;
    expect(h.post({...req,token:TEST_WRITER_TOKEN})).toEqual({ok:false,error:"missing_configuration"});
  });
  it("rejects unauthorized destinations and recomputes the payload hash",async()=>{
    const h=makeHarness(), req=await request();req.submission.emails.owner.to="attacker@example.com";
    expect(h.post({...req,token:TEST_WRITER_TOKEN})).toEqual({ok:false,error:"bad_request"});
    const next=await request();next.submission.row[2]="Changed";
    expect(h.post({...next,token:TEST_WRITER_TOKEN})).toEqual({ok:false,error:"key_payload_mismatch"});expect(h.sends).toHaveLength(0);
  });
  it("serializes duplicate arrivals using the actual lock entry and one durable row",async()=>{
    const h=makeHarness(), req=await request();
    const results=await Promise.all(Array.from({length:3},()=>submitToWriter(config,req,h.fetchImpl)));
    expect(results.filter(r=>!r.duplicate)).toHaveLength(1);expect(h.records()).toHaveLength(1);expect(h.sheets.get("Diagnostic Requests")?.getLastRow()).toBe(2);expect(h.sends).toHaveLength(2);
    h.hold(true);expect(h.post({...req,token:TEST_WRITER_TOKEN})).toEqual({ok:false,error:"busy"});h.hold(false);
  });
  it.each(["claim","data_write","written","owner_intent","owner_send","owner_checkpoint","prospect_intent","prospect_send","prospect_checkpoint"])("recovers safely after %s",async point=>{
    const h=makeHarness(), req=await request();h.fault(point);
    await submitToWriter(config,req,h.fetchImpl).catch(()=>undefined);
    // Retry uses persistent disk snapshot, not a new simulation/empty ledger.
    const retry=await submitToWriter(config,req,h.fetchImpl);
    expect(retry.persistence).toBe("written");expect(retry.duplicate).toBe(true);
    expect(h.records()).toHaveLength(1);expect(h.sheets.get("Diagnostic Requests")?.getLastRow()).toBe(2);
    const ownerAmbiguous=["owner_intent","owner_send"].includes(point), prospectAmbiguous=["prospect_intent","prospect_send"].includes(point);
    expect(retry.emails.owner.state).toBe(ownerAmbiguous?"unknown":"accepted");expect(retry.emails.prospect.state).toBe(prospectAmbiguous?"unknown":"accepted");
    expect(h.sends).toHaveLength(point.endsWith("intent")?1:2);
    const count=h.sends.length;await submitToWriter(config,req,h.fetchImpl);expect(h.sends).toHaveLength(count);
  });
  it("operator reconciliation repairs claimed and written unfinished entries",async()=>{
    for(const point of ["claim","written"]){const h=makeHarness(),req=await request();h.fault(point);h.post({...req,token:TEST_WRITER_TOKEN});
      const repaired=h.post({action:"reconcile",token:TEST_OPERATOR_TOKEN,key:req.key,payloadHash:req.payloadHash});expect(repaired.persistence).toBe("written");expect(repaired.status).toBe("finalized");expect(h.sends).toHaveLength(2);}
  });
  it("never resends ambiguous emails; operator evidence is required to resume confirmed-unsent",async()=>{
    const h=makeHarness(),req=await request();h.fault("owner_intent");h.post({...req,token:TEST_WRITER_TOKEN});
    const base={key:req.key,payloadHash:req.payloadHash,token:TEST_OPERATOR_TOKEN};
    expect(h.post({...base,action:"reconcile"}).emails.owner.state).toBe("unknown");
    expect(h.post({...base,action:"finalize",role:"owner",decision:"confirmed_not_sent",evidence:"short"}).ok).toBe(false);
    const before=h.sends.length;
    expect(h.post({...base,action:"finalize",role:"owner",decision:"confirmed_not_sent",evidence:"Operator verified no send was initiated"}).emails.owner.state).toBe("not_started");expect(h.sends).toHaveLength(before);
    expect(h.post({...base,action:"reconcile"}).emails.owner.state).toBe("accepted");expect(h.sends).toHaveLength(before+1);
  });
  it("records independent confirmed delivery without treating acceptance as delivery",async()=>{
    const h=makeHarness(),req=await request();const first=await submitToWriter(config,req,h.fetchImpl);expect(first.emails.prospect.delivery).toBe("unconfirmed");
    const base={action:"finalize",key:req.key,payloadHash:req.payloadHash,token:TEST_OPERATOR_TOKEN,role:"prospect",decision:"delivered",evidence:"Recipient confirmed receipt of this exact request"};
    expect(h.post(base).emails.prospect.delivery).toBe("confirmed");expect(h.sends).toHaveLength(2);
    expect(h.post({...base,decision:"confirmed_not_sent"}).error).toBe("invalid_transition");
  });
  it("lost final response retries without another write or send",async()=>{
    const h=makeHarness(),req=await request();const lost=vi.fn(async()=>{h.post({...req,token:TEST_WRITER_TOKEN});throw new Error("lost response");});
    await expect(submitToWriter(config,req,lost)).rejects.toThrow("lost response");expect((await submitToWriter(config,req,h.fetchImpl)).duplicate).toBe(true);expect(h.sends).toHaveLength(2);
  });
  it("rejects key/payload mismatch even with a valid new hash",async()=>{
    const h=makeHarness(),req=await request();await submitToWriter(config,req,h.fetchImpl);req.submission.row[2]="Other";req.payloadHash=await writerHash(req.submission);
    await expect(submitToWriter(config,req,h.fetchImpl)).rejects.toBeInstanceOf(KeyPayloadMismatchError);expect(h.sends).toHaveLength(2);
  });
  it("keeps quota-exhausted emails pending, then safely resumes",async()=>{
    const h=makeHarness(),req=await request();h.quota(0);const first=await submitToWriter(config,req,h.fetchImpl);expect(first.status).toBe("partial");expect(h.sends).toHaveLength(0);
    h.quota(100);expect((await submitToWriter(config,req,h.fetchImpl)).status).toBe("finalized");expect(h.sends).toHaveLength(2);
  });
  it("reserves rows across interrupted claims and refuses conflicting manual edits",async()=>{
    const h=makeHarness(),req=await request();h.fault("claim");h.post({...req,token:TEST_WRITER_TOKEN});
    const second={...req,key:"second-key-123456789"};await submitToWriter(config,second,h.fetchImpl);expect(h.records().map(r=>r.dataRow)).toEqual([2,3]);
    h.sheets.get("Diagnostic Requests")?.getRange(2,1).setValue("manual existing record");await expect(submitToWriter(config,req,h.fetchImpl)).rejects.toThrow();expect(h.sheets.get("Diagnostic Requests")?.getRange(2,1).getValue()).toBe("manual existing record");expect(h.sends).toHaveLength(2);
  });
  it.each([{ok:false,error:"bad_request"},{ok:true},null])("rejects HTTP 200 invalid JSON contract %j",async body=>{
    await expect(submitToWriter(config,await request(),async()=>Response.json(body))).rejects.toThrow("Writer rejected or malformed response");
  });
});
