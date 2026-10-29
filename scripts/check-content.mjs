import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {methodSteps} from '../lib/landing-content.ts';
const html=await readFile('dist/client/index.html','utf8');
const expected=[
 ['comparison context','una-perspectiva'],['annual cadence','resultados de biomarcadores al año'],
 ['five specimen section','biomarcadores'],['full method','el-metodo'],['age explanation','tu-evolucion'],
 ['full founder quote','cuando comencé mi propio camino de salud preventiva'],['quarterly price','al trimestre'],
 ['expanded panel','499'],['cancellation','Cancela cuando quieras'],['free upload','Sin tarjeta de crédito'],
 ['collection location','Recogida de muestra en casa'],['laboratory','Análisis en laboratorio acreditado'],
 ['biological age qualification','Ejemplo ilustrativo, no una predicción de tu resultado'],['distinct score','puntuación de longevidad'],
];
for(const [label,value] of expected)assert(html.includes(value),`Missing imported information: ${label}`);
for(const [marker,value,range] of [['Vitamina D','28','50–80'],['hs-CRP','2.1','0–1'],['Insulina en ayunas','11','2–5'],['ApoB','98','0–60'],['Ferritina','320','50–150']]){
 assert(html.includes(marker)&&html.includes(`data-dot-number="${value}"`)&&html.includes(range),`Missing specimen: ${marker}`);
}
assert.equal((html.match(/data-biomarker-tile=/g)||[]).length,5);
for(const label of ['Evolución','Rangos','Lectura','Ver los cinco biomarcadores','Recorrido ilustrativo','Lecturas trimestrales'])assert(html.includes(label),`Missing biomarker interface control: ${label}`);
assert(html.includes('Lectura 04 · Valores ilustrativos'),'Source reading must be distinguished from illustrative history');
for(const route of ['signup','upload','how-it-works','science','pricing','about','legal/privacy','legal/terms','legal/cookies','blog'])assert(html.includes(`/es/${route}`),`Missing business destination: ${route}`);
assert(html.includes('mailto:hello@evahealth.es')&&html.includes('English')&&html.includes('Próximamente'));
assert(!html.includes('95%')&&!html.includes('1.1T'),'Unverified statistics must stay in the review notes');
assert(!html.includes('Acción requerida')&&!html.includes('Por debajo del óptimo'),'Do not import misleading specimen directions');
const history=await readFile('dist/client/history.html','utf8');assert(history.includes('/archive/eva-03-3-movement.zip'));
assert((await readFile('dist/client/archive/eva-03-3-movement.zip')).includes(Buffer.from('RESTORE-MANIFEST.json')),'Historical source is retained through its verified restoration manifest');
assert((await stat('dist/client/review/content-import.md')).size>1000);
console.log('Content import passed: all source sections, five numerical specimens, 12 business destinations, qualified examples, review exceptions and prior source archive.');

for(const step of methodSteps)assert(html.includes(step.title)&&html.includes(step.copy),'All four reviewed method steps remain in static HTML');

assert(html.indexOf('id="el-metodo"')<html.indexOf('id="biomarcadores"'),'Explain the method before the detailed result demonstration');
assert(html.includes('Suscripción trimestral.')&&html.includes('Son opciones distintas al panel trimestral de 15.'),'Distinguish the recurring plan from the extended panel');
