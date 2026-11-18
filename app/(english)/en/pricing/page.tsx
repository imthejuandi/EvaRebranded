import Page from '@/components/pages/pricing/PricingPage';
import {SiteShell} from '@/components/site/SiteShell';

export const metadata = {
  title: 'Plans and pricing',
  description: 'Compare free report interpretation, the 13-biomarker home kit at €99 + VAT per quarter, and the lab panel. You can cancel the kit subscription anytime.',
  alternates: {languages: {es: '/es/pricing', en: '/en/pricing'}},
};

export default function Route() {
  return <SiteShell><Page/></SiteShell>;
}
