'use client';

import {createElement, useEffect, useRef, type HTMLAttributes, type ReactNode} from 'react';
import './EditorialReveal.css';

/*!
 * Adapted from Magic UI Blur Fade, discovered through 21st.dev:
 * https://21st.dev/@dillionverma/components/blur-fade
 * https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/blur-fade.tsx
 * The once-in-view duration/delay/offset contract is retained. EVA uses native
 * IntersectionObserver + WAAPI, readable starting text, no text blur, and a
 * separate photographic aperture. Source/provenance is recorded in
 * outputs/engagement-2026-09-18/21st. No Motion runtime is required.
 *
 * MIT License — Copyright (c) Magic UI
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

type RevealElement = 'div' | 'section' | 'article' | 'figure' | 'header' | 'span';
type EditorialRevealProps = HTMLAttributes<HTMLElement> & {
  as?: RevealElement;
  children: ReactNode;
  /** Seconds; all stagger delays are capped at 180ms. */
  duration?: number;
  delay?: number;
  offset?: number;
  inViewMargin?: string;
  /** Replay only when meaningful selected content changes, never on a timer. */
  replayKey?: string | number;
};

/** Mark text/rows with data-editorial-reveal, and an image window with
 * data-editorial-photo. Without marks the root receives one restrained reveal.
 * The unenhanced DOM is the final readable state; content is never hidden. */
export function EditorialReveal({as='div', children, className='', duration=.68, delay=0, offset=18, inViewMargin='0px 0px -6% 0px', replayKey, ...props}: EditorialRevealProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || !('IntersectionObserver' in window) || typeof element.animate !== 'function') return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const marked = Array.from(element.querySelectorAll<HTMLElement>('[data-editorial-reveal], [data-editorial-photo], [data-editorial-line]'));
    const targets = marked.length ? marked.filter(target => target.closest('.editorial-reveal') === element) : [element];
    const played = new Set<HTMLElement>();
    const animations = new Set<Animation>();
    const seconds = Math.min(1, Math.max(.2, duration));
    const distance = Math.min(26, Math.max(0, offset));

    const finishMotion = () => {
      for (const animation of animations) animation.cancel();
      animations.clear();
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches || document.hidden) continue;
        const target = entry.target as HTMLElement;
        if (played.has(target)) continue;
        played.add(target);
        observer.unobserve(target);
        if (target.contains(document.activeElement)) continue;
        const photograph = target.hasAttribute('data-editorial-photo');
        const line = target.hasAttribute('data-editorial-line');
        const index = targets.indexOf(target);
        const animation = target.animate(photograph ? [
          {clipPath:'inset(5% 6% round 3px)', transform:'scale(.985)'},
          {clipPath:'inset(0% 0% round 3px)', transform:'scale(1)'},
        ] : line ? [
          {transform:'scaleX(.15)'},
          {transform:'scaleX(1)'},
        ] : [
          {opacity:1, transform:`translateY(${distance}px)`},
          {opacity:1, transform:'translateY(0)'},
        ], {
          duration: (photograph ? Math.max(seconds, .85) : seconds) * 1000,
          delay: Math.min(180, Math.max(0, delay * 1000 + (photograph ? 0 : index * 45))),
          easing:'cubic-bezier(.22,1,.36,1)',
          fill:'none',
        });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, {rootMargin:inViewMargin, threshold:.12});

    const observe = () => {
      finishMotion();
      observer.disconnect();
      if (!preference.matches) for (const target of targets) if (!played.has(target)) observer.observe(target);
    };
    const onVisibility = () => { if (document.hidden) finishMotion(); else observe(); };
    observe();
    preference.addEventListener('change', observe);
    element.addEventListener('focusin', finishMotion);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      finishMotion();
      preference.removeEventListener('change', observe);
      element.removeEventListener('focusin', finishMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [duration, delay, offset, inViewMargin, replayKey]);

  return createElement(as, {...props, ref:root, className:`editorial-reveal ${className}`.trim()}, children);
}

export default EditorialReveal;
