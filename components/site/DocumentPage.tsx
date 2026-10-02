import {ArrowDown, ArrowUpRight, ArrowRight, FileText} from 'lucide-react';
import documents from '@/lib/site-content/documents.json';

type DocumentKey = keyof typeof documents;
const titles: Record<DocumentKey, string> = {
  'legal/privacy': 'Privacidad',
  'legal/terms': 'Condiciones del servicio',
  'legal/cookies': 'Cookies',
  'metodologia': 'Cómo se construye una estimación.',
  'metodologia/completa': 'La metodología, paso a paso.',
};
const fullDocumentAnchors = ['resumen', 'que-es', 'datos', 'calibracion', 'metodo', 'validacion', 'dos-niveles', 'limitaciones', 'mejora', 'refs'];

/** Preserve imported words; add missing fragment targets and keyboard-accessible table containers. */
export function prepareDocumentHtml(key: DocumentKey, importedHtml: string) {
  let table = 0;
  let html = importedHtml.replace(/<main>/g, '<div class="eva-imported-document">').replace(/<\/main>/g, '</div>');
  if (key === 'metodologia/completa') {
    html = html.replace(/<h2 id="section-(\d+)">/g, (heading, index: string) => {
      const alias = fullDocumentAnchors[Number(index) - 1];
      return alias ? `<span id="${alias}" class="eva-document-anchor" aria-hidden="true"></span>${heading}` : heading;
    });
  }
  html = html.replace(/<pre>/g, '<pre tabindex="0" role="region" aria-label="Fórmula o ejemplo del documento">');
  return html.replace(/<table\b([^>]*)>/g, (_, attributes: string) => `<div class="eva-document-table-scroll" role="region" tabindex="0" aria-label="Tabla ${++table} del documento; desplázate horizontalmente si es necesario"><table${attributes}>`).replace(/<\/table>/g, '</table></div>');
}

function MethodGuide({full}: {full: boolean}) {
  const steps = [
    {title: 'Datos', body: 'Resultados de laboratorio y la información que requiere el método.', href: full ? '#section-3' : '#section-2', detail: 'Qué información se utiliza'},
    {title: 'Método', body: 'Un modelo relaciona esos datos según reglas y supuestos explícitos.', href: full ? '#section-5' : '#section-2', detail: 'Cómo se relacionan los datos'},
    {title: 'Estimación', body: 'Un resultado derivado, acompañado de sus límites y de lo que no puede explicar.', href: full ? '#section-8' : '#section-3', detail: 'Leer los límites'},
  ];
  return <section className="eva-method-guide" aria-labelledby="document-guide-heading"><div className="eva-method-guide-heading"><h2 id="document-guide-heading">Del dato a una estimación.</h2><p>Una guía de lectura, sin cifras de demostración.</p></div><ol>{steps.map((step, index) => <li key={step.title}><div className="eva-method-guide-step"><span>0{index + 1}</span><ArrowRight size={18} strokeWidth={1.2} aria-hidden="true"/></div><h3>{step.title}</h3><p>{step.body}</p><a href={step.href}>{step.detail}<ArrowDown size={14} aria-hidden="true"/></a></li>)}</ol></section>;
}

export default function DocumentPage({documentKey}: {documentKey: DocumentKey}) {
  const doc = documents[documentKey];
  const legal = documentKey.startsWith('legal/');
  const full = documentKey === 'metodologia/completa';
  return <div className={`eva-document ${legal ? 'eva-document-legal' : 'eva-document-method'}`}>
    <header className="eva-document-intro eva-inner"><div className="eva-document-topline"><p>{legal ? 'Información legal' : 'Métodos y evidencia'}</p><span>{legal ? 'Texto de origen · Marzo de 2026' : 'Documento importado · Evidencia en revisión'}</span></div><h1>{titles[documentKey]}</h1><p className="eva-document-intro-copy">{legal ? 'Consulta cómo funciona el servicio y cómo gestionar tus datos.' : 'El método, los datos que utiliza y los límites de cada resultado.'}</p><a className="eva-document-read-link" href="#document-content">Leer el documento<ArrowDown size={16} aria-hidden="true"/></a></header>
    {!legal && <div className="eva-inner"><aside className="eva-document-review-note"><FileText size={23} strokeWidth={1.2} aria-hidden="true"/><div><h2>Evidencia pendiente de revisión.</h2><p>Conservamos el texto importado para su consulta. Esta vista previa no confirma sus afirmaciones de validación ni la disponibilidad de las estimaciones descritas.</p></div></aside>{full ? <nav className="eva-document-quick-links" aria-label="Guía de lectura"><a href="#section-3">Datos<ArrowRight size={14} aria-hidden="true"/></a><a href="#section-5">Método<ArrowRight size={14} aria-hidden="true"/></a><a href="#section-8">Límites<ArrowDown size={14} aria-hidden="true"/></a></nav> : <MethodGuide full={false}/>}</div>}
    <div className="eva-document-layout eva-inner" id="document-content"><aside className="eva-document-index"><div className="eva-document-desktop-index"><p>En este documento</p><nav aria-label="Índice del documento">{doc.toc.map(item => <a key={item.id} href={`#${item.id}`}>{item.title}</a>)}</nav></div><details className="eva-document-mobile-index"><summary>Índice del documento</summary><nav aria-label="Índice del documento">{doc.toc.map(item => <a key={item.id} href={`#${item.id}`}>{item.title}</a>)}</nav></details><a className="eva-document-source" href={doc.source} target="_blank" rel="noreferrer">Consultar el texto original<ArrowUpRight size={14} aria-hidden="true"/><span>Se abre en otra pestaña</span></a>{!legal && <p className="eva-document-source-note">Las referencias y la versión que aparecen a continuación pertenecen al documento importado.</p>}</aside><article className="eva-document-body" aria-label={doc.title} dangerouslySetInnerHTML={{__html: prepareDocumentHtml(documentKey, doc.html)}}/></div>
    <div className="eva-document-bottom eva-inner"><p>Copia importada de evahealth.es en septiembre de 2026. La fecha de importación no modifica la fecha del documento.</p><a href={legal ? '/es/contact' : '/es/science'}>{legal ? 'Contactar con EVA' : 'Volver a cómo leer tus resultados'}<ArrowUpRight size={16} aria-hidden="true"/></a>{!legal && <a href={full ? '/es/metodologia' : '/es/metodologia/completa'}>{full ? 'Volver al resumen' : 'Consultar el documento completo'}<ArrowRight size={16} aria-hidden="true"/></a>}</div>
  </div>;
}
