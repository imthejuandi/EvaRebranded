'use client';

import {useEffect, useId, useLayoutEffect, useRef} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import filmManifest from '@/lib/site-content/tasso-home-film.json';
import {tassoHomeCopy} from '@/lib/site-content/tasso-home-copy';
import type {StoryScrollDriver} from '@/lib/story-scroll-driver';
import {TassoFilmAtlasCache, tassoFilmAtlasRequest, tassoFilmPose, type TassoFilmManifest, type TassoFilmPose} from '@/lib/tasso-film-process';
import './tasso-film-process.css';

const film: TassoFilmManifest = filmManifest;
type Direction = 'clean' | 'labelled';

function ChapterPoster({index, className, preload = false, edition = 'original'}: {index: number; className?: string; preload?: boolean; edition?: 'black' | 'original'}) {
  const chapter = film.chapters[index];
  const poster = edition === 'black' ? `/art/tasso-home-video/black-smooth-v2-${chapter.id}.jpg` : chapter.poster;
  const mobilePoster = edition === 'black' ? poster : chapter.mobilePoster;
  return <picture className={className}>
    {mobilePoster ? <source media="(max-width: 700px)" srcSet={mobilePoster}/> : null}
    <img data-tasso-chapter-poster={preload ? index : undefined} src={poster}
      width={chapter.posterWidth} height={chapter.posterHeight} alt="" loading={preload ? 'eager' : 'lazy'} decoding="async"/>
  </picture>;
}

function FilmTiming({timing, qualifier}: {timing: string; qualifier: string}) {
  return <div className="tasso-film-timing"><strong>{timing}</strong><p>{qualifier}</p></div>;
}

/** Visual only: the parent keeps keyboard controls and the transcript outside its aria-hidden film. */
export function TassoFilmProcess({frame, scrollDriver, variant = 'clean'}: {frame: number; scrollDriver?: StoryScrollDriver; variant?: Direction}) {
  const {locale} = useSiteLanguage();
  const words = tassoHomeCopy[locale];
  const root = useRef<HTMLDivElement>(null);
  const frameRef = useRef(frame);
  const repaint = useRef<((frame: number) => void) | null>(null);
  frameRef.current = frame;
  const initial = tassoFilmPose(frame, film.frameCount);

  useEffect(() => {
    // Parent reduced-motion state is set after hydration. Avoid even one atlas
    // request during that first effect cycle before the static summary mounts.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = root.current;
    const canvas = element?.querySelector<HTMLCanvasElement>('[data-tasso-film-canvas]');
    const firstPoster = element?.querySelector<HTMLImageElement>('[data-tasso-first-poster]');
    const ctx = canvas?.getContext('2d', {alpha: false});
    if (!element || !canvas || !ctx || !firstPoster) return;
    const host = element, surface = canvas, context = ctx, initialPoster = firstPoster;
    const posters = Array.from(host.querySelectorAll<HTMLImageElement>('[data-tasso-chapter-poster]'));
    const panels = Array.from(host.querySelectorAll<HTMLElement>('[data-tasso-film-copy]'));
    const labels = Array.from(host.querySelectorAll<HTMLElement>('[data-tasso-film-label]'));
    const index = Array.from(host.querySelectorAll<HTMLElement>('[data-tasso-film-index]'));
    const example = host.querySelector<HTMLElement>('.tasso-film-example');
    let disposed = false, raf = 0, currentFrame = scrollDriver?.current ?? frameRef.current;
    let mobile = matchMedia('(max-width: 700px)').matches;
    let media = mobile ? film.variants.mobile : film.variants.desktop;
    let cache: TassoFilmAtlasCache | null = null;
    let lastSource = -1, lastStep = 0, lastKind = '', direction = 1, previousTarget = -1;

    const schedule = () => {if (!disposed && !raf && !document.hidden) raf = requestAnimationFrame(paint);};
    const sizeCanvas = () => {
      surface.width = media.frameWidth; surface.height = media.frameHeight;
      lastSource = -1; lastKind = ''; surface.style.opacity = '0';
    };
    const paintCopy = (pose: TassoFilmPose, step: number, waiting = false) => {
      const opacity = waiting ? 1 : pose.copyOpacity;
      const y = waiting ? 0 : pose.copyY;
      panels.forEach((panel, i) => {
        panel.style.opacity = String(i === step ? opacity : 0);
        panel.style.visibility = i === step ? 'visible' : 'hidden';
        panel.style.transform = `translate3d(0, ${i === step ? y : 0}px, 0)`;
      });
      labels.forEach((label, i) => {
        label.style.opacity = String(i === step ? opacity : 0);
        label.style.visibility = i === step ? 'visible' : 'hidden';
      });
      index.forEach((item, i) => {item.dataset.active = String(i === step);});
      if (example) example.style.visibility = step === 2 ? 'visible' : 'hidden';
      host.dataset.tassoActiveStep = String(step + 1);
      host.dataset.tassoFilmStep = String(step);
    };
    const drawPoster = (pose: TassoFilmPose) => {
      const poster = pose.sourceFrame === 0 ? initialPoster : posters[pose.step];
      if (!poster?.complete || !poster.naturalWidth) return false;
      context.drawImage(poster, 0, 0, surface.width, surface.height);
      lastSource = pose.sourceFrame === 0 ? 0 : film.chapters[pose.step].posterFrame;
      lastStep = pose.step; lastKind = 'poster'; surface.style.opacity = '1';
      return true;
    };

    function paint() {
      raf = 0;
      if (disposed) return;
      const pose = tassoFilmPose(currentFrame, film.frameCount);
      const near = currentFrame >= 190 && currentFrame <= 555 && !document.hidden;
      host.dataset.tassoProgress = pose.progress.toFixed(6);
      host.dataset.tassoTargetFrame = String(pose.sourceFrame);
      host.dataset.tassoTargetStep = String(pose.step);
      host.dataset.tassoAtlasVariant = mobile ? 'mobile' : 'desktop';
      if (pose.sourceFrame < previousTarget) direction = -1;
      else if (pose.sourceFrame > previousTarget) direction = 1;
      previousTarget = pose.sourceFrame;

      let painted = false, failed = false;
      if (near) {
        cache ??= new TassoFilmAtlasCache(schedule);
        const request = tassoFilmAtlasRequest(media, pose.sourceFrame);
        const sheet = Math.floor(pose.sourceFrame / media.framesPerSheet);
        const neighbourFrame = Math.max(0, Math.min(film.frameCount - 1, (sheet + direction) * media.framesPerSheet));
        const neighbour = tassoFilmAtlasRequest(media, neighbourFrame);
        const wanted = [request?.key, neighbour?.key].filter((key): key is string => Boolean(key));
        cache.setWanted(Array.from(new Set(wanted)));
        const decoded = request ? cache.get(request.key) : null;
        if (decoded) {
          if (lastKind !== 'atlas' || lastSource !== pose.sourceFrame) {
            const within = pose.sourceFrame % media.framesPerSheet;
            const tileWidth = decoded.width / media.columns, tileHeight = decoded.height / media.rows;
            context.drawImage(decoded.source, within % media.columns * tileWidth, Math.floor(within / media.columns) * tileHeight,
              tileWidth, tileHeight, 0, 0, surface.width, surface.height);
          }
          lastSource = pose.sourceFrame; lastStep = pose.step; lastKind = 'atlas';
          surface.style.opacity = '1'; painted = true;
        } else if (request) {cache.ensure(request); failed = cache.hasFailed(request.key);}
        if (neighbour && neighbour.key !== request?.key) cache.ensure(neighbour);
      } else {
        cache?.dispose(); cache = null;
      }

      // A fast cross-chapter jump may need a new atlas. Use that chapter's
      // already-loaded real still, or retain BOTH the previous image and copy.
      // Never announce a new step against an unrelated old physical frame.
      if (!painted && (lastSource < 0 || lastStep !== pose.step || pose.sourceFrame === 0 && lastSource !== 0)) painted = drawPoster(pose);
      const displayedStep = lastSource >= 0 ? lastStep : 0;
      paintCopy(pose, displayedStep, displayedStep !== pose.step || lastKind === 'poster');
      host.dataset.tassoRenderedSourceFrame = String(lastSource);
      host.dataset.tassoRenderedKind = lastKind || 'initial-poster';
      host.dataset.tassoFrameReady = String(lastKind === 'atlas' && lastSource === pose.sourceFrame);
      host.dataset.tassoFramePending = String(near && !(lastKind === 'atlas' && lastSource === pose.sourceFrame));
      host.dataset.tassoMediaError = String(failed);
      host.dataset.tassoAtlasCacheCount = String(cache?.count ?? 0);
      host.dataset.tassoAtlasCacheBytes = String(cache?.decodedBytes ?? 0);
      host.dataset.tassoAtlasInFlight = String(cache?.inFlight ?? false);
      surface.dataset.renderedFrame = String(lastSource);
      surface.dataset.renderedStep = String(displayedStep);
    }

    const update = (value: number) => {currentFrame = value; schedule();};
    repaint.current = update;
    const measure = () => {
      const nextMobile = matchMedia('(max-width: 700px)').matches;
      if (nextMobile !== mobile) {
        cache?.dispose(); cache = null; mobile = nextMobile;
        media = mobile ? film.variants.mobile : film.variants.desktop; sizeCanvas();
      }
      schedule();
    };
    const visibility = () => {
      if (document.hidden) {cancelAnimationFrame(raf); raf = 0; cache?.dispose(); cache = null;
        host.dataset.tassoAtlasCacheCount = '0'; host.dataset.tassoAtlasCacheBytes = '0';
      } else measure();
    };
    const online = () => {cache?.resetFailures(); schedule();};
    const resize = new ResizeObserver(measure);
    resize.observe(host);
    sizeCanvas();
    for (const image of [initialPoster, ...posters]) image.addEventListener('load', schedule);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('online', online);
    window.addEventListener('resize', measure, {passive: true});
    const stop = scrollDriver?.subscribe(update);
    schedule();
    return () => {
      disposed = true; cancelAnimationFrame(raf); stop?.(); resize.disconnect(); cache?.dispose();
      for (const image of [initialPoster, ...posters]) image.removeEventListener('load', schedule);
      document.removeEventListener('visibilitychange', visibility); window.removeEventListener('online', online); window.removeEventListener('resize', measure);
      repaint.current = null;
    };
  }, [scrollDriver, locale]);

  useLayoutEffect(() => {if (!scrollDriver) repaint.current?.(frame);}, [frame, scrollDriver]);

  return <div ref={root} className="tasso-film-process" data-tasso-film-process data-film-variant={variant}
    data-tasso-active-step={initial.step + 1} data-tasso-film-step={initial.step} data-tasso-progress={initial.progress.toFixed(6)}>
    <header className="tasso-film-heading"><p>{words.kicker}</p><h2>{words.heading[0]}<br/><em>{words.heading[1]}</em></h2><span>{words.intro}</span></header>
    <div className="tasso-film-visual">
      <div className="tasso-film-frame">
        <picture className="tasso-film-first-poster"><source media="(max-width: 700px)" srcSet={film.variants.mobile.poster}/><img data-tasso-first-poster src={film.variants.desktop.poster} width={film.variants.desktop.frameWidth} height={film.variants.desktop.frameHeight} alt="" loading="eager" decoding="async"/></picture>
        <canvas data-tasso-film-canvas width={film.variants.desktop.frameWidth} height={film.variants.desktop.frameHeight} aria-hidden="true" style={{opacity: 0}}/>
      </div>
      <div className="tasso-film-labels" aria-hidden="true">{words.steps.map((step, i) => <div key={step.id} data-tasso-film-label={i} className="tasso-film-label" style={{opacity: i === initial.step ? 1 : 0, visibility: i === initial.step ? 'visible' : 'hidden'}}><p>{step.labelled.eyebrow}</p><strong>{step.labelled.title}</strong><span>{step.labelled.detail}</span></div>)}</div>
    </div>
    <div className="tasso-film-copy-stack">{words.steps.map((step, i) => <div key={step.id} data-tasso-film-copy={i} className="tasso-film-copy" style={{opacity: i === initial.step ? initial.copyOpacity : 0, visibility: i === initial.step ? 'visible' : 'hidden'}}>
      <p className="tasso-film-eyebrow">{step.label}</p><h3>{step.title}</h3><p className="tasso-film-body">{step.body}</p>
      {step.detail ? <p className="tasso-film-detail">{step.detail}</p> : null}
      {i === 2 ? <><FilmTiming timing={words.timing} qualifier={words.qualifier}/><p className="tasso-film-example">{words.illustrative}</p></> : null}
    </div>)}</div>
    <div className="tasso-film-footer"><div className="tasso-film-step-index" aria-hidden="true">{words.steps.map((step, i) => <span key={step.id} data-tasso-film-index={i} data-active={i === initial.step}><b>{String(i + 1).padStart(2, '0')}</b><i/></span>)}</div><p>{words.instructions}</p></div>
    <div className="tasso-film-preloads" aria-hidden="true">{film.chapters.map((chapter, i) => <ChapterPoster key={chapter.id} index={i} preload/>)}</div>
  </div>;
}

/** Readable full process for reduced motion; no atlas or player is loaded. */
export function TassoFilmSummary({visible = true, edition = 'original'}: {visible?: boolean; edition?: 'black' | 'original'}) {
  const {locale} = useSiteLanguage();
  const words = tassoHomeCopy[locale];
  const heading = useId();
  return <section className={visible ? 'tasso-film-summary' : 'sr-only'} data-tasso-summary data-tasso-film-summary data-summary-edition={edition} aria-labelledby={heading}>
    <header><p>{words.kicker}</p><h2 id={heading}>{words.heading.join(' ')}</h2><span>{words.intro}</span></header>
    <ol>{words.steps.map((step, i) => <li key={step.id}>
      {visible ? <ChapterPoster index={i} className="tasso-film-summary-art" edition={edition}/> : null}
      <div><p className="tasso-film-eyebrow">{step.label}</p><h3>{step.title}</h3><p>{i === 2 ? step.body : step.long}</p>{i === 2 ? <FilmTiming timing={words.timing} qualifier={words.qualifier}/> : null}</div>
    </li>)}</ol>
    <p className="tasso-film-summary-note">{words.instructions} <span>{words.illustrative}.</span></p>
  </section>;
}

export function TassoFilmTranscript() {return <TassoFilmSummary visible={false}/>;}
