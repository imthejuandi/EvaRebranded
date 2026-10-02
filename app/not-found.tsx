import {SiteShell} from '@/components/site/SiteShell';
import {PageIntro,ActionLink} from '@/components/site/Primitives';
export default function NotFound(){return <SiteShell><PageIntro eyebrow="EVA / PÁGINA NO ENCONTRADA" title="Esta página no está aquí." description="El enlace puede haber cambiado. Vuelve al inicio o a tu espacio para continuar."><div className="eva-stack"><ActionLink href="/">Volver al inicio</ActionLink><ActionLink href="/es/dashboard" secondary>Ir a mi EVA</ActionLink></div></PageIntro></SiteShell>}
