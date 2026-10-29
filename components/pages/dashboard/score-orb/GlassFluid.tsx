import {useEffect,useRef} from 'react';

/** Two composited color sheets. No frame loop or React updates while flowing. */
export function GlassFluid(){
 const root=useRef<HTMLSpanElement>(null);
 useEffect(()=>{
  const element=root.current;
  if(!element)return;
  let visible=false;
  const update=()=>{element.dataset.motion=visible&&!document.hidden?'running':'paused'};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;update()},{threshold:0});
  observer.observe(element);
  document.addEventListener('visibilitychange',update);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',update)};
 },[]);
 return <span className="dial-fluid" ref={root} data-motion="paused" aria-hidden="true"><i className="dial-fluid-a"/><i className="dial-fluid-b"/></span>;
}
