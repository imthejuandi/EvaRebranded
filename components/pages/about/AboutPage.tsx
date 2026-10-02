import {ArrowDown, ArrowUpRight, Plus} from 'lucide-react';
import {ActionLink} from '@/components/site/Primitives';
import {LifeAperture} from './LifeAperture';
import {EditorialReveal} from '@/components/engagement/EditorialReveal';

export const aboutCopy = {es: {
  eyebrow: 'Nosotros',
  title: 'Cuidarte también es conocerte.',
  intro: 'Creamos EVA para que entender tus resultados sea una parte natural de tu vida.',
  primary: 'Conoce cómo funciona',
  secondary: 'La idea detrás de EVA',
  photo: {
    alt: 'Una mujer lee tranquilamente en casa después de correr, entre luz coral y sombras violetas.',
    caption: 'Un momento para entender.',
    detail: 'Un pequeño momento para ti.',
  },
  purpose: {
    label: 'La idea detrás de EVA',
    title: 'Cuidarte empieza por conocerte.',
    lead: 'EVA nace de una pregunta: ¿cómo hacer que la información sobre tu cuerpo resulte más útil en tu día a día?',
    body: 'Queremos que puedas encontrar tus resultados, entender qué muestran y seguirlos con el tiempo. Que puedas detenerte en un detalle, hacer una pregunta y volver a un informe cuando lo necesites.',
    close: 'La tecnología es una herramienta. Hacer la información más clara es lo que nos guía.',
    founder: 'Juan Diego Lago',
    role: 'Fundador y CEO de EVA',
  },
  principles: {
    title: 'Ideas que se vuelven decisiones.',
    intro: 'Así queremos que se sienta usar EVA: con información que puedas entender y espacio para elegir.',
    expand: 'Cómo lo llevamos al producto',
    items: [
      {id: 'claridad', name: 'Claridad', title: 'Palabras que ayuden a entender.', body: 'Un término técnico puede necesitar una explicación. Queremos que encuentres ambas cosas juntas.', behavior: 'Cada biomarcador tiene un espacio para su valor, su unidad y una explicación en lenguaje claro.', boundary: 'Una explicación educativa no sustituye la valoración de un profesional de salud.', href: '/es/science', link: 'Cómo leer un resultado'},
      {id: 'perspectiva', name: 'Perspectiva', title: 'Cada resultado tiene un origen.', body: 'La fecha de la muestra y el informe del laboratorio forman parte del resultado, no de la letra pequeña.', behavior: 'La fuente acompaña al dato para que puedas volver al documento del que viene.', boundary: 'Un valor aislado no cuenta todo sobre una persona.', href: '/es/labs/demo-junio', link: 'Explorar un informe de ejemplo'},
      {id: 'continuidad', name: 'Continuidad', title: 'Un lugar al que volver.', body: 'Tus preguntas cambian con el tiempo. Los informes anteriores ayudan a recordar desde dónde empezaste.', behavior: 'Los resultados se organizan por muestra para que puedas consultar distintas fechas.', boundary: 'Una diferencia entre dos resultados no explica, por sí sola, su causa.', href: '/es/how-it-works', link: 'Conoce el recorrido'},
      {id: 'eleccion', name: 'Elección', title: 'Preferencias claras sobre lo que compartes.', body: 'Queremos que entiendas para qué se solicita cada dato y dónde revisar tus preferencias.', behavior: 'Las opciones sobre tus datos deben ser comprensibles y fáciles de encontrar.', boundary: 'Los detalles sobre el tratamiento de datos están en la política de privacidad.', href: '/es/legal/privacy', link: 'Consultar privacidad'},
    ],
  },
  contact: {
    title: 'Construyamos una buena conversación.',
    body: 'Cuéntanos en qué te gustaría colaborar o qué pregunta te trajo hasta aquí.',
    action: 'Contactar con EVA',
  },
  closing: {
    title: 'Y después, volver a lo que te gusta.',
    body: 'Encontrar tus resultados. Entender sus detalles. Seguir con tu día.',
    action: 'Conoce el recorrido',
    secondary: 'Explorar EVA',
  },
}} as const;
const copy = aboutCopy.es;

/** Small labeled schematics, not measurements or working privacy controls. */
function PrincipleIllustration({kind}: {kind: string}) {
  if (kind === 'claridad') return <figure data-editorial-reveal className="about-principle-figure" aria-label="Un biomarcador acompañado de una explicación"><svg viewBox="0 0 240 110" fill="none" aria-hidden="true"><path d="M20 23h72v64H20z" stroke="currentColor" opacity=".5"/><path d="M35 42h41M35 52h26M35 66h16M113 55h24m-6-5 6 5-6 5" stroke="currentColor"/><path d="M156 28h64M156 43h51M156 58h64M156 73h43M156 88h58" stroke="currentColor" opacity=".55"/><circle cx="108" cy="23" r="3" fill="currentColor"/></svg><figcaption><span>Biomarcador</span><span>Explicación</span></figcaption></figure>;
  if (kind === 'perspectiva') return <figure data-editorial-reveal className="about-principle-figure about-source-figure" aria-label="Cada resultado permanece junto a su fecha y su fuente"><svg viewBox="0 0 240 110" fill="none" aria-hidden="true"><rect x="14" y="20" width="108" height="70" rx="20" stroke="currentColor" opacity=".45"/><circle cx="68" cy="55" r="9" fill="currentColor"/><path d="M124 55h31V25h54M155 55v30h54" stroke="currentColor" opacity=".5"/><circle cx="215" cy="25" r="3" fill="currentColor"/><circle cx="215" cy="85" r="3" fill="currentColor"/></svg><figcaption><span>Resultado</span><span>Fecha + fuente</span></figcaption></figure>;
  if (kind === 'continuidad') return <figure data-editorial-reveal className="about-principle-figure" aria-label="Tres observaciones independientes en distintas fechas"><svg viewBox="0 0 240 110" fill="none" aria-hidden="true"><path d="M30 74h180" stroke="currentColor" opacity=".3"/>{[30,120,210].map(x => <g key={x}><path d={`M${x} 69v10`} stroke="currentColor"/><circle cx={x} cy="35" r="5" fill="currentColor"/><path d={`M${x} 44v14`} stroke="currentColor" strokeDasharray="2 4" opacity=".5"/></g>)}</svg><figcaption><span>Una muestra</span><span>Otra fecha</span></figcaption></figure>;
  return <figure data-editorial-reveal className="about-principle-figure" aria-label="Opciones visibles para revisar qué información compartes"><svg viewBox="0 0 240 110" fill="none" aria-hidden="true"><path d="M90 18H24v74h66M152 18h65v74h-65" stroke="currentColor" opacity=".45"/><rect x="60" y="26" width="34" height="16" rx="8" stroke="currentColor"/><circle cx="84" cy="34" r="4" fill="currentColor"/><rect x="60" y="66" width="34" height="16" rx="8" stroke="currentColor"/><circle cx="70" cy="74" r="4" fill="currentColor" opacity=".5"/><path d="M113 34h72M113 74h49" stroke="currentColor" opacity=".6"/></svg><figcaption><span>Tus preferencias</span><span>Tus decisiones</span></figcaption></figure>;
}

export default function AboutPage() {
  return <div className="page-about">
    <LifeAperture><div className="about-opening-copy"><p className="about-page-label">{copy.eyebrow}</p><h1 id="about-heading">{copy.title}</h1><p className="about-opening-intro">{copy.intro}</p><ActionLink href="/es/how-it-works">{copy.primary}</ActionLink><a className="about-text-link about-story-link" href="#origen">{copy.secondary}<ArrowDown size={16} aria-hidden="true"/></a></div></LifeAperture>
    <EditorialReveal as="section" className="eva-inner about-purpose" id="origen" aria-labelledby="about-purpose-heading">
      <div className="about-essay-margin"><p>{copy.purpose.label}</p><figure className="about-everyday-notes" data-testid="everyday-notes"><div data-editorial-photo><img src="/art/editorial/about-everyday-notes-1200.webp" srcSet="/art/editorial/about-everyday-notes-640.webp 640w, /art/editorial/about-everyday-notes-1200.webp 896w" sizes="(max-width: 760px) 90vw, 34vw" width="896" height="1120" loading="lazy" decoding="async" alt="Un cuaderno abierto, una taza y una mano sobre una mesa de casa, con luz cálida y textura de película."/></div><figcaption>Hacerle un sitio a lo que importa.</figcaption></figure><div className="about-founder-credit"><span>{copy.purpose.founder}</span><span>{copy.purpose.role}</span></div></div>
      <div className="about-essay"><h2 data-editorial-reveal id="about-purpose-heading">{copy.purpose.title}</h2><p className="about-essay-lead" data-editorial-reveal>{copy.purpose.lead}</p><p data-editorial-reveal>{copy.purpose.body}</p><p data-editorial-reveal>{copy.purpose.close}</p></div>
    </EditorialReveal>
    <EditorialReveal as="section" className="about-principles" aria-labelledby="about-principles-heading"><div className="eva-inner">
      <div className="about-section-heading"><h2 data-editorial-reveal id="about-principles-heading">{copy.principles.title}</h2><p data-editorial-reveal>{copy.principles.intro}</p></div>
      <div className="about-principle-list">{copy.principles.items.map(item => <EditorialReveal as="article" className="about-principle" key={item.id}>
        <p className="about-principle-name">{item.name}</p>
        <div className="about-principle-copy"><h3 data-editorial-reveal>{item.title}</h3><p data-editorial-reveal>{item.body}</p><details className="about-principle-detail"><summary>{copy.principles.expand}<Plus size={17} aria-hidden="true"/></summary><div><p>{item.behavior}</p><p className="about-principle-boundary">{item.boundary}</p><a className="about-text-link" href={item.href}>{item.link}<ArrowUpRight size={15} aria-hidden="true"/></a></div></details></div>
        <PrincipleIllustration kind={item.id}/>
      </EditorialReveal>)}</div>
    </div></EditorialReveal>
    <EditorialReveal as="section" className="eva-inner about-conversation" id="equipo" aria-labelledby="about-conversation-heading"><h2 data-editorial-reveal id="about-conversation-heading">{copy.contact.title}</h2><div><p data-editorial-reveal>{copy.contact.body}</p><a className="about-text-link" href="/es/contact">{copy.contact.action}<ArrowUpRight size={17} aria-hidden="true"/></a></div></EditorialReveal>
    <EditorialReveal as="section" className="about-closing" aria-labelledby="about-closing-heading"><div className="eva-inner"><p className="about-closing-intro">{copy.closing.body}</p><h2 data-editorial-reveal id="about-closing-heading">{copy.closing.title}</h2><div className="about-closing-actions"><ActionLink href="/es/how-it-works">{copy.closing.action}</ActionLink><a className="about-text-link" href="/es/signup">{copy.closing.secondary}<ArrowUpRight size={16} aria-hidden="true"/></a></div><div className="about-closing-line" data-editorial-line aria-hidden="true"/></div></EditorialReveal>
  </div>;
}
