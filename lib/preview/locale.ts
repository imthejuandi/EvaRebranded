import type {Locale} from './model';

export const enabledLocales:readonly Locale[]=['es'];
export const uiCopy={
 es:{back:'Volver',continue:'Continuar',cancel:'Cancelar',save:'Guardar cambios',loading:'Cargando…',retry:'Volver a intentar',preview:'Vista previa · Datos de ejemplo',results:'Análisis',profile:'Perfil'},
 en:{back:'Back',continue:'Continue',cancel:'Cancel',save:'Save changes',loading:'Loading…',retry:'Try again',preview:'Preview · Sample data',results:'Results',profile:'Profile'},
} as const;
export function localeTag(locale:Locale='es'){return locale==='en'?'en-GB':'es-ES'}
export function formatNumber(value:number,locale:Locale='es',maximumFractionDigits=1){return new Intl.NumberFormat(localeTag(locale),{maximumFractionDigits}).format(value)}
export function formatDate(date:string,locale:Locale='es'){return new Intl.DateTimeFormat(localeTag(locale),{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date.slice(0,10)+'T12:00:00Z'))}
/** English catalog values remain empty until editorial review; Spanish is the safe fallback. */
export function resolveMessage(key:string,locale:Locale,catalog:{es:Record<string,string>;en:Record<string,string>}){return(locale==='en'?catalog.en[key]:null)||catalog.es[key]||key}
