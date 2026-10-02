'use client';

import type {CSSProperties} from 'react';

/** Natural display type; the layout supplies scale, never a forced glyph width. */
export function HeroIntro({width,height,style}:{width:number;height:number;style?:CSSProperties}){
 return <span className="hero-intro" data-hero-intro aria-hidden="true" style={{display:'block',width,height,fontSize:height/1.08,...style}}>Conoce tu</span>;
}
