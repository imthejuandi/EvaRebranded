import TassoFilmOptions from '@/components/site/TassoFilmOptions';
import {SiteShell} from '@/components/site/SiteShell';

export const metadata = {title: 'Cuatro películas. Un pequeño gesto.', robots: {index: false, follow: false}};
export default function Page() {return <SiteShell><TassoFilmOptions/></SiteShell>;}
