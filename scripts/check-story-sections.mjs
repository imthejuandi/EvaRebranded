import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  RUNNER_EXIT_FRAME, runnerExitFrameAtProgress, storyFrameAtProgress, storyProgressAtFrame,
  KIT_SCENE_WINDOW, LIFE_SCENE_WINDOW,
} from '../lib/story-scroll-timing.ts';

assert.equal(RUNNER_EXIT_FRAME, 200);
for (const [progress, frame] of [[-1, 0], [0, 0], [0.25, 50], [0.5, 100], [1, 200], [2, 200]]) {
  assert.equal(runnerExitFrameAtProgress(progress), frame, 'The runner exits within its own viewport');
}
assert.deepEqual(KIT_SCENE_WINDOW, [555, 715]);
assert(LIFE_SCENE_WINDOW[0] <= 735 && LIFE_SCENE_WINDOW[1] >= 840);
for (const frame of [...KIT_SCENE_WINDOW, ...LIFE_SCENE_WINDOW]) {
  assert(Math.abs(storyFrameAtProgress(storyProgressAtFrame(frame)) - frame) < 1e-8);
}

const source = readFileSync(new URL('../components/story/ScrollStory.tsx', import.meta.url), 'utf8');
const sectionOrder = ['<ReportUnderstanding', 'id="recogida-en-casa"', '<StoryScenePassage kind="kit"', '<RangeProofSection', '<ResultsContent'];
let previous = -1;
for (const section of sectionOrder) {
  const position = source.indexOf(section);
  assert(position > previous, 'Landing section missing or out of order: ' + section);
  previous = position;
}
console.log('Story order and runner, kit and lifestyle frame windows passed.');
