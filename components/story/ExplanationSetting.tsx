'use client';

import {useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent} from 'react';
import {createPortal} from 'react-dom';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {explanationLevels, resultExplanationCopy, type ExplanationLevel} from '@/lib/site-content/result-explanation-copy';
import './explanation-setting.css';

type Placement = {left: number; top: number; width: number; maxHeight: number; calm: boolean};
const MENU_HEIGHT = 182;

/** One signup preference, previewed through a contemporary, keyboard-accessible picker. */
export function ExplanationSetting({level, onLevel, showHint=true}: {level: ExplanationLevel; onLevel: (level: ExplanationLevel) => void; showHint?:boolean}) {
  const {locale} = useSiteLanguage(), c = resultExplanationCopy[locale], id = useId();
  const trigger = useRef<HTMLButtonElement>(null), menu = useRef<HTMLDivElement>(null);
  const options = useRef<Array<HTMLButtonElement | null>>([]);
  const scrollAtOpen = useRef<{x: number; y: number; ancestors: Map<Element, {x: number; y: number}>} | null>(null);
  const [open, setOpen] = useState(false), [activeIndex, setActiveIndex] = useState(0);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const close = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus({preventScroll: true});
  }, []);
  const positionMenu = useCallback(() => {
    const button = trigger.current;
    if (!button) return;
    const rect = button.getBoundingClientRect(), gutter = 12, gap = 8;
    const viewportWidth = document.documentElement.clientWidth, viewportHeight = window.innerHeight;
    const width = Math.min(Math.max(rect.width, 280), viewportWidth - gutter * 2);
    const maxHeight = Math.max(100, viewportHeight - gutter * 2);
    const height = Math.min(MENU_HEIGHT, maxHeight);
    const below = viewportHeight - rect.bottom - gutter - gap;
    const above = rect.top - gutter - gap;
    const idealTop = below >= height || below >= above ? rect.bottom + gap : rect.top - height - gap;
    setPlacement({
      left: Math.max(gutter, Math.min(rect.left, viewportWidth - width - gutter)),
      top: Math.max(gutter, Math.min(idealTop, viewportHeight - height - gutter)),
      width, maxHeight,
      calm: !!button.closest('[data-calm="true"], .bio-calm'),
    });
  }, []);
  const openMenu = (index = Math.max(0, explanationLevels.indexOf(level))) => {
    // A click can scroll the trigger into view before opening; its scroll event may
    // arrive after the menu mounts. Snapshot positions rather than treating that
    // queued event as a new scroll gesture.
    const ancestors = new Map<Element, {x: number; y: number}>();
    for (let element = trigger.current?.parentElement; element; element = element.parentElement) ancestors.set(element, {x: element.scrollLeft, y: element.scrollTop});
    scrollAtOpen.current = {x: window.scrollX, y: window.scrollY, ancestors};
    positionMenu(); setActiveIndex(index); setOpen(true);
  };
  const choose = (index: number) => {
    onLevel(explanationLevels[index]); close(true);
  };

  useLayoutEffect(() => {
    if (!open) return;
    const item = options.current[activeIndex], list = menu.current;
    item?.focus({preventScroll: true});
    // Keep keyboard movement visible inside a short popup without scrolling the page.
    if (item && list) {
      const top = item.offsetTop, bottom = top + item.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
    }
  }, [open, activeIndex, placement?.maxHeight]);

  useEffect(() => {
    if (!open) return;
    let resizeFrame = 0;
    const inside = (target: EventTarget | null) => target instanceof Node && (trigger.current?.contains(target) || menu.current?.contains(target));
    const pointer = (event: PointerEvent) => {if (!inside(event.target)) close();};
    const focus = (event: FocusEvent) => {if (!inside(event.target)) close();};
    const scroll = (event: Event) => {
      // A very short viewport may scroll the list itself. Page scroll dismisses it.
      if (event.target instanceof Node && menu.current?.contains(event.target)) return;
      const snapshot = scrollAtOpen.current;
      if (!snapshot) return;
      const moved = (x: number, y: number, previous: {x: number; y: number}) => Math.abs(x - previous.x) > .25 || Math.abs(y - previous.y) > .25;
      const pageMoved = moved(window.scrollX, window.scrollY, snapshot);
      const ancestor = event.target instanceof Element ? snapshot.ancestors.get(event.target) : undefined;
      const ancestorMoved = !!ancestor && event.target instanceof Element && moved(event.target.scrollLeft, event.target.scrollTop, ancestor);
      if (pageMoved || ancestorMoved) close(true);
    };
    const resize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(positionMenu);
    };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('focusin', focus);
    window.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', resize, {passive: true});
    window.visualViewport?.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(resizeFrame);
      document.removeEventListener('pointerdown', pointer);
      document.removeEventListener('focusin', focus);
      window.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
    };
  }, [open, close, positionMenu]);

  const menuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (event.key === 'ArrowDown') next = (activeIndex + 1) % explanationLevels.length;
    if (event.key === 'ArrowUp') next = (activeIndex + explanationLevels.length - 1) % explanationLevels.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = explanationLevels.length - 1;
    if (next !== null) {event.preventDefault(); setActiveIndex(next); return;}
    if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); choose(activeIndex); return;}
    if (event.key === 'Escape') {event.preventDefault(); event.stopPropagation(); close(true); return;}
    if (event.key === 'Tab') {
      // The portal lives at body end. Return to the trigger before native Tab navigation.
      trigger.current?.focus({preventScroll: true}); setOpen(false); return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const letter = event.key.toLocaleLowerCase(locale);
      const index = explanationLevels.findIndex((_, index) => c.levels[explanationLevels[(activeIndex + 1 + index) % explanationLevels.length]].toLocaleLowerCase(locale).startsWith(letter));
      if (index >= 0) {event.preventDefault(); setActiveIndex((activeIndex + 1 + index) % explanationLevels.length);}
    }
  };

  return <div className="explanation-setting">
    <button ref={trigger} type="button" className="explanation-setting-trigger" aria-label={`${c.settingLabel}: ${c.levels[level]}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={id + '-menu'} aria-describedby={showHint ? id + '-hint' : undefined} onClick={() => open ? close(true) : openMenu()} onKeyDown={event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {event.preventDefault(); openMenu();}
      if (event.key === 'Home' || event.key === 'End') {event.preventDefault(); openMenu(event.key === 'Home' ? 0 : explanationLevels.length - 1);}
    }}>
      <span className="explanation-setting-lamp" aria-hidden="true"/>
      <span className="explanation-setting-current">{c.levels[level]}</span>
      <svg className="explanation-setting-chevron" width="16" height="16" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    {showHint && <p id={id + '-hint'}>{c.settingHint}</p>}
    {open && placement && createPortal(<div ref={menu} id={id + '-menu'} role="listbox" aria-label={c.settingLabel} className="explanation-setting-menu" data-calm={placement.calm} style={{left: placement.left, top: placement.top, width: placement.width, maxHeight: placement.maxHeight}} onKeyDown={menuKey}>
      {explanationLevels.map((depth, index) => <button ref={element => {options.current[index] = element;}} type="button" role="option" aria-selected={level === depth} tabIndex={-1} key={depth} className="explanation-setting-option" data-active={index === activeIndex} onPointerEnter={event => {if (event.pointerType !== 'touch') setActiveIndex(index);}} onClick={() => choose(index)}>
        <span><strong>{c.levels[depth]}</strong><small>{c.benefits[depth]}</small></span>
        <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true" style={{opacity: level === depth ? 1 : 0}}><path d="m4.5 10 3.6 3.6L15.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>)}
    </div>, document.body)}
  </div>;
}
