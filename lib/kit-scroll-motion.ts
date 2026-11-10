import {KIT_SCENE_WINDOW, STORY_SCROLL_HEIGHT_SVH, storyProgressAtFrame} from './story-scroll-timing.ts';

/** A passage-local clock: the original count and pan keep their physical pacing. */
export const KIT_SCROLL_BEATS = {
  countEnd: 35,
  panEnd: 80,
  namesEnd: 120,
  contextEnd: 146,
  end: 226,
} as const;

const originalSpan = KIT_SCENE_WINDOW[1] - KIT_SCENE_WINDOW[0];
const originalScrollSpan = (STORY_SCROLL_HEIGHT_SVH - 100) * (storyProgressAtFrame(KIT_SCENE_WINDOW[1]) - storyProgressAtFrame(KIT_SCENE_WINDOW[0]));
export const KIT_SCROLL_SPAN_SVH = originalScrollSpan * KIT_SCROLL_BEATS.end / originalSpan;
export const KIT_SCROLL_HEIGHT_SVH = 100 + KIT_SCROLL_SPAN_SVH;
export const KIT_CONTEXT_EASING = 'cubic-bezier(0.3333333333333333, 0, 0.6666666666666666, 1)';

const clamp = (value: number, maximum = 1) => Math.max(0, Math.min(maximum, Number.isFinite(value) ? value : 0));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

/** The subtitle reveal pauses the legacy pose clock; no later scene is retimed. */
export function kitScrollState(clock: number, width: number, overflow: number) {
  const k = clamp(clock, KIT_SCROLL_BEATS.end);
  const poseFrame = k <= KIT_SCROLL_BEATS.panEnd ? KIT_SCENE_WINDOW[0] + k
    : k <= KIT_SCROLL_BEATS.contextEnd ? 635
    : 635 + k - KIT_SCROLL_BEATS.contextEnd;
  const context = smoothstep(clamp((k - KIT_SCROLL_BEATS.namesEnd) / (KIT_SCROLL_BEATS.contextEnd - KIT_SCROLL_BEATS.namesEnd)));
  return {
    clock: k,
    poseFrame,
    trackX: -clamp((poseFrame - 590) / 45) * Math.max(0, overflow),
    context,
    meaningY: (width <= 700 ? 4 : 6) * (1 - context),
    phase: k < KIT_SCROLL_BEATS.countEnd ? 'count' : k < KIT_SCROLL_BEATS.panEnd ? 'pan'
      : k < KIT_SCROLL_BEATS.namesEnd ? 'names' : k < KIT_SCROLL_BEATS.contextEnd ? 'reveal' : 'context',
  };
}

/** The exact same intervals/easing as the native painter, attached to local scroll. */
export function kitCompositorKeyframes(width: number, overflow: number) {
  const track = [0, KIT_SCROLL_BEATS.countEnd, KIT_SCROLL_BEATS.panEnd, KIT_SCROLL_BEATS.end].map(clock => ({
    offset: clock / KIT_SCROLL_BEATS.end,
    transform: `translate3d(${kitScrollState(clock, width, overflow).trackX}px, 0, 0)`,
  }));
  const meanings = [0, KIT_SCROLL_BEATS.namesEnd, KIT_SCROLL_BEATS.contextEnd, KIT_SCROLL_BEATS.end].map(clock => {
    const state = kitScrollState(clock, width, overflow);
    return {
      offset: clock / KIT_SCROLL_BEATS.end,
      opacity: state.context,
      transform: `translate3d(0, ${state.meaningY}px, 0)`,
      easing: clock === KIT_SCROLL_BEATS.namesEnd ? KIT_CONTEXT_EASING : 'linear',
    };
  });
  return {track, meanings};
}
