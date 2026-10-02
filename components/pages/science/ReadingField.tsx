'use client';

import {useEffect, useRef} from 'react';

export type ReadingMode = 'measurement' | 'reference' | 'source';
const digits: Record<string, string[]> = {
  '0': ['01110','11011','11011','11011','11011','11011','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','11011','00011','00110','01100','11000','11111'],
  '3': ['11110','00011','00011','01110','00011','00011','11110'],
  '4': ['00011','00111','01111','11011','11111','00011','00011'],
  '5': ['11111','11000','11110','00011','00011','11011','01110'],
  '6': ['01110','11000','11110','11011','11011','11011','01110'],
  '7': ['11111','00011','00110','00110','01100','01100','01100'],
  '8': ['01110','11011','11011','01110','11011','11011','01110'],
  '9': ['01110','11011','11011','01111','00011','00011','01110'],
};
type Point = {x: number; y: number; r: number};
const count = 176;

function target(mode: ReadingMode, value: string): Point[] {
  if (mode === 'measurement') {
    const ink: Point[] = [];
    value.split('').forEach((digit, d) => (digits[digit] || digits['0']).forEach((line, row) => line.split('').forEach((cell, col) => {
      if (cell === '1') ink.push({x: 195 + d * 115 + col * 19, y: 43 + row * 22, r: col === 0 || col === 4 ? 4.2 : 5.4});
    })));
    return Array.from({length: count}, (_, i) => ({...ink[i % ink.length], r: i < ink.length ? ink[i].r : 0}));
  }
  if (mode === 'reference') return Array.from({length: count}, (_, i) => {
    if (i < 120) return {x: 95 + (i % 40) * 10.5, y: 113 + Math.floor(i / 40) * 12, r: 2.1 + Math.sin(i / 9) * .5};
    if (i < 144) return {x: i % 2 ? 96 : 505, y: 60 + (i % 12) * 12, r: 3.5};
    return {x: 320 + (i % 4) * 7, y: 86 + Math.floor((i - 144) / 4) * 10, r: 2.4};
  });
  return Array.from({length: count}, (_, i) => {
    const row = Math.floor(i / 16), col = i % 16;
    return {x: 194 + col * 14, y: 42 + row * 16, r: row === 0 || row === 10 || col === 0 || col === 15 ? 3.1 : row % 3 === 0 && col < 12 ? 2.2 : .75};
  });
}

/** A finite, interruptible morph. No idle loop or full-screen canvas. */
export default function ReadingField({mode, value}: {mode: ReadingMode; value: string}) {
  const host = useRef<SVGSVGElement>(null);
  const current = useRef<Point[]>(target('measurement', value));
  const first = useRef(true);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const nodes = [...element.querySelectorAll('circle')];
    const to = target(mode, value);
    const from = first.current ? Array.from({length: count}, (_, i) => ({x: 30 + (i % 22) * 25.8, y: 105 + Math.sin(i % 22 * .31 + Math.floor(i / 22) * .5) * 60 + Math.floor(i / 22) * 7, r: 1.6 + (i % 5) * .35})) : current.current;
    first.current = false;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, origin = 0, elapsed = 0, visible = false, done = false;
    const paint = (t: number) => {
      const eased = 1 - (1 - t) ** 3;
      current.current = to.map((dot, i) => ({x: from[i].x + (dot.x - from[i].x) * eased, y: from[i].y + (dot.y - from[i].y) * eased + Math.sin(t * Math.PI) * Math.sin(i * .35) * 25, r: from[i].r + (dot.r - from[i].r) * eased}));
      nodes.forEach((node, i) => {const dot = current.current[i]; node.setAttribute('cx', dot.x.toFixed(2)); node.setAttribute('cy', dot.y.toFixed(2)); node.setAttribute('r', Math.max(0, dot.r).toFixed(2));});
    };
    const tick = (time: number) => {
      if (!origin) origin = time - elapsed;
      elapsed = time - origin;
      const t = Math.min(1, elapsed / 1150);
      paint(t);
      if (t < 1 && visible && !document.hidden) frame = requestAnimationFrame(tick);
      else if (t === 1) {done = true; first.current = false;}
    };
    const run = () => {cancelAnimationFrame(frame); origin = 0; if (media.matches) {paint(1); done = true; first.current = false;} else if (visible && !document.hidden && !done) frame = requestAnimationFrame(tick);};
    const observer = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; run();}, {threshold: .15});
    paint(media.matches ? 1 : 0);
    observer.observe(element); document.addEventListener('visibilitychange', run); media.addEventListener('change', run);
    if (media.matches) run();
    return () => {cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener('visibilitychange', run); media.removeEventListener('change', run);};
  }, [mode, value]);
  return <svg ref={host} className="science-reading-field" viewBox="0 0 600 250" fill="none" aria-hidden="true">
    <path d="M32 22h18M32 22v18M568 22h-18M568 22v18M32 228h18M32 228v-18M568 228h-18M568 228v-18" stroke="#6c5b6d45"/>
    {current.current.map((dot, i) => <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={i % 7 === 0 ? '#b36f53' : '#55475c'}/>)}
  </svg>;
}
