'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Player} from '@remotion/player';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {createStoryScrollDriver} from '@/lib/story-scroll-driver';
import {KIT_SCENE_WINDOW, LIFE_SCENE_WINDOW, STORY_SCROLL_HEIGHT_SVH, storyFrameAtProgress, storyProgressAtFrame} from '@/lib/story-scroll-timing';
import {kitInsightCopy} from '@/lib/site-content/kit-insight-copy';
import {lifePassageCopy} from '@/lib/site-content/life-passage-copy';
import {KIT_SCROLL_INPUT_END, KIT_SCROLL_HEIGHT_SVH} from '@/lib/kit-scroll-motion';
import {createKitRevealPlayback, KIT_REVEAL_DURATION_MS, type KitRevealInput} from '@/lib/kit-reveal-playback';
import {EvaFilm, DURATION} from './EvaFilm';
import {KitMarkerIndex} from './KitMarkerIndex';
import './story-scene-passage.css';

type Geometry = {width: number; height: number; top: number; span: number};

/** The original authored scene, placed in document flow with its own scroll window. */
export function StoryScenePassage({kind, calm = false}: {kind: 'kit' | 'life'; calm?: boolean}) {
  const {locale} = useSiteLanguage();
  const copy = kitInsightCopy[locale];
  const life = lifePassageCopy[locale];
  const sceneWindow = kind === 'kit' ? KIT_SCENE_WINDOW : LIFE_SCENE_WINDOW;
  const start = storyProgressAtFrame(sceneWindow[0]), end = storyProgressAtFrame(sceneWindow[1]);
  // Only this passage uses the longer kit clock; the original film/life clock stays intact.
  const driver = useMemo(() => createStoryScrollDriver(kind === 'kit' ? 0 : sceneWindow[0]), [kind, sceneWindow]);
  const section = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [shortViewport, setShortViewport] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
  const [layoutRevision, setLayoutRevision] = useState(0);
  const staticLayout = calm || (kind === 'kit' && (shortViewport || contentOverflow));
  const id = kind === 'kit' ? 'kit-inicial' : 'volver-a-la-vida';
  const handleKitOverflow = useCallback(() => setContentOverflow(true), []);
  const playbackFrame = useRef(0);
  const playback = useMemo(() => kind === 'kit' ? createKitRevealPlayback({
    render: clock => driver.setFrame(clock),
    observe: state => {
      const element = section.current;
      if (!element) return;
      const values = {
        kitScrollClock: state.rawClock.toFixed(3), kitPresentationClock: state.presentationClock.toFixed(3),
        kitRevealState: state.phase, kitRevealPausedFrom: state.pausedFrom,
        kitTransitionProgress: state.transitionProgress.toFixed(4), kitTransitionTarget: String(state.transitionTarget),
        kitTransitionDirection: state.transitionDirection, kitTransitionMs: state.transitionMs.toFixed(1),
        kitTransitionDurationMs: String(KIT_REVEAL_DURATION_MS), kitTransitionInput: state.inputSource,
        kitRevealActive: String(state.active),
      };
      for (const [key, value] of Object.entries(values)) if (element.dataset[key] !== value) element.dataset[key] = value;
    },
  }) : null, [kind, driver]);
  const wakePlayback = useCallback(() => {
    if (!playback?.needsFrame) {cancelAnimationFrame(playbackFrame.current); playbackFrame.current = 0; return;}
    if (playbackFrame.current) return;
    const tick = (now: number) => {
      playbackFrame.current = 0;
      playback.tick(now);
      if (playback.needsFrame) playbackFrame.current = requestAnimationFrame(tick);
    };
    playbackFrame.current = requestAnimationFrame(tick);
  }, [playback]);
  const syncPlayback = useCallback((input: Partial<KitRevealInput>, scrollEvent = true) => {
    playback?.update(input, performance.now(), scrollEvent);
    wakePlayback();
  }, [playback, wakePlayback]);

  useEffect(() => {
    if (!playback) return;
    const surface = stage.current;
    if (staticLayout || !surface) {syncPlayback({enabled: false, stageVisible: false}, false); return;}
    syncPlayback({enabled: true, documentVisible: document.visibilityState !== 'hidden'}, false);
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      const ratio = entry ? entry.intersectionRect.height / Math.max(1, Math.min(entry.boundingClientRect.height, window.innerHeight)) : 0;
      syncPlayback({stageVisible: ratio >= .85}, false);
    }, {threshold: [0, .1, .85, 1]});
    observer.observe(surface);
    const visibility = () => syncPlayback({documentVisible: document.visibilityState !== 'hidden'}, false);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      observer.disconnect(); document.removeEventListener('visibilitychange', visibility);
      syncPlayback({enabled: false, stageVisible: false}, false);
    };
  }, [playback, staticLayout, layoutRevision, syncPlayback]);

  useEffect(() => () => {cancelAnimationFrame(playbackFrame.current); playbackFrame.current = 0;}, [playback]);


  useEffect(() => {
    setContentOverflow(false);
    if (kind !== 'kit') return;
    const reset = () => {
      // Mounted stages already have a ResizeObserver, including stable svh on phones.
      if (stage.current) return;
      // A resized flow fallback must remount against fresh dimensions, not its old film.
      setGeometry(null);
      setContentOverflow(false);
      setLayoutRevision(revision => revision + 1);
    };
    window.addEventListener('resize', reset, {passive: true});
    return () => window.removeEventListener('resize', reset);
  }, [kind, locale]);

  useEffect(() => {
    if (kind !== 'kit' || calm) return;
    // Try the compact measured composition on ordinary laptop/phone sizes.
    // Only genuinely short windows bypass the pinned sequence before measurement.
    const query = matchMedia('(max-width: 700px) and (max-height: 600px), (min-width: 701px) and (max-height: 480px)');
    const update = () => setShortViewport(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [kind, calm]);

  useEffect(() => {
    const root = section.current, surface = stage.current;
    if (staticLayout || !root || !surface) return;
    let top = 0, span = 1, raf = 0;
    const update = (scrollEvent = true) => {
      raf = 0;
      const progress = Math.max(0, Math.min(1, (window.scrollY - top) / span));
      if (kind === 'kit') syncPlayback({rawClock: progress * KIT_SCROLL_INPUT_END}, scrollEvent);
      else driver.setFrame(storyFrameAtProgress(start + progress * (end - start)));
    };
    const measure = () => {
      top = root.getBoundingClientRect().top + window.scrollY;
      span = Math.max(1, root.offsetHeight - surface.clientHeight);
      const next = {width: surface.clientWidth, height: surface.clientHeight, top, span};
      if (next.width && next.height) setGeometry(previous => previous && Object.keys(next).every(key => previous[key as keyof Geometry] === next[key as keyof Geometry]) ? previous : next);
      update(false);
    };
    const schedule = () => {if (!raf) raf = requestAnimationFrame(() => update());};
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    if (root.parentElement) observer.observe(root.parentElement);
    measure();
    window.addEventListener('scroll', schedule, {passive: true});
    return () => {observer.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', schedule);};
  }, [kind, locale, staticLayout, layoutRevision, driver, start, end, syncPlayback]);

  const inputProps = useMemo(() => ({sceneMode: kind === 'kit' ? 'insight' as const : 'life' as const, kitLocalClock: kind === 'kit', kitTimedReveal: kind === 'kit', onKitLayoutOverflow: kind === 'kit' ? handleKitOverflow : undefined, scrollDriver: driver, scrollWindow: sceneWindow, scrollGeometry: geometry ?? undefined, ambientRunner: false}), [kind, handleKitOverflow, driver, sceneWindow, geometry]);
  const narrative = kind === 'kit' ? <><p className="kit-eyebrow">{copy.eyebrow}</p><h2 id={id + '-title'}>{copy.heading[0]}<br/><em>{copy.heading[1]}</em></h2><p className="kit-summary-count"><strong>13</strong><span>{copy.countLabel.join(' ')}</span></p><h3 className="kit-static-index-title">{copy.stageHeadings[1].join(' ')}</h3><p className="kit-summary-intro">{copy.intro}</p><p className="kit-static-clarity">{copy.stageHeadings[2].join(' ')}</p><KitMarkerIndex copy={copy} showTitle={false}/></> : <><h2 id={id + '-title'}>{life.heading[0]} <em>{life.heading[1]}</em></h2><p>{life.support.join(' ')}</p></>;
  if (staticLayout) return <section id={id} className={'story-scene-summary ' + (kind === 'kit' ? 'kit-scene-summary' : 'life-scene-summary')} data-kit-layout={kind === 'kit' ? calm ? 'reduced' : 'flow' : undefined} data-kit-reveal-state={kind === 'kit' ? 'complete' : undefined} data-kit-reveal-active={kind === 'kit' ? 'false' : undefined} data-kit-presentation-clock={kind === 'kit' ? 300 : undefined} aria-labelledby={id + '-title'}>{kind === 'life' && <img src="/art/stretch.jpg" alt="" loading="lazy"/>}<div>{narrative}</div></section>;

  return <section id={id} className={'scroll-journey story-scene-passage ' + kind} data-kit-layout={kind === 'kit' ? 'animated' : undefined} data-kit-scroll-clock={kind === 'kit' ? '0' : undefined} data-kit-presentation-clock={kind === 'kit' ? '0' : undefined} data-kit-reveal-state={kind === 'kit' ? 'idle' : undefined} data-kit-transition-progress={kind === 'kit' ? '0' : undefined} data-kit-transition-target={kind === 'kit' ? '0' : undefined} data-kit-transition-direction={kind === 'kit' ? 'none' : undefined} data-kit-transition-ms={kind === 'kit' ? '0' : undefined} data-kit-transition-duration-ms={kind === 'kit' ? KIT_REVEAL_DURATION_MS : undefined} data-kit-transition-input={kind === 'kit' ? 'init' : undefined} data-kit-reveal-active={kind === 'kit' ? 'false' : undefined} style={{height: `${kind === 'kit' ? KIT_SCROLL_HEIGHT_SVH : 100 + (STORY_SCROLL_HEIGHT_SVH - 100) * (end - start)}svh`}} ref={section} aria-labelledby={id + '-title'}>
    <div className="stage" ref={stage}><div aria-hidden="true" className="film">{geometry && <Player component={EvaFilm} inputProps={inputProps} compositionWidth={geometry.width} compositionHeight={geometry.height} durationInFrames={DURATION} fps={30} autoPlay={false} controls={false} clickToPlay={false} spaceKeyToPlayOrPause={false} doubleClickToFullscreen={false} allowFullscreen={false} initiallyMuted style={{width: '100%', height: '100%', pointerEvents: 'none'}}/>}</div></div>
    <div className="sr-only">{narrative}</div>
  </section>;
}
