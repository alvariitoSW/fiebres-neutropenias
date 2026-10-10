// Vista Visual de Hipertensión arterial (Nefrología): recetas para
// core/visual-kit.js. Cada nodo apunta a una línea de la ficha; las tablas se
// dibujan leyendo sus celdas.
import { montarVisual } from '../../core/visual-kit.js';
import { montarGlomerulo } from './glomerulo-vivo.js';

export function initVisualHta() {
    montarVisual('hta-definicion', {
        guia: 'Dónde empieza la HTA, cómo se confirma fuera de la consulta y qué hacer en cada escalón.',
        paneles: [
            { tipo: 'escalera', titulo: 'Clasificación de la PA (ESC/ESH)', tabla: 0, excluir: ['HTA sistólica'] },
            { tipo: 'barras', titulo: 'Umbral de HTA según dónde se mida', nota: 'Tabla de la ficha, dibujada: fuera de la consulta el umbral es más bajo.',
              tabla: 2, series: [{ col: 1, nombre: 'PAS', color: 'rojo' }, { col: 3, nombre: 'PAD', color: 'dorado' }] },
            { tipo: 'matriz', titulo: 'Los 4 fenotipos (consulta × ambulatoria)', tabla: 3, normales: ['normotensión'], leyenda: ['normotensión', 'HTA en alguna medida'] },
            { tipo: 'flujo', titulo: 'Qué hacer según la cifra', nodos: [
                { fuente: 'PA óptima (<120/80)', color: 'verde' },
                { fuente: 'PA normal (120-129', color: 'verde' },
                { fuente: 'PA normal-alta', color: 'amarillo' },
                { fuente: 'HTA (≥140/90)', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'De dónde viene', grupos: [
                { titulo: 'Causas', color: 'purpura', nodos: ['HTA esencial', 'HTA secundaria', 'Formas monogénicas'] }
            ] }
        ]
    });

    montarVisual('hta-evaluacion', {
        guia: 'Dónde mirar el daño, cuándo sospechar una causa y en qué riesgo queda el paciente.',
        paneles: [
            { tipo: 'mapa', titulo: 'Lesión de órgano diana', nodos: [
                { fuente: 'Cerebro y ojos', organo: 'cabeza' },
                { fuente: 'Corazón', organo: 'corazon' },
                { fuente: 'Riñón', organo: 'rinon' },
                { fuente: 'Arterias periféricas', organo: 'piernaIzda' }
            ] },
            { tipo: 'escalera', titulo: 'Categoría de riesgo cardiovascular', nodos: [
                { fuente: 'Riesgo bajo', color: 'verde' }, { fuente: 'Riesgo moderado', color: 'amarillo' },
                { fuente: 'Riesgo alto', color: 'rojo' }, { fuente: 'Riesgo muy alto', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Cómo se estratifica', grupos: [
                { titulo: 'Escalas', color: 'dorado', nodos: ['ASCVD', 'SCORE', 'HMOD'] },
                { titulo: 'Qué cuenta (tabla)', color: 'amarillo', tabla: 7 }
            ] },
            { tipo: 'racimos', titulo: 'Pistas de HTA secundaria (tabla)', tabla: 6, color: 'rojo' },
            { tipo: 'racimos', titulo: 'Exploraciones complementarias', tabla: 5, color: 'verde' }
        ]
    });

    montarVisual('hta-tratamiento-general', {
        guia: 'Cuándo empezar, hasta dónde bajar y qué cambia el estilo de vida.',
        paneles: [
            { tipo: 'racimos', titulo: 'Cuándo empezar el tratamiento (tabla)', tabla: 0, color: 'amarillo' },
            { tipo: 'comparar', titulo: 'Objetivo de control', columnas: [
                { titulo: 'ACC/AHA', color: 'rojo', nodos: [{ fuente: 'ACC/AHA', etiqueta: '<130/80 para todos' }] },
                { titulo: 'ESC/ESH', color: 'dorado', nodos: [{ fuente: 'ESC/ESH', etiqueta: 'Individualizado por edad' }] }
            ] },
            { tipo: 'racimos', titulo: 'Objetivos por edad (ESC/ESH)', tabla: 1, color: 'dorado' },
            { tipo: 'racimos', titulo: 'Estilo de vida', tabla: 2, color: 'verde' }
        ]
    });

    montarVisual('hta-tratamiento-farmaco', {
        guia: 'La escalera de combinaciones y cuándo se cambia por la comorbilidad.',
        paneles: [
            { tipo: 'escalera', titulo: 'Estrategia en la HTA no complicada', tabla: 2 },
            { tipo: 'racimos', titulo: 'Si hay comorbilidad', grupos: [
                { titulo: 'HTA +', color: 'rojo', nodos: [
                    { fuente: 'HTA + cardiopatía isquémica', etiqueta: 'Cardiopatía isquémica' },
                    { fuente: 'HTA + enfermedad renal crónica', etiqueta: 'ERC' },
                    { fuente: 'HTA + insuficiencia cardíaca', etiqueta: 'IC con FE reducida' },
                    { fuente: 'HTA + fibrilación auricular', etiqueta: 'Fibrilación auricular' }] }
            ] },
            { tipo: 'racimos', titulo: 'Cada grupo: indicaciones y contraindicaciones (tabla)', tabla: 0, color: 'dorado' },
            { tipo: 'racimos', titulo: 'Fármacos y dosis (tabla)', tabla: 1, color: 'purpura' },
            { tipo: 'flujo', titulo: 'Combinación desde el inicio', tabla: 3, color: 'verde' }
        ]
    });

    montarVisual('hta-resistente', {
        guia: 'Antes de llamarla resistente, descarta la falsa; después, el orden de los pasos.',
        paneles: [
            { tipo: 'escalera', titulo: 'De difícil a refractaria', nodos: [
                { fuente: 'Definición clásica', color: 'amarillo' },
                { fuente: 'Definición ampliada', color: 'rojo' },
                { fuente: 'HTA refractaria', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Descartar la pseudorresistencia', grupos: [
                { titulo: 'Causas de falsa resistencia', color: 'amarillo', nodos: ['Cumplimiento terapéutico', 'Fenómeno de bata blanca', 'Técnica inadecuada de medida', 'Pseudohipertensión', 'Inercia clínica', 'Otras situaciones asociadas'] }
            ] },
            { tipo: 'flujo', titulo: 'Proceso diagnóstico y terapéutico', nodos: [
                ['1', 'Sospecha clínica'], ['2', 'Confirmar con MAPA o AMPA'], ['3', 'Cumplimiento'], ['4', 'Fármacos que interfieren'],
                ['5', 'Sobrepeso u obesidad'], ['6', 'Causas secundarias'], ['7', 'Optimizar el tratamiento']
            ].map(([n, e]) => ({ fuente: n, etiqueta: `${n}. ${e}`, color: 'dorado' })) },
            { tipo: 'flujo', titulo: 'Tratamiento escalonado', nodos: [
                { fuente: 'Cambios de estilo de vida', color: 'verde' },
                { fuente: 'Esquema farmacológico de partida', color: 'amarillo' },
                { fuente: 'Siguiente paso: antialdosterónicos', color: 'rojo' },
                { fuente: 'Pasos posteriores', color: 'purpura' },
                [{ fuente: 'Denervación simpática renal', color: 'gris' }, { fuente: 'Estimulación de barorreceptores', color: 'gris' }]
            ] },
            { tipo: 'racimos', titulo: 'Prevalencia según la fuente (tabla)', tabla: 0, color: 'rojo' }
        ]
    });

    montarVisual('hta-secundaria-renal', {
        guia: 'Cuánto pesa la causa secundaria por edad y cómo una estenosis renal sube la PA.',
        paneles: [
            { tipo: 'propio', titulo: 'Glomérulo vivo: detrás de la estenosis', nota: 'Estenosis bilateral o sobre riñón único. Activa el IECA/ARA-II y mira qué pasa con el filtrado.',
              render: (c, x) => montarGlomerulo(c, x, { mandos: ['estenosis', 'ieca'], inicial: { estenosis: true },
                textos: { estenosis: 'g-t-volumen', 'ieca-menos30': 'g-t-volumen', 'ieca-mas30': 'g-t-volumen' } }) },
            { tipo: 'barras', titulo: 'HTA secundaria por grupo de edad', nota: 'Tabla de la ficha: barra = límite inferior del rango.',
              tabla: 0, series: [{ col: 1, nombre: 'Prevalencia', color: 'rojo' }] },
            { tipo: 'flujo', titulo: 'Cómo una estenosis renal sube la PA', nodos: [
                { fuente: 'Mecanismo básico', color: 'amarillo' },
                { fuente: 'Cascada del SRAA', color: 'rojo' },
                [{ fuente: 'Fase renina-dependiente', color: 'rojo' }, { fuente: 'Fase volumen-dependiente', color: 'purpura' }],
                { fuente: 'Modelo de Goldblatt', color: 'gris' }
            ] },
            { tipo: 'racimos', titulo: 'Cuándo sospechar una ERV (tabla)', tabla: 3, color: 'amarillo' },
            { tipo: 'flujo', titulo: 'Diagnóstico por imagen', nodos: [
                { fuente: 'Ecografía Doppler renal', color: 'verde' },
                { fuente: 'AngioTC / angioRM', color: 'dorado' },
                { fuente: 'Angiografía por sustracción digital', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Tratamiento', grupos: [
                { titulo: 'Opciones', color: 'verde', nodos: ['Tratamiento médico', 'Angioplastia transluminal percutánea', 'Revascularización quirúrgica'] },
                { titulo: 'Evidencia y criterios', color: 'purpura', nodos: ['Ensayos aleatorizados', 'Criterios de uso apropiado'] },
                { titulo: 'Predictores de respuesta (tabla)', color: 'dorado', tabla: 6 }
            ] }
        ]
    });

    montarVisual('hta-secundaria-endocrina', {
        guia: 'Seis causas endocrinas, cada una con su clínica, su prueba y su tratamiento.',
        paneles: [
            { tipo: 'racimos', titulo: 'Causa por causa', grupos: [
                { titulo: 'Hiperaldosteronismo primario', color: 'rojo', nodos: [
                    { fuente: 'Qué es', etiqueta: 'Qué es' }, { fuente: 'Clínica' }, 'Cuándo descartarlo', 'Cribado y confirmación', 'Localización del subtipo',
                    { fuente: 'Tratamiento', tras: 'Localización del subtipo' }] },
                { titulo: 'Feocromocitoma y paraganglioma', color: 'purpura', nodos: [
                    'Qué son', { fuente: 'Clínica', tras: 'Qué son' }, { fuente: 'Diagnóstico', tras: 'Qué son' }, { fuente: 'Tratamiento', tras: 'Qué son' }] },
                { titulo: 'Síndrome de Cushing', color: 'amarillo', nodos: [
                    { fuente: 'Qué es', tras: 'Síndrome de Cushing' }, { fuente: 'Clínica', tras: 'Síndrome de Cushing' }, { fuente: 'Diagnóstico', tras: 'Síndrome de Cushing' }, { fuente: 'Tratamiento', tras: 'Síndrome de Cushing' }] },
                { titulo: 'Tiroides', color: 'dorado', nodos: [
                    { fuente: 'Prevalencia', tras: 'Hipertiroidismo e hipotiroidismo' }, { fuente: 'Hipertiroidismo', tras: 'Hipertiroidismo e hipotiroidismo' }, 'Hipotiroidismo', { fuente: 'Diagnóstico y tratamiento', tras: 'Hipertiroidismo e hipotiroidismo' }] },
                { titulo: 'Hiperparatiroidismo primario', color: 'verde', nodos: [
                    { fuente: 'Qué es', tras: 'Hiperparatiroidismo primario' }, { fuente: 'Clínica', tras: 'Hiperparatiroidismo primario' }, { fuente: 'Diagnóstico', tras: 'Hiperparatiroidismo primario' }, { fuente: 'Tratamiento', tras: 'Hiperparatiroidismo primario' }] },
                { titulo: 'Acromegalia', color: 'gris', nodos: [
                    { fuente: 'Qué es', tras: 'Acromegalia' }, { fuente: 'Clínica', tras: 'Acromegalia' }, { fuente: 'Diagnóstico', tras: 'Acromegalia' }] }
            ] }
        ]
    });

    montarVisual('hta-secundaria-otras', {
        guia: 'Apnea del sueño, coartación, fármacos y formas genéticas.',
        paneles: [
            { tipo: 'racimos', titulo: 'SAHS y coartación', grupos: [
                { titulo: 'Apnea-hipopnea del sueño', color: 'dorado', nodos: ['Relevancia', 'Mecanismo', 'Clínica', 'Diagnóstico', 'Tratamiento'] },
                { titulo: 'Coartación de aorta', color: 'rojo', nodos: [
                    { fuente: 'Qué es', tras: 'Coartación de aorta' }, 'Fisiopatología', { fuente: 'Clínica', tras: 'Coartación de aorta' }, { fuente: 'Diagnóstico y tratamiento', tras: 'Coartación de aorta' }] }
            ] },
            { tipo: 'racimos', titulo: 'Fármacos y tóxicos que suben la PA (tabla)', tabla: 0, color: 'amarillo' },
            { tipo: 'racimos', titulo: 'Causas monogénicas (tabla)', tabla: 1, color: 'purpura' }
        ]
    });
}
