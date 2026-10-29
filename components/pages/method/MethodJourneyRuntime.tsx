'use client';
import {Player, type PlayerRef} from '@remotion/player';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {RefObject} from 'react';
import {MethodJourneyArtwork} from './MethodJourneyArtwork';
import {METHOD_FRAMES} from './method-journey-motion';
function MethodFilm({mobile}: {mobile: boolean}) {
  const frame = useCurrentFrame();
  return <AbsoluteFill><MethodJourneyArtwork frame={frame} mobile={mobile}/></AbsoluteFill>;
}
export default function MethodJourneyRuntime({playerRef, mobile}: {playerRef: RefObject<PlayerRef | null>; mobile: boolean}) {
  return <Player ref={playerRef} component={MethodFilm} inputProps={{mobile}} durationInFrames={METHOD_FRAMES} fps={30} compositionWidth={850} compositionHeight={720} controls={false} autoPlay={false} loop={false} clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} initiallyMuted style={{width:'100%',height:'100%'}}/>;
}
