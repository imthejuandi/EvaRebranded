const {createRequire}=require('node:module');
const req=createRequire('/workspace/eva-playback-review/package.json');
const {chromium}=req('playwright');
const fs=require('node:fs');
const path=require('node:path');
const version=Number(process.argv[2]||60), mode=process.argv[3]||'baseline';
const out='/workspace/eva-in-place-qa/range-concise-v61';
const origin='https://eva-content-review.jdlagop.chatgpt.site';
const profiles=mode==='baseline'?[{locale:'en',width:1366,height:900},{locale:'es',width:1366,height:900},{locale:'en',width:390,height:844},{locale:'es',width:390,height:844},{locale:'es',width:320,height:844}]:[{locale:'en',width:1366,height:900},{locale:'es',width:1366,height:900},{locale:'en',width:390,height:844},{locale:'es',width:390,height:844},{locale:'es',width:320,height:844},{locale:'es',width:768,height:1024},{locale:'en',width:390,height:844,reduced:true},{locale:'es',width:390,height:844,reduced:true}];
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
    return{text,wordCount:words(text),...box(e),documentWidth:document.documentElement.scrollWidth,heading:data(e.querySelector('h2')),headingVisible:e.querySelector('h2').checkVisibility({checkOpacity:true,checkVisibilityCSS:true}),headingAncestors:(()=>{const list=[];let x=e.querySelector('h2');while(x){const c=getComputedStyle(x);list.push({tag:x.tagName,className:x.className,opacity:c.opacity,visibility:c.visibility,display:c.display,clipPath:c.clipPath});if(x===e)break;x=x.parentElement;}return list;})(),instrument:data(e.querySelector('.range-proof-instrument')),context:data(e.querySelector('.range-proof-context')),lead:data(e.querySelector('.range-proof-story p')),readings:[...e.querySelectorAll('[data-range-reading]')].map(data),value:e.querySelector('[data-range-value]')?.getAttribute('data-range-value'),axis:[e.querySelector('[data-range-axis-min]')?.getAttribute('data-range-axis-min'),e.querySelector('[data-range-axis-max]')?.getAttribute('data-range-axis-max')],controls:controls.map(x=>({...data(x),tag:x.tagName,href:x.getAttribute('href')})),overflow:elements.filter(x=>x.scrollWidth>x.clientWidth+2).map(x=>({tag:x.tagName,className:x.className,width:x.clientWidth,scrollWidth:x.scrollWidth})),entryState:e.getAttribute('data-range-entry-state'),markerOwner:box(e.querySelector('[data-range-marker]')),lanes:[...e.querySelectorAll('.range-proof-lane')].map(box),points:[...e.querySelectorAll('.range-proof-fixed-point')].map(box),threshold:box(e.querySelector('.range-proof-threshold')),prose:[...e.querySelectorAll('.range-proof-caption,.range-proof-reading h4,.range-proof-context')].map(x=>x.innerText).join(' ')};
   });
   await section.screenshot({path:`${out}/${mode}-${id}-section.png`});await page.screenshot({path:`${out}/${mode}-${id}-viewport.png`});
   const d=r.closed;r.closed.proseWordCount=(d.prose.trim().match(/\S+/g)||[]).length;
   if(r.httpStatus!==200)r.failures.push('HTTP status');if(!d.headingVisible||d.heading.width<50||d.heading.height<30||d.heading.color==='rgba(0, 0, 0, 0)'||d.headingAncestors.some(a=>a.opacity==='0'||a.visibility==='hidden'||a.display==='none'))r.failures.push('Heading is not visibly painted');if(d.documentWidth>p.width+1)r.failures.push('Horizontal page overflow');const unintendedOverflow=d.overflow.filter(x=>!['range-proof-instrument bio-glass','range-proof-layout','sr-only'].includes(x.className));if(unintendedOverflow.length)r.failures.push('Clipped section text/content');r.intentionalOverflowExclusions='Glass pseudo-element glow extends20px, evidence rail bleeds8px within viewport, sr-only span intentionallyclips. Descendant text/content checked separately.';
   if(d.value!=='2.1'||d.axis.join(',')!=='0,5')r.failures.push('Fixed numeric result/axis contract');
   const pointFractions=d.points.map((point,i)=>(point.x+point.width/2-d.lanes[i].x)/d.lanes[i].width),thresholdPercent=(d.threshold.x-d.lanes[1].x)/d.lanes[1].width;r.plotFractions={points:pointFractions,threshold:thresholdPercent};if(pointFractions.length!==2||pointFractions.some(x=>Math.abs(x-.42)>.01)||Math.abs(thresholdPercent-.4)>.01)r.failures.push('Fixed result and risk threshold geometry');
   if(d.context&&parseFloat(d.context.fontSize)<16)r.failures.push('Visible contextual body below16px');
   if(!/illustrative|ilustrativo|Example|Ejemplo/i.test(d.text))r.failures.push('Illustrative result label');
   if(!/lab|laboratorio/i.test(d.text)||!/<\s*5\s*mg\/L/i.test(d.text))r.failures.push('Illustrative laboratory interval');
   if(!/≥\s*2\s*mg\/L[\s\S]*(repeat testing|mediciones repetidas)/i.test(d.text))r.failures.push('Adjacent repeat-testing threshold');
   if(!/limits vary|límites varían|límite varía/i.test(d.text)||!/not a diagnosis|cannot diagnose|no es un diagnóstico|no diagnostica/i.test(d.text))r.failures.push('Lab variation and no-diagnosis context');
   if(!/health context|contexto de salud/i.test(d.text)&&mode!=='baseline')r.failures.push('Visible wider health context');
   for(const c of d.controls)if(c.height<43.5)r.failures.push('Visible control below44px');
   for(const row of d.readings)if(row.fontFamily&&!row.fontFamily.includes('EVA Hanken'))r.failures.push('Established font family');
   const action=page.locator('[data-range-upload]');r.freeHref=await action.getAttribute('href');const u=new URL(r.freeHref,origin);if(u.pathname!==`/${p.locale}/signup`||u.searchParams.get('plan')!=='free'||u.searchParams.get('redirect')!=='/es/upload')r.failures.push('Free signup/upload return intent');
   const details=section.locator('details'), summary=details.locator('summary');await summary.focus();r.focus=await summary.evaluate(e=>{const c=getComputedStyle(e);return{active:e===document.activeElement,outline:c.outlineStyle,width:c.outlineWidth};});if(!r.focus.active||r.focus.outline==='none'||parseFloat(r.focus.width)<2)r.failures.push('Visible summary focus');await page.keyboard.press('Enter');if(!(await details.evaluate(e=>e.open)))r.failures.push('Keyboard details opening');
   r.open={text:(await details.innerText()).replace(/\s+/g,' ').trim(),sources:await section.locator('[data-range-source]').evaluateAll(es=>es.map(e=>({text:e.innerText,href:e.getAttribute('href'),target:e.getAttribute('target')}))),science:await section.locator('[data-range-method]').getAttribute('href')};
   if(r.open.sources.length!==2||!r.open.sources.some(s=>s.href.includes('cdc.gov'))||!r.open.sources.some(s=>s.href.includes('tools.acc.org')))r.failures.push('Evidence source links');
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
