import type {Metadata} from 'next';
import {SiteDocument} from '@/components/site/SiteDocument';
export const metadata:Metadata={title:'EVA — Conoce tu salud.',description:'15 biomarcadores cada 90 días. Recogida de muestra en casa, análisis en laboratorio acreditado. Entiende tus resultados y sigue tu evolución con EVA.'};
export default function Layout({children}:{children:React.ReactNode}){return <SiteDocument locale="es">{children}</SiteDocument>}
