import type {ReportActionStep} from '../../../../lib/preview/model';
export type ActionItem=ReportActionStep;
export interface DesignProps{actions:ActionItem[];selectedId:string;onSelect:(id:string)=>void;onEvidence:(key:string)=>void;direction:1|-1}
export const categoryLabels:Record<string,string>={nutrition:'Alimentación',exercise:'Movimiento',lifestyle:'Descanso',medical:'Seguimiento',supplement:'Suplementación',monitoring:'Seguimiento',context:'Contexto de la muestra',reading:'Lectura del informe'};
export const markerLabels:Record<string,string>={apob:'ApoB',ldl:'LDL',hba1c:'HbA1c',hscrp:'hsCRP',vitamin_d:'Vitamina D','vitamin-d':'Vitamina D',insulin:'Insulina'};
