import {KIT_SCROLL_BEATS, KIT_SCROLL_INPUT_END} from './kit-scroll-motion.ts';

export const KIT_REVEAL_DURATION_MS = 500;
export const KIT_REVEAL_SCROLL_THRESHOLD = KIT_SCROLL_BEATS.namesEnd;
export type KitRevealPhase = 'idle' | 'names' | 'revealing' | 'concealing' | 'complete' | 'paused';
export type KitRevealInput = {rawClock: number; stageVisible: boolean; documentVisible: boolean; enabled: boolean};
export type KitRevealSnapshot = {
  rawClock: number; presentationClock: number; phase: KitRevealPhase;
  pausedFrom: 'none' | 'revealing' | 'concealing';
  transitionProgress: number; transitionTarget: 0 | 1;
  transitionDirection: 'none' | 'forward' | 'reverse'; transitionMs: number;
  inputSource: 'init' | 'scroll' | 'layout' | 'visibility' | 'frame';
  active: boolean; complete: boolean;
};
export type KitRevealPlayback = {
  update: (input: Partial<KitRevealInput>, now: number, scrollEvent?: boolean) => KitRevealSnapshot;
  tick: (now: number) => KitRevealSnapshot;
  snapshot: () => KitRevealSnapshot;
  readonly needsFrame: boolean;
};

/** Scroll chooses the pose; a short, reversible handoff smooths that change. */
export function createKitRevealPlayback({render, observe}: {render: (clock: number) => void; observe?: (state: KitRevealSnapshot) => void}): KitRevealPlayback {
  let input: KitRevealInput = {rawClock: 0, stageVisible: false, documentVisible: true, enabled: true};
  let progress = 0, target: 0 | 1 = 0, transitionMs = 0;
  let initialized = false, previousTime: number | null = null, lastRendered = Number.NaN;
  let inputSource: KitRevealSnapshot['inputSource'] = 'init';
  const visible = () => input.enabled && input.stageVisible && input.documentVisible && input.rawClock >= KIT_SCROLL_BEATS.panEnd;
  const moving = () => progress !== target;
  const snapshot = (): KitRevealSnapshot => {
    const direction = !moving() ? 'none' : target === 1 ? 'forward' : 'reverse';
    const mode = target === 1 ? 'revealing' : 'concealing';
    const active = visible() && moving(), complete = progress === 1 && target === 1;
    const presentationClock = input.rawClock < KIT_SCROLL_BEATS.panEnd ? input.rawClock
      : progress === 0 ? 100
      : KIT_SCROLL_BEATS.namesEnd + (KIT_SCROLL_BEATS.contextEnd - KIT_SCROLL_BEATS.namesEnd) * progress;
    const phase: KitRevealPhase = input.rawClock < KIT_SCROLL_BEATS.panEnd ? 'idle'
      : moving() ? active ? mode : 'paused'
      : complete ? 'complete' : 'names';
    return {
      rawClock: input.rawClock, presentationClock, phase, pausedFrom: phase === 'paused' ? mode : 'none',
      transitionProgress: progress, transitionTarget: target, transitionDirection: direction,
      transitionMs, inputSource, active, complete,
    };
  };
  const advance = (now: number) => {
    const stamp = Number.isFinite(now) ? Math.max(previousTime ?? now, now) : previousTime ?? 0;
    const delta = previousTime === null ? 0 : stamp - previousTime;
    previousTime = stamp;
    if (!visible() || !moving()) return;
    const elapsed = Math.min(delta, Math.abs(target - progress) * KIT_REVEAL_DURATION_MS);
    const distance = elapsed / KIT_REVEAL_DURATION_MS;
    progress = target === 1 ? Math.min(1, progress + distance) : Math.max(0, progress - distance);
    transitionMs += elapsed;
  };
  const emit = () => {
    const state = snapshot();
    if (state.presentationClock !== lastRendered) {lastRendered = state.presentationClock; render(state.presentationClock);}
    observe?.(state);
    return state;
  };
  return {
    update(changes, now, scrollEvent = true) {
      // Account for the previous visible interval before a pause or retarget.
      advance(now);
      const previousClock = input.rawClock;
      input = {...input, ...changes};
      input.rawClock = Math.max(0, Math.min(KIT_SCROLL_INPUT_END, Number.isFinite(input.rawClock) ? input.rawClock : 0));
      if (changes.rawClock === undefined) inputSource = 'visibility';
      else if (!initialized) {
        initialized = true; inputSource = 'init';
        target = input.rawClock >= KIT_REVEAL_SCROLL_THRESHOLD ? 1 : 0;
        progress = target;
      } else {
        inputSource = scrollEvent ? 'scroll' : 'layout';
        // A queued scroll at a resize's unchanged clock cannot choose a new target.
        if (scrollEvent && input.rawClock !== previousClock) {
          if (input.rawClock < KIT_SCROLL_BEATS.panEnd) {progress = 0; target = 0; transitionMs = 0;}
          else {
            const nextTarget = input.rawClock >= KIT_REVEAL_SCROLL_THRESHOLD ? 1 : 0;
            if (nextTarget !== target) {target = nextTarget; transitionMs = 0;}
          }
        }
      }
      return emit();
    },
    tick(now) {advance(now); inputSource = 'frame'; return emit();},
    snapshot,
    get needsFrame() {return visible() && moving();},
  };
}
