import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
import {dashboardBackendConfig} from '@/lib/dashboard/backend-server';

/** Private read-only integration view; all ordinary design routes stay untouched. */
export async function proxy(request:NextRequest){
 let response=NextResponse.next({request});
 const config=dashboardBackendConfig(process.env);
 if(config){
  const client=createServerClient(config.url,config.publicKey,{
   cookies:{getAll:()=>request.cookies.getAll(),setAll:updates=>{
    updates.forEach(({name,value})=>request.cookies.set(name,value));
    response=NextResponse.next({request});
    updates.forEach(({name,value,options})=>response.cookies.set(name,value,options));
   }},global:{fetch:(input,init)=>fetch(input,{...init,cache:'no-store'})},
  });
  try{await client.auth.getUser();}catch{/* The page renders a closed authentication state. */}
 }
 response.headers.set('Cache-Control','private, no-store, max-age=0');
 response.headers.set('Pragma','no-cache');
 response.headers.set('Vary','Cookie');
 response.headers.set('X-Robots-Tag','noindex, nofollow');
 return response;
}
export const config={matcher:['/es/dashboard']};
