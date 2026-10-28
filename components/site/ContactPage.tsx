'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, RotateCcw } from 'lucide-react';
import { usePreview } from '@/components/preview/PreviewProvider';
import './contact-correspondence.css';
export const contactCopy = { es: {
        title: 'Hablemos.',
        intro: 'Una pregunta sobre EVA, tu cuenta o una colaboración. Elige el tema y cuéntanos un poco más.',
        labels: { name: 'Nombre', email: 'Correo electrónico', category: 'Sobre qué te gustaría hablar', message: 'Tu mensaje' },
        categories: [
            { id: 'general', label: 'Sobre EVA', destination: 'hello@evahealth.es', detail: 'Preguntas sobre cómo funciona EVA y las formas de empezar.' },
            { id: 'support', label: 'Mi cuenta o mi kit', destination: 'hello@evahealth.es', detail: 'Una duda sobre tu cuenta, tus resultados o el recorrido de tu kit.' },
            { id: 'partnership', label: 'Colaboraciones', destination: 'partners@evahealth.es', detail: 'Ideas para colaborar con EVA y explorar un proyecto en común.' },
            { id: 'press', label: 'Prensa', destination: 'hello@evahealth.es', detail: 'Consultas de prensa e información sobre EVA.' },
            { id: 'investor', label: 'Inversión', destination: 'investors@evahealth.es', detail: 'Consultas de inversión dirigidas al equipo de EVA.' },
        ],
        submit: 'Probar envío del mensaje',
        sent: 'Así se vería la confirmación.',
        notice: 'Vista previa: este formulario no envía mensajes ni guarda tus datos. Usa datos de ejemplo. Para contactar con EVA, escribe a uno de los correos de esta página.',
        failure: 'No pudimos completar el envío de ejemplo. Tu mensaje sigue aquí; vuelve a intentarlo.',
    } };
const copy = contactCopy.es;
export default function ContactPage() {
    const __site = useSiteLanguage();
    const [category, setCategory] = useState('general');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const firstInput = useRef<HTMLInputElement>(null);
    const confirmation = useRef<HTMLDivElement>(null);
    const failNextRequest = useRef(false);
    const { request } = usePreview();
    const selected = copy.categories.find(item => item.id === category) ?? copy.categories[0];
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const panel = query.get('panel');
        if (panel) {
            const names: Record<string, string> = { thyroid: 'tiroideo', nutrients: 'nutricional', liver: 'hepático', hormonal: 'hormonal', full_panel: 'completo' };
            setMessage(__site.t(`Quisiera más información sobre el panel ${names[panel] || 'especializado'}.`));
        }
        const requestedCategory = query.get('category');
        if (copy.categories.some(item => item.id === requestedCategory))
            setCategory(requestedCategory!);
        // A one-shot local fixture exercises retry without introducing an extra product control.
        failNextRequest.current = query.get('simulateError') === '1';
    }, [__site]);
    useEffect(() => { if (sent)
        confirmation.current?.focus(); }, [sent]);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy)
            return;
        setBusy(true);
        setError('');
        const simulateError = failNextRequest.current;
        failNextRequest.current = false;
        try {
            const result = await request('contact.submit', { simulateError, category, name: name.trim(), email: email.trim(), message: message.trim() });
            if (result.ok)
                setSent(true);
            else
                setError(copy.failure);
        }
        catch {
            setError(copy.failure);
        }
        finally {
            setBusy(false);
        }
    }
    function editMessage() {
        setSent(false);
        requestAnimationFrame(() => firstInput.current?.focus());
    }
    return <div className="page-contact contact-correspondence"><div className="eva-inner contact-studio">
    <header className="contact-studio-intro"><p className="contact-section-label">{__site.t("Contacto")}</p><h1>{__site.t(copy.title)}</h1><p>{__site.t(copy.intro)}</p><a className="contact-direct-mail" href={__site.href("mailto:hello@evahealth.es")}>{__site.t("hello@evahealth.es")}<ArrowUpRight size={18} aria-hidden="true"/></a></header>
    <section className="contact-letter" aria-labelledby="contact-form-heading"><div className="contact-letter-heading"><h2 id="contact-form-heading">{__site.t("Un mensaje para EVA.")}</h2><span>{__site.t("Demostraci\u00F3n")}</span></div>
      {__site.t(sent ? <div className="contact-confirmation" ref={confirmation} tabIndex={-1}><Check size={28} strokeWidth={1.3} aria-hidden="true"/><h3>{__site.t(copy.sent)}</h3><p>{__site.t("No se ha enviado ning\u00FAn mensaje. Puedes volver a editar el ejemplo o abrir tu correo para escribir a EVA.")}</p><button type="button" className="eva-button" onClick={editMessage}>{__site.t("Volver al mensaje")}<RotateCcw size={16} aria-hidden="true"/></button><a className="editorial-text-link" href={__site.href(`mailto:${selected.destination}`)}>{__site.t("Escribir a ")}{__site.t(selected.destination)}<ArrowUpRight size={15} aria-hidden="true"/></a></div> : <form onSubmit={submit} className="contact-form" aria-busy={busy}>
        <div className="contact-field-pair"><label className="eva-field">{__site.t(copy.labels.name)}<input ref={firstInput} required name="name" maxLength={200} value={name} onChange={event => setName(event.target.value)} placeholder={__site.t("Nombre de ejemplo")} autoComplete="off" disabled={busy}/></label><label className="eva-field">{__site.t(copy.labels.email)}<input required type="email" name="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder={__site.t("alex@ejemplo.com")} autoComplete="off" disabled={busy}/></label></div>
        <div className="contact-topic-field"><label className="eva-field">{__site.t(copy.labels.category)}<select name="category" value={category} onChange={event => setCategory(event.target.value)} disabled={busy} aria-describedby="contact-topic-description">{__site.t(copy.categories.map(item => <option key={item.id} value={item.id}>{__site.t(item.label)}</option>))}</select></label><p id="contact-topic-description" className="contact-topic-description" aria-live="polite">{__site.t(selected.detail)} <a href={__site.href(`mailto:${selected.destination}`)}>{__site.t(selected.destination)}</a></p></div>
        <label className="eva-field">{__site.t(copy.labels.message)}<textarea required name="message" maxLength={5000} value={message} onChange={event => setMessage(event.target.value)} placeholder={__site.t("Cu\u00E9ntanos un poco m\u00E1s\u2026")} disabled={busy} aria-describedby={error ? 'contact-submit-error contact-preview-note' : 'contact-preview-note'}/></label>
        {__site.t(error && <p className="editorial-form-error" id="contact-submit-error" role="alert">{__site.t(error)}</p>)}
        <button className="eva-button" disabled={busy}>{__site.t(busy ? 'Probando el envío…' : error ? 'Volver a intentar' : copy.submit)}<ArrowUpRight size={16} aria-hidden="true"/></button>
        <p className="editorial-form-note" id="contact-preview-note">{__site.t(copy.notice)} <a href={__site.href("/es/legal/privacy")}>{__site.t("Pol\u00EDtica de privacidad")}</a>{__site.t(".")}</p>
      </form>)}
    </section>
    <aside className="contact-address-study" aria-label={__site.t("El tema y su canal de contacto")} data-contact-correspondence>
      <figure className="contact-desk-photograph"><img src="/art/editorial/contact-correspondence-640.webp" srcSet="/art/editorial/contact-correspondence-640.webp 640w, /art/editorial/contact-correspondence-1200.webp 1024w" sizes="(max-width: 700px) calc(100vw - 40px), 42vw" width="1024" height="688" alt={__site.t("Una mano junto a un sobre, un cuaderno y un vaso de agua sobre una mesa iluminada")} loading="lazy" decoding="async"/></figure>
      <div className="contact-address-card"><span className="contact-address-label">{__site.t("Una conversaci\u00F3n sobre")}</span><div className="contact-address-content" key={selected.id}><h2>{__site.t(selected.label)}</h2><p>{__site.t(selected.detail)}</p><div className="contact-address-recipient"><span>{__site.t("Para EVA")}</span><a href={__site.href(`mailto:${selected.destination}`)}>{__site.t(selected.destination)}<ArrowUpRight size={16} aria-hidden="true"/></a></div></div><span className="contact-address-note">{__site.t("Elige el tema. Encuentra el canal.")}</span></div>
      <details className="contact-other-channels"><summary>{__site.t("Otros correos de EVA")}</summary><dl><div><dt>{__site.t("Colaboraciones")}</dt><dd><a href={__site.href("mailto:partners@evahealth.es")}>{__site.t("partners@evahealth.es")}</a></dd></div><div><dt>{__site.t("Inversi\u00F3n")}</dt><dd><a href={__site.href("mailto:investors@evahealth.es")}>{__site.t("investors@evahealth.es")}</a></dd></div></dl></details>
    </aside>
  </div><div className="eva-inner contact-next"><p>{__site.t("Si est\u00E1s explorando c\u00F3mo empezar.")}</p><a href={__site.href("/es/how-it-works")}>{__site.t("Conoce el recorrido")}<ArrowUpRight size={16} aria-hidden="true"/></a><a href={__site.href("/es/upload")}>{__site.t("Explorar con un informe")}<ArrowUpRight size={16} aria-hidden="true"/></a><a href={__site.href("/es/signup?plan=quarterly")}>{__site.t("Empezar con un kit")}<ArrowUpRight size={16} aria-hidden="true"/></a></div></div>;
}
