import {Arrow} from './Arrow';
import {businessLinks} from '@/lib/landing-content';
import {DotNumber} from './DotNumber';
import {BiomarkerGallery} from './BiomarkerGallery';
import {LifestylePassage} from './LifestylePassage';
import {MethodJourney} from './MethodJourney';

export function HealthEditorial({calm=false}:{calm?:boolean}){return <>
 <section className="context-passage" id="una-perspectiva" aria-labelledby="context-title">
  <div className="section-kicker"><span>01 / UNA MIRADA MÁS AMPLIA</span><a href={businessLinks.science}>LA CIENCIA DE EVA</a></div>
  <div className="context-grid"><h2 id="context-title">Tu salud tiene<br/><em>una historia.</em></h2><div className="context-copy"><p>Los biomarcadores son indicadores medibles de tu cuerpo. Una analítica muestra sus valores en un momento concreto.</p><p>Con EVA, los vuelves a medir cada 90 días. Así puedes comparar tus resultados y ponerlos en relación con tus hábitos y cómo te encuentras.</p><a className="text-link" href={businessLinks.science}>Cómo interpreta EVA los resultados </a></div></div>
  <div className="annual-reading"><div className="annual-number"><DotNumber value="60" calm={calm}/><p>resultados de biomarcadores al año</p></div><div className="annual-rhythm"><p><b>15 biomarcadores.</b><br/>Cuatro lecturas al año.</p><div className="quarter-track" aria-label="Cuatro lecturas, una cada tres meses">{['01','04','07','10'].map((m,i)=><div key={m}><span className="quarter-dots" aria-hidden="true">{Array.from({length:15},(_,j)=><i key={j}/>)}</span><span>MES {m}</span><small>{i===0?'Tu punto de partida':'Tu siguiente lectura'}</small></div>)}</div></div></div>
 </section>
 <MethodJourney calm={calm}/>
 <BiomarkerGallery calm={calm}/>
 <section className="range-clarity" aria-label="Cómo leer los rangos"><p>Un intervalo de referencia describe los valores que usa el laboratorio. Los rangos de EVA aportan otra perspectiva para explorar tus resultados junto con su evolución y tu contexto; no sustituyen una valoración profesional.</p><a href="/es/science">Entender los rangos de EVA</a></section>
 <LifestylePassage calm={calm}/>
 <section className="age-passage" id="tu-evolucion" aria-labelledby="age-title"><div className="section-kicker"><span>04 / TU EVOLUCIÓN</span><span>UNA NUEVA LECTURA CADA TRIMESTRE</span></div><div className="age-heading"><h2 id="age-title">Tu edad cuenta<br/><em>una parte.</em></h2><div><p>Además de los valores de cada biomarcador, EVA presenta una edad biológica estimada y una puntuación de longevidad.</p><p>Son dos lecturas distintas. Puedes observar su evolución entre trimestres junto al resto de tus resultados.</p></div></div><div className="age-readings"><div><p>EDAD CRONOLÓGICA</p><DotNumber value="34" calm={calm}/><span>años</span></div><div className="age-connector" aria-hidden="true"><Arrow/></div><div><p>EDAD BIOLÓGICA ESTIMADA</p><DotNumber value="29" calm={calm}/><span>años</span></div></div><div className="age-foot"><p><span>−5</span> años de diferencia<br/>entre las edades de este ejemplo.</p><p className="illustration-note">Ejemplo ilustrativo, no una predicción de tu resultado. La edad biológica es una estimación y es distinta de tu puntuación de longevidad.</p></div></section>
 <section className="manifesto full-founder" id="nuestra-historia"><p className="eyebrow">05 / UNA IDEA MUY PERSONAL</p><blockquote>«EVA es el servicio que deseaba tener cuando comencé mi propio camino de salud preventiva: uno que no solo te entrega datos, sino que te enseña lo que significan <em>y qué hacer al respecto.»</em></blockquote><div className="founder"><span>Juan Diego Lago<br/><small>Fundador y CEO, EVA Health</small></span><a className="text-link" href={businessLinks.about}>Nuestra historia</a></div></section>
 </>}
