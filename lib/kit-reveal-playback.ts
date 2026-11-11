import {KIT_SCROLL_BEATS, KIT_SCROLL_INPUT_END} from './kit-scroll-motion.ts';

export const KIT_REVEAL_READING_MS = 1200;
export const KIT_REVEAL_DURATION_MS = 1200;
export const KIT_REVEAL_RESET_CLOCK = 72;
export type KitRevealPhase = 'idle' | 'reading' | 'revealing' | 'complete' | 'paused';
export type KitRevealInput = {rawClock: number; stageVisible: boolean; documentVisible: boolean; enabled: boolean};
export type KitRevealSnapshot = {
  rawClock: number; presentationClock: number; phase: KitRevealPhase;
  pausedFrom: 'none' | 'reading' | 'revealing'; readMs: number; revealMs: number;
  active: boolean; complete: boolean;
};
export type KitRevealPlayback = {
  update: (input: Partial<KitRevealInput>, now: number, allowReset?: boolean) => KitRevealSnapshot;
  tick: (now: number) => KitRevealSnapshot;
  snapshot: () => KitRevealSnapshot;
  readonly needsFrame: boolean;
};

/** Pure elapsed-visible-time controller. The host owns RAF, visibility and scrolling. */
export function createKitRevealPlayback({render, observe}: {render: (clock: number) => void; observe?: (state: KitRevealSnapshot) => void}): KitRevealPlayback {
  let input: KitRevealInput = {rawClock: 0, stageVisible: false, documentVisible: true, enabled: true};
  let readMs = 0, revealMs = 0, previousTime: number | null = null, lastRendered = Number.NaN;
  const active = () => input.enabled && input.stageVisible && input.documentVisible && input.rawClock >= KIT_SCROLL_BEATS.panEnd;
  const complete = () => revealMs >= KIT_REVEAL_DURATION_MS;
  const snapshot = (): KitRevealSnapshot => {
    const isActive = active(), isComplete = complete();
    const mode = readMs < KIT_REVEAL_READING_MS ? 'reading' : 'revealing';
    const presentationClock = input.rawClock < KIT_SCROLL_BEATS.panEnd ? input.rawClock
      : isComplete ? KIT_SCROLL_BEATS.contextEnd
      : readMs < KIT_REVEAL_READING_MS ? 100
      : KIT_SCROLL_BEATS.namesEnd + (KIT_SCROLL_BEATS.contextEnd - KIT_SCROLL_BEATS.namesEnd) * revealMs / KIT_REVEAL_DURATION_MS;
    const phase: KitRevealPhase = isComplete ? 'complete'
      : input.rawClock < KIT_SCROLL_BEATS.panEnd && readMs === 0 && revealMs === 0 ? 'idle'
      : !isActive ? 'paused' : mode;
    return {rawClock: input.rawClock, presentationClock, phase, pausedFrom: phase === 'paused' ? mode : 'none', readMs, revealMs, active: isActive && !isComplete, complete: isComplete};
  };
  const advance = (now: number) => {
    const stamp = Number.isFinite(now) ? Math.max(previousTime ?? now, now) : previousTime ?? 0;
    let delta = previousTime === null ? 0 : stamp - previousTime;
    previousTime = stamp;
    if (!active() || complete()) return;
    const reading = Math.min(delta, KIT_REVEAL_READING_MS - readMs);
    readMs += reading; delta -= reading;
    if (readMs >= KIT_REVEAL_READING_MS) revealMs = Math.min(KIT_REVEAL_DURATION_MS, revealMs + delta);
  };
  const emit = () => {
    const state = snapshot();
    if (state.presentationClock !== lastRendered) {lastRendered = state.presentationClock; render(state.presentationClock);}
    observe?.(state);
    return state;
  };
  return {
    update(changes, now, allowReset = true) {
      advance(now);
      const previousClock = input.rawClock;
      input = {...input, ...changes};
      input.rawClock = Math.max(0, Math.min(KIT_SCROLL_INPUT_END, Number.isFinite(input.rawClock) ? input.rawClock : 0));
      if (allowReset && changes.rawClock !== undefined && input.rawClock !== previousClock && input.rawClock < KIT_REVEAL_RESET_CLOCK) {readMs = 0; revealMs = 0;}
      return emit();
    },
    tick(now) {advance(now); return emit();},
    snapshot,
    get needsFrame() {return active() && !complete();},
  };
}
