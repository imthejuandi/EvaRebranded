import {kitInsightCopy} from '@/lib/site-content/kit-insight-copy';

type KitCopy = typeof kitInsightCopy[keyof typeof kitInsightCopy];

/** An editorial index of the actual assays, shared by the film and reduced-motion view. */
export function KitMarkerIndex({copy}: {copy: KitCopy}) {
  return <div className="kit-marker-index">
    <h3>{copy.title}</h3>
    <div className="kit-marker-groups">
      {copy.groups.map((group, index) => <section className="kit-marker-group" key={group.label}>
        <h4><span>{group.label}</span><span className="kit-group-number" aria-hidden="true">0{index + 1}</span></h4>
        <ul>{group.markers.map(marker => <li key={marker}><span className="kit-marker-name">{copy.markers[marker]}</span><span className="sr-only"> — </span><span className="kit-marker-meaning">{copy.meanings[marker]}</span></li>)}</ul>
      </section>)}
    </div>
  </div>;
}
