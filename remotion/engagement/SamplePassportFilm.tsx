import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SamplePassportArtwork} from './SamplePassportArtwork';
export {PASSPORT_FPS, PASSPORT_FRAMES} from './SamplePassportArtwork';

export default function SamplePassportFilm() {
  const frame = useCurrentFrame();
  return <AbsoluteFill><SamplePassportArtwork frame={frame}/></AbsoluteFill>;
}
