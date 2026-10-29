import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const catalog = JSON.parse(await fs.readFile('lib/site-content/locales/public.en.json', 'utf8'));
const input = (await fs.readFile('lib/site-language.ts', 'utf8')).replace("import english from './site-content/locales/public.en.json';", `const english = ${JSON.stringify(catalog)};`);
const compiled = ts.transpileModule(input, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}}).outputText;
const {publicHref, alternatePublicHref, translatePublicText} = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

assert.equal(publicHref('/es/pricing?plan=quarterly&report=demo-junio#comparar-planes', 'en'), '/en/pricing?plan=quarterly&report=demo-junio#comparar-planes');
assert.equal(alternatePublicHref('/en/contact?panel=thyroid&category=general#message', 'en'), '/es/contact?panel=thyroid&category=general#message');
assert.equal(publicHref('/es/signup?plan=quarterly&redirect=%2Fes%2Fdashboard', 'en'), '/en/signup?plan=quarterly&redirect=%2Fes%2Fdashboard');
assert.equal(publicHref('/es/legal/privacy', 'en'), '/en/legal/privacy');
assert.equal(publicHref('https://example.org/es/science', 'en'), 'https://example.org/es/science');
assert.equal(alternatePublicHref('/__vinext_nonexistent_for_404__', 'es'), '/en');
assert.equal(alternatePublicHref('/es/legal/privacy', 'es'), '/en/legal/privacy');
assert.equal(translatePublicText('Paso 2, Resultados: Recibe tus resultados.', 'en'), 'Step 2, Results: Receive your results.');
assert.equal(translatePublicText('  Volver a intentar  ', 'en'), '  Try again  ');
assert.equal(translatePublicText('0,7–1,2 mg/dL', 'en'), '0.7–1.2 mg/dL');
assert.equal(translatePublicText('HbA1c', 'en'), 'HbA1c');
assert.equal(translatePublicText('Conoce tu salud.', 'es'), 'Conoce tu salud.');
assert(Object.keys(catalog).length > 900);
assert(Object.values(catalog).every(value => typeof value === 'string' && value.trim()));

const decode = value => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x([0-9a-f]+);/gi, (_, number) => String.fromCodePoint(parseInt(number, 16))).replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
const slugs = ['', 'how-it-works', 'science', 'pricing', 'about', 'blog', 'contact'];
const records = [];
for (const slug of slugs) {
  const relative = slug ? `en/${slug}.html` : 'en.html';
  const html = await fs.readFile(path.join('dist/client', relative), 'utf8');
  assert.match(html, /<html[^>]+lang="en"/, `${relative}: English document language`);
  const rendered = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const text = [...rendered.matchAll(/>([^<>]+)</g)].map(match => decode(match[1]).replace(/\s+/g, ' ').trim());
  const attributes = [...rendered.matchAll(/(?:alt|aria-label|title|placeholder)="([^"]*)"/g)].map(match => decode(match[1]));
  const untranslated = [...text, ...attributes].filter(message => catalog[message] && catalog[message] !== message);
  assert.deepEqual(untranslated, [], `${relative}: untranslated authored content`);
  assert(!text.some(message => /\b(?:biomarcadores|quieres empezar|datos ficticios|recogida de muestra)\b/i.test(message)), `${relative}: remaining Spanish copy`);
  assert(rendered.includes(`href="/es${slug ? '/' + slug : ''}"`), `${relative}: matching Spanish switch`);
  assert(rendered.includes('currently in Spanish'), `${relative}: explicit Spanish-only boundaries`);
  if (['how-it-works', 'science', 'pricing', 'about'].includes(slug)) assert(rendered.includes(`aria-current="page"`), `${relative}: current navigation`);
  const spanish = await fs.readFile(path.join('dist/client', slug ? `es/${slug}.html` : 'index.html'), 'utf8');
  assert.match(spanish, /<html[^>]+lang="es"/);
  assert(spanish.includes(`href="/en${slug ? '/' + slug : ''}"`), `${relative}: reciprocal English switch`);
  records.push(relative);
}
console.log(JSON.stringify({passed: true, catalogMessages: Object.keys(catalog).length, englishRoutes: records, checks: ['localized HTML and metadata', 'rendered copy and accessibility labels', 'reciprocal language links', 'query and fragment preservation', 'Spanish-only private-app boundary and localised documents', 'clinical symbols and decimal notation']}, null, 2));
