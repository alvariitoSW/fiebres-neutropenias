// Vista Visual de Merino Neumología: por ahora, las dos fichas de embolia pulmonar (Marino, cap. 22; bloque 3).
// Recetas para core/visual-kit.js; cada nodo apunta a su texto por id (`fuente: '#nep-…'`) y las calculadoras de la
// ficha se conectan sin copiar su lógica. En las fichas con Estudiar, es el paso «Mira».
import { montarVisual } from '../../core/visual-kit.js';
import { RECETAS_3D_G1 } from './visual-3d-g1.js';
import { RECETAS_3D_G2 } from './visual-3d-g2.js';
import { RECETAS_3D_G2B } from './visual-3d-g2b.js';
import { RECETAS_3D_G3 } from './visual-3d-g3.js';
import { RECETAS_3D_G4 } from './visual-3d-g4.js';
import { RECETAS_3D_G5 } from './visual-3d-g5.js';

const LAMINAS = { tipo: 'figuras', titulo: 'Las láminas del libro', nota: 'Desliza para verlas; tócalas para ampliarlas.', todas: true };

const RECETAS = {
    'neumo-ep-diagnostico': {
        guia: 'Ningún signo confirma ni descarta la embolia: la sospecha sale del riesgo y la confirma la imagen.',
        paneles: [
            { tipo: 'barras', titulo: 'Tabla 22.1: ningún hallazgo pasa del 50 %', tabla: '#nep-tabla-22-1',
              series: [{ col: 1, nombre: 'Valor predictivo positivo', color: 'rojo' }, { col: 2, nombre: 'Valor predictivo negativo', color: 'verde' }] },
            { tipo: 'comparar', titulo: 'Lo que no sirve para descartar', columnas: [
                { titulo: 'La PaO₂', color: 'amarillo', nodos: [{ fuente: '#nep-presentacion', etiqueta: 'El 30 % tiene la PaO₂ normal' }] },
                { titulo: 'El dímero D', color: 'rojo', nodos: [{ fuente: '#nep-dimero-d', etiqueta: 'Elevado hasta en el 80 % de la UCI' }] }
            ] },
            { tipo: 'flujo', titulo: 'Tabla 22.2: la imagen, en orden', nodos: [
                { fuente: '#nep-eco-venosa', etiqueta: 'Eco de compresión: TVP en el 30-50 %', color: 'verde' },
                { fuente: '#nep-ctpa', etiqueta: 'Angio-TC: VPN 95 %', color: 'dorado' },
                [{ fuente: '#nep-vq', etiqueta: 'V/Q si no hay TC', color: 'amarillo' }, { fuente: '#nep-ecocardio', etiqueta: 'Eco: trombo móvil o McConnell', color: 'purpura' }]
            ] },
            { tipo: 'requisitos', modo: 'todos', titulo: 'Émbolo subsegmentario: ¿retener la anticoagulación? (lista de la ficha)', puerta: 'Las 4 condiciones', items: [{ checks: '.neumo-ep-subseg-check' }], resultado: ['#neumo-ep-subseg-resultado'] },
            LAMINAS
        ]
    },
    'neumo-ep-manejo': {
        guia: 'El riesgo decide: el VD, la troponina y la inestabilidad. Anticoagular evita el siguiente émbolo; la lisis deshace este.',
        paneles: [
            { tipo: 'requisitos', modo: 'ninguno', sinPuerta: true, iconoMarcado: '☑', titulo: 'Clasificador de riesgo (de la ficha)', items: [{ checks: '.neumo-ep-riesgo-check' }], resultado: ['#neumo-ep-riesgo-resultado'] },
            { tipo: 'escalera', titulo: 'Tabla 22.3: qué hacer en cada riesgo', tabla: '#nep-tabla-22-3' },
            { tipo: 'calculadora', titulo: 'Ecuación 22.1: peso ajustado para la heparina (calculadora de la ficha)', campos: ['#neumo-peso-ideal', '#neumo-peso-real'], resultado: ['#neumo-peso-ajustado-resultado'] },
            { tipo: 'flujo', titulo: 'El alto riesgo', nodos: [
                { fuente: '#nep-hnf', etiqueta: 'HNF 80 U/kg + 18 U/kg/h por peso real', color: 'dorado' },
                { fuente: '#nep-trombolisis', etiqueta: 'tPA 100 mg en 2 h, si no hay contraindicación', color: 'rojo' },
                { fuente: '#nep-trombectomia', etiqueta: 'Si falla o no se puede: trombectomía', color: 'purpura' },
                { fuente: '#nep-hemodinamica', etiqueta: 'Fluidos ≤500 mL con eco; noradrenalina', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Filtros de vena cava', grupos: [{ titulo: 'Cuándo y cómo', color: 'gris', nodos: ['#nep-filtro-indicaciones', '#nep-filtro-experiencia'] }] },
            LAMINAS
        ]
    }
};

const TODAS = { ...RECETAS, ...RECETAS_3D_G1, ...RECETAS_3D_G2, ...RECETAS_3D_G2B, ...RECETAS_3D_G3, ...RECETAS_3D_G4, ...RECETAS_3D_G5 };

export function init() {
    for (const [ficha, receta] of Object.entries(TODAS)) montarVisual(ficha, receta);
}
