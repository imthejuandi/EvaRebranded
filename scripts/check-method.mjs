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
  const source = readFileSync(file, 'utf8');
  sources.set(file, source);
  const module = {exports: {}};
  modules.set(file, module);
  const output = ts.transpileModule(source, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  }}).outputText;
  const localRequire = name => name.startsWith('@/') ? load(name.slice(2))
    : name.startsWith('.') ? load(path.resolve(path.dirname(file), name)) : require(name);
  new Function('require', 'module', 'exports', output)(localRequire, module, module.exports);
  return module.exports;
}
const {MethodGraphs} = load('components/story/MethodGraphs');
const {MethodJourney} = load('components/story/MethodJourney');
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
const home = render(MethodJourney, {}), calm = render(MethodJourney, {calm: true});
assert.equal((home.match(/role="tab"/g) || []).length, 4);
assert.equal((home.match(/role="tabpanel"/g) || []).length, 4);
assert.equal((home.match(/data-method-artwork=/g) || []).length, 1, 'Only the selected artwork mounts');
assert(!calm.includes('class="method-replay"') && calm.includes('is-calm'), 'Calm home is resolved without an inert replay');
assert(home.includes('loading="lazy"') && home.includes('srcSet='), 'The new photograph is deferred and responsive');
assert(!home.includes('<video') && !home.includes('method-video-control'), 'The approved home artwork is a still without video or playback controls');
assert(!calm.includes('<video') && !calm.includes('method-video-control'), 'Calm mode retains the same responsive still');
for(const name of ['method-home-c-640.webp','method-home-c-1200.webp'])assert(home.includes(name)&&calm.includes(name),'Both motion preferences use the selected responsive candid home photograph');
const context = render(MethodGraphs, {kind:'context', active:false, visible:false});
for (const label of ['Tu resultado', 'Intervalo de referencia', 'Rangos de EVA', 'El mismo valor.', 'Más contexto.']) assert(context.includes(label), `Contexto communicates its comparison: ${label}`);
assert.equal(methodSteps.length, 4);
const semanticChecks = [/casa[\s\S]*laboratorio/i, /15\s+biomarcador/i, /rangos|context|interpre/i, /90\s+d[ií]as/i];
methodSteps.forEach((step, i) => {
  assert(semanticChecks[i].test(`${step.title} ${step.copy}`), `Step ${i + 1}: required service meaning`);
  assert(home.includes(step.title) && home.includes(step.copy), 'All method information remains in static HTML');
});

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
