'use client';

import {useEffect, useRef, useState} from 'react';
import {EvaWordmark} from '@/components/story/EvaWordmark';
import copy from '@/lib/site-content/landing-proposal-copy.json';
import './landing-proposal.css';

type Audience = 'starting' | 'testing';
const words = copy.sections;
const chapters = [
  {id: 'hero', label: 'Know'}, {id: 'three-steps', label: 'Collect'},
  {id: 'your-results', label: 'Understand'}, {id: 'your-panel', label: 'Explore'},
  {id: 'your-next-step', label: 'Continue'},
];
const planUrl = 'https://chatgpt.com/space/page_d64d0b8a48cc819193984e035ebdca7d';

function Arrow({back = false, diagonal = false}: {back?: boolean; diagonal?: boolean}) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : back ? 'M20 12H4m6-6-6 6 6 6' : 'M4 12h16m-6-6 6 6-6 6'}/></svg>;
}

function AudienceChoice({audience, onChange, id}: {audience: Audience; onChange: (value: Audience) => void; id: string}) {
  return <div className="lp-audience"><p id={id}>Where are you starting?</p><div role="group" aria-labelledby={id}>
    {copy.audiences.map(item => <button type="button" key={item.id} aria-pressed={audience === item.id} onClick={() => onChange(item.id as Audience)}>{item.label}<span aria-hidden="true"><Arrow diagonal/></span></button>)}
  </div></div>;
}

function ProcessFilm() {
  const video = useRef<HTMLVideoElement>(null), progress = useRef<HTMLDivElement>(null);
  const visible = useRef(false), userPaused = useRef(false), reduced = useRef(false), manualPlay = useRef(false), pendingSeek = useRef<number | null>(null);
  const [armed, setArmed] = useState(false), [playing, setPlaying] = useState(false), [step, setStep] = useState(0), [ended, setEnded] = useState(false);
  const starts = [0, 6.5, 14.5];
  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reduced.current = preference.matches;
      if (!visible.current || document.hidden || reduced.current) media.pause();
      else if (!userPaused.current) {setArmed(true); media.playbackRate = 1; void media.play().catch(() => {});}
    };
    const observer = new IntersectionObserver(([entry]) => {visible.current = entry.isIntersecting; sync();}, {rootMargin: '0px', threshold: 0.12});
    observer.observe(media);
    preference.addEventListener('change', sync); document.addEventListener('visibilitychange', sync); sync();
    return () => {observer.disconnect(); preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); media.pause();};
  }, []);
  const play = () => {const media = video.current; if (!media) return; manualPlay.current = true; userPaused.current = false; setArmed(true); media.playbackRate = 1; void media.play().catch(() => {});};
  const choose = (index: number) => {const media = video.current; if (!media) return; setStep(index); setEnded(false); setArmed(true); manualPlay.current = true; userPaused.current = false; pendingSeek.current = starts[index]; if (media.readyState >= 1) {media.currentTime = starts[index]; pendingSeek.current = null; play();}};
  const toggle = () => {const media = video.current; if (!media) return; if (ended) {choose(0); return;} if (media.paused) play(); else {userPaused.current = true; media.pause();}};
  return <div className="lp-process-film" data-proposal-film data-step={step + 1}>
    <div className="lp-film-frame"><video ref={video} src={armed ? '/art/tasso-home-video/process-continuity-v3.mp4' : undefined} poster="/art/tasso-home-film/81d580b1ef608977/desktop/poster.jpg" muted playsInline preload={armed ? 'auto' : 'none'} disablePictureInPicture
      aria-label="Illustrated three-step collection and results film"
      onLoadedMetadata={() => {if (video.current && pendingSeek.current !== null) {video.current.currentTime = pendingSeek.current; pendingSeek.current = null;} if (!userPaused.current && visible.current && (!reduced.current || manualPlay.current)) play();}}
      onTimeUpdate={() => {const media = video.current; if (!media) return; const next = media.currentTime < starts[1] ? 0 : media.currentTime < starts[2] ? 1 : 2; setStep(old => old === next ? old : next); if (progress.current) progress.current.style.transform = `scaleX(${media.duration ? media.currentTime / media.duration : 0})`;}}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => {setEnded(true); userPaused.current = true;}}/>
      <div className="lp-film-caption"><span>{words.process.steps[step].filmLabel}</span><button type="button" onClick={toggle} aria-label={ended ? 'Replay collection film' : playing ? 'Pause collection film' : 'Play collection film'}>{ended ? 'Replay' : playing ? 'Pause' : 'Play'}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={playing ? 'M8 5v14M16 5v14' : 'm7 4 13 8-13 8Z'}/></svg></button></div>
      <div className="lp-film-progress" aria-hidden="true"><div ref={progress}/></div>
    </div>
    <ol className="lp-process-steps">{words.process.steps.map((item, index) => <li key={item.id} data-current={step === index}><button type="button" onClick={() => choose(index)} aria-current={step === index ? 'step' : undefined}><span className="lp-step-number">{item.number}</span><span><small>{item.eyebrow}</small><strong>{item.title}</strong></span><Arrow/></button><p>{item.body}</p><span className="lp-step-detail">{item.detail}</span></li>)}</ol>
    <div className="lp-process-footer"><p>{words.process.instructions}<br/><span>Illustrative experience and interface. Explore the 13 included markers below.</span></p><div><button type="button" disabled={step === 0} onClick={() => choose(step - 1)}><Arrow back/>Previous</button><button type="button" disabled={step === 2} onClick={() => choose(step + 1)}>Next<Arrow/></button></div></div>
  </div>;
}

const resultExamples = [
  {id: 'fructosamine', label: 'Fructosamine', value: '238', unit: 'µmol/L', history: [236, 249, 238]},
  {id: 'hscrp', label: 'hs-CRP', value: '0.9', unit: 'mg/L', history: [1.0, 0.7, 0.9]},
  {id: 'ldl', label: 'LDL Cholesterol', value: '2.8', unit: 'mmol/L', history: [3.1, 2.7, 2.8]},
  {id: 'albumin', label: 'Albumin', value: '44', unit: 'g/L', history: [43, 45, 44]},
];

function ResultsFolio() {
  const [selected, setSelected] = useState(0), [view, setView] = useState<'meaning' | 'perspective' | 'history'>('meaning');
  const example = resultExamples[selected], marker = words.panel.markers.find(item => item.id === example.id)!;
  const values = example.history, minimum = Math.min(...values), maximum = Math.max(...values);
  const points = values.map((value, index) => `${40 + index * 170},${115 - (value - minimum) / (maximum - minimum || 1) * 65}`);
  return <div className="lp-dashboard" data-proposal-dashboard>
    <div className="lp-dashboard-bar"><span>eva<span>®</span></span><p>MY EVA / RESULTS</p><span className="lp-example-tag">Example</span></div>
    <div className="lp-dashboard-body"><aside className="lp-dashboard-sidebar"><p>YOUR KIT</p><strong>13 markers.<br/>One starting point.</strong><div className="lp-sidebar-dots" aria-hidden="true">{Array.from({length: 13}, (_, i) => <i key={i}/>)}</div><nav aria-label="Example biomarkers">{resultExamples.map((item, index) => <button type="button" key={item.id} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}<span aria-hidden="true"><Arrow diagonal/></span></button>)}</nav><small>Illustrative interface<br/>No personal health data</small></aside>
      <div className="lp-dashboard-main"><div className="lp-dashboard-greeting"><p>YOUR LATEST READING</p><span>Blood sample / Example</span></div><h3>Your health,<br/><em>in perspective.</em></h3>
        <div className="lp-reading-instrument"><div><p>{example.label}</p><strong>{example.value}<small>{example.unit}</small></strong><span>Example measurement</span></div><svg viewBox="0 0 140 140" fill="none" aria-hidden="true"><circle cx="70" cy="70" r="55" stroke="currentColor" strokeOpacity=".15" strokeWidth="1"/>{Array.from({length: 40}, (_, i) => {const angle = i * Math.PI * 2 / 40; return <circle key={i} cx={70 + 55 * Math.cos(angle)} cy={70 + 55 * Math.sin(angle)} r={i % 5 === 0 ? 2.4 : 1.1} fill="currentColor"/>;})}<path d="M35 86 55 66l22 11 28-28" stroke="currentColor" strokeWidth="1.5"/><circle cx="105" cy="49" r="4" fill="currentColor"/></svg></div>
        <div className="lp-result-views" role="group" aria-label="Explore an example result">{words.results.annotations.map(item => <button type="button" key={item.id} aria-pressed={view === item.id} onClick={() => setView(item.id as typeof view)}>{item.id === 'meaning' ? 'Meaning' : item.id === 'perspective' ? 'Lab range' : 'History'}</button>)}</div>
        <div className="lp-result-explanation" aria-live="polite">{view === 'meaning' ? <><p>WHAT THIS MEASURES</p><h4>{marker.short}</h4><span>{marker.detail}</span></> : view === 'perspective' ? <><p>YOUR LABORATORY CONTEXT</p><h4>A number needs a reference.</h4><span>Your report places the measurement alongside the testing laboratory’s reference interval. The applicable limits and your circumstances matter.</span><div className="lp-reference-line" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><small>Laboratory intervals appear with your report.</small></> : <><p>COMPARABLE READINGS / ILLUSTRATIVE</p><h4>Your first reading is a baseline.</h4><svg className="lp-history-chart" viewBox="0 0 420 165" role="img" aria-label={`Three illustrative ${example.label} readings: ${values.join(', ')} ${example.unit}`}><path d="M25 130h370" stroke="currentColor" strokeOpacity=".2"/><polyline points={points.join(' ')} fill="none" stroke="currentColor" strokeWidth="2"/>{points.map((point, i) => {const [x, y] = point.split(','); return <g key={i}><circle cx={x} cy={y} r="4" fill="currentColor"/><text x={x} y="155" textAnchor="middle">Reading {i + 1}</text></g>;})}</svg></>}</div>
      </div></div>
    <p className="lp-dashboard-note">Illustrative values and history. No diagnosis or individual recommendation.</p>
  </div>;
}

export function LandingProposal() {
  const root = useRef<HTMLElement>(null), heroVideo = useRef<HTMLVideoElement>(null);
  const [audience, setAudience] = useState<Audience>('starting'), [chapter, setChapter] = useState(0), [group, setGroup] = useState('all'), [focus, setFocus] = useState('guidance');
  const [heroReady, setHeroReady] = useState(false), [heroMotion, setHeroMotion] = useState(false), [heroPaused, setHeroPaused] = useState(false);
  const audienceCopy = words.hero.audienceVariants[audience], ongoing = words.ongoing.audienceVariants[audience];
  const visibleMarkers = words.panel.markers.filter(item => group === 'all' || item.group === group);
  const chooseAudience = (value: Audience) => {setAudience(value); const url = new URL(location.href); url.searchParams.set('audience', value); history.replaceState(null, '', url.pathname + url.search + url.hash);};
  useEffect(() => {
    const element = root.current; if (!element) return;
    if (new URLSearchParams(location.search).get('audience') === 'testing') setAudience('testing');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const observer = new IntersectionObserver(entries => {for (const entry of entries) if (entry.isIntersecting) {entry.target.setAttribute('data-revealed', 'true'); observer.unobserve(entry.target);}}, {threshold: 0.08});
    element.querySelectorAll('.lp-reveal').forEach(item => observer.observe(item));
    let raf = 0, oldChapter = -1;
    const draw = () => {raf = 0; const sections = Array.from(element.querySelectorAll<HTMLElement>('[data-lp-chapter]')); let next = 0; sections.forEach((section, index) => {if (section.getBoundingClientRect().top < innerHeight * 0.5) next = index;}); if (next !== oldChapter) {oldChapter = next; setChapter(next);} element.style.setProperty('--lp-hero-travel', `${Math.min(scrollY * 0.13, 160)}px`);};
    const scroll = () => {if (!raf) raf = requestAnimationFrame(draw);};
    const motion = () => {element.dataset.motion = preference.matches ? 'off' : 'on'; setHeroMotion(!preference.matches); if (preference.matches) heroVideo.current?.pause();};
    motion(); draw(); preference.addEventListener('change', motion); window.addEventListener('scroll', scroll, {passive: true});
    return () => {observer.disconnect(); cancelAnimationFrame(raf); preference.removeEventListener('change', motion); window.removeEventListener('scroll', scroll);};
  }, []);
  useEffect(() => {const media = heroVideo.current; if (!media || !heroMotion) return; const sync = () => {if (!heroPaused && !document.hidden && media.getBoundingClientRect().bottom > 0 && media.getBoundingClientRect().top < innerHeight) void media.play().catch(() => {}); else media.pause();}; const observer = new IntersectionObserver(sync); observer.observe(media); document.addEventListener('visibilitychange', sync); sync(); return () => {observer.disconnect(); document.removeEventListener('visibilitychange', sync); media.pause();};}, [heroMotion, heroPaused]);
  return <main ref={root} className="lp-proposal" data-audience={audience}>
    <a className="lp-skip" href="#your-panel">Explore the kit contents</a>
    <header className="lp-header"><EvaWordmark/><nav aria-label="Proposal chapters">{chapters.map((item, index) => <a href={`#${item.id}`} key={item.id} aria-current={chapter === index ? 'location' : undefined}><span>0{index + 1}</span>{item.label}</a>)}</nav><a className="lp-current-site" href="/en">Current site<Arrow/></a></header>

    <section className="lp-hero" id="hero" data-lp-chapter>
      <div className="lp-hero-art" aria-hidden="true"><img src="/art/runner-athletic.jpg" alt="" fetchPriority="high"/><video ref={heroVideo} src={heroMotion ? '/art/runner-athletic-loop.mp4' : undefined} autoPlay muted loop playsInline preload="none" onPlaying={() => setHeroReady(true)} style={{opacity: heroReady ? 1 : 0}}/><div className="lp-hero-datum"><span>01 / YOUR BODY</span><i/><span>Every story starts somewhere.</span></div></div>
      <div className="lp-hero-copy"><p className="lp-eyebrow">{words.hero.eyebrow}</p><h1><span>{words.hero.headline[0]}</span><em>{words.hero.headline[1]}</em></h1><p className="lp-hero-support">{words.hero.support}</p><div className="lp-hero-actions"><a className="lp-button" href={words.hero.primaryAction.target}>{words.hero.primaryAction.label}<Arrow/></a><a className="lp-text-link" href={words.hero.secondaryAction.target}>{words.hero.secondaryAction.label}<Arrow/></a></div><p className="lp-offer-line"><strong>13 biomarkers</strong><span>At-home kit</span><strong>€99 <small>+ VAT</small></strong></p></div>
      <div className="lp-hero-bottom"><AudienceChoice audience={audience} onChange={chooseAudience} id="lp-hero-audience"/><p className="lp-audience-support" aria-live="polite">{audienceCopy.support}</p><div className="lp-hero-motion-controls">{heroMotion && <button type="button" aria-pressed={heroPaused} onClick={() => setHeroPaused(value => !value)}>{heroPaused ? 'Play image' : 'Pause image'}</button>}<a href="#three-steps" className="lp-scroll-cue">SCROLL TO DISCOVER<span aria-hidden="true">↓</span></a></div></div>
    </section>

    <section className="lp-collection lp-section" id="three-steps" data-lp-chapter>
      <div className="lp-section-heading lp-reveal"><div><p className="lp-eyebrow">02 / {words.process.eyebrow}</p><h2>{words.process.headline[0]}<br/><em>{words.process.headline[1]}</em></h2></div><p>{words.process.support}</p></div>
      <div className="lp-reveal"><ProcessFilm/></div><p className="lp-section-transition">{words.process.transition}<span aria-hidden="true">↓</span></p>
    </section>

    <section className="lp-results lp-section" id="your-results" data-lp-chapter>
      <div className="lp-results-heading lp-reveal"><p className="lp-eyebrow">03 / {words.results.eyebrow}</p><h2>{words.results.headline[0]}<br/><em>{words.results.headline[1]}</em></h2><p>{words.results.support}</p></div>
      <div className="lp-results-layout"><div className="lp-results-notes lp-reveal"><p className="lp-example-label">{words.results.sampleLabel}</p>{words.results.annotations.map(item => <div key={item.id}><span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></div>)}<div className="lp-results-audience" aria-live="polite"><h3>{words.results.audienceVariants[audience].title}</h3><p>{words.results.audienceVariants[audience].body}</p></div><a className="lp-text-link" href="#your-panel">{words.results.primaryAction.label}<Arrow/></a></div><div className="lp-results-folio lp-reveal"><ResultsFolio/></div></div>
    </section>

    <section className="lp-panel lp-section" id="your-panel" data-lp-chapter>
      <div className="lp-panel-intro lp-reveal"><p className="lp-eyebrow">04 / {words.panel.eyebrow}</p><div className="lp-count" aria-label="13 biomarkers">13<span aria-hidden="true">{Array.from({length: 13}, (_, i) => <i key={i}/>)}</span></div><h2>Markers.<br/><em>A clearer<br/>starting point.</em></h2><p>{words.panel.support}</p><span className="lp-panel-price">At-home kit <strong>€99 + VAT</strong></span></div>
      <div className="lp-marker-explorer"><div className="lp-marker-filters lp-reveal" role="group" aria-label="Explore biomarker areas"><button type="button" aria-pressed={group === 'all'} onClick={() => setGroup('all')}>All 13<span>13</span></button>{words.panel.groups.map(item => <button type="button" key={item.id} aria-pressed={group === item.id} onClick={() => setGroup(item.id)}>{item.label}<span>{item.count.toString().padStart(2, '0')}</span></button>)}</div>
        <div className="lp-marker-caption"><p>{group === 'all' ? 'THE COMPLETE KIT' : words.panel.groups.find(item => item.id === group)?.description}</p><span>{visibleMarkers.length} {visibleMarkers.length === 1 ? 'marker' : 'markers'}</span></div>
        <div className="lp-marker-list">{visibleMarkers.map(item => <details key={item.id} className="lp-marker-row"><summary><span>{(words.panel.markers.indexOf(item) + 1).toString().padStart(2, '0')}</span><h3>{item.name}</h3><i aria-hidden="true">+</i></summary><div><p className="lp-marker-short">{item.short}</p><p>{item.detail}</p></div></details>)}</div><p className="lp-marker-note">{words.panel.footer}</p>
      </div>
    </section>

    <section className="lp-ongoing" id="your-next-step" data-lp-chapter>
      <div className="lp-ongoing-image"><img src="/art/landing-proposal/coastal-continuity.webp" alt="Two people walking along a coastal path in warm evening light" loading="lazy" width="1600" height="900"/><div className="lp-ongoing-image-copy lp-reveal"><p className="lp-eyebrow">05 / {words.ongoing.eyebrow}</p><h2>{words.ongoing.headline[0]}<br/><em>{words.ongoing.headline[1]}</em></h2><p>{words.ongoing.support}</p></div></div>
      <div className="lp-ongoing-content lp-section"><div className="lp-next-intro lp-reveal"><AudienceChoice audience={audience} onChange={chooseAudience} id="lp-next-audience"/><div aria-live="polite"><h3>{ongoing.headline}</h3><p>{ongoing.body}</p></div></div><ol className="lp-next-timeline lp-reveal">{ongoing.steps.map((item, index) => <li key={item.title}><span className="lp-timeline-point" aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol>
        <div className="lp-guided-choice lp-reveal" id="guided-choice"><div><p className="lp-eyebrow">{words.ongoing.quarterlyLine}</p><h3>Your choice.<br/><em>With a clearer why.</em></h3></div><div><div className="lp-choice-controls" role="group" aria-label="Explore how to choose your next focus">{words.ongoing.choiceCards.map(item => <button type="button" key={item.id} aria-pressed={focus === item.id} onClick={() => setFocus(item.id)}>{item.title}<Arrow/></button>)}</div><p className="lp-choice-explanation" aria-live="polite">{words.ongoing.choiceCards.find(item => item.id === focus)?.body}</p><p className="lp-choice-note">{words.ongoing.choiceMicrocopy}</p></div></div>
        <div className="lp-proposal-close"><p>{words.ongoing.closingLine}</p><a className="lp-text-link" href={audience === 'testing' ? '#guided-choice' : '#your-panel'}>{ongoing.action}<Arrow/></a></div>
      </div>
    </section>
    <div className="lp-review-footer" role="contentinfo"><div><span>LANDING PROPOSAL / SECTIONS 01–05</span><p>Copy, design and scroll direction for review.</p></div><a href={planUrl}>Read the detailed plan<Arrow/></a><a href="/en">Compare with the current site<Arrow/></a></div>
  </main>;
}
