'use client';

import {useEffect, useRef} from 'react';
import type {OrbMarker} from './orb-model';
import {reportRingGeometry, interpolateDotPosition, type RingPoint} from './ring-geometry';

type PaintedDot = RingPoint & {rgb: [number, number, number]};
const rgb = (hex: string): [number, number, number] => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

/** Decorative, bounded B animation. Native marker buttons expose the same result data. */
export function ReportRing({markers, activeKey}: {markers: readonly OrbMarker[]; activeKey: string | null}) {
  const canvas = useRef<HTMLCanvasElement>(null), painted = useRef<PaintedDot[]>([]);
  const previous = useRef<string | null>(null);
  const signature = JSON.stringify(markers.map(marker => [marker.key, marker.zone]));
  useEffect(() => {
    const node = canvas.current, context = node?.getContext('2d');
    if (!node || !context) return;
    const selectionOnly = previous.current === signature;
    previous.current = signature;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, dpr = 1, frame = 0, disposed = false, visible = true;
    let start: number | null = null, finalPoints: PaintedDot[] = [], from: PaintedDot[] = [];
    const duration = selectionOnly ? 260 : 960;
    const draw = (points: PaintedDot[]) => {
      if (disposed) return;
      context.clearRect(0, 0, width, height);
      for (const point of points) {
        if (point.alpha < .006) continue;
        context.globalAlpha = point.alpha;
        context.fillStyle = `rgb(${point.rgb.map(Math.round).join(',')})`;
        context.beginPath(); context.arc(point.x * width, point.y * height, point.radius * Math.min(width, height), 0, Math.PI * 2); context.fill();
      }
      context.globalAlpha = 1;
      node.dataset.frames = String(Number(node.dataset.frames || 0) + 1);
    };
    const stop = () => {cancelAnimationFrame(frame); frame = 0;};
    const settle = () => {stop(); painted.current = finalPoints; draw(finalPoints); node.dataset.settled = 'true';};
    const resize = (initial = false) => {
      stop();
      const bounds = node.getBoundingClientRect(); width = bounds.width; height = bounds.height;
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      node.width = Math.max(1, Math.round(width * dpr)); node.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      finalPoints = reportRingGeometry(markers, innerWidth <= 600 || width < 440).points.map(point => ({...point,
        alpha: point.alpha * (!activeKey || point.key === activeKey ? 1 : .19), rgb: rgb(point.color)}));
      node.dataset.dots = String(finalPoints.length); node.dataset.dpr = String(dpr);
      if (!initial) settle();
    };
    const tick = (time: number) => {
      if (disposed) return;
      if (reduced.matches || document.hidden || !visible) {settle(); return;}
      start ??= time;
      const t = Math.min(1, (time - start) / duration), ease = 1 - Math.pow(1 - t, 3);
      painted.current = finalPoints.map((point, index) => ({...point,
        ...interpolateDotPosition(from[index], point, ease),
        radius: from[index].radius + (point.radius - from[index].radius) * ease,
        alpha: from[index].alpha + (point.alpha - from[index].alpha) * ease,
        rgb: from[index].rgb.map((color, channel) => color + (point.rgb[channel] - color) * ease) as PaintedDot['rgb']}));
      draw(painted.current);
      if (t < 1) frame = requestAnimationFrame(tick); else settle();
    };
    resize(true);
    const bounds = node.getBoundingClientRect();
    visible = bounds.bottom > 0 && bounds.top < innerHeight && bounds.right > 0 && bounds.left < innerWidth;
    const old = new Map(painted.current.map(point => [point.id, point]));
    from = finalPoints.map(point => old.get(point.id) ?? {...point, x: point.baselineX, y: point.baselineY, alpha: point.alpha * .2});
    if (!width || !height || !finalPoints.length || reduced.matches || document.hidden || !visible) settle();
    else {node.dataset.settled = 'false'; painted.current = from; draw(from); frame = requestAnimationFrame(tick);}
    const resizeObserver = new ResizeObserver(() => {
      const bounds = node.getBoundingClientRect();
      if (Math.abs(bounds.width - width) > .5 || Math.abs(bounds.height - height) > .5 || Math.min(devicePixelRatio || 1, 1.5) !== dpr) resize();
    });
    resizeObserver.observe(node);
    const intersection = new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; if (!visible) settle();}, {threshold: 0});
    intersection.observe(node);
    const onVisibility = () => {if (document.hidden) settle();};
    const onMotion = () => {if (reduced.matches) settle();};
    document.addEventListener('visibilitychange', onVisibility); reduced.addEventListener('change', onMotion);
    return () => {disposed = true; stop(); resizeObserver.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', onVisibility); reduced.removeEventListener('change', onMotion);};
  }, [signature, activeKey]);
  return <canvas ref={canvas} className="score-orb-ring" aria-hidden="true" data-settled="false" data-frames="0" data-dots="0"/>;
}
