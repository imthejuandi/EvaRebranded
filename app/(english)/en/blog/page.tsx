import Page from '@/components/site/JournalPage';
import {SiteShell} from '@/components/site/SiteShell';
export const metadata={"title": {"absolute": "EVA Journal"}, "description": "Questions and ideas to help you understand your results.", "alternates": {"languages": {"es": "/es/blog", "en": "/en/blog"}}};
export default function Route(){return <SiteShell><Page/></SiteShell>}
