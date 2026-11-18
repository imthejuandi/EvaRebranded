'use client';

import {useEffect, useRef, useState} from 'react';
import {TassoVideoProcess} from './TassoVideoProcess';

/** The collection film plays at native speed when its page section is visible. */
export function TassoHomeVideo({variant}: {variant: 'clean' | 'labelled'}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setActive(entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={root} className="collection-video">
    <TassoVideoProcess active={active} variant={variant} edition="original" appearance="black"/>
  </div>;
}
