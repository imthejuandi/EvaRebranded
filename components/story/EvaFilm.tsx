'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig, useRemotionEnvironment } from 'remotion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createStoryScrollPainter, type StoryScrollDriver } from '@/lib/story-scroll-driver';
import { installStoryScrollCompositor } from '@/lib/story-scroll-compositor';
import {createKitScrollPainter} from '@/lib/kit-scroll-painter';
import {installKitScrollCompositor} from '@/lib/kit-scroll-compositor';
import {kitScrollState} from '@/lib/kit-scroll-motion';
import { TrackedRunner } from './TrackedRunner';
import type { SignalLanguage } from '@/lib/runner-signals';
import { AnalogType } from './AnalogType';
import { HeroIntro } from './HeroIntro';
import { heroLayout } from '@/lib/hero-layout';
import { storyMotion } from '@/lib/story-motion';
import {TassoFilmProcess} from './TassoFilmProcess';
import {storyProgressAtFrame} from '@/lib/story-scroll-timing';
import {kitInsightCopy} from '@/lib/site-content/kit-insight-copy';
import {KitMarkerIndex} from './KitMarkerIndex';
import './story-scene-passage.css';
export const DURATION = 981;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const range = (f: number, a: number, b: number, x: number, y: number) => interpolate(f, [a, b], [x, y], clamp);
export function EvaFilm({ ambientRunner = true, onRunnerBlocked, language = 'es', onSignalsReady, signalsImmediate = false, arrivalEnabled = false, onArrivalUnavailable, scrollDriver, tassoVariant = 'clean', externalTasso = false, sceneMode = 'all', scrollWindow, scrollGeometry, kitLocalClock = false, onKitLayoutOverflow }: {
    ambientRunner?: boolean;
    onRunnerBlocked?: () => void;
    language?: SignalLanguage;
    onSignalsReady?: () => void;
    signalsImmediate?: boolean;
    arrivalEnabled?: boolean;
    onArrivalUnavailable?: () => void;
    scrollDriver?: StoryScrollDriver;
    tassoVariant?: 'clean' | 'labelled';
    externalTasso?: boolean;
    sceneMode?: 'all' | 'opening' | 'insight' | 'life';
    scrollWindow?: readonly [number, number];
    scrollGeometry?: {top: number; span: number};
    kitLocalClock?: boolean;
    onKitLayoutOverflow?: () => void;
} = {}) {
    const __site = useSiteLanguage();
    const kit = kitInsightCopy[__site.locale];
    const f = useCurrentFrame();
    const { width: w, height: h } = useVideoConfig();
    const environment = useRemotionEnvironment();
    const still = environment.isRendering || environment.isStudio;
    const mobile = w <= 700;
    const compact = mobile && h <= 620;
    const startProgress = storyProgressAtFrame(scrollWindow?.[0] ?? 0);
    const endProgress = storyProgressAtFrame(scrollWindow?.[1] ?? 980);
    const pad = mobile ? 24 : 48;
    const nativeScroll = scrollDriver && !still ? scrollDriver : undefined;
    const localKit = kitLocalClock && sceneMode === 'insight';
    const kitPose = localKit ? kitScrollState(nativeScroll?.current ?? f, w, 0) : null;
    const poseFrame = kitPose?.poseFrame ?? f;
    const root = useRef<HTMLDivElement>(null), nativePainter = useRef<ReturnType<typeof createStoryScrollPainter> | null>(null);
    const [runnerActive, setRunnerActive] = useState(!localKit && (nativeScroll?.current ?? f) < 200);
    const renders = useRef(0);
    renders.current++;
    const travel = range(f, 45, 190, 0, 1);
    const runnerX = travel * w * 1.05;
    const motion = storyMotion(poseFrame);
    const scene = localKit ? 'Entender' : f < 230 ? 'Vivir' : f < 490 ? 'Conocer' : f < 715 ? 'Entender' : 'Seguir';
    const track = useRef<HTMLDivElement>(null);
    const [overflow, setOverflow] = useState(w);
    useEffect(() => { const el = track.current; if (!el)
        return; const markers = el.querySelector<HTMLElement>('[data-kit-panel="markers"]'); const measure = () => {
          setOverflow(Math.max(0, el.scrollWidth - (w - pad * 2)));
          // Measure the complete, reserved subtitle layout, including while it is hidden.
          if (localKit && (el.offsetTop + el.offsetHeight > h - (mobile ? 24 : 32) || (markers && markers.scrollWidth > markers.clientWidth + 1))) onKitLayoutOverflow?.();
        }; measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect(); }, [w, h, pad, mobile, localKit, onKitLayoutOverflow]);
    const hero = heroLayout(w, h);
    useLayoutEffect(() => {
        if (!nativeScroll || !root.current)
            return;
        const journey = root.current.closest<HTMLElement>('.scroll-journey');
        const localSpan = scrollGeometry?.span ?? (journey ? journey.offsetHeight - h : 0);
        const fullSpan = localSpan / (endProgress - startProgress);
        const localTop = scrollGeometry?.top ?? (journey ? journey.getBoundingClientRect().top + window.scrollY : 0);
        const compositor = journey ? localKit
          ? installKitScrollCompositor(root.current, {width: w, overflow, top: localTop, span: localSpan})
          : installStoryScrollCompositor(root.current, journey, { width: w, height: h, overflow, top: localTop - fullSpan * startProgress, span: fullSpan }) : null;
        const paint = localKit ? createKitScrollPainter(root.current, compositor?.owned) : createStoryScrollPainter(root.current, compositor?.owned);
        nativePainter.current = paint;
        root.current.dataset.scrollEngine = compositor ? 'compositor-timeline' : 'native-transforms';
        let heroActive = !localKit && nativeScroll.current < 200;
        const update = (value: number) => { paint(value, w, h, overflow); const next = !localKit && value < 200; if (next !== heroActive) {
            heroActive = next;
            setRunnerActive(next);
        } };
        update(nativeScroll.current);
        setRunnerActive(heroActive);
        const stop = nativeScroll.subscribe(update);
        return () => { stop(); compositor?.dispose(); nativePainter.current = null; };
    }, [nativeScroll, localKit, w, h, overflow, startProgress, endProgress, scrollGeometry?.top, scrollGeometry?.span]);
    // Reapply the current pose after a coarse React state change or responsive resize.
    useLayoutEffect(() => { if (nativeScroll)
        nativePainter.current?.(nativeScroll.current, w, h, overflow); });
    useEffect(() => {
        if (still || !root.current)
            return;
        const images = Array.from(root.current.querySelectorAll<HTMLImageElement>('[data-motion-preload]'));
        for (const image of images) {
            void image.decode().then(() => { image.dataset.decodeState = 'ready'; }).catch(() => { });
        }
    }, [still]);
    return <AbsoluteFill ref={root} data-story-scene={sceneMode} data-film-renders={renders.current} data-scroll-engine={nativeScroll ? 'native-transforms' : 'remotion'} data-rendered-frame={poseFrame} data-kit-clock={kitPose?.clock} data-kit-phase={kitPose?.phase} data-scene={scene} style={{ background: '#0b1010', color: '#f3f0e8', fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden' }}>
  {(sceneMode === 'all' || sceneMode === 'opening') && <>
  <AbsoluteFill data-layer="human" style={{ overflow: 'hidden', translate: `0 ${motion.humanY * h}px`, visibility: Math.abs(motion.humanY) >= 1 ? 'hidden' : 'visible', willChange: Math.abs(motion.humanY) < 1 ? 'translate' : 'auto' }}>
   <div data-layer="runner-plane" style={{ position: 'absolute', left: '50%', top: hero.runnerTop, width: hero.runnerWidth, height: hero.runnerHeight, translate: `calc(-50% + ${runnerX}px) 0`, scale: 1 + travel * .08, willChange: f < 200 ? 'translate, scale' : 'auto' }}><TrackedRunner width={hero.runnerWidth} height={hero.runnerHeight} viewportWidth={w} viewportHeight={h} top={hero.runnerTop} saludTop={hero.saludTop} enabled={ambientRunner} active={nativeScroll ? runnerActive : f < 200} language={__site.locale} onPlaybackBlocked={onRunnerBlocked} onSignalsReady={onSignalsReady} signalsImmediate={signalsImmediate} arrivalEnabled={arrivalEnabled} onArrivalUnavailable={onArrivalUnavailable}/></div>
   <div data-hero-reveal="headline" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><HeroIntro width={hero.introWidth} height={hero.introHeight} style={{ position: 'absolute', left: pad, top: hero.introTop, translate: `${range(f, 45, 160, 0, -w * 1.05)}px 0` }}/>
   <ScrollSalud scrollDriver={nativeScroll} text={__site.t("salud.")} frame={Math.min(f, 160)} width={hero.saludWidth} height={hero.saludHeight} style={{ position: 'absolute', right: pad, top: hero.saludTop, translate: `${range(f, 45, 160, 0, w * 1.05)}px 0` }}/>
   {__site.t(!mobile && <p className="hero-support" data-hero-support style={{ position: 'absolute', left: pad, top: hero.supportTop, opacity: range(f, 20, 100, 1, 0) }}>{__site.t("Empieza gratis con tus")}<br />{__site.t("analíticas anteriores.")}</p>)}</div>
  </AbsoluteFill>
  <AbsoluteFill data-layer="product-scene" style={{ background: externalTasso ? '#000' : '#f3f0e8', color: '#171b18', overflow: 'hidden', translate: `0 ${motion.productY * h}px`, visibility: Math.abs(motion.productY) >= 1 ? 'hidden' : 'visible', willChange: Math.abs(motion.productY) < 1 ? 'translate' : 'auto' }}>
   <>{!externalTasso ? <TassoFilmProcess frame={f} scrollDriver={nativeScroll} variant={tassoVariant}/> : null}</>
  </AbsoluteFill>
  </>}
  {(sceneMode === 'all' || sceneMode === 'insight') && <AbsoluteFill className="kit-insight-scene" data-kit-mobile={mobile} data-kit-compact={compact} data-kit-short={!mobile && h < 620} data-layer="insight-scene" style={{ background: '#e9a067', color: '#22271f', overflow: 'hidden', translate: `0 ${motion.insightY * h}px`, visibility: Math.abs(motion.insightY) >= 1 ? 'hidden' : 'visible', willChange: Math.abs(motion.insightY) < 1 ? 'translate' : 'auto' }}>
   <div className="kit-scene-heading" style={{left: pad, right: pad}}><p className="kit-eyebrow">{kit.eyebrow}<span aria-hidden="true">01—13</span></p><h2 style={{fontSize: compact ? Math.min(43, w * .145) : mobile ? Math.min(54, w * .145) : Math.min(110, w * .075, h * .115)}}>{kit.heading[0]}<br /><em>{kit.heading[1]}</em></h2></div>
   <div ref={track} data-layer="insight-track" data-overflow={overflow} className="kit-insight-track" style={{left: pad, gap: pad, translate: `${-range(poseFrame, 590, 635, 0, overflow)}px 0` }}>
    <div data-kit-panel="count" className="kit-count-panel" style={{width: w - pad * 2}}><span className="kit-count-number" style={{fontSize: mobile ? Math.min(w * .43, 175) : Math.min(w * .25, 360, h * .4)}}>13</span><div className="kit-count-copy"><strong>{kit.countLabel[0]}</strong><p>{kit.countLabel.slice(1).join(' ')}</p><span className="kit-count-rule" aria-hidden="true"/></div></div>
    <div data-kit-panel="markers" style={{width: w - pad * 2}}><KitMarkerIndex copy={kit} meaningProgress={kitPose?.context} meaningOffset={kitPose?.meaningY}/></div>
   </div>
  </AbsoluteFill>}
  {(sceneMode === 'all' || sceneMode === 'life') && <AbsoluteFill data-layer={sceneMode === 'life' ? 'life-passage' : 'return-to-life'} style={{ background: '#0b1010', overflow: 'hidden', translate: `0 ${sceneMode === 'life' ? 0 : motion.lifeY * h}px`, visibility: sceneMode === 'life' || Math.abs(motion.lifeY) < 1 ? 'visible' : 'hidden', willChange: Math.abs(motion.lifeY) < 1 ? 'translate' : 'auto' }}>
   <Img data-motion="return-image" data-motion-preload="return" src={staticFile("art/stretch.jpg")} loading="eager" decoding="async" style={{ position: 'absolute', height: '100%', width: mobile ? '100%' : '60%', left: mobile ? '0' : '22%', objectFit: 'cover', maskImage: 'radial-gradient(ellipse,black 15%,transparent 74%)', scale: range(f, 710, 840, 1.18, 1) }}/>
   <div data-motion="return-title" style={{ position: 'absolute', left: pad, top: mobile ? '27%' : '26%', fontSize: mobile ? w * .18 : w * .115, letterSpacing: '-.07em', lineHeight: .97, translate: `0 ${range(f, 735, 800, 60, 0)}px` }}>{__site.t("Y volver")}<br /><span style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{__site.t("a la vida.")}</span></div>
   <p style={{ position: 'absolute', right: pad, bottom: mobile ? 135 : 110, fontSize: mobile ? 18 : 23, lineHeight: 1.3, maxWidth: mobile ? 230 : 310 }}>{__site.t("Cuidarte tambi\u00E9n es hacer")}<br />{__site.t("espacio para lo que disfrutas.")}</p>
  </AbsoluteFill>}
 </AbsoluteFill>;
}
/** Keep the analog microletters alive without rerendering all four scenes on each scroll tick. */
function ScrollSalud({ scrollDriver, ...props }: Parameters<typeof AnalogType>[0] & {
    scrollDriver?: StoryScrollDriver;
}) {
    const __site = useSiteLanguage();
    const [scanFrame, setScanFrame] = useState(0);
    useEffect(() => {
        if (!scrollDriver)
            return;
        let previous = -1;
        const update = (frame: number) => { const next = Math.floor(Math.min(frame, 160) / 9) * 9; if (next !== previous) {
            previous = next;
            setScanFrame(next);
        } };
        update(scrollDriver.current);
        return scrollDriver.subscribe(update);
    }, [scrollDriver]);
    return <AnalogType {...props} frame={scrollDriver ? scanFrame : props.frame}/>;
}
