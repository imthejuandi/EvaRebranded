import {KIT_SCENE_WINDOW, STORY_SCROLL_HEIGHT_SVH, storyProgressAtFrame} from './story-scroll-timing.ts';

/** Three complete scenes: kit count → plain-language example → biomarker index. */
export const KIT_SCROLL_BEATS = {
  countEnd: 35,
  panEnd: 80,
  languageRevealStart: 90,
  languageRevealEnd: 115,
  languageEnd: 145,
  indexStart: 190,
  end: 270,
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
  const firstPan = clamp((k - KIT_SCROLL_BEATS.countEnd) / (KIT_SCROLL_BEATS.panEnd - KIT_SCROLL_BEATS.countEnd));
  const secondPan = clamp((k - KIT_SCROLL_BEATS.languageEnd) / (KIT_SCROLL_BEATS.indexStart - KIT_SCROLL_BEATS.languageEnd));
  const language = smoothstep(clamp((k - KIT_SCROLL_BEATS.languageRevealStart) / (KIT_SCROLL_BEATS.languageRevealEnd - KIT_SCROLL_BEATS.languageRevealStart)));
  return {
    clock: k,
    poseFrame: k <= 80 ? KIT_SCENE_WINDOW[0] + k : k <= 190 ? 635 : 635 + k - 190,
    trackX: -(firstPan + secondPan) * Math.max(0, overflow) / 2,
    context: 1,
    meaningY: 0,
    language,
    languageY: (width <= 700 ? 4 : 6) * (1 - language),
    phase: k < 35 ? 'count' : k < 80 ? 'to-language' : k < 145 ? 'language' : k < 190 ? 'to-markers' : 'markers',
  };
}
export function kitCompositorKeyframes(width: number, overflow: number) {
  const track = [0, 35, 80, 145, 190, 270].map(clock => ({offset: clock / KIT_SCROLL_BEATS.end, transform: `translate3d(${kitScrollState(clock, width, overflow).trackX}px, 0, 0)`}));
  const language = [0, 90, 115, 270].map(clock => {
    const state = kitScrollState(clock, width, overflow);
    return {offset: clock / KIT_SCROLL_BEATS.end, opacity: state.language, transform: `translate3d(0, ${state.languageY}px, 0)`, easing: clock === 90 ? KIT_CONTEXT_EASING : 'linear'};
  });
  return {track, language};
}
