import {useLayoutEffect,useRef,type ReactNode} from 'react';

/** Fit complete text inside its circularly safe slot without truncation.
 * ResizeObserver runs on size changes, not on every animation frame. */
export function FittedDialLine({children}:{children:ReactNode}){
 const box=useRef<HTMLSpanElement>(null),line=useRef<HTMLSpanElement>(null);
 useLayoutEffect(()=>{
  const area=box.current,content=line.current;
  if(!area||!content)return;
  const fit=()=>{
   const scale=Math.min(1,area.clientWidth/Math.max(1,content.scrollWidth),area.clientHeight/Math.max(1,content.scrollHeight));
   content.style.transform=`translate(-50%,-50%) scale(${scale})`;
  };
  fit();
  const observer=new ResizeObserver(fit);
  observer.observe(area);observer.observe(content);
  return()=>observer.disconnect();
 },[children]);
 return <span className="dial-fit-box" ref={box}><span className="dial-fit-line" ref={line}>{children}</span></span>;
}
