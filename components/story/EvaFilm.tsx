'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { AbsoluteFill, Img, staticFile, interpolate, useCurrentFrame, useVideoConfig, useRemotionEnvironment } from 'remotion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createStoryScrollPainter, type StoryScrollDriver } from '@/lib/story-scroll-driver';
import { installStoryScrollCompositor } from '@/lib/story-scroll-compositor';
import { TrackedRunner } from './TrackedRunner';
import type { SignalLanguage } from '@/lib/runner-signals';
import { AnalogType } from './AnalogType';
import { HeroIntro } from './HeroIntro';
import { heroLayout } from '@/lib/hero-layout';
import { storyMotion } from '@/lib/story-motion';
import {TassoProcess} from './TassoProcess';
export const DURATION = 981;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const range = (f: number, a: number, b: number, x: number, y: number) => interpolate(f, [a, b], [x, y], clamp);
export function EvaFilm({ ambientRunner = true, onRunnerBlocked, language = 'es', onSignalsReady, signalsImmediate = false, arrivalEnabled = false, onArrivalUnavailable, scrollDriver }: {
    ambientRunner?: boolean;
    onRunnerBlocked?: () => void;
    language?: SignalLanguage;
    onSignalsReady?: () => void;
    signalsImmediate?: boolean;
    arrivalEnabled?: boolean;
    onArrivalUnavailable?: () => void;
    scrollDriver?: StoryScrollDriver;
} = {}) {
    const __site = useSiteLanguage();
    const f = useCurrentFrame();
    const { width: w, height: h } = useVideoConfig();
    const environment = useRemotionEnvironment();
    const still = environment.isRendering || environment.isStudio;
    const mobile = w <= 700;
    const pad = mobile ? 24 : 48;
    const nativeScroll = scrollDriver && !still ? scrollDriver : undefined;
    const root = useRef<HTMLDivElement>(null), nativePainter = useRef<ReturnType<typeof createStoryScrollPainter> | null>(null);
    const [runnerActive, setRunnerActive] = useState((nativeScroll?.current ?? f) < 200);
    const renders = useRef(0);
    renders.current++;
    const travel = range(f, 45, 190, 0, 1);
    const runnerX = travel * w * 1.05;
    const motion = storyMotion(f);
    const scene = f < 230 ? 'Vivir' : f < 490 ? 'Conocer' : f < 715 ? 'Entender' : 'Seguir';
    const track = useRef<HTMLDivElement>(null);
    const [overflow, setOverflow] = useState(w);
    useEffect(() => { const el = track.current; if (!el)
        return; const measure = () => setOverflow(Math.max(0, el.scrollWidth - (w - pad * 2))); measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect(); }, [w, pad]);
    const hero = heroLayout(w, h);
    useLayoutEffect(() => {
        if (!nativeScroll || !root.current)
            return;
        const journey = root.current.closest<HTMLElement>('.scroll-journey');
        const compositor = journey ? installStoryScrollCompositor(root.current, journey, { width: w, height: h, overflow, top: journey.getBoundingClientRect().top + window.scrollY, span: journey.offsetHeight - h }) : null;
        const paint = createStoryScrollPainter(root.current, compositor?.owned);
        nativePainter.current = paint;
        root.current.dataset.scrollEngine = compositor ? 'compositor-timeline' : 'native-transforms';
        let heroActive = nativeScroll.current < 200;
        const update = (value: number) => { paint(value, w, h, overflow); const next = value < 200; if (next !== heroActive) {
            heroActive = next;
            setRunnerActive(next);
        } };
        update(nativeScroll.current);
        setRunnerActive(heroActive);
        const stop = nativeScroll.subscribe(update);
        return () => { stop(); compositor?.dispose(); nativePainter.current = null; };
    }, [nativeScroll, w, h, overflow]);
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
    return <AbsoluteFill ref={root} data-film-renders={renders.current} data-scroll-engine={nativeScroll ? 'native-transforms' : 'remotion'} data-rendered-frame={f} data-scene={scene} style={{ background: '#0b1010', color: '#f3f0e8', fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden' }}>
  <AbsoluteFill data-layer="human" style={{ overflow: 'hidden', translate: `0 ${motion.humanY * h}px`, visibility: Math.abs(motion.humanY) >= 1 ? 'hidden' : 'visible', willChange: Math.abs(motion.humanY) < 1 ? 'translate' : 'auto' }}>
   <div data-layer="runner-plane" style={{ position: 'absolute', left: '50%', top: hero.runnerTop, width: hero.runnerWidth, height: hero.runnerHeight, translate: `calc(-50% + ${runnerX}px) 0`, scale: 1 + travel * .08, willChange: f < 200 ? 'translate, scale' : 'auto' }}><TrackedRunner width={hero.runnerWidth} height={hero.runnerHeight} viewportWidth={w} viewportHeight={h} top={hero.runnerTop} saludTop={hero.saludTop} enabled={ambientRunner} active={nativeScroll ? runnerActive : f < 200} language={__site.locale} onPlaybackBlocked={onRunnerBlocked} onSignalsReady={onSignalsReady} signalsImmediate={signalsImmediate} arrivalEnabled={arrivalEnabled} onArrivalUnavailable={onArrivalUnavailable}/></div>
   <div data-hero-reveal="headline" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><HeroIntro width={hero.introWidth} height={hero.introHeight} style={{ position: 'absolute', left: pad, top: hero.introTop, translate: `${range(f, 45, 160, 0, -w * 1.05)}px 0` }}/>
   <ScrollSalud scrollDriver={nativeScroll} text={__site.t("salud.")} frame={Math.min(f, 160)} width={hero.saludWidth} height={hero.saludHeight} style={{ position: 'absolute', right: pad, top: hero.saludTop, translate: `${range(f, 45, 160, 0, w * 1.05)}px 0` }}/>
   {__site.t(!mobile && <p className="hero-support" data-hero-support style={{ position: 'absolute', left: pad, top: hero.supportTop, opacity: range(f, 20, 100, 1, 0) }}>{__site.t("Para lo que disfrutas.")}<br />{__site.t("Y lo que est\u00E1 por venir.")}</p>)}</div>
  </AbsoluteFill>
  <AbsoluteFill data-layer="product-scene" style={{ background: '#f3f0e8', color: '#171b18', overflow: 'hidden', translate: `0 ${motion.productY * h}px`, visibility: Math.abs(motion.productY) >= 1 ? 'hidden' : 'visible', willChange: Math.abs(motion.productY) < 1 ? 'translate' : 'auto' }}>
   <TassoProcess frame={f} scrollDriver={nativeScroll}/>
  </AbsoluteFill>
  <AbsoluteFill data-layer="insight-scene" style={{ background: '#e9a067', color: '#22271f', overflow: 'hidden', translate: `0 ${motion.insightY * h}px`, visibility: Math.abs(motion.insightY) >= 1 ? 'hidden' : 'visible', willChange: Math.abs(motion.insightY) < 1 ? 'translate' : 'auto' }}>
   <div style={{ position: 'absolute', top: mobile ? '19%' : '16%', left: pad, fontSize: mobile ? 51 : w * .072, letterSpacing: '-.065em', lineHeight: .98 }}>{__site.t("Tus datos.")}<br /><span style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{__site.t("Con contexto.")}</span></div>
   <div ref={track} data-layer="insight-track" data-overflow={overflow} style={{ position: 'absolute', left: pad, top: mobile ? '46%' : '47%', display: 'flex', gap: pad, width: 'max-content', translate: `${-range(f, 590, 635, 0, overflow)}px 0` }}>
    <div style={{ width: w - pad * 2, display: 'flex', alignItems: 'center', gap: mobile ? 22 : 55 }}><span style={{ fontSize: mobile ? Math.min(w * .37, 155) : w * .22, letterSpacing: '-.08em', lineHeight: .8 }}>{__site.t("15")}</span><span style={{ fontSize: mobile ? 22 : 35, maxWidth: 240, lineHeight: 1.05 }}>{__site.t("biomarcadores.")}<br />{__site.t("Cada")}<br />{__site.t("90 d\u00EDas.")}</span></div>
    <div style={{ width: w - pad * 2, fontSize: mobile ? 25 : 42, lineHeight: 1.12 }}>{__site.t("Tus resultados, explicados.")}<br /><span style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{__site.t("Tu evoluci\u00F3n, en perspectiva.")}</span><p style={{ fontSize: mobile ? 16 : 18, lineHeight: 1.4, maxWidth: 420, marginTop: 25 }}>{__site.t("Compara tus lecturas a lo largo del tiempo y observa c\u00F3mo cambian tus biomarcadores.")}</p></div>
   </div>
  </AbsoluteFill>
  <AbsoluteFill data-layer="return-to-life" style={{ background: '#0b1010', overflow: 'hidden', translate: `0 ${motion.lifeY * h}px`, visibility: Math.abs(motion.lifeY) >= 1 ? 'hidden' : 'visible', willChange: Math.abs(motion.lifeY) < 1 ? 'translate' : 'auto' }}>
   <Img data-motion="return-image" data-motion-preload="return" src={staticFile("art/stretch.jpg")} loading="eager" decoding="async" style={{ position: 'absolute', height: '100%', width: mobile ? '100%' : '60%', left: mobile ? '0' : '22%', objectFit: 'cover', maskImage: 'radial-gradient(ellipse,black 15%,transparent 74%)', scale: range(f, 710, 840, 1.18, 1) }}/>
   <div data-motion="return-title" style={{ position: 'absolute', left: pad, top: mobile ? '27%' : '26%', fontSize: mobile ? w * .18 : w * .115, letterSpacing: '-.07em', lineHeight: .97, translate: `0 ${range(f, 735, 800, 60, 0)}px` }}>{__site.t("Y volver")}<br /><span style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{__site.t("a la vida.")}</span></div>
   <p style={{ position: 'absolute', right: pad, bottom: mobile ? 135 : 110, fontSize: mobile ? 18 : 23, lineHeight: 1.3, maxWidth: mobile ? 230 : 310 }}>{__site.t("Cuidarte tambi\u00E9n es hacer")}<br />{__site.t("espacio para lo que disfrutas.")}</p>
  </AbsoluteFill>
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
