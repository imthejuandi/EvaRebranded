import type {Metadata} from 'next';
import {SiteDocument} from '@/components/site/SiteDocument';
import {PreviewProvider} from '@/components/preview/PreviewProvider';
export const metadata:Metadata={title:{default:'EVA — Know your health.',template:'%s — EVA'},description:'15 biomarkers every 90 days. At-home sample collection, accredited laboratory testing, and a clearer view of your health over time.'};
export default function Layout({children}:{children:React.ReactNode}){return <SiteDocument locale="en"><PreviewProvider>{children}</PreviewProvider></SiteDocument>}
