'use client';

import {useEffect, useRef, useState} from 'react';
import manifest from '@/lib/site-content/tasso-film-options.json';
import {useSiteLanguage} from './SiteLanguage';
import './tasso-film-options.css';

const optionIds = ['original', 'studio', 'morning', 'light'] as const;
type OptionId = typeof optionIds[number];
type SceneAsset = {id: string; ready: boolean; video: string; poster: string; start: number | null; end: number | null};
const words = {
  en: {
    eyebrow: 'EVA / FILM STUDIES', title: ['One small step.', 'Four ways to tell it.'],
    intro: 'The original, alongside three new film directions. The same simple journey, seen through a different lens.',
    back: 'Back to the content review', choose: 'Explore the four directions',
    current: 'CURRENT VERSION', study: 'NEW FILM DIRECTION', ready: 'Ready to review', pending: 'Film in preparation',
    pendingBody: 'This scene will appear here when its film and poster are ready.',
    error: 'This film could not be loaded.', errorBody: 'You can retry playback or choose another scene. The process is explained below.',
    retry: 'Retry film', play: 'Play the three-step film', pause: 'Pause film', replay: 'Play again',
    scene: 'Scene', selectScene: 'Choose a scene', silent: 'Silent films. All three steps are explained below.',
    transcript: 'Read the three steps', instructions: 'Follow the instructions supplied with your kit.',
    fullInstructions: 'Watch the manufacturer’s full instructions',
    sameJourney: 'The same journey in every direction.',
    sameBody: 'Kit at home. A protected sample returned in the prepaid envelope. Results in 2 working days from laboratory receipt.',
    noSelection: 'The current homepage remains the original while we review these directions.',
    options: {
      original: {title: 'Original', pitch: 'The current version, kept for comparison.', description: 'The existing scroll story: authentic product photography, illustrated return packaging and a quiet report study.'},
      studio: {title: 'Studio Precision', pitch: 'The process, in its simplest form.', description: 'Warm ivory, close focus and tactile materials. A precise product film with soft light and deliberate framing.'},
      morning: {title: 'Morning at Home', pitch: 'A small moment in an ordinary day.', description: 'A real-feeling morning, one person and one familiar table. Quiet daylight and natural movement make the routine easy to imagine.'},
      light: {title: 'Light into Insight', pitch: 'A close look. A clearer understanding.', description: 'EVA ink and controlled amber light. Camera and focus reveal real skin, protected packaging and the texture of a report.'},
    },
    scenes: [
      {short: 'Collect', title: 'Collect at home.', caption: 'Your kit comes to you. Prepare, apply, press once, release.', detail: 'Upper arm · up to 5 minutes', long: 'The kit comes to you. Warm, clean and dry your upper arm. Apply Tasso+, then press once and release. Relax your arm. Allow up to 5 minutes. Keep the attached tube pointing down.'},
      {short: 'Return', title: 'Send your sample back.', caption: 'Protected sample. Prepaid return envelope.', detail: 'Return postage included.', long: 'Seal and label your sample as instructed. Pack it in the supplied protective packaging, then the prepaid return envelope.'},
      {short: 'Understand', title: 'Understand your results.', caption: '2 working days from laboratory receipt.', detail: 'Biomarkers explained. A clearer picture over time.', long: 'Your biomarkers, explained. A clearer picture of your health, ready to follow over time. Results in 2 working days from laboratory receipt of your sample.'},
    ],
  },
  es: {
    eyebrow: 'EVA / ESTUDIOS DE CINE', title: ['Un pequeño gesto.', 'Cuatro formas de contarlo.'],
    intro: 'El original, junto a tres nuevas direcciones de cine. El mismo recorrido sencillo, visto desde otra perspectiva.',
    back: 'Volver a la revisión de contenido', choose: 'Explora las cuatro direcciones',
    current: 'VERSIÓN ACTUAL', study: 'NUEVA DIRECCIÓN DE CINE', ready: 'Lista para revisar', pending: 'Película en preparación',
    pendingBody: 'Esta escena aparecerá aquí cuando su vídeo y su imagen estén listos.',
    error: 'No se ha podido cargar esta película.', errorBody: 'Puedes volver a intentarlo o elegir otra escena. El proceso se explica debajo.',
    retry: 'Reintentar reproducción', play: 'Reproducir los tres pasos', pause: 'Pausar película', replay: 'Volver a reproducir',
    scene: 'Escena', selectScene: 'Elige una escena', silent: 'Películas sin sonido. Los tres pasos se explican debajo.',
    transcript: 'Lee los tres pasos', instructions: 'Sigue las instrucciones incluidas en tu kit.',
    fullInstructions: 'Ver las instrucciones completas del fabricante',
    sameJourney: 'El mismo recorrido en cada dirección.',
    sameBody: 'El kit en casa. Una muestra protegida que devuelves en el sobre prepagado. Resultados en 2 días laborables desde la recepción en laboratorio.',
    noSelection: 'La página de inicio actual conserva el original mientras revisamos estas direcciones.',
    options: {
      original: {title: 'Original', pitch: 'La versión actual, conservada para comparar.', description: 'El relato actual de scroll: fotografía auténtica del producto, embalaje de devolución ilustrado y un informe sobrio.'},
      studio: {title: 'Precisión de estudio', pitch: 'El proceso, en su forma más sencilla.', description: 'Marfil cálido, enfoque cercano y materiales táctiles. Una película de producto precisa, con luz suave y encuadres cuidados.'},
      morning: {title: 'Una mañana en casa', pitch: 'Un pequeño momento en un día cualquiera.', description: 'Una mañana cotidiana, una persona y una mesa familiar. La luz natural y el movimiento sutil hacen fácil imaginar la rutina.'},
      light: {title: 'De la luz a la claridad', pitch: 'Una mirada cercana. Una visión más clara.', description: 'El tono tinta de EVA y una luz ámbar controlada. Cámara y enfoque revelan piel real, embalaje protector y la textura de un informe.'},
    },
    scenes: [
      {short: 'Recoge', title: 'Recoge tu muestra en casa.', caption: 'El kit llega a ti. Prepara, coloca, pulsa una vez y suelta.', detail: 'Parte superior del brazo · hasta 5 minutos', long: 'El kit llega a tu casa. Calienta, limpia y seca la parte superior del brazo. Coloca Tasso+, pulsa una vez y suelta. Relaja el brazo. La recogida puede durar hasta 5 minutos. Mantén el tubo conectado hacia abajo.'},
      {short: 'Devuelve', title: 'Devuelve tu muestra.', caption: 'Muestra protegida. Sobre de devolución prepagado.', detail: 'Franqueo de devolución incluido.', long: 'Sella e identifica tu muestra según las instrucciones. Colócala en el embalaje protector incluido y después en el sobre de devolución prepagado.'},
      {short: 'Comprende', title: 'Comprende tus resultados.', caption: '2 días laborables desde la recepción en laboratorio.', detail: 'Biomarcadores explicados. Una visión más clara en el tiempo.', long: 'Tus biomarcadores, explicados. Una visión más clara de tu salud para seguir su evolución en el tiempo. Resultados en 2 días laborables desde la recepción de tu muestra en el laboratorio.'},
    ],
  },
} as const;
type PageWords = typeof words[keyof typeof words];

function PlaybackGlyph({playing}: {playing: boolean}) {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">{playing ? <path d="M3 2h3v12H3zm7 0h3v12h-3z"/> : <path d="m4 2 10 6-10 6z"/>}</svg>;
}

function DirectionGlyph({kind}: {kind: 'back' | 'out' | 'down'}) {
  const path = kind === 'back' ? 'M13 8H3m5-5L3 8l5 5' : kind === 'down' ? 'M8 2v12m-5-5 5 5 5-5' : 'M3 13 13 3M4 3h9v9';
  return <svg className="tasso-film-direction-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false"><path d={path}/></svg>;
}

function ProcessTranscript({text}: {text: PageWords}) {
  return <details className="tasso-film-transcript"><summary>{text.transcript}<span aria-hidden="true">+</span></summary><ol>{text.scenes.map((scene, i) => <li key={scene.short}><span>{String(i + 1).padStart(2, '0')}</span><div><h4>{scene.title}</h4><p>{scene.long}</p></div></li>)}</ol><div className="tasso-film-instructions"><p>{text.instructions}</p><a href="https://www.tassoinc.com/tassoplus-video" target="_blank" rel="noreferrer">{text.fullInstructions}<DirectionGlyph kind="out"/></a></div></details>;
}

function FilmOption({id, index, text}: {id: OptionId; index: number; text: PageWords}) {
  const option = text.options[id];
  const assets: SceneAsset[] = manifest.options.find(item => item.id === id)?.scenes ?? [];
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [complete, setComplete] = useState(false);
  const media = useRef<HTMLVideoElement>(null);
  const playThrough = useRef(false);
  const pendingPlay = useRef(false);
  const advancing = useRef(false);
  const lastSource = useRef('');
  const asset = assets[selected];
  const scene = text.scenes[selected];
  const ready = Boolean(asset?.ready && asset.video && asset.poster);
  const allReady = assets.length === 3 && assets.every(item => item.ready && item.video && item.poster);
  const captionId = `tasso-film-${id}-caption`;

  const playMedia = () => {
    const video = media.current;
    if (!video || !ready) return;
    pendingPlay.current = false;
    void video.play().catch((error: unknown) => {if (error instanceof DOMException && error.name === 'AbortError') return; setPlaying(false); setFailed(true); playThrough.current = false;});
  };
  const positionMedia = () => {
    const video = media.current;
    if (!video || !ready || !Number.isFinite(video.duration)) return;
    const start = Math.min(Math.max(0, asset.start ?? 0), Math.max(0, video.duration - .01));
    if (Math.abs(video.currentTime - start) > .05) video.currentTime = start;
    if (pendingPlay.current && playThrough.current) playMedia();
  };

  useEffect(() => {
    advancing.current = false;
    const video = media.current;
    if (!video || !ready) return;
    if (lastSource.current === asset.video && video.readyState >= 1) positionMedia();
    else {lastSource.current = asset.video; video.load(); if (pendingPlay.current && playThrough.current) playMedia();}
    return () => {video.pause();};
    // Source changes are driven only by deliberate scene selection or a film
    // sequence that the viewer has already started. There is no initial autoplay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.video, asset?.start, asset?.end, selected, ready]);

  const selectScene = (next: number) => {
    media.current?.pause();
    playThrough.current = false;
    pendingPlay.current = false;
    advancing.current = false;
    setPlaying(false); setFailed(false); setComplete(false);
    if (next === selected) positionMedia();
    else setSelected(next);
  };
  const finishScene = () => {
    if (advancing.current) return;
    advancing.current = true;
    const next = assets[selected + 1];
    const continueFilm = playThrough.current && selected < 2 && next?.ready;
    media.current?.pause(); setPlaying(false);
    if (continueFilm) {pendingPlay.current = true; setSelected(selected + 1);}
    else {playThrough.current = false; pendingPlay.current = false; setComplete(selected === 2);}
  };
  const togglePlayback = () => {
    const video = media.current;
    if (!video || !ready) return;
    setFailed(false);
    if (!video.paused) {playThrough.current = false; pendingPlay.current = false; video.pause(); return;}
    playThrough.current = true;
    pendingPlay.current = true;
    if (complete) {setComplete(false); setSelected(0); if (selected === 0) {positionMedia(); playMedia();}}
    else {advancing.current = false; if (asset.end !== null && video.currentTime >= asset.end - .03) positionMedia(); playMedia();}
  };
  const retry = () => {
    setFailed(false); lastSource.current = '';
    pendingPlay.current = true; playThrough.current = true;
    media.current?.load(); playMedia();
  };

  return <section className={`tasso-film-option tasso-film-option-${id}`} id={`film-${id}`} aria-labelledby={`film-${id}-title`} data-film-option={id}>
    <header className="tasso-film-option-heading"><div className="tasso-film-option-meta"><span>{String(index).padStart(2, '0')}</span><p>{id === 'original' ? text.current : text.study}</p><span className={allReady ? 'tasso-film-availability is-ready' : 'tasso-film-availability'}>{allReady ? text.ready : text.pending}</span></div><div className="tasso-film-direction"><div><h2 id={`film-${id}-title`}>{option.title}</h2><p className="tasso-film-pitch">{option.pitch}</p></div><p className="tasso-film-direction-copy">{option.description}</p></div></header>
    <div className="tasso-film-screen" data-film-screen={id}>
      {ready ? <video ref={media} src={asset.video} poster={asset.poster} controls playsInline muted preload="none" aria-label={`${option.title}: ${scene.title}`} aria-describedby={captionId} data-tasso-film-video data-film-scene={scene.short} onLoadedMetadata={positionMedia} onCanPlay={() => {if (pendingPlay.current && playThrough.current) playMedia();}} onPlay={() => {setPlaying(true); setFailed(false); document.querySelectorAll<HTMLVideoElement>('[data-tasso-film-video]').forEach(other => {if (other !== media.current) other.pause();});}} onPause={() => setPlaying(false)} onEnded={finishScene} onTimeUpdate={() => {if (asset.end !== null && media.current && media.current.currentTime >= asset.end - .03) finishScene();}} onError={() => {setFailed(true); setPlaying(false); playThrough.current = false;}}/> : <div className="tasso-film-pending-state"><span>{String(index).padStart(2, '0')} / {String(selected + 1).padStart(2, '0')}</span><p>{text.pending}</p><small>{text.pendingBody}</small></div>}
      {failed ? <div className="tasso-film-error" role="status"><p>{text.error}</p><span>{text.errorBody}</span><button type="button" onClick={retry}>{text.retry}</button></div> : null}
    </div>
    <div className="tasso-film-player-bar"><p><span>{text.scene} {String(selected + 1).padStart(2, '0')} / 03</span>{scene.short}</p><button type="button" className="tasso-film-play" disabled={!ready} onClick={togglePlayback} aria-label={`${playing ? text.pause : complete ? text.replay : text.play}: ${option.title}`}><PlaybackGlyph playing={playing}/>{playing ? text.pause : complete ? text.replay : text.play}</button></div>
    <div className="tasso-film-scene-selector" role="group" aria-label={`${text.selectScene}: ${option.title}`}>{text.scenes.map((item, i) => <button key={item.short} type="button" aria-pressed={selected === i} onClick={() => selectScene(i)} aria-controls={captionId}><span>{String(i + 1).padStart(2, '0')}</span><b>{item.title}</b><i aria-hidden="true"/></button>)}</div>
    <div className="tasso-film-caption" id={captionId} aria-live="polite" aria-atomic="true"><p>{scene.caption}</p><span>{scene.detail}</span></div>
    <ProcessTranscript text={text}/>
  </section>;
}

export default function TassoFilmOptions() {
  const {locale, href} = useSiteLanguage();
  const text = words[locale];
  return <div className="tasso-film-comparison" data-tasso-film-comparison>
    <header className="tasso-film-intro"><a className="tasso-film-back" href={href('/es/review')}>{text.back}<DirectionGlyph kind="back"/></a><p className="tasso-film-eyebrow">{text.eyebrow}</p><h1>{text.title[0]}<br/><em>{text.title[1]}</em></h1><p className="tasso-film-introduction">{text.intro}</p><nav className="tasso-film-jump-nav" aria-label={text.choose}>{optionIds.map((id, index) => <a key={id} href={`#film-${id}`}><span>{String(index).padStart(2, '0')}</span>{text.options[id].title}<span aria-hidden="true"><DirectionGlyph kind="down"/></span></a>)}</nav><p className="tasso-film-current-note">{text.noSelection}</p></header>
    {optionIds.map((id, index) => <FilmOption key={id} id={id} index={index} text={text}/>)}
    <aside className="tasso-film-common"><h2>{text.sameJourney}</h2><p>{text.sameBody}</p><span>{text.silent}</span></aside>
  </div>;
}
