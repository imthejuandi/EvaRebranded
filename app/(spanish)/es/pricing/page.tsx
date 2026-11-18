import Page from '@/components/pages/pricing/PricingPage';
import {SiteShell} from '@/components/site/SiteShell';

export const metadata = {
  title: 'Precios — EVA',
  description: 'Compara la interpretación gratuita de una analítica, la suscripción al kit de 13 biomarcadores por 99 € + IVA por trimestre y el panel de laboratorio. Puedes cancelar la suscripción cuando quieras.',
  alternates: {languages: {es: '/es/pricing', en: '/en/pricing'}},
};

export default function Route() {
  return <SiteShell><Page/></SiteShell>;
}
