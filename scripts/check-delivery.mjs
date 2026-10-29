import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
execFileSync('python3',['scripts/check-history.py'],{stdio:'inherit'});
import path from 'node:path';
const root=process.cwd();const base=path.join(root,'dist/client');const records=[];
for(const route of ['index.html','system.html','history.html']){const html=await readFile(path.join(base,route),'utf8');assert(html.includes('EVA')||html.includes('eva'));assert(!html.includes('Internal Server Error'));records.push({check:`export ${route}`,pass:true});}
const home=await readFile(path.join(base,'index.html'),'utf8');for(const term of ['Tasso+','499','15 biomarcadores','99','trimestre','Cancela','Súbela gratis','edad biológica'])assert(home.includes(term),`Missing core content: ${term}`);records.push({check:'EVA core information in static HTML',pass:true});
for(let i=0;i<60;i++){const p=path.join(base,'art/product',`frame-${String(i).padStart(3,'0')}.jpg`);const bytes=await readFile(p);assert(bytes.length>1000&&bytes[0]===255&&bytes[1]===216,`Broken frame ${i}`);}
records.push({check:'60 original product frames retained for history',pass:true});
for(const image of ['runner.jpg','runner-athletic.jpg','stretch.jpg','savee-06.jpg','savee-08.jpg','savee-09.jpg','tasso-plus-in-use.png'])assert((await stat(path.join(base,'art',image))).size>1000);
records.push({check:'Human, SAVEE and factual Tasso assets present',pass:true});
const history=await readFile(path.join(base,'history.html'),'utf8');for(const old of ['eva-system-02','eva-instrument-study','eva-instrument-landing'])assert(history.includes(old));records.push({check:'All previous previews linked',pass:true});
for(const report of ['protocol.md','results.json','provenance.json'])assert((await stat(path.join(base,'review',report))).size>100);
records.push({check:'Review and provenance shipped',pass:true});
assert(home.includes('De los datos.')&&home.includes('Compara tus resultados en el tiempo.')&&home.includes('signal-placeholder'));
const system=await readFile(path.join(base,'system.html'),'utf8');assert(system.includes('analog-signal')&&system.includes('savee.com/i/uBs8ZE0/'));
records.push({check:'Analog passage has static content and reusable referenced specimen',pass:true});
assert((await readFile(path.join(base,'archive/eva-03-1-glow-motion.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');assert(history.includes('eva-03-1-glow-motion.zip'));assert((await stat(path.join(base,'review/analog-signal.md'))).size>1000);
records.push({check:'Accepted 03.1 source and analog component guide preserved',pass:true});
assert(home.includes('lo-que-te-mueve')&&home.includes('post-run-coast-')&&system.includes('solar-grain'));
assert((await stat(path.join(base,'art/post-run-coast-1000.webp'))).size>100000);assert((await readFile(path.join(base,'archive/eva-03-12-time-and-life.zip'))).includes(Buffer.from('public/art/post-run-coast.png')));assert((await readFile(path.join(base,'archive/eva-03-2-analog-signal.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');assert(history.includes('eva-03-2-analog-signal.zip'));
records.push({check:'Solar Grain lifestyle section, specimen and previous03.2 archive present',pass:true});
const clip=await readFile(path.join(base,'art/runner-athletic-loop.mp4'));assert(clip.length>20000&&clip.subarray(0,32).toString().includes('ftyp'));assert((await readFile(path.join(base,'archive/eva-03-original.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');records.push({check:'Ambient runner video and accepted 03.0 source archive present',pass:true});
console.log(JSON.stringify({passed:records.length,records},null,2));

const walk=await readFile(path.join(base,'art/post-run-coast-walk-cut.mp4'));assert(walk.length>20000&&walk.subarray(0,32).toString().includes('ftyp'));assert(home.includes('data-solar-motion')&&system.includes('data-solar-motion'));assert(home.includes('Pausar paseo'));assert((await stat(path.join(base,'review/solar-motion-provenance.json'))).size>100);console.log('Solar Motion passed: walking clip, landing and reusable specimen, pause control, and provenance exported.');

for(const route of ['index.html','system.html','history.html']){
 const html=await readFile(path.join(base,route),'utf8');
 assert(!/[\p{Extended_Pictographic}\uFE0F\u200D↗↖↔←→↓]/u.test(html),`Emoji or decorative Unicode icon remains in ${route}`);
}
assert((await stat(path.join(base,'art/tasso-plus-glow-v1.png'))).size>100000);
assert(history.includes('eva-03-5-body-signal.zip'));
assert((await readFile(path.join(base,'archive/eva-03-5-body-signal.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
console.log('03.6 delivery passed: no emoji/pictographs in exported routes; Tasso Glow asset and complete03.5 archive present.');
assert(history.includes('eva-03-6-halftone-glow.zip'));
assert((await readFile(path.join(base,'archive/eva-03-6-halftone-glow.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
console.log('03.7 history passed: preceding rounded-halftone version retained.');
assert(history.includes('eva-03-7-living-display.zip'));
assert((await readFile(path.join(base,'archive/eva-03-7-living-display.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
console.log('03.8 history passed: prior living display retained.');

assert(history.includes('eva-03-8-continuous-field.zip'));
assert((await readFile(path.join(base,'archive/eva-03-8-continuous-field.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
console.log('03.9 history passed: prior continuous field retained.');

assert(history.includes('eva-03-9-numeral-centerpiece.zip'));
assert((await readFile(path.join(base,'archive/eva-03-9-numeral-centerpiece.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
console.log('03.10 history passed: isolated-number alternative retained.');

assert(history.includes('eva-03-10-soft-emergence.zip'));
assert((await readFile(path.join(base,'archive/eva-03-10-soft-emergence.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
console.log('03.11 history passed: previous palette and capsule layout retained.');

assert(history.includes('eva-03-11-neutral-canvas.zip'));
assert((await readFile(path.join(base,'archive/eva-03-11-neutral-canvas.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
assert(home.includes('role="tablist"')&&home.includes('method-panel-3'));
assert((await stat(path.join(base,'art/tasso-plus-glow-v1.webp'))).size<50000);
console.log('03.12 delivery passed: previous source archived, all four method chapters exported, optimized product artwork.');

const tassoWalk=await readFile(path.join(base,'art/post-run-coast-tasso-walk-v1.mp4'));
assert(tassoWalk.length>1000000&&tassoWalk.length<4000000&&tassoWalk.subarray(0,64).toString().includes('ftyp'));
assert(home.includes('post-run-coast-600.webp')&&system.includes('tasso-walk.md'));
assert((await stat(path.join(base,'art/post-run-coast-tasso-600.webp'))).size<150000);
console.log('Walk history passed: Tasso composite retained, original photographic poster restored.');
assert(history.includes('eva-03-12-time-and-life.zip'));
assert((await readFile(path.join(base,'archive/eva-03-12-time-and-life.zip'))).subarray(0,2).toString()==='PK','Valid historical archive');
assert(!home.includes('post-run-coast-tasso-1000.webp'));
console.log('03.13 history passed: restored walk and previous source preserved.');
assert(home.includes('method-home-c-640.webp')&&home.includes('method-home-c-1200.webp')&&!home.includes('method-glow-product'),'Selected responsive home photograph is exported');
for(const name of ['method-home-c-640.webp','method-home-c-1200.webp'])assert((await stat(path.join(base,'art',name))).size>10000,`${name} is present`);
assert(history.includes('eva-03-13-continuous-story.zip'));
assert((await stat(path.join(base,'archive/eva-03-13-continuous-story.zip'))).size>10000);
assert(history.includes('Descargar actualización 03.13')&&history.includes('fuentes de 03.12'));
console.log('Method delivery passed: selected candid photograph exported and previous source preserved.');

assert(history.includes("eva-03-14-original-method.zip")&&history.includes("method-home-ritual-1000.jpg"));
assert((await stat(path.join(base,"art/method-home-solar-600.jpg"))).size<150000);
console.log("03.15 delivery passed: solarized home image, mobile derivative and prior artwork preserved.");
