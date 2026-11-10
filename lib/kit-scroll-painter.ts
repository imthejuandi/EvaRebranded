import {kitScrollState} from './kit-scroll-motion.ts';
import type {StoryScrollPainter} from './story-scroll-driver.ts';

/** Bind once. Only the track and subtitle leaves move; assay-name layout is fixed. */
export function createKitScrollPainter(root: HTMLElement, compositorOwned: ReadonlySet<HTMLElement> = new Set()): StoryScrollPainter {
  const bind = () => ({
    scene: root.querySelector<HTMLElement>('[data-layer="insight-scene"]'),
    track: root.querySelector<HTMLElement>('[data-layer="insight-track"]'),
    language: root.querySelector<HTMLElement>('[data-kit-language-reveal]'),
    number: root.querySelector<HTMLElement>('[data-kit-scene-number]'),
    meanings: Array.from(root.querySelectorAll<HTMLElement>('[data-kit-meaning]')),
  });
  let targets = bind();
  const set = (element: HTMLElement | null, property: 'transform' | 'translate' | 'visibility' | 'opacity' | 'willChange', value: string) => {
    if (element && element.style[property] !== value) element.style[property] = value;
  };
  const paint = (clock: number, width: number, height: number, overflow: number) => {
    if (!Number.isFinite(clock) || width <= 0 || height <= 0) return;
    const state = kitScrollState(clock, width, overflow);
    set(targets.scene, 'translate', 'none');
    set(targets.scene, 'transform', 'translate3d(0, 0, 0)');
    set(targets.scene, 'visibility', 'visible');
    if (targets.track && !compositorOwned.has(targets.track)) {
      set(targets.track, 'translate', 'none');
      set(targets.track, 'transform', `translate3d(${state.trackX}px, 0, 0)`);
      set(targets.track, 'willChange', state.phase.startsWith('to-') ? 'transform' : 'auto');
    }
    if (targets.language && !compositorOwned.has(targets.language)) {
      set(targets.language, 'opacity', String(state.language));
      set(targets.language, 'transform', `translate3d(0, ${state.languageY}px, 0)`);
      set(targets.language, 'willChange', state.language > 0 && state.language < 1 ? 'transform, opacity' : 'auto');
    }
    const opacity = String(state.context), transform = `translate3d(0, ${state.meaningY}px, 0)`;
    for (const meaning of targets.meanings) {
      if (compositorOwned.has(meaning)) continue;
      set(meaning, 'opacity', opacity);
      set(meaning, 'transform', transform);
      set(meaning, 'willChange', 'auto');
    }
    const number = state.clock < 57.5 ? '01 / 03' : state.clock < 167.5 ? '02 / 03' : '03 / 03';
    if (targets.number && targets.number.textContent !== number) targets.number.textContent = number;
    root.dataset.renderedFrame = String(state.poseFrame);
    root.dataset.kitClock = String(state.clock);
    root.dataset.kitPhase = state.phase;
    root.dataset.scene = 'Entender';
  };
  return Object.assign(paint, {refresh: () => {targets = bind();}});
}
