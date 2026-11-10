import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {OPENING_END_FRAME, OPENING_SCROLL_HEIGHT_SVH, STORY_SCROLL_HEIGHT_SVH, openingFrameAtProgress, openingProgressAtFrame, storyProgressAtFrame, KIT_SCENE_WINDOW, LIFE_SCENE_WINDOW} from '../lib/story-scroll-timing.ts';

assert.equal(OPENING_END_FRAME, 465, 'The opening ends on the full Tasso scene, before the amber transition');
assert.deepEqual(KIT_SCENE_WINDOW, [555, 715], 'The relocated kit retains the original full amber scene and horizontal movement');
assert(LIFE_SCENE_WINDOW[0] <= 735 && LIFE_SCENE_WINDOW[1] >= 840, 'The relocated lifestyle scene retains the title arrival and image settle');
for (const frame of [0, 20, 45, 90, 130, 190, 230, 280, 325, 400, 465]) {
  const progress = openingProgressAtFrame(frame);
  assert(Math.abs(openingFrameAtProgress(progress) - frame) < 1e-8, `Opening navigation round-trips frame ${frame}`);
  const before = (STORY_SCROLL_HEIGHT_SVH - 100) * storyProgressAtFrame(frame);
  const after = (OPENING_SCROLL_HEIGHT_SVH - 100) * progress;
  assert(Math.abs(before - after) < 1e-8, `Runner and Tasso retain their authored scroll distance at frame ${frame}`);
}
assert.equal(openingFrameAtProgress(1.1), 465, 'Scrolling beyond the opening does not replay relocated scenes');
const source=readFileSync(new URL('../components/story/ScrollStory.tsx',import.meta.url),'utf8');
assert(source.indexOf('<StoryScenePassage kind=\"kit\"')<source.indexOf('<ResultsContent'), 'Starting kit precedes the dashboard in the actual landing order');
console.log('Story sections passed: Tasso → starting kit → results, preserved physical timing, chapter positions and relocated scene windows.');
