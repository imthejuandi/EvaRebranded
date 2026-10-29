import OriginalReference,{originalFamilies} from '@/components/site/OriginalReference';
import {SiteShell} from '@/components/site/SiteShell';
export function generateStaticParams(){return originalFamilies.map(family=>({family:family.replaceAll('/','--')}))}
export default async function Page({params}:{params:Promise<{family:string}>}){const{family}=await params;return <SiteShell><OriginalReference family={family.replaceAll('--','/')} locale="en"/></SiteShell>}
