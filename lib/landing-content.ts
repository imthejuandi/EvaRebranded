// Transcribed from https://www.evahealth.es/es, reviewed 2026-09-10.
// These are public illustrative specimens, not personal health records or new clinical thresholds.
export const specimens=[
 {name:'Vitamina D',detail:'25-OH',value:'28',unit:'ng/mL',standard:[20,100],eva:[50,80]},
 {name:'hs-CRP',detail:'Proteína C reactiva ultrasensible',value:'2.1',unit:'mg/L',standard:[0,3],eva:[0,1]},
 {name:'Insulina en ayunas',detail:'Insulina basal',value:'11',unit:'µIU/mL',standard:[2,19],eva:[2,5]},
 {name:'ApoB',detail:'Apolipoproteína B',value:'98',unit:'mg/dL',standard:[0,130],eva:[0,60]},
 {name:'Ferritina',detail:'Ferritina sérica',value:'320',unit:'ng/mL',standard:[30,400],eva:[50,150]},
] as const;

export const businessLinks={
 signup:'/es/signup',upload:'/es/upload',
 method:'/es/how-it-works',science:'/es/science',
 pricing:'/es/pricing',about:'/es/about',
 privacy:'/es/legal/privacy',terms:'/es/legal/terms',
 cookies:'/es/legal/cookies',blog:'/es/blog',
 english:'https://www.evahealth.es/en',email:'mailto:hello@evahealth.es',
};

export const methodSteps=[
 {title:'Recoge tu muestra en casa.',copy:'La recogida se realiza con Tasso+. Después, tu muestra se analiza en un laboratorio.'},
 {title:'Recibe tus resultados.',copy:'El laboratorio analiza 15 biomarcadores. Sus resultados serán tu punto de partida para las siguientes lecturas.'},
 {title:'Entiende tus resultados.',copy:'Consulta tus valores junto a los rangos de EVA, tu edad biológica estimada y tu puntuación de longevidad.'},
 {title:'Compara cada 90 días.',copy:'Repite tu panel cada 90 días o consulta las opciones de paneles especializados y del panel completo. Cada lectura amplía tu historial.'},
];
