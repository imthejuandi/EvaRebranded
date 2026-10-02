/** Exercises the real pinned SDK against intercepted synthetic HTTP; never contacts a project. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';

const require = createRequire(import.meta.url), ts = require('typescript');
const sdkRequire = process.env.EVA_DASHBOARD_SDK_ROOT ? createRequire(path.join(process.env.EVA_DASHBOARD_SDK_ROOT,'package.json')) : require;
const sdk = sdkRequire('@supabase/ssr');
const root = path.dirname(fileURLToPath(import.meta.url));
const userId='11111111-1111-4111-8111-111111111111', reportId='33333333-3333-4333-8333-333333333333';
const part=value=>Buffer.from(JSON.stringify(value)).toString('base64url');
const accessToken=`${part({alg:'HS256',typ:'JWT'})}.${part({sub:userId,role:'authenticated',aud:'authenticated',exp:4102444800})}.synthetic-signature`;
const anonymousKey=`${part({alg:'HS256',typ:'JWT'})}.${part({role:'anon',exp:4102444800})}.synthetic-signature`;
const user={id:userId,aud:'authenticated',role:'authenticated',email:'synthetic@example.invalid',created_at:'2026-01-01T00:00:00Z',app_metadata:{provider:'email'},user_metadata:{}};
const session={access_token:accessToken,refresh_token:'synthetic-refresh',token_type:'bearer',expires_at:4102444800,expires_in:31536000,user};

async function exercise({signedIn=true,consent=true,authRejected=false,history=false,revokeAfterHistory=false}={}) {
  const calls=[], cookieWrites=[];
  const cookieJar=signedIn?[{name:'sb-synthetic-auth-token',value:'base64-'+Buffer.from(JSON.stringify(session)).toString('base64url')}]:[];
  const moduleCache=new Map();
  function load(relative){
    const filename=path.resolve(root,relative);if(moduleCache.has(filename))return moduleCache.get(filename).exports;
    const module={exports:{}};moduleCache.set(filename,module);
    const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    const localRequire=name=>{
      if(name==='server-only')return {};
      if(name==='@supabase/ssr')return sdk;
      if(name==='next/headers')return {cookies:async()=>({getAll:()=>cookieJar,set:(...args)=>cookieWrites.push(args)})};
      return name.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(filename),name+'.ts'))):require(name);
    };
    new Function('require','module','exports',code)(localRequire,module,module.exports);return module.exports;
  }
  const originalFetch=globalThis.fetch;
  const envNames=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'];
  const originalEnv=Object.fromEntries(envNames.map(name=>[name,process.env[name]]));
  try{
    process.env.NEXT_PUBLIC_SUPABASE_URL='https://synthetic.supabase.co';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=anonymousKey;delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    globalThis.fetch=async(input,init)=>{
      const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);
      const headers=new Headers(init?.headers);
      calls.push({pathname:url.pathname,query:Object.fromEntries(url.searchParams),method:init?.method??'GET',cache:init?.cache,authorization:headers.get('authorization'),apikey:headers.get('apikey')});
      assert.equal(url.origin,'https://synthetic.supabase.co');
      assert.equal(init?.method??'GET','GET','The live reader is read-only');
      const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
      if(url.pathname==='/auth/v1/user')return authRejected?json({code:'session_not_found',msg:'Synthetic rejection'},401):json(user);
      assert.equal(headers.get('authorization'),`Bearer ${accessToken}`);
      assert.equal(headers.get('apikey'),anonymousKey);
      if(url.pathname==='/rest/v1/profiles'){
        assert.equal(url.searchParams.get('id'),`eq.${userId}`);
        if(url.searchParams.get('select').includes('privacy_accepted_at'))return json({id:userId,first_name:'Synthetic',onboarding_completed:true,privacy_accepted_at:consent?'2026-01-01T00:00:00Z':null,subscription_status:'active',subscription_period_end:null,full_panel_purchased_at:null});
        return json({id:userId,current_ba:28.4,current_ba_method:'Reference',current_ba_n_labs_averaged:1,current_ba_window_months:null,current_ba_n_markers_used:14,current_ba_computed_at:'2026-09-20T00:00:00Z'});
      }
      if(url.pathname==='/rest/v1/lab_results'){
        assert.equal(url.searchParams.get('user_id'),`eq.${userId}`);
        if(url.searchParams.get('status')==='eq.pending_context')return json([]);
        if(url.searchParams.get('id')){assert.equal(url.searchParams.get('id'),`eq.${reportId}`);return json({id:reportId,user_id:userId,status:'ready',collection_date:'2026-09-12',summary_narrative_es:'Resumen longitudinal persistido.',summary_narrative:null});}
        assert.equal(url.searchParams.get('status'),'eq.ready');assert.equal(url.searchParams.get('order'),'collection_date.desc,created_at.desc');assert.equal(url.searchParams.get('limit'),'1');
        return json({id:reportId,user_id:userId,collection_date:'2026-09-12',source:'echevarne',status:'ready',biological_age:29,longevity_score:82,summary_narrative_es:'Solo texto sintético del servidor.',summary_narrative:null});
      }
      if(url.pathname==='/rest/v1/biomarker_values'){
        if(url.searchParams.get('select').includes('lab_results!inner')){
          assert.equal(url.searchParams.get('lab_results.user_id'),`eq.${userId}`);
          assert.equal(url.searchParams.get('lab_results.status'),'eq.ready');
          assert.equal(url.searchParams.get('lab_results.collection_date'),'lte.2026-09-12');
          assert.equal(url.searchParams.get('limit'),'500');
          if(revokeAfterHistory)consent=false;
          return json([
            {lab_result_id:reportId,biomarker_key:'apob',biomarker_name:'ApoB',value:78,unit:'mg/dL',zone:'optimal',comparator:null,interpretation_es:'Interpretación longitudinal persistida.',lab_results:{id:reportId,user_id:userId,status:'ready',collection_date:'2026-09-12',source:'echevarne'}},
            {lab_result_id:'44444444-4444-4444-8444-444444444444',biomarker_key:'apob',biomarker_name:'ApoB',value:88,unit:'mg/dL',zone:'optimal',comparator:null,lab_results:{id:'44444444-4444-4444-8444-444444444444',user_id:userId,status:'ready',collection_date:'2026-03-12',source:'upload'}},
            {lab_result_id:'55555555-5555-4555-8555-555555555555',biomarker_key:'apob',value:99,unit:'mg/dL',lab_results:{id:'55555555-5555-4555-8555-555555555555',user_id:userId,status:'ready',collection_date:'2024-03-12',source:'upload'}}
          ]);
        }
        assert.equal(url.searchParams.get('lab_result_id'),`eq.${reportId}`);
        assert.ok(url.searchParams.get('select').includes('biomarker_name,value,unit,zone,optimal_low,optimal_high'));
        return json([{lab_result_id:reportId,biomarker_key:'apob',biomarker_name:'ApoB',value:78,unit:'mg/dL',zone:'optimal',optimal_low:45,optimal_high:90}]);
      }
      throw new Error('Unexpected route: intercepted without network');
    };
    const server=load('./backend-server.ts');
    const result=await (history?server.readLabsHistoryFromServer():server.readDashboardFromServer());
    return {result,calls,cookieWrites};
  }finally{
    globalThis.fetch=originalFetch;
    for(const[name,value]of Object.entries(originalEnv)){if(value===undefined)delete process.env[name];else process.env[name]=value;}
  }
}

test('pinned SSR SDK verifies cookie user and performs only scoped no-store GET reads',async()=>{
  const {result,calls}=await exercise();
  assert.equal(result.status,'ready');assert.equal(result.snapshot.core.biologicalAge,28.4);assert.equal(result.snapshot.core.evaScore,82);assert.equal(result.snapshot.summary.es,'Solo texto sintético del servidor.');
  assert.equal(calls[0].pathname,'/auth/v1/user');assert.equal(calls.length,6);
  assert.ok(calls.every(call=>call.method==='GET'&&call.cache==='no-store'));
  assert.equal(result.snapshot.reportResults[0].reportId,reportId);
  assert.equal(result.snapshot.reportResults[0].value,78);
  assert.equal(result.snapshot.reportResults[0].collectionDate,'2026-09-12');
});
test('real SDK with no auth cookie never queries tables',async()=>{
  const {result,calls}=await exercise({signedIn:false});assert.deepEqual(result,{status:'unauthenticated'});assert.equal(calls.length,0);
});
test('real SDK rejects expired/revoked session and denies health reads without consent',async()=>{
  const rejected=await exercise({authRejected:true});assert.deepEqual(rejected.result,{status:'unauthenticated'});assert.ok(rejected.calls.every(call=>call.pathname==='/auth/v1/user'));
  const denied=await exercise({consent:false});assert.deepEqual(denied.result,{status:'consent_required'});assert.deepEqual(denied.calls.map(call=>call.pathname),['/auth/v1/user','/rest/v1/profiles']);
});

test('history server entry uses scoped ready joins, canonical values and active persisted prose',async()=>{
 const {result,calls}=await exercise({history:true});
 assert.equal(result.status,'ready');
 assert.equal(result.snapshot.summary.es,'Resumen longitudinal persistido.');
 assert.equal(result.snapshot.observations.length,2);
 assert.deepEqual(result.snapshot.observations.map(p=>p.value),[88,78]);
 assert.equal(result.snapshot.observations[1].interpretation.es,'Interpretación longitudinal persistida.');
 assert.equal(result.snapshot.narrativeScope,'stored-report');
 assert.ok(calls.every(call=>call.method==='GET'&&call.cache==='no-store'));
 const denied=await exercise({history:true,consent:false});
 assert.equal(denied.result.status,'consent_required');
 assert.ok(!denied.calls.some(call=>call.pathname.includes('biomarker_values')));
});

test('history read discards fetched data if consent is revoked during pagination',async()=>{
 const {result,calls}=await exercise({history:true,revokeAfterHistory:true});
 assert.deepEqual(result,{status:'consent_required'});
 assert.ok(calls.some(call=>call.query.select?.includes('lab_results!inner')));
 assert.equal(calls.at(-1).pathname,'/rest/v1/profiles');
});
