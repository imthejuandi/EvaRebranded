'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const origin=process.env.EVA_QA_ORIGIN||'https://eva-content-review.jdlagop.chatgpt.site';
const version=process.env.EVA_REVIEW_VERSION||'37';
const out='/workspace/eva-in-place-qa';
const cases=[{locale:'en',width:1366,height:650},{locale:'es',width:375,height:812},{locale:'en',width:390,height:844,reduced:true}];
const report={origin,version,cases:[],errors:[],physicalDevicePerformance:'Not measured; Chromium viewport emulation.'};
const clean=s=>s.replace(/\s+/g,' ').trim();
const settle=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
const rect=locator=>locator.evaluate(e=>e.getBoundingClientRect().toJSON());
const file=(v,name)=>`${out}/sections-v${version}-${v.locale}-${v.width}x${v.height}${v.reduced?'-reduced':''}-${name}.png`;
async function target(locator){const r=await rect(locator);assert(r.height>=43.5&&r.width>=43.5,`Target is smaller than 44px: ${JSON.stringify(r)}`);return r;}
async function fits(locator,v){for(const r of await locator.evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({text:e.textContent.trim().slice(0,100),r:e.getBoundingClientRect().toJSON()}))))assert(r.r.left>=-1&&r.r.right<=v.width+1,`Horizontal clipping: ${JSON.stringify(r)}`);}
async function selected(page,index){await page.waitForFunction(i=>document.getElementById(`method-tab-${i}`)?.getAttribute('aria-selected')==='true',index);assert.equal(await page.locator('#el-metodo [role=tabpanel]:not([hidden])').count(),1);assert.equal(await page.locator(`#method-tab-${index}`).getAttribute('tabindex'),'0');}
async function method(page,v,result){
 const section=page.locator('#el-metodo');const tabs=section.getByRole('tab');await tabs.first().scrollIntoViewIfNeeded();assert.equal(await tabs.count(),4);for(let i=0;i<4;i++)await target(tabs.nth(i));
 await tabs.first().click();await selected(page,0);await tabs.first().focus();for(const [key,i]of [['ArrowRight',1],['Home',0],['End',3],['ArrowRight',0],['ArrowLeft',3],['Home',0]]){await page.keyboard.press(key);await selected(page,i);assert(await tabs.nth(i).evaluate(e=>e===document.activeElement),'Arrow/Home/End focus leaves tabs');}
 result.method={tabKeys:true,panels:[]};
 for(let i=0;i<4;i++){
  await tabs.nth(i).click();await selected(page,i);const panel=page.locator(`#method-panel-${i}`);const heading=panel.locator('.method-chapter-body h3');const previous=panel.locator('.method-paging button').first(),next=panel.locator('.method-paging button').last();
  assert.equal(await previous.isDisabled(),i===0);assert.equal(await next.isDisabled(),i===3);await target(previous);await target(next);
  await fits(panel.locator('.method-chapter-body,.method-figure,.method-paging,.method-detail-link'),v);
  const body=await rect(panel.locator('.method-chapter-body')),art=await rect(panel.locator('.method-figure'));if(v.width<=700)assert(body.bottom<=art.top+1,'Phone method explanation does not precede artwork');else assert(art.right<=body.left+1,'Desktop artwork and copy overlap');
  if(i===0){for(const a of await panel.locator('.method-entry-actions a').all())await target(a);}
  if(i>0&&!v.reduced){
   const replay=panel.locator('.method-replay');await target(replay);await heading.focus();await page.keyboard.press('Tab');assert(await replay.evaluate(e=>e===document.activeElement),'Heading Tab does not reach artwork replay');
   await panel.locator('.method-graphs svg').evaluate(e=>{window.__sectionOldMethodSVG=e});await replay.click();assert(await panel.locator('.method-graphs svg').evaluate(e=>e!==window.__sectionOldMethodSVG),'Replay does not remount SVG');
   const animations=await panel.locator('.method-graphs').evaluate(e=>e.getAnimations({subtree:true}).map(a=>({iterations:a.effect.getTiming().iterations,duration:a.effect.getTiming().duration})));assert(animations.every(a=>a.iterations!==Infinity),'Method animation loops indefinitely');
  }
  if(v.reduced){assert.equal(await panel.locator('.method-replay').count(),0);if(i>0)assert.equal(await panel.locator('.method-graphs').getAttribute('data-animate'),'false');}
  await heading.scrollIntoViewIfNeeded();await settle(page);await panel.screenshot({path:file(v,`method-${i}`)});result.method.panels.push({index:i,noClipping:true,phoneCopyFirst:v.width<=700,replay:v.reduced?'calm':i>0?'passed':'not applicable'});
 }
 await tabs.first().click();await selected(page,0);await page.locator('#method-panel-0 .method-paging button').last().click();await selected(page,1);assert(await page.locator('#method-panel-1 h3').evaluate(e=>e===document.activeElement),'Paging does not focus next heading');result.method.pagingFocus=true;
}
async function life(page,v,result){
 const section=page.locator('#volver-a-la-vida');const support=v.locale==='en'?'Context for your next step. Space for what you enjoy.':'Contexto para tu próximo paso. Espacio para lo que disfrutas.';
 if(v.reduced){assert(await section.evaluate(e=>e.classList.contains('life-scene-summary')));assert.equal(clean(await section.locator('p').innerText()),support);await section.scrollIntoViewIfNeeded();await fits(section.locator('h2,p'),v);await section.screenshot({path:file(v,'life-calm')});result.life={calmNarrative:true};return;}
 const frames=[];for(const progress of [.12,.72,.12]){
  const expected=715+185*progress;await section.evaluate((e,p)=>scrollTo({top:e.getBoundingClientRect().top+scrollY+(e.offsetHeight-e.querySelector('.stage').clientHeight)*p,behavior:'instant'}),progress);
  await page.waitForFunction(expected=>{const e=document.querySelector('#volver-a-la-vida [data-rendered-frame]');return e&&Math.abs(Number(e.dataset.renderedFrame)-expected)<3},expected);await settle(page);frames.push(Number(await section.locator('[data-rendered-frame]').getAttribute('data-rendered-frame')));
  assert.equal(clean(await section.locator('[data-layer=life-passage]>p').innerText()),support);await fits(section.locator('[data-motion=return-title],[data-layer=life-passage]>p'),v);
  if(progress===.72)await page.screenshot({path:file(v,'life-settled')});
 }
 assert(frames[1]>frames[0]&&frames[2]<frames[1],'Life scroll does not reverse');result.life={forwardReverseFrames:frames,visualSupportParity:true};
}
async function lifestyle(page,v,result){
 const section=page.locator('#lo-que-te-mueve');await section.scrollIntoViewIfNeeded();await settle(page);await fits(section.locator('.lifestyle-copy,figcaption,h2,.lifestyle-copy>p'),v);assert(await section.locator('img').getAttribute('alt'));const video=section.locator('video'),button=section.locator('.solar-motion-pause');
 if(v.reduced){assert.equal(await video.count(),0);assert.equal(await button.count(),0);result.lifestyle={calmPoster:true};}
 else{
  assert.equal(await video.count(),1);await target(button);await page.waitForFunction(()=>{const v=document.querySelector('#lo-que-te-mueve video');return v&&v.readyState>=2},{},{timeout:25000});assert.equal(await video.evaluate(v=>v.loop),false);
  if(await video.evaluate(v=>v.ended))await button.click();await page.waitForFunction(()=>{const v=document.querySelector('#lo-que-te-mueve video');return v&&!v.paused});
  await button.click();await page.waitForFunction(()=>document.querySelector('#lo-que-te-mueve video')?.paused);assert.equal(await button.getAttribute('aria-pressed'),'true');await button.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('#lo-que-te-mueve video')?.paused);assert.equal(await button.getAttribute('aria-pressed'),'false');
  await section.evaluate(e=>scrollTo({top:e.getBoundingClientRect().top+scrollY-innerHeight*2,behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('#lo-que-te-mueve video')?.paused);await section.scrollIntoViewIfNeeded();await page.waitForFunction(()=>!document.querySelector('#lo-que-te-mueve video')?.paused);
  await video.evaluate(v=>{v.currentTime=Math.max(0,v.duration-.15)});await page.waitForFunction(()=>document.querySelector('#lo-que-te-mueve video')?.ended);assert.equal(await button.getAttribute('aria-pressed'),null);await video.evaluate(e=>{window.__sectionOldSolarVideo=e});await button.click();await page.waitForFunction(()=>{const v=document.querySelector('#lo-que-te-mueve video');return v&&v!==window.__sectionOldSolarVideo&&!v.paused&&v.currentTime<2});result.lifestyle={playPauseKeyboardResume:true,offscreenPauseResume:true,endReplay:true,finiteVideo:true};
 }
 await section.screenshot({path:file(v,'lifestyle')});
}
async function closing(page,v,result){
 const offer=page.locator('#empezar');await offer.scrollIntoViewIfNeeded();await fits(offer.locator('.offer-heading,.offer,[data-offer-upload],[data-offer-kit-action],.offer-panel-details'),v);for(const a of ['[data-offer-upload]','[data-offer-kit-action]','[data-offer-details]'])await target(offer.locator(a));const free=await rect(offer.locator('[data-offer-free]')),kit=await rect(offer.locator('[data-offer-kit]'));if(v.width<=700)assert(free.bottom<=kit.top+1,'Phone offer puts kit before free entry');await offer.screenshot({path:file(v,'offer')});
 const footer=page.locator('#site-footer');await footer.scrollIntoViewIfNeeded();for(const a of await footer.locator('a').all())await target(a);await fits(footer.locator('nav,.footer-brand,.footer-private-note,.footer-base,.motion-choice'),v);
 const motion=footer.getByRole('switch',{name:v.locale==='en'?'Reduce motion':'Reducir movimiento'});assert.equal(await motion.count(),1);const hit=await motion.evaluate(e=>{const p=getComputedStyle(e,'::after');return{width:parseFloat(p.width),height:parseFloat(p.height)}});assert(hit.width>=44&&hit.height>=44);await motion.focus();assert(await motion.evaluate(e=>e===document.activeElement));await footer.screenshot({path:file(v,'footer')});result.closing={freeEntryFirst:true,allFooterLinks44px:true,calmSwitchRoleAndHitarea:hit};
 if(!v.reduced){assert.equal(await motion.getAttribute('aria-checked'),'false');await page.keyboard.press(' ');await page.waitForFunction(()=>document.querySelector('#el-metodo')?.classList.contains('method-journey-calm'));assert.equal(await motion.getAttribute('aria-checked'),'true');assert(await page.evaluate(()=>!matchMedia('(prefers-reduced-motion:reduce)').matches));assert.equal(await page.locator('#lo-que-te-mueve video').count(),0);assert.equal(await page.locator('#lo-que-te-mueve .solar-motion-pause').count(),0);assert.equal(await page.locator('#el-metodo .method-replay').count(),0);assert(await page.locator('#volver-a-la-vida').evaluate(e=>e.classList.contains('life-scene-summary')));result.closing.manualCalmIndependent=true;await motion.scrollIntoViewIfNeeded();await motion.click();await page.waitForFunction(()=>!document.querySelector('#el-metodo')?.classList.contains('method-journey-calm'));assert.equal(await motion.getAttribute('aria-checked'),'false');}
}
(async()=>{let browser;try{fs.mkdirSync(out,{recursive:true});const proxy=process.env.HTTPS_PROXY||process.env.HTTP_PROXY;browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage'],...(proxy?{proxy:{server:proxy}}:{})});for(const v of cases){console.log('Sections',JSON.stringify(v));const result={...v};report.cases.push(result);const context=await browser.newContext({viewport:{width:v.width,height:v.height},reducedMotion:v.reduced?'reduce':'no-preference'});const page=await context.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>report.errors.push({case:v,message:e.message}));try{assert.equal((await page.goto(`${origin}/${v.locale}?review=${version}#el-metodo`,{waitUntil:'domcontentloaded'})).status(),200);await page.waitForFunction(reduced=>reduced?!!document.querySelector('.calm-hero'):document.querySelector('.hero-entrance')?.dataset.heroEntrance==='skip',!!v.reduced);await page.waitForFunction(()=>{const footer=document.querySelector('#site-footer'),primary=document.querySelector('[data-offer-upload]');return footer&&primary&&getComputedStyle(footer).display==='grid'&&parseFloat(getComputedStyle(primary).minHeight)>=55});await page.evaluate(()=>document.fonts.ready);await settle(page);await method(page,v,result);await life(page,v,result);await lifestyle(page,v,result);await closing(page,v,result);result.passed=true;}catch(e){result.failure=e.stack;await page.screenshot({path:file(v,'failure')}).catch(()=>{});throw e;}finally{await context.close();}}assert.equal(report.errors.length,0,JSON.stringify(report.errors));report.passed=true;}catch(e){report.failure=e.stack;console.error(e.stack);process.exitCode=1;}finally{fs.writeFileSync(`${out}/sections-browser-v${version}-report.json`,JSON.stringify(report,null,2));fs.writeFileSync(`${out}/sections-browser-report.json`,JSON.stringify(report,null,2));await browser?.close();}})();
