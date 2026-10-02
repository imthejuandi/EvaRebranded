'use client';

import {useState} from 'react';
import {EditorialReveal} from '@/components/engagement/EditorialReveal';
import ServiceCalendar, {type PlanId} from './ServiceCalendar';
import ServiceContents from './ServiceContents';
import {RhythmTheatre} from './RhythmTheatre';

type FAQCategory = 'pricing' | 'testing' | 'results' | 'data';
type Marker = {code:string; name:string; category:string; range:string; meaning:string};

export const pricingCopy = {es: {
  eyebrow: 'PRECIOS / TRES FORMAS DE EMPEZAR',
  title: ['Elige cómo', 'quieres empezar.'],
  intro: 'Con resultados que ya tienes o con una nueva recogida de muestra. Compara qué incluye cada opción.',
  selectLabel: 'Elige una forma de empezar',
  plans: [
    {id:'free' as PlanId, label:'Tus resultados', name:'Tus resultados', price:'0', cadence:'sin suscripción', summary:'Reúne un informe que ya tienes y explora sus resultados.', includes:['Un documento con tus resultados.','Valores, unidades y fecha en un mismo lugar.','Recorrido de ejemplo disponible en esta vista previa.'], action:'Subir una analítica', href:'/es/upload', foot:'Gratis. Sin tarjeta de crédito.', art:'TU PUNTO DE PARTIDA', artDetail:'La lectura que ya tienes.'},
    {id:'quarterly' as PlanId, label:'Cada trimestre', name:'EVA Trimestral', price:'99', cadence:'por trimestre', summary:'Recogida de muestra en casa y seguimiento a lo largo del tiempo.', includes:['15 biomarcadores y recogida en casa con Tasso+.','Kit y envío en ambas direcciones incluidos.','Informe y comparación de resultados.'], action:'Explorar EVA Trimestral', href:'/es/signup?plan=quarterly', foot:'Renovación trimestral ilustrativa. Revisa las condiciones antes de contratar.', art:'UN AÑO, CUATRO LECTURAS', artDetail:'15 biomarcadores en cada lectura.'},
    {id:'full' as PlanId, label:'En laboratorio', name:'Panel en laboratorio', price:'499', cadence:'pago único', summary:'Una extracción en laboratorio para el panel que hayas elegido.', includes:['Extracción clínica en laboratorio asociado.','Interpretación e informe EVA completos.','Opción de añadir seguimiento trimestral después.'], action:'Explorar esta opción', href:'/es/signup?plan=full', foot:'Confirma el alcance del panel antes de reservar.', art:'AMPLÍA LA PERSPECTIVA', artDetail:'Una extracción en laboratorio.'},
  ],
  rhythm: {title:'Conocer. Comparar. Continuar.', description:'Una lectura sitúa tu punto de partida. Las siguientes ayudan a observar tu evolución.', labels:['Primera lectura','A los 3 meses','A los 6 meses','A los 9 meses'], previous:'Lectura anterior', next:'Siguiente lectura', unit:'biomarcadores por lectura', control:'Explora las cuatro lecturas de un año'},
  comparison: {
    eyebrow:'01 / TODO, LADO A LADO', title:'El detalle también importa.', description:'Opciones de la demostración. Precios, paneles y condiciones se muestran como referencia y están pendientes de confirmación comercial.',
    headings:['Tus resultados','EVA Trimestral','Panel en laboratorio'], prices:['0 €','99 € / trimestre','499 € · pago único'], included:'Incluido', unavailable:'No incluido',
    groups:[
      {title:'Pruebas', rows:[
        {label:'Valores y unidades del informe', cells:[true,true,true]},
        {label:'Kit para recogida en casa', cells:[false,true,false]},
        {label:'Extracción en laboratorio asociado', cells:[false,false,true]},
        {label:'Biomarcadores analizados', cells:['Los de tu informe','15','Según panel']},
        {label:'Cadencia', cells:['Cuando tú decidas','Cada trimestre','Una extracción']},
      ]},
      {title:'Interpretación', rows:[
        {label:'Edad biológica estimada', cells:['Por confirmar','Por confirmar','Por confirmar']},
        {label:'EVA AI', cells:[false,'Demostración','Demostración']},
        {label:'Lectura descriptiva del informe', cells:[true,true,true]},
        {label:'Seguimiento trimestral', cells:[false,true,false]},
        {label:'Datos de wearables', cells:[false,'Importación de ejemplo','Importación de ejemplo']},
      ]},
      {title:'Flexibilidad', rows:[
        {label:'Cambiar a un panel especializado', cells:[false,'Consulta condiciones',false]},
        {label:'Añadir paneles especializados', cells:[false,'Con presupuesto','Con presupuesto']},
        {label:'Cancelar la suscripción', cells:['No aplica','Condiciones por confirmar','No aplica']},
        {label:'Exportar y conservar tus datos', cells:[true,true,true]},
      ]},
    ],
    note:'La disponibilidad de las estimaciones depende de los datos necesarios. El alcance del panel completo y las condiciones de los paneles especializados se confirman antes de contratar.',
  },
  process: {eyebrow:'02 / DE TU CASA A TUS RESULTADOS', title:'Un proceso sencillo.', steps:[
    {number:'01', title:'Pide tu kit', body:'Explora EVA Trimestral y consulta la disponibilidad de envío a tu dirección.', detail:'ENVÍO INCLUIDO'},
    {number:'02', title:'Recoge y devuelve', body:'Recoge la muestra en casa siguiendo las instrucciones de Tasso+. Utiliza el sobre prepagado para enviarla al laboratorio.', detail:'RECOGIDA EN CASA'},
    {number:'03', title:'Lee con contexto', body:'Consulta los valores, las unidades y la fecha de tu informe.', detail:'ANÁLISIS EN LABORATORIO'},
  ], timing:'Los plazos de envío y de análisis se confirmarán antes de contratar. Esta vista previa muestra el recorrido de la muestra.', link:'Ver el método completo'},
  report: {eyebrow:'03 / ASÍ SE LEE UN TRIMESTRE', title:['Los números,','en su lugar.'], body:'Tu informe reúne valores, unidades y contexto. Puedes volver a cada lectura para comparar lo que ha cambiado.', badge:'INFORME DE EJEMPLO', date:'LECTURA 02 / 2026', labels:['Biomarcador','Resultado','Lectura de ejemplo'], statuses:['Ejemplo','Ejemplo'], note:'Ejemplo ilustrativo. Los valores y estados muestran cómo se presenta una lectura; no corresponden a tus resultados.', detail:'Las lecturas se pueden comparar sin atribuir un cambio a un hábito concreto. EVA AI aporta explicaciones educativas para ayudarte a entender el informe.', action:'Explorar un informe de ejemplo'},
  markers: {eyebrow:'04 / EL PANEL TRIMESTRAL', title:'Conoce el panel de ejemplo.', intro:'Explora las 15 referencias de esta demostración. La composición del panel comercial está pendiente de confirmación.', label:'Selecciona un biomarcador', range:'Rango publicado por EVA', note:'La referencia para interpretar un valor procede del laboratorio y del contexto del informe. Este catálogo es ilustrativo.', categories:{cardio:'Cardiovascular', metabolic:'Metabólico', nutrient:'Nutricional'}},
  specialty: {eyebrow:'05 / CUANDO QUIERAS PROFUNDIZAR', title:'Una pregunta más concreta.', intro:'Explora las áreas del catálogo de ejemplo y consulta la disponibilidad, el alcance y el precio de cada panel.', action:'Solicitar presupuesto', items:[
    {id:'hormonal', title:'Hormonal', copy:'Hormonas sexuales, cortisol y DHEA-S.'},
    {id:'cardiovascular', title:'Cardiovascular', copy:'Subfracciones lipídicas, ApoB, Lp(a) y marcadores inflamatorios.'},
    {id:'thyroid', title:'Tiroideo', copy:'TSH, T3 libre, T4 libre y anticuerpos tiroideos.'},
    {id:'nutritional', title:'Nutricional', copy:'Vitaminas y minerales: B12, folato, hierro, zinc, magnesio y más.'},
    {id:'inflammatory', title:'Inflamatorio', copy:'hs-CRP, IL-6, TNF-α y homocisteína.'},
    {id:'hepatic', title:'Hepático', copy:'ALT, AST, GGT, bilirrubina y albúmina.'},
  ]},
  terms: {eyebrow:'06 / CON LAS CONDICIONES CLARAS', title:'Tú decides cómo seguir.', items:[
    {title:'Una renovación trimestral.', body:'La demostración representa una suscripción trimestral. Las condiciones de renovación, cancelación y reembolso se confirmarán antes de contratar.', link:'Leer las condiciones', href:'/es/legal/terms'},
    {title:'Tus datos siguen siendo tuyos.', body:'Puedes solicitar su exportación o eliminación. Consulta cómo se almacenan, quién los procesa y cómo ejercer tus derechos.', link:'Cómo tratamos tus datos', href:'/es/legal/privacy'},
    {title:'99 € por trimestre.', body:'Precio ilustrativo para el panel base, el kit y el envío de ida y vuelta. El alcance final de las funciones y los paneles adicionales está pendiente de confirmación.', link:'Volver a comparar', href:'#comparar-planes'},
  ]},
  founder:{quote:'EVA es el servicio que hubiera querido cuando empecé mi propio camino de salud preventiva: uno que no solo te entrega datos, sino que te enseña qué significan y qué hacer con ellos.', name:'Juan Diego Lago', role:'Fundador y CEO', action:'La historia de EVA'},
  faq: {eyebrow:'07 / ANTES DE EMPEZAR', title:'Tus preguntas, con espacio.', label:'Categorías de preguntas frecuentes', categories:[{id:'pricing' as FAQCategory,label:'Precios'},{id:'testing' as FAQCategory,label:'Pruebas'},{id:'results' as FAQCategory,label:'Resultados'},{id:'data' as FAQCategory,label:'Datos y privacidad'}], items:[
    {category:'pricing', question:'¿Cómo funciona el ritmo trimestral?', answer:'La demostración ilustra una lectura cada 3 meses. Comparar resultados de distintas fechas permite observar cambios. La cadencia y las condiciones finales se confirmarán antes de contratar.'},
    {category:'pricing', question:'¿Qué incluye este plan?', answer:'La opción ilustrada reúne un panel de 15 biomarcadores, el kit Tasso+ y el envío de ida y vuelta. El panel comercial, las funciones incluidas y las condiciones finales están pendientes de confirmación.'},
    {category:'pricing', question:'¿Puedo pausar mi suscripción?', answer:'Las opciones de pausa, cancelación y renovación se confirmarán en las condiciones del servicio antes de contratar. Esta demostración no activa una suscripción.'},
    {category:'testing', question:'¿Cómo funciona el kit de recogida en casa?', answer:'El dispositivo recoge una pequeña muestra de sangre capilar desde el brazo. La información original describe una micro-lanceta y un sistema de vacío, sin jeringa ni extracción venosa. Sigue siempre las instrucciones incluidas con tu dispositivo.'},
    {category:'testing', question:'¿Cómo envío la muestra al laboratorio?', answer:'Sigue las instrucciones de retorno incluidas en el kit. Allí encontrarás cómo preparar la muestra y entregarla al transportista.'},
    {category:'testing', question:'¿Cómo interpreto un resultado señalado?', answer:'Consulta el informe del laboratorio y sus intervalos de referencia junto a un profesional sanitario. Las etiquetas de esta demostración son ilustrativas. EVA ofrece información educativa y no sustituye el diagnóstico ni la atención de un profesional sanitario.'},
    {category:'results', question:'¿Cuándo podré ver mis resultados?', answer:'El plazo de análisis y su fecha de inicio se confirmarán antes de contratar. El recorrido de ejemplo distingue el envío, la recepción en laboratorio y la publicación del informe.'},
    {category:'results', question:'¿Cuál es la diferencia entre el panel base y uno especializado?', answer:'El panel base reúne 15 biomarcadores relacionados con la salud metabólica, cardiovascular y nutricional. Los especializados profundizan en un sistema, como las hormonas, la tiroides o la inflamación. Su disponibilidad e inclusión dependen de las condiciones del panel.'},
    {category:'data', question:'¿Cómo puedo consultar o eliminar mis datos?', answer:'En tu perfil puedes consultar las opciones de exportación y solicitar la eliminación de datos. La Política de Privacidad explica el procedimiento y quién participa en el tratamiento.'},
    {category:'data', question:'¿Dónde se guardan mis datos?', answer:'La Política de Privacidad describe almacenamiento en infraestructura de Supabase dentro de la Unión Europea, cifrado en reposo y en tránsito. También explica que determinados tratamientos con IA pueden implicar transferencias fuera del EEE con las garantías indicadas en esa política.'},
    {category:'data', question:'¿Puedo subir mis analíticas sin suscripción?', answer:'Sí. Puedes subir una analítica sin suscripción. Necesitas una cuenta y el consentimiento para tratar tus datos de salud. En esta vista previa puedes explorar un informe de ejemplo.'},
  ]},
  closing: {eyebrow:'TU SIGUIENTE PASO', title:'Un primer paso que encaje contigo.', copy:'Con una analítica que ya tienes o con tu primera lectura de EVA.', primary:'Elegir EVA Trimestral', secondary:'Subir una analítica', note:'Vista previa del recorrido. No se realizan cargos ni reservas.'},
  ui:{choose:'Ver este plan', comparison:'Comparar las tres opciones', euro:'euros', complete:'Análisis completo', sampleReport:'Ver ejemplo de informe', rangeNote:'Ver condiciones del panel', markerGroup:'Biomarcadores del panel trimestral', selectedQuarter:'Lectura seleccionada', visualLabel:'Ritmo de análisis según el plan seleccionado', previous:'Anterior', next:'Siguiente', reference:'Lectura ilustrativa', inPlan:'15 biomarcadores', single:'Una lectura', uploaded:'Tus resultados'},
}};

export const pricingMarkers: Marker[] = [
  {code:'ApoB',name:'Apolipoproteína B',category:'cardio',range:'< 80 mg/dL',meaning:'Aporta información sobre las partículas que transportan colesterol y el contexto cardiovascular.'},
  {code:'hs-CRP',name:'Proteína C reactiva ultrasensible',category:'cardio',range:'< 1,0 mg/L',meaning:'Un marcador que permite observar la inflamación sistémica junto a otros resultados.'},
  {code:'HbA1c',name:'Hemoglobina A1c',category:'metabolic',range:'< 5,4 %',meaning:'Refleja el promedio de glucosa de los últimos meses.'},
  {code:'Insulina',name:'Insulina en ayunas',category:'metabolic',range:'< 7 µIU/mL',meaning:'Ayuda a dar contexto al metabolismo de la glucosa.'},
  {code:'Triglicéridos',name:'Triglicéridos',category:'metabolic',range:'< 100 mg/dL',meaning:'Mide un tipo de grasa presente en la sangre y forma parte de la lectura metabólica.'},
  {code:'HDL',name:'Colesterol HDL',category:'cardio',range:'> 55 mg/dL',meaning:'Una parte del perfil de lípidos que se interpreta junto al resto de los valores cardiovasculares.'},
  {code:'LDL',name:'Colesterol LDL',category:'cardio',range:'< 100 mg/dL',meaning:'Otra parte del perfil de colesterol para contextualizar la salud cardiovascular.'},
  {code:'Ferritina',name:'Ferritina',category:'nutrient',range:'30–150 ng/mL',meaning:'Aporta información sobre las reservas de hierro del cuerpo.'},
  {code:'Vitamina D',name:'Vitamina D · 25-OH',category:'nutrient',range:'40–60 ng/mL',meaning:'Permite conocer el estado de vitamina D.'},
  {code:'B12',name:'Vitamina B12',category:'nutrient',range:'400–900 pg/mL',meaning:'Una vitamina relacionada con la función del sistema nervioso y otros procesos del organismo.'},
  {code:'TSH',name:'Hormona estimulante de la tiroides',category:'metabolic',range:'0,5–2,5 mIU/L',meaning:'Aporta contexto sobre la regulación de la función tiroidea.'},
  {code:'ALT',name:'Alanina aminotransferasa',category:'metabolic',range:'< 25 U/L',meaning:'Una enzima que se interpreta dentro del conjunto de resultados relacionados con el hígado.'},
  {code:'Creatinina',name:'Creatinina',category:'metabolic',range:'0,7–1,2 mg/dL',meaning:'Ayuda a evaluar el contexto de la filtración renal.'},
  {code:'Ácido úrico',name:'Ácido úrico',category:'metabolic',range:'3,5–6,0 mg/dL',meaning:'Un producto del metabolismo de las purinas que forma parte de la lectura metabólica.'},
  {code:'GGT',name:'Gamma-glutamil transferasa',category:'metabolic',range:'< 30 U/L',meaning:'Una enzima relacionada con el hígado y las vías biliares.'},
];

const reportRows = [
  {name:'ApoB',value:'74',unit:'mg/dL',position:52,zoneMid:42,zoneWidth:50,status:0},
  {name:'hs-CRP',value:'0,6',unit:'mg/L',position:22,zoneMid:20,zoneWidth:30,status:0},
  {name:'HbA1c',value:'5,2',unit:'%',position:48,zoneMid:42,zoneWidth:35,status:0},
  {name:'Insulina',value:'4,8',unit:'µIU/mL',position:32,zoneMid:35,zoneWidth:40,status:0},
  {name:'Vitamina D',value:'38',unit:'ng/mL',position:74,zoneMid:60,zoneWidth:22,status:1},
  {name:'Ferritina',value:'92',unit:'ng/mL',position:54,zoneMid:50,zoneWidth:60,status:0},
];

function Arrow({back=false}:{back?:boolean}){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={back?{transform:'rotate(180deg)'}:undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3"/></svg>}

export default function PricingPage(){
  const c=pricingCopy.es;
  const [plan,setPlan]=useState<PlanId>('quarterly'),[quarter,setQuarter]=useState(0),[faqCategory,setFaqCategory]=useState<FAQCategory>('pricing'),[marker,setMarker]=useState(0);
  const [billing,setBilling]=useState<'quarterly'|'annual'>('quarterly');
  const selectedPlan=c.plans.find(item=>item.id===plan)!;
  const current=plan==='quarterly'&&billing==='annual'?{...selectedPlan,name:'EVA Anual',price:'396',cadence:'por año',href:'/es/signup?plan=annual',action:'Explorar EVA Anual',foot:'Facturación anual ilustrativa, con recogida cada trimestre. Revisa las condiciones antes de contratar.'}:selectedPlan;
  const annual=billing==='annual';
  const comparisonHeadings=c.comparison.headings.map((text,i)=>i===1&&annual?'EVA Anual':text);
  const comparisonPrices=c.comparison.prices.map((text,i)=>i===1&&annual?'396 € / año':text);
  const terms=c.terms.items.map((item,i)=>annual&&i===0?{...item,title:'Una renovación anual.',body:'Facturación anual con una recogida cada trimestre. Las condiciones de renovación, cancelación y reembolso se confirmarán antes de contratar.'}:annual&&i===2?{...item,title:'396 € por año.',body:'Precio ilustrativo para cuatro lecturas trimestrales, sus kits y el envío de ida y vuelta. El alcance final de las funciones y los paneles adicionales está pendiente de confirmación.'}:item);
  const selectedMarker=pricingMarkers[marker];
  return <div className="page-pricing">
    <EditorialReveal as="section" className="pricing-hero eva-inner" aria-labelledby="pricing-title">
      <div className="pricing-intro"><p className="eva-kicker">Tres formas de empezar</p><h1 id="pricing-title" data-editorial-reveal>{c.title.join(' ')}</h1><p>{c.intro}</p></div>
      <p className="pricing-preview-note">Vista previa · Precios y servicios ilustrativos. Puedes explorar el recorrido sin cargos ni reservas.</p>
      <div className="pricing-plan-selector" role="group" aria-label={c.selectLabel}>{c.plans.map((item)=><button key={item.id} type="button" aria-pressed={plan===item.id} onClick={()=>{setPlan(item.id);setQuarter(0)}}><span>{item.label}</span><span className="pricing-selector-price">{item.id==='quarterly'&&annual?'396':item.price} €<small>{item.id==='quarterly'&&annual?'por año':item.cadence}</small></span><span className="pricing-selector-dot" aria-hidden="true"/></button>)}</div>
      <EditorialReveal className="pricing-selected-plan" replayKey={plan}>
        <div className="pricing-plan-topline"><h2>{current.name}</h2></div>
        {plan==='quarterly'&&<fieldset className="pricing-billing"><legend>Facturación del seguimiento</legend><label><input type="radio" name="billing" value="quarterly" checked={billing==='quarterly'} onChange={()=>setBilling('quarterly')}/>Trimestral</label><label><input type="radio" name="billing" value="annual" checked={billing==='annual'} onChange={()=>setBilling('annual')}/>Anual</label></fieldset>}
        <p className="pricing-selected-price"><span>{current.price}<small>€</small></span><span>{current.cadence}</span></p>
        <p className="pricing-plan-summary" data-editorial-reveal>{current.summary}</p>
        <a className="pricing-action" href={current.href}>{current.action}<Arrow/></a><p className="pricing-plan-footnote">{current.foot}</p>
        <ul className="pricing-inclusions" data-editorial-reveal>{current.includes.map(text=><li key={text}>{text}</li>)}</ul>
        <a className="pricing-line-link pricing-compare-link" href="#comparar-planes">{c.ui.comparison}<Arrow/></a>
      </EditorialReveal>
      <ServiceContents plan={plan}/>
    </EditorialReveal>

    <RhythmTheatre plan={plan}/><section className="pricing-rhythm-section eva-inner" aria-labelledby="pricing-rhythm-heading"><div className="pricing-rhythm-copy"><p className="eva-kicker">A TU RITMO</p><h2 id="pricing-rhythm-heading">{c.rhythm.title}</h2><p>{c.rhythm.description}</p></div><ServiceCalendar key={plan} plan={plan} quarter={quarter} onQuarterChange={setQuarter} markers={pricingMarkers}/></section>

    <EditorialReveal as="section" className="pricing-section eva-inner" id="comparar-planes" aria-labelledby="pricing-comparison-heading"><div className="pricing-section-head"><p className="eva-kicker">{c.comparison.eyebrow}</p><div><h2 data-editorial-reveal id="pricing-comparison-heading">{c.comparison.title}</h2><p>{c.comparison.description}</p></div></div><p className="pricing-table-hint">Desliza la tabla para comparar las tres opciones.</p><div className="pricing-table-scroll" tabIndex={0} role="region" aria-label={c.ui.comparison}><table className="pricing-comparison"><caption className="pricing-sr-only">{c.comparison.title}</caption><thead><tr><th scope="col"><span className="pricing-sr-only">Incluye</span></th>{comparisonHeadings.map((text,i)=><th scope="col" key={text} className={c.plans[i].id===plan?'pricing-featured-col':''}>{text}<span>{comparisonPrices[i]}</span></th>)}</tr></thead>{c.comparison.groups.map(group=><tbody key={group.title}><tr className="pricing-table-group"><th colSpan={4} scope="rowgroup">{group.title}</th></tr>{group.rows.map(row=><tr key={row.label}><th scope="row">{row.label}</th>{row.cells.map((cell,i)=><td key={i} className={c.plans[i].id===plan?'pricing-featured-col':''}>{typeof cell==='boolean'?<><span aria-hidden="true" className={cell?'pricing-check':'pricing-dash'}>{cell?'✓':'—'}</span><span className="pricing-sr-only">{cell?c.comparison.included:c.comparison.unavailable}</span></>:cell}</td>)}</tr>)}</tbody>)}</table></div><p className="pricing-note">{c.comparison.note}</p></EditorialReveal>

    <EditorialReveal as="section" className="pricing-section pricing-process eva-inner" aria-labelledby="pricing-process-heading"><div className="pricing-section-head"><p className="eva-kicker">{c.process.eyebrow}</p><h2 data-editorial-reveal id="pricing-process-heading">{c.process.title}</h2></div><ol>{c.process.steps.map(step=><li key={step.number} data-editorial-reveal><span className="pricing-process-number">{step.number}</span><div><p className="eva-kicker">{step.detail}</p><h3>{step.title}</h3><p>{step.body}</p></div></li>)}</ol><div className="pricing-process-foot"><p className="pricing-note">{c.process.timing}</p><a className="pricing-line-link" href="/es/how-it-works">{c.process.link}<Arrow/></a></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-report-section" aria-labelledby="pricing-report-heading"><div className="eva-inner pricing-report-layout"><div className="pricing-report-copy"><p className="eva-kicker">{c.report.eyebrow}</p><h2 data-editorial-reveal id="pricing-report-heading">{c.report.title[0]}<br/><em>{c.report.title[1]}</em></h2><p>{c.report.body}</p><p className="pricing-note">{c.report.detail}</p><a className="pricing-line-link" href="/es/labs/demo-junio">{c.report.action}<Arrow/></a></div><div className="pricing-specimen"><div className="pricing-specimen-head"><span>{c.report.badge}</span><span>{c.report.date}</span></div><table><thead><tr>{c.report.labels.map(text=><th key={text} scope="col">{text}</th>)}</tr></thead><tbody>{reportRows.map(row=><tr key={row.name}><th scope="row">{row.name}</th><td><strong>{row.value}</strong><span>{row.unit}</span></td><td><span className={row.status?'pricing-status-attention':'pricing-status-optimal'}>{c.report.statuses[row.status]}</span></td></tr>)}</tbody></table><p className="pricing-note">{c.report.note}</p></div></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-section eva-inner" aria-labelledby="pricing-markers-heading"><div className="pricing-section-head"><p className="eva-kicker">{c.markers.eyebrow}</p><div><h2 data-editorial-reveal id="pricing-markers-heading">{c.markers.title}</h2><p>{c.markers.intro}</p></div></div><div className="pricing-marker-layout"><div className="pricing-marker-list" role="group" aria-label={c.markers.label}>{pricingMarkers.map((item,i)=><button key={item.code} type="button" aria-pressed={marker===i} onClick={()=>setMarker(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.code}<span aria-hidden="true">{marker===i?'−':'+'}</span></button>)}</div><div className="pricing-marker-reading" aria-live="polite"><div className="pricing-marker-lens" aria-hidden="true"><span/><span/><span/></div><p className="eva-kicker">{c.markers.categories[selectedMarker.category as keyof typeof c.markers.categories]}</p><h3>{selectedMarker.name}</h3><p>{selectedMarker.meaning}</p><p className="pricing-note">{c.markers.note}</p></div></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-specialty-section" aria-labelledby="pricing-specialty-heading"><div className="eva-inner"><div className="pricing-section-head"><p className="eva-kicker">{c.specialty.eyebrow}</p><div><h2 data-editorial-reveal id="pricing-specialty-heading">{c.specialty.title}</h2><p>{c.specialty.intro}</p></div></div><div className="pricing-specialty-list">{c.specialty.items.map((item,i)=><article key={item.id}><span className="pricing-specialty-index">0{i+1}</span><h3>{item.title}</h3><p>{item.copy}</p><a href={`/es/contact?panel=${item.id}`} aria-label={`${c.specialty.action}: ${item.title}`}>{c.specialty.action}<Arrow/></a></article>)}</div></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-section eva-inner" aria-labelledby="pricing-terms-heading"><div className="pricing-section-head"><p className="eva-kicker">{c.terms.eyebrow}</p><h2 data-editorial-reveal id="pricing-terms-heading">{c.terms.title}</h2></div><div className="pricing-promises">{terms.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.body}</p><a className="pricing-line-link" href={item.href}>{item.link}<Arrow/></a></article>)}</div></EditorialReveal>

    <EditorialReveal as="figure" className="pricing-human-pause eva-inner"><div className="pricing-photo-window" data-editorial-photo><img src="/art/editorial/after-the-morning-1024.webp" srcSet="/art/editorial/after-the-morning-600.webp 600w, /art/editorial/after-the-morning-1024.webp 1024w" sizes="(max-width: 760px) 90vw, 60vw" width="1024" height="688" loading="lazy" alt="Dos personas hacen una pausa en casa después de entrenar, con un vaso de agua y una chaqueta sobre la silla."/></div><figcaption><span data-editorial-reveal>Un momento para ti.</span><p data-editorial-reveal>Entender tus resultados también tiene su lugar entre todo lo demás.</p></figcaption></EditorialReveal>

    <EditorialReveal as="section" className="pricing-section pricing-faq eva-inner" aria-labelledby="pricing-faq-heading"><div className="pricing-section-head"><p className="eva-kicker">{c.faq.eyebrow}</p><h2 data-editorial-reveal id="pricing-faq-heading">{c.faq.title}</h2></div><div className="pricing-faq-layout"><div className="pricing-faq-tabs" role="group" aria-label={c.faq.label}>{c.faq.categories.map(cat=><button type="button" key={cat.id} aria-pressed={faqCategory===cat.id} onClick={()=>setFaqCategory(cat.id)}>{cat.label}<span>{String(c.faq.items.filter(item=>item.category===cat.id).length).padStart(2,'0')}</span></button>)}</div><div className="pricing-faq-items">{c.faq.categories.map(cat=><div key={cat.id} hidden={faqCategory!==cat.id}>{c.faq.items.filter(item=>item.category===cat.id).map(item=><details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><div><p>{item.answer}</p>{cat.id==='data'&&<a href="/es/legal/privacy" className="pricing-line-link">Política de privacidad<Arrow/></a>}</div></details>)}</div>)}</div></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-closing"><div className="eva-inner"><p className="eva-kicker">{c.closing.eyebrow}</p><h2>{c.closing.title}</h2><p>{c.closing.copy}</p><div className="pricing-closing-actions"><a className="pricing-action" href={current.href}>{current.action}<Arrow/></a><a className="pricing-line-link" href="/es/labs/demo-junio">Explorar un informe de ejemplo<Arrow/></a></div><p className="pricing-note">{current.price} € · {current.cadence}. {c.closing.note}</p></div></EditorialReveal>
  </div>
}
