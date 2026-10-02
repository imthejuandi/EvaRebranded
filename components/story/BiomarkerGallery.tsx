'use client';
import {Arrow} from './Arrow';
import {useState} from 'react';
import {specimens} from '@/lib/landing-content';
import {DotNumber} from './DotNumber';

// Only the fourth reading comes from EVA's public examples. Earlier readings are UI demonstration data.
const history=[['22','25','24','28'],['2.8','2.5','2.7','2.1'],['13','12','12.5','11'],['112','104','108','98'],['360','344','351','320']];
const shortNames=['Vitamina D','hs-CRP','Insulina','ApoB','Ferritina'];
const views=['Evolución','Rangos','Lectura'] as const;
type Point={x:number;y:number};
function curve(points:Point[]){return points.map((p,i)=>{if(!i)return `M${p.x},${p.y}`;const a=points[i-1],before=points[Math.max(0,i-2)],after=points[Math.min(points.length-1,i+1)];return `C${a.x+(p.x-before.x)/6},${a.y+(p.y-before.y)/6} ${p.x-(after.x-a.x)/6},${p.y-(after.y-a.y)/6} ${p.x},${p.y}`}).join(' ')}

export function BiomarkerGallery({calm=false}:{calm?:boolean}){
 const [selected,setSelected]=useState(0),[reading,setReading]=useState(3),[view,setView]=useState<typeof views[number]>('Evolución'),[expanded,setExpanded]=useState(false);
 const item=specimens[selected],values=history[selected],value=values[reading],numbers=values.map(Number),low=Math.min(...numbers),high=Math.max(...numbers);
 const points=numbers.map((v,i)=>({x:32+i*145.3,y:166-(v-low)/(high-low||1)*106})),point=points[reading];
 const max=Math.max(item.standard[1],item.eva[1],Number(value))*1.1;
 return <section id="biomarcadores" className={'biomarker-lab'+(calm?' bio-calm':'')} aria-labelledby="markers-title" data-biomarker-view={view}>
  <div className="section-kicker"><span>03 / LO QUE CUENTAN TUS DATOS</span><span>UNA LECTURA CON CONTEXTO</span></div>
  <div className="bio-layout">
   <div className="bio-intro"><p className="eyebrow">TUS CIFRAS, CON OTRA PERSPECTIVA</p><h2 id="markers-title">Conocerte.<br/>Y ver cómo<br/><em>cambias.</em></h2><p>Tus resultados, reunidos para que puedas compararlos.</p><p>Explora cinco ejemplos. Cambia de lectura para ver su evolución y compara los intervalos de referencia con los rangos de EVA.</p><span className="bio-demo-label"><i/> Demostración con datos ilustrativos</span></div>
   <div className="bio-console" aria-label="Demostración de la interfaz de biomarcadores EVA">
    <div className="bio-console-head"><a href="#una-perspectiva" className="bio-round" aria-label="Volver a la perspectiva de salud"><Arrow direction="up-left"/></a><span>Tu salud, en perspectiva</span><details className="bio-info"><summary aria-label="Acerca de esta demostración">i</summary><p>Esta demostración reúne cuatro lecturas trimestrales ilustrativas. No corresponde a una persona ni anticipa tus resultados.</p></details></div>
    <div className="bio-views" role="group" aria-label="Vista del biomarcador">{views.map(v=><button key={v} aria-pressed={view===v} onClick={()=>setView(v)}>{v}</button>)}</div>
    <div className="bio-main bio-glass">
     <div className="bio-main-heading"><div><h3>{item.name}</h3><p>{item.detail}</p></div><span>0{selected+1} / 05</span></div>
     <div className="bio-main-body" key={view+selected}>
      {view==='Evolución'&&<div className="bio-chart"><p className="bio-chart-value"><span>{value}</span> {item.unit}</p><svg viewBox="0 0 500 224" role="img" aria-label={`${item.name}. Recorrido ilustrativo: ${values.join(', ')} ${item.unit}. Lectura ${reading+1} seleccionada.`}><path d="M24 174H476" stroke="currentColor" strokeOpacity=".2" strokeDasharray="1 5"/><path d={curve(points)} fill="none" stroke="currentColor" strokeWidth="1.6"/><path d={`M${point.x} ${point.y}V196`} fill="none" stroke="currentColor" strokeOpacity=".55" strokeDasharray="1 5"/><circle cx={point.x} cy={point.y} r="19" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".45"/><circle cx={point.x} cy={point.y} r="3.2" fill="currentColor"/></svg></div>}
      {view==='Rangos'&&<div className="bio-range-view"><p className="bio-range-value">{value} <span>{item.unit}</span></p>{[{label:'Intervalo de referencia',range:item.standard},{label:'Rango de longevidad EVA',range:item.eva}].map(row=><div className="bio-range-row" key={row.label}><p>{row.label}<span>{row.range.join('–')} {item.unit}</span></p><div aria-hidden="true"><i style={{left:row.range[0]/max*100+'%',width:(row.range[1]-row.range[0])/max*100+'%'}}/><b style={{left:Number(value)/max*100+'%'}}/></div></div>)}</div>}
      {view==='Lectura'&&<div className="bio-focus-reading"><DotNumber value={value} calm={calm} density="coarse"/><span>{item.unit}</span><p>Lectura 0{reading+1} · {item.name}</p></div>}
     </div>
     <div className="bio-reading-points" role="group" aria-label="Lecturas trimestrales">{values.map((v,i)=><button key={i} aria-pressed={reading===i} aria-label={`Lectura ${i+1}: ${v} ${item.unit}`} onClick={()=>setReading(i)}><span>0{i+1}</span></button>)}</div>
     <div className="bio-period"><button aria-label="Lectura anterior" disabled={reading===0} onClick={()=>setReading(r=>Math.max(0,r-1))}><Arrow direction="left"/></button><span>Lectura 0{reading+1} <i>·</i> Recorrido ilustrativo</span><button aria-label="Siguiente lectura" disabled={reading===3} onClick={()=>setReading(r=>Math.min(3,r+1))}><Arrow/></button></div>
    </div>
    <div className="bio-tiles" role="group" aria-label="Selecciona un biomarcador">{specimens.map((marker,i)=><button key={marker.name} data-biomarker-tile={marker.name} className={'bio-tile bio-glass bio-tone-'+i} aria-pressed={selected===i} aria-label={`${marker.name}: ${history[i][reading]} ${marker.unit}`} onClick={()=>setSelected(i)}><span className="bio-tile-name">{shortNames[i]}</span><div className="bio-tile-value"><DotNumber value={history[i][reading]} calm={calm} density="coarse"/></div><div className="bio-tile-meta"><span>{marker.unit}</span><span className="bio-tile-period">L{reading+1}</span></div></button>)}<button className="bio-all-ranges" aria-expanded={expanded} aria-controls="bio-range-index" onClick={()=>setExpanded(v=>!v)}><span aria-hidden="true">{expanded?'−':'+'}</span><span>{expanded?'Cerrar tabla':'Ver los cinco biomarcadores'}</span></button></div>
    <div id="bio-range-index" hidden={!expanded} className="bio-range-index"><div className="bio-table-scroll" tabIndex={0} role="region" aria-label="Tabla de intervalos de los cinco biomarcadores"><table><caption>Lectura 04 · Valores ilustrativos</caption><thead><tr><th scope="col">Biomarcador</th><th scope="col">Valor</th><th scope="col">Referencia</th><th scope="col">EVA</th></tr></thead><tbody>{specimens.map(marker=><tr key={marker.name}><th scope="row">{marker.name}<small>{marker.unit}</small></th><td>{marker.value}</td><td>{marker.standard.join('–')}</td><td>{marker.eva.join('–')}</td></tr>)}</tbody></table></div></div>
    <div className="bio-console-foot"><span>eva</span><p>Tus resultados.<br/>A lo largo del tiempo.</p></div>
   </div>
  </div>
  <p className="illustration-note">Datos y recorrido ilustrativos. Los intervalos mostrados no son una recomendación individual; su interpretación depende del contexto de cada persona.</p>
 </section>;
}
