'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { EvaWordmark } from '@/components/story/EvaWordmark';
import { AnalogType } from './AnalogType';
import {DiscoverProblem, ReportUnderstanding, reportChapterId} from './ReportUnderstanding';
import { HeroIntro } from './HeroIntro';
import { Player, type PlayerRef } from '@remotion/player';
import { type CSSProperties, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EvaFilm, DURATION } from './EvaFilm';
import { HealthEditorial } from './HealthEditorial';
import { BiomarkerGallery } from './BiomarkerGallery';
import { BusinessOffer } from './BusinessOffer';
import { BusinessNavigation } from './BusinessNavigation';
import {LanguageSwitch} from '@/components/site/SiteLanguage';
import { BusinessFooter } from './BusinessFooter';
import {reportUnderstanding} from '@/lib/site-content/report-understanding';
import { glowRunner } from '@/lib/design';
import { SignalPassage } from './SignalPassage';
import { storyMotion } from '@/lib/story-motion';
import {TassoHomeVideo} from './TassoHomeVideo';
import {TassoFilmSummary} from './TassoFilmProcess';
import {TassoFilmTranscript} from './TassoFilmTranscript';
import { createStoryScrollDriver } from '@/lib/story-scroll-driver';
import {HERO_ENTRANCE_RATE, RUNNER_EXIT_FRAME, runnerExitFrameAtProgress} from '@/lib/story-scroll-timing';
import {StoryScenePassage} from './StoryScenePassage';
import {RangeProofSection} from './RangeProofSection';
const heroEntranceStyle = {'--hero-entrance-rate': HERO_ENTRANCE_RATE} as CSSProperties;
const ResultsContent = memo(BiomarkerGallery), EditorialContent = memo(HealthEditorial), OfferContent = memo(BusinessOffer), SignalContent = memo(SignalPassage);
function readStoryPosition() {
    const candidates = ['volver-a-la-vida', 'una-perspectiva', 'una-senal', 'biomarcadores', 'kit-inicial', 'recogida-en-casa', reportChapterId];
    const active = candidates.map(id => document.getElementById(id)).find(element => element && element.getBoundingClientRect().top <= window.innerHeight * .5);
    const root = active ?? document.querySelector('.hero-entrance > .scroll-journey');
    const film = root?.querySelector<HTMLElement>('[data-rendered-frame], [data-body-signal-frame]');
    return {section: active?.id ?? 'opening', frame: Number(film?.dataset.renderedFrame ?? film?.dataset.bodySignalFrame ?? 0), scrollY: window.scrollY, reducedMotion: !!document.querySelector('.calm-hero')};
}

export function ScrollStory({tassoVariant = 'clean'}: {tassoVariant?: 'clean' | 'labelled'} = {}) {
    const __site = useSiteLanguage();
    const problemCopy = reportUnderstanding[__site.locale];
    const section = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null), player = useRef<PlayerRef>(null), heroCta = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{
        width: number;
        height: number;
        top: number;
    } | null>(null);
    const [frame, setFrame] = useState(0);
    const [openingVisible, setOpeningVisible] = useState(true);
    const [calm, setCalm] = useState(false);
    const [runnerPaused, setRunnerPaused] = useState(false);
    const entrance = useRef<HTMLElement>(null);
    const scrollDriver = useMemo(() => createStoryScrollDriver(), []);
    const [entry, setEntry] = useState<'pending' | 'watching' | 'reveal' | 'skip'>('pending');
    const reveal = useCallback(() => setEntry(current => current === 'skip' ? 'skip' : 'reveal'), []);
    const skipEntry = useCallback(() => { if (entrance.current)
        entrance.current.dataset.heroEntrance = 'skip'; setEntry('skip'); }, []);
    const filmProps = useMemo(() => ({ language: __site.locale, scrollDriver, tassoVariant, externalTasso: true, sceneMode: 'opening' as const, scrollWindow: [0, RUNNER_EXIT_FRAME] as const, scrollGeometry: size ? {top: size.top, span: size.height} : undefined, ambientRunner: !runnerPaused, onRunnerBlocked: () => { setRunnerPaused(true); skipEntry(); }, onSignalsReady: reveal, signalsImmediate: entry === 'skip', arrivalEnabled: entry !== 'skip', onArrivalUnavailable: skipEntry }), [__site.locale, scrollDriver, tassoVariant, size, runnerPaused, reveal, skipEntry, entry === 'skip']);
    useEffect(() => {
        const restored = () => { if (window.scrollY > 24 || location.hash)
            skipEntry(); };
        if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.scrollY > 24 || location.hash || entrance.current?.contains(document.activeElement)) {
            skipEntry();
            return;
        }
        setEntry(current => current === 'pending' ? 'watching' : current);
        const key = (event: KeyboardEvent) => { if (['Tab', 'Enter', 'Escape', ' ', 'ArrowDown', 'PageDown', 'End'].includes(event.key))
            skipEntry(); };
        window.addEventListener('scroll', restored, { passive: true });
        window.addEventListener('pageshow', restored);
        window.addEventListener('keydown', key, true);
        // A failed media/player mount must never leave the site's navigation hidden.
        const failOpen = window.setTimeout(() => { if (['pending', 'watching'].includes(entrance.current?.dataset.heroEntrance ?? ''))
            skipEntry(); }, 12000 / HERO_ENTRANCE_RATE);
        return () => { clearTimeout(failOpen); window.removeEventListener('scroll', restored); window.removeEventListener('pageshow', restored); window.removeEventListener('keydown', key, true); };
    }, [skipEntry]);
    useEffect(() => { const mq = matchMedia('(prefers-reduced-motion: reduce)'); setCalm(mq.matches); const change = () => setCalm(mq.matches); mq.addEventListener('change', change); return () => mq.removeEventListener('change', change); }, []);
    useEffect(() => { if (calm || !stage.current)
        return;
        const el = stage.current;
        const measure = () => {
            const width = Math.round(el.clientWidth), height = Math.round(el.clientHeight);
            const top = section.current ? section.current.getBoundingClientRect().top + window.scrollY : 0;
            if (width && height) setSize(previous => previous?.width === width && previous.height === height && previous.top === top ? previous : {width, height, top});
        };
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        measure();
        return () => observer.disconnect();
    }, [calm]);
    useEffect(() => {
        if (calm || !size || !section.current || !stage.current)
            return;
        let raf = 0, last = -1, lastChrome = '';
        const update = () => {
            raf = 0;
            if (document.visibilityState !== 'visible' || !section.current || !stage.current)
                return;
            const p = Math.max(0, Math.min(1, (window.scrollY - size.top) / size.height));
            const f = runnerExitFrameAtProgress(p);
            if (f !== last) {
                scrollDriver.setFrame(f);
                const slot = heroCta.current;
                if (slot) {
                    const fade = Math.max(0, Math.min(1, (f - 20) / 70)), hidden = fade >= 1;
                    if (slot.dataset.scrollCompositor !== 'true') {
                        slot.style.opacity = String(1 - fade);
                        slot.style.transform = `translateY(${fade * 14}px)`;
                    }
                    slot.style.visibility = hidden ? 'hidden' : 'visible';
                    slot.inert = hidden;
                    slot.setAttribute('aria-hidden', String(hidden));
                }
                const m = storyMotion(f, true), h = size.height, small = size.width <= 700;
                const chrome = [m.lightAt(50 / h), m.lightAt(1 - (small ? 45 : 50) / h), m.lightAt(1 - ((small ? 75 : 41) + (f < 200 ? 22 : 5)) / h), f < 200, f < 30, f < 230 ? 0 : f < 490 ? 1 : f < 715 ? 2 : 3].join('/');
                if (chrome !== lastChrome) {
                    lastChrome = chrome;
                    setFrame(f);
                }
                ;
                last = f;
            }
        };
        const schedule = () => { if (!raf)
            raf = requestAnimationFrame(update); };
        window.addEventListener('scroll', schedule, { passive: true });
        document.addEventListener('visibilitychange', schedule);
        schedule();
        return () => { window.removeEventListener('scroll', schedule); document.removeEventListener('visibilitychange', schedule); cancelAnimationFrame(raf); };
    }, [size, calm, scrollDriver]);
    useEffect(() => {
        const root = stage.current;
        if (calm || !root) return;
        const observer = new IntersectionObserver(([entry]) => setOpeningVisible(entry.isIntersecting && entry.intersectionRatio >= .01), {threshold: [0, .01]});
        observer.observe(root);
        return () => observer.disconnect();
    }, [calm]);
    const motion = storyMotion(frame, true), height = size?.height ?? 900;
    const mobile = (size?.width ?? 1440) <= 700;
    const headerLight = motion.lightAt(50 / height), navLight = motion.lightAt(1 - (mobile ? 45 : 50) / height), noteLight = motion.lightAt(1 - ((mobile ? 75 : 41) + (frame < 200 ? 22 : 5)) / height);
    const chapter = 0;
    const navigateChapter = (index: number) => {
        const destinations = [calm ? '.calm-hero' : '.opening-runner', '#recogida-en-casa', '#kit-inicial', '#biomarcadores'];
        document.querySelector(destinations[index])?.scrollIntoView({behavior: 'instant', block: 'start'});
    };
    useEffect(() => { const ctx = (document as Document & {
        modelContext?: {
            registerTool: (tool: unknown, opts: unknown) => unknown;
        };
    }).modelContext; if (!ctx)
        return; const lifecycle = new AbortController(); const register = (tool: unknown) => { try {
        Promise.resolve(ctx.registerTool(tool, { signal: lifecycle.signal })).catch(() => { });
    }
    catch { } }; register({ name: 'read_eva_story', description: 'Read the current EVA chapter, native scroll position and rendered Remotion frame.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: readStoryPosition }); register({ name: 'navigate_eva_chapter', description: 'Navigate to the opening, collection, starting kit, or results console using the page chapter controls.', inputSchema: { type: 'object', properties: { chapter: { type: 'integer', minimum: 1, maximum: 4 } }, required: ['chapter'], additionalProperties: false }, annotations: { readOnlyHint: false }, execute: async (input: {
            chapter: number;
        }) => { if (!Number.isInteger(input.chapter) || input.chapter < 1 || input.chapter > 4)
            throw new Error('Chapter must be an integer from 1 to 4.'); navigateChapter(input.chapter - 1); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); return {chapter: input.chapter, ...readStoryPosition()}; } }); return () => lifecycle.abort(); }, [calm]);
    return <main ref={entrance} className="hero-entrance" style={heroEntranceStyle} data-story-chapter={openingVisible ? chapter + 1 : 0}  data-hero-entrance={calm ? 'skip' : entry} onFocusCapture={skipEntry}><noscript><style>{__site.t('main.hero-entrance[data-hero-entrance] [data-hero-reveal]{opacity:1!important;transform:none!important;animation:none!important;pointer-events:auto!important}main.hero-entrance[data-hero-entrance] [data-hero-reveal] *{pointer-events:auto!important}main.hero-entrance[data-hero-entrance] .hero-runner-static{opacity:1!important}')}</style></noscript><a className="skip" href={`#${reportChapterId}`}>{problemCopy.discover}</a><header data-hero-reveal="navigation" className={'masthead ' + (headerLight && !calm ? 'ink' : '')}><EvaWordmark /><div className="header-actions"><LanguageSwitch/><a className="join" href={`#${reportChapterId}`} aria-label={problemCopy.exploreLabel}>{problemCopy.explore}</a><BusinessNavigation /></div></header>
 {__site.t(!calm ? <section className="scroll-journey opening-runner" ref={section} aria-label={__site.t("La experiencia EVA")}><div className="stage" ref={stage}><div aria-hidden="true" className="film">{__site.t(size ? <Player ref={player} component={EvaFilm} inputProps={filmProps} compositionWidth={size.width} compositionHeight={size.height} durationInFrames={DURATION} fps={30} autoPlay={false} loop={false} controls={false} clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} allowFullscreen={false} moveToBeginningWhenEnded={false} initiallyMuted browserMediaControlsBehavior={{ mode: 'prevent-media-session' }} style={{ width: '100%', height: '100%', pointerEvents: 'none' }}/> : <div className="poster"><img className="hero-runner-static" src={glowRunner.poster} alt={__site.t("")} fetchPriority="high" decoding="async"/><div data-hero-reveal="headline" className="poster-title hero-static-title"><HeroIntro width={640} height={256} style={{ position: 'absolute', left: 'var(--gutter)', top: 'var(--hero-intro-top)', width: 'calc(var(--hero-intro-size)*4.6)', height: 'var(--hero-intro-height)', fontSize: 'var(--hero-intro-size)' }}/><AnalogType text={__site.t("salud.")} width={640} height={256} style={{ position: 'absolute', right: 'var(--gutter)', top: 'var(--hero-salud-top)', width: 'var(--hero-salud-width)', height: 'auto', aspectRatio: '5 / 2' }}/></div><p data-hero-reveal="support" className="hero-support hero-static-support">{problemCopy.heroLead[0]}<br />{problemCopy.heroLead[1]}</p></div>)}</div><div className="hero-kit-slot" ref={heroCta}><div data-hero-reveal="action"><DiscoverProblem /></div></div><nav data-hero-reveal="controls" aria-label={__site.t("Cap\u00EDtulos de la experiencia")} className={'chapter-nav ' + (navLight ? 'ink' : '')}>{__site.t(['Vivir', 'Conocer', 'Entender', 'Seguir'].map((n, i) => <button key={n} onClick={() => navigateChapter(i)} aria-current={chapter === i ? 'step' : undefined}><small>{__site.t("0")}{__site.t(i + 1)}</small><span>{__site.t(n)}</span><i style={{ scale: `${chapter === i ? 1 : .12} 1` }}/></button>))}</nav><div data-hero-reveal="controls" className={'stage-note ' + (noteLight ? 'ink' : '')}>{__site.t(frame < 200 && <button className="runner-pause" aria-pressed={runnerPaused} onClick={() => setRunnerPaused(!runnerPaused)}>{__site.t(runnerPaused ? 'Reanudar imagen' : 'Pausar imagen')}</button>)}</div></div><div className="sr-only"><h1>{__site.t("Conoce tu salud.")}</h1><p>{__site.t("Los indicadores del corredor presentan LDL, fructosamina y hs-CRP: colesterol «malo», glucosa e inflamación. Son ejemplos de los marcadores incluidos en el kit.")}</p><p>{__site.t("Recogida de muestra en casa y análisis en laboratorio. 13 biomarcadores para entender tus resultados y orientar tu siguiente paso.")}</p></div></section> : <section className="calm-hero"><img className="hero-runner-static" src={glowRunner.poster} alt={__site.t("Figura corriendo, reinterpretada en luz \u00E1mbar y azul")}/><h1 className="hero-static-title" aria-label={__site.t("Conoce tu salud.")}><HeroIntro width={640} height={256} style={{ position: 'absolute', left: 'var(--gutter)', top: 'var(--hero-intro-top)', width: 'calc(var(--hero-intro-size)*4.6)', height: 'var(--hero-intro-height)', fontSize: 'var(--hero-intro-size)' }}/><AnalogType text={__site.t("salud.")} width={640} height={256} style={{ position: 'absolute', right: 'var(--gutter)', top: 'var(--hero-salud-top)', width: 'var(--hero-salud-width)', height: 'auto', aspectRatio: '5 / 2' }}/></h1><p className="hero-support hero-static-support">{problemCopy.heroLead[0]}<br />{problemCopy.heroLead[1]}</p><DiscoverProblem /></section>)}
 <ReportUnderstanding calm={calm}/>
 <div id="recogida-en-casa" className="collection-after-problem">
   {calm ? <TassoFilmSummary/> : <><TassoHomeVideo variant={tassoVariant}/><div className="sr-only"><TassoFilmTranscript/></div></>}
 </div>
 <StoryScenePassage kind="kit" calm={calm}/>
 <RangeProofSection calm={calm}/>
 <ResultsContent calm={calm}/>
 <SignalContent calm={calm}/>
 <EditorialContent calm={calm}/>
 <OfferContent />
 <BusinessFooter calm={calm} onCalmChange={v => { setCalm(v); window.scrollTo({ top: 0, behavior: 'instant' }); }}/>
 </main>;
}
