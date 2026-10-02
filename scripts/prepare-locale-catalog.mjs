import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
const folders=['components/pages','components/preview','components/site','lib/preview','lib/landing-content.ts'];
const files=[];
async function walk(p){const info=await fs.stat(p);if(info.isDirectory()){for(const f of await fs.readdir(p))await walk(path.join(p,f))}else if(/\.tsx?$/.test(p)&&!p.endsWith('locale.ts')&&!p.endsWith('backend-contract.ts'))files.push(p)}
for(const folder of folders)await walk(folder);
const es={},references={};
for(const file of files){const source=await fs.readFile(file,'utf8');const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith('tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 function visit(node){if(ts.isJsxText(node)||ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)){const value=node.text.replace(/\s+/g,' ').trim();if(value.length>2&&!/^(https?:|\/|@|#|[a-z-]+:)/.test(value)&&(/[áéíóúñ¿¡]/i.test(value)||/[A-Za-z]+\s+[A-Za-z]+/.test(value))){const hash=crypto.createHash('sha256').update(value).digest('hex').slice(0,12);const key='copy.'+hash;es[key]=value;(references[key]??=[]).push({file,line:ast.getLineAndCharacterOfPosition(node.getStart(ast)).line+1})}}ts.forEachChild(node,visit)}visit(ast)
}
await fs.mkdir('lib/site-content/locales',{recursive:true});
await fs.writeFile('lib/site-content/locales/es.inventory.json',JSON.stringify(es,null,2)+'\n');
await fs.writeFile('lib/site-content/locales/en.pending.json',JSON.stringify(Object.fromEntries(Object.keys(es).map(k=>[k,''])),null,2)+'\n');
await fs.writeFile('lib/site-content/locales/references.json',JSON.stringify(references,null,2)+'\n');
console.log(`${Object.keys(es).length} source strings inventoried across ${files.length} modules; English pending editorial translation.`);
