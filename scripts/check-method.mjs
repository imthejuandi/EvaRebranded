// Run from the project root. Source/SSR contracts only; browser review covers layout and real playback.
import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';

const root = process.cwd();
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const postcss = require('postcss');
const modules = new Map();
const sources = new Map();
function load(relative) {
  const base = path.resolve(root, relative);
  const file = ['', '.tsx', '.ts'].map(extension => base + extension).find(existsSync);
  assert(file, `Missing source: ${relative}`);
  if (modules.has(file)) return modules.get(file).exports;
  if (file.endsWith('.json')) return JSON.parse(readFileSync(file, 'utf8'));
  const source = readFileSync(file, 'utf8');
  sources.set(file, source);
  const module = {exports: {}};
  modules.set(file, module);
  const output = ts.transpileModule(source, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  }}).outputText;
  const localRequire = name => name === 'next/navigation' ? {usePathname: () => '/es'} : name.startsWith('@/') ? load(name.slice(2))
    : name.startsWith('.') ? load(path.resolve(path.dirname(file), name)) : require(name);
  new Function('require', 'module', 'exports', output)(localRequire, module, module.exports);
  return module.exports;
}
const {MethodGraphs} = load('components/story/MethodGraphs');
const {MethodJourney} = load('components/story/MethodJourney');
const {SiteLanguageProvider} = load('components/site/SiteLanguage');
const {methodSteps} = load('lib/landing-content');
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));
const states = [
  [{active: true, visible: true}, true, true],
  [{active: true, visible: false}, true, false],
  [{active: false, visible: true}, false, false],
  [{active: true, visible: true, playing: false}, true, false],
  [{active: true, visible: true, calm: true}, false, false],
];
const artwork = new Set();
for (const kind of ['results', 'context', 'evolution']) {
  let baseline;
  for (const [state, animate, running] of states) {
    const html = render(MethodGraphs, {kind, ...state});
    assert(html.includes(`data-animate="${animate}"`) && html.includes(`data-running="${running}"`), `${kind}: active/visibility/pause/calm contract`);
    assert(/<svg\b[^>]*role="img"/.test(html) && /<title\b/.test(html) && /<desc\b/.test(html), `${kind}: accessible description`);
    assert(!/<(?:img|image|video|canvas|filter)\b/i.test(html), `${kind}: keep original lightweight vector artwork`);
    assert(!/NaN|Infinity|undefined/.test(html), `${kind}: invalid geometry`);
    const svg = html.slice(html.indexOf('<svg'), html.lastIndexOf('</svg>') + 6);
    if (baseline === undefined) baseline = svg;
    else assert.equal(svg, baseline, `${kind}: pausing/calm must retain the complete artwork`);
  }
  artwork.add(baseline);
}
assert.equal(artwork.size, 3, 'Each graph chapter needs distinct artwork');
const results = render(MethodGraphs, {kind:'results', active:false, visible:false});
assert.equal((results.match(/class="mg-draw mg-filament"/g) || []).length, 13, 'Results artwork must contain thirteen actual signal filaments');
for (const label of ['Trece biomarcadores, una lectura', 'Trece filamentos luminosos', 'Trece biomarcadores.']) assert(results.includes(label), `Results artwork describes its thirteen signals: ${label}`);
assert(!/Quince/.test(results), 'Results artwork must not retain the old fifteen-marker wording');
const home = render(MethodJourney, {}), calm = render(MethodJourney, {calm: true});
const english = renderToStaticMarkup(React.createElement(SiteLanguageProvider, {locale:'en'}, React.createElement(MethodJourney)));
assert.equal((home.match(/role="tab"/g) || []).length, 4);
assert.equal((home.match(/role="tabpanel"/g) || []).length, 4);
assert.equal((home.match(/data-method-artwork=/g) || []).length, 1, 'Only the selected artwork mounts');
assert(!calm.includes('class="method-replay"') && calm.includes('is-calm'), 'Calm home is resolved without an inert replay');
assert(home.includes('loading="lazy"') && home.includes('srcSet='), 'The new photograph is deferred and responsive');
assert(!home.includes('<video') && !home.includes('method-video-control'), 'The approved home artwork is a still without video or playback controls');
assert(!calm.includes('<video') && !calm.includes('method-video-control'), 'Calm mode retains the same responsive still');
for(const name of ['method-home-c-640.webp','method-home-c-1200.webp'])assert(home.includes(name)&&calm.includes(name),'Both motion preferences use the selected responsive candid home photograph');
const context = render(MethodGraphs, {kind:'context', active:false, visible:false});
for (const label of ['Tu resultado', 'Informe de laboratorio', 'Historial y contexto', 'El mismo valor.', 'Más contexto.']) assert(context.includes(label), `Contexto communicates its sources: ${label}`);
assert(/franjas simbólicas/.test(context) && /No son intervalos clínicos/.test(context), 'Context bands identify symbolic sources, not clinical thresholds');
assert(!context.includes('Rangos de EVA'), 'Context artwork must not imply an unqualified EVA clinical range');
const evolution = render(MethodGraphs, {kind:'evolution', active:false, visible:false});
assert(evolution.includes('LECTURAS EN EL TIEMPO') && /sin fijar cuándo repetir/.test(evolution), 'History artwork does not prescribe a repeat-test cadence');
assert(!/trimestral/i.test(evolution) && !evolution.includes('M523 303'), 'History artwork has no quarterly label or extrapolated future tail');
assert.equal(methodSteps.length, 4);
const semanticChecks = [
  [/analíticas anteriores[\s\S]*gratis/i, /kit[\s\S]*casa[\s\S]*Tasso\+/i],
  [/biomarcador/i, /valor y unidad/i, /intervalo del laboratorio/i, /fecha/i, /informe de origen/i],
  [/compatibles/i, /muestra/i, /cambio[\s\S]*causa/i],
  [/90 días[\s\S]*puede/i, /paneles disponibles/i, /según tu situación/i],
];
assert(/13\s+biomarcadores/.test(methodSteps[0].copy), 'The first kit has exactly thirteen biomarkers');
assert(methodSteps[0].copy.indexOf('analíticas anteriores') < methodSteps[0].copy.indexOf('kit'), 'Existing-report interpretation is the primary starting point');
assert(!/cada trimestre|cada 90 días/i.test(methodSteps.map(step => step.copy).join(' ')), 'Review timing is an opportunity, not automatic repeat testing');
methodSteps.forEach((step, i) => {
  for (const meaning of semanticChecks[i]) assert(meaning.test(`${step.title} ${step.copy}`), `Step ${i + 1}: required service meaning ${meaning}`);
  assert(home.includes(step.title) && home.includes(step.copy), 'All method information remains in static HTML');
});
const entries = home.match(/<div class="method-entry-actions">([\s\S]*?)<\/div>/)?.[1];
assert(entries, 'Starting step exposes both entry options');
const entryLinks = [...entries.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(([, href]) => new URL(href.replaceAll('&amp;', '&'), 'https://eva.example'));
assert.equal(entryLinks.length, 2, 'Starting step has one free-report and one kit entry');
assert.equal(entryLinks[0].pathname, '/es/signup');
assert.equal(entryLinks[0].searchParams.get('plan'), 'free', 'Primary entry preserves the free plan');
assert.equal(entryLinks[0].searchParams.get('redirect'), '/es/upload', 'Primary entry returns to upload after signup');
assert.equal(entryLinks[1].pathname, '/es/signup', 'Kit entry opens the existing signup flow');
assert.equal(entryLinks[1].searchParams.get('plan'), 'quarterly', 'Kit entry preserves the existing offer intent');
assert(/99 € \+ IVA/.test(entries), 'Kit entry keeps the approved tax qualification visible');
for (const label of ['Choose your starting point.', 'Understand each result.', 'Compare with context.', 'Choose your next focus.', '€99 + VAT']) assert(english.includes(label), `English method retains localized service meaning: ${label}`);
assert(!english.includes('Elige por dónde empezar.') && !english.includes('A tu ritmo.'), 'English method does not fall back to Spanish');
const englishEntries = english.match(/<div class="method-entry-actions">([\s\S]*?)<\/div>/)?.[1];
assert(englishEntries, 'English method exposes the same entry options');
const englishLinks = [...englishEntries.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(([, href]) => new URL(href.replaceAll('&amp;', '&'), 'https://eva.example'));
assert.equal(englishLinks[0].pathname, '/en/signup');
assert.equal(englishLinks[0].searchParams.get('plan'), 'free');
assert.equal(englishLinks[0].searchParams.get('redirect'), '/es/upload', 'English entry preserves the existing account-flow upload return intent');
assert.equal(englishLinks[1].pathname, '/en/signup');
assert.equal(englishLinks[1].searchParams.get('plan'), 'quarterly');

const css = ['app/method-journey.css', 'app/method-graphs.css'].map(file => readFileSync(path.join(root, file), 'utf8')).join('\n');
const ast = postcss.parse(css);
const pauseRules = [], reducedRules = [];
ast.walkDecls(declaration => {
  if (declaration.prop.startsWith('animation')) assert(!/\binfinite\b/.test(declaration.value), 'Method animation must finish');
  if (/^(?:backdrop-)?filter$/.test(declaration.prop)) assert.equal(declaration.value, 'none', 'Keep optical softness precomputed or gradient-based');
  if (declaration.prop === 'animation-play-state' && declaration.value === 'paused') pauseRules.push(declaration.parent.selector);
});
ast.walkAtRules('media', media => {
  if (/prefers-reduced-motion\s*:\s*reduce/.test(media.params)) media.walkDecls('animation', declaration => {
    if (/^none\b/.test(declaration.value)) reducedRules.push(declaration.parent.selector);
  });
});
for (const className of ['mg-draw', 'mg-arrive', 'mg-band', 'mg-atmosphere']) {
  assert(pauseRules.some(selector => selector.includes('[data-running="false"]') && selector.includes(`.${className}`)), `${className}: offscreen pause`);
  assert(reducedRules.some(selector => selector.includes(`.${className}`)), `${className}: OS reduced motion`);
}
assert(reducedRules.some(selector => selector.includes('.method-home-art img')), 'Home movement respects OS reduced motion');
const localSources = [...sources.entries()].filter(([file]) => file.includes('/components/'));
for (const [file, source] of localSources) {
  assert(!/requestAnimationFrame|setInterval|setTimeout/.test(source), `${file}: no independent animation clock`);
  assert(!/from\s+['"][^'"]*(?:glow-motion|solar-motion|halftone|body-signal)/.test(source), `${file}: no previous artwork/motion module reuse`);
}
const media = [...new Set([...localSources.map(([, source]) => source).join('\n').matchAll(/\/art\/[^'"\s,<>]+/g)].map(match => match[0]))];
assert(media.length > 0, 'The home chapter has a new photograph');
for (const asset of media) assert(asset.startsWith('/art/method-'), `Method assets must be independently owned: ${asset}`);
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const currentFiles = new Set(media.map(asset => path.join(root, 'public', asset)));
const currentHashes = new Set([...currentFiles].map(hash));
function checkOlderAssets(directory) {
  for (const entry of readdirSync(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) checkOlderAssets(file);
    else if (/\.(?:jpe?g|png|webp|avif|gif|mp4|webm)$/i.test(entry.name) && !currentFiles.has(file))
      assert(!currentHashes.has(hash(file)), `Method photograph duplicates existing media: ${file}`);
  }
}
checkOlderAssets(path.join(root, 'public/art'));
console.log('Method contracts passed: distinct new artwork, 15 playback-state renders, four service steps, selected-only mount, responsive home image, finite motion and pause/reduced-motion rules. Browser review still covers actual motion, keyboard behavior and compact layout.');
