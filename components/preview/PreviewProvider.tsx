'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';
import type {ReactNode} from 'react';
import type {PreviewState,Scenario,Operation,PreviewResult} from '@/lib/preview/model';
import {createFixture} from '@/lib/preview/fixtures';
import {restoreLabUploadPeriod} from '@/lib/preview/subscription';
import {previewTransport} from '@/lib/preview/adapter';

type StateChange = Partial<PreviewState> | ((current: PreviewState) => PreviewState);
type Api = {
  state: PreviewState;
  update: (patch: StateChange) => void;
  reset: (scenario?: Scenario) => void;
  request: (operation: Operation, payload?: Record<string, unknown>) => Promise<PreviewResult>;
  hydrated: boolean;
};
const Context = createContext<Api | null>(null);
const STORAGE = 'eva-design-preview-04';

export function PreviewProvider({children}: {children: ReactNode}) {
  const [state, setState] = useState<PreviewState>(() => createFixture());
  const current = useRef(state);
  const stored = useRef<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw && raw !== stored.current) {
        const saved = JSON.parse(raw);
        if (saved.version === 1 && Array.isArray(saved.markers) && saved.profile && Array.isArray(saved.reports)) {
          const restored = restoreLabUploadPeriod(saved);
          current.current = restored;
          stored.current = raw;
          setState(restored);
          if (restored !== saved) {
            const upgraded = JSON.stringify(restored);
            localStorage.setItem(STORAGE, upgraded);
            stored.current = upgraded;
          }
        }
      }
    } catch { /* The demo can also run in memory. */ }
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    const onStorage = (event: StorageEvent) => { if (event.key === STORAGE) refresh(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const nextExpiry = Math.min(...[state.subscriptionPeriodEnd, state.labUploadAccessUntil]
    .map(value => Date.parse(value ?? '')).filter(end => end > Date.now()));
  useEffect(() => {
    if (!Number.isFinite(nextExpiry)) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const remaining = nextExpiry - Date.now();
      if (remaining > 0) timer = setTimeout(schedule, Math.min(remaining, 2_147_483_647));
      else setState({...current.current});
    };
    schedule();
    return () => clearTimeout(timer);
  }, [nextExpiry]);

  const update = useCallback((patch: StateChange) => {
    refresh();
    const previous = current.current;
    const next = typeof patch === 'function' ? patch(previous) : {...previous, ...patch};
    if (next === previous) return;
    current.current = next;
    try {
      const raw = JSON.stringify(next);
      localStorage.setItem(STORAGE, raw);
      stored.current = raw;
    } catch { /* Keep the current in-memory state if storage is unavailable. */ }
    setState(next);
  }, [refresh]);
  const reset = useCallback((scenario: Scenario = 'ready') => update(() => createFixture(scenario)), [update]);
  return <Context.Provider value={{state,update,reset,request:previewTransport.execute,hydrated}}>{children}</Context.Provider>;
}
export function usePreview(){const value=useContext(Context);if(!value)throw new Error('PreviewProvider missing');return value;}
