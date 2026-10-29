'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
export function PageIntro({ eyebrow, title, description, children, dark = false }: {
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    dark?: boolean;
}) { const __site = useSiteLanguage(); return <section className={`eva-page-intro ${dark ? 'eva-dark' : ''}`}><div className={`eva-inner ${children ? 'eva-grid-2' : ''}`}><div><p className="eva-kicker">{__site.t(eyebrow)}</p><h1>{__site.t(title)}</h1>{__site.t(description && <div className="eva-intro-description">{__site.t(description)}</div>)}</div>{__site.t(children && <div className="eva-intro-art">{__site.t(children)}</div>)}</div></section>; }
export function Section({ id, eyebrow, title, children, className = '', dark = false }: {
    id?: string;
    eyebrow?: string;
    title?: ReactNode;
    children: ReactNode;
    className?: string;
    dark?: boolean;
}) { const __site = useSiteLanguage(); return <section id={id} className={`eva-section ${dark ? 'eva-dark' : ''} ${className}`}><div className="eva-inner">{__site.t(eyebrow && <p className="eva-kicker">{__site.t(eyebrow)}</p>)}{__site.t(title && <h2>{__site.t(title)}</h2>)}{__site.t(children)}</div></section>; }
export function ActionLink({ href, children, secondary = false }: {
    href: string;
    children: ReactNode;
    secondary?: boolean;
}) { const __site = useSiteLanguage(); return <a href={__site.href(href)} className={`eva-button ${secondary ? 'eva-button-secondary' : ''}`}>{__site.t(children)}<ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true"/></a>; }
export function Note({ children }: {
    children: ReactNode;
}) { const __site = useSiteLanguage(); return <aside className="eva-note">{__site.t(children)}</aside>; }
export function GlassPanel({ children, tone = 'amber', className = '' }: {
    children: ReactNode;
    tone?: 'amber' | 'sage' | 'lilac';
    className?: string;
}) { const __site = useSiteLanguage(); return <div className={`eva-glass eva-glass-${tone} ${className}`}>{__site.t(children)}</div>; }
export function DotTexture({ className = '' }: {
    className?: string;
}) { const __site = useSiteLanguage(); return <div aria-hidden="true" className={`eva-dot-texture ${className}`}/>; }
