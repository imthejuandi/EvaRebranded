import Page from '@/components/pages/science/SciencePage';
import {SiteShell} from '@/components/site/SiteShell';
export const metadata={"title": "The science", "description": "Explore biomarkers, reference intervals, and the context behind your results.", "alternates": {"languages": {"es": "/es/science", "en": "/en/science"}}};
export default function Route(){return <SiteShell><Page/></SiteShell>}
