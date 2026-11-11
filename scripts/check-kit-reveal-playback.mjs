import assert from 'node:assert/strict';
import {createKitRevealPlayback, KIT_REVEAL_DURATION_MS, KIT_REVEAL_SCROLL_THRESHOLD} from '../lib/kit-reveal-playback.ts';
import {kitScrollState} from '../lib/kit-scroll-motion.ts';
const close = (actual, expected, label) => assert(Math.abs(actual - expected) < 1e-7, `${label}: ${actual} !== ${expected}`);
const rig = () => {
  let now = 0; const renders = [], observations = [];
  const controller = createKitRevealPlayback({render: clock => renders.push(clock), observe: state => observations.push(state)});
  return {controller, renders, observations, update(input, elapsed = 0, scrollEvent = true) {now += elapsed; return controller.update(input, now, scrollEvent);}, tick(elapsed) {now += elapsed; return controller.tick(now);}};
};
assert.equal(KIT_REVEAL_DURATION_MS, 500);
assert.equal(KIT_REVEAL_SCROLL_THRESHOLD, 140);

const main = rig();
for (const rawClock of [0, 35, 57.5, 79.9]) {
  const state = main.update({rawClock, stageVisible: true, documentVisible: true});
  assert.equal(state.presentationClock, rawClock); assert.equal(state.transitionProgress, 0); assert.equal(main.controller.needsFrame, false);
}
let state = main.update({rawClock: 100});
assert.equal(state.phase, 'names'); assert.equal(state.presentationClock, 100); assert.equal(main.controller.needsFrame, false);
state = main.tick(60000);
assert.equal(state.transitionProgress, 0); assert.equal(state.presentationClock, 100, 'Reading the names never starts an automatic reveal');
state = main.update({rawClock: 140});
assert.equal(state.transitionTarget, 1); assert.equal(state.transitionProgress, 0); assert.equal(state.transitionDirection, 'forward'); assert(main.controller.needsFrame);
state = main.tick(125);
close(state.transitionProgress, .25, 'Quarter-second-span progress');
assert.equal(state.presentationClock, 180);
const dotted = kitScrollState(state.presentationClock, 390, 366);
close(dotted.arrival, 1.2 / 3.5, 'Half-second handoff retains the approved fully dotted pose');
state = main.tick(62.5);
assert.equal(kitScrollState(state.presentationClock, 390, 366).arrival, dotted.arrival, 'Brief dotted plateau stays visually stable');
state = main.tick(62.5);
assert.equal(state.presentationClock, 220);
assert.deepEqual(kitScrollState(state.presentationClock, 390, 366).titles.map(title => title.opacity), [0, .5, .5], 'Titles share the complete transition rather than jumping early');
assert.equal(kitScrollState(219.999, 390, 366).stage, 2); assert.equal(kitScrollState(220, 390, 366).stage, 3);
state = main.tick(250);
assert.equal(state.phase, 'complete'); assert.equal(state.presentationClock, 300); assert.equal(state.transitionMs, 500);
assert.equal(state.transitionProgress, 1); assert.equal(state.transitionDirection, 'none'); assert.equal(main.controller.needsFrame, false);
assert.equal(state.rawClock, 140, 'A scroll crossing starts the complete half-second handoff without dragging through frames');
assert(main.renders.filter(clock => clock >= 80).every(clock => kitScrollState(clock, 390, 366).trackX === -366), 'Names remain stationary across every transition frame');
state = main.update({rawClock: 139.999});
assert.equal(state.transitionTarget, 0); assert.equal(state.transitionProgress, 1); assert.equal(state.transitionMs, 0); assert.equal(state.phase, 'concealing');
state = main.tick(250); close(state.transitionProgress, .5, 'Reverse uses the same half-second speed');
state = main.tick(250); assert.equal(state.phase, 'names'); assert.equal(state.presentationClock, 100); assert.equal(state.transitionMs, 500);
state = main.tick(10000); assert.equal(state.transitionProgress, 0);

// A direction change starts at the current visual pose and takes proportional time.
const reverse = rig(); reverse.update({rawClock: 100, stageVisible: true}); reverse.update({rawClock: 150});
state = reverse.tick(200); close(state.transitionProgress, .4, 'Forward interruption pose');
const beforeReverse = state.presentationClock;
state = reverse.update({rawClock: 130}); assert.equal(state.presentationClock, beforeReverse); assert.equal(state.transitionMs, 0);
state = reverse.tick(100); close(state.transitionProgress, .2, 'Reverse partial leg');
const beforeForward = state.presentationClock;
state = reverse.update({rawClock: 150}); assert.equal(state.presentationClock, beforeForward);
state = reverse.update({rawClock: 160}, 100); close(state.transitionProgress, .4, 'Repeated forward scroll keeps the same leg'); assert.equal(state.transitionMs, 100);
state = reverse.tick(300); assert.equal(state.transitionProgress, 1); assert.equal(state.transitionMs, 400, 'Partial leg duration is proportional to the remaining distance');

// Resizing preserves the presentation and a queued same-position scroll cannot retarget.
const layout = rig(); layout.update({rawClock: 100, stageVisible: true});
state = layout.update({rawClock: 170}, 0, false); assert.equal(state.inputSource, 'layout'); assert.equal(state.transitionTarget, 0);
state = layout.update({rawClock: 170}); assert.equal(state.transitionTarget, 0); assert.equal(state.transitionProgress, 0);
state = layout.update({rawClock: 171}); assert.equal(state.transitionTarget, 1); assert.equal(state.inputSource, 'scroll');
layout.tick(200);
state = layout.update({rawClock: 60}, 0, false); close(state.transitionProgress, .4, 'Geometry before the pan keeps the in-flight pose'); assert.equal(state.presentationClock, 60);
state = layout.update({rawClock: 60}, 100); close(state.transitionProgress, .4, 'Unchanged queued scroll after geometry preserves progress'); assert.equal(state.transitionTarget, 1);
state = layout.update({rawClock: 61}); assert.equal(state.transitionProgress, 0); assert.equal(state.transitionTarget, 0); assert.equal(state.presentationClock, 61, 'Actual retreat clears the hidden transition for count/pan');
state = layout.update({rawClock: 100}); assert.equal(state.phase, 'names'); assert.equal(layout.controller.needsFrame, false);

// A first geometry measurement deep in the section restores the appropriate pose.
const deep = rig(); deep.update({documentVisible: true});
state = deep.update({rawClock: 170, stageVisible: true}, 0, false);
assert.equal(state.inputSource, 'init'); assert.equal(state.phase, 'complete'); assert.equal(state.presentationClock, 300); assert.equal(deep.controller.needsFrame, false);
state = deep.update({rawClock: 130}); assert.equal(state.phase, 'concealing');
state = deep.tick(500); assert.equal(state.phase, 'names');

// Offscreen or hidden time never consumes the active half-second handoff.
const visibility = rig(); visibility.update({rawClock: 100, stageVisible: false}); visibility.update({rawClock: 150});
state = visibility.tick(10000); assert.equal(state.transitionProgress, 0); assert.equal(state.phase, 'paused'); assert.equal(state.pausedFrom, 'revealing'); assert.equal(visibility.controller.needsFrame, false);
visibility.update({stageVisible: true}); state = visibility.tick(200); close(state.transitionProgress, .4, 'Visible active time');
state = visibility.update({documentVisible: false}, 100); close(state.transitionProgress, .6, 'Pause accounts for the preceding visible interval'); assert.equal(state.active, false);
state = visibility.tick(60000); close(state.transitionProgress, .6, 'Hidden tab does not catch up'); assert.equal(state.transitionMs, 300);
visibility.update({documentVisible: true}); state = visibility.tick(200); assert.equal(state.phase, 'complete'); close(state.transitionMs, 500, 'Resumed transition takes500active milliseconds');
visibility.update({rawClock: 130}); visibility.tick(100); state = visibility.update({enabled: false}); close(state.transitionProgress, .8, 'Disabled lifecycle keeps current pose');
visibility.tick(60000); visibility.update({enabled: true}); state = visibility.tick(400); assert.equal(state.phase, 'names'); assert.equal(state.transitionProgress, 0);
assert(visibility.observations.some(state => state.phase === 'paused' && state.pausedFrom === 'concealing'));

// Invalid timestamps/scroll values remain bounded and never run time backwards.
const safety = rig(); safety.update({rawClock: 100, stageVisible: true}); safety.update({rawClock: 150});
safety.tick(200); state = safety.controller.tick(100); close(state.transitionProgress, .4, 'Monotonic clock');
state = safety.controller.tick(Number.NaN); close(state.transitionProgress, .4, 'Invalid time does not advance');
assert.equal(safety.update({rawClock: Number.NaN}).rawClock, 0);
assert.equal(safety.update({rawClock: 999}).rawClock, 240);
console.log('Kit scroll-triggered handoff passed: stationary names hold indefinitely,140 threshold both directions,500ms full-span linear speed,current-pose interruption,title/counter sync,layout/queued-scroll persistence,deep restoration,offscreen/tab pause and original count/pan.');
