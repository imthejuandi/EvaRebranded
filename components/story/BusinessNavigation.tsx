'use client';
import {KineticNavigation} from '@/components/ui/sterling-gate-kinetic-navigation';
import {businessLinks} from '@/lib/landing-content';
const links=[
 {label:'Cómo funciona',href:businessLinks.method},
 {label:'Ciencia',href:businessLinks.science},
 {label:'Precios',href:businessLinks.pricing},
 {label:'Nosotros',href:businessLinks.about},
 {label:'Mi EVA',href:'/es/dashboard'},
];
export function BusinessNavigation(){return <KineticNavigation links={links}/>}
