// Live, isolated browser-local preview checks. Does not upload files or confirm checkout.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ORIGIN=process.env.EVA_REVIEW_ORIGIN||'https://eva-content-review.jdlagop.chatgpt.site';
const VERSION=process.env.EVA_REVIEW_VERSION||'60';
assert.match(VERSION,/^\d+$/);
const OUT='/workspace/eva-in-place-qa';
const STORE='eva-design-preview-04';
const report={version:Number(VERSION),origin:ORIGIN,cases:[],findings:[],errors:[],networkWrites:[],browserVerified:true};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const shot=async(page,name)=>{const file=`${OUT}/entry-v${VERSION}-${name}.png`;await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});await page.screenshot({path:file,fullPage:false});return file;};
const text=async locator=>(await locator.innerText()).replace(/\s+/g,' ').trim();
const uri=(locale,hash='empezar')=>`${ORIGIN}/${locale}?review=${VERSION}#${hash}`;
const expectQuery=(url,locale,plan)=>{const u=new URL(url,ORIGIN);assert.equal(u.pathname,`/${locale}/signup`);assert.equal(u.searchParams.get('plan'),plan);if(plan==='free')assert.equal(u.searchParams.get('redirect'),'/es/upload');};
async function target(locator){await locator.scrollIntoViewIfNeeded();await locator.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});const box=await locator.boundingBox();assert(box&&box.width>=44&&box.height>=44);const hit=await locator.evaluate(el=>{const r=el.getBoundingClientRect(),node=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return node===el||el.contains(node);});assert(hit,'CTA center is obscured');return box;}
const legacyKit=/\b15\s+(?:biomarcadores|biomarkers)|(?:396\s*€|€\s*396)/i;
function recordLegacy(where,content,locale,screenshot){if(legacyKit.test(content))report.findings.push({type:'legacy_starter_terms',where,locale,text:content,screenshot});}
function approvedKitCopy(where,content,{requireCancellation=true}={}){
 assert(!legacyKit.test(content),where+': obsolete starter scope or price');
 assert(/\b13\s+(?:biomarcadores|biomarkers|marcadores|markers)\b/i.test(content),where+': missing 13-marker scope');
 assert(/(?:99\s*€|€\s*99)\s*\+\s*(?:IVA|VAT)/i.test(content),where+': missing price or VAT');
 assert(/suscr[ií]|subscri/i.test(content),where+': missing subscription');
 assert(/quarterly|trimestral|por trimestre|per quarter|\/\s*(quarter|trimestre)/i.test(content),where+': missing quarterly price');
 if(requireCancellation)assert(/cancela cuando quieras|cancel anytime/i.test(content),where+': missing cancellation terms');
}

const reportFormat = {en: /PDF or photo of a previous blood test report/i, es: /analítica de sangre que ya tengas, en PDF o en foto/i};
const freeTotal=/up to 5 reports in total|hasta 5 informes en total/i;
const labYear=/unlimited report uploads for one year from purchase|informes sin límite durante un año desde la compra/i;
const activeUploads=/unlimited reports while your subscription is active|informes sin límite mientras tu suscripción esté activa/i;

async function home(page,locale){
 const response=await page.goto(uri(locale),{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
 await page.locator('.calm-hero').waitFor({state:'visible'});await page.locator('[data-offer-upload]').waitFor({state:'visible'});await page.waitForFunction(()=>{const label=document.querySelector('.hero-action-label');return label&&getComputedStyle(label).display==='block'&&getComputedStyle(document.querySelector('.hero-start')).fontFamily.includes('EVA Hanken');});await page.evaluate(()=>document.fonts.ready);
 const problem=page.locator('[data-problem-chapter]');
 const runner=page.locator('.calm-hero');
 assert.equal(await runner.locator('a[href*="/signup"]').count(),2);
 assert.equal(await page.locator('.masthead .join').getAttribute('href'),'#entender-tus-analisis');
 const statementFree=problem.locator('[data-statement-free]');
 assert.equal(await problem.locator('a[href*="/signup"]').count(),1,'Statement chapter keeps a single signup action');
 assert.equal(await text(statementFree),locale==='en'?'Start for free':'Empieza gratis');
 expectQuery(await statementFree.getAttribute('href'),locale,'free');
 assert.equal(await text(problem.locator('h2')),locale==='en'?'What does “healthy” really mean?':'¿Qué significa estar «sano» de verdad?');
 const chapterText=await text(problem);
 assert.match(await text(problem.locator('.report-lead')),locale==='en'?/adults who rated their health as good or very good/i:/adultos que valoraron su salud como buena o muy buena/i);
 const facts=problem.locator('[data-statement-fact]');
 assert.equal(await facts.count(),2,'Two sourced statistics');
 assert.match(await text(facts.nth(0)),/10\s*%/);assert.match(await text(facts.nth(0)),/prediabetes/i);
 assert.match(await text(facts.nth(1)),/46\s*%/);
 assert.match(await text(facts.nth(1)),locale==='en'?/of those with type 2 diabetes were undiagnosed/i:/de quienes tenían diabetes tipo 2 no estaban diagnosticados/i,'46% remains qualified to its diabetes subgroup');
 assert.match(await text(problem.locator('.report-source-context')),/2013\s*[–-]\s*2019/);
 assert.equal(await problem.locator('[data-statement-source]').count(),2);
 for(const source of await problem.locator('[data-statement-source]').all()){
  const sourceUrl=new URL(await source.getAttribute('href'));
  assert.equal(sourceUrl.hostname,'www.ons.gov.uk');
  assert.match(sourceUrl.pathname,/riskfactorsforprediabetesandundiagnosedtype2diabetesinengland/);
 }
 assert.equal(await text(problem.locator('.report-explanation')),locale==='en'?'Understand what your body’s data means—and follow how it changes.':'Entiende qué significan los datos de tu cuerpo y sigue su evolución.');
 assert.equal(await problem.locator('[data-report-specimen], [data-value]').count(),0);
 assert.doesNotMatch(chapterText,/\b95\s?%|hs-CRP|\bAlex\b/);
 assert(await runner.evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('[data-problem-chapter]')) & Node.DOCUMENT_POSITION_FOLLOWING)));
 assert(await problem.evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('#recogida-en-casa')) & Node.DOCUMENT_POSITION_FOLLOWING)));
 for(const selector of ['.hero-kit-cta','[data-range-upload]','[data-method-upload]','[data-offer-upload]'])expectQuery(await page.locator(selector).getAttribute('href'),locale,'free');
 for(const selector of ['.hero-kit-secondary','[data-method-kit]','[data-offer-kit-action]'])expectQuery(await page.locator(selector).getAttribute('href'),locale,'quarterly');
 for(const selector of ['.hero-kit-cta','.hero-kit-secondary']){
  const action=page.locator(selector);
  assert((await text(action.locator('.hero-action-label'))).split(/\s+/).length<=4,selector+' short label');
  assert(await action.locator('.hero-action-detail').count()>0,selector+' supporting detail inside button');
 }
 const kitAction=page.locator('.hero-kit-secondary');
 const kitDescription=await text(kitAction);
 assert.equal(await text(page.locator('.hero-kit-cta .hero-action-label')),locale==='en'?'Start for free':'Empieza gratis');
 assert.equal(await text(kitAction.locator('.hero-action-label')),locale==='en'?'Subscribe quarterly':'Suscripción trimestral');
 const freeDescription=await text(page.locator('.hero-kit-cta'));
 assert.match(freeDescription,locale==='en'?/Upload labs/:/Sube analíticas/);
 assert.equal(await page.locator('.hero-start-terms').count(),0,'No separate hero terms line');
 approvedKitCopy('compact hero kit action',kitDescription,{requireCancellation:false});
 approvedKitCopy('method kit',await text(page.locator('[data-method-kit]')));
 for(const selector of ['.report-free-allowance','[data-range-upload]','.guided-start','[data-method-upload]']){
  assert.match(await text(page.locator(selector)),/5 free report uploads per account|5 informes gratis por cuenta/i,selector+' free uploads');
 }
 assert.match(await text(page.locator('[data-offer-free]')),freeTotal);
 const details = page.locator('#free-report-details');
 assert.match(await text(details), reportFormat[locale]);
 assert.equal(await page.locator('[data-offer-upload]').getAttribute('aria-describedby'), 'free-report-details');
 const offer=page.locator('[data-offer-kit]');
 assert.match(await text(offer),activeUploads);
 approvedKitCopy('closing offer',(await text(offer))+' '+await offer.locator('[data-offer-price]').getAttribute('aria-label'));
 assert.equal(await page.locator('[data-range-kit]').count(),0,'Range proof keeps its single free-report action');
}
async function publicAndFooter(page,locale,result){
 const footer=page.locator('#site-footer');await footer.scrollIntoViewIfNeeded();
 const links=await footer.locator('a').evaluateAll(es=>es.map(el=>({href:el.getAttribute('href'),lang:el.getAttribute('hreflang'),text:el.textContent.trim()})));
 const privateLink=links.find(x=>x.href==='/es/dashboard');assert(privateLink&&privateLink.lang==='es');
 const publicPaths=['how-it-works','science','pricing','about','blog','contact','legal/privacy','legal/terms','legal/cookies'];
 result.publicLinks=[];
 for(const path of publicPaths){const href=`/${locale}/${path}`;assert(links.some(x=>x.href===href));const response=await page.request.get(ORIGIN+href);assert.equal(response.status(),200,href);result.publicLinks.push({href,status:response.status()});}
 assert(links.some(x=>x.href==='/system'&&x.lang==='es')&&links.some(x=>x.href==='/history'&&x.lang==='es'));
 assert(links.some(x=>x.href==='mailto:hello@evahealth.es'));
 const motion=footer.getByRole('switch',{name:locale==='en'?'Reduce motion':'Reducir movimiento',exact:true});await motion.waitFor({state:'visible'});assert.equal(await motion.getAttribute('aria-checked'),'true');
 await footer.locator('.footer-design-links a').last().focus();await page.keyboard.press('Tab');assert.equal(await motion.evaluate(el=>el===document.activeElement),true);result.switchKeyboardFocus=true;result.switchNameAndState=true;
 const language=footer.locator('.site-language-switch'),href=await language.getAttribute('href');const other=locale==='en'?'es':'en';assert.equal(new URL(href,ORIGIN).pathname,`/${other}`);
 await language.click();await page.waitForURL(u=>u.pathname===`/${other}`);await page.locator('#site-footer').waitFor();result.languageSwitchClicked={from:locale,to:other,url:page.url()};
 await home(page,locale);
}
async function signup(page,locale,plan,result){
 if(plan==='full_panel'){
  await page.goto(`${ORIGIN}/${locale}/signup?plan=full`,{waitUntil:'domcontentloaded'});
 }else{
  const selector=plan==='free'?'[data-offer-upload]':'[data-offer-kit-action]';const action=page.locator(selector);result.entryTarget=await target(action);
  await action.focus();await page.keyboard.press('Enter');await page.waitForURL(u=>u.pathname===`/${locale}/signup`);expectQuery(page.url(),locale,plan);
 }
 await page.locator('input[name=email]').waitFor({state:'visible'});const submit=page.getByRole('button',{name:locale==='en'?'Create an example account':'Crear cuenta de ejemplo',exact:true});await submit.waitFor({state:'visible'});await page.waitForFunction(()=>{const b=document.querySelector('.eva-access-form form button.eva-button:not(.eva-button-secondary)');return b&&!b.disabled;});
 const notice=await text(page.locator('.eva-access-demo'));assert(/No accounts are created|No se crean cuentas/.test(notice));result.previewNotice=true;result.signupUrl=page.url();
 if(plan==='free'){
  await page.locator('#free-report-format').waitFor({state:'visible'});
  assert.match(await text(page.locator('#free-report-format')), reportFormat[locale]);
  assert.equal(await page.locator('form').getAttribute('aria-describedby'), 'free-report-format');
  const disclosure=await text(page.locator('[data-free-allowance]'));
  assert.match(disclosure,freeTotal);assert.match(disclosure,activeUploads);
 }else if(plan==='full_panel'){
  await page.waitForFunction(()=>document.querySelector('.eva-access-intent')?.textContent.includes('499'));
  assert.match(await text(page.locator('.eva-access-intent')),labYear);
 }else{
  await page.waitForFunction(()=>document.querySelector('.eva-access-intent')?.textContent.includes('13'));
  assert.match(await text(page.locator('.eva-access-intent')),activeUploads);
 }
 if (plan !== 'free') {
  assert.equal(await page.locator('#free-report-format').count(), 0);
 }
 if(plan==='quarterly'){const intent=page.locator('.eva-access-intent');await intent.waitFor();const content=await text(intent);const screenshot=await shot(page,`${plan}-${locale}-signup`);recordLegacy('signup',content,locale,screenshot);approvedKitCopy('signup',content);result.signupIntentText=content;result.signupApprovedKitCopy=Number(VERSION)>=38;}
 await page.locator('input[name=email]').fill(`eva-qa-${locale}-${plan}@example.invalid`);await page.locator('input[name=password]').fill('Fictional-QA-Only-2026!');await page.locator('input[name=confirm]').fill('Fictional-QA-Only-2026!');
 for(const name of ['terms','health','age'])await page.locator(`input[name=${name}]`).check();assert.equal(await page.locator('input[name=marketing]').isChecked(),false);
 await submit.click();await page.locator('.eva-access-success[role=status]').waitFor({state:'visible'});const confirmation=await text(page.locator('.eva-access-success'));assert(/no email|no messages|does not send a message|no se envía ningún mensaje/i.test(confirmation));
 await page.getByRole('button',{name:locale==='en'?'Continue with the example':'Continuar con el ejemplo',exact:true}).click();await page.waitForURL(u=>u.pathname==='/es/onboarding');assert.equal(new URL(page.url()).searchParams.get('plan'),plan);if(plan==='free')assert.equal(new URL(page.url()).searchParams.get('redirect'),'/es/upload');result.onboardingUrl=page.url();
}
async function onboarding(page,locale,plan,result){
 await page.getByRole('heading',{name:'Haz espacio para tus resultados.',exact:true}).waitFor();await page.locator('.onboarding-actions button.eva-button').click();await page.getByRole('heading',{name:'Cuéntanos un poco de ti.',exact:true}).waitFor();
 await page.getByLabel('Nombre',{exact:true}).fill('QA');await page.getByLabel('Apellido',{exact:true}).fill('Fictional');await page.getByLabel('Fecha de nacimiento',{exact:true}).fill('1990-01-01');await page.locator('.onboarding-fields select').selectOption('other');
 await page.locator('.onboarding-actions button.eva-button').click();await page.getByRole('heading',{name:'Elige cómo leerlo.',exact:true}).waitFor();await page.getByRole('radio',{name:/Quiero profundizar/}).check();await page.locator('.onboarding-actions button.eva-button').click();await page.getByRole('heading',{name:'Elige tu primer paso.',exact:true}).waitFor();
 const selected=page.locator('input[name=path]:checked');await selected.waitFor({state:'attached'});const choice=await selected.evaluate(el=>el.closest('label').innerText);assert.match(choice,plan==='free'?/analítica que ya tengo/:plan==='full_panel'?labYear:/kit/i);result.preselectedChoice=choice.replace(/\s+/g,' ').trim();
 const allChoices=await text(page.locator('.onboarding-choices'));const screenshot=await shot(page,`${plan}-${locale}-onboarding-choices`);assert.match(allChoices,freeTotal);assert.match(allChoices,activeUploads);recordLegacy('onboarding choices',allChoices,locale,screenshot);approvedKitCopy('onboarding choices',allChoices);result.onboardingChoices=allChoices;if(Number(VERSION)>=38){const choices=await page.locator('.onboarding-choices label').allTextContents();assert(/analítica que ya tengo/.test(choices[0]));assert.equal(choices.length,plan==='full_panel'?3:2,'Only the explicit lab intent adds the laboratory option');assert(/sin suscripción/i.test(choices[0]));result.onboardingApprovedKitCopy=true;result.currentEntryChoices=true;}
 await page.locator('.onboarding-actions button.eva-button').click();if(plan==='free'){
  await page.waitForURL(u=>u.pathname==='/es/upload');await page.getByRole('heading',{name:'Añade tus resultados.',exact:true}).waitFor();await page.getByRole('button',{name:'Usar informe de ejemplo',exact:true}).waitFor({state:'visible'});result.completedAt='upload';result.screenshot=await shot(page,`${plan}-${locale}-upload`);
 }else{
  await page.waitForURL(u=>u.pathname==='/es/checkout/resume');
  assert.equal(new URL(page.url()).searchParams.get('plan'),plan);
  const card=page.locator('.checkout-summary');await card.waitFor();
  const summary=await text(card);const screenshot=await shot(page,`${plan}-${locale}-checkout`);
  if(plan==='full_panel'){
   assert.match(summary,/499\s*€/);assert.match(summary,/pago único/i);assert.match(summary,labYear);
  }else{
   recordLegacy('checkout before confirmation',summary,locale,screenshot);approvedKitCopy('checkout before confirmation',summary);
   approvedKitCopy('checkout',await text(page.locator('.page-checkout')));result.checkoutApprovedKitCopy=true;
  }
  result.completedAt='checkout, before confirmation';result.screenshot=screenshot;result.checkoutSummary=summary;
 }
 result.previewState=await page.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key));return {hasAccountId:Boolean(s.previewAccountId),used:s.totalUploadsUsed,reports:s.reports.length,session:s.session,onboarded:s.onboarded,plan:s.plan,healthConsent:s.profile.healthConsent,marketing:s.profile.notifications.marketing,literacy:s.profile.literacy};},STORE);
 assert.equal(result.previewState.hasAccountId,true);assert.equal(result.previewState.used,0);assert.equal(result.previewState.reports,0);
 assert.equal(result.previewState.session,true);assert.equal(result.previewState.onboarded,true);assert.equal(result.previewState.plan,'free');assert.equal(result.previewState.healthConsent,true);assert.equal(result.previewState.marketing,false);assert.equal(result.previewState.literacy,'advanced');
}
async function revisitAccount(page,result){
 const id=await page.evaluate(key=>{
  const saved=JSON.parse(localStorage.getItem(key));
  Object.assign(saved,{session:false,totalUploadsUsed:5,freeUploadsUsed:5});
  localStorage.setItem(key,JSON.stringify(saved));
  return saved.previewAccountId;
 },STORE);
 await page.goto(ORIGIN+'/es/signup',{waitUntil:'domcontentloaded'});
 const notice=page.locator('[data-free-allowance]');await notice.waitFor();
 assert.match(await text(notice),freeTotal);
 await page.reload({waitUntil:'domcontentloaded'});await notice.waitFor();
 await page.goto(ORIGIN+'/es/login?redirect=%2Fes%2Fupload',{waitUntil:'domcontentloaded'});
 await page.locator('input[name=email]').fill('eva-qa-es-free@example.invalid');
 await page.locator('input[name=password]').fill('Fictional-QA-Only-2026!');
 await page.getByRole('button',{name:'Entrar en la cuenta de ejemplo',exact:true}).click();
 await page.waitForURL(u=>u.pathname==='/es/upload');
 const current=await page.evaluate(key=>{
  const saved=JSON.parse(localStorage.getItem(key));
  return [saved.previewAccountId,saved.totalUploadsUsed,saved.freeUploadsUsed,saved.session];
 },STORE);
 assert.deepEqual(current,[id,5,5,true],'Opening signup, reloading and logging back in preserve the current demo account');
 result.returningAccountRetained=true;
}

(async()=>{let browser;try{
 fs.mkdirSync(OUT,{recursive:true});const loopback=['localhost','127.0.0.1','[::1]'].includes(new URL(ORIGIN).hostname);const proxy=!loopback&&(process.env.HTTPS_PROXY||process.env.HTTP_PROXY);
 browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage'],...(proxy?{proxy:{server:proxy}}:{})});
 for (const locale of ['en', 'es']) {
  const staticPage = await browser.newPage({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
  try {
   await staticPage.goto(`${ORIGIN}/${locale}?review=${VERSION}`);
   const statement=staticPage.locator('[data-problem-chapter]');
   const facts=statement.locator('[data-statement-fact]');
   assert.equal(await facts.count(),2,'Evidence is server-rendered without JavaScript');
   for(const fact of await facts.all())assert(await fact.isVisible(),'Evidence is readable without JavaScript');
   assert.match(await text(statement.locator('.report-lead')),locale==='en'?/adults who rated their health as good or very good/i:/adultos que valoraron su salud como buena o muy buena/i);
   assert.match(await text(facts.nth(1)),locale==='en'?/of those with type 2 diabetes were undiagnosed/i:/de quienes tenían diabetes tipo 2 no estaban diagnosticados/i,'Diabetes denominator survives without JavaScript');
   assert.equal(await statement.locator('[data-statement-source]').count(),2);
   const poster = staticPage.locator('.poster .hero-runner-static');
   assert.equal(await poster.evaluate(image => getComputedStyle(image).opacity), '1');
   assert.doesNotMatch(await text(staticPage.locator('.poster .hero-support')), /start free|empieza gratis/i);
   await staticPage.locator('.hero-kit-cta').click({timeout:5000});
   await staticPage.waitForURL(url=>url.pathname===`/${locale}/signup`);
   expectQuery(staticPage.url(),locale,'free');
   await staticPage.goBack();
   await staticPage.locator('.masthead .join').click({timeout:5000});
   assert.equal(new URL(staticPage.url()).hash,'#entender-tus-analisis');
   await staticPage.locator('[data-statement-free]').click({timeout:5000});
   await staticPage.waitForURL(url=>url.pathname===`/${locale}/signup`);
   expectQuery(staticPage.url(),locale,'free');
  } finally {
   await staticPage.close();
  }
 }
 report.nativeHeroAndStatementWithoutJavascript = true;
 const retired=await browser.newContext({viewport:{width:390,height:844}});
 try{
  const page=await retired.newPage();
  for(const locale of ['en','es']){
   await page.goto(`${ORIGIN}/${locale}/signup?plan=annual`,{waitUntil:'domcontentloaded'});
   const unavailable=page.locator('.eva-form-error[role=alert]');
   await unavailable.waitFor();assert.match(await text(unavailable),/unavailable|no está disponible/i);
   assert.equal(await page.locator('.eva-access-intent').count(),0);
  }
  await page.goto(`${ORIGIN}/es/checkout/resume?intent=annual`,{waitUntil:'domcontentloaded'});
  await page.getByText(/La opción anual ya no está disponible/i).waitFor();
  assert.equal(await page.locator('.checkout-confirm').count(),0);
  report.retiredAnnualUnavailable=true;
 }finally{await retired.close();}
 for(const locale of ['en','es'])for(const plan of ['free','quarterly','full_panel']){
  console.log('Checking',VERSION,locale,plan);const context=await browser.newContext({viewport:locale==='en'?{width:1440,height:900}:{width:375,height:812},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(20000);page.setDefaultNavigationTimeout(45000);const result={locale,plan,passed:false};report.cases.push(result);
  page.on('pageerror',error=>report.errors.push({locale,plan,message:error.message}));
  await context.route('**/*',route=>{const request=route.request();if(!['GET','HEAD','OPTIONS'].includes(request.method())){report.networkWrites.push({locale,plan,method:request.method(),url:request.url()});return route.abort('blockedbyclient');}return route.continue();});
  try{await home(page,locale);if(plan==='free')await publicAndFooter(page,locale,result);await signup(page,locale,plan,result);await onboarding(page,locale,plan,result);if(locale==='es'&&plan==='free')await revisitAccount(page,result);result.passed=true;}catch(error){result.error=error.stack;try{result.failureScreenshot=await shot(page,`${plan}-${locale}-failure`);}catch{}throw error;}finally{await context.close();}
 }
 assert.equal(report.networkWrites.length,0,'Unexpected mutating network request from local-only preview');assert.equal(report.errors.length,0,'Browser page errors');report.passed=true;report.status=report.findings.length?'functional_checks_passed_with_content_findings':'passed';
}catch(error){report.passed=false;report.failure=error.stack;console.error(error.stack);process.exitCode=1;}finally{await browser?.close();fs.writeFileSync(`${OUT}/entry-flow-report-v${VERSION}.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:report.passed,cases:report.cases.map(x=>({locale:x.locale,plan:x.plan,passed:x.passed,error:x.error})),findings:report.findings,errors:report.errors,networkWrites:report.networkWrites,report:`${OUT}/entry-flow-report-v${VERSION}.json`},null,2));}})();
