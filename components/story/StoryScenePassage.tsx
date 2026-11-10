'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {Player} from '@remotion/player';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {createStoryScrollDriver} from '@/lib/story-scroll-driver';
import {KIT_SCENE_WINDOW, LIFE_SCENE_WINDOW, STORY_SCROLL_HEIGHT_SVH, storyFrameAtProgress, storyProgressAtFrame} from '@/lib/story-scroll-timing';
import {kitInsightCopy} from '@/lib/site-content/kit-insight-copy';
import {EvaFilm, DURATION} from './EvaFilm';
import './story-scene-passage.css';

type Geometry = {width: number; height: number; top: number; span: number};

/** The original authored scene, placed in document flow with its own scroll window. */
export function StoryScenePassage({kind, calm = false}: {kind: 'kit' | 'life'; calm?: boolean}) {
  const {locale, t} = useSiteLanguage();
  const copy = kitInsightCopy[locale];
  const sceneWindow = kind === 'kit' ? KIT_SCENE_WINDOW : LIFE_SCENE_WINDOW;
  const start = storyProgressAtFrame(sceneWindow[0]), end = storyProgressAtFrame(sceneWindow[1]);
  const driver = useMemo(() => createStoryScrollDriver(sceneWindow[0]), [sceneWindow]);
  const section = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const id = kind === 'kit' ? 'kit-inicial' : 'volver-a-la-vida';

  useEffect(() => {
    const root = section.current, surface = stage.current;
    if (calm || !root || !surface) return;
    let top = 0, span = 1, raf = 0;
    const update = () => {
      raf = 0;
      const progress = Math.max(0, Math.min(1, (window.scrollY - top) / span));
      driver.setFrame(storyFrameAtProgress(start + progress * (end - start)));
    };
    const measure = () => {
      top = root.getBoundingClientRect().top + window.scrollY;
      span = Math.max(1, root.offsetHeight - surface.clientHeight);
      const next = {width: surface.clientWidth, height: surface.clientHeight, top, span};
      if (next.width && next.height) setGeometry(previous => previous && Object.keys(next).every(key => previous[key as keyof Geometry] === next[key as keyof Geometry]) ? previous : next);
      update();
    };
    const schedule = () => {if (!raf) raf = requestAnimationFrame(update);};
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    if (root.parentElement) observer.observe(root.parentElement);
    measure();
    window.addEventListener('scroll', schedule, {passive: true});
    return () => {observer.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', schedule);};
  }, [calm, driver, start, end]);

  const inputProps = useMemo(() => ({sceneMode: kind === 'kit' ? 'insight' as const : 'life' as const, scrollDriver: driver, scrollWindow: sceneWindow, scrollGeometry: geometry ?? undefined, ambientRunner: false}), [kind, driver, sceneWindow, geometry]);
  const narrative = kind === 'kit' ? <><h2 id={id + '-title'}>{copy.heading.join(' ')}</h2><p>13 {copy.countLabel.join(' ')}</p><h3>{copy.title}</h3><p>{copy.intro}</p><ul>{copy.markers.map(marker => <li key={marker}>{marker}</li>)}</ul></> : <><h2 id={id + '-title'}>{t('Y volver')} <em>{t('a la vida.')}</em></h2><p>{t('Cuidarte también es hacer')} {t('espacio para lo que disfrutas.')}</p></>;
  if (calm) return <section id={id} className={'story-scene-summary ' + (kind === 'kit' ? 'kit-scene-summary' : 'life-scene-summary')} aria-labelledby={id + '-title'}>{kind === 'life' && <img src="/art/stretch.jpg" alt="" loading="lazy"/>}<div>{narrative}</div></section>;

  return <section id={id} className={'scroll-journey story-scene-passage ' + kind} style={{height: `${100 + (STORY_SCROLL_HEIGHT_SVH - 100) * (end - start)}svh`}} ref={section} aria-labelledby={id + '-title'}>
    <div className="stage" ref={stage}><div aria-hidden="true" className="film">{geometry && <Player component={EvaFilm} inputProps={inputProps} compositionWidth={geometry.width} compositionHeight={geometry.height} durationInFrames={DURATION} fps={30} autoPlay={false} controls={false} clickToPlay={false} spaceKeyToPlayOrPause={false} doubleClickToFullscreen={false} allowFullscreen={false} initiallyMuted style={{width: '100%', height: '100%', pointerEvents: 'none'}}/>}</div></div>
    <div className="sr-only">{narrative}</div>
  </section>;
}
