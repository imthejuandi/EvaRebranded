import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const sources=JSON.parse(await fs.readFile('lib/site-content/original-content.json','utf8'));
const documents=JSON.parse(await fs.readFile('lib/site-content/documents-bilingual.json','utf8'));
const normal=s=>s.replace(/\s+/g,' ').trim();
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&apos;/g,"'").replace(/&nbsp;/g,' ');
const visible=html=>normal(decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ')));
const read=route=>fs.readFile(path.join('dist/client',route.slice(1)+'.html'),'utf8');
assert.equal(sources.length,32);assert.equal(new Set(sources.map(s=>s.key)).size,16);
let states=0,passages=0;
for(const source of sources){
 const route=`/${source.locale}/review/original/${source.key.replaceAll('/','--')}`;
 const html=await read(route),text=visible(html);
 assert(html.includes(`lang="${source.locale}"`),route+' language');
 for(const passage of source.mainText.split(/\n\s*\n/).filter(s=>s.length>=65)){
  assert(text.includes(normal(passage)),route+' missing source passage: '+passage.slice(0,80));passages++;
 }
 for(const state of source.states){assert(text.includes(normal(state.text)),route+' missing interaction '+state.label);states++;}
 assert(text.includes(source.locale==='en'?'Historical copy':'Copia histórica'),route+' source status');
}
const docs=[];
for(const locale of ['es','en'])for(const[key,document]of Object.entries(documents[locale])){
 const html=await read(`/${locale}/${key}`),text=visible(html);
 assert(!/<script|\son\w+=|javascript:/i.test(document.html),'Unsafe imported markup '+key);
 for(const item of document.toc)assert(html.includes(`id="${item.id}"`),key+' missing document anchor');
 if(key==='metodologia/completa')assert.equal((document.html.match(/href="https:\/\/pubmed/g)||[]).length,12);
 for(const match of document.html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)){
  const original=visible(match[1]);if(original.length>60)assert(text.includes(original),key+' lost original paragraph');
 }
 assert.equal((html.match(/<h1\b/g)||[]).length,1,key+' one document heading');
 docs.push(`/${locale}/${key}`);
}
const narrative=[['science','A mirror. A map.'],['science','Klemera-Doubal'],['science','0 to 100'],['science','HOMA-IR'],['about','palliative care'],['about','The real product is understanding'],['how-it-works','Critical low'],['how-it-works','26 nodes'],['pricing','€396 per year'],['contact','Careers'],['blog','evidence-based health education']];
for(const[route,expected]of narrative){const text=visible(await read('/en/'+route));assert(text.toLowerCase().includes(expected.toLowerCase()),route+' missing restored content '+expected);}
for(const route of ['signup','login','forgot-password','reset-password','callback','upload']){
 const html=await read('/en/'+route),text=visible(html);assert(html.includes('lang="en"'));assert(!/Bienvenido|Contraseña|TU ESPACIO|No se crean/.test(text),route+' Spanish entry copy');assert(text.includes('No accounts are created'),route+' explicit simulated entry');
}
const signup=await read('/en/signup');assert.equal((signup.match(/type="checkbox"/g)||[]).length,4);assert.equal((signup.match(/type="checkbox"[^>]*required/g)||[]).length,3);
const landing=await read('/en');assert(landing.includes('€99 / quarter'));assert(!landing.includes('€99 per kit'));
const report={sourceVariants:sources.length,sourcePassages:passages,interactiveStates:states,bilingualDocuments:docs.length,restoredNarrativeChecks:narrative.length,entryRoutes:6,decisions:'Retained as open; no new clinical or commercial facts invented',productionConnections:'No real signup, email, payments, or device connection enabled'};
await fs.mkdir('docs',{recursive:true});await fs.writeFile('docs/content-parity-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:true,...report},null,2));
