import Page from '@/components/site/ContactPage';
import {SiteShell} from '@/components/site/SiteShell';
export const metadata={"title": {"absolute": "Contact EVA"}, "description": "Get in touch with EVA about your account, partnerships, or a question.", "alternates": {"languages": {"es": "/es/contact", "en": "/en/contact"}}};
export default function Route(){return <SiteShell><Page/></SiteShell>}
