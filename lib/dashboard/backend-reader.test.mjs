import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';

const require = createRequire(import.meta.url), ts = require('typescript');
const root = path.dirname(fileURLToPath(import.meta.url));
const cache = new Map();
let serverFactoryCalls = 0;
function load(relative) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = {exports: {}}; cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {fileName: filename, compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
  const localRequire = name => {
    if (name === 'server-only') return {};
    if (name === '@supabase/ssr') return {createServerClient: () => {serverFactoryCalls++; throw new Error('Network client must not be created by an unconfigured read');}};
    if (name === 'next/headers') return {cookies: async () => {throw new Error('Request cookies must not be read without configuration');}};
    if (name.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(filename), name + '.ts')));
    return require(name);
  };
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  return module.exports;
}
const {readDashboardCore, dashboardPaidAccess} = load('./backend-reader.ts');
const {dashboardBackendConfig, readDashboardFromServer} = load('./backend-server.ts');
const {dashboardMetricReadout} = load('./backend-readout.ts');
const userId = '11111111-1111-4111-8111-111111111111', otherId = '22222222-2222-4222-8222-222222222222';
const reportId = '33333333-3333-4333-8333-333333333333', pendingId = '44444444-4444-4444-8444-444444444444';
const now = Date.parse('2026-09-21T12:00:00Z');
function data() {
  return {
    profiles: [{id:userId, first_name:'Synthetic', onboarding_completed:true, privacy_accepted_at:'2026-06-01T10:00:00Z', subscription_status:'active', subscription_period_end:'2026-10-01T00:00:00Z', full_panel_purchased_at:null, current_ba:31.2, current_ba_method:'Comprehensive', current_ba_n_labs_averaged:2, current_ba_window_months:6, current_ba_n_markers_used:20, current_ba_computed_at:'2026-09-20T12:00:00Z'}],
    lab_results: [
      {id:reportId, user_id:userId, source:'echevarne', status:'ready', collection_date:'2026-09-12', created_at:'2026-09-13T12:00:00Z', biological_age:32, biological_age_comprehensive:31, bio_age_method:'KDM_v2.2_ReferenceBA', bio_age_n_markers:14, bio_age_applied_spanish_calibration:null, longevity_score:82, longevity_grade:'Very Good', summary_narrative:'Synthetic persisted English narrative.', summary_narrative_es:'Narrativa sintética persistida.'},
      {id:pendingId, user_id:userId, source:'upload', status:'pending_context', collection_date:'2026-09-20', created_at:'2026-09-20T12:00:00Z', longevity_score:99, summary_narrative_es:'Must not leak pending narrative.'},
      {id:'55555555-5555-4555-8555-555555555555', user_id:otherId, status:'ready', collection_date:'2026-09-21', created_at:'2026-09-21T12:00:00Z', longevity_score:97, summary_narrative_es:'Must not leak another user.'},
    ],
    biomarker_values:[
      {lab_result_id:reportId, biomarker_key:'apob', biomarker_name:'ApoB', value:78, unit:'mg/dL', zone:'optimal', optimal_low:45, optimal_high:90, reported_value:0.78, reported_unit:'g/L'},
      {lab_result_id:reportId, biomarker_key:'creatinine'},
    ],
  };
}
function client(db = data(), options = {}) {
  const reads = [], queryErrors = options.queryErrors ?? [];
  return {
    reads,
    auth:{getUser:async () => ({data:{user:options.user === undefined ? {id:userId} : options.user},error:options.authError ?? null})},
    from(table) {
      const query = {table, columns:'', filters:[], orders:[], limit:Infinity, single:false};
      const builder = {
        select(columns){query.columns=columns;return builder;},
        eq(key,value){query.filters.push([key,value]);return builder;},
        order(key,value){query.orders.push([key,value]);return builder;},
        limit(value){query.limit=value;return builder;},
        maybeSingle(){query.single=true;return builder;},
        // Mirrors Supabase’s awaitable PostgREST query builder.
        // eslint-disable-next-line unicorn/no-thenable
        then(resolve,reject){
          reads.push(query);
          if(options.throwRead)return Promise.reject(new Error('private error payload')).then(resolve,reject);
          if(queryErrors.includes(table))return Promise.resolve({data:null,error:{message:'private database details'}}).then(resolve,reject);
          let rows = structuredClone(db[table] ?? []).filter(value=>query.filters.every(([key,wanted])=>value[key]===wanted));
          rows.sort((a,b)=>{for(const[key,{ascending}]of query.orders){const c=String(a[key]).localeCompare(String(b[key]));if(c)return ascending?c:-c;}return 0;});
          rows=rows.slice(0,query.limit).map(value=>Object.fromEntries(query.columns.split(',').map(key=>[key,value[key]])));
          let result = query.single ? rows[0] ?? null : rows;
          if(options.tamper)result = options.tamper(query,result);
          return Promise.resolve({data:result,error:null}).then(resolve,reject);
        },
      };
      return builder;
    },
  };
}

test('reads only owned latest ready report; a newer pending result stays separate', async () => {
  const c = client(), result = await readDashboardCore(c,now);
  assert.equal(result.status,'ready');
  const s=result.snapshot;
  assert.equal(s.source,'backend'); assert.equal(s.readOnly,true);
  assert.equal(s.report.id,reportId); assert.equal(s.report.source,'echevarne');
  assert.equal(s.core.biologicalAge,31.2); assert.equal(s.core.ageSource,'profile'); assert.equal(s.core.evaScore,82);
  assert.equal(s.core.ageComputedAt,'2026-09-20T12:00:00Z');
  assert.equal(s.summary.reportId,reportId); assert.equal(s.summary.es,'Narrativa sintética persistida.');
  assert.equal(s.summary.collectionDate,'2026-09-12');
  assert.deepEqual(s.pending,[{id:pendingId,collectionDate:'2026-09-20',status:'pending_context'}]);
  assert.doesNotMatch(JSON.stringify(s),/Must not leak|11111111|privacy_accepted_at|subscription_status/);
  for(const q of c.reads){assert.notEqual(q.columns,'*');assert.ok(q.filters.some(([_key,id])=>id===(q.table==='biomarker_values'?reportId:userId)));}
});

test('no verified user, anonymous session, or rejected Auth prevents every database read', async () => {
  for(const options of [{user:null},{user:{id:userId,is_anonymous:true}},{authError:{message:'expired'}},{user:{id:'invalid'}}]){
    const c=client(data(),options);assert.deepEqual(await readDashboardCore(c,now),{status:'unauthenticated'});assert.equal(c.reads.length,0);
  }
});

test('profile/consent/onboarding/paid gates never fetch or serialize health fields', async () => {
  for(const[field,value,status]of [['privacy_accepted_at',null,'consent_required'],['privacy_accepted_at','bad','consent_required'],['onboarding_completed',false,'onboarding_required'],['subscription_status','past_due','access_required']]){
    const db=data();db.profiles[0][field]=value;const c=client(db);
    assert.deepEqual(await readDashboardCore(c,now),{status});assert.equal(c.reads.length,1);
    assert.doesNotMatch(c.reads[0].columns,/current_ba|narrative|longevity/);
  }
  const db=data();db.profiles=[];const c=client(db);assert.deepEqual(await readDashboardCore(c,now),{status:'profile_missing'});assert.equal(c.reads.length,1);
});

test('paid rules keep full-panel purchases, exact three-day boundary, and legacy null period', () => {
  const p=data().profiles[0];
  assert.equal(dashboardPaidAccess({...p,subscription_status:'cancelled',full_panel_purchased_at:'2026-01-01T00:00:00Z'},now),true);
  assert.equal(dashboardPaidAccess({...p,subscription_period_end:'2026-09-18T12:00:00Z'},now),false);
  assert.equal(dashboardPaidAccess({...p,subscription_period_end:'2026-09-18T12:00:01Z'},now),true);
  assert.equal(dashboardPaidAccess({...p,subscription_period_end:null},now),true);
  assert.equal(dashboardPaidAccess({...p,subscription_period_end:'invalid'},now),false);
  assert.equal(dashboardPaidAccess({...p,subscription_status:'past_due',full_panel_purchased_at:'invalid'},now),false);
});

test('report age fallback, independent nulls and zero sentinel never invent score or grade', async () => {
  for(const value of [0,-1,101,NaN,Infinity,null]){
    const db=data();db.profiles[0].current_ba=null;db.lab_results[0].longevity_score=value;
    const {snapshot:s}=await readDashboardCore(client(db),now);
    assert.equal(s.core.biologicalAge,32);assert.equal(s.core.ageSource,'report');assert.equal(s.core.ageComputedAt,null);
    assert.equal(s.core.evaScore,null);assert.equal(s.core.longevityGrade,null);assert.equal(s.report.longevity_grade,null);
  }
  const db=data();db.profiles[0].current_ba=-4;db.lab_results[0].biological_age=null;db.lab_results[0].longevity_grade=null;
  const {snapshot:s}=await readDashboardCore(client(db),now);
  assert.equal(s.core.biologicalAge,null);assert.equal(s.core.ageSource,null);assert.equal(s.core.evaScore,82);assert.equal(s.core.longevityGrade,null);
  for(const value of [1,100]){db.lab_results[0].longevity_score=value;assert.equal((await readDashboardCore(client(db),now)).snapshot.core.evaScore,value);}
});

test('missing language stays null; stored narrative is not generated or translated', async () => {
  const db=data();db.lab_results[0].summary_narrative_es=null;db.lab_results[0].bio_age_method=null;
  const {snapshot:s}=await readDashboardCore(client(db),now);
  assert.equal(s.summary.es,null);assert.equal(s.summary.en,'Synthetic persisted English narrative.');assert.equal(s.report.bio_age_method,null);
});

test('result mapping preserves the owned row, exact keys, units, source zone and specimen date', async () => {
  const db=data();
  db.biomarker_values.push({lab_result_id:otherId,biomarker_key:'apob',biomarker_name:'Foreign result',value:999,unit:'foreign',zone:'critical_high'});
  const c=client(db),{snapshot:s}=await readDashboardCore(c,now);
  assert.deepEqual(s.reportResults[0],{key:'apob',label:'ApoB',reportId,value:78,unit:'mg/dL',zone:'optimal',optimalLow:45,optimalHigh:90,collectionDate:'2026-09-12',reportedValue:'0.78',reportedUnit:'g/L'});
  assert.equal(s.reportResults.length,2);
  assert.ok(s.reportResults.every(item=>item.reportId===s.report.id&&item.collectionDate===s.report.collectionDate));
  assert.doesNotMatch(JSON.stringify(s.reportResults),/Foreign result|999|foreign/);
  const query=c.reads.find(item=>item.table==='biomarker_values');
  assert.ok(query.columns.includes('biomarker_name,value,unit,zone,optimal_low,optimal_high'));
  assert.deepEqual(query.filters,[['lab_result_id',reportId]]);
});

test('missing and malformed result fields remain unavailable; zero and original qualifiers survive', async () => {
  const db=data(),row=db.biomarker_values[0];
  Object.assign(row,{value:0,unit:'mg/dL',zone:'critical_low',optimal_low:0,optimal_high:null,reported_value:'<0.1',reported_unit:'mg/L'});
  let s=(await readDashboardCore(client(db),now)).snapshot;
  assert.equal(s.reportResults[0].value,0);assert.equal(s.reportResults[0].optimalLow,0);
  assert.equal(s.reportResults[0].zone,'critical_low');assert.equal(s.reportResults[0].reportedValue,'<0.1');
  assert.deepEqual(s.reportResults[1],{key:'creatinine',label:'creatinine',reportId,value:null,unit:null,zone:null,optimalLow:null,optimalHigh:null,collectionDate:'2026-09-12',reportedValue:null,reportedUnit:null});
  Object.assign(row,{value:Infinity,unit:' ',zone:'normal',optimal_low:NaN,optimal_high:Infinity,reported_value:Infinity});
  s=(await readDashboardCore(client(db),now)).snapshot;
  for(const key of ['value','unit','zone','optimalLow','optimalHigh','reportedValue'])assert.equal(s.reportResults[0][key],null);
});

test('reader does not derive a replacement zone or choose an arbitrary duplicate result', async () => {
  const db=data();Object.assign(db.biomarker_values[0],{value:500,zone:'optimal',optimal_low:90,optimal_high:45});
  const s=(await readDashboardCore(client(db),now)).snapshot;
  assert.equal(s.reportResults[0].zone,'optimal');assert.equal(s.reportResults[0].optimalLow,90);assert.equal(s.reportResults[0].optimalHigh,45);
  db.biomarker_values.push({...db.biomarker_values[0],value:20});
  assert.deepEqual(await readDashboardCore(client(db),now),{status:'invalid_data'});
});

test('birth dates stay outside the snapshot until an estimate reference date is verified', async () => {
  for(const date_of_birth of ['1992-04-18','1992-02-31',null,undefined]){
    const db=data();db.profiles[0].date_of_birth=date_of_birth;
    const c=client(db),{snapshot:s}=await readDashboardCore(c,now);
    assert.equal(s.core.ageComputedAt,'2026-09-20T12:00:00Z');
    assert.ok(c.reads.every(query=>!query.columns.includes('date_of_birth')));
    assert.equal('dateOfBirth' in s.profile,false);assert.equal('chronologicalAge' in s.core,false);
    const mapped=dashboardMetricReadout(s);
    assert.equal('dateOfBirth' in mapped.profile,false);assert.equal('ageReferenceDate' in mapped,false);
  }
});

test('empty/pending-only report set, empty markers, and malformed ownership fail closed', async () => {
  const db=data();db.lab_results=db.lab_results.filter(value=>value.status!=='ready');
  assert.deepEqual(await readDashboardCore(client(db),now),{status:'no_ready_report'});
  const empty=data();empty.biomarker_values=[];assert.deepEqual(await readDashboardCore(client(empty),now),{status:'invalid_data'});
  for(const target of ['profiles','lab_results','biomarker_values']){
    const c=client(data(),{tamper:(q,r)=>q.table===target ? Array.isArray(r)?r.map(value=>({...value,lab_result_id:otherId,user_id:otherId})):({...r,id:otherId,user_id:otherId}):r});
    assert.deepEqual(await readDashboardCore(c,now),{status:'invalid_data'});
  }
});

test('any read error discards the snapshot and private error details', async () => {
  for(const table of ['profiles','lab_results','biomarker_values'])assert.deepEqual(await readDashboardCore(client(data(),{queryErrors:[table]}),now),{status:'unavailable'});
  assert.deepEqual(await readDashboardCore(client(data(),{throwRead:true}),now),{status:'unavailable'});
});

test('profile removal during the read discards values already fetched', async () => {
  const c=client(data(),{tamper:(query,result)=>query.table==='profiles'&&query.columns.includes('current_ba')?null:result});
  assert.deepEqual(await readDashboardCore(c,now),{status:'profile_missing'});
});

test('metric mapping adds only verified readiness gates, without making a full synthetic profile', async () => {
  const {snapshot}=await readDashboardCore(client(),now);
  const value=dashboardMetricReadout(snapshot);
  assert.equal(value.report.date,'2026-09-12');assert.equal(value.report.id,reportId);assert.equal(value.report.status,'ready');
  assert.equal(value.report.contextComplete,true);assert.equal(value.profile.healthConsent,true);assert.equal(value.paid,true);
  assert.equal(value.profile.current_ba,31.2);assert.equal(value.report.biologicalAge,32);
  assert.deepEqual(value.reportResults,snapshot.reportResults);
  assert.equal('source' in value.report,false);assert.equal('name' in value.report,false);assert.equal('address' in value.profile,false);
});

test('configuration accepts public credentials only; missing config cannot instantiate a network client', async () => {
  const jwt=role=>`header.${Buffer.from(JSON.stringify({role})).toString('base64url')}.signature`;
  const url='https://synthetic.supabase.co';
  assert.equal(dashboardBackendConfig({}),null);
  for(const key of ['sb_secret_private',jwt('service_role'),'arbitrary-key'])assert.equal(dashboardBackendConfig({NEXT_PUBLIC_SUPABASE_URL:url,NEXT_PUBLIC_SUPABASE_ANON_KEY:key}),null);
  assert.deepEqual(dashboardBackendConfig({NEXT_PUBLIC_SUPABASE_URL:url,NEXT_PUBLIC_SUPABASE_ANON_KEY:jwt('anon')}),{url,publicKey:jwt('anon')});
  assert.deepEqual(dashboardBackendConfig({NEXT_PUBLIC_SUPABASE_URL:url,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic'}),{url,publicKey:'sb_publishable_synthetic'});
  for(const invalid of ['http://remote.invalid','https://user:pass@remote.invalid','https://remote.invalid/path','https://remote.invalid/?query=1'])assert.equal(dashboardBackendConfig({NEXT_PUBLIC_SUPABASE_URL:invalid,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_synthetic'}),null);
  const names=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'];
  const saved=Object.fromEntries(names.map(name=>[name,process.env[name]]));
  try{names.forEach(name=>delete process.env[name]);assert.deepEqual(await readDashboardFromServer(),{status:'unconfigured'});assert.equal(serverFactoryCalls,0);}
  finally{for(const[name,value]of Object.entries(saved)){if(value===undefined)delete process.env[name];else process.env[name]=value;}}
});
