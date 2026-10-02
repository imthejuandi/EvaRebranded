'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import type {PreviewState,Scenario,Operation,PreviewResult} from '@/lib/preview/model';
import {createFixture} from '@/lib/preview/fixtures';
import {previewTransport} from '@/lib/preview/adapter';
type Api={state:PreviewState;update:(patch:Partial<PreviewState>|((current:PreviewState)=>PreviewState))=>void;reset:(scenario?:Scenario)=>void;request:(operation:Operation,payload?:Record<string,unknown>)=>Promise<PreviewResult>;hydrated:boolean};
const Context=createContext<Api|null>(null);
const STORAGE='eva-design-preview-04';
export function PreviewProvider({children}:{children:ReactNode}){
 const[state,setState]=useState<PreviewState>(()=>createFixture());const current=useRef(state);const[hydrated,setHydrated]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(STORAGE);if(raw){const saved=JSON.parse(raw);if(saved.version===1&&Array.isArray(saved.markers)&&saved.profile&&Array.isArray(saved.reports)){current.current=saved;setState(saved)}}}catch{}setHydrated(true)},[]);
 const update=useCallback((patch:Partial<PreviewState>|((s:PreviewState)=>PreviewState))=>{const next=typeof patch==='function'?patch(current.current):{...current.current,...patch};current.current=next;try{localStorage.setItem(STORAGE,JSON.stringify(next))}catch{}setState(next)},[]);
 const reset=useCallback((scenario:Scenario='ready')=>update(createFixture(scenario)),[update]);
 return <Context.Provider value={{state,update,reset,request:previewTransport.execute,hydrated}}>{children}</Context.Provider>
}
export function usePreview(){const value=useContext(Context);if(!value)throw new Error('PreviewProvider missing');return value;}
