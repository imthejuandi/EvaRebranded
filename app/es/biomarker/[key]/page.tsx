import {AppShell} from '@/components/preview/AppShell';
import Page from '@/components/pages/biomarker/BiomarkerPage';
import {sampleMarkers} from '@/lib/preview/fixtures';
export function generateStaticParams(){return sampleMarkers.map(m=>({key:m.key}))}
export default async function Route({params}:{params:Promise<{key:string}>}){const {key}=await params;return <AppShell><Page markerKey={key}/></AppShell>}
