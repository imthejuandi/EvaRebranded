'use client';

import {useEffect, useRef, useState} from 'react';
import type {StoryScrollDriver} from '@/lib/story-scroll-driver';
import {storyMotion} from '@/lib/story-motion';
import {TassoVideoProcess} from './TassoVideoProcess';

/** Accessible sibling of the decorative Remotion player, so buttons are real page controls. */
export function TassoHomeVideo({driver, variant, visible = true}: {driver: StoryScrollDriver; variant: 'clean' | 'labelled'; visible?: boolean}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let previous: boolean | null = null, previousInteractive: boolean | null = null;
    const update = (frame: number) => {
      const y = storyMotion(frame).productY;
      element.style.transform = `translate3d(0,${y * 100}%,0)`;
      element.style.visibility = !visible || Math.abs(y) >= 1 ? 'hidden' : 'visible';
      // Keep real-time playback running throughout the visible scene transition.
      // Keyboard controls stay inert while the section is partly out of view.
      const next = visible && Math.abs(y) < 1;
      const interactive = visible && frame >= 275 && frame <= 470;
      if (interactive !== previousInteractive) {
        previousInteractive = interactive;
        element.inert = !interactive;
        element.setAttribute('aria-hidden', String(!interactive));
      }
      if (next !== previous) {previous = next; setActive(next);}
    };
    update(driver.current);
    return driver.subscribe(update);
  }, [driver, visible]);
  return <div ref={root} className="tasso-home-video" style={{visibility: 'hidden', transform: 'translate3d(0,100%,0)'}} inert aria-hidden="true">
    <TassoVideoProcess active={active} variant={variant} edition="original" appearance="black"/>
  </div>;
}
