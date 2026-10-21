import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { makeHarness, TEST_WRITER_TOKEN } from "../../apps-script/writer-harness";
import { proposedContactHandler, proposedDiagnosticHandler, ProposedContactSchema, processingComplete } from "./proposed-submission-handlers";
import { prepareStableSubmission, writerHash, type KeyStorage } from "./proposed-submission-keys";
import { DiagnosticSchema } from "./diagnostic";
const writer={url:"https://script.google.com/macros/s/test/exec",token:TEST_WRITER_TOKEN};
const contact={fullName:"Test",email:"test@example.com",requirements:"Need integration",companyName:"Company",phone:"123",website:"example.com",crmUsed:"Zoho",preferredMeetingTime:"Tuesday",engagementType:"Consulting",companySize:"Small",leadSource:"Referral",assessment:{score:72,rating:"Moderate",summary:"Review workflow",problemAreas:["Automation"],answers:[{id:"one",question:"Automated?",category:"Process",answer:"no" as const}],completedAt:"2026-10-21T22:00:00Z"}};
const diagnostic={fullName:"Test",email:"test@example.com",companyName:"Company",website:"",currentCrm:"HubSpot",companySize:"1–10",challenge:"Need automation",improvementAreas:["Automation"],preferredMeetingTime:"Tuesday",feeAcknowledged:true};
function storage(): KeyStorage {const map=new Map<string,string>();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>{map.set(k,v);}};}
async function envelope(form:"contact"|"diagnostic"){ const payload=form==="contact"?ProposedContactSchema.parse(contact):DiagnosticSchema.parse(diagnostic);return {payload,identity:await prepareStableSubmission(form,payload,storage())};}
describe("offline cutover adapters",()=>{
  it.each(["contact","diagnostic"] as const)("keeps %s identity across retry and refresh",async form=>{
    const store=storage(), data=form==="contact"?contact:diagnostic;
    const first=await prepareStableSubmission(form,data,store);expect(await prepareStableSubmission(form,data,store)).toEqual(first);
    await expect(prepareStableSubmission(form,{...data,fullName:"changed"},store)).rejects.toThrow("reconciled");
  });
  it("fails closed without durable browser storage",async()=>{
    await expect(prepareStableSubmission("contact",contact,{getItem:()=>null,setItem:()=>{throw new Error("storage unavailable");}})).rejects.toThrow("storage unavailable");
  });
  it("preserves contact fields, assessment, owner recipient and reply-to",async()=>{
    const h=makeHarness(), raw=await envelope("contact");const result=await proposedContactHandler(raw,{writer,fetchImpl:h.fetchImpl});
    const record=h.records()[0];expect(record.submission.row).toEqual([raw.identity.timestamp,"Test","Company","test@example.com","123","example.com","Zoho","Need integration","Tuesday","Referral","Consulting","Small"]);
    expect(record.submission.assessment).toEqual(contact.assessment);
    expect(record.submission.emails.owner.to).toBe("dhruvozone38@gmail.com");expect(record.submission.emails.owner.replyTo).toBe("test@example.com");expect(h.sends).toHaveLength(1);expect(result.emails.prospect.state).toBe("na");expect(result.emails.owner.delivery).toBe("unconfirmed");expect(processingComplete(result)).toBe(true);
    expect(await proposedContactHandler(raw,{writer,fetchImpl:h.fetchImpl})).toMatchObject({duplicate:true});expect(h.sends).toHaveLength(1);
  });
  it("preserves diagnostic row values, fee acknowledgement and separate prospect outcome",async()=>{
    const h=makeHarness(),raw=await envelope("diagnostic");h.fault("prospect_send");
    const result=await proposedDiagnosticHandler(raw,{writer,fetchImpl:h.fetchImpl});
    expect(h.records()[0].submission.row.slice(11)).toEqual(["Yes","New",""]);expect(h.records()[0].submission.row[0]).toBe(raw.identity.id);
    expect(result.emails.owner.state).toBe("accepted");expect(result.emails.prospect.state).toBe("unknown");expect(processingComplete(result)).toBe(false);
    await proposedDiagnosticHandler(raw,{writer,fetchImpl:h.fetchImpl});expect(h.sends).toHaveLength(2);
  });
  it.each(["contact","diagnostic"] as const)("%s handler rejects HTTP 200 ok:false without a fallback",async form=>{
    const spy=vi.fn(async()=>Response.json({ok:false,error:"unauthorized"}));const handler=form==="contact"?proposedContactHandler:proposedDiagnosticHandler;
    await expect(handler(await envelope(form),{writer,fetchImpl:spy})).rejects.toThrow("Writer rejected");expect(spy).toHaveBeenCalledTimes(1);expect(spy.mock.calls[0]?.[0]).toBe(writer.url);
  });
  it.each(["contact","diagnostic"] as const)("%s bridge retains all identity values and checks body",async form=>{
    const h=makeHarness(),raw=await envelope(form),handler=form==="contact"?proposedContactHandler:proposedDiagnosticHandler;
    const endpoint=`https://growthopsco.lovable.app/api/${form==="contact"?"consultation-lead":"diagnostic-request"}`;
    const bridge=vi.fn(async(_url: unknown,init?: RequestInit)=>{
      const forwarded=JSON.parse(String(init?.body));expect(forwarded.identity).toEqual(raw.identity);expect(String(init?.body)).not.toContain(TEST_WRITER_TOKEN);expect(init?.headers).toMatchObject({"X-GrowthOps-Remote-Bridge":"1"});
      return Response.json(await handler(forwarded,{writer,alreadyBridged:true,fetchImpl:h.fetchImpl}));
    });
    const result=await handler(raw,{bridgeEndpoint:endpoint,fetchImpl:bridge});expect(result.key).toBe(raw.identity.key);expect(result.persistence).toBe("written");
    await expect(handler(raw,{bridgeEndpoint:endpoint,fetchImpl:async()=>Response.json({ok:false})})).rejects.toThrow("Bridge rejected");
    await expect(handler(raw,{bridgeEndpoint:endpoint,alreadyBridged:true,fetchImpl:bridge})).rejects.toThrow("Writer not configured");expect(bridge).toHaveBeenCalledTimes(1);
  });
  it("rejects changed payload with an old identity before transport",async()=>{
    const raw=await envelope("contact"),spy=vi.fn();raw.payload.fullName="Changed";
    await expect(proposedContactHandler(raw,{writer,fetchImpl:spy})).rejects.toThrow("key_payload_mismatch");expect(spy).not.toHaveBeenCalled();
  });
  it("fails closed without writer or bridge configuration",async()=>{
    const spy=vi.fn();await expect(proposedContactHandler(await envelope("contact"),{fetchImpl:spy})).rejects.toThrow("Writer not configured");expect(spy).not.toHaveBeenCalled();
  });
  it("active routes and forms stay disconnected from the offline proposal",()=>{
    for (const path of ["src/routes/api/consultation-lead.ts","src/routes/api/diagnostic-request.ts","src/components/site/Contact.tsx","src/components/site/DiagnosticForm.tsx"]){expect(readFileSync(path,"utf8")).not.toMatch(/proposed-submission|apps-script-writer/);}
  });
});
