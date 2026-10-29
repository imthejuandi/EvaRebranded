'use client';

import {useEffect, useRef, useState} from 'react';
import manifest from '@/lib/site-content/tasso-scroll-options.json';
import {TassoAtlasCache, tassoAtlasRequest, tassoScrollPose, type TassoAtlasScene} from '@/lib/tasso-scroll-atlas';
import {tassoScrollCopy, type TassoScrollCopy} from './tasso-scroll-copy';
import {useSiteLanguage} from './SiteLanguage';
import './tasso-film-options.css';

const optionIds = ['original', 'studio', 'morning', 'light'] as const;
type OptionId = typeof optionIds[number];
const jumpProgress = [.20, .52, .86];
const dashboard = manifest.dashboard;

function DirectionGlyph({kind}: {kind: 'back' | 'out' | 'down'}) {
  const path = kind === 'back' ? 'M13 8H3m5-5L3 8l5 5' : kind === 'down' ? 'M8 2v12m-5-5 5 5 5-5' : 'M3 13 13 3M4 3h9v9';
  return <svg className="tasso-film-direction-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false"><path d={path}/></svg>;
}

function DashboardStill({locale}: {locale: 'en' | 'es'}) {
  return dashboard.ready && dashboard.src ? <img data-tasso-dashboard src={dashboard.src} width={dashboard.width} height={dashboard.height} loading="eager" decoding="async" alt={locale === 'en' ? 'Actual EVA dashboard preview in Spanish, showing the existing biological signature and example data.' : 'Vista previa real del panel EVA, con la firma biológica existente y datos de ejemplo.'}/> : <div className="tasso-sequence-pending"><p>{locale === 'en' ? 'Dashboard capture in preparation' : 'Captura del panel en preparación'}</p></div>;
}

function StepCaption({index, text, locale}: {index: number; text: TassoScrollCopy; locale: 'en' | 'es'}) {
  const scene = text.scenes[index];
  return <><div><p className="tasso-scroll-step-label">{String(index + 1).padStart(2, '0')} / {scene.short}</p><h3>{scene.title}</h3></div><div><p className="tasso-scroll-caption-body">{scene.caption}</p><p className="tasso-scroll-caption-detail">{scene.detail}</p>{index === 2 ? <div className="tasso-dashboard-context"><span>{locale === 'en' ? 'Actual dashboard · example data · Spanish interface' : 'Panel real · datos de ejemplo · interfaz en español'}</span><a href="/es/dashboard">{locale === 'en' ? 'Open the actual dashboard' : 'Abrir el panel real'}<DirectionGlyph kind="out"/></a></div> : null}</div></>;
}

function OptionHeading({id, index, text, ready}: {id: OptionId; index: number; text: TassoScrollCopy; ready: boolean}) {
  const option = text.options[id];
  return <header className="tasso-scroll-option-heading"><div className="tasso-scroll-option-meta"><span>{String(index).padStart(2, '0')}</span><p>{id === 'original' ? text.current : text.study}</p><span className={ready ? 'tasso-scroll-ready is-ready' : 'tasso-scroll-ready'}>{ready ? text.ready : text.pending}</span></div><div className="tasso-scroll-direction"><div><h2 id={`film-${id}-title`}>{option.title}</h2><p>{option.pitch}</p></div><span>{option.description}</span></div></header>;
}

function ScrollOption({id, index, text, locale, reduced}: {id: OptionId; index: number; text: TassoScrollCopy; locale: 'en' | 'es'; reduced: boolean}) {
  const section = useRef<HTMLElement>(null);
  const scenes: TassoAtlasScene[] = manifest.options.find(item => item.id === id)?.scenes ?? [];
  const ready = scenes.length === 2 && scenes.every(item => item.ready && item.poster && item.atlases.length) && dashboard.ready;
  const jump = (i: number) => {
    const element = section.current;
    if (!element) return;
    if (reduced) {element.querySelector<HTMLElement>(`[data-tasso-static-step="${i}"]`)?.scrollIntoView({behavior: 'instant', block: 'start'}); return;}
    const stage = element.querySelector<HTMLElement>('[data-tasso-scroll-stage]');
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({top: top + Math.max(0, element.offsetHeight - (stage?.offsetHeight ?? window.innerHeight)) * jumpProgress[i], behavior: 'instant'});
  };

  if (reduced) return <section ref={section} className="tasso-scroll-static-option" id={`film-${id}`} aria-labelledby={`film-${id}-title`} data-film-option={id} data-tasso-reduced>
    <OptionHeading id={id} index={index} text={text} ready={ready}/>
    <ol className="tasso-scroll-static-states">{text.scenes.map((scene, i) => <li key={scene.short} data-tasso-static-step={i}>
      <div className="tasso-scroll-static-art">{i === 2 ? <DashboardStill locale={locale}/> : scenes[i]?.ready && scenes[i].poster ? <img src={scenes[i].poster} width={scenes[i].frameWidth} height={scenes[i].frameHeight} loading="lazy" decoding="async" alt=""/> : <div className="tasso-sequence-pending"><p>{text.pending}</p></div>}</div>
      <div className="tasso-scroll-static-caption"><StepCaption index={i} text={text} locale={locale}/></div>
    </li>)}</ol>
  </section>;

  return <section ref={section} className="tasso-scroll-option" id={`film-${id}`} aria-labelledby={`film-${id}-title`} data-film-option={id}>
    <div className="tasso-scroll-stage" data-tasso-scroll-stage>
      <OptionHeading id={id} index={index} text={text} ready={ready}/>
      <div className="tasso-scroll-visual" data-tasso-scroll-visual>
        {text.scenes.map((scene, i) => <div key={scene.short} className="tasso-scroll-layer" data-tasso-scroll-layer={i} aria-hidden="true" style={{opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden'}}>
          {i === 2 ? <DashboardStill locale={locale}/> : scenes[i]?.ready && scenes[i].poster ? <><img className="tasso-atlas-poster" src={scenes[i].poster} width={scenes[i].frameWidth} height={scenes[i].frameHeight} loading="lazy" decoding="async" alt=""/><canvas data-tasso-atlas-canvas data-sequence-scene={scenes[i].id} data-sequence-index={i} width={scenes[i].frameWidth} height={scenes[i].frameHeight} aria-hidden="true" style={{opacity: 0}}/></> : <div className="tasso-sequence-pending"><p>{text.pending}</p><span>{text.pendingBody}</span></div>}
        </div>)}
      </div>
      <div className="tasso-scroll-caption-stack">{text.scenes.map((scene, i) => <div className="tasso-scroll-caption" key={scene.short} data-tasso-scroll-caption={i} aria-hidden={i !== 0} style={{opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden'}}><StepCaption index={i} text={text} locale={locale}/></div>)}</div>
      <nav className="tasso-scroll-jumps" aria-label={`${text.selectScene}: ${text.options[id].title}`}>{text.scenes.map((scene, i) => <button type="button" key={scene.short} data-tasso-jump={i} aria-pressed={i === 0} aria-current={i === 0 ? 'step' : undefined} onClick={() => jump(i)}><span>{String(i + 1).padStart(2, '0')}</span>{scene.short}<i aria-hidden="true"/></button>)}</nav>
      <div className="tasso-scroll-option-footer"><p>{locale === 'en' ? 'Scroll to explore. Reverse to revisit.' : 'Desplázate para explorar. Vuelve atrás para repetir.'}</p><a href={index < 3 ? `#film-${optionIds[index + 1]}` : '#tasso-process-notes'}>{index < 3 ? locale === 'en' ? 'Next direction' : 'Siguiente dirección' : text.transcript}<DirectionGlyph kind="down"/></a></div>
    </div>
    <ol className="sr-only" data-tasso-scroll-transcript>{text.scenes.map(scene => <li key={scene.short}><h3>{scene.title}</h3><p>{scene.long}</p></li>)}</ol>
  </section>;
}

type Binding = {
  id: OptionId; element: HTMLElement; stage: HTMLElement; top: number; span: number;
  layers: HTMLElement[]; captions: HTMLElement[]; buttons: HTMLButtonElement[];
  canvases: HTMLCanvasElement[]; scenes: TassoAtlasScene[]; dashboard: HTMLImageElement | null;
};

/** One native scroll subscription for the complete comparison. */
function useScrollAtlases(root: React.RefObject<HTMLDivElement | null>, reduced: boolean, locale: 'en' | 'es') {
  useEffect(() => {
    const element = root.current;
    if (!element || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const comparison = element;
    let raf = 0, disposed = false, mobile = window.innerWidth <= 700;
    let cache: TassoAtlasCache;
    const bindings: Binding[] = [];
    const schedule = () => {if (!disposed && !raf && !document.hidden) raf = requestAnimationFrame(paint);};
    cache = new TassoAtlasCache(schedule);

    for (const option of element.querySelectorAll<HTMLElement>('.tasso-scroll-option[data-film-option]')) {
      const id = option.dataset.filmOption as OptionId;
      const stage = option.querySelector<HTMLElement>('[data-tasso-scroll-stage]');
      if (!stage) continue;
      bindings.push({id, element: option, stage, top: 0, span: 1,
        layers: Array.from(option.querySelectorAll<HTMLElement>('[data-tasso-scroll-layer]')),
        captions: Array.from(option.querySelectorAll<HTMLElement>('[data-tasso-scroll-caption]')),
        buttons: Array.from(option.querySelectorAll<HTMLButtonElement>('[data-tasso-jump]')),
        canvases: Array.from(option.querySelectorAll<HTMLCanvasElement>('[data-tasso-atlas-canvas]')),
        scenes: manifest.options.find(item => item.id === id)?.scenes ?? [],
        dashboard: option.querySelector<HTMLImageElement>('[data-tasso-dashboard]'),
      });
    }

    const measure = () => {
      const nextMobile = window.innerWidth <= 700;
      if (nextMobile !== mobile) {cache.dispose(); cache = new TassoAtlasCache(schedule); mobile = nextMobile;}
      for (const binding of bindings) {
        binding.top = binding.element.getBoundingClientRect().top + window.scrollY;
        binding.span = Math.max(1, binding.element.offsetHeight - binding.stage.offsetHeight);
        for (const canvas of binding.canvases) {
          const scene = binding.scenes[Number(canvas.dataset.sequenceIndex)];
          if (!scene) continue;
          const width = Math.min(scene.frameWidth, mobile ? 600 : scene.frameWidth);
          canvas.width = width; canvas.height = Math.round(width * scene.frameHeight / scene.frameWidth);
          canvas.style.opacity = '0'; delete canvas.dataset.renderedFrame;
        }
      }
      schedule();
    };

    function paint() {
      raf = 0;
      if (disposed || document.hidden) return;
      const y = window.scrollY;
      // Only the closest visible sticky section requests decoded frames. Near
      // sections have native lazy posters; they never multiply the atlas cache.
      const active = bindings.find(binding => y >= binding.top - binding.stage.offsetHeight * .65 && y <= binding.top + binding.span + binding.stage.offsetHeight * .35);
      const requests: {binding: Binding; canvas: HTMLCanvasElement; scene: TassoAtlasScene; frame: number; request: NonNullable<ReturnType<typeof tassoAtlasRequest>>}[] = [];

      for (const binding of bindings) {
        const pose = tassoScrollPose((y - binding.top) / binding.span);
        binding.element.dataset.scrollProgress = pose.progress.toFixed(5);
        binding.element.dataset.scrollStep = String(pose.step);
        binding.layers.forEach((layer, i) => {layer.style.opacity = String(pose.opacity[i]); layer.style.visibility = pose.opacity[i] > 0 ? 'visible' : 'hidden';});
        binding.captions.forEach((caption, i) => {
          // Photographs dissolve together; only one sharp paragraph is painted.
          caption.style.opacity = i === pose.step ? '1' : '0'; caption.style.visibility = i === pose.step ? 'visible' : 'hidden';
          caption.setAttribute('aria-hidden', String(i !== pose.step));
        });
        binding.buttons.forEach((button, i) => {button.setAttribute('aria-pressed', String(i === pose.step)); if (i === pose.step) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');});
        if (binding.dashboard) binding.dashboard.style.transform = `scale(${pose.dashboardScale})`;
        if (binding !== active) continue;
        for (const canvas of binding.canvases) {
          const i = Number(canvas.dataset.sequenceIndex), scene = binding.scenes[i];
          if (!scene?.ready || pose.opacity[i] <= 0 || scene.frameCount <= 0 || scene.framesPerSheet <= 0) continue;
          const frame = Math.min(scene.frameCount - 1, Math.floor(pose.frames[i] * scene.frameCount));
          const request = tassoAtlasRequest(scene, frame, mobile);
          if (request) requests.push({binding, canvas, scene, frame, request});
        }
      }

      const prefetch = requests.length === 1 ? (() => {
        const current = requests[0], nextFrame = Math.min(current.scene.frameCount - 1, (Math.floor(current.frame / current.scene.framesPerSheet) + 1) * current.scene.framesPerSheet);
        return nextFrame !== current.frame ? tassoAtlasRequest(current.scene, nextFrame, mobile) : null;
      })() : null;
      const wanted = requests.map(item => item.request.key);
      if (prefetch && !wanted.includes(prefetch.key)) wanted.push(prefetch.key);
      cache.setWanted(wanted.slice(0, 2));
      for (const item of requests) {
        const {canvas, scene, frame, request} = item;
        const bitmap = cache.get(request.key);
        if (!bitmap) {cache.ensure(request); continue;}
        if (canvas.dataset.renderedFrame === String(frame) && canvas.dataset.atlasSrc === request.src) continue;
        const context = canvas.getContext('2d');
        if (!context) continue;
        const within = frame % scene.framesPerSheet, tileWidth = bitmap.width / scene.columns, tileHeight = bitmap.height / scene.rows;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bitmap, (within % scene.columns) * tileWidth, Math.floor(within / scene.columns) * tileHeight, tileWidth, tileHeight, 0, 0, canvas.width, canvas.height);
        canvas.style.opacity = '1';
        canvas.dataset.renderedFrame = String(frame); canvas.dataset.renderedScene = scene.id; canvas.dataset.atlasSrc = request.src;
      }
      if (prefetch) cache.ensure(prefetch);
      comparison.dataset.atlasCacheCount = String(cache.count); comparison.dataset.atlasCacheBytes = String(cache.decodedBytes);
    }

    const resize = new ResizeObserver(measure);
    resize.observe(element);
    for (const binding of bindings) resize.observe(binding.element);
    measure();
    void document.fonts.ready.then(() => {if (!disposed) measure();});
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', measure, {passive: true});
    const visible = () => {if (document.hidden) {cancelAnimationFrame(raf); raf = 0; cache.setWanted([]);} else {measure(); schedule();}};
    document.addEventListener('visibilitychange', visible);
    return () => {disposed = true; cancelAnimationFrame(raf); resize.disconnect(); cache.dispose(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); document.removeEventListener('visibilitychange', visible);};
  }, [root, reduced, locale]);
}

export default function TassoFilmOptions() {
  const {locale, href} = useSiteLanguage();
  const text = tassoScrollCopy[locale];
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {const query = matchMedia('(prefers-reduced-motion: reduce)'); const sync = () => setReduced(query.matches); sync(); query.addEventListener('change', sync); return () => query.removeEventListener('change', sync);}, []);
  useScrollAtlases(root, reduced, locale);

  return <div ref={root} className="tasso-film-comparison" data-tasso-film-comparison data-scroll-only data-reduced-motion={reduced}>
    <header className="tasso-film-intro"><a className="tasso-film-back" href={href('/es/review')}>{text.back}<DirectionGlyph kind="back"/></a><p className="tasso-film-eyebrow">{text.eyebrow}</p><h1>{text.title[0]}<br/><em>{text.title[1]}</em></h1><p className="tasso-film-introduction">{text.intro}</p><nav className="tasso-film-jump-nav" aria-label={text.choose}>{optionIds.map((id, index) => <a key={id} href={`#film-${id}`}><span>{String(index).padStart(2, '0')}</span>{text.options[id].title}<span aria-hidden="true"><DirectionGlyph kind="down"/></span></a>)}</nav><p className="tasso-film-current-note">{text.noSelection}</p></header>
    {optionIds.map((id, index) => <ScrollOption key={id} id={id} index={index} text={text} locale={locale} reduced={reduced}/>)}
    <section className="tasso-scroll-process-notes" id="tasso-process-notes"><h2>{text.sameJourney}</h2><p>{text.sameBody}</p><ol>{text.scenes.map((scene, i) => <li key={scene.short}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{scene.title}</h3><p>{scene.long}</p></div></li>)}</ol><div className="tasso-scroll-instructions"><p>{text.instructions}</p><a href="https://www.tassoinc.com/tassoplus-video" target="_blank" rel="noreferrer">{text.fullInstructions}<DirectionGlyph kind="out"/></a></div><span>{text.silent}</span></section>
  </div>;
}
