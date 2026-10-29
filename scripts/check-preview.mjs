import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
const root=process.cwd();
async function moduleUrl(file){const source=await fs.readFile(file,'utf8');let js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;for(const match of [...js.matchAll(/from\s+(['"])(\.[^'"]+)\1/g)]){const target=path.resolve(path.dirname(file),match[2]);const dependency=await moduleUrl(target.endsWith('.ts')?target:target+'.ts');js=js.replace(match[0],`from '${dependency}'`);}return 'data:text/javascript;base64,'+Buffer.from(js).toString('base64');}
async function moduleOf(file){return import(await moduleUrl(file));}
const{createFixture,sampleMarkers}=await moduleOf('lib/preview/fixtures.ts');
const{safeReturn,previewTransport,backendBindings}=await moduleOf('lib/preview/adapter.ts');
const checks=[];
for(const scenario of ['ready','new','kit','processing','context','error']){
 const state=createFixture(scenario);assert.equal(new Set(state.markers.map(m=>m.key)).size,15);
 for(const report of state.reports){assert(report.markerKeys.every(k=>state.markers.some(m=>m.key===k)));if(report.status!=='ready'){assert(report.biologicalAge==null);assert(report.longevityScore==null)}}
 if(scenario==='new'){assert.equal(state.plan,'free');assert.equal(state.reports.length,0)}
 checks.push(`Coherent ${scenario} fixture`);
}
assert.equal(safeReturn('https://evil.example'),'/es/dashboard');assert.equal(safeReturn('//evil.example'),'/es/dashboard');assert.equal(safeReturn('/es/../..//evil.example'),'/es/dashboard');assert.equal(safeReturn('/es/labs/demo-junio'),'/es/labs/demo-junio');
checks.push('Authentication return paths remain local');
const success=await previewTransport.execute('report.save');const failure=await previewTransport.execute('upload.extract',{simulateError:true});assert(success.ok&&success.simulated);assert(!failure.ok&&failure.simulated);checks.push('Mock transport success/failure has no production side effects');
assert(Object.keys(backendBindings).length>=20);checks.push('Backend boundary is documented');
const routeDir='dist/client';const paths=[];async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())await walk(p);else if(p.endsWith('.html'))paths.push(p)}}await walk(routeDir);
const missing=[];const brokenAnchors=[];const seen=new Map();
// Authenticated content appears after preview hydration; its declared target is checked in source and browser QA.
const clientAnchors={'/es/profile#direccion':{file:'components/pages/profile/ProfilePage.tsx',id:'direccion'}};
for(const file of paths){const html=await fs.readFile(file,'utf8');seen.set(file,html);for(const match of html.matchAll(/href="([^"<>]+)"/g)){const href=match[1].replaceAll('&amp;','&');if(!href.startsWith('/')||href.startsWith('//')||href.startsWith('/@')||href.startsWith('/node_modules'))continue;const url=new URL(href,'https://example.local');const pathname=decodeURIComponent(url.pathname);const candidates=pathname==='/'?['index.html']:[pathname.slice(1),pathname.slice(1)+'.html',path.join(pathname.slice(1),'index.html')];let target;for(const candidate of candidates){try{if((await fs.stat(path.join(routeDir,candidate))).isFile()){target=path.join(routeDir,candidate);break}}catch{}}
 if(!target){missing.push({from:file,href});continue}if(url.hash&&target.endsWith('.html')){const targetHtml=seen.get(target)||await fs.readFile(target,'utf8');if(!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)){const declared=clientAnchors[url.pathname+url.hash];if(!declared||!(await fs.readFile(declared.file,'utf8')).includes(`id="${declared.id}"`))brokenAnchors.push({from:file,href})}}
 }}
assert.deepEqual(missing,[],'Unresolved internal links: '+JSON.stringify(missing.slice(0,12)));
assert.deepEqual(brokenAnchors,[],'Unresolved anchors: '+JSON.stringify(brokenAnchors.slice(0,12)));
checks.push(`Internal links and anchors verified across ${paths.length} pages`);
for(const route of ['es/how-it-works','es/science','es/pricing','es/about','es/blog','es/contact','es/login','es/signup','es/onboarding','es/dashboard','es/labs','es/upload','es/book','es/eva-ai','es/profile','es/privacy/deletion','es/admin','es/beta'])assert(paths.includes(path.join(routeDir,route+'.html'))||paths.includes(path.join(routeDir,route,'index.html')),`Missing ${route}`);
for(const marker of sampleMarkers)assert(paths.some(p=>p.endsWith(`/biomarker/${marker.key}.html`)),`Missing biomarker ${marker.key}`);
checks.push('All audited public and app route families exported');
const publicBody=await fs.readFile('dist/client/index.html','utf8');assert(publicBody.includes('Un intervalo de referencia describe'));assert(publicBody.includes('panel especializado'));assert(!publicBody.includes('95%'));assert(!publicBody.includes('€1.1'));checks.push('Landing parity additions and qualified claims retained');
const total=(await Promise.all(paths.map(async p=>(await fs.stat(p)).size))).reduce((a,b)=>a+b,0);
const reportOutput=process.env.EVA_PREVIEW_CHECK_OUTPUT||'public/review/frontend-04-checks.json';
await fs.mkdir(path.dirname(reportOutput),{recursive:true});
await fs.writeFile(reportOutput,JSON.stringify({date:new Date().toISOString(),checks,routeCount:paths.length,htmlBytes:total},null,2));
console.log(JSON.stringify({passed:checks.length,checks,routeCount:paths.length},null,2));
