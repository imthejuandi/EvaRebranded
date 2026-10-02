import {readDashboardFromServer} from '@/lib/dashboard/backend-server';
import {LiveDashboardCore} from '@/components/pages/dashboard/LiveDashboardCore';
import '@/components/pages/dashboard/live-dashboard.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const metadata = {title: 'EVA · Mi lectura', robots: {index: false, follow: false}};

/** Read-only integration route. No fixture provider values enter this tree. */
export default async function LiveDashboardPage() {
  const result = await readDashboardFromServer();
  return <main className="eva-live-dashboard"><header className="live-header"><a href="/es/dashboard" aria-label="EVA, volver a la vista de diseño"><img src="/art/eva-official-logo.png" alt="EVA" width="76" height="29"/></a><span>Lectura privada · Solo consulta</span></header><LiveDashboardCore result={result}/></main>;
}
