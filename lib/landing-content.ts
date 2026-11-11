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
  {
    "title": "Elige por dónde empezar.",
    "copy": "Sube tus analíticas anteriores para interpretarlas gratis. O empieza con el kit de 13 biomarcadores, con recogida en casa mediante Tasso+."
  },
  {
    "title": "Entiende cada resultado.",
    "copy": "Revisa qué mide cada biomarcador, su valor y unidad junto al intervalo del laboratorio. La fecha y el informe de origen ayudan a situarlo."
  },
  {
    "title": "Compara con contexto.",
    "copy": "Si tienes varias lecturas compatibles, compáralas junto a lo que ocurría alrededor de cada muestra. Un cambio no explica por sí solo su causa."
  },
  {
    "title": "Elige tu próximo enfoque.",
    "copy": "Alrededor de los 90 días puede ser un buen momento para revisar lo aprendido. Explora los paneles disponibles con EVA y decide qué medir después según tu situación."
  }
];
