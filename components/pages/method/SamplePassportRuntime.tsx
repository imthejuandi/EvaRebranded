'use client';

import {Player, type PlayerRef} from '@remotion/player';
import {useState, type RefObject} from 'react';
import SamplePassportFilm, {PASSPORT_FPS, PASSPORT_FRAMES} from '@/remotion/engagement/SamplePassportFilm';

/** Loaded only when the film is visible and motion is permitted. */
export default function SamplePassportRuntime({playerRef, initialFrame}: {playerRef: RefObject<PlayerRef | null>; initialFrame: number}) {
  // Capture only at mount: control updates must not reset a playing composition.
  const [startFrame] = useState(initialFrame);
  return <Player ref={playerRef} initialFrame={startFrame} component={SamplePassportFilm} durationInFrames={PASSPORT_FRAMES} fps={PASSPORT_FPS} compositionWidth={720} compositionHeight={640} style={{width: '100%', height: '100%'}} controls={false} autoPlay={false} loop={false} clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} moveToBeginningWhenEnded={false} showPosterWhenEnded={false} initiallyMuted/>;
}
