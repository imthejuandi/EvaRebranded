const fs=require('node:fs');
const dir='/workspace/eva-in-place-qa/range-graphic-v63';
const version=Number(process.argv[2]||63),mode=process.argv[3]||'actual';
const baseline=JSON.parse(fs.readFileSync(`${dir}/baseline-v62.json`));
const current=JSON.parse(fs.readFileSync(`${dir}/${mode}-v${version}.json`));
const comparisons=current.profiles.map(p=>{
 const b=baseline.profiles.find(b=>b.id===p.id);
 if(!b)throw new Error('No exact baseline profile '+p.id);
 const delta=(old,newValue)=>({before:old,after:newValue,change:newValue-old,change_percent:(newValue-old)/old*100});
 return {id:p.id,words:delta(b.closed.wordCount,p.closed.wordCount),explanatory_prose:delta(b.closed.proseWordCount,p.closed.proseWordCount),glass_height_px:delta(b.closed.instrument.height,p.closed.instrument.height),section_height_px:delta(b.closed.height,p.closed.height),heading_visible:p.closed.headingVisible,geometric_relationships:p.plotFractions};
});
const result={native_version:version,baseline_native_version:62,method:'Identical visible-text-node extraction; caption and CTA counted, sr-only and closed details excluded. Explanatory prose includes the new figcaption. No human usability study.',measurement_policy:'The63goal is clearer evidence-backed graphic teaching, not an arbitrary percentage cut from62. All word/height increases remain visible in this record.',comparisons,automated_gates:{rendered_eight_profiles:current.passed&&current.profiles.length===8,headings_painted:current.profiles.every(p=>p.closed.headingVisible),no_network_writes:current.networkWrites.length===0,owned_browsers_closed:current.allOwnedBrowsersClosed},scope_limits:['Viewport emulation, not physical-device performance.','Only this section; no full landing/entry suite or no-JavaScript visual-parity rerun.','Medical scope follows the frozen CMO agent evidence packet, not a human clinical signoff.']};
result.automated_passed=Object.values(result.automated_gates).every(Boolean);
fs.writeFileSync(`${dir}/${mode}-comparison-v${version}.json`,JSON.stringify(result,null,2));
for(const c of comparisons)console.log(c.id,'words',c.words.before+'→'+c.words.after,'glass',c.glass_height_px.after.toFixed(2),'section',c.section_height_px.after.toFixed(2));
console.log('Automated gates:',result.automated_passed);
if(!result.automated_passed)process.exitCode=1;
