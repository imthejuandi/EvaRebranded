import {businessLinks} from '@/lib/landing-content';
import {Arrow} from './Arrow';

/** A real link outside the decorative, pointer-disabled Remotion film. */
export function HeroKitCta(){
 return <a className="hero-kit-cta" href={businessLinks.signup+'?plan=quarterly'} title="99 € por kit, con renovación trimestral">
  <span className="hero-kit-copy"><strong className="hero-kit-title">Desbloquea tu salud</strong><span className="hero-kit-details"><span>pide tu primer kit</span><span className="hero-kit-price">99€ por Kit</span></span></span>
  <Arrow/>
 </a>;
}
