import {BodySignalFilm} from '../components/story/BodySignalFilm';
import {BODY_SIGNAL_DURATION} from '../lib/body-signal';
import {Composition} from 'remotion';
import {EvaFilm,DURATION} from '../components/story/EvaFilm';
import {SignalFilm} from '../components/story/SignalFilm';
import {SIGNAL_DURATION} from '../lib/analog-motion';
import SamplePassportFilm, {PASSPORT_FPS, PASSPORT_FRAMES} from './engagement/SamplePassportFilm';
export const RemotionRoot=()=> <><Composition id="EvaLandscape" component={EvaFilm} durationInFrames={DURATION} fps={30} width={1440} height={900}/><Composition id="EvaPortrait" component={EvaFilm} durationInFrames={DURATION} fps={30} width={390} height={844}/><Composition id="SignalLandscape" component={SignalFilm} durationInFrames={SIGNAL_DURATION} fps={30} width={1440} height={900}/><Composition id="SignalPortrait" component={SignalFilm} durationInFrames={SIGNAL_DURATION} fps={30} width={390} height={844}/><Composition id="BodySignalLandscape" component={BodySignalFilm} durationInFrames={BODY_SIGNAL_DURATION} fps={30} width={1440} height={900}/><Composition id="BodySignalPortrait" component={BodySignalFilm} durationInFrames={BODY_SIGNAL_DURATION} fps={30} width={390} height={844}/><Composition id="SamplePassport" component={SamplePassportFilm} durationInFrames={PASSPORT_FRAMES} fps={PASSPORT_FPS} width={720} height={640}/></>;
