'use client';

import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import './SourceStory.css';

/** Adapted for the EVA end product from Manu Arora / Aceternity StickyScroll,
 * retrieved via 21st, result 952. Retains closest-breakpoint reduction,
 * content-to-activeCard mapping and the sticky composition.
 * https://21st.dev/@manuarora700/components/sticky-scroll-reveal
 * License: https://ui.aceternity.com/licence (modified end-product use;
 * not a redistributable component/template). Full provenance in
 * outputs/eva-refinement-2026-09-18/public-story-implementation.md.
 * EVA replaces Framer/container scrolling with the document, measured chapter
 * positions, direct controls and readable in-flow mobile/reduced-motion scenes.
 */
export function closestStoryChapter(latest: number, cardsBreakpoints: readonly number[]) {
  return cardsBreakpoints.reduce((acc, breakpoint, index) => {
    const distance = Math.abs(latest - breakpoint);
    if (distance < Math.abs(latest - cardsBreakpoints[acc])) return index;
    return acc;
  }, 0);
}

export type SourceChapter = {id: string; label: string; title: string; body: ReactNode; detail?: ReactNode; visual: ReactNode};

export function SourceStory({chapters, renderVisual, className = '', label}: {
  chapters: readonly SourceChapter[];
  renderVisual?: (index: number) => ReactNode;
  className?: string;
  label: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [manual, setManual] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const articles = useRef<Array<HTMLElement | null>>([]);
  const id = useId().replaceAll(':', '');
  useEffect(() => {
    const media = matchMedia('(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setEnhanced(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (!enhanced || manual) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (document.hidden || !root.current) return;
      const bounds = root.current.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const positions = articles.current.map(item => {
        const box = item?.getBoundingClientRect();
        return box ? box.top + box.height / 2 : 0;
      });
      const span = Math.max(1, positions.at(-1)! - positions[0]);
      const cardsBreakpoints = positions.map(position => (position - positions[0]) / span);
      setActiveCard(closestStoryChapter((innerHeight * .52 - positions[0]) / span, cardsBreakpoints));
    };
    const schedule = () => {if (!frame) frame = requestAnimationFrame(update);};
    schedule(); window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule); document.addEventListener('visibilitychange', schedule);
    return () => {cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); document.removeEventListener('visibilitychange', schedule);};
  }, [enhanced, manual, chapters.length]);

  if (!chapters.length) return null;
  return <div ref={root} className={`source-story ${className}`} data-enhanced={enhanced}>
    <div className="source-story-copy">
      {chapters.map((item, index) => <article key={item.id} id={item.id} ref={node => {articles.current[index] = node;}} data-current={activeCard === index}>
        <p className="source-story-index"><span>0{index + 1}</span>{item.label}</p><h3>{item.title}</h3><div className="source-story-body">{item.body}</div>
        <div className="source-story-inline">{item.visual}</div>
        {item.detail && <div className="source-story-detail">{item.detail}</div>}
      </article>)}
    </div>
    {enhanced && <aside className="source-story-stage" aria-label={label}>
      <div className="source-story-controls" role="group" aria-label="Elegir un capítulo">{chapters.map((item, index) => <button key={item.id} type="button" aria-pressed={activeCard === index} aria-controls={`${id}-visual`} onClick={() => {setManual(true); setActiveCard(index);}}><span>0{index + 1}</span>{item.label}</button>)}</div>
      <div className="source-story-visual" id={`${id}-visual`}>{renderVisual ? renderVisual(activeCard) : chapters[activeCard].visual}</div>
      <div className="source-story-current" aria-live={manual ? 'polite' : 'off'}>{chapters[activeCard].title}</div>
      <button className="source-story-follow" type="button" onClick={() => setManual(!manual)} aria-pressed={!manual}>{manual ? 'Seguir el recorrido al desplazar' : 'Fijar este capítulo'}</button>
    </aside>}
  </div>;
}
