'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { EvaWordmark } from '@/components/story/EvaWordmark';
import { usePreview } from './PreviewProvider';
import { destinationAfterAccess, flowHref, readFlowIntent, type FlowIntent } from '@/lib/preview/policy';
type Mode = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'callback';
export const accessCopy = { es: { login: { title: 'Bienvenido a EVA Health', intro: 'Inicia sesión para acceder a tu panel de salud', action: 'Entrar en la cuenta de ejemplo' }, signup: { title: 'Bienvenido a EVA Health', intro: 'Comienza tu camino hacia la salud de precisión', action: 'Crear cuenta de ejemplo' }, 'forgot-password': { title: 'Recupera tu acceso.', intro: 'Te mostraremos cómo funciona la recuperación de tu cuenta.', action: 'Simular envío del enlace' }, 'reset-password': { title: 'Una nueva contraseña.', intro: 'Elige una contraseña para volver a tu espacio.', action: 'Simular cambio de contraseña' }, callback: { title: 'Continuemos.', intro: 'Tu acceso de ejemplo está listo.', action: 'Continuar' }, demo: 'Vista previa interactiva. Usa datos ficticios. No se crean cuentas, guardan contraseñas ni envían correos. Después del acceso, la app de ejemplo continúa en español.', email: 'Correo electrónico', password: 'Contraseña', confirm: 'Confirma la contraseña', terms: 'He leído y acepto los Términos del Servicio y la Política de Privacidad.', health: 'Consiento de forma explícita que EVA Health trate mis datos de salud de categoría especial (Art. 9 RGPD), como se describe en la Política de Privacidad.', age: 'Confirmo que tengo 18 años o más.', marketing: 'Quiero recibir consejos de salud, novedades y ofertas de EVA Health por correo electrónico. (Opcional — puedes darte de baja cuando quieras.)' } };
export default function AccessPage({ mode, returnTo }: {
    mode: Mode;
    returnTo?: string;
}) {
    const __site = useSiteLanguage();
    const { update, request, hydrated } = usePreview();
    const [method, setMethod] = useState<'password' | 'magic'>('password');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [oauth, setOauth] = useState(false);
    const [consents, setConsents] = useState({ health: false, marketing: false });
    const [validRecovery, setValidRecovery] = useState(false);
    const [intent, setIntent] = useState<FlowIntent>({ plan: null, returnTo: '/es/dashboard', reportId: null, invalidPlan: false });
    const c = accessCopy.es;
    const content = c[mode];
    useEffect(() => { const q = new URLSearchParams(location.search); const parsed = readFlowIntent(q); if (returnTo)
        parsed.returnTo = returnTo; setIntent(parsed); setValidRecovery(q.get('demo') === 'valid'); }, [returnTo]);
    const proceed = () => { if (!hydrated)
        return; if (mode === 'forgot-password') {
        location.assign(__site.href(flowHref('/es/reset-password?demo=valid', intent)));
        return;
    } if (mode === 'reset-password') {
        location.assign(__site.href(flowHref('/es/login', intent)));
        return;
    } update(s => ({ ...s, session: true, onboarded: mode === 'signup' ? false : s.onboarded, plan: mode === 'signup' ? 'free' : s.plan, profile: mode === 'signup' ? { ...s.profile, healthConsent: consents.health, aiConsent: false, notifications: { ...s.profile.notifications, marketing: consents.marketing } } : s.profile })); location.assign(mode === 'signup' ? flowHref('/es/onboarding', intent) : destinationAfterAccess(intent)); };
    async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setError(''); setOauth(false); const d = new FormData(e.currentTarget); if (mode === 'signup') {
        if (!d.get('terms') || !d.get('health') || !d.get('age')) {
            setError('Revisa y marca las tres casillas obligatorias para continuar.');
            return;
        }
        setConsents({ health: Boolean(d.get('health')), marketing: Boolean(d.get('marketing')) });
    } const password = String(d.get('password') || ''); if ((mode === 'signup' || mode === 'reset-password') && method === 'password') {
        if (password.length < 8) {
            setError('Usa al menos 8 caracteres.');
            return;
        }
        if (password !== d.get('confirm')) {
            setError('Las contraseñas no coinciden. Revísalas e inténtalo de nuevo.');
            return;
        }
    } setBusy(true); const result = await request(mode === 'signup' ? 'auth.signup' : mode === 'forgot-password' ? 'auth.recover' : mode === 'reset-password' ? 'auth.reset' : 'auth.login'); setBusy(false); if (!result.ok) {
        setError(result.message);
        return;
    } if (mode === 'login' && method === 'password')
        proceed();
    else
        setSuccess(true); }
    return <div className="eva-site eva-access"><header className="eva-access-header"><EvaWordmark /><a href={__site.href("/")}>{__site.t("Volver a EVA")}</a></header><div className="eva-access-grid"><aside className="eva-access-art"><picture><source media="(min-width: 701px)" srcSet="/art/editorial/after-cycling-600.webp 600w, /art/editorial/after-cycling-1200.webp 1200w" sizes="50vw"/><img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt={__site.t("Un momento de descanso y agua despu\u00E9s de salir en bicicleta, entre luz melocot\u00F3n y sombras violetas.")}/></picture><div><p>{__site.t("EL RESTO ES VIDA.")}</p><span>{__site.t("Un espacio para entenderte.")}<br />{__site.t("M\u00E1s tiempo para disfrutarlo.")}</span></div></aside><main className="eva-access-form"><p className="eva-kicker">{__site.t("MI EVA / ")}{__site.t(mode === 'signup' ? 'TU PRIMER PASO' : 'TU ESPACIO')}</p><h1>{__site.t(content.title)}</h1><p className="eva-muted">{__site.t(content.intro)}</p><p className="eva-access-demo">{__site.t(c.demo)}</p>{__site.t(intent.invalidPlan ? <p className="eva-form-error" role="alert">{__site.t("Esta opci\u00F3n no est\u00E1 disponible. ")}<a href={__site.href("/es/pricing")}>{__site.t("Vuelve a comparar los planes.")}</a></p> : intent.plan && intent.plan !== 'free' ? <p className="eva-access-intent">{__site.t("Tu elecci\u00F3n: ")}{__site.t(intent.plan === 'quarterly' ? 'EVA Trimestral · 99 € por trimestre' : intent.plan === 'annual' ? 'EVA Anual · 396 € al año · recogida trimestral' : 'Panel en laboratorio · 499 € pago único')}{__site.t(". Importe ilustrativo. Lo revisar\u00E1s antes de simular la confirmaci\u00F3n.")}</p> : intent.reportId ? <p className="eva-access-intent">{__site.t("Volver\u00E1s al informe que seleccionaste despu\u00E9s de entrar.")}</p> : null)}{__site.t(mode === 'reset-password' && !validRecovery ? <div className="eva-access-success"><h2>{__site.t("Este enlace no est\u00E1 activo.")}</h2><p>{__site.t("Solicita un nuevo enlace para cambiar tu contrase\u00F1a.")}</p><a className="eva-button" href={__site.href(flowHref('/es/forgot-password', intent))}>{__site.t("Solicitar un nuevo enlace")}</a><a className="eva-text-link" href={__site.href(flowHref('/es/reset-password?demo=valid', intent))}>{__site.t("Probar un enlace de ejemplo")}</a></div> : success ? <div className="eva-access-success" role="status"><h2>{__site.t(mode === 'reset-password' ? 'Cambio simulado.' : oauth ? 'Acceso de ejemplo preparado.' : 'Así se vería la confirmación.')}</h2><p>{__site.t(mode === 'reset-password' ? 'No se ha modificado ninguna contraseña real.' : oauth ? 'En la versión conectada, Google confirmaría tu acceso. Esta demostración no conecta ninguna cuenta.' : 'En la versión conectada, recibirías un enlace en tu correo. En esta vista previa no se envía ningún mensaje.')}</p><button className="eva-button" disabled={!hydrated} onClick={proceed}>{__site.t(mode === 'forgot-password' ? 'Probar cambio de contraseña' : mode === 'reset-password' ? 'Volver al acceso' : 'Continuar con el ejemplo')}</button><button className="eva-text-link" onClick={() => { setSuccess(false); setOauth(false); }}>{__site.t("Volver al formulario")}</button></div> : mode === 'callback' ? <button className="eva-button" disabled={!hydrated} onClick={proceed}>{__site.t("Continuar con el ejemplo")}</button> : <form onSubmit={submit} className="eva-stack">{__site.t((mode === 'login' || mode === 'signup') && <div className="eva-access-tabs" aria-label={__site.t("M\u00E9todo de acceso")}>{__site.t((['password', 'magic'] as const).map(m => <button type="button" key={m} aria-pressed={method === m} onClick={() => setMethod(m)}>{__site.t(m === 'password' ? 'Contraseña' : 'Enlace por correo')}</button>))}</div>)}{__site.t(mode !== 'reset-password' && <label className="eva-field">{__site.t(c.email)}<input name="email" type="email" placeholder={__site.t("alex@ejemplo.com")} required autoComplete="off"/></label>)}{__site.t(method === 'password' && mode !== 'forgot-password' && <label className="eva-field">{__site.t(c.password)}<input name="password" type="password" required minLength={mode === 'login' ? 1 : 8} autoComplete="off"/></label>)}{__site.t(method === 'password' && (mode === 'signup' || mode === 'reset-password') && <label className="eva-field">{__site.t(c.confirm)}<input name="confirm" type="password" required autoComplete="off"/></label>)}{__site.t(mode === 'signup' && <div className="eva-access-consents">{__site.t((['terms', 'health', 'age', 'marketing'] as const).map(k => <label className="eva-checkbox" key={k}><input type="checkbox" name={k} required={k !== 'marketing'}/><span>{__site.t(c[k])}</span></label>))}<p><a href={__site.href("/es/legal/terms")} target="_blank" rel="noreferrer">{__site.t("T\u00E9rminos del Servicio")}</a>{__site.t(" \u00B7 ")}<a href={__site.href("/es/legal/privacy")} target="_blank" rel="noreferrer">{__site.t("Pol\u00EDtica de Privacidad")}</a></p></div>)}{__site.t(error && <p className="eva-form-error" role="alert">{__site.t(error)}</p>)}<button className="eva-button" disabled={busy || !hydrated}>{__site.t(busy ? 'Un momento…' : method === 'magic' ? 'Simular enlace por correo' : content.action)}</button>{__site.t(mode === 'login' && <a className="eva-text-link" href={__site.href(flowHref('/es/forgot-password', intent))}>{__site.t("\u00BFOlvidaste tu contrase\u00F1a?")}</a>)}{__site.t((mode === 'login' || mode === 'signup') && <button type="button" className="eva-button eva-button-secondary" disabled={busy || !hydrated} onClick={e => { if (mode === 'signup') {
        const form = e.currentTarget.form;
        if (!form)
            return;
        const data = new FormData(form);
        if (!data.get('terms') || !data.get('health') || !data.get('age')) {
            setError('Revisa y marca las tres casillas obligatorias para continuar.');
            return;
        }
        setConsents({ health: Boolean(data.get('health')), marketing: Boolean(data.get('marketing')) });
    } setOauth(true); setSuccess(true); }}>{__site.t("Continuar con Google \u00B7 demo")}</button>)}</form>)}<p className="eva-access-switch">{__site.t(mode === 'signup' ? '¿Ya tienes una cuenta?' : '¿Es tu primera vez aquí?')} <a href={__site.href(flowHref(mode === 'signup' ? '/es/login' : '/es/signup', intent))}>{__site.t(mode === 'signup' ? 'Inicia sesión' : 'Crea tu cuenta')}</a></p></main></div></div>;
}
