'use client';

import {useEffect, useRef} from 'react';
import mediaManifest from '@/lib/site-content/tasso-light-cinematic.json';
import {TassoAtlasCache, tassoAtlasRequest, type TassoAtlasScene} from '@/lib/tasso-scroll-atlas';
import {lightCinematicPose, lightDashboardFrame, lightPaperCovers, type LightDashboardLandmarks} from '@/lib/tasso-light-motion';
import {tassoScrollCopy, type TassoScrollCopy} from './tasso-scroll-copy';
import './light-cinematic.css';

type Scene = TassoAtlasScene & {states?: {id: string; frame: number}[]};
const scenes: Scene[] = mediaManifest.scenes;
const stateFrames = new Map(scenes[2]?.states?.map(state => [state.id, state.frame]));
const landmarks: LightDashboardLandmarks = {signature: stateFrames.get('signature') ?? 12, apob: stateFrames.get('apob') ?? 56, hscrp: stateFrames.get('hscrp') ?? 124, closed: stateFrames.get('closed') ?? 184};
const cameraAnchors = [[.655, .399], [.615, .385], [.5, .42]];
const jumpPoints = [.12, .44, .77];
const paperInset = mediaManifest.carrier.opaqueInset;
const paperFaceFraction = Math.min(1 - paperInset.left - paperInset.right, 1 - paperInset.top - paperInset.bottom);

function lightAtlasRequest(scene: Scene, frame: number, mobile: boolean) {
  const request = tassoAtlasRequest(scene, frame, false);
  if (!request || !mobile) return request;
  const target = Math.min(scene.frameWidth, scene.id === 'insight' ? 900 : 600);
  const width = Math.round(target * scene.columns), height = Math.round(target * scene.frameHeight / scene.frameWidth * scene.rows);
  return {...request, width, height, key: `${request.src}@${width}x${height}`};
}

function LightText({index, text, locale}: {index: number; text: TassoScrollCopy; locale: 'en' | 'es'}) {
  const scene = text.scenes[index];
  return <><p className="light-copy-label">{String(index + 1).padStart(2, '0')} / {scene.short}</p><h3>{scene.title}</h3><p className="light-copy-body">{index === 2 ? scene.caption : scene.long}</p>{index === 2 ? <><p className="light-copy-benefit">{scene.detail}</p><div className="light-app-context"><p><span className="light-context-desktop">{locale === 'en' ? 'Actual EVA dashboard · Example data · Spanish interface' : 'Panel real de EVA · Datos de ejemplo · Interfaz en español'}</span><span className="light-context-phone">{locale === 'en' ? 'Real EVA demo close-ups · Example data · Spanish' : 'Primeros planos de EVA · Datos de ejemplo · Español'}</span></p><a href="/es/dashboard">{locale === 'en' ? 'Explore the real dashboard' : 'Explora el panel real'}<span aria-hidden="true">+</span></a></div></> : null}</>;
}

/** A source-camera edit hidden by an opaque photographed envelope surface. */
export default function LightCinematic({locale, reduced}: {locale: 'en' | 'es'; reduced: boolean}) {
  const root = useRef<HTMLElement>(null);
  const text = tassoScrollCopy[locale];
  const ready = mediaManifest.carrier.ready && scenes.length === 3 && scenes.every(scene => scene.ready && scene.atlases.length > 0);

  useEffect(() => {
    const section = root.current;
    if (!section || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const stage = section.querySelector<HTMLElement>('[data-light-stage]');
    const canvas = section.querySelector<HTMLCanvasElement>('[data-light-canvas]');
    const paper = section.querySelector<HTMLElement>('[data-light-paper]');
    if (!stage || !canvas || !paper) return;
    const context = canvas.getContext('2d', {alpha: false});
    if (!context) return;
    const host = section, viewport = stage, output = canvas, surface = paper, ctx = context;
    const posters = Array.from(section.querySelectorAll<HTMLImageElement>('[data-light-source-poster]'));
    const captions = Array.from(section.querySelectorAll<HTMLElement>('[data-light-caption]'));
    const buttons = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-light-jump]'));
    const shade = section.querySelector<HTMLElement>('.light-readable-shade');
    let raf = 0, disposed = false, width = 1, height = 1, top = 0, span = 1, mobile = innerWidth <= 700;
    const schedule = () => {if (!disposed && !raf && !document.hidden) raf = requestAnimationFrame(paint);};
    let cache = new TassoAtlasCache(schedule);

    const measure = () => {
      const nextMobile = innerWidth <= 700;
      if (nextMobile !== mobile) {cache.dispose(); cache = new TassoAtlasCache(schedule); mobile = nextMobile;}
      width = viewport.clientWidth; height = viewport.clientHeight;
      top = host.getBoundingClientRect().top + scrollY;
      span = Math.max(1, host.offsetHeight - height);
      const resolution = Math.min(1, (mobile ? 780 : 1600) / Math.max(1, width));
      output.width = Math.round(width * resolution); output.height = Math.round(height * resolution);
      schedule();
    };

    function paint() {
      raf = 0;
      if (disposed || document.hidden || width <= 0 || height <= 0) return;
      const pose = lightCinematicPose((scrollY - top) / span);
      const active = scrollY >= top - height * .7 && scrollY <= top + span + height * .5;
      host.dataset.lightProgress = pose.p.toFixed(6);
      host.dataset.lightSourceScene = scenes[pose.scene]?.id ?? '';
      host.dataset.lightUiState = pose.uiState;

      const diagonal = Math.hypot(width, height), paperSize = diagonal * pose.paper.size / paperFaceFraction;
      const paperX = width * pose.paper.x, paperY = height * pose.paper.y;
      surface.style.width = `${paperSize}px`; surface.style.height = `${paperSize}px`;
      surface.style.transform = `translate3d(${paperX - paperSize / 2}px,${paperY - paperSize / 2}px,0) rotate(-22deg)`;
      surface.style.visibility = pose.paper.visible ? 'visible' : 'hidden';
      const covered = pose.paper.visible && lightPaperCovers(width, height, paperX, paperY, paperSize, .05, paperInset);
      host.dataset.paperFullCover = String(covered);
      host.dataset.paperCenterX = String(paperX); host.dataset.paperCenterY = String(paperY); host.dataset.paperSize = String(paperSize);
      if (shade) shade.style.visibility = pose.scene === 2 ? 'hidden' : 'visible';

      captions.forEach((caption, i) => {
        caption.style.visibility = i === pose.scene && !pose.paper.covered ? 'visible' : 'hidden';
        caption.setAttribute('aria-hidden', String(i !== pose.scene || pose.paper.covered));
        const entry = i === 1 ? Math.max(0, Math.min(1, (pose.p - .304) / .036)) : i === 2 ? Math.max(0, Math.min(1, (pose.p - .578) / .032)) : 1;
        const departure = i === 0 ? Math.max(0, Math.min(1, (pose.p - .22) / .062)) : i === 1 ? Math.max(0, Math.min(1, (pose.p - .50) / .054)) : 0;
        caption.style.transform = `translateY(${14 * (1 - entry) - 14 * departure}px)`;
      });
      buttons.forEach((button, i) => {button.setAttribute('aria-pressed', String(i === pose.scene)); if (i === pose.scene) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');});
      if (!active) {cache.setWanted([]); return;}

      const scene = scenes[pose.scene];
      if (!scene?.ready) return;
      const frame = Math.max(0, Math.min(scene.frameCount - 1, pose.scene === 2 ? lightDashboardFrame(pose.p, scene.frameCount - 1, landmarks) : Math.round(pose.frames[pose.scene] * (scene.frameCount - 1))));
      const request = lightAtlasRequest(scene, frame, mobile);
      const incoming = pose.scene === 0 && pose.p > .16 ? lightAtlasRequest(scenes[1], 0, mobile) : pose.scene === 1 && pose.p > .44 ? lightAtlasRequest(scenes[2], 0, mobile) : null;
      const next = incoming ?? lightAtlasRequest(scene, Math.min(scene.frameCount - 1, (Math.floor(frame / scene.framesPerSheet) + 1) * scene.framesPerSheet), mobile);
      cache.setWanted([request?.key, next?.key].filter((key): key is string => Boolean(key)));
      const bitmap = request ? cache.get(request.key) : null;
      if (request && !bitmap) cache.ensure(request);
      if (next && next.key !== request?.key) cache.ensure(next);

      const poster = posters[pose.scene];
      const source = bitmap ?? (poster?.complete && poster.naturalWidth ? poster : null);
      if (!source) return;
      const ratio = output.width / width;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.globalAlpha = 1; ctx.fillStyle = '#0b100c'; ctx.fillRect(0, 0, width, height);
      const tileWidth = bitmap ? bitmap.width / scene.columns : (source as HTMLImageElement).naturalWidth;
      const tileHeight = bitmap ? bitmap.height / scene.rows : (source as HTMLImageElement).naturalHeight;
      const within = frame % scene.framesPerSheet;
      const sx = bitmap ? (within % scene.columns) * tileWidth : 0;
      const sy = bitmap ? Math.floor(within / scene.columns) * tileHeight : 0;
      const anchorX = cameraAnchors[pose.scene][0], anchorY = cameraAnchors[pose.scene][1];
      let focalX = width * (mobile ? .5 : .62), focalY = height * (mobile ? (height <= 720 ? .32 : .36) : .44);
      let scale: number;
      if (pose.scene < 2) scale = Math.max(width / tileWidth, height * (mobile ? .70 : 1) / tileHeight) * pose.scale;
      else scale = Math.min(width * .55 / tileWidth, height * .84 / tileHeight) * pose.scale;
      if (pose.scene === 2 && mobile) {
        // Two editorial close-ups from the SAME unmodified moving app frame.
        // No UI is redrawn: signature and the actual selected result stay legible.
        const sourceRatioX = tileWidth / scene.frameWidth, sourceRatioY = tileHeight / scene.frameHeight;
        const ringWidth = Math.min(width * (height <= 720 ? .50 : .59), 240), ringHeight = ringWidth * 530 / 520;
        const ringX = (width - ringWidth) / 2, ringY = height * .11;
        ctx.drawImage(source, sx + 340 * sourceRatioX, sy + 160 * sourceRatioY, 520 * sourceRatioX, 530 * sourceRatioY, ringX, ringY, ringWidth, ringHeight);
        if (frame >= 44 && frame < 160) {
          const resultWidth = width * .88, resultHeight = resultWidth * 127 / 350;
          ctx.drawImage(source, sx + 300 * sourceRatioX, sy + 858 * sourceRatioY, 350 * sourceRatioX, 127 * sourceRatioY, (width - resultWidth) / 2, ringY + ringHeight + (height <= 720 ? 10 : 12), resultWidth, resultHeight);
        }
        output.dataset.uiFraming = 'actual-frame-closeups';
      } else if (pose.scene === 2) {
        // The complete real signature and result plane is centered vertically.
        // No rectangular viewport clips the orb or actual selected result.
        ctx.drawImage(source, sx, sy, tileWidth, tileHeight, width * .705 - tileWidth * scale / 2, height / 2 - tileHeight * scale / 2, tileWidth * scale, tileHeight * scale);
        output.dataset.uiFraming = 'whole-actual-frame';
      } else ctx.drawImage(source, sx, sy, tileWidth, tileHeight, focalX - anchorX * tileWidth * scale, focalY - anchorY * tileHeight * scale, tileWidth * scale, tileHeight * scale);
      output.style.visibility = 'visible';
      output.dataset.sourceScene = scene.id;
      output.dataset.renderedFrame = bitmap ? String(frame) : 'poster';
      output.dataset.atlasSrc = bitmap ? request?.src ?? '' : scene.poster;
      host.dataset.lightCacheCount = String(cache.count); host.dataset.lightCacheBytes = String(cache.decodedBytes);
    }

    const observer = new ResizeObserver(measure); observer.observe(viewport); measure();
    for (const poster of posters) poster.addEventListener('load', schedule);
    window.addEventListener('scroll', schedule, {passive: true}); window.addEventListener('resize', measure, {passive: true});
    const visibility = () => {if (document.hidden) {cancelAnimationFrame(raf); raf = 0; cache.setWanted([]);} else measure();};
    document.addEventListener('visibilitychange', visibility);
    void document.fonts.ready.then(() => {if (!disposed) measure();});
    return () => {disposed = true; cancelAnimationFrame(raf); observer.disconnect(); cache.dispose(); for (const poster of posters) poster.removeEventListener('load', schedule); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); document.removeEventListener('visibilitychange', visibility);};
  }, [locale, reduced]);

  const jump = (index: number) => {
    const element = root.current;
    if (!element) return;
    if (reduced) {element.querySelector<HTMLElement>(`[data-light-static="${index}"]`)?.scrollIntoView({behavior: 'instant'}); return;}
    const stage = element.querySelector<HTMLElement>('[data-light-stage]');
    window.scrollTo({top: element.getBoundingClientRect().top + scrollY + (element.offsetHeight - (stage?.offsetHeight ?? innerHeight)) * jumpPoints[index], behavior: 'instant'});
  };

  if (reduced) return <section ref={root} className="light-cinematic light-cinematic-static" id="film-light" data-film-option="light" data-light-cinematic data-light-reduced aria-labelledby="light-cinematic-title"><header><p>03 / {locale === 'en' ? 'LIGHT INTO INSIGHT' : 'DE LA LUZ A LA CLARIDAD'}</p><h2 id="light-cinematic-title">{locale === 'en' ? 'Follow the sample.' : 'Sigue la muestra.'}</h2></header><ol>{scenes.map((scene, i) => <li key={scene.id} data-light-static={i}><img src={scene.poster} width={scene.frameWidth} height={scene.frameHeight} alt={i === 2 ? locale === 'en' ? 'Recorded real EVA dashboard with fictional example data in Spanish.' : 'Grabación del panel real EVA con datos de ejemplo ficticios en español.' : ''} loading="lazy"/><div><LightText index={i} text={text} locale={locale}/></div></li>)}</ol></section>;

  return <section ref={root} className="light-cinematic light-cinematic-scroll" id="film-light" data-film-option="light" data-light-cinematic aria-labelledby="light-cinematic-title">
    <div className="light-cinematic-stage" data-light-stage>
      <img className="light-first-frame" src={scenes[0].poster} alt="" aria-hidden="true"/>
      <canvas data-light-canvas aria-hidden="true" width="1440" height="900" style={{visibility: 'hidden'}}/>
      <div className="light-readable-shade" aria-hidden="true"/>
      <header className="light-cinematic-heading"><p>03 / {locale === 'en' ? 'LIGHT INTO INSIGHT' : 'DE LA LUZ A LA CLARIDAD'}</p><h2 id="light-cinematic-title">{locale === 'en' ? 'Follow the sample.' : 'Sigue la muestra.'}</h2><span>{ready ? locale === 'en' ? 'Scroll to discover' : 'Desplázate para descubrir' : text.pending}</span></header>
      <div className="light-copy-rail">{text.scenes.map((scene, i) => <div key={scene.short} data-light-caption={i} className="light-copy" aria-hidden={i !== 0} style={{visibility: i === 0 ? 'visible' : 'hidden'}}><LightText index={i} text={text} locale={locale}/></div>)}</div>
      <nav className="light-step-shortcuts" aria-label={locale === 'en' ? 'Explore the three steps' : 'Explora los tres pasos'}>{text.scenes.map((scene, i) => <button type="button" key={scene.short} data-light-jump={i} aria-pressed={i === 0} aria-current={i === 0 ? 'step' : undefined} onClick={() => jump(i)}><span>{String(i + 1).padStart(2, '0')}</span>{scene.short}<i aria-hidden="true"/></button>)}</nav>
      <div className="light-paper" data-light-paper data-paper-inset={`${paperInset.left},${paperInset.top},${1 - paperInset.left - paperInset.right},${1 - paperInset.top - paperInset.bottom}`} aria-hidden="true" style={{visibility: 'hidden'}}><div className="light-paper-backing" style={{left: `${paperInset.left * 100}%`, top: `${paperInset.top * 100}%`, right: `${paperInset.right * 100}%`, bottom: `${paperInset.bottom * 100}%`, background: mediaManifest.carrier.backingColor}}/><img src={mediaManifest.carrier.src} alt="" draggable={false}/></div>
      <div className="light-source-posters" aria-hidden="true">{scenes.map(scene => <img key={scene.id} data-light-source-poster src={scene.poster} alt="" loading="eager" decoding="async"/>)}</div>
    </div>
    <ol className="sr-only" data-light-transcript>{text.scenes.map(scene => <li key={scene.short}><h3>{scene.title}</h3><p>{scene.long}</p></li>)}</ol>
  </section>;
}
