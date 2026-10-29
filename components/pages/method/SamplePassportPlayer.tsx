'use client';

import {useEffect, useRef, useState, type ComponentType, type RefObject} from 'react';
import type {PlayerRef} from '@remotion/player';
import {Pause, Play, RotateCcw} from 'lucide-react';
import {SamplePassportArtwork, PASSPORT_FRAMES, PASSPORT_FPS, PASSPORT_LABELS, PASSPORT_STOPS} from '@/remotion/engagement/SamplePassportArtwork';

type LazyPlayer = ComponentType<{playerRef: RefObject<PlayerRef | null>; initialFrame: number}>;

export default function SamplePassportPlayer({chapter}: {chapter?: number} = {}) {
  const host = useRef<HTMLElement>(null);
  const player = useRef<PlayerRef>(null);
  const userPaused = useRef(false);
  const segmentComplete = useRef(false);
  const previousChapter = useRef(chapter);
  const [Player, setPlayer] = useState<LazyPlayer | null>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState<number>(chapter === undefined ? 0 : PASSPORT_STOPS[chapter]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener('change', sync);
    if (!('IntersectionObserver' in window)) return () => media.removeEventListener('change', sync);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {threshold: .3});
    if (host.current) observer.observe(host.current);
    return () => {media.removeEventListener('change', sync); observer.disconnect();};
  }, []);

  useEffect(() => {
    if (!inView || reduced || Player || failed) return;
    let cancelled = false;
    import('./SamplePassportRuntime').then(module => {if (!cancelled) setPlayer(() => module.default);}).catch(() => {if (!cancelled) setFailed(true);});
    return () => {cancelled = true;};
  }, [Player, failed, inView, reduced]);

  useEffect(() => {
    if (chapter === undefined || chapter === previousChapter.current) return;
    previousChapter.current = chapter;
    segmentComplete.current = false;
    const next = PASSPORT_STOPS[chapter];
    setFrame(next); player.current?.seekTo(next);
    if (inView && !reduced && !document.hidden && !userPaused.current) player.current?.play();
  }, [chapter, Player, reduced, inView]);

  useEffect(() => {
    const current = player.current;
    if (!current) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => {setPlaying(false); setFrame(current.getCurrentFrame());};
    const onFrame = ({detail}: {detail: {frame: number}}) => {
      const last = chapter === undefined ? PASSPORT_FRAMES - 1 : Math.min(PASSPORT_FRAMES - 1, PASSPORT_STOPS[chapter] + 48);
      if (detail.frame >= last) {segmentComplete.current = true; current.pause(); if (detail.frame > last) current.seekTo(last); setFrame(last);}
      else if (detail.frame % 5 === 0) setFrame(detail.frame);
    };
    const onEnd = () => {setFrame(PASSPORT_FRAMES - 1); setPlaying(false); userPaused.current = true;};
    current.addEventListener('play', onPlay); current.addEventListener('pause', onPause);
    current.addEventListener('frameupdate', onFrame); current.addEventListener('ended', onEnd);
    const visibility = () => {
      if (document.hidden || !inView || reduced) current.pause();
      else if (!userPaused.current && !segmentComplete.current) current.play();
    };
    visibility();
    // A chapter change can start playback before these new listeners attach.
    // Synchronize the control with the actual player as well as future events.
    setPlaying(current.isPlaying());
    document.addEventListener('visibilitychange', visibility);
    return () => {setFrame(current.getCurrentFrame()); current.pause(); current.removeEventListener('play', onPlay); current.removeEventListener('pause', onPause); current.removeEventListener('frameupdate', onFrame); current.removeEventListener('ended', onEnd); document.removeEventListener('visibilitychange', visibility);};
  }, [Player, inView, reduced, chapter]);

  function toggle() {
    if (!player.current) return;
    if (playing) {userPaused.current = true; player.current.pause();}
    else {userPaused.current = false; if (chapter !== undefined && segmentComplete.current) player.current.seekTo(PASSPORT_STOPS[chapter]); else if (chapter === undefined && frame >= PASSPORT_FRAMES - 1) player.current.seekTo(0); segmentComplete.current = false; player.current.play();}
  }

  return <figure ref={host} className="method-passport" aria-labelledby="method-passport-caption">
    <div className="method-passport-canvas" aria-hidden="true">
      {Player && !reduced ? <Player playerRef={player} initialFrame={frame}/> : <SamplePassportArtwork frame={reduced ? chapter === undefined ? PASSPORT_FRAMES - 1 : Math.min(269, PASSPORT_STOPS[chapter] + 38) : frame}/>}
    </div>
    <figcaption id="method-passport-caption">Una muestra viaja. Un registro la acompaña.</figcaption>
    {!reduced && Player && !failed ? <div className="method-passport-controls">
      <button type="button" onClick={toggle} aria-label={playing ? 'Pausar el recorrido' : frame >= PASSPORT_FRAMES - 1 ? 'Repetir el recorrido' : 'Reproducir el recorrido'}>{playing ? <Pause size={17}/> : frame >= PASSPORT_FRAMES - 1 ? <RotateCcw size={17}/> : <Play size={17}/>}<span>{playing ? 'Pausar' : frame >= PASSPORT_FRAMES - 1 ? 'Repetir' : 'Reproducir'}</span></button>
      <input type="range" min={chapter === undefined ? 0 : PASSPORT_STOPS[chapter]} max={chapter === undefined ? PASSPORT_FRAMES - 1 : Math.min(269, PASSPORT_STOPS[chapter] + 48)} value={frame} aria-label={chapter === undefined ? 'Posición del recorrido' : `Movimiento del capítulo ${PASSPORT_LABELS[chapter]}`} aria-valuetext={chapter === undefined ? `${Math.round(frame / PASSPORT_FPS)} de 9 segundos` : `${Math.round((frame - PASSPORT_STOPS[chapter]) / 48 * 100)} por ciento del capítulo`} onChange={event => {const next = Number(event.target.value); userPaused.current = true; segmentComplete.current = false; player.current?.pause(); player.current?.seekTo(next); setFrame(next);}}/>
      <span className="method-passport-time">{chapter === undefined ? `${frame === PASSPORT_FRAMES - 1 ? 9 : Math.floor(frame / PASSPORT_FPS)} / 9 s` : `0${chapter + 1} / 04`}</span>
    </div> : <p className="method-passport-static-note">{reduced ? 'Vista sin movimiento' : failed ? 'El recorrido se conserva en las ilustraciones' : chapter === undefined ? 'Recorrido de 9 segundos' : 'Una identidad, de principio a fin'}</p>}
    <p className="method-passport-source-note">Ilustración del proceso. Las instrucciones de uso están en el kit.</p>
  </figure>;
}
