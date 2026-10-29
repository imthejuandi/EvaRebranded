export const categories = [
        {id: 'cardiovascular', name: 'Corazón y cardiovascular', markers: ['Colesterol total', 'LDL', 'HDL', 'Triglicéridos', 'ApoB', 'Lp(a)', 'sdLDL', 'LDL oxidada', 'hs-CRP', 'Homocisteína', 'Fibrinógeno']},
        {id: 'hormones', name: 'Hormonas', markers: ['Testosterona', 'Cortisol', 'DHEA-S', 'Estradiol', 'Progesterona', 'SHBG', 'FSH', 'LH']},
        {id: 'thyroid', name: 'Tiroides', markers: ['TSH', 'T3 libre', 'T4 libre', 'Anti-TPO', 'Anti-Tg', 'T3 reversa']},
        {id: 'nutrition', name: 'Nutrición', markers: ['Ferritina', 'Vitamina D', 'B12', 'Folato', 'Zinc', 'Magnesio', 'Hierro', 'Selenio', 'Cobre']},
        {id: 'metabolic', name: 'Salud metabólica', markers: ['Glucosa en ayunas', 'HbA1c', 'Insulina en ayunas', 'Péptido C', 'Ácido úrico']},
        {id: 'liver', name: 'Hígado', markers: ['ALT', 'AST', 'GGT', 'Bilirrubina', 'Albúmina', 'Fosfatasa alcalina']},
        {id: 'kidney', name: 'Función renal', markers: ['Creatinina', 'Nitrógeno ureico (BUN)', 'Filtrado glomerular estimado (eGFR)', 'Cistatina C', 'Ácido úrico']},
        {id: 'iron', name: 'Hierro y sangre', markers: ['Ferritina', 'Hemograma', 'Hierro sérico', 'Capacidad total de fijación del hierro', 'Saturación de transferrina', 'Reticulocitos']},
        {id: 'immune', name: 'Sistema inmune', markers: ['hs-CRP', 'IL-6', 'TNF-α', 'Fórmula leucocitaria', 'IgA', 'IgG']},
        {id: 'inflammation', name: 'Inflamación', markers: ['hs-CRP', 'Homocisteína', 'Fibrinógeno', 'Velocidad de sedimentación', 'Ferritina en contexto inflamatorio']},
        {id: 'electrolytes', name: 'Electrolitos y minerales', markers: ['Sodio', 'Potasio', 'Calcio', 'Fósforo', 'Magnesio']},
        {id: 'lipids', name: 'Lípidos avanzados', markers: ['Colesterol total', 'LDL', 'HDL', 'ApoB', 'ApoA1', 'Lp(a)', 'sdLDL', 'LDL-P']},
        {id: 'bone', name: 'Salud ósea', markers: ['Calcio', 'Vitamina D', 'PTH', 'Osteocalcina', 'Fosfatasa alcalina']},
        {id: 'oxidative', name: 'Estrés oxidativo', markers: ['Glutatión', 'MDA', '8-OHdG', 'CoQ10']},
        {id: 'aging', name: 'Envejecimiento y longevidad', markers: ['IGF-1', 'Marcadores GlycanAge', 'NAD+', 'Longitud de telómeros']},
] as const;

export const derivedMetrics = [
        {name: 'HOMA-IR', description: 'Estimación relacionada con la resistencia a la insulina.'},
        {name: 'Cociente TG/HDL', description: 'Relación entre triglicéridos y colesterol HDL.'},
        {name: 'AST/ALT · De Ritis', description: 'Relación entre dos enzimas utilizadas en el contexto hepático.'},
        {name: 'Índice omega-3', description: 'Proporción de EPA y DHA dentro de los ácidos grasos.'},
        {name: 'NLR', description: 'Relación entre neutrófilos y linfocitos, utilizada en el contexto inflamatorio.'},
        {name: 'Índice de andrógenos libres', description: 'Relación entre testosterona total y su proteína transportadora.'},
        {name: 'Colesterol no-HDL', description: 'Colesterol total menos HDL, para ampliar el contexto lipídico.'},
] as const;
