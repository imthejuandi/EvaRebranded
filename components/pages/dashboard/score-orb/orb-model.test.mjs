// node components/pages/dashboard/score-orb/orb-model.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
const require = createRequire(import.meta.url), ts = require('typescript');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..'), cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const module = {exports: {}}; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {fileName: file, compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX}}).outputText;
  const localRequire = name => {
    if (name.endsWith('.css')) return {};
    if (!name.startsWith('.') && !name.startsWith('@/')) return require(name);
    const base = name.startsWith('@/') ? path.join(root, name.slice(2)) : path.resolve(path.dirname(file), name);
    const resolved = [base, `${base}.ts`, `${base}.tsx`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    assert.ok(resolved, `Cannot resolve ${name}`); return load(path.relative(root, resolved));
  };
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports); return module.exports;
}
const dir = 'components/pages/dashboard/score-orb/';
const {chronologicalAgeAt, referenceCalendarDate, compareAges, reportOrbMarkers, backendReportOrbMarkers} = load(dir + 'orb-model.ts');
const {reportRingGeometry, DOT_LIMITS} = load(dir + 'ring-geometry.ts');
const {scoreDialGeometry, signatureTicks} = load(dir + 'score-dial.ts');
const {HealthSignature} = load('components/pages/dashboard/HealthSignature.tsx');
const {SelectedDial} = load(dir + 'SelectedDial.tsx');
const React = require('react'), {renderToStaticMarkup} = require('react-dom/server');
const report = {id: 'report-a', date: '2026-06-18', status: 'ready', markerKeys: ['marker-a'], contextComplete: true, biologicalAge: 46.5, longevityScore: 63.5};
const profile = {healthConsent: true, dateOfBirth: '1976-06-19'};
const row = {key: 'marker-a', label: 'Source marker', reportId: 'report-a', value: 7.2, unit: 'unit', zone: 'above_optimal', optimalLow: 2, optimalHigh: 7, collectionDate: report.date, reportedValue: null, reportedUnit: null};
const marker = {key: row.key, name: row.label, category: 'Source category', value: 900, unit: 'other unit', zone: 'optimal', rangeComparable: true, range: [1, 2]};
const render = (props = {}) => renderToStaticMarkup(React.createElement(HealthSignature, {report, profile, paid: true, markers: [marker], reportResults: [row], ...props}));

test('completed age requires a valid full birthday and a valid explicit reference date', () => {
  assert.equal(chronologicalAgeAt('1976-06-19', '2026-06-18'), 49);
  assert.equal(chronologicalAgeAt('1976-06-19', '2026-06-19'), 50);
  assert.equal(chronologicalAgeAt('2000-02-29', '2025-02-28'), 24);
  for (const birth of ['1976', '2001-02-29', '1976-13-01', '2027-01-01', null, undefined]) assert.equal(chronologicalAgeAt(birth, report.date), null);
  for (const date of ['2026-02-30', 'invalid', null]) assert.equal(referenceCalendarDate(date), null);
  assert.equal(referenceCalendarDate('2026-06-18T09:40:00Z'), '2026-06-18');
  assert.equal(compareAges(46.46, 49).difference, -2.5);
});

test('report result ownership, missing values, qualifiers and source statuses survive adaptation', () => {
  const adapted = backendReportOrbMarkers([row, {...row, reportId: 'foreign', key: 'foreign'}, row, {...row, key: 'missing', value: null, reportedValue: '<0.5', reportedUnit: 'unit'}], report.id, true);
  assert.equal(adapted.length, 2); assert.equal(adapted[0].value, 7.2); assert.equal(adapted[0].zone, 'above_optimal');
  assert.equal(adapted[1].value, null); assert.equal(adapted[1].zone, 'unclassified'); assert.equal(adapted[1].reportedValue, '<0.5');
  assert.deepEqual(backendReportOrbMarkers([row], report.id, false), []);
  assert.equal(backendReportOrbMarkers([{...row, unit: null}], report.id, true)[0].zone, 'unclassified');
  assert.deepEqual(reportOrbMarkers([marker], [], true), []);
  assert.equal(reportOrbMarkers([{...marker, value: NaN}], report.markerKeys, true)[0].zone, 'unclassified');
});

test('B ring shape uses supplied categories, not numeric magnitude, and stays within its drawing budget', () => {
  const source = backendReportOrbMarkers([row], report.id, true);
  assert.deepEqual(reportRingGeometry(source), reportRingGeometry(source.map(marker => ({...marker, value: 999999, unit: 'unrelated'}))));
  const rows = Array.from({length: 120}, (_, index) => ({...source[0], key: String(index)}));
  for (const mobile of [false, true]) {
    const {points, anchors} = reportRingGeometry(rows, mobile);
    assert.equal(anchors.length, 120); assert.ok(points.length <= (mobile ? DOT_LIMITS.mobile : DOT_LIMITS.desktop));
    assert.ok(points.every(point => Math.hypot(point.x - .5, point.y - .5) >= .30 && Math.hypot(point.x - .5, point.y - .5) <= .47));
  }
});

test('score path encodes exact valid values, including full scale, independently of non-scaling strokes', () => {
  for (const score of [null, NaN, Infinity, 0, .5, 101]) assert.equal(scoreDialGeometry(score), null);
  assert.equal(signatureTicks.length, 100);
  assert.equal(scoreDialGeometry(25).path, 'M 250 45 A 205 205 0 0 1 455 250');
  assert.equal((scoreDialGeometry(100).path.match(/A 205/g) || []).length, 2);
  const geometry = scoreDialGeometry(63.5);
  assert.ok(Math.abs(Math.hypot(geometry.x - 250, geometry.y - 250) - 205) < .0001);
});

test('rendered orb uses actual independent estimates, complete readouts and same-report rows', () => {
  const html = render({ageReferenceDate: report.date});
  assert.match(html, /data-signature-design="anillo"/); assert.match(html, /id="dashboard-signature"/);
  assert.match(html, /data-dot-number="46,5"/); assert.match(html, /data-dot-number="63,5"/);
  assert.ok(!html.includes('Edad cronológica:')); assert.ok(!html.includes('−2,5 años'));
  assert.match(html, /role="switch" aria-checked="false"/);
  assert.match(html, /Source marker: 7,2 unit/); assert.ok(!html.includes('900 other unit'));
  assert.match(html, /Biomarcadores del informe/); assert.match(html, /data-report-marker-count="1"/);
  assert.match(html, /class="dial-score-arc" d="M 250 45 A 205 205/);
  assert.equal((html.match(/<g class="dial-ticks">(.*?)<\/g>/)?.[1].match(/<line/g) || []).length, 100);
  assert.match(render({reportResults: []}), /data-report-marker-count="0"/);
});

test('age comparison shows only the difference, and concealment removes it from markup and accessible labels', () => {
  for (const locale of ['es', 'en']) {
    const dial = (age, showComparison) => renderToStaticMarkup(React.createElement(SelectedDial, {
      age, score: 63.5, chronologicalAge: 49, showComparison, locale, unavailable: 'Unavailable', detail: null, detailId: 'detail', onExplain() {},
    }));
    for (const [age, expected] of [[46.5, locale === 'es' ? '−2,5 años' : '−2.5 years'], [51.5, locale === 'es' ? '+2,5 años' : '+2.5 years'], [49, locale === 'es' ? '0 años' : '0 years']]) {
      const visible = dial(age, true), concealed = dial(age, false);
      assert.ok(visible.includes(expected));
      assert.ok(!visible.includes(locale === 'es' ? 'Tu edad 49' : 'Your age 49'));
      assert.ok(!visible.includes(locale === 'es' ? 'Edad cronológica:' : 'Chronological age:'));
      assert.ok(!concealed.includes(expected));
      assert.ok(!concealed.includes('dial-age-comparison'));
      assert.ok(!concealed.includes(locale === 'es' ? 'años menos' : 'years lower'));
      assert.ok(!concealed.includes(locale === 'es' ? 'años más' : 'years higher'));
      assert.ok(!concealed.includes(locale === 'es' ? 'Igual a tu edad' : 'Same as your age'));
      assert.match(concealed, /data-dot-number=/);
      assert.match(concealed, /data-score="63.5"/);
    }
  }
});

test('comparison never derives a reference date from the report date or profile calculation timestamp', () => {
  for (const props of [{}, {profile: {...profile, current_ba: 44, current_ba_computed_at: '2026-09-21T00:00:00Z'}}, {profile: {healthConsent: true, birthYear: '1976'}, ageReferenceDate: report.date}]) {
    const html = render(props); assert.match(html, /Comparación no disponible/); assert.ok(!html.includes('Edad cronológica:'));
  }
});

test('consent, readiness and subscription gates do not leak age, score or comparison', () => {
  for (const props of [{paid: false}, {profile: {...profile, healthConsent: false}}, {report: {...report, status: 'processing'}}]) {
    const html = render({...props, ageReferenceDate: report.date});
    assert.ok(!html.includes('data-dot-number=')); assert.ok(!html.includes('class="dial-score-arc"')); assert.ok(!html.includes('Edad cronológica:'));
    assert.ok(!html.includes('data-age-source='));
  }
  assert.match(render({profile: {...profile, healthConsent: false}}), /data-report-marker-count="0"/);
});

test('missing age and score remain independent and English controls preserve provenance', () => {
  assert.match(render({report: {...report, biologicalAge: null}}), /data-dot-number="63,5"/);
  const noScore = render({report: {...report, longevityScore: 0}}); assert.match(noScore, /data-dot-number="46,5"/); assert.ok(!noScore.includes('class="dial-score-arc"'));
  const html = render({source: 'backend', locale: 'en', profile: {...profile, current_ba: 45.1, current_ba_computed_at: '2026-09-18T08:30:00Z'}, reportHref: '/source-report'});
  assert.match(html, /data-dot-number="45.1"/); assert.match(html, /Current profile estimate/); assert.match(html, /Calculated on/);
  assert.match(html, /Report biomarkers/); assert.match(html, /Comparison unavailable/); assert.match(html, /href="\/source-report"/); assert.ok(!html.includes('Ejemplo'));
});
