// Vista Visual de Terapias de reemplazo renal (Nefrología): recetas para
// core/visual-kit.js. Las seis fichas siguen las preguntas del artículo
// fuente (qué, a quién, cuándo, cuánto, cómo, hasta cuándo).
import { montarVisual } from '../../core/visual-kit.js';

export function initVisualTrr() {
    montarVisual('trr-modalidad', {
        guia: 'Tres familias de TRR y por qué ninguna ha demostrado ser mejor.',
        paneles: [
            { tipo: 'racimos', titulo: 'Las 3 familias (tabla)', tabla: 0, color: 'dorado' },
            { tipo: 'comparar', titulo: 'Ventajas e inconvenientes', columnas: [
                { titulo: 'Continua', color: 'verde', nodos: ['TRR continua'] },
                { titulo: 'Intermitente', color: 'amarillo', nodos: ['Hemodiálisis intermitente'] }
            ] },
            { tipo: 'racimos', titulo: 'Contexto', grupos: [
                { titulo: 'Contexto', color: 'purpura', nodos: ['Magnitud del problema', 'Factores de riesgo para necesitar TRR', 'Cambio de paradigma', 'Angiotensina II como estrategia futura'] }
            ] }
        ]
    });

    montarVisual('trr-indicaciones', {
        guia: 'No es una cifra de creatinina: son tres pilares clínicos.',
        paneles: [
            { tipo: 'flujo', titulo: 'Los 3 pilares de la indicación', nodos: [
                { fuente: 'Base de la indicación', color: 'gris' },
                [{ fuente: 'Es frecuente que pacientes no oligúricos', etiqueta: 'Sobrecarga de volumen', color: 'dorado' },
                 { fuente: 'Los 3 pilares clásicos de la indicación', etiqueta: 'Iones y ácido-base', color: 'rojo' },
                 { fuente: 'El uso de la TRR está indicado para paliar', etiqueta: 'Síntomas urémicos', color: 'purpura' }]
            ] },
            { tipo: 'racimos', titulo: 'Umbrales orientativos (tabla)', tabla: 0, color: 'rojo' },
            { tipo: 'racimos', titulo: 'Controvertido', grupos: [
                { titulo: 'Sepsis', color: 'amarillo', nodos: [{ fuente: 'Diversos estudios proponen la TRR continua', etiqueta: 'TRR continua en la sepsis' }] }
            ] }
        ]
    });

    montarVisual('trr-inicio', {
        guia: 'Precoz o diferido: lo que dicen los ensayos.',
        paneles: [
            { tipo: 'comparar', titulo: 'La decisión', columnas: [
                { titulo: 'Sin protocolo', color: 'gris', nodos: ['Sin protocolo unívoco', 'Propuestas de algoritmo'] },
                { titulo: 'Riesgos del inicio precoz', color: 'rojo', nodos: ['Riesgos a sopesar del inicio precoz'] }
            ] },
            { tipo: 'racimos', titulo: 'Ensayos de inicio precoz frente a diferido (tabla 3)', tabla: 0, color: 'purpura' }
        ]
    });

    montarVisual('trr-dosis', {
        guia: 'Más dosis no es mejor: los ensayos y los subgrupos con posible beneficio.',
        paneles: [
            { tipo: 'racimos', titulo: 'Ensayos de intensidad de dosis (tabla 4)', tabla: 0, color: 'purpura' },
            { tipo: 'racimos', titulo: 'Subgrupos con posible beneficio', grupos: [
                { titulo: 'Subgrupos', color: 'verde', nodos: ['Pacientes posquirúrg', 'Insuficiencia hepáti', 'Lesión cerebral', 'Quemados con shock'] }
            ] }
        ]
    });

    montarVisual('trr-anticoagulacion', {
        guia: 'Que no se coagule el circuito: heparina o citrato.',
        paneles: [
            { tipo: 'flujo', titulo: 'El problema y cómo reducirlo', nodos: [
                { fuente: 'El problema', color: 'rojo' },
                { fuente: 'Estrategias para minimizar el riesgo', color: 'amarillo' }
            ] },
            { tipo: 'racimos', titulo: 'Heparina frente a citrato (tabla 5)', tabla: 0, color: 'dorado' },
            { tipo: 'racimos', titulo: 'Citrato', grupos: [
                { titulo: 'Citrato', color: 'verde', nodos: ['Mecanismo del citrato', 'Monitores dedicados'] }
            ] }
        ]
    });

    montarVisual('trr-finalizacion', {
        guia: 'Hasta cuándo: la diuresis manda.',
        paneles: [
            { tipo: 'flujo', titulo: 'De la TRR a la recuperación', nodos: [
                { fuente: 'Criterio fundamental', color: 'verde' },
                { fuente: 'Papel de la HD extendida como puente', color: 'amarillo' },
                [{ fuente: 'Movilización precoz', color: 'dorado' }, { fuente: 'Información al paciente', color: 'purpura' }]
            ] }
        ]
    });
}
