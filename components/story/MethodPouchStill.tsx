'use client';
import {useEffect,useRef} from 'react';

/** The approved candid home photograph with matte film grain. */
export function MethodPouchStill({calm}:{calm:boolean}) {
  const image=useRef<HTMLImageElement>(null);
  useEffect(()=>{
    const element=image.current;if(!element)return;
    let alive=true;
    const prepare=()=>{
      // Warm the actual responsive candidate before this section arrives. Reuse
      // the visible element so no second request or mismatched srcset is created.
      element.loading='eager';
      element.dataset.decodeState='warming';
      void element.decode().then(()=>{if(alive)element.dataset.decodeState='ready'}).catch(()=>{if(alive)element.dataset.decodeState='native'});
    };
    if(!('IntersectionObserver' in window)){prepare();return()=>{alive=false};}
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry?.isIntersecting)return;
      observer.disconnect();prepare();
    },{rootMargin:'200% 0px'});
    observer.observe(element);
    return()=>{alive=false;observer.disconnect()};
  },[]);
  return <div className={'method-home-art method-pouch-still'+(calm?' is-calm':'')}>
    <img
      ref={image}
      src="/art/method-home-c-1200.webp"
      srcSet="/art/method-home-c-640.webp 640w, /art/method-home-c-1200.webp 1200w"
      sizes="(max-width: 700px) calc(100vw - 48px), 50vw"
      width={1200} height={800} loading="lazy" decoding="async"
      alt="Después de entrenar, una mujer saca un pequeño Tasso+ de una bolsa EVA sobre la mesa de su casa."
    />
    <span className="method-home-line">Un momento en tu día.</span>
  </div>;
}
