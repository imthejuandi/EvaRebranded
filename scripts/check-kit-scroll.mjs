import assert from 'node:assert/strict';
import {KIT_SCROLL_BEATS, KIT_SCROLL_SPAN_SVH, KIT_SCROLL_HEIGHT_SVH, kitScrollState, kitCompositorKeyframes} from '../lib/kit-scroll-motion.ts';
import {createKitScrollPainter} from '../lib/kit-scroll-painter.ts';
import {installKitScrollCompositor} from '../lib/kit-scroll-compositor.ts';
import {storyScrollFrame} from '../lib/story-scroll-driver.ts';
import {STORY_SCROLL_HEIGHT_SVH, storyProgressAtFrame, KIT_SCENE_WINDOW, LIFE_SCENE_WINDOW} from '../lib/story-scroll-timing.ts';

const close = (actual, expected, label) => assert(Math.abs(actual - expected) < 1e-7, `${label}: ${actual} !== ${expected}`);
assert.deepEqual(KIT_SCENE_WINDOW, [555, 715]);
assert.deepEqual(LIFE_SCENE_WINDOW, [715, 900]);
close(KIT_SCROLL_HEIGHT_SVH, 100 + KIT_SCROLL_SPAN_SVH, 'Only the local kit section is extended');
const originalDistance = frames => (STORY_SCROLL_HEIGHT_SVH - 100) * (storyProgressAtFrame(555 + frames) - storyProgressAtFrame(555));
close(KIT_SCROLL_SPAN_SVH * 35 / KIT_SCROLL_BEATS.end, originalDistance(35), 'Original count physical distance');
close(KIT_SCROLL_SPAN_SVH * 45 / KIT_SCROLL_BEATS.end, originalDistance(80) - originalDistance(35), 'Original pan physical distance');
close(KIT_SCROLL_SPAN_SVH * 80 / KIT_SCROLL_BEATS.end, originalDistance(160) - originalDistance(80), 'Original final reading allowance');
for (let k = 0; k <= 80; k += .125) {
  close(kitScrollState(k, 390, 732).trackX, storyScrollFrame(555 + k, 390, 844, 366).insightX, `Original first pan pose at ${k}`);
}
for (const k of [80, 90, 102.5, 115, 130, 145]) close(kitScrollState(k, 390, 732).trackX, -366, `Language scene stays centered at ${k}`);
for (const k of [190, 215, 250, 270]) close(kitScrollState(k, 390, 732).trackX, -732, `Complete index stays centered at ${k}`);
close(kitScrollState(90, 390, 732).language, 0, 'Explanation reveal begins after the language scene arrives');
close(kitScrollState(102.5, 390, 732).language, .5, 'Plain-language reveal midpoint');
close(kitScrollState(115, 390, 732).language, 1, 'Explanation complete before index transition');
for (const k of [0, 90, 145, 190, 270]) assert.equal(kitScrollState(k, 390, 732).context, 1, 'Index always includes meanings');
close(kitScrollState(270, 390, 732).poseFrame, 715, 'Legacy scene still ends at original frame');
assert.equal(kitScrollState(-100, 390, 732).clock, 0);
assert.equal(kitScrollState(Number.NaN, 390, 732).clock, 0);
assert.equal(kitScrollState(999, 390, 732).clock, 270);

const bezier = (position, easing) => {
  if (easing === 'linear' || !easing) return position;
  const [x1, y1, x2, y2] = easing.match(/[\d.]+/g).map(Number);
  const coordinate = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  let low = 0, high = 1;
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    if (coordinate(mid, x1, x2) < position) low = mid;
    else high = mid;
  }
  return coordinate((low + high) / 2, y1, y2);
};
const sample = (keyframes, progress, value) => {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const from = keyframes[i], to = keyframes[i + 1];
    if (progress <= to.offset) {
      const position = bezier((progress - from.offset) / (to.offset - from.offset), from.easing);
      return value(from) + (value(to) - value(from)) * position;
    }
  }
  return value(keyframes.at(-1));
};
const transformNumbers = frame => frame.transform.match(/translate3d\(([-\d.]+)(?:px)?, ([-\d.]+)(?:px)?, 0\)/).slice(1).map(Number);
let parityCases = 0;
for (const width of [390, 430, 1440]) {
  const overflow = 2 * (width - (width <= 700 ? 24 : 48));
  const frames = kitCompositorKeyframes(width, overflow);
  for (let k = 0; k <= KIT_SCROLL_BEATS.end; k += .125) {
    const state = kitScrollState(k, width, overflow), progress = k / KIT_SCROLL_BEATS.end;
    close(sample(frames.track, progress, frame => transformNumbers(frame)[0]), state.trackX, `Compositor pan at ${k}/${width}`);
    close(sample(frames.language, progress, frame => frame.opacity), state.language, `Compositor opacity at ${k}/${width}`);
    close(sample(frames.language, progress, frame => transformNumbers(frame)[1]), state.languageY, `Compositor settle at ${k}/${width}`);
    parityCases++;
  }
}

const element = () => ({dataset: {}, style: {translate: 'legacy', scale: 'legacy', visibility: 'legacy', willChange: 'auto'},
  getBoundingClientRect() {throw new Error('Scroll paint must not read geometry');},
  get offsetHeight() {throw new Error('Scroll paint must not read layout');},
});
const scene = element(), track = element(), language = element(), number = element(), meanings = Array.from({length: 13}, element);
let queryCount = 0;
const root = {dataset: {}, querySelector(selector) {queryCount++; return selector.includes('insight-scene') ? scene : selector.includes('insight-track') ? track : selector.includes('language-reveal') ? language : number;}, querySelectorAll() {queryCount++; return meanings;}};
const paint = createKitScrollPainter(root);
assert.equal(queryCount, 5);
const clocks = [0, 35, 57.5, 80, 90, 102.5, 115, 145, 167.5, 190, 230, 270];
const forward = new Map();
for (const clock of [...clocks, ...clocks.toReversed()]) {
  paint(clock, 390, 844, 366);
  const state = kitScrollState(clock, 390, 366);
  assert.equal(track.style.transform, `translate3d(${state.trackX}px, 0, 0)`);
  for (const meaning of meanings) {
    assert.equal(meaning.style.opacity, String(state.context));
    assert.equal(meaning.style.transform, `translate3d(0, ${state.meaningY}px, 0)`);
  }
  assert.equal(language.style.opacity, String(state.language));
  assert.equal(language.style.transform, `translate3d(0, ${state.languageY}px, 0)`);
  assert.equal(root.dataset.kitPhase, state.phase);
  assert.equal(root.dataset.renderedFrame, String(state.poseFrame));
  const snapshot = JSON.stringify([track.style, language.style, number.textContent, meanings.map(meaning => meaning.style), root.dataset]);
  if (forward.has(clock)) assert.equal(snapshot, forward.get(clock), `Exact reverse pose at ${clock}`);
  else forward.set(clock, snapshot);
}
assert.equal(queryCount, 5, 'No scroll-time DOM queries');
paint.refresh();
assert.equal(queryCount, 10);
const owned = new Set([track, language]);
const browserPaint = createKitScrollPainter(root, owned);
const browserSnapshot = JSON.stringify([track.style, language.style]);
browserPaint(133, 390, 844, 366);
assert.equal(JSON.stringify([track.style, language.style]), browserSnapshot, 'Painter leaves compositor-owned properties untouched');

// A partial ScrollTimeline implementation must cancel every created animation.
const globals = ['window', 'document', 'CSS', 'matchMedia'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
try {
  class Timeline {}
  globalThis.window = {ScrollTimeline: Timeline};
  globalThis.document = {scrollingElement: {}};
  globalThis.CSS = {supports: () => true};
  globalThis.matchMedia = () => ({matches: false});
  let failureAt = Infinity, created = [];
  const animated = [track, language];
  for (const item of animated) item.animate = (keyframes, options) => {
    const animation = {timeline: options.timeline, rangeStart: options.rangeStart, rangeEnd: options.rangeEnd, cancelled: false, cancel() {this.cancelled = true;}};
    if (created.length === failureAt) animation.timeline = null;
    created.push(animation);
    return animation;
  };
  const geometry = {width: 390, overflow: 366, top: 2500, span: 1596.02};
  const compositor = installKitScrollCompositor(root, geometry);
  assert.equal(compositor.owned.size, 2, 'Only track and language reveal need compositor animations');
  for (const animation of created) {
    assert.equal(animation.rangeStart, `${geometry.top}px`);
    assert.equal(animation.rangeEnd, `${geometry.top + geometry.span}px`);
  }
  compositor.dispose();
  assert(created.every(animation => animation.cancelled));
  assert(animated.every(item => item.dataset.scrollCompositor === undefined));
  const beforeFailure = JSON.stringify(animated.map(item => item.style));
  created = []; failureAt = 1;
  assert.equal(installKitScrollCompositor(root, geometry), null);
  assert.equal(created.length, 2);
  assert(created.every(animation => animation.cancelled));
  assert.equal(JSON.stringify(animated.map(item => item.style)), beforeFailure, 'Failed enhancement restores styles for complete painter fallback');
  assert.equal(installKitScrollCompositor(root, {...geometry, width: 1440}), null, 'Desktop retains native-transform painter');
  globalThis.matchMedia = () => ({matches: true});
  assert.equal(installKitScrollCompositor(root, geometry), null, 'Reduced motion never installs compositor animations');
} finally {
  for (const [key, descriptor] of globals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
}

console.log(`Kit scroll passed: preserved count/pan distances, three complete scenes, ${parityCases} compositor/painter samples, exact reverse poses, cached bindings, ownership and complete partial-support cleanup. Browser layout still needs visual verification.`);
