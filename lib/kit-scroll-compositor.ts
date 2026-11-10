import {kitCompositorKeyframes} from './kit-scroll-motion.ts';
import type {StoryCompositor} from './story-scroll-compositor.ts';

type Geometry = {width: number; overflow: number; top: number; span: number};
type ScrollConstructor = new(options: {source: Element; axis: 'y'}) => AnimationTimeline;
type ScrollOptions = KeyframeAnimationOptions & {rangeStart: string; rangeEnd: string};
type ScrollAnimation = Animation & {rangeStart: unknown; rangeEnd: unknown};
const pixels = (value: unknown): number | null => {
  if (typeof value === 'string' && /^-?[\d.]+px$/.test(value)) return parseFloat(value);
  if (value && typeof value === 'object') {
    const item = value as {unit?: string; value?: number; offset?: unknown};
    if (item.unit === 'px' && typeof item.value === 'number') return item.value;
    if (item.offset !== undefined) return pixels(item.offset);
  }
  return null;
};

/** Native enhancement uses kit-local attachment ranges, never the global film span. */
export function installKitScrollCompositor(root: HTMLElement, geometry: Geometry): StoryCompositor | null {
  const Timeline = (window as unknown as {ScrollTimeline?: ScrollConstructor}).ScrollTimeline;
  if (geometry.width > 700 || !Timeline || !CSS.supports('animation-timeline', 'scroll()') || !CSS.supports('animation-range-start', '1px') || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const source = document.scrollingElement;
  if (!source || geometry.span <= 0) return null;
  const owned = new Set<HTMLElement>(), animations: Animation[] = [];
  const snapshots = new Map<HTMLElement, {translate: string; scale: string; willChange: string}>();
  const dispose = () => {
    for (const animation of animations) animation.cancel();
    for (const element of owned) {
      delete element.dataset.scrollCompositor;
      Object.assign(element.style, snapshots.get(element));
    }
    owned.clear();
  };
  try {
    const timeline = new Timeline({source, axis: 'y'});
    const options: ScrollOptions = {duration: 'auto', fill: 'both', easing: 'linear', timeline, rangeStart: `${geometry.top}px`, rangeEnd: `${geometry.top + geometry.span}px`};
    const claim = (element: HTMLElement, keyframes: Keyframe[], properties: string) => {
      const animation = element.animate(keyframes, options) as ScrollAnimation;
      animations.push(animation);
      // Partial implementations must cancel completely and use the native painter.
      if (animation.timeline !== timeline || pixels(animation.rangeStart) !== geometry.top || pixels(animation.rangeEnd) !== geometry.top + geometry.span) throw new Error('Scroll timeline unavailable');
      snapshots.set(element, {translate: element.style.translate, scale: element.style.scale, willChange: element.style.willChange});
      owned.add(element);
      element.dataset.scrollCompositor = 'true';
      element.style.translate = 'none';
      element.style.scale = 'none';
      element.style.willChange = properties;
    };
    const keyframes = kitCompositorKeyframes(geometry.width, geometry.overflow);
    const track = root.querySelector<HTMLElement>('[data-layer="insight-track"]');
    if (track) claim(track, keyframes.track, 'transform');
    Array.from(root.querySelectorAll<HTMLElement>('[data-kit-title]')).forEach((title, index) => claim(title, keyframes.titles[index], 'transform, opacity'));
    for (const meaning of root.querySelectorAll<HTMLElement>('[data-kit-meaning]')) claim(meaning, keyframes.meanings, 'transform, opacity');
    return {owned, dispose};
  } catch {
    dispose();
    return null;
  }
}
