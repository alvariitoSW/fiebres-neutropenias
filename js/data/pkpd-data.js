// Dosificación PK/PD por fármaco, ajustada según función renal y gravedad.
export const pkpdData = {
    'piptazo': {
        doses: {
            normal: { 'normal': '4.5g / 8h', 'mild': '4.5g / 8h', 'mod': '4.5g / 12h', 'sev': '4.5g / 12h', 'crrt': '4.5g / 8h' },
            severe: { 'normal': '4.5g / 6h (Inf. Extendida)', 'mild': '4.5g / 8h (Inf. Extendida)', 'mod': '4.5g / 8h', 'sev': '4.5g / 12h', 'crrt': '4.5g / 8h (Inf. Extendida)' }
        },
        inter: "Vancomicina (aumenta drásticamente riesgo de FRA), Metotrexato (disminuye aclaramiento).",
        contra: "Hipersensibilidad grave a Penicilinas."
    },
    'mero': {
        doses: {
            normal: { 'normal': '1g / 8h', 'mild': '1g / 12h', 'mod': '500mg / 12h', 'sev': '500mg / 24h', 'crrt': '1g / 12h' },
            severe: { 'normal': '2g / 8h (Inf. 3h)', 'mild': '1g / 8h (Inf. 3h)', 'mod': '1g / 12h (Inf. 3h)', 'sev': '500mg / 12h (Inf. 3h)', 'crrt': '1g / 8h (Inf. 3h)' }
        },
        inter: "Ácido Valproico (cae el nivel de valproico a rangos subterapéuticos), Probenecid.",
        contra: "Alergia a carbapenems. Cuidado en pacientes con epilepsia (reduce umbral convulsivo)."
    },
    'cefepime': {
        doses: {
            normal: { 'normal': '2g / 8h', 'mild': '2g / 12h', 'mod': '2g / 24h', 'sev': '1g / 24h', 'crrt': '2g / 24h' },
            severe: { 'normal': '2g / 8h (Inf. Extendida)', 'mild': '2g / 12h', 'mod': '2g / 24h', 'sev': '1g / 24h', 'crrt': '2g / 24h' }
        },
        inter: "Furosemida y Aminoglucósidos (potencia nefrotoxicidad).",
        contra: "Encefalopatía previa o fallo renal sin ajustar dosis (riesgo altísimo de neurotoxicidad y mioclonías)."
    },
    'colistina': {
        doses: {
            normal: { 'normal': 'Carga 9MU → Mant. 3MU/8h', 'mild': 'Carga 9MU → Mant. 2.5MU/12h', 'mod': 'Carga 9MU → Mant. 2.5MU/24h', 'sev': 'Carga 9MU → Mant. 1.5MU/24h', 'crrt': 'Carga 9MU → Mant. 2MU/12h' },
            severe: { 'normal': 'Carga 9MU → Mant. 3MU/8h (Dosis Máx)', 'mild': 'Carga 9MU → Mant. 3MU/12h', 'mod': 'Carga 9MU → Mant. 3MU/24h', 'sev': 'Carga 9MU → Mant. 1.5MU/12h', 'crrt': 'Carga 9MU → Mant. 2MU/12h' }
        },
        inter: "Nefrotóxicos concurrentes (AINEs, Aminoglucósidos). Prolonga el efecto de Bloqueantes Neuromusculares (Rocuronio).",
        contra: "Miastenia Gravis (produce bloqueo neuromuscular). Vigilar estrechamente en fracaso renal progresivo."
    },
    'tige': {
        doses: {
            normal: { 'normal': 'Carga 100mg → Mant. 50mg/12h', 'mild': 'Carga 100mg → Mant. 50mg/12h', 'mod': 'Carga 100mg → Mant. 50mg/12h', 'sev': 'Carga 100mg → Mant. 50mg/12h', 'crrt': 'Carga 100mg → Mant. 50mg/12h' },
            severe: { 'normal': 'Carga 200mg → Mant. 100mg/12h', 'mild': 'Carga 200mg → Mant. 100mg/12h', 'mod': 'Carga 200mg → Mant. 100mg/12h', 'sev': 'Carga 200mg → Mant. 100mg/12h', 'crrt': 'Carga 200mg → Mant. 100mg/12h' }
        },
        inter: "Warfarina (aumenta INR). Anticonceptivos orales.",
        contra: "Bacteriemias puras (concentración plasmática muy baja, riesgo de fracaso). Resistencia natural de Pseudomonas."
    },
    'amoxi': {
        doses: {
            normal: { 'normal': '1.2g / 8h', 'mild': '1.2g / 8h', 'mod': '1.2g / 12h', 'sev': '1.2g / 24h', 'crrt': '1.2g / 12h' },
            severe: { 'normal': '1.2g / 6h ó 2.2g / 8h', 'mild': '1.2g / 8h', 'mod': '1.2g / 12h', 'sev': '1.2g / 24h', 'crrt': '1.2g / 12h' }
        },
        inter: "Alopurinol (rash cutáneo), Metotrexato.",
        contra: "Alergia a penicilinas. Historia de ictericia/fallo hepático por amoxi-clavulánico."
    },
    'sulbactam': {
        doses: {
            normal: { 'normal': '1g / 6h', 'mild': '1g / 8h', 'mod': '1g / 12h', 'sev': '1g / 24h', 'crrt': '1g / 12h' },
            severe: { 'normal': '2g / 6h (Acineto XDR)', 'mild': '1g / 6h', 'mod': '1g / 8h', 'sev': '1g / 12h', 'crrt': '1g / 8h' }
        },
        inter: "Mismas que aminopenicilinas. Probenecid prolonga su semivida.",
        contra: "Alergia documentada a betalactámicos."
    },
    'amfob': {
        doses: {
            normal: { 'normal': '3 mg/kg/día', 'mild': '3 mg/kg/día', 'mod': '3 mg/kg/día', 'sev': '3 mg/kg/día', 'crrt': '3 mg/kg/día' },
            severe: { 'normal': '5 mg/kg/día (Sospecha Mucor/SNC)', 'mild': '5 mg/kg/día', 'mod': '5 mg/kg/día', 'sev': '5 mg/kg/día', 'crrt': '5 mg/kg/día' }
        },
        inter: "Nefrotóxicos concurrentes (Aminoglucósidos, Ciclosporina, Furosemida). Vigilar Hipopotasemia e Hipomagnesemia extrema.",
        contra: "Vigilar estrechamente en fracaso renal progresivo (valorar cambio a Equinocandina si no hay sospecha de hongo filamentoso)."
    },
    'caspo': {
        doses: {
            normal: { 'normal': 'Carga 70mg → Mant. 50mg/24h', 'mild': 'Carga 70mg → 50mg/24h', 'mod': 'Carga 70mg → 50mg/24h', 'sev': 'Carga 70mg → 50mg/24h', 'crrt': 'Carga 70mg → 50mg/24h' },
            severe: { 'normal': 'Carga 70mg → Mant. 70mg/24h (>80kg)', 'mild': 'Carga 70mg → 70mg/24h', 'mod': 'Carga 70mg → 70mg/24h', 'sev': 'Carga 70mg → 70mg/24h', 'crrt': 'Carga 70mg → 70mg/24h' }
        },
        inter: "Inductores enzimáticos (Rifampicina), Ciclosporina (aumenta transaminasas), Tacrolimus (caen niveles valle).",
        contra: "Fallo hepático grave (Child-Pugh C) requiere ajuste de dosis. (No requiere ajuste por fallo renal)."
    },
    'vori': {
        doses: {
            normal: { 'normal': 'IV: Carga 6mg/kg/12h x2 → 4mg/kg/12h', 'mild': 'Pasar a Vía Oral (Evitar ciclodextrina IV)', 'mod': 'Vía Oral o TCRR', 'sev': 'Vía Oral o TCRR', 'crrt': 'IV: Carga 6mg/kg → 4mg/kg/12h' },
            severe: { 'normal': 'IV: Carga 6mg/kg x2 → 4mg/kg/12h (Obj. Valle 2-6 mg/L)', 'mild': 'Pasar a Vía Oral', 'mod': 'Vía Oral o TCRR', 'sev': 'Vía Oral o TCRR', 'crrt': 'IV: Carga 6mg/kg → 4mg/kg/12h' }
        },
        inter: "¡Inhibidor potente CYP3A4! Multiplica drásticamente niveles de Tacrolimus y Sirolimus. Contraindicado con inductores potentes (Rifampicina, Carbamazepina).",
        contra: "Precaución con prolongación del QTc. Evitar formulación IV si ClCr < 50 ml/min por acumulación de excipiente SBECD (nefrotóxico)."
    }
};
