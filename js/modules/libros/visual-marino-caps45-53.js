// Vista Visual de Libros · Marino, caps. 45-53 (neurología; nutrición y
// endocrino; tóxicos y apéndices): recetas para core/visual-kit.js. Mismo
// criterio que el resto de Libros: figuras primero, nodos que apuntan a
// líneas reales de la ficha (por su id) y calculadoras conectadas, nunca
// copiadas.
import { montarVisual } from '../../core/visual-kit.js';
import { asistenteVisual } from './visual-marino-piezas.js';
import { caraGlasgow, bolsaVisual, escaleraTiamina, nomogramaVivo, alcalinizacion, caidaCohb, lineaFomepizol, matrizAntidotos } from './visual-marino-piezas-45-53.js';
import { SE_WIZARD, CAM_WIZARD } from './marino-neuro.js';
import { NAL_WIZARD } from './marino-toxicos.js';

const FIGURAS = { tipo: 'figuras', titulo: 'Las figuras del libro', nota: 'Desliza para verlas; tócalas para ampliarlas.', todas: true };
const calc = (titulo, campos, resultado, nota) => ({ tipo: 'calculadora', titulo, campos, resultado, ...(nota ? { nota } : {}) });
const n = (fuente, etiqueta, color) => ({ fuente, etiqueta, ...(color ? { color } : {}) });
const racimo = (titulo, color, nodos) => ({ titulo, color, nodos });

function neuro() {
    // ---- Cap. 45 ----
    montarVisual('mn-consciencia', {
        guia: 'Despertar y conciencia: los estados se ordenan por lo que se pierde.',
        paneles: [
            FIGURAS,
            { tipo: 'comparar', titulo: 'Los dos componentes (Tabla 45.1)', columnas: [
                { titulo: 'Despierta y consciente', color: 'verde', nodos: [n('#mn-cons-ansiedad', 'Ansiedad y letargia'), n('#mn-cons-lockedin', 'Enclaustramiento')] },
                { titulo: 'Despierta, no consciente', color: 'amarillo', nodos: [n('#mn-cons-delirio', 'Delirio y demencia'), n('#mn-cons-psicosis', 'Psicosis'), n('#mn-cons-estupor', 'Estupor'), n('#mn-cons-vegetativo', 'Estado vegetativo')] },
                { titulo: 'Ni despierta ni consciente', color: 'rojo', nodos: [n('#mn-cons-coma', 'Coma'), n('#mn-cons-muerte', 'Muerte encefálica')] }
            ] },
            { tipo: 'racimos', titulo: 'Bases', grupos: [racimo('Componentes', 'purpura', [n('#mn-cons-despertar', 'Despertar'), n('#mn-cons-conciencia', 'Conciencia'), n('#mn-cons-causas', 'Causas en la UCI')])] }
        ]
    });
    montarVisual('mn-delirio', {
        guia: 'Detectarlo con el CAM-ICU, evitar lo que lo provoca y elegir el fármaco.',
        paneles: [
            FIGURAS,
            asistenteVisual('CAM-ICU paso a paso (Apéndice 2)', 'mn-cam-wiz', CAM_WIZARD, 'mn-cam-calc'),
            calc('CAM-ICU (calculadora de la ficha)', ['#mn-cam-1', '#mn-cam-2', '#mn-cam-3', '#mn-cam-4'], ['#mn-cam-resultado'], 'Delirio = I + II + (III o IV).'),
            { tipo: 'comparar', titulo: 'No confundirlo', columnas: [
                { titulo: 'Delirio', color: 'rojo', nodos: [n('#mn-del-tipos', 'Hiperactivo, hipoactivo, mixto'), n('#mn-del-causas', 'Causas')] },
                { titulo: 'Diferencial', color: 'dorado', nodos: [n('#mn-del-demencia', 'Frente a demencia'), n('#mn-del-psicosis', 'Frente a psicosis')] }
            ] },
            calc('Dexmedetomidina (calculadora de la ficha)', ['#mn-dex-peso'], ['#mn-dex-resultado']),
            { tipo: 'racimos', titulo: 'Prevenir', grupos: [racimo('Medidas', 'verde', [n('#mn-del-sedacion', 'Sedación'), n('#mn-del-prevencion', 'Prevención')])] }
        ]
    });
    montarVisual('mn-abstinencia', {
        guia: 'Qué aparece y cuándo, desde la última copa (Tabla 45.3).',
        paneles: [
            { tipo: 'linea', titulo: 'Desde la última copa', min: 0, max: 96, unidad: 'horas', ticks: [0, 12, 24, 48, 72, 96],
                bandas: [{ desde: 6, hasta: 48, texto: 'Convulsiones', color: 'amarillo' }, { desde: 48, hasta: 96, texto: 'Delirium tremens', color: 'rojo', alinear: 'fin' }],
                nodos: [
                    { fuente: 'css:#mn-tabla-45-3 tbody tr:nth-child(1)', etiqueta: 'Precoz (6-8 h)', en: 7, color: 'dorado', fila: 'abajo' },
                    { fuente: 'css:#mn-tabla-45-3 tbody tr:nth-child(3)', etiqueta: 'Alucinaciones (12-48 h)', en: 24, color: 'purpura', fila: 'abajo' },
                    { fuente: '#mn-oh-dt', etiqueta: 'Delirium tremens (48-96 h)', en: 60, color: 'rojo', fila: 'abajo' }
                ] },
            calc('¿Qué esperar ahora? (calculadora de la ficha)', ['#mn-oh-horas'], ['#mn-oh-resultado'], 'Origen: ilustrativo. Cada rasgo cuenta desde su inicio más temprano hasta su inicio más tardío + su duración máxima (Tabla 45.3); la tabla no da esta ventana.'),
            { tipo: 'flujo', titulo: 'Tratamiento', nodos: [n('#mn-oh-bzd', 'Benzodiacepinas', 'verde'), n('#mn-oh-uci', 'En la UCI', 'amarillo'), [n('#mn-oh-propofol', 'Propofol', 'purpura'), n('#mn-oh-fenobarbital', 'Fenobarbital', 'purpura'), n('#mn-oh-dex', 'Dexmedetomidina', 'purpura')]] },
            calc('Lorazepam y propilenglicol (calculadora de la ficha)', ['#mn-lzp-peso', '#mn-lzp-ritmo', '#mn-lzp-horas'], ['#mn-lzp-resultado']),
            { tipo: 'racimos', titulo: 'No olvidar', grupos: [racimo('Otras', 'rojo', [n('#mn-oh-wernicke', 'Wernicke'), n('#mn-oh-gabapentina', 'Gabapentina')])] }
        ]
    });
    montarVisual('mn-coma', {
        guia: 'Pupilas, reflejos del tronco y Glasgow.',
        paneles: [
            FIGURAS,
            caraGlasgow,
            calc('Glasgow (calculadora de la ficha)', ['#mn-gcs-o', '#mn-gcs-v', '#mn-gcs-m', '#mn-gcs-contexto'], ['#mn-gcs-resultado']),
            { tipo: 'comparar', titulo: 'Reflejos del tronco', columnas: [
                { titulo: 'Oculocefálico', color: 'amarillo', nodos: [n('#mn-coma-oculocefalico', 'Ojos de muñeca')] },
                { titulo: 'Oculovestibular', color: 'purpura', nodos: [n('#mn-coma-oculovestibular', 'Pruebas calóricas')] }
            ] },
            { tipo: 'racimos', titulo: 'Explorar', grupos: [racimo('Exploración', 'verde', [n('#mn-coma-motor', 'Movimientos'), n('#mn-coma-dolor', 'Respuesta al dolor'), n('#mn-coma-ojos', 'Apertura ocular'), n('#mn-coma-motilidad', 'Motilidad ocular')])] }
        ]
    });
    montarVisual('mn-muerte-encefalica', {
        guia: 'Los 5 pasos de la lista de comprobación y el test de apnea.',
        paneles: [
            { tipo: 'requisitos', modo: 'todos', titulo: 'Pasos 1-4 de la lista de comprobación (Tabla 45.6)', puerta: 'Pasos 1-4 confirmados', items: [{ checks: '.mn-me-pre' }, { checks: '.mn-me-causa' }, { checks: '.mn-me-tronco' }, { checks: '.mn-me-apnea' }], resultado: ['#mn-me-resultado'] },
            { tipo: 'requisitos', modo: 'todos', titulo: 'Paso 5 · Prueba confirmatoria (solo si los pasos 1-4 no se pueden completar o interpretar)', puerta: 'Con ella positiva también se puede declarar la muerte', items: [{ checks: '#mn-me-confirmatoria' }], resultado: ['#mn-me-resultado'], nota: 'Es la vía alternativa de la tabla: «pasos 1-4 confirmados, o prueba confirmatoria positiva».' },
            calc('Test de apnea (calculadora de la ficha)', ['#mn-apnea-basal', '#mn-apnea-final', '#mn-apnea-esfuerzo'], ['#mn-apnea-resultado']),
            { tipo: 'racimos', titulo: 'Matices', grupos: [racimo('Requisitos', 'dorado', [n('#mn-me-pam', 'PAM ≥75'), n('#mn-me-farmacos', 'Depresores'), n('#mn-me-ttm', 'Tras temperatura')]), racimo('Otros', 'purpura', [n('#mn-me-lazaro', 'Signo de Lázaro'), n('#mn-me-confirmatorias', 'Pruebas confirmatorias')])] }
        ]
    });

    // ---- Cap. 46 ----
    montarVisual('mn-convulsiones', {
        guia: 'Tipos de crisis y cuándo es un estado epiléptico.',
        paneles: [
            { tipo: 'racimos', titulo: 'Las crisis', grupos: [racimo('Tipos', 'amarillo', [n('#mn-conv-movimientos', 'Movimientos'), n('#mn-conv-generalizadas', 'Generalizadas o focales'), n('#mn-conv-parciales', 'Parciales complejas')]), racimo('Estado epiléptico', 'rojo', [n('#mn-conv-se', 'Definición'), n('#mn-conv-eeg', 'No convulsivo: EEG')])] }
        ]
    });
    montarVisual('mn-estado-epileptico', {
        guia: 'Tres pasos; intubar antes del tercero.',
        paneles: [
            asistenteVisual('El estado epiléptico, paso a paso', 'mn-se-wizard', SE_WIZARD, 'mn-se-wizard'),
            calc('Dosis por peso (calculadora de la ficha)', ['#mn-se-peso'], ['#mn-se-resultado']),
            { tipo: 'escalera', titulo: 'Los tres pasos', nodos: [
                n('#mn-se-lorazepam', 'Paso 1 · Lorazepam', 'verde'),
                n('#mn-se-levetiracetam', 'Paso 2 · Levetiracetam (o fosfenitoína, valproico)', 'amarillo'),
                n('#mn-se-refractario', 'Paso 3 · Refractario: anestésicos', 'rojo')
            ] }
        ]
    });
    montarVisual('mn-miastenia', {
        guia: 'Qué la empeora y cuándo intubar.',
        paneles: [
            FIGURAS,
            { tipo: 'selector', titulo: '¿Puede empeorarla este fármaco? (Tabla 46.5)', control: '#mn-mg-farmaco', forma: 'chips', color: 'rojo', resultado: ['#mn-mg-farmaco-resultado'], nota: 'La tabla solo nombra las familias; los ejemplos concretos de los botones son conocimiento general, no de la fuente.' },
            calc('¿Pensar en intubar? (calculadora de la ficha)', ['#mn-mg-peso', '#mn-mg-cv', '#mn-mg-pim'], ['#mn-mg-resultado']),
            { tipo: 'flujo', titulo: 'Crisis miasténica', nodos: [n('#mn-mg-crisis', 'Plasmaféresis o IgIV', 'rojo'), [n('#mn-mg-piridostigmina', 'Piridostigmina', 'amarillo'), n('#mn-mg-corticoides', 'Corticoides', 'amarillo')], n('#mn-mg-pronostico', 'Pronóstico', 'verde')] }
        ]
    });
    montarVisual('mn-gbs-pnc', {
        guia: 'Guillain-Barré frente a miastenia, y la debilidad del crítico.',
        paneles: [
            calc('¿Miastenia o Guillain-Barré? (calculadora de la ficha)', ['#mn-gm-ocular', '#mn-gm-fatiga', '#mn-gm-reflejos', '#mn-gm-autonomica', '#mn-gm-conduccion', '#mn-gm-lcr'], ['#mn-gm-resultado']),
            { tipo: 'comparar', titulo: 'La debilidad del crítico', columnas: [
                { titulo: 'Guillain-Barré', color: 'amarillo', nodos: [n('#mn-gbs-clinica', 'Clínica'), n('#mn-gbs-tratamiento', 'Tratamiento'), n('#mn-gbs-dolor', 'Dolor')] },
                { titulo: 'Neuromiopatía', color: 'rojo', nodos: [n('#mn-pnc-pnc', 'Polineuropatía'), n('#mn-pnc-mcc', 'Miopatía'), n('#mn-pnc-manejo', 'Tratamiento')] }
            ] }
        ]
    });
    montarVisual('mn-relajantes', {
        guia: 'Tres relajantes, cómo vigilarlos y cómo revertirlos.',
        paneles: [
            calc('Dosis y reversión (calculadora de la ficha)', ['#mn-bnm-peso', '#mn-bnm-contra', '#mn-bnm-profundidad'], ['#mn-bnm-resultado']),
            { tipo: 'comparar', titulo: 'Los relajantes (Tabla 46.7)', columnas: [
                { titulo: 'Despolarizante', color: 'rojo', nodos: [n('#mn-bnm-succi', 'Succinilcolina')] },
                { titulo: 'No despolarizantes', color: 'verde', nodos: [n('#mn-bnm-rocuronio', 'Rocuronio'), n('#mn-bnm-cisatracurio', 'Cisatracurio')] }
            ] },
            { tipo: 'flujo', titulo: 'Vigilar y revertir', nodos: [n('#mn-bnm-monitor', 'Tren de cuatro', 'dorado'), [n('#mn-bnm-neostigmina', 'Neostigmina', 'amarillo'), n('#mn-bnm-sugammadex', 'Sugammadex', 'verde')]] }
        ]
    });

    // ---- Cap. 47 ----
    montarVisual('mn-ictus-soporte', {
        guia: 'Oxígeno, presión, glucosa y fiebre en el ictus isquémico.',
        paneles: [
            calc('¿Y la SaO₂? (calculadora de la ficha)', ['#mn-o2-sat', '#mn-o2-lleva'], ['#mn-o2-resultado']),
            calc('¿Bajo la presión? (calculadora de la ficha)', ['#mn-pa-escenario', '#mn-pa-pas', '#mn-pa-pad', '#mn-pa-ic'], ['#mn-pa-resultado']),
            { tipo: 'racimos', titulo: 'Medidas generales (Tabla 47.1)', grupos: [racimo('Cuidar', 'verde', [n('#mn-isq-oxigeno', 'Oxígeno'), n('#mn-isq-hta', 'Por qué no bajar la PA'), n('#mn-isq-hipotension', 'Hipotensión'), n('#mn-isq-glucemia', 'Hiperglucemia'), n('#mn-isq-fiebre', 'Fiebre')]), racimo('Evitar', 'rojo', [n('#mn-isq-evitar', 'A evitar')])] }
        ]
    });
    montarVisual('mn-ictus-complicaciones', {
        guia: 'Antitrombóticos, ecocardiograma y las complicaciones del ictus.',
        paneles: [
            FIGURAS,
            { tipo: 'linea', titulo: 'La primera semana del ictus isquémico', min: 0, max: 7, unidad: 'día', ticks: [0, 1, 2, 3, 5, 7],
                bandas: [{ desde: 0, hasta: 1, texto: 'UCI', color: 'rojo' }],
                nodos: [
                    { fuente: '#mn-isq-hemorragia', etiqueta: 'Hemorragia tras trombólisis: se retrasan 24 h anticoagulantes y antiagregantes', en: 0.3, color: 'rojo', fila: 'abajo' },
                    { fuente: '#mn-isq-tvp', etiqueta: 'Compresión neumática las primeras 24 h tras trombólisis', en: 0.8, color: 'purpura' },
                    { fuente: '#mn-isq-aspirina', etiqueta: 'Aspirina 325 mg: desde el ingreso, o el día 2 tras trombólisis', en: 1.5, color: 'verde', fila: 'abajo' },
                    { fuente: '#mn-isq-convulsiones', etiqueta: 'Crisis en la primera semana (20%)', en: 5, color: 'amarillo' }
                ] },
            { tipo: 'racimos', titulo: 'Tras el ingreso', grupos: [racimo('Prevenir', 'verde', [n('#mn-isq-tvp', 'Tromboprofilaxis'), n('#mn-isq-aspirina', 'Aspirina')]), racimo('Buscar', 'dorado', [n('#mn-isq-eco', 'Ecocardiograma'), n('#mn-isq-fop', 'Foramen oval')])] },
            { tipo: 'comparar', titulo: 'Complicaciones', columnas: [
                { titulo: 'Hemorragia', color: 'rojo', nodos: [n('#mn-isq-hemorragia', 'Riesgo'), n('#mn-isq-hemorragia-tto', 'Tratamiento')] },
                { titulo: 'Edema', color: 'purpura', nodos: [n('#mn-isq-edema', 'Tipos'), n('#mn-isq-edema-manejo', 'Manejo')] },
                { titulo: 'Convulsiones', color: 'amarillo', nodos: [n('#mn-isq-convulsiones', 'Tras el ictus')] }
            ] },
            calc('Bolo de salino hipertónico (calculadora de la ficha)', ['#mn-hiper-sol', '#mn-hiper-peso', '#mn-hiper-na'], ['#mn-hiper-resultado'])
        ]
    });
    montarVisual('mn-hic', {
        guia: 'Revertir el antitrombótico y vigilar la perfusión cerebral.',
        paneles: [
            FIGURAS,
            calc('Reversión del antitrombótico (calculadora de la ficha)', ['#mn-rev-farmaco', '#mn-rev-peso', '#mn-rev-inr', '#mn-rev-dosis', '#mn-rev-horas', '#mn-rev-andexanet'], ['#mn-rev-resultado']),
            { tipo: 'racimos', titulo: 'Revertir (Tablas 47.4 y 47.5)', grupos: [racimo('Fármacos', 'rojo', [n('#mn-hic-warfarina', 'Warfarina'), n('#mn-hic-dabigatran', 'Dabigatrán'), n('#mn-hic-andexanet', 'Anti-Xa'), n('#mn-hic-antiagregantes', 'Antiagregantes')])] },
            calc('PPC = PAM − PIC (calculadora de la ficha)', ['#mn-ppc-pam', '#mn-ppc-pic'], ['#mn-ppc-resultado']),
            { tipo: 'racimos', titulo: 'Presión intracraneal', grupos: [racimo('PIC y PPC', 'purpura', [n('#mn-hic-pic', 'Monitorizar la PIC'), n('#mn-hic-ppc', 'Objetivo de PPC')])] }
        ]
    });
    montarVisual('mn-hsa', {
        guia: 'Que no vuelva a sangrar, y vigilar la isquemia diferida.',
        paneles: [
            FIGURAS,
            { tipo: 'linea', titulo: 'Las tres primeras semanas', min: 0, max: 21, unidad: 'día', ticks: [0, 3, 7, 10, 14, 21],
                bandas: [{ desde: 0, hasta: 3, texto: 'Excluir', color: 'verde' }, { desde: 4, hasta: 14, texto: 'Isquemia diferida', color: 'rojo' }],
                nodos: [
                    { fuente: '#mn-hsa-aneurisma', etiqueta: 'Excluir el aneurisma (≤3 días)', en: 2, color: 'verde', fila: 'abajo' },
                    { fuente: '#mn-hsa-icd', etiqueta: 'Isquemia diferida (días 4-14)', en: 9, color: 'rojo', fila: 'abajo' },
                    { fuente: '#mn-hsa-nimodipino', etiqueta: 'Nimodipino 3 semanas', en: 20, color: 'dorado', fila: 'abajo' }
                ] },
            calc('¿En qué día estamos? (calculadora de la ficha)', ['#mn-nimo-dia'], ['#mn-nimo-resultado']),
            { tipo: 'racimos', titulo: 'De dónde viene el daño', grupos: [racimo('Mecanismos', 'purpura', [n('#mn-hsa-inflamacion', 'Inflamación y hierro'), n('#mn-hsa-hidrocefalia', 'Hidrocefalia'), n('#mn-hsa-organos', 'Otros órganos')])] }
        ]
    });
}

function nutricion() {
    // ---- Cap. 48 ----
    montarVisual('mu-gasto-energetico', {
        guia: 'Cuánta energía: medirla o estimarla, y empezar por debajo.',
        paneles: [
            calc('Calorías y proteínas del día (calculadora de la ficha)', ['#mu-ger-peso', '#mu-ger-ideal', '#mu-ger-metodo', '#mu-ger-dia', '#mu-ger-na'], ['#mu-ger-resultado']),
            calc('Cociente respiratorio (calculadora de la ficha)', ['#mu-cr-vo2', '#mu-cr-vco2'], ['#mu-cr-resultado']),
            { tipo: 'flujo', titulo: 'Cómo se calcula', nodos: [[n('#mu-calorimetria', 'Medirlo: calorimetría', 'verde'), n('#mu-formula', 'Estimarlo: 25 kcal/kg', 'amarillo')], n('#mu-peso-ajustado', 'Si estimas: qué peso', 'dorado'), n('#mu-espen', 'Empezar por debajo', 'rojo')] }
        ]
    });
    montarVisual('mu-sustratos', {
        guia: 'Primero las calorías no proteicas; después la proteína.',
        paneles: [
            FIGURAS,
            calc('Balance nitrogenado (calculadora de la ficha)', ['#mu-bn-prot', '#mu-bn-nuu', '#mu-bn-diarrea'], ['#mu-bn-resultado']),
            { tipo: 'racimos', titulo: 'Los tres sustratos', grupos: [racimo('Hidratos', 'amarillo', [n('#mu-hc', 'Cuánto'), n('#mu-hc-techo', 'Techo')]), racimo('Lípidos', 'dorado', [n('#mu-lipidos', 'Cuánto'), n('#mu-propofol', 'Propofol'), n('#mu-lipidos-exceso', 'Exceso')]), racimo('Proteínas', 'verde', [n('#mu-proteinas', 'Cuánto'), n('#mu-bn-calorias', 'Primero las calorías')])] }
        ]
    });
    montarVisual('mu-tiamina', {
        guia: 'Quién está en riesgo, cómo se manifiesta y la pauta.',
        paneles: [
            FIGURAS,
            { tipo: 'requisitos', modo: 'ninguno', sinPuerta: true, iconoMarcado: '☑', titulo: '¿Sospecho déficit? (Tabla 48.4)', items: [{ checks: '.mu-tia-pre' }, { checks: '.mu-tia-man' }], resultado: ['#mu-tia-resultado'] },
            escaleraTiamina,
            { tipo: 'racimos', titulo: 'Manifestaciones', grupos: [racimo('Clínica', 'rojo', [n('#mu-tia-corazon', 'Beriberi húmedo'), n('#mu-tia-wernicke', 'Wernicke'), n('#mu-tia-lactato', 'Acidosis láctica'), n('#mu-tia-neuropatia', 'Neuropatía')]), racimo('Diagnóstico y tratamiento', 'verde', [n('#mu-tia-lab', 'Laboratorio'), n('#mu-tia-rm', 'Resonancia'), n('#mu-tia-tto', 'La dosis importa')])] }
        ]
    });
    montarVisual('mu-vitaminas-oligo', {
        guia: 'Vitamina D, antioxidantes, hierro y selenio, y por qué alimentar puede dañar.',
        paneles: [
            FIGURAS,
            calc('Reservas de hierro (calculadora de la ficha)', ['#mu-ferritina'], ['#mu-ferritina-resultado']),
            { tipo: 'racimos', titulo: 'Lo que falta en el crítico', grupos: [racimo('Vitaminas', 'amarillo', [n('#mu-vitd', 'Vitamina D'), n('#mu-antiox', 'C y E')]), racimo('Oligoelementos', 'dorado', [n('#mu-hierro-oxidativo', 'Hierro'), n('#mu-selenio', 'Selenio')]), racimo('Una mosca en la sopa', 'rojo', [n('#mu-glucosa-lactato', 'Glucosa → lactato')])] }
        ]
    });

    // ---- Cap. 49 ----
    montarVisual('mu-enteral-indicaciones', {
        guia: 'La vía enteral protege el intestino; las contraindicaciones son pocas.',
        paneles: [
            { tipo: 'requisitos', modo: 'ninguno', sinPuerta: true, titulo: '¿Puedo empezar la enteral? (Tabla 49.1)', items: [{ checks: '.mu-ent-ci' }], resultado: ['#mu-ent-resultado'] },
            { tipo: 'flujo', titulo: 'Por qué y cuándo', nodos: [n('#mu-ent-trofismo', 'Trofismo intestinal', 'verde'), n('#mu-ent-cuando', 'En 48 h', 'amarillo'), n('#mu-ent-vasopresor', 'Con vasopresores', 'rojo')] }
        ]
    });
    montarVisual('mu-formulas', {
        guia: 'Densidad, proteína, fibra y los añadidos de las fórmulas.',
        paneles: [
            { tipo: 'racimos', titulo: 'Qué llevan (Tabla 49.2)', grupos: [racimo('Base', 'dorado', [n('#mu-for-densidad', 'Densidad'), n('#mu-for-proteina', 'Proteína'), n('#mu-for-hc', 'Hidratos'), n('#mu-for-fibra', 'Fibra'), n('#mu-for-lipidos', 'Lípidos')]), racimo('Añadidos', 'purpura', [n('#mu-for-omega3', 'Omega-3'), n('#mu-for-arginina', 'Arginina'), n('#mu-for-glutamina', 'Glutamina'), n('#mu-for-carnitina', 'Carnitina')])] },
            calc('¿Glutamina extra? (calculadora de la ficha)', ['#mu-glut-situacion', '#mu-glut-peso'], ['#mu-glut-resultado'])
        ]
    });
    montarVisual('mu-pauta-enteral', {
        guia: 'Cuatro pasos para la pauta, y confirmar dónde está la sonda.',
        paneles: [
            FIGURAS,
            calc('Crear la pauta enteral (calculadora de la ficha)', ['#mu-pauta-peso', '#mu-pauta-formula', '#mu-pauta-prot', '#mu-pauta-propofol-ml', '#mu-pauta-fase'], ['#mu-pauta-resultado']),
            { tipo: 'flujo', titulo: 'Colocar la sonda', nodos: [n('#mu-sonda-nex', 'Cuánto meterla', 'dorado'), [n('#mu-sonda-rx', 'Radiografía', 'verde'), n('#mu-sonda-co2', 'CO₂ espirado', 'amarillo'), n('#mu-sonda-eco', 'Ecografía', 'amarillo')], n('#mu-sonda-mal', 'Mal colocada', 'rojo')] }
        ]
    });
    montarVisual('mu-complicaciones-enteral', {
        guia: 'Oclusión, aspiración y residuo, diarrea.',
        paneles: [
            calc('Residuo gástrico (calculadora de la ficha)', ['#mu-grv-ml', '#mu-grv-persiste', '#mu-grv-opiaceos'], ['#mu-grv-resultado']),
            { tipo: 'racimos', titulo: 'Las complicaciones', grupos: [racimo('Oclusión', 'dorado', [n('#mu-oclusion', 'Prevenir'), n('#mu-oclusion-pasos', 'Desatascar')]), racimo('Aspiración', 'rojo', [n('#mu-aspiracion', 'Por qué'), n('#mu-grv-recomendaciones', 'Residuo'), n('#mu-procineticos', 'Procinéticos')]), racimo('Diarrea', 'amarillo', [n('#mu-diarrea', 'Por qué'), n('#mu-diarrea-farmacos', 'Fármacos líquidos'), n('#mu-diarrea-manejo', 'Qué hacer')])] }
        ]
    });

    // ---- Cap. 50 ----
    montarVisual('mu-npt-soluciones', {
        guia: 'Glucosa, aminoácidos, lípidos y aditivos.',
        paneles: [
            { tipo: 'racimos', titulo: 'Los componentes', grupos: [racimo('Glucosa', 'amarillo', [n('#mu-npt-glucosa', 'Por qué tan concentrada')]), racimo('Aminoácidos', 'verde', [n('#mu-npt-aa', 'Soluciones'), n('#mu-npt-ramificados', 'Ramificados')]), racimo('Lípidos', 'dorado', [n('#mu-npt-lipidos', 'Qué son'), n('#mu-npt-clinolipid', 'Clinolipid'), n('#mu-npt-smoflipid', 'Smoflipid'), n('#mu-npt-omegaven', 'Omegaven')]), racimo('Aditivos', 'purpura', [n('#mu-npt-electrolitos', 'Electrolitos'), n('#mu-npt-vitaminas', 'Vitaminas')])] }
        ]
    });
    montarVisual('mu-npt-pauta', {
        guia: 'Construir la NPT en cuatro pasos.',
        paneles: [
            calc('Construir la NPT (calculadora de la ficha)', ['#mu-npt-peso', '#mu-npt-prot', '#mu-npt-lip', '#mu-npt-propofol', '#mu-npt-riesgo'], ['#mu-npt-resultado']),
            bolsaVisual,
            { tipo: 'flujo', titulo: 'Los cuatro pasos', nodos: [n('#mu-npt-paso1', 'Calorías y proteínas', 'dorado'), n('#mu-npt-paso2', 'Aminoácidos', 'verde'), n('#mu-npt-paso3', 'Lípidos y glucosa', 'amarillo'), n('#mu-npt-paso4', 'Ritmo', 'purpura')] },
            { tipo: 'racimos', titulo: 'Nutrición parenteral periférica', grupos: [racimo('NPP', 'verde', [n('#mu-npp-que', 'Qué es'), n('#mu-npp-limite', 'Límite de la vena'), n('#mu-npp-pauta', 'Pauta')])] }
        ]
    });
    montarVisual('mu-npt-complicaciones', {
        guia: 'Complicaciones metabólicas y el síndrome de realimentación.',
        paneles: [
            { tipo: 'requisitos', modo: 'ninguno', sinPuerta: true, iconoMarcado: '☑', titulo: '¿Alto riesgo de realimentación? (ASPEN)', items: [{ checks: '.mu-real-check' }], resultado: ['#mu-real-resultado'] },
            { tipo: 'racimos', titulo: 'Complicaciones', grupos: [racimo('De los hidratos', 'amarillo', [n('#mu-npt-hiperglucemia', 'Hiperglucemia'), n('#mu-npt-fosfato', 'Hipofosfatemia'), n('#mu-npt-potasio', 'Hipopotasemia'), n('#mu-npt-co2', 'Hipercapnia')]), racimo('De los lípidos', 'dorado', [n('#mu-npt-inflamacion', 'Inflamación'), n('#mu-npt-sobrecarga', 'Sobrecarga lipídica')]), racimo('Hígado', 'rojo', [n('#mu-npt-esteatosis', 'Esteatosis'), n('#mu-npt-colestasis', 'Colestasis')])] }
        ]
    });

    // ---- Cap. 51 ----
    montarVisual('mu-suprarrenal', {
        guia: 'Sospechar la CIRCI, medir el cortisol y tratar con hidrocortisona.',
        paneles: [
            FIGURAS,
            calc('Cortisol y ACTH (calculadora de la ficha)', ['#mu-cortisol-shock', '#mu-cortisol-basal', '#mu-cortisol-60'], ['#mu-cortisol-resultado']),
            calc('Equivalencia de corticoides (calculadora de la ficha)', ['#mu-equiv-de', '#mu-equiv-dosis'], ['#mu-equiv-resultado']),
            { tipo: 'flujo', titulo: 'Del eje al tratamiento', nodos: [n('#mu-sr-eje', 'El eje', 'dorado'), n('#mu-sr-sospecha', 'Sospechar', 'amarillo'), n('#mu-sr-practica', 'Cortisol aleatorio', 'verde'), n('#mu-sr-tto', 'Hidrocortisona', 'rojo')] }
        ]
    });
    montarVisual('mu-tiroides', {
        guia: 'Leer la T4 libre y la TSH; tratar la tormenta.',
        paneles: [
            calc('¿Qué patrón tiroideo es? (calculadora de la ficha)', ['#mu-ti-t4', '#mu-ti-tsh'], ['#mu-ti-resultado']),
            { tipo: 'matriz', titulo: 'Patrones tiroideos (Tabla 51.2)', tabla: '#mu-tabla-51-2', flechas: true, excluir: ['Rango normal'] },
            calc('Plan para la tirotoxicosis o la tormenta (calculadora de la ficha)', ['#mu-tor-tipo', '#mu-tor-icasma', '#mu-tor-alergia'], ['#mu-tor-resultado']),
            { tipo: 'racimos', titulo: 'Tirotoxicosis', grupos: [racimo('Clínica', 'rojo', [n('#mu-ti-clinica', 'Clínica'), n('#mu-ti-tormenta', 'Tormenta')]), racimo('Diagnóstico', 'dorado', [n('#mu-ti-dx', 'TSH'), n('#mu-ti-t3tox', 'T3-toxicosis'), n('#mu-ti-hipertiroxinemia', 'Hipertiroxinemia eutiroidea')])] }
        ]
    });
    montarVisual('mu-hipotiroidismo', {
        guia: 'El coma mixedematoso: hidrocortisona primero, luego la hormona.',
        paneles: [
            calc('Levotiroxina (calculadora de la ficha)', ['#mu-levo-situacion', '#mu-levo-peso'], ['#mu-levo-resultado']),
            { tipo: 'comparar', titulo: 'Tres situaciones', columnas: [
                { titulo: 'Hipotiroidismo', color: 'amarillo', nodos: [n('#mu-hipo-clinica', 'Clínica'), n('#mu-hipo-tto', 'Tratamiento')] },
                { titulo: 'Coma mixedematoso', color: 'rojo', nodos: [n('#mu-hipo-coma', 'Qué es'), n('#mu-hipo-coma-tto', 'Tratamiento')] },
                { titulo: 'Eutiroideo enfermo', color: 'verde', nodos: [n('#mu-hipo-eutiroideo', 'Qué es'), n('#mu-hipo-eutiroideo-tto', 'No se trata')] }
            ] }
        ]
    });
}

function toxicos() {
    // ---- Cap. 52 ----
    montarVisual('mt-paracetamol', {
        guia: 'Cómo daña, cuánto es tóxico y el nomograma.',
        paneles: [
            FIGURAS,
            calc('Nomograma (calculadora de la ficha)', ['#mt-nomo-horas', '#mt-nomo-nivel', '#mt-nomo-unidad', '#mt-nomo-tipo'], ['#mt-nomo-resultado']),
            nomogramaVivo,
            { tipo: 'flujo', titulo: 'Del paracetamol al hígado', nodos: [n('#mt-para-mecanismo', 'Cómo daña', 'dorado'), n('#mt-para-dosis', 'Dosis tóxica', 'amarillo'), n('#mt-para-riesgo', 'Más riesgo', 'rojo'), n('#mt-para-fases', 'Las fases', 'purpura')] }
        ]
    });
    montarVisual('mt-nac', {
        guia: 'La N-acetilcisteína: pauta, cuándo parar y cuándo dializar.',
        paneles: [
            calc('Dosis de NAC IV (calculadora de la ficha)', ['#mt-nac-peso', '#mt-nac-hd'], ['#mt-nac-resultado']),
            { tipo: 'requisitos', modo: 'todos', titulo: '¿Puedo parar la NAC? (Tabla 52.1)', puerta: 'Se puede parar', items: [{ checks: '.mt-parar-check' }], resultado: ['#mt-parar-resultado'] },
            { tipo: 'racimos', titulo: 'La NAC', grupos: [racimo('Uso', 'verde', [n('#mt-nac-por-que', 'Por qué funciona'), n('#mt-nac-indicacion', 'Cuándo'), n('#mt-nac-oral', 'Vía oral')]), racimo('Cuidado', 'rojo', [n('#mt-nac-adversos', 'Reacciones'), n('#mt-nac-hd-txt', 'Hemodiálisis')])] }
        ]
    });
    montarVisual('mt-bzd-betabloq', {
        guia: 'Flumazenil con cuidado; glucagón para los betabloqueantes.',
        paneles: [
            FIGURAS,
            calc('Glucagón (calculadora de la ficha)', ['#mt-glucagon-peso', '#mt-glucagon-respuesta'], ['#mt-glucagon-resultado']),
            { tipo: 'barras', titulo: 'Efectos adversos: flumazenil frente a placebo (Tabla 52.2)', tabla: '#mt-tabla-52-2', excluir: ['Pacientes'], series: [{ col: 1, nombre: 'Flumazenil', color: 'rojo' }, { col: 2, nombre: 'Placebo', color: 'verde' }] },
            { tipo: 'comparar', titulo: 'Dos intoxicaciones', columnas: [
                { titulo: 'Benzodiacepinas', color: 'purpura', nodos: [n('#mt-bzd-clinica', 'Clínica'), n('#mt-flumazenil', 'Flumazenil')] },
                { titulo: 'Betabloqueantes', color: 'rojo', nodos: [n('#mt-bb-clinica', 'Manifestaciones'), n('#mt-bb-membrana', 'Membrana'), n('#mt-glucagon-uso', 'Glucagón')] }
            ] }
        ]
    });
    montarVisual('mt-opioides', {
        guia: 'Naloxona nasal o IV, y la perfusión tras responder.',
        paneles: [
            FIGURAS,
            asistenteVisual('Naloxona IV, paso a paso', 'mt-nal-wizard', NAL_WIZARD, 'mt-nal-wizard'),
            calc('Perfusión tras responder (calculadora de la ficha)', ['#mt-nal-eficaz'], ['#mt-nal-resultado']),
            { tipo: 'comparar', titulo: 'Nasal frente a IV', columnas: [
                { titulo: 'Nasal', color: 'verde', nodos: [n('#mt-nal-nasal', 'Dosis'), n('#mt-nal-nasal-ventaja', 'Por qué')] },
                { titulo: 'IV', color: 'amarillo', nodos: [n('#mt-nal-iv', 'Dosis'), n('#mt-nal-iv-ventaja', 'Por qué')] }
            ] }
        ]
    });
    montarVisual('mt-salicilatos', {
        guia: 'La gasometría de los salicilatos y los tres tratamientos.',
        paneles: [
            calc('Salicilatos (calculadora de la ficha)', ['#mt-sal-nivel', '#mt-sal-unidad', '#mt-sal-renal', '#mt-sal-grave', '#mt-sal-peso'], ['#mt-sal-resultado']),
            { tipo: 'comparar', titulo: 'La seña de identidad', columnas: [
                { titulo: 'Alcalosis respiratoria', color: 'verde', nodos: [n('#mt-sal-alcalosis', 'Centro respiratorio')] },
                { titulo: 'Acidosis metabólica', color: 'rojo', nodos: [n('#mt-sal-acidosis', 'Hiato elevado')] }
            ] },
            alcalinizacion,
            { tipo: 'escalera', titulo: 'Tratamiento', nodos: [n('#mt-sal-carbon', 'Carbón activado', 'verde'), n('#mt-sal-alcalinizar', 'Alcalinizar la orina', 'amarillo'), n('#mt-sal-hd', 'Hemodiálisis', 'rojo')] }
        ]
    });

    // ---- Cap. 53 ----
    montarVisual('mt-co', {
        guia: 'El CO baja el contenido de O₂ y la PO₂ venosa; el pulsioxímetro engaña.',
        paneles: [
            FIGURAS,
            calc('Simulador: el CO y la PO₂ venosa (de la ficha)', ['#mt-co-sim-cohb'], ['svg#mt-co-sim-svg', '#mt-co-sim-resultado'], 'Ilustrativo, como en la Figura 53.1.'),
            calc('COHb: ¿alta? y cuánto tarda en bajar (calculadora de la ficha)', ['#mt-co-cohb', '#mt-co-fumador', '#mt-co-grave'], ['#mt-co-resultado']),
            caidaCohb,
            { tipo: 'flujo', titulo: 'Del diagnóstico al tratamiento', nodos: [n('#mt-co-umbral', 'Cooxímetro', 'dorado'), n('#mt-co-o2', 'O₂ al 100%', 'verde'), [n('#mt-co-hiperbarico', 'Hiperbárico', 'purpura'), n('#mt-co-corazon', 'El corazón', 'rojo'), n('#mt-co-cianuro', '¿Y el cianuro?', 'rojo')]] }
        ]
    });
    montarVisual('mt-cianuro', {
        guia: 'Sospecharlo tras el humo y tratarlo sin esperar.',
        paneles: [
            FIGURAS,
            calc('¿Tratar el cianuro? (calculadora de la ficha)', ['#mt-cn-inestable', '#mt-cn-lactato', '#mt-cn-parada', '#mt-cn-renal'], ['#mt-cn-resultado']),
            { tipo: 'racimos', titulo: 'Antídotos (Tabla 53.1)', grupos: [racimo('Antídotos', 'verde', [n('#mt-cn-hidroxo', 'Hidroxocobalamina'), n('#mt-cn-tiosulfato', 'Tiosulfato'), n('#mt-cn-nitritos', 'Nitritos')]), racimo('Clínica', 'rojo', [n('#mt-cn-mecanismo', 'Cómo mata'), n('#mt-cn-clinica', 'Clínica'), n('#mt-cn-dx', 'Diagnóstico')])] }
        ]
    });
    montarVisual('mt-alcoholes', {
        guia: 'Etilenglicol frente a metanol, y el fomepizol.',
        paneles: [
            FIGURAS,
            calc('Fomepizol y coadyuvantes (calculadora de la ficha)', ['#mt-fome-toxico', '#mt-fome-peso', '#mt-fome-ph', '#mt-fome-organo', '#mt-fome-vision'], ['#mt-fome-resultado']),
            lineaFomepizol,
            { tipo: 'comparar', titulo: 'Dos alcoholes', columnas: [
                { titulo: 'Etilenglicol', color: 'amarillo', nodos: [n('#mt-eg-mecanismo', 'Mecanismo'), n('#mt-eg-clinica', 'Clínica'), n('#mt-eg-cristales', 'Cristaluria')] },
                { titulo: 'Metanol', color: 'purpura', nodos: [n('#mt-met-mecanismo', 'Mecanismo'), n('#mt-met-clinica', 'Clínica'), n('#mt-met-lab', 'Laboratorio')] }
            ] },
            { tipo: 'flujo', titulo: 'Tratamiento', nodos: [n('#mt-alc-fomepizol', 'Fomepizol', 'verde'), n('#mt-alc-hd', 'Hemodiálisis', 'rojo'), n('#mt-alc-coadyuvantes', 'Coadyuvantes', 'dorado')] },
            matrizAntidotos
        ]
    });

    // ---- Apéndices ----
    montarVisual('mt-unidades', {
        guia: 'Convertir concentraciones, calibres, temperatura y presión.',
        paneles: [
            FIGURAS,
            calc('Conversor de concentraciones (calculadora de la ficha)', ['#mt-conv-soluto', '#mt-conv-valor', '#mt-conv-unidad'], ['#mt-conv-resultado']),
            calc('French ↔ milímetros (calculadora de la ficha)', ['#mt-calibre-valor', '#mt-calibre-unidad'], ['#mt-calibre-resultado']),
            calc('Temperatura y presión (calculadora de la ficha)', ['#mt-temp-valor', '#mt-temp-unidad', '#mt-pres-valor', '#mt-pres-unidad'], ['#mt-unid-resultado'])
        ]
    });
    montarVisual('mt-referencias', {
        guia: 'Radiación, IMC, PEF y volemia.',
        paneles: [
            FIGURAS,
            calc('¿Cuánta radiación lleva? (calculadora de la ficha)', ['#mt-rad-rx', '#mt-rad-tccr', '#mt-rad-tct', '#mt-rad-tca', '#mt-rad-angio'], ['#mt-rad-resultado']),
            calc('IMC (calculadora de la ficha)', ['#mt-imc-peso', '#mt-imc-talla'], ['#mt-imc-resultado']),
            calc('PEF previsto (calculadora de la ficha)', ['#mt-pef-sexo', '#mt-pef-edad', '#mt-pef-talla', '#mt-pef-medido'], ['#mt-pef-resultado']),
            calc('Volemia estimada (calculadora de la ficha)', ['#mt-volemia-sexo', '#mt-volemia-peso'], ['#mt-volemia-resultado'])
        ]
    });
    montarVisual('mt-cuerpo', {
        guia: 'Cifras del cuerpo humano, sin aplicación práctica.',
        paneles: [
            { tipo: 'racimos', titulo: 'El cuerpo fantástico', grupos: [
                racimo('Longitudes', 'dorado', [n('#mt-cuerpo-vasos', 'Vasos: 100.000 km'), n('#mt-cuerpo-vias', 'Vías aéreas: 2.500 km'), n('#mt-cuerpo-genoma', 'Genoma: 2 m'), n('#mt-cuerpo-pluton', 'Todo el ADN')]),
                racimo('Energía', 'rojo', [n('#mt-cuerpo-bombilla', 'Bombilla de 80 W'), n('#mt-cuerpo-atp', 'ATP: 80 kg al día'), n('#mt-cuerpo-hematies', '3,1 millones de hematíes/s')]),
                racimo('Información', 'purpura', [n('#mt-cuerpo-secuencias', 'Secuencias posibles'), n('#mt-cuerpo-polimerasa', 'ADN polimerasa'), n('#mt-cuerpo-sinapsis', 'Sinapsis'), n('#mt-cuerpo-pi', 'Memoria'), n('#mt-cuerpo-latido', 'El latido'), n('#mt-cuerpo-piel', 'La piel')])
            ] }
        ]
    });
}

export function initVisualMarinoCaps45a53() {
    neuro();
    nutricion();
    toxicos();
}
