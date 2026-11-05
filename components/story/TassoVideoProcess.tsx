'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {tassoHomeCopy} from '@/lib/site-content/tasso-home-copy';
import './tasso-film-process.css';
import './tasso-video-process.css';

const editions = {
  original: {source: '/art/tasso-home-video/process-1x-v1.mp4', poster: '/art/tasso-home-film/81d580b1ef608977/desktop/poster.jpg'},
  black: {source: '/art/tasso-home-video/process-black-smooth-v2.mp4', poster: '/art/tasso-home-video/process-black-smooth-v2.jpg'},
} as const;
const starts = [0, 6.5, 14.5] as const;

function Chevron({back = false}: {back?: boolean}) {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d={back ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'}/></svg>;
}

/** Native playback owns time. Scrolling only decides whether this section is visible. */
export function TassoVideoProcess({active = true, variant = 'clean', edition = 'original', appearance = edition}: {active?: boolean; variant?: 'clean' | 'labelled'; edition?: 'black' | 'original'; appearance?: 'black' | 'original'}) {
  const {locale} = useSiteLanguage();
  const words = tassoHomeCopy[locale];
  const {source, poster} = editions[edition];
  const heading = useId();
  const description = useId();
  const video = useRef<HTMLVideoElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const shouldPlay = useRef(true);
  const pendingSeek = useRef<number | null>(null);
  const activeRef = useRef(active);
  const visibleRef = useRef(true);
  activeRef.current = active;
  const [armed, setArmed] = useState(false);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(true);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const current = words.steps[step];

  const play = () => {
    const media = video.current;
    if (!media || !activeRef.current || !visibleRef.current || document.hidden || !shouldPlay.current) return;
    media.muted = true;
    media.defaultPlaybackRate = 1;
    media.playbackRate = 1;
    void media.play().then(() => {
      // A play promise can finish after a scroll-away or a Pause click.
      if (!activeRef.current || !visibleRef.current || document.hidden || !shouldPlay.current) media.pause();
    }).catch(() => setPaused(true));
  };

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sync = () => {
      if (!activeRef.current || !visibleRef.current || document.hidden) media.pause();
      else if (shouldPlay.current) {
        media.muted = true;
        media.playbackRate = 1;
        void media.play().then(() => {
          if (!activeRef.current || !visibleRef.current || document.hidden || !shouldPlay.current) media.pause();
        }).catch(() => setPaused(true));
      }
    };
    if (active) setArmed(true);
    sync();
    const observer = new IntersectionObserver(([entry]) => {
      // Even the final visible strip must keep moving during the page transition.
      visibleRef.current = entry.isIntersecting && entry.intersectionRatio > 0;
      sync();
    }, {threshold: [0]});
    if (media.parentElement) observer.observe(media.parentElement);
    document.addEventListener('visibilitychange', sync);
    return () => {observer.disconnect(); document.removeEventListener('visibilitychange', sync); media.pause();};
  }, [active, armed]);

  const update = () => {
    const media = video.current;
    if (!media) return;
    const time = media.currentTime;
    const next = time < starts[1] ? 0 : time < starts[2] ? 1 : 2;
    setStep(previous => previous === next ? previous : next);
    if (progress.current) progress.current.style.transform = `scaleX(${media.duration ? time / media.duration : 0})`;
  };

  const seek = (index: number) => {
    const media = video.current;
    if (!media) return;
    const next = Math.max(0, Math.min(2, index));
    shouldPlay.current = true;
    pendingSeek.current = starts[next];
    setEnded(false);
    setArmed(true);
    if (media.readyState >= 1) {
      media.currentTime = starts[next];
      pendingSeek.current = null;
      update();
      play();
    }
  };

  const toggle = () => {
    const media = video.current;
    if (!media) return;
    if (ended) {seek(0); return;}
    shouldPlay.current = media.paused;
    if (shouldPlay.current) {setArmed(true); play();}
    else media.pause();
  };

  const ready = () => {
    const media = video.current;
    if (!media) return;
    if (pendingSeek.current !== null) {media.currentTime = pendingSeek.current; pendingSeek.current = null;}
    setFailed(false);
    update();
    play();
  };

  return <section className="tasso-film-process tasso-video-process" data-tasso-video-process data-film-variant={variant} data-film-edition={edition} data-film-appearance={appearance}
    data-active={active} data-step={step + 1} data-playing={!paused} aria-labelledby={heading} aria-describedby={description}>
    <header className="tasso-film-heading"><p>{words.kicker}</p><h2 id={heading}>{words.heading[0]}<br/><em>{words.heading[1]}</em></h2><span>{words.intro}</span></header>
    <div className="tasso-film-visual">
      <div className="tasso-film-frame">
        <video ref={video} src={armed ? source : undefined} poster={poster} muted playsInline preload={armed ? 'auto' : 'none'} disablePictureInPicture
          aria-label={locale === 'en' ? 'At-home collection, prepaid return and your results' : 'Recogida en casa, devolución prepagada y tus resultados'}
          onLoadedMetadata={ready} onCanPlay={() => setWaiting(false)} onTimeUpdate={update} onSeeked={() => {setWaiting(false); update();}}
          onPlaying={() => {setPaused(false); setWaiting(false);}} onPause={() => setPaused(true)}
          onWaiting={() => setWaiting(true)} onError={() => {setFailed(true); setWaiting(false);}}
          onEnded={() => {shouldPlay.current = false; setEnded(true); setPaused(true); setWaiting(false);}}/>
        <div className="tasso-video-progress" aria-hidden="true"><div ref={progress}/></div>
        {failed ? <p className="tasso-video-message" role="status">{locale === 'en' ? 'The film could not load.' : 'No se pudo cargar el vídeo.'}<button type="button" onClick={() => {setFailed(false); video.current?.load();}}>{locale === 'en' ? 'Try again' : 'Reintentar'}</button></p>
          : waiting ? <span className="tasso-video-loading" role="status">{locale === 'en' ? 'Loading film…' : 'Cargando vídeo…'}</span> : null}
      </div>
      {variant === 'labelled' ? <div className="tasso-film-labels"><div className="tasso-film-label"><p>{current.labelled.eyebrow}</p><strong>{current.labelled.title}</strong><span>{current.labelled.detail}</span></div></div> : null}
    </div>
    <div className="tasso-film-copy-stack" aria-live="polite" aria-atomic="true"><div className="tasso-film-copy">
      <p className="tasso-film-eyebrow">{current.label}</p><h3>{current.title}</h3><p className="tasso-film-body">{current.body}</p>
      {current.detail ? <p className="tasso-film-detail">{current.detail}</p> : null}
      {step === 2 ? <><div className="tasso-film-timing"><strong>{words.timing}</strong><p>{words.qualifier}</p></div><p className="tasso-film-example">{words.illustrative}</p></> : null}
    </div></div>
    <div className="tasso-film-footer tasso-video-controls">
      <nav className="tasso-video-steps" aria-label={locale === 'en' ? 'Choose a step' : 'Elige un paso'}>{words.steps.map((item, index) => <button type="button" key={item.id} aria-current={step === index ? 'step' : undefined} onClick={() => seek(index)}><span>{String(index + 1).padStart(2, '0')}</span><span>{item.short}</span></button>)}</nav>
      <div className="tasso-video-actions">
        <button type="button" disabled={step === 0} onClick={() => seek(step - 1)}><Chevron back/>{locale === 'en' ? 'Previous' : 'Anterior'}</button>
        <button type="button" onClick={toggle} aria-label={ended ? (locale === 'en' ? 'Replay all three steps' : 'Repetir los tres pasos') : paused ? (locale === 'en' ? 'Play film' : 'Reproducir vídeo') : (locale === 'en' ? 'Pause film' : 'Pausar vídeo')}>{ended ? (locale === 'en' ? 'Replay' : 'Repetir') : paused ? (locale === 'en' ? 'Play' : 'Reproducir') : (locale === 'en' ? 'Pause' : 'Pausar')}</button>
        <button type="button" disabled={step === 2} onClick={() => seek(step + 1)}>{locale === 'en' ? 'Next' : 'Siguiente'}<Chevron/></button>
      </div>
      <p id={description} className="sr-only">{words.instructions}</p>
    </div>
  </section>;
}
