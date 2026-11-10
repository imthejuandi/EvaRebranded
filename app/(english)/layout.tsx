import type {Metadata} from 'next';
import {SiteDocument} from '@/components/site/SiteDocument';
import {PreviewProvider} from '@/components/preview/PreviewProvider';
export const metadata:Metadata={title:{default:'EVA — Know your health.',template:'%s — EVA'},description:'Start with 13 biomarkers at home, understand your results, and choose what to explore next with EVA.'};
export default function Layout({children}:{children:React.ReactNode}){return <SiteDocument locale="en"><PreviewProvider>{children}</PreviewProvider></SiteDocument>}
