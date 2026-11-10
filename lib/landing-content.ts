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
    "title": "Empieza en casa.",
    "copy": "Recoge tu muestra con Tasso+. Tu primer kit incluye el análisis de 13 biomarcadores en laboratorio."
  },
  {
    "title": "Entiende tus resultados iniciales.",
    "copy": "Descubre qué mide cada marcador y cómo se compara tu valor con el intervalo del laboratorio."
  },
  {
    "title": "Compara tu propio historial.",
    "copy": "Reúne lecturas compatibles y considéralas junto a tu situación personal."
  },
  {
    "title": "Elige tu próximo enfoque.",
    "copy": "Cada trimestre, revisa lo que has aprendido y explora los paneles disponibles con la orientación de EVA."
  }
];
