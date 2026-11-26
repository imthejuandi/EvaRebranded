const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');
const {createRequire} = require('node:module');
const root = '/workspace/eva-problem-pilot';
const {chromium} = createRequire('/workspace/eva-playback-review/package.json')('playwright');
const phase = process.argv[2];
if (!['baseline', 'candidate'].includes(phase)) throw Error('Usage: node render.cjs baseline|candidate');
const output = path.join(__dirname, phase);
const dist = phase === 'baseline' ? path.join(output, 'dist/client') : path.join(root, 'dist/client');
const baselineSource = '58bac762100a18c440b38429dee95f4663194e2d';
const origin = 'https://eva-problem-pilot.invalid';
const digest = data => crypto.createHash('sha256').update(data).digest('hex');
const artifactFiles = fs.readdirSync(dist, {recursive: true, withFileTypes: true})
  .filter(entry => entry.isFile())
  .map(entry => path.relative(dist, path.join(entry.parentPath, entry.name))).sort()
  .map(name => [name, digest(fs.readFileSync(path.join(dist, name)))]);
const sourceFiles = new Set([
  ...execFileSync('git', ['ls-tree', '-r', '--name-only', baselineSource], {cwd: root}).toString().trim().split('\n'),
  ...execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '--', 'app', 'components', 'lib', 'public', 'remotion'], {cwd: root}).toString().trim().split('\n'),
]);
const pinnedManifest = path.join(__dirname, 'baseline', 'source-manifest.json');
const usePinnedManifest = phase === 'baseline' && fs.existsSync(pinnedManifest);
const sourceManifest = usePinnedManifest ? JSON.parse(fs.readFileSync(pinnedManifest)) : [...sourceFiles]
  .filter(name => /^(app|components|lib|public|remotion)\//.test(name))
  .sort().map(name => {
    const filename = path.join(root, name);
    return [name, fs.existsSync(filename) ? digest(fs.readFileSync(filename)) : null];
  });
const report = {
  phase, artifactScope: 'Production files fulfilled directly through Chromium routing; no server, hosted preview or network requests.',
  source: phase === 'baseline' ? baselineSource : execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root}).toString().trim(),
  sourceManifestSha256: digest(JSON.stringify(sourceManifest)),
  artifactSha256: digest(JSON.stringify(artifactFiles)), artifactFiles: artifactFiles.length,
  artifactHashMethod: 'SHA-256 of JSON array of sorted relative file paths and each file SHA-256.',
  runnerSha256: digest(fs.readFileSync(__filename)), reportStarted: new Date().toISOString(),
  profiles: [], fallbacks: [], missingFiles: [], blockedRequests: [], pageErrors: [], mediaRanges: {},
  allOwnedBrowsersClosed: false,
};
if (!usePinnedManifest) fs.writeFileSync(path.join(output, 'source-manifest.json'), JSON.stringify(sourceManifest, null, 2));
fs.writeFileSync(path.join(output, 'artifact-manifest.json'), JSON.stringify(artifactFiles, null, 2));
const type = file => ({
  mp4: 'video/mp4', webm: 'video/webm', woff2: 'font/woff2', png: 'image/png',
  webp: 'image/webp', jpeg: 'image/jpeg', jpg: 'image/jpeg', svg: 'image/svg+xml',
  js: 'text/javascript', css: 'text/css', html: 'text/html', rsc: 'text/x-component',
}[path.extname(file).slice(1)] || 'application/octet-stream');
function localRoute(record, mediaFailure) {
  return async route => {
    const req = route.request(), url = new URL(req.url());
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method()) || url.origin !== origin) {
      report.blockedRequests.push({id: record.id, method: req.method(), origin: url.origin, pathname: url.pathname});
      return route.abort();
    }
    if (mediaFailure && /runner.*\.(mp4|webm)$/.test(url.pathname)) {
      record.abortedMedia.push(url.pathname);
      return route.abort('failed');
    }
    const rel = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');
    if (rel.split('/').includes('..')) return route.abort();
    const raw = path.join(dist, rel);
    const file = [raw, path.join(raw, 'index.html'), raw + '.html'].find(name => fs.existsSync(name) && fs.statSync(name).isFile());
    if (!file) {
      report.missingFiles.push({id: record.id, pathname: url.pathname});
      return route.abort();
    }
    const headers = {'Content-Type': type(file), 'Accept-Ranges': 'bytes'};
    const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers().range ?? '');
    if (!range) return route.fulfill({path: file, headers});
    const size = fs.statSync(file).size;
    const start = Number(range[1]), end = Math.min(range[2] ? Number(range[2]) : size - 1, size - 1);
    if (start > end) return route.fulfill({status: 416, headers: {...headers, 'Content-Range': 'bytes */' + size}});
    const body = Buffer.alloc(end - start + 1);
    const fd = fs.openSync(file, 'r');
    try { fs.readSync(fd, body, 0, body.length, start); } finally { fs.closeSync(fd); }
    report.mediaRanges[url.pathname] = (report.mediaRanges[url.pathname] || 0) + 1;
    return route.fulfill({status: 206, body, headers: {...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': String(body.length)}});
  };
}
function initProbe() {
  window.evaTools = {};
  Object.defineProperty(document, 'modelContext', {configurable: true, value: {
    registerTool: tool => { window.evaTools[tool.name] = tool; },
  }});
  window.heroObservations = [];
  let previous = '';
  new MutationObserver(() => {
    const main = document.querySelector('.hero-entrance');
    const runner = document.querySelector('[data-tracked-runner]');
    if (!main) return;
    const state = main.dataset.heroEntrance + '/' + (runner?.dataset.arrivalState ?? '');
    if (state === previous) return;
    previous = state;
    const action = document.querySelector('[data-hero-reveal=action]');
    window.heroObservations.push({
      at: Math.round(performance.now()), entry: main.dataset.heroEntrance, runner: runner?.dataset.arrivalState,
      visibility: action ? getComputedStyle(action).visibility : null,
      signal: runner?.dataset.signalTime, video: runner?.querySelector('video')?.currentTime,
    });
  }).observe(document, {subtree: true, childList: true, attributes: true, attributeFilter: ['data-hero-entrance', 'data-arrival-state']});
}
const waitOptions = {timeout: 10000};
async function open(browser, record, {javaScriptEnabled = true, mediaFailure = false, fragment = ''} = {}) {
  const context = await browser.newContext({
    viewport: {width: record.width, height: record.height}, serviceWorkers: 'block',
    reducedMotion: record.reduced ? 'reduce' : 'no-preference', javaScriptEnabled,
  });
  try {
    await context.route('**/*', localRoute(record, mediaFailure));
    await context.addInitScript(initProbe);
    const page = await context.newPage();
    page.on('pageerror', error => report.pageErrors.push({id: record.id, message: error.message}));
    const response = await page.goto(origin + '/' + record.locale + fragment, {waitUntil: 'domcontentloaded', timeout: 20000});
    if (response?.status() !== 200) throw Error('Landing did not return 200');
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.hero-kit-cta')).minHeight === '44px', null, waitOptions);
    return {context, page};
  } catch (error) {
    await context.close();
    throw error;
  }
}
const shot = (page, id, label) => page.screenshot({path: path.join(output, id + '-' + label + '.png'), timeout: 15000});
const settle = page => page.evaluate(async () => {await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));});
const scrollTo = (page, selector, offset = 0) => page.locator(selector).evaluate((element, position) => {
  scrollTo({top: element.getBoundingClientRect().top + scrollY + position, behavior: 'instant'});
}, offset);
const save = () => fs.writeFileSync(path.join(output, 'render-report.json'), JSON.stringify(report, null, 2));
function inspectHero() {
  const main = document.querySelector('.hero-entrance');
  const art = document.querySelector('.masthead .wordmark-art');
  const box = e => { const r = e.getBoundingClientRect(); return {x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom}; };
  const actions = [...document.querySelectorAll('.hero-start a')].map(e => {
    const b = box(e);
    const center = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
    const chain = [];
    for (let a = e; a && a !== main; a = a.parentElement) {
      const style = getComputedStyle(a);
      chain.push({opacity: Number(style.opacity), visibility: style.visibility, inert: a.inert});
    }
    return {href: e.getAttribute('href'), text: e.textContent.trim(), box: b, hit: !!center && e.contains(center),
      visible: chain.every(c => c.opacity > .98 && c.visibility === 'visible' && !c.inert), chain};
  });
  const still = document.querySelector('.hero-runner-static,[data-tracked-runner] img');
  const active = document.activeElement;
  return {
    entry: main.dataset.heroEntrance, runner: document.querySelector('[data-tracked-runner]')?.dataset.arrivalState,
    actions, reduced: !!document.querySelector('.calm-hero'), scrollY, viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth, active: {tag: active?.tagName, className: active?.getAttribute('class'), href: active?.getAttribute('href')},
    still: still ? {loaded: still.complete && still.naturalWidth > 0, opacity: Number(getComputedStyle(still).opacity), src: still.getAttribute('src')} : null,
    logo: {box: box(art), mask: getComputedStyle(art).maskImage, href: art.parentElement.getAttribute('href'), label: art.parentElement.getAttribute('aria-label')},
    video: [...document.querySelectorAll('.opening-runner video')].map(v => ({readyState: v.readyState, rate: v.playbackRate, time: v.currentTime, src: v.currentSrc})),
  };
}
function inspectSections() {
  const selectors = ['#entender-tus-analisis', '#alex-story', '#recogida-en-casa', '#kit-inicial', '#otra-lectura', '#biomarcadores', '#una-senal', '#tu-evolucion', '#volver-a-la-vida'];
  const top = e => e.getBoundingClientRect().top + scrollY;
  const alex = document.querySelector('#alex-story');
  const gallery = document.querySelector('#biomarcadores');
  const range = document.querySelector('#otra-lectura');
  const regions = [alex.closest('section'), gallery].map(e => {
    const ids = (e.getAttribute('aria-labelledby') ?? '').split(' ').filter(Boolean);
    const targets = ids.map(id => document.getElementById(id));
    return {id: e.id, name: e.getAttribute('aria-label') ?? targets.map(x => x?.textContent.trim()).join(' '), references: ids, allTargetsLocal: targets.every(node => node && e.contains(node))};
  });
  const possibleParagraphs = [...alex.parentElement.querySelectorAll('p')].filter(p => !alex.contains(p));
  const bridge = possibleParagraphs.find(p => p.compareDocumentPosition(alex) & Node.DOCUMENT_POSITION_FOLLOWING);
  const metrics = bridge ? (() => {
    const s = getComputedStyle(bridge), b = bridge.getBoundingClientRect();
    return {text: bridge.textContent.trim(), semantic: bridge.tagName, fontSize: s.fontSize, lineHeight: s.lineHeight,
      fontFamily: s.fontFamily, fontWeight: s.fontWeight, color: s.color, opacity: s.opacity,
      before: alex.getBoundingClientRect().top - b.bottom, width: b.width, left: b.left, right: b.right,
      height: b.height, scrollWidth: bridge.scrollWidth, clientWidth: bridge.clientWidth};
  })() : null;
  return {
    order: [...document.querySelectorAll(selectors.join(','))].map(e => ({id: e.id, top: top(e), height: e.offsetHeight})),
    regionNames: regions, bridge: metrics, documentWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth,
    alexCount: document.querySelectorAll('#alex-story').length,
    disclosuresInitiallyOpen: [...document.querySelectorAll('.guided-evidence-details,.sample-dashboard,.bio-range-disclosure,.range-proof-details')].map(e => [e.className, e.open]),
    alexHref: alex.querySelector('.guided-start').getAttribute('href'),
    statementHref: document.querySelector('[data-statement-free]').getAttribute('href'),
    range: {
      sample: range.querySelector('[data-range-value]').dataset.rangeValue,
      lab: range.querySelector('[data-range-reference-value]').textContent,
      lower: range.querySelector('[data-range-lower-risk-value]').textContent,
      positions: ['--range-sample','--range-lab-end','--range-lower-risk-end'].map(p => range.querySelector('[data-range-graphic]').style.getPropertyValue(p)),
      headings: [...range.querySelectorAll('h2,h3,h4')].map(e => e.textContent),
    },
    collection: {video: !!document.querySelector('#recogida-en-casa video'), controls: [...document.querySelectorAll('#recogida-en-casa button')].map(e => e.getAttribute('aria-label') || e.textContent.trim())},
    kit: {id: document.querySelector('#kit-inicial').id, headings: [...document.querySelectorAll('#kit-inicial h2')].map(e => e.textContent)},
  };
}
function inspectDepth() {
  const alex = document.querySelector('#alex-story');
  return {
    depth: alex.dataset.depth,
    result: alex.querySelector('[data-value]').dataset.value,
    spokenResult: alex.querySelector('[data-value] .sr-only').textContent,
    level: alex.querySelector('.explanation-setting-trigger').getAttribute('aria-label'),
    history: [...alex.querySelectorAll('.guided-history-values .sr-only')].map(e => e.textContent),
    noteSource: alex.querySelector('.guided-context small').textContent,
    notes: [...alex.querySelectorAll('.guided-context li')].map(e => e.textContent),
    label: alex.querySelector('.guided-case-label').textContent,
    activeExplanation: alex.querySelector('.guided-prose-stack [data-active=true]').textContent,
    disclosure: alex.querySelector('.guided-disclosure').textContent,
    announced: alex.querySelector('[role=status]').textContent,
    details: alex.querySelector('details').open,
    triggerFocused: document.activeElement === alex.querySelector('.explanation-setting-trigger'),
  };
}
const expect = (record, name, condition, detail = '') => { if (!condition) record.failures.push({name, detail}); };
function checkHero(record, state) {
  const [free, quarterly] = state.actions;
  expect(record, 'hero actions original hrefs', state.actions.length === 2 &&
    free.href === `/${record.locale}/signup?plan=free&redirect=%2Fes%2Fupload` &&
    quarterly.href === `/${record.locale}/signup?plan=quarterly`, state.actions.map(e => e.href));
  expect(record, 'hero actions visible and usable', state.actions.length === 2 && state.actions.every(x => x.visible && x.hit && x.box.height === 44 && x.box.x >= 0 && x.box.right <= state.viewport + .5));
  expect(record, 'wordmark image and localized home', state.logo.mask.includes('/art/eva-official-logo.png') &&
    state.logo.box.width > 0 && state.logo.box.height > 0 && state.logo.href === '/' + record.locale && !!state.logo.label, state.logo);
  expect(record, 'hero no horizontal overflow', state.documentWidth <= state.viewport, state.documentWidth);
}
function checkSections(record, data) {
  const index = name => data.order.findIndex(e => e.id === name);
  const before = (a, b) => index(a) >= 0 && index(b) > index(a) && data.order[index(a)].top <= data.order[index(b)].top;
  for (const [a, b] of [
    ['entender-tus-analisis', 'recogida-en-casa'], ['recogida-en-casa', 'kit-inicial'], ['kit-inicial', 'otra-lectura'],
    ['otra-lectura', 'biomarcadores'], ['biomarcadores', 'una-senal'],
  ]) expect(record, 'section order ' + a + ' → ' + b, before(a,b));
  expect(record, 'one compact Alex', data.alexCount === 1);
  expect(record, 'closed disclosures', data.disclosuresInitiallyOpen.length === 4 && data.disclosuresInitiallyOpen.every(([,open]) => !open));
  expect(record, 'exact original Alex and statement CTA hrefs',
    [data.alexHref, data.statementHref].every(href => href === `/${record.locale}/signup?plan=free&redirect=%2Fes%2Fupload`), [data.alexHref, data.statementHref]);
  expect(record, 'unchanged independent range', data.range.sample === '2.9' && /^<3/.test(data.range.lab) &&
    /^<1/.test(data.range.lower) && data.range.positions.every((value, index) => Math.abs(parseFloat(value) - [58, 60, 20][index]) < 0.01), data.range);
  expect(record, 'no document overflow', data.documentWidth <= data.clientWidth);
  expect(record, 'local named regions', data.regionNames.every(x => x.name && x.allTargetsLocal), data.regionNames);
  if (phase === 'baseline') {
    expect(record, 'baseline compact Alex remained after kit and range', before('otra-lectura', 'alex-story') && !data.bridge);
  } else {
    expect(record, 'candidate compact Alex follows statement and precedes collection', before('entender-tus-analisis', 'alex-story') && before('alex-story', 'recogida-en-casa'));
    const b = data.bridge;
    expect(record, 'practical copy 16/24 or larger, contained and before Alex', b?.semantic === 'P' && parseFloat(b.fontSize) >= 16 &&
      parseFloat(b.lineHeight) === 24 && b.before >= 0 && b.opacity === '1' && b.left >= 0 && b.right <= data.clientWidth && b.scrollWidth <= b.clientWidth, b);
    expect(record, 'distinct Alex and gallery regions', data.regionNames[0].id !== data.regionNames[1].id &&
      data.regionNames[0].name !== data.regionNames[1].name);
  }
}
async function firstScroll(page, record) {
  if (record.reduced || record.width === 320) return;
  await scrollTo(page, '#entender-tus-analisis');
  record.sequence = [];
  const start = await page.evaluate(() => scrollY);
  const stride = Math.floor(record.height * .78);
  for (let step = 0; step <= 6; step++) {
    if (step) await page.mouse.wheel(0, stride);
    await page.waitForFunction(y => Math.abs(scrollY - y) < 2, start + step * stride, waitOptions);
    await settle(page);
    await page.waitForTimeout(950);
    const visible = await page.evaluate(() => {
      const bounds = ['#entender-tus-analisis', '#alex-story', '#recogida-en-casa', '#kit-inicial'].map(id => {
        const e = document.querySelector(id), b = e.getBoundingClientRect();
        return [id, Math.round(b.top), Math.round(b.bottom), b.bottom > 0 && b.top < innerHeight];
      });
      return {y: scrollY, bounds};
    });
    const suffix = 'sequence-' + String(step + 1).padStart(2,'0');
    await shot(page, record.id, suffix);
    record.sequence.push({offset: step * stride, screenshot: record.id + '-' + suffix + '.png', ...visible});
  }
  expect(record, 'sequence includes collection and first kit viewport boundary', ['#recogida-en-casa', '#kit-inicial']
    .every(id => record.sequence.some(s => s.bounds.some(x => x[0] === id && x[3]))));
}
async function exerciseAlex(page, record) {
  await scrollTo(page, '#alex-story', -24);
  await page.waitForFunction(() => document.querySelector('#alex-story').dataset.entered === 'true' &&
    Number(getComputedStyle(document.querySelector('.guided-story-result')).opacity) > .99, null, waitOptions);
  record.alexA11y = await page.locator('#alex-story').ariaSnapshot();
  await shot(page, record.id, 'alex');
  const trigger = page.locator('#alex-story .explanation-setting-trigger');
  const summary = page.locator('#alex-story details summary');
  record.depths = [];
  expect(record, 'Alex details initially collapsed', !await page.locator('#alex-story details').evaluate(e => e.open));
  for (const [index, depth] of ['simple', 'balanced', 'advanced'].entries()) {
    if (index) {
      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      await page.locator('[role=listbox]').waitFor();
      if (index === 1) await page.keyboard.press('ArrowDown');
      else await page.keyboard.press('End');
      await page.keyboard.press('Enter');
      await page.waitForFunction(next => document.querySelector('#alex-story').dataset.depth === next, depth, waitOptions);
      expect(record, 'level selection restores keyboard focus', await trigger.evaluate(e => e === document.activeElement));
    }
    await summary.focus();
    await page.keyboard.press('Enter');
    const values = await page.evaluate(inspectDepth);
    record.depths.push(values);
    const number = x => record.locale === 'es' ? x.replace('.', ',') : x;
    expect(record, 'Alex exact values and fictional/context labels ' + depth,
      values.depth === depth && values.result === '2.1' && values.spokenResult === number('2.1') + ' mg/L' &&
      values.history.join('|') === ['0.8','0.9','0.8','2.1'].map(number).join('|') &&
      /FICTIONAL|FICTICIO/.test(values.label) && /24/.test(values.notes[0]) && /illness|enfermedad/.test(values.notes[1]) &&
      /Self-reported|Declarados por Alex/.test(values.noteSource) && values.details, values);
    await page.keyboard.press('Enter');
  }
  expect(record, 'three distinct explanations and polite announcements',
    new Set(record.depths.map(x => x.activeExplanation)).size === 3 && !record.depths[0].announced &&
    record.depths.slice(1).every(x => x.announced.includes(x.activeExplanation)));
}
async function exerciseChapters(page, record) {
  const destinations = ['recogida-en-casa', 'kit-inicial', 'biomarcadores'];
  record.chapterTargets = [];
  for (const [index, expected] of destinations.entries()) {
    if (!record.reduced) {
      await page.evaluate(() => scrollTo(0,0));
      await page.locator('.chapter-nav button').nth(index + 1).click();
      await settle(page);
    }
    const result = await page.evaluate(async ({chapter, normal, target}) => {
      const story = normal ? window.evaTools.read_eva_story.execute({}) : await window.evaTools.navigate_eva_chapter.execute({chapter});
      const bounds = id => {
        const b = document.getElementById(id).getBoundingClientRect();
        return {top: b.top, bottom: b.bottom, height: b.height};
      };
      return {...story, destinationBounds: bounds(target), signalBounds: bounds('una-senal')};
    }, {chapter: index + 2, normal: !record.reduced, target: expected});
    record.chapterTargets.push(result);
    expect(record, 'chapter visually reaches ' + expected, Math.abs(result.destinationBounds.top) <= 1, result.destinationBounds);
    expect(record, 'chapter and readStoryPosition reach ' + expected, result.section === expected, result);
  }
  const read = async () => {
    await settle(page);
    return page.evaluate(() => {
      const position = window.evaTools.read_eva_story.execute({});
      const gallery = document.getElementById('biomarcadores').getBoundingClientRect();
      const signal = document.getElementById('una-senal').getBoundingClientRect();
      return {...position, galleryTop: gallery.top, galleryBottom: gallery.bottom, galleryHeight: gallery.height, signalTop: signal.top, midpoint: innerHeight / 2};
    });
  };
  await scrollTo(page, '#biomarcadores');
  const bare = await read();
  await scrollTo(page, '#una-senal', 3);
  const past = await read();
  await scrollTo(page, '#biomarcadores', 28);
  const back = await read();
  record.galleryPosition = {bare, past, back};
  expect(record, 'bare gallery read reports gallery without navigation state', bare.section === 'biomarcadores', bare);
  expect(record, 'moving past the gallery reports signal, returning reports gallery', past.section === 'una-senal' &&
    past.galleryBottom < -1 && back.section === 'biomarcadores' && back.galleryBottom > 1, record.galleryPosition);
  const galleryA11y = await page.locator('#biomarcadores').ariaSnapshot();
  record.galleryA11y = galleryA11y.split('\n').slice(0, 8).join('\n');
  await page.locator('.sample-dashboard > summary').focus();
  await page.keyboard.press('Enter');
  await scrollTo(page, '#biomarcadores');
  record.galleryPosition.expanded = await read();
  expect(record, 'expanded dashboard uses the ordinary midpoint ownership', record.galleryPosition.expanded.section === 'biomarcadores' &&
    record.galleryPosition.expanded.signalTop > record.galleryPosition.expanded.midpoint, record.galleryPosition.expanded);
  await page.locator('.sample-dashboard .bio-views button').first().click();
  record.galleryHistory = await page.locator('.sample-dashboard .bio-chart svg').getAttribute('aria-label');
  expect(record, 'dashboard remains a later separate 2.8/2.5/2.7/2.1 fixture',
    /2[.,]8.*2[.,]5.*2[.,]7.*2[.,]1/.test(record.galleryHistory), record.galleryHistory);
  await page.locator('.sample-dashboard > summary').focus();
  await page.keyboard.press('Enter');
  await scrollTo(page, '#una-senal');
  await settle(page);
  record.signalPosition = await page.evaluate(() => window.evaTools.read_eva_story.execute({}));
  expect(record, 'ordinary scroll reaches subsequent signal chapter', record.signalPosition.section === 'una-senal', record.signalPosition);
}
async function profile(browser, record) {
  const {context, page} = await open(browser, record);
  try {
    record.before = await page.evaluate(inspectHero);
    if (record.reduced) await page.locator('.calm-hero').waitFor();
    else {
      expect(record, 'original runner hides actions before reveal',
        ['pending','watching'].includes(record.before.entry) && record.before.actions.length === 2 &&
        record.before.actions.every(e => !e.visible && !e.hit), record.before.entry);
      await shot(page, record.id, 'hero-before');
      await page.waitForFunction(() => document.querySelector('.hero-entrance').dataset.heroEntrance === 'reveal', null, waitOptions);
    }
    await settle(page);
    await page.waitForFunction(() => [...document.querySelectorAll('[data-hero-reveal]')].every(element => {
      const hasRunningAnimation = element.getAnimations().some(animation => animation.playState === 'running');
      return !hasRunningAnimation && Number(getComputedStyle(element).opacity) > .99;
    }), null, waitOptions);
    record.after = await page.evaluate(inspectHero);
    record.heroObservations = await page.evaluate(() => window.heroObservations);
    checkHero(record, record.after);
    if (record.reduced) {
      expect(record, 'reduced static hero', record.after.entry === 'skip' && record.after.still?.loaded && record.after.video.length === 0);
    } else {
      expect(record, 'ordinary callback completes entrance and runner media', record.after.entry === 'reveal' && record.after.runner === 'complete' &&
        record.after.video.some(x => x.readyState >= 2) && record.after.video.every(x => x.rate === 1));
    }
    await shot(page, record.id, 'hero-after');
    await page.locator('.hero-start').screenshot({path: path.join(output, record.id + '-cta.png')});
    record.sections = await page.evaluate(inspectSections);
    checkSections(record, record.sections);
    await firstScroll(page, record);
    if (phase === 'candidate') {
      const id = record.sections.regionNames[0].id;
      if (id) {
        await scrollTo(page, '#' + id, -64);
        await page.waitForTimeout(1000);
        await shot(page, record.id, 'join');
      }
    } else {
      await scrollTo(page, '#recogida-en-casa', -185);
      await page.waitForTimeout(1000);
      await shot(page, record.id, 'join');
    }
    await exerciseAlex(page, record);
    await exerciseChapters(page, record);
  } finally {
    await context.close();
  }
}
async function fallback(browser, record) {
  const {kind} = record;
  const {context, page} = await open(browser, record, {
    javaScriptEnabled: kind !== 'no-js', mediaFailure: kind === 'media', fragment: kind === 'hash' ? '#biomarcadores' : '',
  });
  try {
    const earlyInput = ['Tab', 'Escape', 'focus'].includes(kind);
    if (earlyInput) await page.waitForFunction(() => document.querySelector('.hero-entrance').dataset.heroEntrance === 'watching', null, waitOptions);
    record.before = await page.evaluate(inspectHero);
    if (earlyInput) {
      expect(record, 'pre-input original early state after hydration', record.before.entry === 'watching');
      if (kind === 'focus') await page.locator('.masthead .wordmark').focus();
      else await page.keyboard.press(kind);
    }
    if (kind !== 'no-js') {
      await page.waitForFunction(() => document.querySelector('.hero-entrance').dataset.heroEntrance === 'skip', null, waitOptions);
    }
    if (kind === 'no-js') await page.evaluate(() => document.fonts.ready);
    else await settle(page);
    record.after = await page.evaluate(inspectHero);
    if (kind !== 'hash') checkHero(record, record.after);
    if (kind === 'Tab') expect(record, 'Tab focuses and exposes original skip link', record.after.active.href === '#entender-tus-analisis');
    if (kind === 'focus') expect(record, 'wordmark focus skips to visible navigation', record.after.active.className === 'wordmark');
    if (kind === 'Escape') expect(record, 'Escape skips without scrolling', record.after.scrollY === 0);
    if (kind === 'media') expect(record, 'media fallback was exercised', record.abortedMedia.length > 0 && record.after.still?.loaded, record.abortedMedia);
    if (kind === 'hash') {
      record.destination = await page.evaluate(() => window.evaTools.read_eva_story.execute({}));
      expect(record, 'direct deep-link retains gallery chapter', record.destination.section === 'biomarcadores');
    }
    if (kind === 'no-js') {
      record.sections = await page.evaluate(inspectSections);
      checkSections(record, record.sections);
      expect(record, 'no-JS fallback uses visible loaded runner poster', record.after.still?.loaded && record.after.still.opacity > .98);
      await scrollTo(page, '#alex-story', -24);
      expect(record, 'no-JS Alex readable', await page.locator('.guided-story-result').evaluate(e => getComputedStyle(e).opacity === '1'));
      await page.locator('#alex-story details summary').click();
      expect(record, 'no-JS native evidence disclosure', await page.locator('#alex-story details').evaluate(e => e.open));
      await shot(page, record.id, 'alex');
      await page.evaluate(() => scrollTo(0,0));
    }
    await shot(page, record.id, 'hero');
  } finally {
    await context.close();
  }
}
module.exports = {chromium, open, settle, scrollTo, expect, inspectHero, report, origin, phase, output};
if (require.main === module) (async () => {
  const browser = await chromium.launch({headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox','--disable-dev-shm-usage']});
  report.browser = browser.version();
  const run = async (record, task) => {
    try { await task(browser, record); }
    catch (error) { record.failures.push({name: 'runner interrupted', detail: error.stack}); }
    console.log(record.id, record.failures.length ? JSON.stringify(record.failures.map(x => x.name)) : 'PASS');
    save();
  };
  try {
    // Capture the two neutral reader profiles first, then finish the full matrix.
    const prioritized = [['en', 1366], ['es', 390], ['es', 1366], ['en', 390], ['en', 320], ['es', 320]];
    for (const [locale, width] of prioritized) {
      for (const reduced of [false, true]) {
        const record = {locale, width, height: width === 1366 ? 900 : 844, reduced, id: `${locale}-${width}-${reduced ? 'reduced' : 'normal'}`, failures: []};
        report.profiles.push(record);
        await run(record, profile);
      }
    }
    for (const locale of ['en', 'es']) {
      for (const kind of ['Tab', 'Escape', 'focus', 'media', 'no-js', 'hash']) {
        const width = locale === 'en' ? 1366 : 320;
        const record = {locale, width, height: width === 1366 ? 900 : 844, reduced: false, kind, id: `${locale}-${width}-${kind}`, failures: [], abortedMedia: []};
        report.fallbacks.push(record);
        await run(record, fallback);
      }
    }
  } finally {
    await browser.close();
    report.allOwnedBrowsersClosed = true;
    report.reportFinished = new Date().toISOString();
    save();
  }
})();
