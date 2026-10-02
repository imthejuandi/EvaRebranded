import 'server-only';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import type {DashboardReadClient, DashboardReadResult} from './backend-contract';
import {readDashboardCore} from './backend-reader';
import {readLabsHistory,type LabsHistoryClient,type LabsHistoryResult} from '../labs/backend-history-reader';

type Environment = Record<string, string | undefined>;
/** Only public project configuration; never accept service-role or secret credentials. */
export function dashboardBackendConfig(environment: Environment): {url: string; publicKey: string} | null {
  const rawUrl = environment.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || environment.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !publicKey) return null;
  try {
    const url = new URL(rawUrl);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
    if ((url.protocol !== 'https:' && !(local && url.protocol === 'http:')) || url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(publicKey)) {
      const parts = publicKey.split('.');
      if (parts.length !== 3) return null;
      const claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      if (claims.role !== 'anon') return null;
    }
    return {url: url.origin, publicKey};
  } catch {return null;}
}

/** Call only from a dynamic server page. Keep the response private/no-store at the route boundary. */
export async function readDashboardFromServer(): Promise<DashboardReadResult> {
  return readWithDashboardSession(client=>readDashboardCore(client));
}

/** Migration entry for an authenticated dynamic results page; uses the same session and source fields. */
export async function readLabsHistoryFromServer(reportId?:string):Promise<LabsHistoryResult> {
  return readWithDashboardSession(client=>readLabsHistory(client as LabsHistoryClient,reportId));
}

async function readWithDashboardSession<T extends DashboardReadResult|LabsHistoryResult>(read:(client:DashboardReadClient)=>Promise<T>):Promise<T|{status:'unconfigured'|'unavailable'}> {
  const config = dashboardBackendConfig(process.env);
  if (!config) return {status: 'unconfigured'};
  try {
    const cookieStore = await cookies();
    const client = createServerClient(config.url, config.publicKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: cookiesToSet => {
          // RSC cannot persist refreshed cookies; the host's auth middleware owns refresh.
          try {cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name, value, options));} catch {}
        },
      },
      global: {fetch: (input, init) => fetch(input, {...init, cache: 'no-store'})},
    });
    return await read(client as unknown as DashboardReadClient);
  } catch {return {status: 'unavailable'};}
}
