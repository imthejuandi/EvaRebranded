import 'server-only';
import type {DashboardReadClient,DashboardQuery,DashboardReadStatus} from '../dashboard/backend-contract';
import {readDashboardCore,DASHBOARD_AUTH_COLUMNS,dashboardPaidAccess} from '../dashboard/backend-reader';
import {biomarkerHistory,validHistoryDate,type BiomarkerObservation} from './biomarker-history';

interface HistoryQuery extends DashboardQuery {
  select(columns:string):HistoryQuery; eq(column:string,value:string):HistoryQuery;
  order(column:string,options:{ascending:boolean;referencedTable?:string}):HistoryQuery;
  limit(count:number):HistoryQuery; maybeSingle():HistoryQuery;
  lte(column:string,value:string):HistoryQuery; range(from:number,to:number):HistoryQuery;
}
export interface LabsHistoryClient extends DashboardReadClient {from(table:string):HistoryQuery}
export type LabsHistoryResult = {status:DashboardReadStatus} | {status:'ready';snapshot:{
  source:'backend';reportId:string;collectionDate:string;
  summary:{es:string|null;en:string|null};observations:BiomarkerObservation[];
  /** Existing prose may use a different historical window; do not relabel it as generated from the chart. */
  narrativeScope:'stored-report';
}};
type Row=Record<string,unknown>;
const row=(v:unknown):Row|null=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Row:null;
const text=(v:unknown):string|null=>typeof v==='string'&&v.trim()?v:null;
const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const number=(v:unknown):number|null=>typeof v==='number'&&Number.isFinite(v)?v:null;
const zones=new Set(['critical_low','below_optimal','optimal','above_optimal','critical_high','unclassified']);
export const HISTORY_COLUMNS='lab_result_id,biomarker_key,biomarker_name,value,unit,zone,comparator,interpretation,interpretation_es,lab_results!inner(id,user_id,collection_date,source,status)';
export const HISTORY_REPORT_COLUMNS='id,user_id,status,collection_date,summary_narrative,summary_narrative_es';

/** Real session + ownership + readiness. No service key, mutations, cached patient text or demo fallback. */
export async function readLabsHistory(client:LabsHistoryClient,reportId?:string,now=Date.now()):Promise<LabsHistoryResult> {
  try {
    const access=await readDashboardCore(client,now);
    if(access.status!=='ready')return {status:access.status};
    const identity=await client.auth.getUser(), user=identity.data?.user;
    if(identity.error||!user||user.is_anonymous||!uuid(user.id))return {status:'unauthenticated'};
    const id=reportId??access.snapshot.report.id;
    if(!uuid(id))return {status:'invalid_data'};
    const selected=await client.from('lab_results').select(HISTORY_REPORT_COLUMNS).eq('id',id).eq('user_id',user.id).eq('status','ready').maybeSingle();
    if(selected.error)return {status:'unavailable'};
    const report=row(selected.data);
    if(!report)return {status:'no_ready_report'};
    if(report.id!==id||report.user_id!==user.id||report.status!=='ready'||typeof report.collection_date!=='string'||!validHistoryDate(report.collection_date))return {status:'invalid_data'};
    const all:BiomarkerObservation[]=[],seen=new Set<string>();
    // Page through authorized metadata, then trim each marker to its own latest-sample year.
    // A cap/error fails explicitly; it never masquerades as a complete history.
    const batch=500, maximum=12000;
    for(let offset=0;offset<=maximum;offset+=batch){
      const response=await client.from('biomarker_values').select(HISTORY_COLUMNS)
        .eq('lab_results.user_id',user.id).eq('lab_results.status','ready')
        .lte('lab_results.collection_date',report.collection_date)
        .order('id',{ascending:true}).range(offset,offset+batch-1);
      if(response.error)return {status:'unavailable'};
      if(!Array.isArray(response.data))return {status:'invalid_data'};
      if(offset===maximum&&response.data.length)return {status:'unavailable'};
      for(const raw of response.data){
        const value=row(raw), lab=row(value?.lab_results);
        if(!value||!lab||lab.user_id!==user.id||lab.status!=='ready'||!uuid(lab.id)||value.lab_result_id!==lab.id||!text(value.biomarker_key)||typeof lab.collection_date!=='string'||!validHistoryDate(lab.collection_date)||lab.collection_date>report.collection_date)return {status:'invalid_data'};
        if(value.comparator!=null&&value.comparator!=='<'&&value.comparator!=='>')return {status:'invalid_data'};
        const key=value.biomarker_key as string, identityKey=lab.id+':'+key;
        if(seen.has(identityKey))return {status:'invalid_data'};
        seen.add(identityKey);
        all.push({reportId:lab.id,key,name:text(value.biomarker_name)??key,date:lab.collection_date,
          value:number(value.value),unit:text(value.unit),source:text(lab.source),
          zone:zones.has(String(value.zone))?value.zone as BiomarkerObservation['zone']:null,
          comparator:value.comparator==='<'||value.comparator==='>'?value.comparator:null,
          interpretation:{es:text(value.interpretation_es),en:text(value.interpretation)}});
      }
      if(response.data.length<batch)break;
    }
    // Long pagination must not outlive a revoked consent or removed account.
    const recheck=await client.auth.getUser();
    if(recheck.error||recheck.data?.user?.id!==user.id||recheck.data.user.is_anonymous)return {status:'unauthenticated'};
    const permission=await client.from('profiles').select(DASHBOARD_AUTH_COLUMNS).eq('id',user.id).maybeSingle();
    if(permission.error)return {status:'unavailable'};
    const profile=row(permission.data);
    if(!profile)return {status:'profile_missing'};
    if(profile.id!==user.id)return {status:'invalid_data'};
    if(profile.onboarding_completed!==true)return {status:'onboarding_required'};
    if(!text(profile.privacy_accepted_at)||!Number.isFinite(Date.parse(profile.privacy_accepted_at as string)))return {status:'consent_required'};
    if(!dashboardPaidAccess(profile,now))return {status:'access_required'};
    const keys=Array.from(new Set(all.filter(p=>p.reportId===id).map(p=>p.key)));
    const observations=keys.flatMap(key=>biomarkerHistory(all,key,report.collection_date as string,id).records);
    return {status:'ready',snapshot:{source:'backend',reportId:id,collectionDate:report.collection_date,
      summary:{es:text(report.summary_narrative_es),en:text(report.summary_narrative)},observations,narrativeScope:'stored-report'}};
  }catch{return {status:'unavailable'};}
}
