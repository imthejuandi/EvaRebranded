export type DemoReceipt={version:'eva-preview-deletion-v1';simulated:true;operationId:string;receipt:'preview-only';savedAt:number};
export type DemoDeletionPhase='pending'|'complete'|'manual_review';
export const DEMO_RECEIPT_KEY='eva-preview:deletion-receipt:v1';
export const RECEIPT_MAX_SIZE=2048;
export function createDemoReceipt(now=Date.now()):DemoReceipt{return {version:'eva-preview-deletion-v1',simulated:true,operationId:`demo-delete-${now}`,receipt:'preview-only',savedAt:now};}
export function parseDemoReceipt(value:unknown,now=Date.now()):DemoReceipt|null{
 if(!value||typeof value!=='object')return null;const x=value as Partial<DemoReceipt>;
 if(x.version!=='eva-preview-deletion-v1'||x.simulated!==true||x.receipt!=='preview-only'||typeof x.operationId!=='string'||!/^demo-delete-\d{10,16}$/.test(x.operationId)||typeof x.savedAt!=='number'||!Number.isSafeInteger(x.savedAt)||x.operationId!==`demo-delete-${x.savedAt}`||x.savedAt>now||now-x.savedAt>30*86400000)return null;
 return {version:x.version,simulated:true,operationId:x.operationId,receipt:'preview-only',savedAt:x.savedAt};
}
export function storeDemoReceipt(receipt:DemoReceipt){sessionStorage.setItem(DEMO_RECEIPT_KEY,JSON.stringify(receipt));}
export function parseDemoPhase(value:string|null):DemoDeletionPhase{return value==='complete'||value==='manual_review'?value:'pending';}
export function phaseStorageKey(receipt:DemoReceipt){return `${DEMO_RECEIPT_KEY}:${receipt.operationId}:phase`;}
