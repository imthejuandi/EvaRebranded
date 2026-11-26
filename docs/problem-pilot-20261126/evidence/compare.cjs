const fs = require('node:fs');
const path = require('node:path');
const baseline = require('./baseline/render-report.json');
const candidate = require('./candidate/render-report.json');
const allowedFiles = new Set([
  'components/story/BiomarkerGallery.tsx', 'components/story/ScrollStory.tsx',
  'components/story/ResultsProblem.tsx', 'components/story/guided-result-story.css',
  'lib/site-content/results-problem-copy.ts',
]);
const report = {before: {source: baseline.source, artifact: baseline.artifactSha256}, after: {source: candidate.source, artifact: candidate.artifactSha256}, checks: [], readerSequences: []};
const eq = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const check = (name, condition, evidence) => report.checks.push({name, verdict: condition ? 'PASS' : 'FAIL', evidence});
const media = p => Object.entries(p.mediaRanges).map(([url, count]) => [url, count]);
for (const p of [baseline, candidate]) {
  check(p.phase + ' browser matrix complete and clean', p.profiles.length === 12 && p.fallbacks.length === 12 &&
    p.profiles.concat(p.fallbacks).every(x => x.failures.length === 0) && p.allOwnedBrowsersClosed &&
    !p.missingFiles.length && !p.blockedRequests.length && !p.pageErrors.length && media(p).length > 0,
    {profiles: p.profiles.length, fallbacks: p.fallbacks.length, failures: p.profiles.concat(p.fallbacks).filter(x => x.failures.length).map(x => [x.id, x.failures]), missingFiles: p.missingFiles, blockedRequests: p.blockedRequests, pageErrors: p.pageErrors, fulfilledByteRanges: media(p)});
}
const sourceManifests = ['baseline','candidate'].map(phase => new Map(require('./' + phase + '/source-manifest.json')));
const sourceNames = new Set(sourceManifests.flatMap(manifest => [...manifest.keys()]));
const changedSource = [...sourceNames].filter(name => sourceManifests[0].get(name) !== sourceManifests[1].get(name));
check('independent source manifest protects all other product files', changedSource.length === allowedFiles.size &&
  changedSource.every(name => allowedFiles.has(name)), changedSource);
// At an intentional deep link, compare the offscreen hero in document coordinates.
const comparableBoxes = (a,b,scrollA,scrollB) => Object.keys(a).every(key => {
  const coordinate = ['y', 'bottom'].includes(key);
  return Math.abs(a[key] + (coordinate ? scrollA : 0) - b[key] - (coordinate ? scrollB : 0)) <= .5;
});
const sameHero = (a, b) => a.entry === b.entry && a.runner === b.runner && a.actions.length === b.actions.length &&
  a.actions.every(({box,chain,...rest}, index) => {
    const target = b.actions[index];
    const {box: otherBox, chain: otherChain, ...otherRest} = target;
    return comparableBoxes(box, otherBox, a.scrollY, b.scrollY) && eq(rest, otherRest) && chain.length === otherChain.length &&
      chain.every(({opacity, ...state}, i) => {
        const {opacity: otherOpacity, ...otherState} = otherChain[i];
        return Math.abs(opacity - otherOpacity) <= .01 && eq(state, otherState);
      });
  }) && comparableBoxes(a.logo.box, b.logo.box, a.scrollY, b.scrollY) && ['href','mask','label'].every(key => a.logo[key] === b.logo[key]);
for (const x of baseline.profiles) {
  const y = candidate.profiles.find(p => p.id === x.id);
  if (!y?.after) continue;
  check(x.id + ' equivalent hero and unchanged case, range, and destinations',
    sameHero(x.after, y.after) &&
    eq(x.depths, y.depths) &&
    eq(x.sections.range, y.sections.range) &&
    eq(x.sections.collection, y.sections.collection) &&
    eq(x.sections.kit, y.sections.kit) &&
    x.galleryHistory === y.galleryHistory &&
    eq(x.chapterTargets.map(c => c.section), y.chapterTargets.map(c => c.section)),
    {beforeHero: x.after.entry, afterHero: y.after.entry, beforeChapter: x.chapterTargets, afterChapter: y.chapterTargets,
      beforeOrder: x.sections.order.map(s => s.id), afterOrder: y.sections.order.map(s => s.id)});
  if (!x.sequence || !y.sequence) continue;
  const firstKit = p => p.sequence.findIndex(s => s.bounds.some(b => b[0] === '#kit-inicial' && b[3]));
  const prefix = Math.max(firstKit(x), firstKit(y)) + 1;
  const slices = [x,y].map(p => p.sequence.slice(0,prefix));
  const matched = prefix > 0 && firstKit(x) >= 0 && firstKit(y) >= 0 &&
    eq(slices[0].map(s => [s.offset, s.y]), slices[1].map(s => [s.offset, s.y]));
  check(x.id + ' contiguous matched ordinary first-scroll budget reaches kit', matched);
  report.readerSequences.push({
    id: x.id, viewport: [x.width, x.height], origin: slices[0][0]?.y, steps: prefix, scrollBudget: slices[0].at(-1)?.offset,
    before: slices[0].map(s => path.join(__dirname, 'baseline', s.screenshot)),
    after: slices[1].map(s => path.join(__dirname, 'candidate', s.screenshot)),
  });
}
for (const x of baseline.fallbacks) {
  const y = candidate.fallbacks.find(p => p.id === x.id);
  if (!y?.after) continue;
  check(x.id + ' equivalent original fallback and focus outcome', sameHero(x.after, y.after) &&
    eq(x.after.active, y.after.active) && eq(x.abortedMedia, y.abortedMedia) &&
    x.destination?.section === y.destination?.section, {before: x.after.entry, after: y.after.entry, focus: y.after.active});
}
fs.writeFileSync(path.join(__dirname, 'comparison-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({verdicts: report.checks.reduce((a,x) => ({...a,[x.verdict]:(a[x.verdict] || 0)+1}), {}), readerSequences: report.readerSequences.map(({before,after,...seq})=>seq), failures: report.checks.filter(x => x.verdict === 'FAIL').map(x => x.name)}));
