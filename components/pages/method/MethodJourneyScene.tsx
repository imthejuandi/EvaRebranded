'use client';
import {useEffect, useRef, useState, type ComponentType, type RefObject} from 'react';
import type {PlayerRef} from '@remotion/player';
import {closestStoryChapter} from '@/components/engagement/SourceStory';
import type {SampleStage} from './SampleToRecord';
import {METHOD_CHAPTER_FRAMES, METHOD_FRAMES} from './method-journey-motion';
import {MethodJourneyArtwork} from './MethodJourneyArtwork';
import './method-journey-scene.css';
type Runtime = ComponentType<{playerRef: RefObject<PlayerRef | null>; mobile: boolean}>;

/** Document-scroll composition. The closest-breakpoint chapter mapping is retained
 * from EVA's actual 21st 952 / Aceternity adaptation in SourceStory. */
export default function MethodJourneyScene({stages}: {stages: readonly SampleStage[]}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const lastFrame = useRef(0);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [Runtime, setRuntime] = useState<Runtime | null>(null);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: no-preference)');
    const sync = () => {setEnhanced(media.matches); setMobile(innerWidth < 760);};
    sync(); media.addEventListener('change', sync); window.addEventListener('resize', sync);
    return () => {media.removeEventListener('change', sync); window.removeEventListener('resize', sync);};
  }, []);
  useEffect(() => {
    if (!enhanced || Runtime) return;
    let cancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      import('./MethodJourneyRuntime').then(module => {if (!cancelled) setRuntime(() => module.default);}).catch(() => {if (!cancelled) setEnhanced(false);});
      observer.disconnect();
    }, {rootMargin:'400px'});
    if (root.current) observer.observe(root.current);
    return () => {cancelled = true; observer.disconnect();};
  }, [enhanced, Runtime]);
  useEffect(() => {
    if (!enhanced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.hidden || !root.current || !stage.current) return;
      const box = root.current.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const top = Number.parseFloat(getComputedStyle(stage.current).top) || 0;
      const p = Math.max(0, Math.min(1, (top - box.top) / Math.max(1, box.height - stage.current.clientHeight)));
      lastFrame.current = Math.round(p * (METHOD_FRAMES - 1));
      player.current?.seekTo(lastFrame.current);
      stage.current.style.setProperty('--journey-progress', String(p));
      stage.current.dataset.journeyFrame = String(lastFrame.current);
      setActive(closestStoryChapter(p, [0, 1 / 3, 2 / 3, 1]));
    };
    const schedule = () => {if (!frame) frame = requestAnimationFrame(update);};
    schedule(); window.addEventListener('scroll', schedule, {passive:true}); window.addEventListener('resize', schedule); document.addEventListener('visibilitychange', schedule);
    return () => {cancelAnimationFrame(frame); window.removeEventListener('scroll',schedule); window.removeEventListener('resize',schedule); document.removeEventListener('visibilitychange',schedule);};
  }, [enhanced, Runtime]);
  function go(index: number) {
    if (!root.current || !stage.current) return;
    const top = Number.parseFloat(getComputedStyle(stage.current).top) || 0;
    window.scrollTo({top:root.current.getBoundingClientRect().top + scrollY - top + (root.current.offsetHeight - stage.current.clientHeight) * index / 3,behavior:'smooth'});
  }
  return <div ref={root} className="method-world" data-enhanced={enhanced}>
    {enhanced ? <div ref={stage} className="method-world-stage" data-journey-frame="0">
      <div className="method-world-topline"><span>UNA MUESTRA / UN RECORRIDO</span><span>0{active+1} — 04</span></div>
      <div className="method-world-visual" aria-hidden="true">{Runtime ? <Runtime playerRef={player} mobile={mobile}/> : <MethodJourneyArtwork/>}</div>
      <div className="method-world-reading">{stages.map((item,index)=><article key={item.id} data-active={index===active} aria-hidden={index!==active}><p className="method-world-place"><span>0{index+1}</span>{item.place}</p><h3>{item.title}</h3><p className="method-world-body">{item.body}</p><p className="method-world-detail">{item.detail}</p></article>)}</div>
      <nav className="method-world-navigation" aria-label="Capítulos del recorrido">{stages.map((item,index)=><button key={item.id} type="button" aria-current={active===index?'step':undefined} onClick={()=>go(index)}><span>0{index+1}</span>{item.short}</button>)}</nav>
      <div className="method-world-progress" aria-hidden="true"><i/></div>
    </div> : <div className="method-world-static">{stages.map((item,index)=><article key={item.id} id={`method-step-${item.id}`}><div><p className="method-world-place"><span>0{index+1}</span>{item.place}</p><h3>{item.title}</h3><p>{item.body}</p><p className="method-world-detail">{item.detail}</p></div><MethodJourneyArtwork frame={METHOD_CHAPTER_FRAMES[index]}/></article>)}</div>}
  </div>;
}
