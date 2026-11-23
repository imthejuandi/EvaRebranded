const fs=require('node:fs');
const dir='/workspace/eva-in-place-qa/range-concise-v61';
const version=Number(process.argv[2]||61),mode=process.argv[3]||'actual';
const baseline=JSON.parse(fs.readFileSync(`${dir}/baseline-v60.json`));
const actual=JSON.parse(fs.readFileSync(`${dir}/${mode}-v${version}.json`));
const words=t=>(t.trim().match(/\S+/g)||[]).length;
const pct=(a,b)=>(a-b)/a*100;
const comparisons=actual.profiles.map(p=>{
 const base=baseline.profiles.find(b=>b.locale===p.locale&&b.width===p.width)||baseline.profiles.find(b=>b.locale===p.locale&&b.width===1366);
 const exactWidth=base.width===p.width;
 const baselineProse=[...base.closed.readings.map(x=>x.text.split('\n').map(x=>x.trim()).filter(Boolean).at(-1)),base.closed.context.text].join(' ');
 return {id:p.id,locale:p.locale,width:p.width,reduced:Boolean(p.reduced),baselineId:base.id,baselineMode:'normal motion',exactBaselineWidth:exactWidth,baselineWords:base.closed.wordCount,actualWords:p.closed.wordCount,wordReductionPercent:pct(base.closed.wordCount,p.closed.wordCount),baselineProseWords:words(baselineProse),actualProseWords:p.closed.proseWordCount,baselineGlassHeight:exactWidth?base.closed.instrument.height:null,actualGlassHeight:p.closed.instrument.height,glassHeightReductionPercent:exactWidth?pct(base.closed.instrument.height,p.closed.instrument.height):null,baselineSectionHeight:exactWidth?base.closed.height:null,actualSectionHeight:p.closed.height,sectionHeightReductionPercent:exactWidth?pct(base.closed.height,p.closed.height):null};
});
const phoneComparisons=comparisons.filter(c=>!c.reduced&&c.width<=700&&c.exactBaselineWidth);
const result={nativeVersion:version,baselineNativeVersion:60,method:'Consistent visible-text-node extraction and browser viewport emulation; not human research',comparisons,targets:{wholeViewWordReductionEachLanguage:15,phoneGlassHeightReduction:10},gates:{renderedChecks:actual.passed&&actual.profiles.length===8,words:comparisons.every(c=>c.wordReductionPercent>=15),phoneGlass:phoneComparisons.every(c=>c.glassHeightReductionPercent>=10),noWrites:actual.networkWrites.length===0,browsersClosed:actual.allOwnedBrowsersClosed},original25PercentWordTarget:comparisons.every(c=>c.wordReductionPercent>=25),criterionRevision:'Explicitly approved by primary agent before final native measurement; new bridge improves meaning. Report prose counts separately, including any increase. Caption and CTA are included in whole-view counts.',scopeLimits:['No fresh baseline60tablet or reduced-motion geometry; their word baseline uses the same locale, and geometry comparison is identified by exactBaselineWidth and baselineMode.','Viewport emulation does not establish physical-device performance.','No real accounts, uploads, purchases or mutating network requests.']};
result.passed=Object.values(result.gates).every(Boolean);
fs.writeFileSync(`${dir}/${mode}-comparison-v${version}.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(!result.passed)process.exitCode=1;
