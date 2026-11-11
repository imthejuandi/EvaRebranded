import assert from 'node:assert/strict';
import {createKitRevealPlayback, KIT_REVEAL_READING_MS, KIT_REVEAL_DURATION_MS} from '../lib/kit-reveal-playback.ts';
import {kitScrollState} from '../lib/kit-scroll-motion.ts';
const close = (actual, expected, label) => assert(Math.abs(actual - expected) < 1e-7, `${label}: ${actual} !== ${expected}`);
const rig = () => {
  let now = 0; const renders = [], observations = [];
  const controller = createKitRevealPlayback({render: clock => renders.push(clock), observe: state => observations.push(state)});
  return {controller, renders, observations, update(input, elapsed = 0, allowReset = true) {now += elapsed; return controller.update(input, now, allowReset);}, tick(elapsed) {now += elapsed; return controller.tick(now);}};
};

const main = rig();
for (const rawClock of [0, 35, 57.5, 79.9]) {
  const state = main.update({rawClock, stageVisible: true, documentVisible: true});
  assert.equal(state.presentationClock, rawClock); assert.equal(state.readMs, 0); assert.equal(main.controller.needsFrame, false);
}
let state = main.update({rawClock: 100});
assert.equal(state.phase, 'reading'); assert.equal(state.presentationClock, 100); assert(main.controller.needsFrame);
state = main.tick(KIT_REVEAL_READING_MS - 1);
assert.equal(state.readMs, 4999); assert.equal(state.revealMs, 0); assert.equal(state.presentationClock, 100);
state = main.tick(1);
assert.equal(state.phase, 'revealing'); assert.equal(state.readMs, 5000); assert.equal(state.revealMs, 0); assert.equal(state.presentationClock, 140);
state = main.tick(1200);
const dotted = kitScrollState(state.presentationClock, 390, 366);
assert.equal(dotted.arrival, 1.2 / 3.5, 'Timed progression reaches the approved fully dotted frame');
state = main.tick(600);
assert.equal(kitScrollState(state.presentationClock, 390, 366).arrival, dotted.arrival, 'The dot plateau lasts while scrolling has stopped');
state = main.tick(1200);
const development = kitScrollState(state.presentationClock, 390, 366);
assert(development.arrival > .47 && development.arrival < 1, 'Visible-time progress develops the glyphs without another scroll event');
state = main.tick(1800);
assert.equal(state.phase, 'complete'); assert.equal(state.presentationClock, 300); assert.equal(state.revealMs, 4800);
assert.equal(state.rawClock, 100, 'No input-scroll movement is needed to complete the reveal');
assert.equal(state.active, false); assert.equal(main.controller.needsFrame, false);
assert(main.renders.filter(clock => clock >= 80).every(clock => kitScrollState(clock, 390, 366).trackX === -366), 'The index remains stationary across all timed frames');
assert.deepEqual(kitScrollState(300, 390, 366).titles.map(title => title.opacity), [0, 0, 1]);
assert.equal(kitScrollState(300, 390, 366).arrival, 1);

// Background tabs and offscreen sections cannot consume reading or animation time.
const visibility = rig();
visibility.update({rawClock: 100, stageVisible: false});
state = visibility.tick(10000); assert.equal(state.readMs, 0); assert.equal(state.phase, 'paused');
visibility.update({stageVisible: true}); visibility.tick(2200);
state = visibility.update({documentVisible: false});
assert.equal(state.phase, 'paused'); assert.equal(state.pausedFrom, 'reading'); assert.equal(state.active, false);
state = visibility.tick(60000); assert.equal(state.readMs, 2200); assert.equal(state.revealMs, 0);
visibility.update({documentVisible: true});
state = visibility.tick(2800); assert.equal(state.readMs, 5000); assert.equal(state.revealMs, 0);
visibility.tick(1000); state = visibility.update({stageVisible: false});
assert.equal(state.phase, 'paused'); assert.equal(state.pausedFrom, 'revealing');
const pausedClock = state.presentationClock;
state = visibility.tick(60000); assert.equal(state.revealMs, 1000); assert.equal(state.presentationClock, pausedClock);
visibility.update({stageVisible: true}); state = visibility.tick(3800);
assert.equal(state.phase, 'complete'); assert.equal(state.presentationClock, 300);
visibility.update({stageVisible: false, rawClock: 240}); visibility.tick(10000);
state = visibility.update({stageVisible: true, rawClock: 140});
assert.equal(state.phase, 'complete', 'Returning from below keeps an already completed explanation');
assert.equal(state.presentationClock, 300);

// Small reversals keep elapsed time; returning before the pan resets the episode.
const reverse = rig(); reverse.update({rawClock: 100, stageVisible: true}); reverse.tick(2000);
state = reverse.update({rawClock: 95}, 500); assert.equal(state.readMs, 2500);
state = reverse.update({rawClock: 80}, 500); assert.equal(state.readMs, 3000);
state = reverse.update({rawClock: 75}, 100); assert.equal(state.readMs, 3100); assert.equal(state.phase, 'paused');
state = reverse.tick(10000); assert.equal(state.readMs, 3100);
state = reverse.update({rawClock: 100}); assert.equal(state.readMs, 3100); assert.equal(state.phase, 'reading');
reverse.tick(1900); reverse.tick(1200);
state = reverse.update({rawClock: 60}, 0, false); assert.equal(state.readMs, 5000); assert.equal(state.revealMs, 1200, 'Layout-only geometry changes preserve the playback clock');
state = reverse.update({rawClock: 100}, 0, false); assert.equal(state.revealMs, 1200); assert.equal(state.phase, 'revealing');
state = reverse.update({rawClock: 71}); assert.equal(state.phase, 'idle'); assert.equal(state.readMs, 0); assert.equal(state.revealMs, 0);
state = reverse.update({rawClock: 100}); assert.equal(state.phase, 'reading'); assert.equal(state.readMs, 0);
state = reverse.tick(9800); assert.equal(state.phase, 'complete');

// A resize measure can be followed by a queued scroll at the identical position.
const layout = rig(); layout.update({rawClock: 100, stageVisible: true}); layout.tick(3000);
state = layout.update({rawClock: 60}, 0, false); assert.equal(state.readMs, 3000);
state = layout.update({rawClock: 60}, 100); assert.equal(state.readMs, 3000, 'Queued same-clock scroll after layout does not reset the reading episode');
assert.equal(state.phase, 'paused');
state = layout.update({rawClock: 61}); assert.equal(state.readMs, 0, 'A subsequent real scroll movement before72 resets normally');

// Input events account for the visible interval immediately before a pause.
const events = rig(); events.update({rawClock: 100, stageVisible: true});
state = events.update({documentVisible: false}, 2000); assert.equal(state.readMs, 2000);
state = events.tick(20000); assert.equal(state.readMs, 2000);
events.update({documentVisible: true}); state = events.tick(3000); assert.equal(state.revealMs, 0);
state = events.update({enabled: false}, 800); assert.equal(state.revealMs, 800);
state = events.tick(20000); assert.equal(state.revealMs, 800);
events.update({enabled: true}); state = events.tick(4000); assert.equal(state.phase, 'complete');
assert(events.observations.some(state => state.phase === 'paused' && state.pausedFrom === 'revealing'));
assert.equal(events.update({rawClock: Number.NaN}).rawClock, 0);
assert.equal(events.update({rawClock: 999}).rawClock, 240);
console.log('Kit timed reveal passed: unchanged count/pan input,5000ms active reading,4800ms autonomous reveal,dotted hold,stationary index,hidden/offscreen pause,resume,layout persistence,reverse hysteresis/reentry reset,terminal300pose and observable state.');
