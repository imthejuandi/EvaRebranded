import {KIT_SCENE_WINDOW, STORY_SCROLL_HEIGHT_SVH, storyProgressAtFrame} from './story-scroll-timing.ts';

/** One index: count → all assay names → the same names gain plain-language meanings. */
export const KIT_SCROLL_BEATS = {
  countEnd: 35,
  titleTwoStart: 55,
  panEnd: 80,
  namesEnd: 140,
  titleThreeEnd: 160,
  contextEnd: 210,
  end: 290,
} as const;
const originalSpan = KIT_SCENE_WINDOW[1] - KIT_SCENE_WINDOW[0];
const originalScrollSpan = (STORY_SCROLL_HEIGHT_SVH - 100) * (storyProgressAtFrame(KIT_SCENE_WINDOW[1]) - storyProgressAtFrame(KIT_SCENE_WINDOW[0]));
export const KIT_SCROLL_SPAN_SVH = originalScrollSpan * KIT_SCROLL_BEATS.end / originalSpan;
export const KIT_SCROLL_HEIGHT_SVH = 100 + KIT_SCROLL_SPAN_SVH;
export const KIT_CONTEXT_EASING = 'cubic-bezier(0.3333333333333333, 0, 0.6666666666666666, 1)';
const clamp = (value: number, maximum = 1) => Math.max(0, Math.min(maximum, Number.isFinite(value) ? value : 0));
const smoothstep = (value: number) => value * value * (3 - 2 * value);
export function kitScrollState(clock: number, width: number, overflow: number) {
  const k = clamp(clock, KIT_SCROLL_BEATS.end);
  const pan = clamp((k - KIT_SCROLL_BEATS.countEnd) / (KIT_SCROLL_BEATS.panEnd - KIT_SCROLL_BEATS.countEnd));
  const titleTwo = smoothstep(clamp((k - KIT_SCROLL_BEATS.titleTwoStart) / (KIT_SCROLL_BEATS.panEnd - KIT_SCROLL_BEATS.titleTwoStart)));
  const titleThree = smoothstep(clamp((k - KIT_SCROLL_BEATS.namesEnd) / (KIT_SCROLL_BEATS.titleThreeEnd - KIT_SCROLL_BEATS.namesEnd)));
  const context = smoothstep(clamp((k - KIT_SCROLL_BEATS.namesEnd) / (KIT_SCROLL_BEATS.contextEnd - KIT_SCROLL_BEATS.namesEnd)));
  const titleTravel = width <= 700 ? 5 : 8;
  return {
    clock: k,
    poseFrame: k <= 80 ? KIT_SCENE_WINDOW[0] + k : k <= 210 ? 635 : 635 + k - 210,
    trackX: -pan * Math.max(0, overflow),
    context,
    arrival: clamp((k - KIT_SCROLL_BEATS.namesEnd) / (KIT_SCROLL_BEATS.contextEnd - KIT_SCROLL_BEATS.namesEnd)),
    meaningY: 0,
    titles: [
      {opacity: 1 - titleTwo, y: -titleTravel * titleTwo},
      {opacity: titleTwo - titleThree, y: titleTravel * (1 - titleTwo) - titleTravel * titleThree},
      {opacity: titleThree, y: titleTravel * (1 - titleThree)},
    ],
    stage: k < 67.5 ? 1 : k < 150 ? 2 : 3,
    phase: k < 35 ? 'count' : k < 80 ? 'pan' : k < 140 ? 'names' : k < 210 ? 'reveal' : 'context',
  };
}
export function kitCompositorKeyframes(width: number, overflow: number) {
  const track = [0, 35, 80, 290].map(clock => ({offset: clock / KIT_SCROLL_BEATS.end, transform: `translate3d(${kitScrollState(clock, width, overflow).trackX}px, 0, 0)`}));
  const meanings = [0, 140, 210, 290].map(clock => {
    const state = kitScrollState(clock, width, overflow);
    return {offset: clock / KIT_SCROLL_BEATS.end, opacity: state.context, transform: `translate3d(0, ${state.meaningY}px, 0)`, easing: clock === 140 ? KIT_CONTEXT_EASING : 'linear'};
  });
  const titles = [0, 1, 2].map(index => [0, 55, 80, 140, 160, 290].map(clock => {
    const title = kitScrollState(clock, width, overflow).titles[index];
    return {offset: clock / KIT_SCROLL_BEATS.end, opacity: title.opacity, transform: `translate3d(0, ${title.y}px, 0)`, easing: clock === 55 || clock === 140 ? KIT_CONTEXT_EASING : 'linear'};
  }));
  return {track, meanings, titles};
}
