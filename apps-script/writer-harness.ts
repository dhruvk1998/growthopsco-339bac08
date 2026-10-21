/** Tests execute the actual .gs code; these mocks cannot certify Google locking/quota/permissions. */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";
export const TEST_WRITER_TOKEN = "w".repeat(40);
export const TEST_OPERATOR_TOKEN = "o".repeat(40);
export function makeHarness() {
  const sheets = new Map<string, Sheet>();
  const sends: unknown[] = [];
  let fault: string | undefined;
  let quota = 100;
  let held = false;
  function crash(label: string) { if (fault === label) { fault = undefined; throw new Error("simulated interruption"); } }
  class Sheet {
    cells: unknown[][] = [];
    constructor(public name: string) {}
    getLastRow() { return this.cells.reduce((last, r, i) => r.some(v => v !== "" && v !== undefined) ? i + 1 : last, 0); }
    getRange(row: number, col: number, rows = 1, cols = 1) {
      const read = () => Array.from({length: rows}, (_, i) => Array.from({length:cols}, (_, j) => this.cells[row-1+i]?.[col-1+j] ?? ""));
      const write = (values: unknown[][]) => {
        for (let i=0;i<rows;i++) { const target = this.cells[row-1+i] ?? []; this.cells[row-1+i]=target; for(let j=0;j<cols;j++) target[col-1+j]=values[i][j]; }
        if (this.name === "Submission Ledger" && row > 1) {
          const record = JSON.parse(String(values[0][1]));
          if (record.persistence === "claimed") crash("claim");
          else if (record.emails.owner.state === "sending") crash("owner_intent");
          else if (record.emails.prospect.state === "sending") crash("prospect_intent");
          else if (record.emails.prospect.state === "accepted") crash("prospect_checkpoint");
          else if (record.emails.owner.state === "accepted") crash("owner_checkpoint");
          else crash("written");
        } else if (this.name !== "Submission Ledger" && row > 1) crash("data_write");
      };
      return { getValues: read, getValue: () => read()[0][0], setValues: write, setValue: (v: unknown) => write([[v]]) };
    }
    getDataRange() { return this.getRange(1,1,Math.max(this.getLastRow(),1),Math.max(2,...this.cells.map(r=>r.length))); }
  }
  sheets.set("Database", new Sheet("Database")); sheets.get("Database")?.getRange(1,1).setValue("Submitted At");
  sheets.set("Diagnostic Requests", new Sheet("Diagnostic Requests")); sheets.get("Diagnostic Requests")?.getRange(1,1).setValue("Submission ID");
  const props: Record<string,string> = { WRITER_TOKEN: TEST_WRITER_TOKEN, OPERATOR_TOKEN: TEST_OPERATOR_TOKEN, SPREADSHEET_ID: "test-spreadsheet" };
  const context = vm.createContext({
    PropertiesService: { getScriptProperties: () => ({getProperty: (key: string) => props[key]}) },
    SpreadsheetApp: { openById: (id: string) => { if(id !== "test-spreadsheet") throw new Error("wrong spreadsheet"); return {getSheetByName: (name: string)=>sheets.get(name), insertSheet: (name: string)=>{const sh=new Sheet(name);sheets.set(name,sh);return sh;} }; }, flush: () => {} },
    LockService: { getScriptLock: () => ({ tryLock: () => {if(held)return false;held=true;return true;}, releaseLock: () => {held=false;} }) },
    MailApp: { getRemainingDailyQuota: ()=>quota, sendEmail: (email: {to:string})=>{sends.push(email);crash(email.to === "dhruvozone38@gmail.com" ? "owner_send" : "prospect_send");} },
    Utilities: { DigestAlgorithm: {SHA_256:"sha256"}, Charset:{UTF_8:"utf8"}, computeDigest: (_a:string,value:string)=>Array.from(createHash("sha256").update(value).digest()) },
    ContentService: {MimeType:{JSON:"json"},createTextOutput:(text:string)=>({setMimeType:()=>text})},
  });
  vm.runInContext(readFileSync(new URL("./writer.gs",import.meta.url),"utf8"),context);
  const post = (body: unknown) => JSON.parse(context.doPost({postData:{contents:JSON.stringify(body)}}));
  const fetchImpl = (async (_url: unknown, init?: RequestInit) => new Response(JSON.stringify(post(JSON.parse(String(init?.body)))),{status:200})) as typeof fetch;
  return {post,fetchImpl,sends,sheets,props, fault: (label:string)=>{fault=label;}, quota:(q:number)=>{quota=q;}, hold: (v:boolean)=>{held=v;}, records:()=>sheets.get("Submission Ledger")?.cells.slice(1).filter(r=>r[0]).map(r=>JSON.parse(String(r[1]))) ?? []};
}
