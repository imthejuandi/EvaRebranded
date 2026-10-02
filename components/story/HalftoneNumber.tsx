import {halftoneState,HALFTONE_VIEWBOX} from '@/lib/halftone-motion';
/** Static counterpart for reduced motion; uses the exact final halftone mask. */
export function HalftoneNumber(){return <svg viewBox={HALFTONE_VIEWBOX} role="img" aria-label="15" style={{display:'block',width:'min(100%, 600px)',height:'auto',color:'inherit'}}>{halftoneState(0).points.filter(p=>p.r>0).map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={p.r} fill="currentColor"/>)}</svg>}
