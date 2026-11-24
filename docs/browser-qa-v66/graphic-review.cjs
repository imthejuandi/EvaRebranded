const {createRequire}=require('node:module');
const req=createRequire('/workspace/eva-playback-review/package.json');
const {chromium}=req('playwright');
const fs=require('node:fs');
const path=require('node:path');
const version=Number(process.argv[2]||66), mode=process.argv[3]||'actual';
const out='/workspace/eva-in-place-qa/range-retro-v66';
const origin='https://eva-content-review.jdlagop.chatgpt.site';
const spec=JSON.parse(fs.readFileSync(`${out}/medical-spec.json`)), contract=JSON.parse(fs.readFileSync(`${out}/medical-contract.json`));
const profiles=[{locale:'en',width:1366,height:900},{locale:'es',width:1366,height:900},{locale:'en',width:390,height:844},{locale:'es',width:390,height:844},{locale:'es',width:320,height:844},{locale:'es',width:768,height:1024},{locale:'en',width:390,height:844,reduced:true},{locale:'es',width:390,height:844,reduced:true}];
const report={nativeVersion:version,mode,scope:'Only range-proof section',heuristicNotHumanTest:true,profiles:[],networkWrites:[],allOwnedBrowsersClosed:false};
const save=()=>fs.writeFileSync(`${out}/${mode}-v${version}.json`,JSON.stringify(report,null,2));
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage'],proxy:{server:process.env.HTTPS_PROXY||process.env.HTTP_PROXY}});
 try{
 for(const p of profiles){
  const id=`${p.locale}-${p.width}${p.reduced?'-calm':''}`;const r={id,...p,failures:[],pageErrors:[]};report.profiles.push(r);
  const page=await browser.newPage({viewport:{width:p.width,height:p.height},reducedMotion:p.reduced?'reduce':'no-preference'});page.setDefaultTimeout(20000);
  page.on('pageerror',e=>r.pageErrors.push(e.message));
  await page.route('**/*',route=>{const method=route.request().method();if(!['GET','HEAD','OPTIONS'].includes(method)){report.networkWrites.push({id,method,url:route.request().url()});return route.abort();}return route.continue();});
  try{
   r.httpStatus=(await page.goto(`${origin}/${p.locale}?review=${version}#otra-lectura`,{waitUntil:'domcontentloaded',timeout:45000})).status();
   const section=page.locator('#otra-lectura');await section.waitFor({state:'visible'});
   await page.waitForFunction(()=>getComputedStyle(document.querySelector('#otra-lectura')).backgroundColor!=='rgba(0, 0, 0, 0)'&&getComputedStyle(document.querySelector('#range-proof-title')).fontSize!=='24px');
   await page.evaluate(()=>document.fonts.ready);
   await section.evaluate(e=>{const d=e.querySelector('details');if(d)d.open=false;scrollTo({top:e.getBoundingClientRect().top+scrollY,behavior:'instant'});});
   await page.waitForTimeout(650);
   r.closed=await section.evaluate(e=>{
    const box=x=>{const b=x.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};};
    const words=t=>(t.trim().match(/\S+/g)||[]).length;
    const walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),parts=[];let node;while(node=walker.nextNode()){const parent=node.parentElement;if(parent&&parent.checkVisibility()&&!parent.closest('.sr-only')&&node.textContent.trim())parts.push(node.textContent.trim());}const text=parts.join(' ').replace(/\s+/g,' ').trim();
    const data=x=>{if(!x)return null;const c=getComputedStyle(x);return{text:x.innerText,...box(x),fontSize:c.fontSize,fontWeight:c.fontWeight,fontFamily:c.fontFamily,lineHeight:c.lineHeight,color:c.color,opacity:c.opacity,visibility:c.visibility,display:c.display,clipPath:c.clipPath};};
    const controls=[...e.querySelectorAll('a,summary,button')].filter(x=>x.checkVisibility());
    const elements=[...e.querySelectorAll('*')].filter(x=>x.checkVisibility()&&!x.closest('[aria-hidden="true"]')&&getComputedStyle(x).display!=='inline');
    return{text,wordCount:words(text),...box(e),documentWidth:document.documentElement.scrollWidth,heading:data(e.querySelector('h2')),headingVisible:e.querySelector('h2').checkVisibility({checkOpacity:true,checkVisibilityCSS:true}),headingAncestors:(()=>{const list=[];let x=e.querySelector('h2');while(x){const c=getComputedStyle(x);list.push({tag:x.tagName,className:x.className,opacity:c.opacity,visibility:c.visibility,display:c.display,clipPath:c.clipPath});if(x===e)break;x=x.parentElement;}return list;})(),instrument:data(e.querySelector('.range-proof-instrument')),context:data(e.querySelector('.range-proof-context')),lead:data(e.querySelector('.range-proof-story p')),readings:[...e.querySelectorAll('[data-range-reading]')].map(data),dotValue:e.querySelector('[data-dot-number]')?.getAttribute('data-dot-number'),labels:[...e.querySelectorAll('.range-proof-comparison h4,.range-proof-condition')].map(data),routes:[...e.querySelectorAll('.range-proof-comparison')].map(x=>{const b=x.getBoundingClientRect(),a=getComputedStyle(x,'::after'),p=getComputedStyle(x,'::before');return{center:b.y+b.height/2,endpointTop:parseFloat(a.top),lineTop:parseFloat(p.top),rowHeight:b.height,endpointSize:parseFloat(a.width)};}),routing:data(e.querySelector('.range-proof-routing')),value:e.querySelector('[data-range-value]')?.getAttribute('data-range-value'),axis:[e.querySelector('[data-range-axis-min]')?.getAttribute('data-range-axis-min'),e.querySelector('[data-range-axis-max]')?.getAttribute('data-range-axis-max')],controls:controls.map(x=>({...data(x),tag:x.tagName,href:x.getAttribute('href')})),overflow:elements.filter(x=>x.scrollWidth>x.clientWidth+2).map(x=>({tag:x.tagName,className:x.className,width:x.clientWidth,scrollWidth:x.scrollWidth})),entryState:e.getAttribute('data-range-entry-state'),graphicType:e.querySelector('figure')?.getAttribute('data-range-graphic'),comparisons:[...e.querySelectorAll('.range-proof-comparison')].map(x=>({...data(x),role:x.getAttribute('role'),ariaLabel:x.getAttribute('aria-label'),referenceValue:x.querySelector('[data-range-reference-value]')?.getAttribute('data-range-reference-value'),reviewValue:x.querySelector('[data-range-review-value]')?.getAttribute('data-range-review-value'),numericText:x.querySelector('.range-proof-comparison-value')?.innerText,meaning:data(x.querySelector('.range-proof-comparison-meaning'))})),obsoleteGraphicNodes:e.querySelectorAll('.range-proof-axis,.range-proof-number-line,.range-proof-window,.range-proof-overlap,.range-proof-lane,[data-range-lab-band],[data-range-prevention-band],[data-range-overlap],[data-range-axis-min]').length,takeaway:data(e.querySelector('figcaption')),takeawayLead:data(e.querySelector('figcaption strong')),chartDescription:e.querySelector('#range-proof-graphic-description')?.textContent,figureDescriptionId:e.querySelector('figure')?.getAttribute('aria-describedby'),axisTicks:[...e.querySelectorAll('.range-proof-axis>span')].map(x=>x.innerText),prose:[...e.querySelectorAll('.range-proof-caption,.range-proof-reading h4,.range-proof-context,.range-proof-takeaway,.range-proof-comparison-meaning')].map(x=>x.innerText).join(' ')};
   });
   await section.screenshot({path:`${out}/${mode}-${id}-section.png`});await page.screenshot({path:`${out}/${mode}-${id}-viewport.png`});
   const d=r.closed;r.closed.proseWordCount=(d.prose.trim().match(/\S+/g)||[]).length;
   if(r.httpStatus!==200)r.failures.push('HTTP status');if(!d.headingVisible||d.heading.width<50||d.heading.height<30||d.heading.color==='rgba(0, 0, 0, 0)'||d.headingAncestors.some(a=>a.opacity==='0'||a.visibility==='hidden'||a.display==='none'))r.failures.push('Heading is not visibly painted');if(d.documentWidth>p.width+1)r.failures.push('Horizontal page overflow');const unintendedOverflow=d.overflow.filter(x=>!['range-proof-instrument bio-glass','range-proof-layout','sr-only'].includes(x.className));if(unintendedOverflow.length)r.failures.push('Clipped section text/content');r.intentionalOverflowExclusions='Glass pseudo-element glow extends20px, evidence rail bleeds8px within viewport, sr-only span intentionallyclips. Descendant text/content checked separately.';
   if(Number(d.value)!==contract.value||d.graphicType!=='relay'||d.comparisons.length!==2||d.obsoleteGraphicNodes!==0)r.failures.push('Relay contract/no interval imagery');
   if(d.dotValue!==(p.locale==='es'?'3,2':'3.2'))r.failures.push('Localized one dotted sample');if(d.labels.some(x=>parseFloat(x.fontSize)<14))r.failures.push('Task labels below14px');if(d.routes.some(x=>Math.abs(x.endpointTop-x.lineTop)>1||Math.abs(x.endpointTop-x.rowHeight/2)>1))r.failures.push('Routing terminal alignment');
   const lab=d.comparisons.find(x=>x.referenceValue!==undefined),review=d.comparisons.find(x=>x.reviewValue!==undefined);
   if(!lab||!review||Number(lab.referenceValue)!==contract.lab.limit||Number(review.reviewValue)!==contract.review.threshold||!contract.expected_relations.below_example_lab_limit||!contract.expected_relations.above_conditional_review_trigger)r.failures.push('CMO medical comparison values');
   const normalize=t=>(t||'').replaceAll(',','.').replace(/\s+/g,' ');
   if(!/<\s*5\s*mg\/L/.test(normalize(lab?.numericText))||!/>\s*2\s*mg\/L/.test(normalize(review?.numericText)))r.failures.push('Rendered inequality math');
   if(d.comparisons.some(x=>x.role!=='group'||!x.ariaLabel||parseFloat(x.meaning?.fontSize)<16))r.failures.push('Named comparison groups/plain readable meanings');
   r.comparisonContract={sample:Number(d.value),labLimit:Number(lab?.referenceValue),reviewTrigger:Number(review?.reviewValue),labOperator:'<',reviewOperator:'>',noAxisOrInterval:d.obsoleteGraphicNodes===0};
   if(d.context&&parseFloat(d.context.fontSize)<16)r.failures.push('Visible contextual body below16px');
   if(!/illustrative|ilustrativo|Example|Ejemplo/i.test(d.text))r.failures.push('Illustrative result label');
   if(!/lab|laboratorio/i.test(d.text)||!/<\s*5\s*mg\/L/i.test(d.text))r.failures.push('Illustrative laboratory interval');
   if(!/>\s*2\s*mg\/L\s*(if persistent|si persiste)/i.test(d.text)||/≥\s*2\s*mg\/L/i.test(d.text))r.failures.push('Strict European persistent-risk threshold');
   if(!/Repeat the test when well|Repite el análisis cuando est[eé]s bien|Repetir cuando est[eé]s bien/i.test(d.text))r.failures.push('Visible stable-repeat qualification');
   if(!/Repeat the test when well\. If still raised, review overall heart risk\.|Repite el análisis cuando est[eé]s bien\. Si sigue elevado, valora el riesgo cardiovascular global\./i.test(d.takeaway?.text||''))r.failures.push('Explicit repeat/overall-risk review action');
   if(!d.chartDescription||d.figureDescriptionId!=='range-proof-graphic-description'||!/not show an optimal target|no muestran un objetivo óptimo/i.test(d.chartDescription)||/shared area|zona compartida/i.test(d.chartDescription))r.failures.push('Accessible direct-comparison meaning');
   if(!/limits vary|límites varían|límite varía/i.test(d.text)||!/not a diagnosis|cannot diagnose|no es un diagnóstico|no diagnostica/i.test(d.text))r.failures.push('Lab variation and no-diagnosis context');
   if(!/Inflammation signal|Señal de inflamación/i.test(d.text))r.failures.push('Plain marker meaning');
   if(!d.takeaway||parseFloat(d.takeaway.fontSize)<16||parseFloat(d.takeaway.lineHeight)<23.5||d.takeawayLead?.fontWeight!=='600')r.failures.push('Readable shared takeaway and semantic emphasis');
   for(const c of d.controls)if(c.height<43.5)r.failures.push('Visible control below44px');
   for(const row of d.readings)if(row.fontFamily&&!row.fontFamily.includes('EVA Hanken'))r.failures.push('Established font family');
   const action=page.locator('[data-range-upload]');r.freeHref=await action.getAttribute('href');const u=new URL(r.freeHref,origin);if(u.pathname!==`/${p.locale}/signup`||u.searchParams.get('plan')!=='free'||u.searchParams.get('redirect')!=='/es/upload')r.failures.push('Free signup/upload return intent');
   const details=section.locator('details'), summary=details.locator('summary');await summary.focus();r.focus=await summary.evaluate(e=>{const c=getComputedStyle(e);return{active:e===document.activeElement,outline:c.outlineStyle,width:c.outlineWidth};});if(!r.focus.active||r.focus.outline==='none'||parseFloat(r.focus.width)<2)r.failures.push('Visible summary focus');await page.keyboard.press('Enter');if(!(await details.evaluate(e=>e.open)))r.failures.push('Keyboard details opening');
   r.open={text:(await details.innerText()).replace(/\s+/g,' ').trim(),sources:await section.locator('[data-range-source]').evaluateAll(es=>es.map(e=>({text:e.innerText,href:e.getAttribute('href'),target:e.getAttribute('target')}))),science:await section.locator('[data-range-method]').getAttribute('href')};
   const expectedSources=spec.sources.slice(0,3).map(s=>s.url);if(r.open.sources.length!==3||expectedSources.some(href=>!r.open.sources.some(s=>s.href===href)))r.failures.push('Selected CDC/European/prospective evidence links');
   if(!/health history|historial de salud/i.test(r.open.text)||!/illness|enfermedad/i.test(r.open.text)||!/injury|lesión/i.test(r.open.text))r.failures.push('Available wider clinical context/confounders');
   if(new URL(r.open.science,origin).pathname!==`/${p.locale}/science`)r.failures.push('Localized science link');
   await action.focus();r.actionFocus=await action.evaluate(e=>{const b=e.getBoundingClientRect(),c=getComputedStyle(e);const hit=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return{active:e===document.activeElement,outline:c.outlineStyle,width:c.outlineWidth,hit:hit===e||e.contains(hit),widthPx:b.width,heightPx:b.height};});if(!r.actionFocus.active||!r.actionFocus.hit||r.actionFocus.heightPx<43.5)r.failures.push('Free action focus/target');
   await summary.focus();await page.keyboard.press('Enter');if(await details.evaluate(e=>e.open))r.failures.push('Keyboard details closing');
   r.passed=r.failures.length===0&&r.pageErrors.length===0;
  }catch(e){r.failures.push(e.stack);r.passed=false;}
  finally{await page.close();save();console.log(id,r.passed,r.failures.join(' | '));}
 }
 }finally{await browser.close();report.allOwnedBrowsersClosed=true;report.passed=report.profiles.every(p=>p.passed)&&report.networkWrites.length===0;save();}
 if(!report.passed)process.exitCode=1;
})();
