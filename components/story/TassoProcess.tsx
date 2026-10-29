'use client';

import {useLayoutEffect, useRef} from 'react';
import {Img, staticFile} from 'remotion';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import type {StoryScrollDriver} from '@/lib/story-scroll-driver';
import './tasso-process.css';

const copy = {
  en: {
    kicker: 'THREE EASY STEPS',
    heading: ['One small', 'step.'],
    instructions: 'Follow the instructions supplied with your kit.',
    protection: 'PROTECTED SAMPLE',
    sample: 'SEALED · LABELED',
    prepaid: 'PREPAID RETURN',
    lab: 'TO THE LABORATORY',
    illustrated: 'Return sequence, illustrated',
    report: 'YOUR HEALTH, IN CONTEXT',
    concepts: ['Explained', 'In context', 'Over time'],
    steps: [
      {
        label: '01 / AT HOME', title: 'Your sample. At home.',
        body: 'The kit comes to you. Warm, clean and dry your upper arm. Apply Tasso+, then press once and release.',
        detail: 'Relax your arm. Allow up to 5 minutes.',
        caption: 'Upper arm. Tube pointing down.',
      },
      {
        label: '02 / PREPAID RETURN', title: 'Back to the lab.',
        body: 'Seal and label your sample as instructed. Pack it in the supplied protective packaging, then the prepaid return envelope.',
        detail: 'Return postage included.', caption: '',
      },
      {
        label: '03 / UNDERSTAND', title: 'Your results. In context.',
        body: 'Your biomarkers, explained. A clearer picture of your health, ready to follow over time.',
        detail: '', caption: '',
      },
    ],
    timing: '2 working days', qualifier: 'From laboratory receipt of your sample.',
  },
  es: {
    kicker: 'TRES PASOS SENCILLOS',
    heading: ['Un pequeño', 'gesto.'],
    instructions: 'Sigue las instrucciones incluidas en tu kit.',
    protection: 'MUESTRA PROTEGIDA',
    sample: 'SELLADA · IDENTIFICADA',
    prepaid: 'DEVOLUCIÓN PREPAGADA',
    lab: 'AL LABORATORIO',
    illustrated: 'Secuencia de devolución ilustrada',
    report: 'TU SALUD, CON CONTEXTO',
    concepts: ['Explicados', 'Con contexto', 'En el tiempo'],
    steps: [
      {
        label: '01 / EN CASA', title: 'Tu muestra. En casa.',
        body: 'El kit llega a tu casa. Calienta, limpia y seca la parte superior del brazo. Coloca Tasso+, pulsa una vez y suelta.',
        detail: 'Relaja el brazo. La recogida puede durar hasta 5 minutos.',
        caption: 'Parte superior del brazo. Tubo hacia abajo.',
      },
      {
        label: '02 / DEVOLUCIÓN PREPAGADA', title: 'De vuelta al laboratorio.',
        body: 'Sella e identifica tu muestra según las instrucciones. Colócala en el embalaje protector incluido y después en el sobre de devolución prepagado.',
        detail: 'Franqueo de devolución incluido.', caption: '',
      },
      {
        label: '03 / COMPRENDE', title: 'Tus resultados. Con contexto.',
        body: 'Tus biomarcadores, explicados. Una visión más clara de tu salud para seguir su evolución en el tiempo.',
        detail: '', caption: '',
      },
    ],
    timing: '2 días laborables', qualifier: 'Desde la recepción de tu muestra en el laboratorio.',
  },
} as const;

type ProcessCopy = (typeof copy)[keyof typeof copy];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {const t = clamp(n); return t * t * (3 - 2 * t);};

/** The existing scroll timeline owns every reveal; no additional playback clock. */
function processPose(frame: number) {
  const returning = smooth((frame - 354) / 8);
  const understanding = smooth((frame - 408) / 8);
  return {
    opacity: [1 - returning, returning * (1 - understanding), understanding],
    y: [-12 * returning, 12 * (1 - returning) - 12 * understanding, 12 * (1 - understanding)],
    photo: smooth((frame - 280) / 14),
    packet: smooth((frame - 362) / 20),
    seal: smooth((frame - 384) / 16),
    step: frame < 358 ? 1 : frame < 412 ? 2 : 3,
  };
}

function ReturnArtwork({words}: {words: ProcessCopy}) {
  return <div className="tasso-return-object">
    <svg viewBox="0 0 600 460" fill="none" aria-hidden="true" focusable="false">
      <path d="M105 224h390v180H105Z" fill="#d9d5c8"/>
      <g className="tasso-return-packet" data-tasso-packet>
        <rect x="218" y="211" width="164" height="179" rx="5" fill="#e1e6dc" stroke="#8c9a86"/>
        <path d="M229 222h142M229 227h142" stroke="#98a590" strokeWidth="1"/>
        <text x="300" y="243" textAnchor="middle" fill="#3f5140" fontSize="9" letterSpacing="1">{words.protection}</text>
        <rect x="283" y="251" width="34" height="107" rx="9" fill="#f7f7ef" stroke="#a7b2a0"/>
        <rect x="282" y="249" width="36" height="20" rx="3" fill="#bdc9b8" stroke="#83967e"/>
        <rect x="286" y="280" width="28" height="42" fill="#fffdf6"/>
        <path d="M290 288h20m-20 6h20m-20 6h14" stroke="#7e8c77" strokeWidth="1.5"/>
      </g>
      <path d="M105 247v157h390V247L300 354Z" fill="#e9e5d9"/>
      <path d="m105 247 195 107 195-107M105 404l158-124m232 124L337 280" stroke="#c6c1b2" strokeWidth="1"/>
      <g className="tasso-return-flap" data-tasso-flap>
        <path d="M105 224 300 97 495 224Z" fill="#eeeadd" stroke="#c8c2b4" strokeWidth="1"/>
        <path d="m121 222 179-114 179 114" stroke="#f8f5eb" strokeWidth="2"/>
      </g>
      <rect x="154" y="357" width="292" height="40" rx="1" fill="#f7f4eb"/>
      <text x="169" y="374" fill="#1e2e24" fontSize="11" letterSpacing="1.2">{words.prepaid}</text>
      <text x="169" y="388" fill="#687363" fontSize="7" letterSpacing="1.3">{words.lab}</text>
      <path d="M405 365h25v25h-25zM410 370h15v15h-15z" stroke="#a1aa98" strokeWidth="1"/>
      <path d="M169 167h25v58m-25-58h-16" stroke="#768370" strokeWidth="1"/>
      <text x="84" y="151" fill="#4d5b47" fontSize="9" letterSpacing=".7">{words.sample}</text>
    </svg>
    <p className="tasso-art-caption">{words.illustrated}</p>
  </div>;
}

function ReportArtwork({words}: {words: ProcessCopy}) {
  return <div className="tasso-report-object">
    <div className="tasso-report-heading"><span>eva<span className="tasso-report-register">®</span></span><p>{words.report}</p></div>
    <div className="tasso-report-rule"/>
    {['ApoB', 'HbA1c', 'hsCRP'].map((name, index) => <div className="tasso-report-row" key={name}><span>{name}</span><span>{words.concepts[index]}</span></div>)}
    <div className="tasso-report-note"><span/>{words.concepts.join(' · ')}</div>
  </div>;
}

function Timing({words}: {words: ProcessCopy}) {
  return <div className="tasso-process-timing"><strong>{words.timing}</strong><p>{words.qualifier}</p></div>;
}

/** A single scene in the existing film, with three composed editorial shots. */
export function TassoProcess({frame, scrollDriver}: {frame: number; scrollDriver?: StoryScrollDriver}) {
  const {locale} = useSiteLanguage();
  const words = copy[locale];
  const root = useRef<HTMLDivElement>(null);
  const initial = processPose(frame);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const panels = Array.from(element.querySelectorAll<HTMLElement>('[data-tasso-step]'));
    const device = element.querySelector<HTMLElement>('[data-tasso-device]');
    const photo = element.querySelector<HTMLElement>('[data-tasso-photo]');
    const packet = element.querySelector<SVGElement>('[data-tasso-packet]');
    const flap = element.querySelector<SVGElement>('[data-tasso-flap]');
    const index = Array.from(element.querySelectorAll<HTMLElement>('[data-tasso-index]'));
    const paint = (value: number) => {
      const pose = processPose(value);
      element.dataset.tassoActiveStep = String(pose.step);
      panels.forEach((panel, i) => {
        panel.style.opacity = String(pose.opacity[i]);
        panel.style.visibility = pose.opacity[i] <= 0 ? 'hidden' : 'visible';
        panel.style.transform = `translate3d(0, ${pose.y[i]}px, 0)`;
      });
      if (device) device.style.opacity = String(1 - pose.photo);
      if (photo) photo.style.opacity = String(pose.photo);
      if (packet) packet.style.transform = `translateY(${12 * pose.packet}px)`;
      if (flap) flap.style.transform = `scaleY(${1 - 2 * pose.seal})`;
      index.forEach((item, i) => {item.dataset.active = String(i + 1 === pose.step);});
    };
    paint(scrollDriver?.current ?? frame);
    return scrollDriver?.subscribe(paint);
  }, [frame, scrollDriver, locale]);

  return <div ref={root} className="tasso-process" data-tasso-process data-tasso-active-step={initial.step}>
    <header className="tasso-process-header"><p>{words.kicker}</p><h2>{words.heading[0]}<br/><em>{words.heading[1]}</em></h2></header>
    {words.steps.map((step, i) => <div key={step.label} className="tasso-process-panel" data-tasso-step={i + 1} style={{opacity: initial.opacity[i], visibility: initial.opacity[i] <= 0 ? 'hidden' : 'visible', transform: `translate3d(0, ${initial.y[i]}px, 0)`}}>
      <div className="tasso-process-art">
        {i === 0 ? <div className="tasso-collection-object">
          <div className="tasso-device-still" data-tasso-device style={{opacity: 1 - initial.photo}}><Img src={staticFile('art/tasso-plus-product.jpg')} alt="" loading="eager" decoding="async"/></div>
          <div className="tasso-in-use-still" data-tasso-photo style={{opacity: initial.photo}}><Img src={staticFile('art/tasso-plus-in-use-1000.webp')} alt="" loading="eager" decoding="async"/><p className="tasso-art-caption">{step.caption}</p></div>
        </div> : i === 1 ? <ReturnArtwork words={words}/> : <ReportArtwork words={words}/>}
      </div>
      <div className="tasso-process-copy"><p className="tasso-process-label">{step.label}</p><h3>{step.title}</h3><p className="tasso-process-body">{step.body}</p>{step.detail ? <p className="tasso-process-detail">{step.detail}</p> : null}{i === 2 ? <Timing words={words}/> : null}</div>
    </div>)}
    <div className="tasso-process-footer"><div className="tasso-process-index" aria-hidden="true">{words.steps.map((step, i) => <span key={step.label} data-tasso-index data-active={i + 1 === initial.step}><b>{String(i + 1).padStart(2, '0')}</b><i/></span>)}</div><p>{words.instructions}</p></div>
  </div>;
}

/** Shared real text outside the aria-hidden film; visible when motion is reduced. */
export function TassoProcessSummary({visible = false}: {visible?: boolean}) {
  const {locale} = useSiteLanguage();
  const words = copy[locale];
  return <section className={visible ? 'tasso-process-summary' : 'sr-only'} data-tasso-summary aria-labelledby="tasso-summary-title">
    <header><p>{words.kicker}</p><h2 id="tasso-summary-title">{words.heading.join(' ')}</h2></header>
    <ol>{words.steps.map((step, i) => <li key={step.label}>
      {visible ? <div className="tasso-summary-art">{i === 0 ? <img src="/art/tasso-plus-in-use-1000.webp" alt={step.caption} width="1000" height="1284" loading="lazy" decoding="async"/> : i === 1 ? <ReturnArtwork words={words}/> : <ReportArtwork words={words}/>}</div> : null}
      <div><p className="tasso-process-label">{step.label}</p><h3>{step.title}</h3><p>{step.body}</p>{step.detail ? <p className="tasso-process-detail">{step.detail}</p> : null}{step.caption ? <p className="tasso-process-detail">{step.caption}</p> : null}{i === 2 ? <Timing words={words}/> : null}</div>
    </li>)}</ol>
    <p className="tasso-summary-instructions">{words.instructions}</p>
  </section>;
}
