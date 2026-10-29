import Page from '@/components/pages/about/AboutPage';
import {SiteShell} from '@/components/site/SiteShell';
export const metadata={"title": {"absolute": "About EVA"}, "description": "Why we are building a clearer way to understand your health.", "alternates": {"languages": {"es": "/es/about", "en": "/en/about"}}};
export default function Route(){return <SiteShell><Page/></SiteShell>}
