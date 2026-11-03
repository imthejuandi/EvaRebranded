'use client';

import {useEffect, useRef, useState} from 'react';
import type {StoryScrollDriver} from '@/lib/story-scroll-driver';
import {storyMotion} from '@/lib/story-motion';
import {TassoVideoProcess} from './TassoVideoProcess';

/** Accessible sibling of the decorative Remotion player, so buttons are real page controls. */
export function TassoHomeVideo({driver, variant}: {driver: StoryScrollDriver; variant: 'clean' | 'labelled'}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let previous = false;
    const update = (frame: number) => {
      const y = storyMotion(frame).productY;
      element.style.transform = `translate3d(0,${y * 100}%,0)`;
      element.style.visibility = Math.abs(y) >= 1 ? 'hidden' : 'visible';
      const next = frame >= 275 && frame <= 470;
      element.inert = !next;
      element.setAttribute('aria-hidden', String(!next));
      if (next !== previous) {previous = next; setActive(next);}
    };
    update(driver.current);
    return driver.subscribe(update);
  }, [driver]);
  return <div ref={root} className="tasso-home-video" style={{visibility: 'hidden', transform: 'translate3d(0,100%,0)'}} inert={!active} aria-hidden={!active}>
    <TassoVideoProcess active={active} variant={variant}/>
  </div>;
}
