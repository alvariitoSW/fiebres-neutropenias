// Datos de apoyo diagnóstico: técnicas rápidas por foco y tratamiento empírico por foco clínico.
export const focoData = {
    itu: { tecnica: 'Citometría de flujo / turbidimetría', tiempo: '~10 min', nota: 'Cribado rápido para tracto urinario.' },
    resp: { tecnica: 'Ag urinarios neumococo/Legionella', tiempo: '< 20 min', nota: '⚠️ Cuidado con falsos positivos por vacunación.' },
    gripe: { tecnica: 'Amplificación ARN viral', tiempo: '< 30 min', nota: 'Tomar muestra antes de antiviral.' },
    sangre: { tecnica: 'MALDI-TOF o PCR', tiempo: '< 60 min post-positivización', nota: 'Hemocultivo sigue siendo gold standard para antibiograma.' },
    diarrea: { tecnica: 'Toxina C. difficile', tiempo: 'Rápido', nota: 'No aplicar escalas pronósticas de recurrencia en hematología.' }
};

export const focoTxData = {
    'mucositis-leve': { tratamiento: 'Cefepime', comentario: 'No es imprescindible cobertura anaerobia.' },
    'mucositis-grave': { tratamiento: 'Pip-Tazo / Carbapenem', comentario: 'Cobertura anaerobia. Valorar antiviral/antifúngico.' },
    'enterocolitis': { tratamiento: 'Pip-Tazo / Carbapenem', comentario: 'Añadir cobertura C. difficile si alta sospecha.' },
    'perianal': { tratamiento: 'Pip-Tazo / Carbapenem', comentario: 'Valorar cobertura enterococo. Tacto rectal CONTRAINDICADO.' },
    'piel': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem ± Vanco/Dapto/Linezolid', comentario: 'Cirugía urgente si sospecha necrotizante.' },
    'cateter': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem + Vanco/Dapto', comentario: 'Linezolid NO recomendado. Retirar CVC precozmente.' },
    'neumonia': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem ± Quinolonas/Aminoglucósidos', comentario: 'Añadir macrólido si atípicas. Oseltamivir en epidemia.' },
    'itu': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem', comentario: 'Añadir aminoglucósido si crítico o sonda.' },
    'meningitis': { tratamiento: 'Cefepime / Meropenem + Ampicilina (± Aciclovir)', comentario: 'Ampicilina cubre Listeria. Corticoides inmediatos.' }
};
