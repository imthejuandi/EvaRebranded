import ReviewHub from '@/components/site/ReviewHub';
import {SiteShell} from '@/components/site/SiteShell';
export const metadata={title:'EVA · Content review',robots:{index:false,follow:false}};
export default function Page(){return <SiteShell><ReviewHub/></SiteShell>}
