import {KIT_SCENE_WINDOW, STORY_SCROLL_HEIGHT_SVH, storyProgressAtFrame} from './story-scroll-timing.ts';

/** One index: count → all assay names → the same names gain plain-language meanings. */
export const KIT_SCROLL_BEATS = {
  countEnd: 35,
  titleTwoStart: 55,
  panEnd: 80,
  namesEnd: 140,
  titleThreeEnd: 300,
  dotFormationEnd: 170,
  dotHoldEnd: 205,
  dotDevelopmentEnd: 270,
  contextEnd: 300,
  end: 380,
} as const;
// Scroll distance is independent of the half-second presentation handoff.
export const KIT_SCROLL_INPUT_END = 240;
const originalSpan = KIT_SCENE_WINDOW[1] - KIT_SCENE_WINDOW[0];
const originalScrollSpan = (STORY_SCROLL_HEIGHT_SVH - 100) * (storyProgressAtFrame(KIT_SCENE_WINDOW[1]) - storyProgressAtFrame(KIT_SCENE_WINDOW[0]));
export const KIT_SCROLL_SPAN_SVH = originalScrollSpan * KIT_SCROLL_INPUT_END / originalSpan;
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
  // The runner arrival deliberately pauses as fully formed dots before the
  // developing-glyph handoff. These are scroll beats, never an autoplay delay.
  const arrivalTime = k <= KIT_SCROLL_BEATS.dotFormationEnd
    ? 1.2 * clamp((k - KIT_SCROLL_BEATS.namesEnd) / (KIT_SCROLL_BEATS.dotFormationEnd - KIT_SCROLL_BEATS.namesEnd))
    : k <= KIT_SCROLL_BEATS.dotHoldEnd ? 1.2
    : k <= KIT_SCROLL_BEATS.dotDevelopmentEnd
      ? 1.2 + 1.95 * clamp((k - KIT_SCROLL_BEATS.dotHoldEnd) / (KIT_SCROLL_BEATS.dotDevelopmentEnd - KIT_SCROLL_BEATS.dotHoldEnd))
      : 3.15 + .35 * clamp((k - KIT_SCROLL_BEATS.dotDevelopmentEnd) / (KIT_SCROLL_BEATS.contextEnd - KIT_SCROLL_BEATS.dotDevelopmentEnd));
  const titleTravel = width <= 700 ? 5 : 8;
  return {
    clock: k,
    poseFrame: k <= KIT_SCROLL_BEATS.panEnd ? KIT_SCENE_WINDOW[0] + k : k <= KIT_SCROLL_BEATS.contextEnd ? 635 : 635 + k - KIT_SCROLL_BEATS.contextEnd,
    trackX: -pan * Math.max(0, overflow),
    context,
    arrival: arrivalTime / 3.5,
    meaningY: 0,
    titles: [
      {opacity: 1 - titleTwo, y: -titleTravel * titleTwo},
      {opacity: titleTwo - titleThree, y: titleTravel * (1 - titleTwo) - titleTravel * titleThree},
      {opacity: titleThree, y: titleTravel * (1 - titleThree)},
    ],
    stage: k < 67.5 ? 1 : k < 220 ? 2 : 3,
    phase: k < 35 ? 'count' : k < 80 ? 'pan' : k < 140 ? 'names' : k < KIT_SCROLL_BEATS.contextEnd ? 'reveal' : 'context',
  };
}
export function kitCompositorKeyframes(width: number, overflow: number, trackInputEnd: number = KIT_SCROLL_BEATS.end) {
  const track = [0, KIT_SCROLL_BEATS.countEnd, KIT_SCROLL_BEATS.panEnd, trackInputEnd].map(clock => ({offset: clock / trackInputEnd, transform: `translate3d(${kitScrollState(clock, width, overflow).trackX}px, 0, 0)`}));
  const meanings = [0, KIT_SCROLL_BEATS.namesEnd, KIT_SCROLL_BEATS.contextEnd, KIT_SCROLL_BEATS.end].map(clock => {
    const state = kitScrollState(clock, width, overflow);
    return {offset: clock / KIT_SCROLL_BEATS.end, opacity: state.context, transform: `translate3d(0, ${state.meaningY}px, 0)`, easing: clock === 140 ? KIT_CONTEXT_EASING : 'linear'};
  });
  const titles = [0, 1, 2].map(index => [0, KIT_SCROLL_BEATS.titleTwoStart, KIT_SCROLL_BEATS.panEnd, KIT_SCROLL_BEATS.namesEnd, KIT_SCROLL_BEATS.titleThreeEnd, KIT_SCROLL_BEATS.end].map(clock => {
    const title = kitScrollState(clock, width, overflow).titles[index];
    return {offset: clock / KIT_SCROLL_BEATS.end, opacity: title.opacity, transform: `translate3d(0, ${title.y}px, 0)`, easing: clock === 55 || clock === 140 ? KIT_CONTEXT_EASING : 'linear'};
  }));
  return {track, meanings, titles};
}
