// Datos de apoyo diagnóstico: técnicas rápidas por foco y tratamiento empírico por foco clínico.
export const focoData = {
    itu: { tecnica: 'Citometría de flujo / turbidimetría', tiempo: '~10 min', nota: 'Cribado rápido para tracto urinario.' },
    resp: { tecnica: 'Ag urinarios neumococo/Legionella', tiempo: '< 20 min', nota: '⚠️ Cuidado con falsos positivos por vacunación.' },
    gripe: { tecnica: 'Amplificación ARN viral (exudado nasofaríngeo)', tiempo: '< 30 min', nota: 'Tomar muestra antes de antiviral. Falsos negativos si se hace >48 h después del inicio de síntomas (baja la carga viral).' },
    sangre: { tecnica: 'MALDI-TOF o PCR', tiempo: '< 60 min post-positivización', nota: 'Hemocultivo sigue siendo gold standard para antibiograma.' },
    diarrea: { tecnica: 'Toxina C. difficile', tiempo: '< 20 min (inmunocromatografía) · PCR < 2 h', nota: 'Entre el 20 y el 30% de los hematológicos colonizados desarrolla infección. No aplicar escalas pronósticas de recurrencia en hematología.' }
};

export const focoTxData = {
    'mucositis-leve': { tratamiento: 'Cefepime', comentario: 'No es imprescindible cobertura anaerobia.' },
    'mucositis-grave': { tratamiento: 'Pip-Tazo / Carbapenem', comentario: 'Cobertura anaerobia. Valorar antiviral/antifúngico.' },
    'enterocolitis': { tratamiento: 'Pip-Tazo / Carbapenem', comentario: 'Añadir cobertura C. difficile si alta sospecha.' },
    'perianal': { tratamiento: 'Pip-Tazo / Carbapenem', comentario: 'Si sospecha de absceso: cubrir BGN, enterococo y anaerobios (glucopéptido si enterococo resistente a ampicilina). Descartar gangrena de Fournier. Tacto rectal CONTRAINDICADO.' },
    'piel': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem ± Vanco/Dapto/Linezolid', comentario: 'Anti-SARM si colonización/infección previa. Biopsia de toda lesión sospechosa. Si sospecha necrotizante: añadir clindamicina (inhibe la síntesis de toxinas) y cirugía urgente.' },
    'cateter': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem + Vanco/Dapto', comentario: 'Linezolid NO recomendado. Retirar CVC precozmente.' },
    'neumonia': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem ± Quinolonas/Aminoglucósidos', comentario: 'Comunitaria con sospecha de atípicas: quinolona o macrólido. Colonización SARM o alta endemia: añadir linezolid o vancomicina. Oseltamivir en epidemia de gripe. Infiltrados bilaterales en paciente de riesgo: pensar en P. jirovecii y CMV.' },
    'itu': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem', comentario: 'Añadir aminoglucósido o glucopéptido si crítico, sonda urinaria o colonización/infección previa por multirresistentes. Tacto rectal contraindicado.' },
    'meningitis': { tratamiento: 'Cefepime / Meropenem + Ampicilina (± Aciclovir)', comentario: 'Ampicilina cubre Listeria. Corticoides inmediatos, tras tomar muestras. Aciclovir si meningoencefalitis. Pensar en criptococo (antígeno en suero y LCR).' },
    'sinusitis': { tratamiento: 'Cefepime / Pip-Tazo / Carbapenem', comentario: 'TC urgente (afectación ósea sugiere hongo). Anti-S. aureus si celulitis orbitaria. Si neutropenia prolongada o corticoides y mínima sospecha fúngica: tratar Aspergillus y Mucorales (anfotericina B a dosis altas).' }
};
