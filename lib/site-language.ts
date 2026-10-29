import english from './site-content/locales/public.en.json';

export type SiteLocale = 'es' | 'en';
const publicPages = new Set(['', '/', '/how-it-works', '/science', '/pricing', '/about', '/blog', '/contact', '/metodologia', '/metodologia/completa', '/legal/privacy', '/legal/terms', '/legal/cookies', '/signup', '/login', '/forgot-password', '/reset-password', '/callback', '/upload', '/review']);
const localizedPath = (tail:string) => publicPages.has(tail) || tail.startsWith('/review/original/');
const messages: Record<string, string> = english;
const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const templates = Object.entries(messages).filter(([source]) => /\{\d+\}/.test(source)).map(([source, translated]) => ({
  pattern: new RegExp('^' + source.split(/\{\d+\}/).map(escapePattern).join('(.+?)') + '$'),
  translated,
}));

/** Source messages remain the Spanish fallback; only authored display text is translated. */
export function translatePublicText<T>(value: T, locale: SiteLocale): T {
  if (locale !== 'en') return value;
  if (Array.isArray(value)) return value.map(item => translatePublicText(item, locale)) as T;
  if (typeof value !== 'string') return value;
  const text = value.trim();
  const padding = value.match(/^(\s*)[\s\S]*?(\s*)$/)!;
  const translated = messages[text];
  if (translated !== undefined) return (padding[1] + translated + padding[2]) as T;
  for (const template of templates) {
    const match = template.pattern.exec(text);
    if (match) return (padding[1] + template.translated.replace(/\{(\d+)\}/g, (_, index: string) => String(translatePublicText(match[Number(index) + 1], locale))) + padding[2]) as T;
  }
  // Decimal notation changes; clinical values and their original units do not.
  if (/^[<>≤≥]?\s*-?\d[\d,–.\s]*\s*(?:%|mg\/dL|mg\/L|ng\/mL|µIU\/mL|mIU\/L|U\/L)?$/.test(text)) return value.replace(/(\d),(?=\d)/g, '$1.') as T;
  return value;
}

/** Localise public content, documents and entry screens; private app destinations keep their Spanish boundary. */
export function publicHref(href: string, locale: SiteLocale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const boundary = href.search(/[?#]/);
  const path = (boundary < 0 ? href : href.slice(0, boundary)).replace(/\/$/, '') || '/';
  const suffix = boundary < 0 ? '' : href.slice(boundary);
  const tail = path === '/' ? '' : path.replace(/^\/(es|en)(?=\/|$)/, '');
  if (!localizedPath(tail) || (path !== '/' && !/^\/(es|en)(?:\/|$)/.test(path))) return href;
  return `/${locale}${tail === '/' ? '' : tail}${suffix}`;
}

export function alternatePublicHref(href: string, locale: SiteLocale): string {
  const other = locale === 'es' ? 'en' : 'es';
  const translated = publicHref(href, other);
  const path = translated.split(/[?#]/)[0];
  return path === `/${other}` || (path.startsWith(`/${other}/`) && localizedPath(path.slice(other.length + 1))) ? translated : `/${other}`;
}
