const fs = require('node:fs');
const path = require('node:path');
const {chromium, open, settle, scrollTo, expect, inspectHero, report, origin, phase, output} = require('./render.cjs');
const wait = {timeout: 10000};
const receipt = {source: report.source, artifactSha256: report.artifactSha256, phase, profiles: [], pageErrors: report.pageErrors, blockedRequests: report.blockedRequests, allOwnedBrowsersClosed: false};
async function tasso(page, record) {
  await scrollTo(page, '#recogida-en-casa');
  const section = page.locator('#recogida-en-casa [data-tasso-video-process]');
  const actions = section.locator('.tasso-video-actions button');
  const video = section.locator('video');
  const playing = paused => page.waitForFunction(v => {
    const media = document.querySelector('#recogida-en-casa video');
    return media?.readyState >= 2 && media.paused === v;
  }, paused, wait);
  const step = value => page.waitForFunction(v => document.querySelector('[data-tasso-video-process]').dataset.step === v, value, wait);
  await playing(false);
  const media = await video.evaluate(e => ({playbackRate: e.playbackRate, src: e.currentSrc, time: e.currentTime}));
  await actions.nth(1).click();
  await playing(true);
  await actions.nth(2).click();
  await step('2');
  await actions.nth(0).click();
  await step('1');
  await playing(false);
  await actions.nth(1).focus();
  await page.keyboard.press('Enter');
  await playing(true);
  record.tasso = {...media, previousNext: true, keyboardPause: true};
  expect(record, 'original Tasso at native speed', media.playbackRate === 1 && media.src.endsWith('/process-continuity-v3.mp4'), media);
}
async function kit(page, record) {
  const passage = page.locator('#kit-inicial');
  const clock = async value => {
    await passage.evaluate((e, raw) => {
      const travel = e.offsetHeight - e.querySelector('.stage').clientHeight;
      scrollTo({top: e.getBoundingClientRect().top + scrollY + travel * raw / 240, behavior: 'instant'});
    }, value);
    await page.waitForFunction(raw => Math.abs(Number(document.querySelector('#kit-inicial').dataset.kitScrollClock) - raw) < 2, value, wait);
  };
  await clock(100);
  const markers = await passage.locator('.stage .kit-marker-name').allTextContents();
  await clock(145);
  await page.waitForFunction(() => {
    const d = document.querySelector('#kit-inicial').dataset;
    return d.kitRevealState === 'complete' && Number(d.kitPresentationClock) > 299;
  }, null, wait);
  const meanings = await passage.locator('.stage [data-kit-meaning]').evaluateAll(es => es.map(e => Number(getComputedStyle(e).opacity)));
  await clock(100);
  await page.waitForFunction(() => Number(document.querySelector('#kit-inicial').dataset.kitPresentationClock) < 141, null, wait);
  record.kit = {markers, meanings, duration: await passage.getAttribute('data-kit-transition-duration-ms'), reversed: true};
  expect(record, 'kit retains 13 markers, dynamic meanings and 500ms reveal', markers.length === 13 &&
    meanings.length === 13 && meanings.every(x => x > .98) && record.kit.duration === '500', record.kit);
}
async function typeGeometry(page, record) {
  if (phase === 'baseline') return;
  await scrollTo(page, '.results-problem', -8);
  await settle(page);
  record.typeGeometry = await page.locator('.results-problem-lead').evaluate(e => {
    const css = getComputedStyle(e);
    const chapter = e.closest('section');
    const range = document.createRange();
    range.selectNodeContents(e);
    const lines = [...range.getClientRects()].map(rect => ({left: rect.left, right: rect.right, width: rect.width, height: rect.height}));
    const channel = color => color.match(/[\d.]+/g).slice(0,3).map(v => Number(v) / 255);
    const luminance = color => channel(color).map(v => v <= .04045 ? v / 12.92 : ((v + .055)/1.055) ** 2.4)
      .reduce((total, value, index) => total + value * [.2126, .7152, .0722][index], 0);
    const c = [luminance(css.color), luminance(getComputedStyle(chapter).backgroundColor)].sort((a,b) => b-a);
    const bounds = e.getBoundingClientRect();
    return {
      width: bounds.width, lines, height: bounds.height, font: css.fontFamily, fontWeight: css.fontWeight,
      fontSize: css.fontSize, leading: css.lineHeight, loadedHanken: document.fonts.check('400 16px "EVA Hanken"'),
      contrast: (c[0] + .05) / (c[1] + .05), paragraph: e.textContent, viewport: innerWidth,
      headingMargin: document.querySelector('#alex-story').getBoundingClientRect().top - bounds.bottom,
    };
  });
  const g = record.typeGeometry;
  expect(record, 'regional body type and contrast', g.font.includes('EVA Hanken') && g.loadedHanken &&
    g.fontWeight === '400' && g.fontSize === '16px' && g.leading === '24px' && g.contrast >= 4.5 &&
    g.lines.every(line => line.left >= 0 && line.right <= g.viewport), g);
}
async function destinations(page, record) {
  record.destinations = [];
  for (const [selector, plan] of [['.hero-kit-cta','free'], ['.hero-kit-secondary','quarterly']]) {
    await page.goto(origin + '/' + record.locale);
    await page.waitForFunction(() => document.querySelector('.hero-entrance').dataset.heroEntrance === 'watching', null, wait);
    await page.keyboard.press('Escape');
    const action = page.locator(selector);
    await action.click();
    await page.waitForURL(url => url.pathname === '/' + record.locale + '/signup' && url.searchParams.get('plan') === plan);
    const free = plan === 'free';
    const content = await page.locator(free ? '[data-free-allowance]' : '.eva-access-intent').innerText();
    const url = new URL(page.url());
    record.destinations.push({path: url.pathname + url.search, content, forms: await page.locator('form').count()});
    expect(record, 'signup displays original intent ' + plan, free
      ? url.searchParams.get('redirect') === '/es/upload' && /5|five|cinco/i.test(content)
      : /13/.test(content) && /99/.test(content) && /VAT|IVA/i.test(content), content);
  }
}
(async () => {
  const browser = await chromium.launch({headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox','--disable-dev-shm-usage']});
  try {
    for (const locale of ['en','es']) {
      const width = locale === 'en' ? 1366 : 320, height = locale === 'en' ? 900 : 844;
      const record = {id: locale + '-supplement', locale, width, height, failures: []};
      receipt.profiles.push(record);
      const {page, context} = await open(browser, record);
      page.setDefaultTimeout(10000);
      try {
        await settle(page);
        for (const task of [tasso, kit, typeGeometry, destinations]) {
          try { await task(page, record); }
          catch (error) {record.failures.push({name: task.name, detail: error.stack});}
        }
      } finally {await context.close();}
      console.log(record.id, record.failures.length ? record.failures : 'PASS');
    }
  } finally {
    await browser.close();
    receipt.allOwnedBrowsersClosed = true;
    fs.writeFileSync(path.join(output,'supplement-report.json'),JSON.stringify(receipt,null,2));
  }
})();
