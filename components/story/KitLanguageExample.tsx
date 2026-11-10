import type {kitInsightCopy} from '@/lib/site-content/kit-insight-copy';

type Copy = (typeof kitInsightCopy)[keyof typeof kitInsightCopy]['language'];
export function KitLanguageExample({copy, reveal = 1, offset = 0, motion = false}: {copy: Copy; reveal?: number; offset?: number; motion?: boolean}) {
  return <div className="kit-language-panel" data-kit-language-scene>
    <div className="kit-language-intro"><p className="kit-language-kicker">{copy.kicker}</p><h3>{copy.title[0]}<br/><em>{copy.title[1]}</em></h3><p>{copy.intro}</p></div>
    <div className="kit-language-example"><span className="kit-language-marker">{copy.marker}</span><div data-kit-language-reveal={motion ? '' : undefined} style={{opacity: reveal, transform: `translate3d(0, ${offset}px, 0)`}}><strong>{copy.meaning}</strong><p>{copy.explanation}</p></div></div>
  </div>;
}
