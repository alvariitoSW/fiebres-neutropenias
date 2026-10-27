// Vista Visual de «ECG y arritmias» (PIF Cardiología): cada ficha tiene su lector de ECG (ecg-lector.js) sobre el
// trazado real del libro, más las demás láminas y los flujos de la ficha. Cada nodo apunta a su texto por id.
// Fuente: López Ramírez JH. La alegría de leer el electrocardiograma, 3.ª ed., 2012 (página en cada chip).
import { montarVisual } from '../../core/visual-kit.js';
import { crearLectorEcg } from './ecg-lector.js';

const propio = (titulo, nota, def) => ({ tipo: 'propio', titulo, nota, render: (cuerpo, ctx) => crearLectorEcg(cuerpo, def, ctx) });
const LAMINAS = { tipo: 'figuras', titulo: 'Las láminas del libro', nota: 'Desliza para verlas; tócalas para ampliarlas.' };
const CALC_MM = { campo: 'ecg2-calc-mm', valor: 14, resultado: 'ecg2-calc-resultado' };
const CALC_QRS = { campos: [{ campo: 'ecg2-calc-qrs', valor: 7 }, { campo: 'ecg2-calc-ventana', valor: 12 }], resultado: 'ecg2-calc-resultado' };

const CICLO = {
    figura: '#ecg1-fig-ciclo', grupo: 'metodo', pregunta: 'Toca una onda o el papel: te digo qué registra.', fuente: '#ecg1-tabla-ondas', pagina: 2,
    chips: [
        { etiqueta: 'P', zona: { x: 14, y: 50, w: 16, h: 20, rotulo: 'P' }, frase: 'P: despolarización auricular. Positiva en casi todas las derivaciones, siempre negativa en aVR.', pagina: 2, fuente: '#ecg1-tabla-ondas' },
        { etiqueta: 'QRS', zona: { x: 35, y: 4, w: 15, h: 92, rotulo: 'QRS' }, frase: 'QRS: despolarización ventricular. Primera onda negativa = Q; primera positiva = R; negativa posterior a la R = S.', pagina: 2, fuente: '#ecg1-tabla-ondas' },
        { etiqueta: 'T', zona: { x: 68, y: 58, w: 20, h: 26, rotulo: 'T' }, frase: 'T: repolarización ventricular. Positiva en todas las derivaciones salvo aVR, con muchas variantes normales.', pagina: 2, fuente: '#ecg1-tabla-ondas' },
        { etiqueta: 'Papel', zona: { x: 2, y: 84, w: 14, h: 12, rotulo: '1 mm' }, frase: '1 mm de largo = 0,04 s; una línea gruesa cada 5 mm = 0,2 s; 1 mm de alto = 0,1 mV.', pagina: 3, fuente: '#ecg1-tabla-papel' }
    ]
};
const RAYAS = {
    figura: '#ecg2-fig-rayas', grupo: 'metodo', pregunta: 'Método 1: ¿en qué raya cae la siguiente R?', fuente: '#ecg2-tabla-rayas', pagina: 7,
    chips: [
        { paso: 'F', etiqueta: 'R de partida', zona: { x: 15, y: 20, w: 8, h: 72, rotulo: 'R' }, frase: 'Se busca una R sobre una raya gruesa y se mira en qué raya posterior cae la siguiente R.', pagina: 7, fuente: '#ecg2-metodo1' },
        { paso: 'F', etiqueta: 'Rayas 300-150-100', zona: { x: 24, y: 0, w: 48, h: 14 }, frase: 'Si la siguiente R cae en la 1.ª raya, 300 (rara); en la 2.ª, 150; en la 3.ª, 100; luego 75, 60 y 50 lpm.', pagina: 7, fuente: '#ecg2-tabla-rayas' },
        { paso: 'F', etiqueta: 'Siguiente R: 100', zona: { x: 63, y: 20, w: 8, h: 72, rotulo: '100' }, frase: 'Aquí la segunda R cae en la tercera raya: FC 100.', pagina: 7, fuente: '#ecg2-tabla-rayas' }
    ]
};
const MM14 = {
    figura: '#ecg2-fig-14mm', grupo: 'metodo', pregunta: 'Método 2: cuenta los milímetros entre dos R.', fuente: '#ecg2-metodo2', pagina: 10,
    chips: [
        { paso: 'F', etiqueta: '14 mm entre R y R', zona: { x: 14, y: 4, w: 72, h: 70, rotulo: '14 mm' }, frase: 'Entre R y R hay 14 mm: 1500/14 = 107 lpm aproximadamente (el método 1 habría dado 110).', pagina: 10, fuente: '#ecg2-metodo2', calc: CALC_MM },
        { paso: 'F', etiqueta: '1500 ÷ mm', frase: 'Se cuentan los milímetros entre dos R y se divide 1500 entre ese número: 1500/5 = 300; 1500/10 = 150; 1500/15 = 100.', pagina: 10, fuente: '#ecg2-metodo2' }
    ]
};
const S5 = {
    figura: '#ecg2-fig-5s', grupo: 'metodo', pregunta: 'Método 3: cuenta los QRS en 5 segundos.', fuente: '#ecg2-metodo3', pagina: 11,
    chips: [
        { paso: 'F', etiqueta: '7 QRS en 5 s', zona: { x: 0, y: 4, w: 100, h: 72, rotulo: '5 s' }, frase: '7 QRS en 5 s: 7 × 12 = 84 lpm.', pagina: 11, fuente: '#ecg2-metodo3', calc: CALC_QRS },
        { paso: 'F', etiqueta: 'Solo en la FA', frase: 'El método es muy inexacto y se reserva para la fibrilación auricular.', pagina: 11, fuente: '#ecg2-metodo3' }
    ]
};
const SINUSAL = {
    figura: '#ecg-f3-fig-sinusal', grupo: 'metodo', pregunta: '¿Hay una P igual antes de cada QRS?', fuente: '#ecg-f3-es-sinusal', pagina: 14,
    chips: [
        { paso: 'R', etiqueta: 'P antes de cada QRS', zona: { x: 1, y: 10, w: 98, h: 70 }, frase: 'Ritmo sinusal: antes de cada QRS hay una P y todas se parecen.', pagina: 14, fuente: '#ecg-f3-es-sinusal' },
        { paso: 'R', etiqueta: 'Si no hay P', frase: 'Si no hay P en ninguna derivación, se mira si los QRS tienen un RR regular o variable.', pagina: 14, fuente: '#ecg-f3-es-sinusal' }
    ]
};
const EJE = {
    figura: '#ecg-f4-fig-90', grupo: 'metodo', pregunta: '¿Qué derivación es isobifásica y cuál es su perpendicular?', fuente: '#ecg-f4-pasos', pagina: 47,
    chips: [
        { paso: 'E', etiqueta: 'DI isobifásica', zona: { x: 14, y: 4, w: 58, h: 42, rotulo: 'DI' }, frase: 'Busca la derivación donde el QRS es más isobifásico (tan positivo como negativo).', pagina: 47, fuente: '#ecg-f4-pasos' },
        { paso: 'E', etiqueta: 'Perpendicular: aVF', zona: { x: 14, y: 54, w: 58, h: 42, rotulo: 'aVF' }, frase: 'Busca su perpendicular (DI con aVF) y mira su polaridad: aquí aVF es positiva.', pagina: 48, fuente: '#ecg-f4-pasos' },
        { paso: 'E', etiqueta: 'Eje +90°', frase: 'Arriba, DI con QRS isobifásico; abajo, aVF positiva: el eje está a +90°.', pagina: 48, fuente: '#ecg-f4-pasos' },
        { paso: 'E', etiqueta: 'Cuadrantes', frase: 'Con DI y aVF positivas, el eje cae entre 0° y +90° (normal).', pagina: 53, fuente: '#ecg-f4-tabla-cuadrantes' }
    ]
};
const HAI = {
    figura: '#ecg-f5-fig-hai', grupo: 'metodo', pregunta: '¿Cuánto mide la P y cómo es su forma?', fuente: '#ecg-f5-hai', pagina: 60,
    chips: [
        { paso: 'H', etiqueta: 'P > 3 mm de ancho', zona: { x: 17, y: 26, w: 20, h: 62, rotulo: '> 3 mm' }, frase: 'P de más de 3 mm de ancho y mellada: hipertrofia de la aurícula izquierda.', pagina: 60, fuente: '#ecg-f5-hai' },
        { paso: 'H', etiqueta: 'P mellada', zona: { x: 20, y: 34, w: 15, h: 16, rotulo: 'P' }, frase: 'En la HAI la P tiende a ser mellada («P mellada mitral»). Hay P melladas de menos de 2,5 mm que no significan hipertrofia.', pagina: 61, fuente: '#ecg-f5-hai' }
    ]
};
const T = {
    figura: '#ecg-f6-fig-t', grupo: 'metodo', pregunta: 'Dos T invertidas: ¿cuál es isquemia y cuál sobrecarga?', fuente: '#ecg-f6-t-neg', pagina: 73,
    chips: [
        { paso: 'I', etiqueta: 'A · simétrica y profunda', zona: { x: 25, y: 44, w: 20, h: 50, rotulo: 'A' }, frase: 'A: T invertida por isquemia, simétrica y profunda.', pagina: 73, fuente: '#ecg-f6-t-neg' },
        { paso: 'I', etiqueta: 'B · por sobrecarga', zona: { x: 80, y: 66, w: 18, h: 28, rotulo: 'B' }, frase: 'B: T invertida por sobrecarga en HVI.', pagina: 73, fuente: '#ecg-f6-t-neg' }
    ]
};
const WPW = {
    figura: '#ecg-f7-fig-wpw', grupo: 'metodo', pregunta: 'V5 y V6: ¿qué tiene de especial este QRS?', fuente: '#ecg-f7-wpw', pagina: 94,
    chips: [
        { paso: 'I', etiqueta: 'PR de 0,10 s', zona: [{ x: 16, y: 35, w: 18, h: 30 }, { x: 56, y: 30, w: 22, h: 30 }], frase: 'WPW: PR corto (en V5 y V6, de 0,10 s).', pagina: 94, fuente: '#ecg-f7-wpw' },
        { paso: 'I', etiqueta: 'Onda delta', zona: [{ x: 27, y: 34, w: 10, h: 26, rotulo: 'δ' }, { x: 64, y: 36, w: 12, h: 24, rotulo: 'δ' }], frase: 'QRS ensanchado y una melladura en la rama ascendente, que es la onda delta.', pagina: 94, fuente: '#ecg-f7-wpw' },
        { paso: 'I', etiqueta: 'QRS > 0,11 s', frase: 'El WPW se define por PR corto, onda delta y QRS > 0,11 s: hay una vía accesoria (haz de Kent) paralela al sistema normal y más rápida.', pagina: 94, fuente: '#ecg-f7-wpw' }
    ]
};
const EKG1 = {
    figura: '#ecg9-fig-ekg1', grupo: 'metodo', rejilla: { x: 1, y: 3, w: 98, h: 94 }, pregunta: 'EKG 1 en sus 12 derivaciones: toca un hallazgo y mira dónde está.', fuente: '#ecg9-tabla-ekg', pagina: 136,
    chips: [
        { paso: 'I', etiqueta: '↑ST en V1 y aVR', derivs: ['V1', 'aVR'], frase: '↑ST > 0,25 mV en V1; ↑ST en aVR.', pagina: 137, fuente: '#ecg9-tabla-ekg' },
        { paso: 'I', etiqueta: '↓ST en V5', derivs: ['V5'], frase: '↓ST en V5.', pagina: 137, fuente: '#ecg9-tabla-ekg' },
        { paso: 'I', etiqueta: '↓ST inferior', derivs: ['II', 'III', 'aVF'], frase: '↓ST inferior ≥ 0,1 mV.', pagina: 137, fuente: '#ecg9-tabla-ekg' },
        { paso: 'I', etiqueta: 'Q en aVL', derivs: ['aVL', 'I'], frase: 'Q en aVL con ↑ST en DI-aVL.', pagina: 137, fuente: '#ecg9-tabla-ekg' },
        { paso: 'I', etiqueta: 'Qué arteria', frase: 'EKG 1: infarto anterior por oclusión de la DA antes de la 1.ª septal y la 1.ª diagonal.', pagina: 136, fuente: '#ecg9-tabla-ekg' }
    ]
};
const TV = {
    figura: '#ecg8-fig-tv', grupo: 'guardia', pregunta: 'Mira el trazado y elige las tres antes de comprobar.', fuente: '#ecg8-brugada', pagina: 123,
    respuesta: { ritmo: 'Rápido', qrs: 'Ancho', rr: 'Regular' },
    libro: 'Rápida, ancha y regular. Con disociación AV (P ocasionales que deforman el QRS: la muesca de los complejos pares) es TV.'
};
const FA = {
    figura: '#ecg8-fig-fa', grupo: 'guardia', pregunta: 'Mira el trazado y elige las tres antes de comprobar.', fuente: '#ecg8-tabla-estrechas', pagina: 120,
    respuesta: { ritmo: 'Rápido', qrs: 'Estrecho', rr: 'Irregular' },
    libro: 'Rápida, estrecha e irregular. Fibrilación auricular: R-R irregulares y sin P (la línea de base lleva ondas f).'
};

const ayuda = (n, etq, c) => ({ fuente: `css:#ecg8-pasos li:nth-child(${n})`, etiqueta: etq, color: c });
const evo = (n, etq, c) => ({ fuente: `css:#ecg9-evolucion li:nth-child(${n})`, etiqueta: etq, color: c });

export function init() {
    montarVisual('ecg-f1', { guia: 'Un latido onda a onda y el papel donde se mide.', paneles: [
        propio('Un latido y su papel', 'Toca una onda: se marca en el trazado y su frase sale de la ficha.', CICLO)
    ] });
    montarVisual('ecg-f2', { guia: 'Tres formas de sacar la frecuencia en el papel.', paneles: [
        propio('Método 1 · las rayas gruesas', null, RAYAS),
        propio('Método 2 · 1500 entre los milímetros', 'El chip escribe 14 en la calculadora de la ficha y copia su resultado.', MM14),
        propio('Método 3 · QRS en 5 segundos', 'El chip escribe 7 QRS y 5 s en la calculadora de la ficha y copia su resultado.', S5)
    ] });
    montarVisual('ecg-f3', { guia: 'Ritmo sinusal y las arritmias, trazado a trazado.', paneles: [
        propio('¿Hay una P antes de cada QRS?', null, SINUSAL),
        { tipo: 'flujo', titulo: 'Las arritmias de la ficha', nodos: [
            { fuente: '#ecg-f3-ts-que', etiqueta: 'Taquicardia sinusal', color: 'verde' },
            { fuente: '#ecg-f3-fl-que', etiqueta: 'Flúter auricular', color: 'amarillo' },
            { fuente: '#ecg-f3-fa-que', etiqueta: 'Fibrilación auricular', color: 'amarillo' },
            { fuente: '#ecg-f3-tpsv-que', etiqueta: 'Taquicardia paroxística supraventricular', color: 'amarillo' },
            { fuente: '#ecg-f3-cvp-que', etiqueta: 'Contracción ventricular prematura', color: 'rojo' },
            { fuente: '#ecg-f3-tv-que', etiqueta: 'Taquicardia ventricular', color: 'rojo' }
        ] },
        { ...LAMINAS, todas: true }
    ] });
    montarVisual('ecg-f4', { guia: 'El eje en el plano frontal: isobifásica y perpendicular.', paneles: [
        propio('Eje a +90°', null, EJE)
    ] });
    montarVisual('ecg-f5', { guia: 'La P que delata la aurícula izquierda.', paneles: [
        propio('Hipertrofia de la aurícula izquierda', null, HAI)
    ] });
    montarVisual('ecg-f6', { guia: 'Isquemia, lesión y necrosis, en el orden en que aparecen.', paneles: [
        propio('T invertida: isquemia o sobrecarga', null, T),
        { tipo: 'flujo', titulo: 'Secuencia tras una oclusión coronaria', tabla: '#ecg-f6-tabla-secuencia' },
        { ...LAMINAS, nodos: ['#ecg-f6-fig-evolucion'] }
    ] });
    montarVisual('ecg-f7', { guia: 'Intervalos y bloqueos: el WPW en V5 y V6.', paneles: [
        propio('WPW en V5 y V6', null, WPW),
        { ...LAMINAS, nodos: ['#ecg-f7-fig-bav3', '#ecg-f7-fig-brd'] }
    ] });
    montarVisual('ecg-f8', { guia: 'Tres preguntas ante una arritmia: ¿rápida o lenta? ¿QRS estrecho o ancho? ¿R-R regular o irregular?', paneles: [
        propio('Taquicardia de QRS ancho', 'Primero eliges; después se comprueba con el libro.', TV),
        propio('Taquicardia de QRS estrecho', 'Primero eliges; después se comprueba con el libro.', FA),
        { tipo: 'flujo', titulo: 'Cómo leer una arritmia', nodos: [
            ayuda(1, 'Frecuencia de los QRS', 'amarillo'), ayuda(2, 'Si es lenta: disfunción sinusal o bloqueo AV', 'verde'),
            ayuda(3, 'Si es rápida: QRS estrecho o ancho', 'amarillo'), ayuda(4, 'R-R regular o irregular y qué hace la P', 'amarillo'),
            ayuda(5, 'QRS ancho: algoritmo de Brugada', 'rojo')
        ] },
        { ...LAMINAS, nodos: ['#ecg8-fig-escape', '#ecg8-fig-bav2', '#ecg8-fig-flutter', '#ecg8-fig-nodal', '#ecg8-fig-ortodromica', '#ecg8-fig-wpw', '#ecg8-fig-aberrancia'] }
    ] });
    montarVisual('ecg-f9', { guia: 'El ECG del infarto: qué se ve y en qué derivaciones.', paneles: [
        propio('EKG 1 · infarto anterior', null, EKG1),
        { tipo: 'flujo', titulo: 'Evolución del infarto en el ECG', nodos: [
            evo(1, 'T picuda (hiperaguda)', 'amarillo'), evo(2, 'Inicio de la elevación del ST', 'amarillo'), evo(3, '↑ST con ST-T convexo', 'rojo'),
            evo(4, 'Aparece la Q patológica', 'rojo'), evo(5, 'Reperfundido: Q, ST en línea de base, T negativa', 'verde'), evo(6, 'No reperfundido: Q con ST elevado', 'rojo')
        ] },
        { ...LAMINAS, nodos: ['#ecg9-fig-evolucion', '#ecg9-fig-t-hiperaguda', '#ecg9-fig-ekg12', '#ecg9-fig-tep-sca', '#ecg9-fig-tronco'] }
    ] });
    montarVisual('ecg-f10', { guia: 'Los marcapasos en el ECG.', paneles: [{ ...LAMINAS, todas: true }] });
}
