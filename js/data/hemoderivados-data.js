// Los hemoderivados: lo que trae cada bolsa, una sola vez para toda la app (cobertura del bloque 2, pieza común 2).
// Datos puros, sin DOM. Los dibuja js/core/bolsa.js (la bolsa que gotea en el capilar vivo y en el vaso que sangra)
// y los leen los modelos y los casos: ninguna de estas cifras se vuelve a escribir en otro sitio.
//
// Fuente: Marino PL. The ICU Book, 5.ª ed., caps. 12-13 (docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf; la
// página del PDF es la del libro). Cada producto dice su página (pag), su ficha y el id del párrafo de la ficha
// (Merino HEMATO), para su «Ver en la ficha» (core/citas.js). Las discrepancias de la fuente, con su nota.
//
// Campos: nombre, corto (el rótulo de la bolsa), envase ('bolsa' | 'frasco'), color (token; la bolsa lleva además su
// rótulo: la identidad nunca va solo por color), volumen (mL; null si la fuente no lo da) y lo demás de cada uno.

export const PDF_HEMODERIVADOS = 'docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf';
const cita = (ficha, id, pag) => ({ libro: 'Marino, The ICU Book (5.ª ed.)', pdf: PDF_HEMODERIVADOS, ficha, id, pag });

export const HEMODERIVADOS = {
    // Concentrado de hematíes (Tabla 12.3 y texto, p. 9-10)
    ch: {
        nombre: 'Concentrado de hematíes', corto: 'CH', envase: 'bolsa', color: '--accent-red',
        volumen: 350, hto: 60, conservacion: '1-6 °C', dias: 42,
        // Las fuentes discrepan dentro de la misma página: la Tabla 12.3 dice 15-30 mL; el texto, 30-50 mL (p. 9)
        plasmaResidual: { tabla: '15-30 mL', texto: '30-50 mL' },
        sube: { hb: 1, hto: 3 },                 // por unidad, en un adulto medio (p. 10)
        horasPorUnidad: 2,                       // en el estable (p. 10)
        cita: cita('merino-transfusion', 'mh-tabla-12-3', '9-10'),
    },
    // Plaquetas agrupadas de 4-6 donantes (p. 29-30)
    plaquetas: {
        nombre: 'Plaquetas agrupadas', corto: 'Plaquetas', envase: 'bolsa', color: '--text-main',
        volumen: 260, donantes: '4-6', contenido: '38 × 10¹⁰ plaquetas en 260 mL',   // con su nota de fidelidad en la ficha
        conservacion: 'temperatura ambiente', dias: 5,
        subeHora: '35.000-50.000/µL', menos24h: '≈40 %',                              // por unidad (p. 30, Fig. 13.2)
        cita: cita('merino-plaquetas-plasma', 'mh-plaq-preparaciones', '29-30'),
    },
    // Plaquetas de aféresis: un solo donante, el mismo recuento que las agrupadas (p. 30). La fuente no da su volumen.
    plaquetasAferesis: {
        nombre: 'Plaquetas de aféresis', corto: 'Aféresis', envase: 'bolsa', color: '--text-main',
        volumen: null, donantes: '1', conservacion: 'temperatura ambiente', dias: 5,
        subeHora: '35.000-50.000/µL',
        cita: cita('merino-plaquetas-plasma', 'mh-plaq-aferesis', '30'),
    },
    // Plasma fresco congelado (p. 32-33)
    pfc: {
        nombre: 'Plasma fresco congelado', corto: 'PFC', envase: 'bolsa', color: '--accent-yellow',
        volumen: 230, congelado: '−18 °C en las 8 h de la extracción', dias: 365, descongelado: '1-6 °C hasta 5 días',
        plasmaLiquido: '1-6 °C hasta 26 días, sin congelar',
        masiva: '1 PFC por cada 1-2 CH',
        warfarina: '10-15 mL/kg, tras la vitamina K',
        cita: cita('merino-plaquetas-plasma', 'mh-pfc', '32-33'),
    },
    // Crioprecipitado (p. 35)
    crio: {
        nombre: 'Crioprecipitado', corto: 'Crio', envase: 'bolsa', color: '--text-dim',
        volumen: '10-15', fibrinogeno: '10-20 g/L', contiene: 'fibrinógeno, factor de von Willebrand y factor VIII',
        conservacion: '−18 °C hasta 1 año', usar: 'en las 4 h tras descongelarlo',
        dosis: '1 unidad por 10 kg: +50 mg/dL de fibrinógeno sin sangrado (con sangrado activo hará falta más)',
        trauma: 'fibrinógeno de 150-200 mg/dL',
        cita: cita('merino-plaquetas-plasma', 'mh-crio', '35'),
    },
    // Concentrado de complejo protrombínico de 4 factores: polvo liofilizado, 100 mL reconstituido (p. 33)
    ccp4f: {
        nombre: 'Concentrado de complejo protrombínico (4 factores)', corto: 'CCP4F', envase: 'frasco', color: '--accent-blue',
        volumen: 100, contiene: 'factores II, VII, IX y X', tiempo: 'revierte la warfarina en menos de 30 min',
        cita: cita('merino-plaquetas-plasma', 'mh-pfc-warfarina', '33'),
    },
    // Concentrado de fibrinógeno: 20 g/L constantes, sin descongelar (p. 35). La fuente no da su volumen.
    fibrinogeno: {
        nombre: 'Concentrado de fibrinógeno', corto: 'Fibrinógeno', envase: 'frasco', color: '--accent-yellow',
        volumen: null, fibrinogeno: '20 g/L', usar: 'sin descongelar',
        cita: cita('merino-plaquetas-plasma', 'mh-crio', '35'),
    },
};
