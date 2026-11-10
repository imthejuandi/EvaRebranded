import {kitScrollState} from './kit-scroll-motion.ts';
import type {StoryScrollPainter} from './story-scroll-driver.ts';

/** Bind once. Headline/subtitle leaves animate; the thirteen assay names never move. */
export function createKitScrollPainter(root: HTMLElement, compositorOwned: ReadonlySet<HTMLElement> = new Set()): StoryScrollPainter {
  const bind = () => ({
    scene: root.querySelector<HTMLElement>('[data-layer="insight-scene"]'),
    track: root.querySelector<HTMLElement>('[data-layer="insight-track"]'),
    number: root.querySelector<HTMLElement>('[data-kit-scene-number]'),
    titles: Array.from(root.querySelectorAll<HTMLElement>('[data-kit-title]')),
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
      set(targets.track, 'willChange', state.phase === 'pan' ? 'transform' : 'auto');
    }
    targets.titles.forEach((title, index) => {
      if (compositorOwned.has(title)) return;
      const pose = state.titles[index];
      set(title, 'opacity', String(pose.opacity));
      set(title, 'transform', `translate3d(0, ${pose.y}px, 0)`);
      set(title, 'willChange', pose.opacity > 0 && pose.opacity < 1 ? 'transform, opacity' : 'auto');
    });
    for (const meaning of targets.meanings) {
      if (compositorOwned.has(meaning)) continue;
      set(meaning, 'opacity', String(state.context));
      set(meaning, 'transform', `translate3d(0, ${state.meaningY}px, 0)`);
      set(meaning, 'willChange', state.phase === 'reveal' ? 'transform, opacity' : 'auto');
    }
    const number = `0${state.stage} / 03`;
    if (targets.number && targets.number.textContent !== number) targets.number.textContent = number;
    root.dataset.renderedFrame = String(state.poseFrame);
    root.dataset.kitClock = String(state.clock);
    root.dataset.kitPhase = state.phase;
    root.dataset.kitStage = String(state.stage);
    root.dataset.scene = 'Entender';
  };
  return Object.assign(paint, {refresh: () => {targets = bind();}});
}
