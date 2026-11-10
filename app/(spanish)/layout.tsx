import type {Metadata} from 'next';
import {SiteDocument} from '@/components/site/SiteDocument';
export const metadata:Metadata={title:'EVA — Conoce tu salud.',description:'Empieza con 13 biomarcadores en casa, entiende tus resultados y elige qué explorar después con EVA.'};
export default function Layout({children}:{children:React.ReactNode}){return <SiteDocument locale="es">{children}</SiteDocument>}
