// Vista Visual de Libros · Marino, caps. 31-44 (ácido-base, renal y
// electrolitos; abdomen y temperatura): recetas para core/visual-kit.js.
// Mismo criterio que visual-marino.js: los nodos apuntan a líneas reales de
// la ficha (por su id), las tablas se dibujan leyendo sus celdas y las
// calculadoras de la ficha se conectan, nunca se copian.
import { montarVisual } from '../../core/visual-kit.js';
import { panelNefronaViva } from '../nefrologia/nefrona-viva.js';
import { curvaPh, mapaGasometria, icebergK, escalaHiperMg, cineticaEnzimas, semaforoAntibioticos, simuladorSalino, retoVolumen, asistenteVisual } from './visual-marino-piezas.js';
import { DI_WIZARD } from './marino-renal.js';
import { PBE_WIZARD, CDI_WIZARD } from './marino-abdomen.js';

const FIGURAS = { tipo: 'figuras', titulo: 'Las figuras del libro', nota: 'Desliza para verlas; tócalas para ampliarlas.', todas: true };
const calc = (titulo, campos, resultado, nota) => ({ tipo: 'calculadora', titulo, campos, resultado, ...(nota ? { nota } : {}) });
const n = (fuente, etiqueta, color) => ({ fuente, etiqueta, ...(color ? { color } : {}) });


// Regla de temperatura común a las fichas de calor, hipotermia y fiebre:
// grados de la Tabla 43.6, fiebre ≥38,3 °C (Cap. 44); los nodos son de cada ficha.
const reglaTemperatura = (titulo, nodos) => ({ tipo: 'linea', titulo, min: 22, max: 44, unidad: '°C', ticks: [24, 28, 32, 35, 38, 41, 44],
    bandas: [{ desde: 22, hasta: 24, texto: 'Mortal', color: 'purpura' }, { desde: 24, hasta: 28, texto: 'Grave', color: 'rojo' },
        { desde: 28, hasta: 32, texto: 'Moder.', color: 'amarillo' }, { desde: 32, hasta: 35, texto: 'Leve', color: 'dorado' },
        { desde: 38.3, hasta: 44, texto: 'Fiebre ≥38,3', color: 'rojo', alinear: 'fin' }],
    nodos });

function renal() {
    // ---- Cap. 31 ----
    montarVisual('mr-acidobase-analisis', {
        guia: 'pH, compensación esperada y los 4 pasos para leer una gasometría.',
        paneles: [
            FIGURAS,
            calc('Lee una gasometría (calculadora de la ficha)', ['#mr-ab-ph', '#mr-ab-pco2', '#mr-ab-hco3'], ['#mr-ab-resultado']),
            mapaGasometria,
            curvaPh,
            { tipo: 'flujo', titulo: 'El método paso a paso', nodos: [
                n('#mr-regla-1', 'Regla 1: ¿PCO₂ y pH en sentido contrario o igual?', 'dorado'),
                n('#mr-regla-2', 'Regla 2: ¿cuál es el primario?', 'amarillo'),
                n('#mr-regla-3', 'Regla 3: ¿la compensación es la esperada?', 'verde'),
                n('#mr-regla-4', 'Regla 4: aguda o crónica', 'purpura'),
                n('#mr-etapa-3', 'Hiato aniónico y delta', 'rojo')
            ] },
            { tipo: 'comparar', titulo: 'Compensación esperada', columnas: [
                { titulo: 'Metabólica', color: 'dorado', nodos: [n('#mr-comp-acidosis-met', 'Acidosis'), n('#mr-comp-alcalosis-met', 'Alcalosis')] },
                { titulo: 'Respiratoria', color: 'verde', nodos: [n('#mr-comp-agudo', 'Aguda'), n('#mr-comp-cronico', 'Crónica')] }
            ] },
            { tipo: 'racimos', titulo: 'Bases', grupos: [{ titulo: 'Conceptos', color: 'purpura', nodos: [n('#mr-ph-definicion', 'Qué es el pH'), n('#mr-ph-no-lineal', 'pH y H⁺ no son lineales'), n('#mr-rangos-ref', 'Rangos de referencia'), n('#mr-stewart', 'Stewart')] }] }
        ]
    });
    montarVisual('mr-acidobase-gaps', {
        guia: 'El hiato aniónico, su corrección por albúmina y el delta.',
        paneles: [
            FIGURAS,
            calc('Hiato aniónico y delta (calculadora de la ficha)', ['#mr-gap-na', '#mr-gap-cl', '#mr-gap-hco3', '#mr-gap-alb'], ['#mr-gap-resultado']),
            { tipo: 'comparar', titulo: 'Acidosis según el hiato (Tabla 31.3)', columnas: [
                { titulo: 'Hiato elevado', color: 'rojo', nodos: [n('#mr-ag-alto', 'Hiato elevado')] },
                { titulo: 'Hiato normal', color: 'verde', nodos: [n('#mr-ag-normal', 'Hiato normal')] }
            ] },
            panelNefronaViva([['diarrea', 'Diarrea'], ['atr1', 'ATR I (distal)'], ['atr2', 'ATR II (proximal)'], ['atr4', 'ATR IV']]),
            { tipo: 'escalera', titulo: 'El delta: ¿hay otro trastorno?', nodos: [
                n('#mr-delta-menor', 'Delta <1: acidosis hiperclorémica añadida', 'verde'),
                n('#mr-delta-cad', 'Delta ~1 (CAD: 1)', 'amarillo'),
                n('#mr-delta-mayor', 'Delta >2: alcalosis metabólica añadida', 'rojo')
            ] },
            { tipo: 'racimos', titulo: 'Fórmulas', grupos: [{ titulo: 'Hiatos', color: 'dorado', nodos: [n('#mr-ag-formula', 'Hiato aniónico'), n('#mr-ag-albumina', 'Corrección por albúmina'), n('#mr-delta-gap', 'Delta'), n('#mr-osm-gap', 'Hiato osmolar')] }] }
        ]
    });

    // ---- Cap. 32 ----
    montarVisual('mr-lactato-bicarbonato', {
        guia: 'El lactato no es el ácido; el bicarbonato casi nunca ayuda.',
        paneles: [
            FIGURAS,
            { tipo: 'racimos', titulo: 'Por qué sube el lactato', grupos: [
                { titulo: 'Shock', color: 'rojo', nodos: [n('#mr-lact-septico', 'Shock séptico'), n('#mr-lact-estres', 'Estrés (adrenalina)')] },
                { titulo: 'Fármacos', color: 'amarillo', nodos: [n('#mr-lact-metformina', 'Metformina'), n('#mr-lact-linezolid', 'Linezolid'), n('#mr-lact-propilenglicol', 'Propilenglicol')] },
                { titulo: 'Otras', color: 'purpura', nodos: [n('#mr-lact-tiamina', 'Déficit de tiamina'), n('#mr-lact-convulsiones', 'Convulsiones'), n('#mr-d-lactico', 'D-láctico')] }
            ] },
            { tipo: 'flujo', titulo: '¿Bicarbonato?', nodos: [
                n('#mr-acidosis-protectora', 'La acidosis puede proteger', 'verde'),
                [n('#mr-bicarb-tampon', 'Un mal tampón', 'amarillo'), n('#mr-bicarb-contra', 'Efectos adversos', 'rojo')],
                n('#mr-bicarb-recomendacion', 'Cuándo sí', 'purpura')
            ] },
            calc('Déficit de bicarbonato (calculadora de la ficha)', ['#mr-bicarb-peso', '#mr-bicarb-hco3'], ['#mr-bicarb-resultado'])
        ]
    });
    montarVisual('mr-cetoacidosis', {
        guia: 'De la cetogénesis al manejo de la CAD, con el potasio por delante.',
        paneles: [
            FIGURAS,
            { tipo: 'flujo', titulo: 'Las cetonas', nodos: [n('#mr-cetogenesis', 'Cetogénesis', 'dorado'), n('#mr-redox', 'β-hidroxibutirato ↔ acetoacetato', 'amarillo'), n('#mr-nitroprusiato', 'El nitroprusiato no ve el β-OHB', 'rojo')] },
            { tipo: 'escalera', titulo: 'Potasio en la CAD (Tabla 32.4)', tabla: '#mr-tabla-32-4' },
            calc('Primeras horas de la CAD (calculadora de la ficha)', ['#mr-cad-peso', '#mr-cad-k', '#mr-cad-glucosa', '#mr-cad-na'], ['#mr-cad-resultado']),
            { tipo: 'comparar', titulo: 'CAD frente a cetoacidosis alcohólica', columnas: [
                { titulo: 'Diabética', color: 'rojo', nodos: [n('#mr-cad-criterios', 'Criterios'), n('#mr-cad-fluidos', 'Fluidos'), n('#mr-cad-potasio', 'Potasio')] },
                { titulo: 'Alcohólica', color: 'amarillo', nodos: [n('#mr-caa-mecanismo', 'Mecanismo'), n('#mr-caa-tratamiento', 'Tratamiento')] }
            ] }
        ]
    });

    // ---- Cap. 33 ----
    montarVisual('mr-alcalosis-mecanismos', {
        guia: 'Qué genera la alcalosis, qué la mantiene y cómo se clasifica por el cloro.',
        paneles: [
            FIGURAS,
            { tipo: 'racimos', titulo: 'Causas y mantenimiento', grupos: [
                { titulo: 'Generan', color: 'rojo', nodos: [n('#mr-alc-gastrico', 'Pérdidas gástricas'), n('#mr-alc-aldosterona', 'Aldosterona')] },
                { titulo: 'Mantienen', color: 'amarillo', nodos: [n('#mr-alc-hipovolemia', 'Hipovolemia'), n('#mr-alc-cloro', 'Déficit de cloro'), n('#mr-alc-hipok', 'Hipopotasemia')] }
            ] },
            { tipo: 'selector', titulo: '¿Sensible o resistente al cloro? (Tabla 33.1)', control: '#mr-alc-tipo', forma: 'chips', color: 'dorado', resultado: ['#mr-alc-tipo-resultado'] },
            calc('¿Hipoventila lo esperado? (calculadora de la ficha)', ['#mr-alc-hco3', '#mr-alc-paco2'], ['#mr-alc-paco2-resultado']),
            { tipo: 'racimos', titulo: 'Clínica', grupos: [{ titulo: 'Efectos', color: 'purpura', nodos: [n('#mr-alc-neuro', 'Neurológicos'), n('#mr-alc-hipoventilacion', 'Hipoventilación'), n('#mr-alc-bohr', 'Efecto Bohr')] }] },
            panelNefronaViva([['normal|furosemida', 'Furosemida'], ['normal|tiazida', 'Tiazida']])
        ]
    });
    montarVisual('mr-alcalosis-tratamiento', {
        guia: 'Reponer cloro (y potasio); HCl solo en casos extremos.',
        paneles: [
            calc('Déficit de cloro y salino (calculadora de la ficha)', ['#mr-cloro-peso', '#mr-cloro-cl'], ['#mr-cloro-resultado']),
            { tipo: 'escalera', titulo: 'Del más simple al más agresivo', nodos: [
                n('#mr-tabla-33-2', 'Salino 0,9% para el cloro', 'verde'),
                n('#mr-alc-kcl', 'Cloruro potásico', 'amarillo'),
                n('#mr-acetazolamida', 'Acetazolamida (con edemas)', 'dorado'),
                n('#mr-hcl-indicacion', 'Ácido clorhídrico', 'rojo')
            ] },
            calc('Ácido clorhídrico 0,1 N (calculadora de la ficha)', ['#mr-hcl-peso', '#mr-hcl-hco3', '#mr-hcl-ph'], ['#mr-hcl-resultado'])
        ]
    });

    // ---- Cap. 34 ----
    montarVisual('mr-fra-criterios', {
        guia: 'KDIGO: creatinina o diuresis; y por qué la creatinina engaña en la UCI.',
        paneles: [
            FIGURAS,
            calc('Estadio KDIGO (calculadora de la ficha)', ['#mr-kdigo-basal', '#mr-kdigo-actual', '#mr-kdigo-tiempo', '#mr-kdigo-diuresis'], ['#mr-kdigo-resultado']),
            calc('Filtrado estimado (calculadora de la ficha)', ['#mr-fg-edad', '#mr-fg-peso', '#mr-fg-cr', '#mr-fg-sexo'], ['#mr-fg-resultado']),
            { tipo: 'racimos', titulo: 'Los límites de la creatinina', grupos: [{ titulo: 'Creatinina', color: 'rojo', nodos: [n('#mr-creatinina-limites', 'Por qué llega tarde'), n('#mr-creatinina-critico', 'En el crítico'), n('#mr-cistatina', 'Cistatina C')] }] }
        ]
    });
    montarVisual('mr-fra-causas', {
        guia: 'Inflamación, hemodinámica, congestión y presión abdominal.',
        paneles: [
            FIGURAS,
            { tipo: 'racimos', titulo: 'Mecanismos (Tabla 34.2)', tabla: '#mr-tabla-34-2', color: 'rojo' },
            { tipo: 'flujo', titulo: 'El gradiente de filtración', nodos: [n('#mr-gradiente-filtracion', 'Gradiente de filtración', 'dorado'), [n('#mr-congestion', 'Congestión venosa', 'amarillo'), n('#mr-gradiente-pia', 'Presión abdominal', 'rojo')]] },
            calc('Presión abdominal (calculadora de la ficha)', ['#mr-pia-pam', '#mr-pia-valor', '#mr-pia-unidad', '#mr-pia-organo'], ['#mr-pia-resultado']),
            { tipo: 'racimos', titulo: 'Presión intraabdominal', grupos: [{ titulo: 'PIA', color: 'purpura', nodos: [n('#mr-pia-definiciones', 'Definiciones'), n('#mr-ppa', 'Presión de perfusión abdominal'), n('#mr-pia-medida', 'Cómo medirla')] }] }
        ]
    });
    montarVisual('mr-fra-nefrotoxicos', {
        guia: 'Fármacos, contraste y rabdomiólisis.',
        paneles: [
            { tipo: 'racimos', titulo: 'Nefrotóxicos por mecanismo (Tabla 34.3)', tabla: '#mr-tabla-34-3', color: 'rojo' },
            { tipo: 'comparar', titulo: 'Contraste yodado', columnas: [
                { titulo: 'Evidencia', color: 'amarillo', nodos: [n('#mr-contraste-evidencia', '¿Daña de verdad?')] },
                { titulo: 'Profilaxis', color: 'verde', nodos: [n('#mr-contraste-profilaxis', 'Qué hacer')] }
            ] },
            { tipo: 'flujo', titulo: 'Rabdomiólisis', nodos: [n('#mr-rabdo-mecanismo', 'Mecanismo', 'rojo'), n('#mr-rabdo-diagnostico', 'Diagnóstico', 'amarillo'), n('#mr-rabdo-tira', 'La tira reactiva', 'dorado'), n('#mr-rabdo-manejo', 'Manejo', 'verde')] },
            { tipo: 'selector', titulo: '¿Qué dice la tira y el sedimento?', control: '#mr-mioglobina', forma: 'chips', color: 'rojo', resultado: ['#mr-mioglobina-resultado'] }
        ]
    });
    montarVisual('mr-fra-indices', {
        guia: 'Índices urinarios: hipoperfusión frente a lesión tubular.',
        paneles: [
            { tipo: 'comparar', titulo: 'Tabla 34.4', columnas: [
                { titulo: 'Na⁺ en orina', color: 'amarillo', nodos: [n('#mr-na-orina', 'Na⁺ en orina')] },
                { titulo: 'EF de Na⁺', color: 'dorado', nodos: [n('#mr-efna', 'EFNa')] },
                { titulo: 'EF de urea', color: 'verde', nodos: [n('#mr-efu', 'EFU (con diuréticos)')] }
            ] },
            calc('Índices urinarios (calculadora de la ficha)', ['#mr-ind-nau', '#mr-ind-nap', '#mr-ind-cru', '#mr-ind-crp', '#mr-ind-ureau', '#mr-ind-ureap', '#mr-ind-diur'], ['#mr-indices-resultado']),
            panelNefronaViva([['prerrenal', 'IRA prerrenal'], ['nta', 'Necrosis tubular aguda'], ['obstruccion', 'Obstrucción']]),
            retoVolumen,
            { tipo: 'racimos', titulo: 'Qué hacer', grupos: [{ titulo: 'Manejo', color: 'purpura', nodos: [n('#mr-reto-volumen', 'Reto de volumen'), n('#mr-furosemida-fra', 'Furosemida'), n('#mr-dopamina-baja', 'Dopamina a dosis baja')] }] }
        ]
    });
    montarVisual('mr-trr', {
        guia: 'Difusión o convección: qué limpia cada técnica.',
        paneles: [
            FIGURAS,
            { tipo: 'comparar', titulo: 'Las técnicas', columnas: [
                { titulo: 'Hemodiálisis', color: 'dorado', nodos: [n('#mr-hemodialisis', 'Difusión')] },
                { titulo: 'Hemofiltración', color: 'verde', nodos: [n('#mr-hemofiltracion', 'Convección')] },
                { titulo: 'Hemodiafiltración', color: 'purpura', nodos: [n('#mr-hemodiafiltracion', 'Las dos')] }
            ] },
            { tipo: 'selector', titulo: '¿Qué técnica para este objetivo?', control: '#mr-trr-objetivo', forma: 'chips', color: 'verde', resultado: ['#mr-trr-objetivo-resultado'] },
            { tipo: 'racimos', titulo: 'Indicaciones y acceso', grupos: [{ titulo: 'TRR', color: 'rojo', nodos: [n('#mr-trr-indicaciones', 'Indicaciones'), n('#mr-cateter-hd', 'Catéter')] }] }
        ]
    });

    // ---- Cap. 35 ----
    montarVisual('mr-osmolalidad', {
        guia: 'Osmolalidad efectiva, calculada y el hiato osmolar.',
        paneles: [
            FIGURAS,
            calc('Osmolalidad y hiato osmolar (calculadora de la ficha)', ['#mr-osm-na', '#mr-osm-glu', '#mr-osm-bun', '#mr-osm-medida'], ['#mr-osm-resultado']),
            { tipo: 'flujo', titulo: 'De la teoría a la cabecera', nodos: [n('#mr-osm-efectiva', 'Osmolalidad efectiva (tonicidad)', 'dorado'), n('#mr-osm-calculada', 'Calculada', 'amarillo'), n('#mr-osm-efectiva-calc', 'Efectiva calculada', 'verde'), n('#mr-sodio-98', 'El Na⁺ hace el 98%', 'purpura')] }
        ]
    });
    montarVisual('mr-hipernatremia', {
        guia: 'Según el volumen extracelular; agua libre al ritmo justo; diabetes insípida.',
        paneles: [
            FIGURAS,
            { tipo: 'selector', titulo: '¿Cómo está el volumen extracelular?', control: '#mr-hiperna-vec', forma: 'chips', color: 'dorado', resultado: ['#mr-hiperna-vec-resultado'] },
            { tipo: 'barras', titulo: 'Na⁺ de los líquidos que se pierden (Tabla 35.1, mEq/L)', tabla: '#mr-tabla-35-1', series: [{ col: 1, nombre: 'Na⁺', color: 'amarillo' }] },
            calc('Ritmo de corrección (calculadora de la ficha)', ['#mr-hiperna-na', '#mr-hiperna-obj'], ['#mr-hiperna-resultado']),
            { tipo: 'comparar', titulo: 'Diabetes insípida', columnas: [
                { titulo: 'Central', color: 'verde', nodos: [n('#mr-di-central', 'Central')] },
                { titulo: 'Nefrogénica', color: 'rojo', nodos: [n('#mr-di-nefro', 'Nefrogénica')] }
            ] },
            asistenteVisual('¿Qué tipo de diabetes insípida? (asistente paso a paso)', 'mr-di-wizard', DI_WIZARD, 'mr-di-wizard')
        ]
    });
    montarVisual('mr-hiponatremia-dx', {
        guia: 'Descartar la seudohiponatremia y la hiperglucemia, y clasificar por volumen.',
        paneles: [
            FIGURAS,
            calc('Na⁺ corregido por glucosa (calculadora de la ficha)', ['#mr-nacorr-na', '#mr-nacorr-glu'], ['#mr-nacorr-resultado']),
            { tipo: 'comparar', titulo: 'Según el volumen extracelular', columnas: [
                { titulo: 'Bajo', color: 'amarillo', nodos: [n('#mr-hipona-hipovolemica', 'Hipovolémica')] },
                { titulo: 'Normal', color: 'verde', nodos: [n('#mr-hipona-normovolemica', 'Normovolémica'), n('#mr-siadh', 'SIADH')] },
                { titulo: 'Alto', color: 'rojo', nodos: [n('#mr-hipona-hipervolemica', 'Hipervolémica')] }
            ] },
            calc('Clasifica la hiponatremia (calculadora de la ficha)', ['#mr-hc-osm', '#mr-hc-vec', '#mr-hc-nau', '#mr-hc-osmu', '#mr-hc-diur'], ['#mr-hipona-clasif-resultado']),
            { tipo: 'racimos', titulo: 'Seudohiponatremia (Tabla 35.2)', tabla: '#mr-tabla-35-2', color: 'purpura' }
        ]
    });
    montarVisual('mr-hiponatremia-tto', {
        guia: 'Salino al 3% en bolos y nunca pasarse: el síndrome de desmielinización.',
        paneles: [
            calc('Salino al 3% (calculadora de la ficha)', ['#mr-sal3-peso', '#mr-sal3-na0', '#mr-sal3-na1', '#mr-sal3-horas', '#mr-sal3-dia'], ['#mr-sal3-resultado']),
            simuladorSalino,
            { tipo: 'flujo', titulo: 'Encefalopatía y sobrecorrección', nodos: [n('#mr-encefalopatia-hipona', 'Encefalopatía hiponatrémica', 'rojo'), n('#mr-tabla-35-3', 'Bolos de salino 3%', 'amarillo'), n('#mr-sdo', 'Desmielinización osmótica', 'purpura'), n('#mr-sobrecorreccion', 'Revertir la sobrecorrección', 'verde')] },
            { tipo: 'comparar', titulo: 'Asintomática', columnas: [
                { titulo: 'Hipovolémica', color: 'amarillo', nodos: [n('#mr-asinto-hipo', 'Salino')] },
                { titulo: 'Normovolémica', color: 'verde', nodos: [n('#mr-asinto-normo', 'Restringir agua')] },
                { titulo: 'Hipervolémica', color: 'rojo', nodos: [n('#mr-asinto-hiper', 'Diuréticos')] }
            ] }
        ]
    });

    // ---- Cap. 36 ----
    montarVisual('mr-hipopotasemia', {
        guia: 'El K⁺ del plasma es la punta del iceberg: déficit y ritmo de reposición.',
        paneles: [
            FIGURAS,
            calc('Déficit de K⁺ (calculadora de la ficha)', ['#mr-kdef-k', '#mr-kdef-peso', '#mr-kdef-ritmo'], ['#mr-kdef-resultado']),
            icebergK,
            calc('¿Pérdida renal o extrarrenal? (calculadora de la ficha)', ['#mr-kperd-ku', '#mr-kperd-clu'], ['#mr-kperd-resultado']),
            { tipo: 'racimos', titulo: 'Causas', grupos: [
                { titulo: 'Redistribución', color: 'amarillo', nodos: [n('#mr-hipok-redistribucion', 'Hacia la célula')] },
                { titulo: 'Pérdidas', color: 'rojo', nodos: [n('#mr-hipok-renal', 'Renales'), n('#mr-hipok-extrarrenal', 'Extrarrenales')] }
            ] },
            { tipo: 'racimos', titulo: 'Reponer', grupos: [{ titulo: 'KCl', color: 'verde', nodos: [n('#mr-kcl-ritmo', 'Ritmo'), n('#mr-kcl-respuesta', 'Respuesta esperada'), n('#mr-hipok-primero', 'Primero el magnesio')] }] }
        ]
    });
    montarVisual('mr-hiperk-causas', {
        guia: 'Primero descartar la falsa; después buscar la causa y mirar el ECG.',
        paneles: [
            FIGURAS,
            { tipo: 'requisitos', modo: 'ninguno', titulo: '¿Hiperpotasemia ficticia?', puerta: 'Hiperpotasemia probablemente real', items: [{ checks: '.mr-ficticia' }], resultado: ['#mr-ficticia-resultado'] },
            { tipo: 'racimos', titulo: 'Fármacos (Tabla 36.2)', tabla: '#mr-tabla-36-2', color: 'amarillo' },
            { tipo: 'flujo', titulo: 'El ECG', nodos: [n('#mr-ecg-hiperk', 'Secuencia de cambios', 'rojo'), n('#mr-ecg-correlacion', 'Mala correlación con el K⁺', 'amarillo')] }
        ]
    });
    montarVisual('mr-hiperk-tratamiento', {
        guia: 'Estabilizar, desplazar, eliminar.',
        paneles: [
            calc('¿Qué toca ahora? (calculadora de la ficha)', ['#mr-hk-k', '#mr-hk-ecg', '#mr-hk-colapso'], ['#mr-hk-resultado']),
            { tipo: 'flujo', titulo: 'Los tres pasos (Tabla 36.3)', nodos: [
                n('#mr-calcio-hiperk', '1. Calcio: estabiliza la membrana', 'rojo'),
                [n('#mr-insulina-k', '2. Insulina + glucosa', 'amarillo'), n('#mr-beta2-k', 'Salbutamol', 'amarillo')],
                [n('#mr-sps', '3. Resinas', 'verde'), n('#mr-szc', 'Ciclosilicato', 'verde'), n('#mr-hd-k', 'Hemodiálisis', 'purpura')]
            ] },
            calc('Calcio de cada ampolla (calculadora de la ficha)', ['#mr-camg-prep', '#mr-camg-ml'], ['#mr-camg-resultado'])
        ]
    });

    // ---- Cap. 37 ----
    montarVisual('mr-magnesio-deficit', {
        guia: 'El Mg sérico no ve el déficit: quién está en riesgo y qué produce.',
        paneles: [
            FIGURAS,
            { tipo: 'barras', titulo: 'Dónde está el magnesio (Tabla 37.1, mEq)', tabla: '#mr-tabla-37-1', excluir: ['Total'], series: [{ col: 1, nombre: 'mEq', color: 'dorado' }] },
            calc('Conversor de unidades (calculadora de la ficha)', ['#mr-mgconv-valor', '#mr-mgconv-unidad'], ['#mr-mgconv-resultado']),
            { tipo: 'racimos', titulo: 'Quién tiene déficit (Tabla 37.3)', grupos: [
                { titulo: 'Fármacos', color: 'amarillo', nodos: [n('#mr-mg-farmacos', 'Fármacos')] },
                { titulo: 'Otras', color: 'purpura', nodos: [n('#mr-mg-otras', 'Otras situaciones')] }
            ] },
            { tipo: 'racimos', titulo: 'Consecuencias', grupos: [{ titulo: 'Clínica', color: 'rojo', nodos: [n('#mr-mg-electrolitos', 'K⁺ y Ca²⁺'), n('#mr-mg-arritmias', 'Arritmias'), n('#mr-mg-neuro', 'Neurológicas')] }] }
        ]
    });
    montarVisual('mr-magnesio-reposicion', {
        guia: 'Reponer según la gravedad y el riñón; la prueba de retención.',
        paneles: [
            { tipo: 'escalera', titulo: 'Pautas por gravedad', nodos: [n('#mr-mg-leve', 'Leve', 'verde'), n('#mr-mg-moderada', 'Moderada', 'amarillo'), n('#mr-mg-grave', 'Grave', 'rojo'), n('#mr-mg-renal', 'Con insuficiencia renal', 'purpura')] },
            calc('Reposición de Mg (calculadora de la ficha)', ['#mr-mgrep-mg', '#mr-mgrep-peso', '#mr-mgrep-clinica', '#mr-mgrep-renal'], ['#mr-mgrep-resultado']),
            calc('Prueba de retención (calculadora de la ficha)', ['#mr-mgret-orina', '#mr-mgret-unidad', '#mr-mgret-renal'], ['#mr-mgret-resultado']),
            calc('¿Qué espero con este Mg? (calculadora de la ficha)', ['#mr-hipermg-valor'], ['#mr-hipermg-resultado']),
            escalaHiperMg
        ]
    });

    // ---- Cap. 38 ----
    montarVisual('mr-calcio-hipoca', {
        guia: 'Mide el calcio iónico; trata las causas y repón con cuidado.',
        paneles: [
            FIGURAS,
            calc('Conversor de unidades (calculadora de la ficha)', ['#mr-caconv-param', '#mr-caconv-valor', '#mr-caconv-unidad'], ['#mr-caconv-resultado']),
            { tipo: 'racimos', titulo: 'Causas en la UCI (Tabla 38.2)', grupos: [
                { titulo: 'Frecuentes', color: 'rojo', nodos: [n('#mr-hipoca-alcalosis', 'Alcalosis'), n('#mr-hipoca-mg', 'Déficit de Mg'), n('#mr-hipoca-sepsis', 'Sepsis'), n('#mr-hipoca-renal', 'Insuficiencia renal')] },
                { titulo: 'Otras', color: 'amarillo', nodos: [n('#mr-hipoca-transfusion', 'Transfusión'), n('#mr-hipoca-otras', 'Otras')] }
            ] },
            { tipo: 'comparar', titulo: 'Las sales de calcio (Tabla 38.3)', columnas: [
                { titulo: 'Cloruro 10%', color: 'rojo', nodos: [n('css:#mr-tabla-38-3 tbody tr:nth-child(1)', '27 mg/mL, 2.000 mOsm/L')] },
                { titulo: 'Gluconato 10%', color: 'verde', nodos: [n('css:#mr-tabla-38-3 tbody tr:nth-child(2)', '9 mg/mL, 680 mOsm/L')] }
            ] },
            calc('Pauta de calcio (calculadora de la ficha)', ['#mr-capauta-peso', '#mr-capauta-prep', '#mr-capauta-dosis'], ['#mr-capauta-resultado'])
        ]
    });
    montarVisual('mr-hipercalcemia', {
        guia: 'Salino primero; después calcitonina y bisfosfonatos.',
        paneles: [
            calc('¿Qué hacer con este calcio? (calculadora de la ficha)', ['#mr-hiperca-ca', '#mr-hiperca-neuro', '#mr-hiperca-volumen', '#mr-hiperca-origen', '#mr-hiperca-clcr'], ['#mr-hiperca-resultado']),
            { tipo: 'flujo', titulo: 'Tratamiento (Tabla 38.4)', nodos: [
                n('#mr-hiperca-salino', 'Salino', 'verde'),
                [n('#mr-hiperca-calcitonina', 'Calcitonina (rápida)', 'amarillo'), n('#mr-hiperca-bisfosfonatos', 'Bisfosfonatos (lentos)', 'dorado')],
                n('#mr-hiperca-corticoides', 'Corticoides en casos concretos', 'purpura')
            ] },
            { tipo: 'racimos', titulo: 'Clínica', grupos: [{ titulo: 'Hipercalcemia', color: 'rojo', nodos: [n('#mr-hiperca-causas', 'Causas'), n('#mr-hiperca-clinica', 'Clínica'), n('#mr-hiperca-umbral', 'Cuándo tratar')] }] },
            panelNefronaViva([['hiperpara', 'Hiperparatiroidismo 1º'], ['hhf', 'Hipercalcemia-hipocalciuria familiar']])
        ]
    });
    montarVisual('mr-fosforo', {
        guia: 'Hipofosfatemia por glucosa y alcalosis; reponer por peso; quelantes.',
        paneles: [
            FIGURAS,
            { tipo: 'racimos', titulo: 'Por qué baja', grupos: [{ titulo: 'Causas', color: 'amarillo', nodos: [n('#mr-hipop-glucosa', 'Glucosa'), n('#mr-hipop-alcalosis', 'Alcalosis'), n('#mr-hipop-estres', 'Estrés'), n('#mr-hipop-quelantes', 'Quelantes')] }] },
            { tipo: 'flujo', titulo: 'Qué produce', nodos: [n('#mr-hipop-oxidativo', 'Menos ATP y 2,3-DPG', 'rojo'), n('#mr-hipop-musculo', 'Debilidad muscular', 'purpura')] },
            calc('Fosfato IV (calculadora de la ficha, Tabla 38.5)', ['#mr-fosfato-po4', '#mr-fosfato-peso', '#mr-fosfato-k', '#mr-fosfato-indic'], ['#mr-fosfato-resultado']),
            calc('Quelante por fósforo (calculadora de la ficha)', ['#mr-quelante-po4'], ['#mr-quelante-resultado'])
        ]
    });
}

function abdomen() {
    // ---- Cap. 39 ----
    montarVisual('ma-fallo-hepatico-agudo', {
        guia: 'Causa, clínica y quién necesita trasplante.',
        paneles: [
            FIGURAS,
            { tipo: 'selector', titulo: '¿Cuál es la causa?', control: '#ma-fha-causa', forma: 'chips', color: 'rojo', resultado: ['#ma-fha-causa-resultado'] },
            { tipo: 'comparar', titulo: 'Hepatotóxicos (Tabla 39.1)', columnas: [
                { titulo: 'Dependientes de la dosis', color: 'rojo', nodos: [n('#ma-fha-paracetamol', 'Paracetamol')] },
                { titulo: 'Idiosincrásicos', color: 'amarillo', nodos: [n('#ma-fha-farmacos', 'Otros fármacos')] }
            ] },
            { tipo: 'flujo', titulo: 'Qué vigilar', nodos: [n('#ma-fha-clinica', 'Clínica', 'dorado'), n('#ma-fha-hemodinamica', 'Hemodinámica', 'amarillo'), n('#ma-fha-ira', 'Riñón', 'rojo'), n('#ma-fha-trasplante', 'Trasplante', 'verde')] }
        ]
    });
    montarVisual('ma-encefalopatia-hepatica', {
        guia: 'El amonio, los grados de West Haven y el tratamiento.',
        paneles: [
            FIGURAS,
            { tipo: 'escalera', titulo: 'Criterios de West Haven (Tabla 39.2)', tabla: '#ma-tabla-39-2' },
            { tipo: 'flujo', titulo: 'Tratamiento', nodos: [n('#ma-eh-lactulosa', 'Lactulosa', 'verde'), n('#ma-eh-rifaximina', 'Rifaximina', 'amarillo'), n('#ma-eh-cvvh', 'Hemofiltración', 'rojo')] },
            calc('¿Hemofiltración por el amonio? (calculadora de la ficha)', ['#ma-cvvh-nh3', '#ma-cvvh-oliguria', '#ma-cvvh-edema', '#ma-cvvh-wh'], ['#ma-cvvh-resultado'])
        ]
    });
    montarVisual('ma-varices', {
        guia: 'Las 6 medidas de la hemorragia por varices (Tabla 39.3).',
        paneles: [
            FIGURAS,
            { tipo: 'requisitos', modo: 'todos', titulo: 'Paquete de la hemorragia por varices', puerta: 'Paquete completo', items: [{ checks: '.ma-var-check' }], resultado: ['#ma-var-resultado'] },
            { tipo: 'racimos', titulo: 'Lo distinto del cirrótico', grupos: [{ titulo: 'Claves', color: 'purpura', nodos: [n('#ma-aclf', 'ACLF'), n('#ma-var-diferencias', 'Diferencias'), n('#ma-var-tips', 'TIPS')] }] }
        ]
    });
    montarVisual('ma-pbe-shr', {
        guia: 'Peritonitis bacteriana espontánea y síndrome hepatorrenal.',
        paneles: [
            FIGURAS,
            asistenteVisual('¿Es una PBE? (asistente paso a paso)', 'ma-pbe', PBE_WIZARD, 'ma-pbe-calc'),
            calc('Respuesta a las 48 h (calculadora de la ficha)', ['#ma-pmn-inicial', '#ma-pmn-48'], ['#ma-pmn-resultado']),
            calc('Albúmina en la PBE (calculadora de la ficha)', ['#ma-alb-peso'], ['#ma-alb-resultado']),
            { tipo: 'requisitos', modo: 'todos', titulo: 'Criterios de síndrome hepatorrenal (Tabla 39.4)', puerta: 'SHR', items: [{ checks: '.ma-shr-check' }], resultado: ['#ma-shr-resultado'] },
            { tipo: 'flujo', titulo: 'SHR', nodos: [n('#ma-shr-fisio', 'Fisiopatología', 'amarillo'), n('#ma-shr-tto', 'Tratamiento', 'verde'), n('#ma-shr-pia', 'Presión abdominal', 'rojo')] }
        ]
    });

    // ---- Cap. 40 ----
    montarVisual('ma-pancreatitis-dx', {
        guia: 'Causas, criterios de Atlanta y cuándo pedir imagen.',
        paneles: [
            FIGURAS,
            { tipo: 'racimos', titulo: 'Causas (Tabla 40.1)', tabla: '#ma-tabla-40-1', color: 'rojo' },
            calc('Gravedad de Atlanta (calculadora de la ficha)', ['#ma-atl-fallo', '#ma-atl-compl'], ['#ma-atl-resultado']),
            cineticaEnzimas,
            { tipo: 'racimos', titulo: 'Diagnóstico', grupos: [{ titulo: 'Claves', color: 'dorado', nodos: [n('#ma-panc-lipasa', 'Lipasa'), n('#ma-panc-morfologia', 'Morfología'), n('#ma-panc-imagen', 'Imagen'), n('#ma-panc-gravedad', 'Gravedad')] }] }
        ]
    });
    montarVisual('ma-pancreatitis-tto', {
        guia: 'Ringer lactato, nutrición enteral precoz y antibiótico solo con necrosis infectada.',
        paneles: [
            FIGURAS,
            calc('Ringer lactato inicial (calculadora de la ficha)', ['#ma-rl-peso', '#ma-rl-hipovolemia', '#ma-rl-calcio'], ['#ma-rl-resultado']),
            { tipo: 'flujo', titulo: 'Manejo', nodos: [n('#ma-panc-fluidos', 'Fluidos', 'verde'), n('#ma-panc-nutricion', 'Nutrición', 'amarillo'), n('#ma-panc-infeccion', 'Necrosis infectada', 'rojo'), n('#ma-panc-scompartimental', 'Síndrome compartimental', 'purpura')] },
            calc('Hipertrigliceridemia (calculadora de la ficha)', ['#ma-tg-peso', '#ma-tg-valor'], ['#ma-tg-resultado']),
            { tipo: 'comparar', titulo: 'Según la causa', columnas: [
                { titulo: 'Biliar', color: 'dorado', nodos: [n('#ma-panc-biliar', 'Biliar')] },
                { titulo: 'Alcohol', color: 'amarillo', nodos: [n('#ma-panc-alcohol', 'Alcohol')] }
            ] }
        ]
    });

    // ---- Cap. 41 ----
    montarVisual('ma-colecistitis', {
        guia: 'La colecistitis alitiásica del crítico: eco, HIDA y drenaje.',
        paneles: [
            FIGURAS,
            { tipo: 'flujo', titulo: 'Diagnóstico y tratamiento', nodos: [n('#ma-cole-mecanismo', 'Mecanismo', 'dorado'), n('#ma-cole-clinica', 'Clínica', 'amarillo'), [n('#ma-cole-eco', 'Ecografía', 'verde'), n('#ma-cole-hida', 'HIDA', 'purpura')], n('#ma-cole-tto', 'Tratamiento', 'rojo')] },
            { tipo: 'comparar', titulo: 'Penetración en la bilis (Tabla 41.1)', columnas: [
                { titulo: 'Buena', color: 'verde', nodos: [n('css:#ma-tabla-41-1 thead th:nth-child(1)', 'Buena penetración')] },
                { titulo: 'Mala', color: 'rojo', nodos: [n('css:#ma-tabla-41-1 thead th:nth-child(2)', 'Mala penetración')] }
            ] },
            { tipo: 'selector', titulo: '¿Llega a la bilis?', control: '#ma-bilis-farmaco', forma: 'chips', color: 'verde', resultado: ['#ma-bilis-resultado'] }
        ]
    });
    montarVisual('ma-cdifficile', {
        guia: 'Diagnóstico en dos pasos y tratamiento por situación.',
        paneles: [
            FIGURAS,
            { tipo: 'flujo', titulo: 'C. difficile', nodos: [n('#ma-cdi-patogenia', 'Patogenia', 'dorado'), n('#ma-cdi-clinica', 'Clínica', 'amarillo'), n('#ma-cdi-pruebas', 'Pruebas', 'verde')] },
            asistenteVisual('¿Qué prueba pido y qué significa? (asistente paso a paso)', 'ma-cdi', CDI_WIZARD, 'ma-cdi-calc'),
            { tipo: 'selector', titulo: 'Tratamiento por situación (Tabla 41.2)', control: '#ma-cditto-situacion', forma: 'chips', color: 'rojo', resultado: ['#ma-cditto-resultado'] },
            { tipo: 'racimos', titulo: 'Después', grupos: [{ titulo: 'Recaídas y prevención', color: 'purpura', nodos: [n('#ma-cdi-recaidas', 'Recaídas'), n('#ma-cdi-prevencion', 'Prevención')] }] }
        ]
    });
    montarVisual('ma-infeccion-abdominal', {
        guia: 'Qué cubre cada antibiótico y qué pauta para cada paciente.',
        paneles: [
            FIGURAS,
            { tipo: 'matriz', titulo: 'Espectro (Tabla 41.3)', tabla: '#ma-tabla-41-3', normales: ['+'], leyenda: ['cubre (+)', 'no cubre o dudoso (−, +/−)'] },
            semaforoAntibioticos,
            calc('Shock séptico (calculadora de la ficha)', ['#ma-cob-shock'], ['#ma-cob-resultado']),
            { tipo: 'racimos', titulo: 'Pautas', grupos: [
                { titulo: 'Empírica', color: 'verde', nodos: [n('#ma-iia-sin-resistentes', 'Sin resistentes'), n('#ma-iia-blee', 'BLEE'), n('#ma-iia-alergia', 'Alergia'), n('#ma-iia-candida', 'Candida')] },
                { titulo: 'Situaciones', color: 'rojo', nodos: [n('#ma-iia-neumoperitoneo', 'Neumoperitoneo'), n('#ma-iia-postop', 'Posoperatoria'), n('#ma-iia-absceso', 'Absceso')] }
            ] }
        ]
    });

    // ---- Cap. 42 ----
    montarVisual('ma-itu-sonda', {
        guia: 'La sonda coloniza; solo se trata la infección con criterios.',
        paneles: [
            FIGURAS,
            { tipo: 'flujo', titulo: 'De la sonda a la infección', nodos: [n('#ma-itu-adherencia', 'Biopelícula', 'dorado'), n('#ma-itu-germenes', 'Gérmenes', 'amarillo'), n('#ma-itu-nhsn', 'Criterios NHSN', 'rojo'), n('#ma-itu-retirar', 'Retirar la sonda', 'verde')] },
            calc('¿Cumple criterios de ITU? (calculadora de la ficha)', ['#ma-nhsn-sonda', '#ma-nhsn-cultivo', '#ma-nhsn-hemo'], ['#ma-nhsn-resultado']),
            { tipo: 'comparar', titulo: 'Tratar o no', columnas: [
                { titulo: 'No tratar', color: 'gris', nodos: [n('#ma-itu-asintomatica', 'Bacteriuria asintomática')] },
                { titulo: 'Tratar', color: 'rojo', nodos: [n('#ma-itu-empirico', 'Empírico'), n('#ma-itu-dirigido', 'Dirigido')] }
            ] }
        ]
    });
    montarVisual('ma-candiduria', {
        guia: 'Casi nunca se trata; cuándo sí.',
        paneles: [
            { tipo: 'selector', titulo: '¿Qué hacer con esta candiduria?', control: '#ma-cand-escenario', forma: 'chips', color: 'amarillo', resultado: ['#ma-cand-resultado'] },
            { tipo: 'flujo', titulo: 'Candiduria', nodos: [n('#ma-cand-que', 'Qué significa', 'dorado'), [n('#ma-cand-asintomatica', 'Asintomática', 'gris'), n('#ma-cand-sintomatica', 'Sintomática', 'rojo')], n('#ma-cand-tto', 'Tratamiento', 'verde')] }
        ]
    });

    // ---- Cap. 43 ----
    montarVisual('ma-calor', {
        guia: 'Agotamiento frente a golpe de calor, y cómo enfriar.',
        paneles: [
            { tipo: 'comparar', titulo: 'Agotamiento frente a golpe de calor (Tabla 43.1)', columnas: [
                { titulo: 'Agotamiento', color: 'amarillo', nodos: [n('#ma-calor-agotamiento', '38-39 °C, SNC normal, suda')] },
                { titulo: 'Golpe de calor', color: 'rojo', nodos: [n('#ma-calor-golpe', '≥41 °C, SNC alterado, no suda')] }
            ] },
            reglaTemperatura('Dónde caen en la escala de temperatura', [{ fuente: '#ma-calor-agotamiento', etiqueta: 'Agotamiento por calor (38-39 °C)', en: 38.5, color: 'amarillo', fila: 'abajo' }, { fuente: '#ma-calor-golpe', etiqueta: 'Golpe de calor (≥41 °C)', en: 41, color: 'rojo', fila: 'abajo' }]),
            calc('¿Golpe de calor? (calculadora de la ficha)', ['#ma-calor-temp', '#ma-calor-snc', '#ma-calor-hemo'], ['#ma-calor-resultado']),
            { tipo: 'comparar', titulo: 'Enfriar', columnas: [
                { titulo: 'Externo', color: 'verde', nodos: [n('#ma-calor-externo', 'Externo')] },
                { titulo: 'Interno', color: 'amarillo', nodos: [n('#ma-calor-interno', 'Interno')] }
            ] }
        ]
    });
    montarVisual('ma-hipertermia-farmacos', {
        guia: 'Hipertermia maligna, síndrome neuroléptico maligno y serotoninérgico.',
        paneles: [
            { tipo: 'matriz', titulo: 'Rasgo a rasgo', tabla: '#ma-tabla-rasgos-hipertermias', excluir: ['Desencadenante', 'Inicio', 'Primer signo', 'Tratamiento clave'], normales: ['no los cita', 'no (lo distingue del ss)'], leyenda: ['ausente o no lo cita', 'presente'] },
            { tipo: 'comparar', titulo: 'Los tres síndromes', columnas: [
                { titulo: 'Hipertermia maligna', color: 'rojo', nodos: [n('#ma-hm-clinica', 'Clínica'), n('#ma-hm-tto', 'Dantroleno')] },
                { titulo: 'Neuroléptico maligno', color: 'amarillo', nodos: [n('#ma-snm-clinica', 'Clínica'), n('#ma-snm-tto', 'Tratamiento')] },
                { titulo: 'Serotoninérgico', color: 'purpura', nodos: [n('#ma-ss-claves', 'Claves'), n('#ma-ss-tto', 'Tratamiento')] }
            ] },
            calc('¿Cuál de los tres? (calculadora de la ficha)', ['#ma-dif-farmaco'], ['#ma-dif-resultado'], 'Clonus, CO₂ espirado y CK se marcan en la vista Texto.'),
            calc('Dantroleno (calculadora de la ficha)', ['#ma-dant-peso', '#ma-dant-sindrome'], ['#ma-dant-resultado']),
            { tipo: 'racimos', titulo: 'Fármacos implicados', grupos: [
                { titulo: 'Neurolépticos (Tabla 43.3)', color: 'amarillo', nodos: [n('#ma-tabla-43-3', 'Tabla 43.3')] },
                { titulo: 'Serotoninérgicos (Tabla 43.4)', color: 'purpura', nodos: [n('#ma-tabla-43-4', 'Tabla 43.4')] }
            ] }
        ]
    });
    montarVisual('ma-hipotermia', {
        guia: 'Grados, ECG y recalentamiento.',
        paneles: [
            FIGURAS,
            { tipo: 'escalera', titulo: 'Gravedad (Tabla 43.6)', tabla: '#ma-tabla-43-6' },
            reglaTemperatura('La hipotermia en la escala de temperatura', [
                { fuente: 'css:#ma-tabla-43-6 tbody tr:nth-child(1)', etiqueta: 'Leve (32-35 °C)', en: 33.5, color: 'dorado', fila: 'abajo' },
                { fuente: 'css:#ma-tabla-43-6 tbody tr:nth-child(2)', etiqueta: 'Moderada (28-31,9 °C)', en: 30, color: 'amarillo', fila: 'abajo' },
                { fuente: 'css:#ma-tabla-43-6 tbody tr:nth-child(3)', etiqueta: 'Grave (<28 °C)', en: 26, color: 'rojo', fila: 'abajo' },
                { fuente: 'css:#ma-tabla-43-6 tbody tr:nth-child(4)', etiqueta: 'Mortal (<24 °C): apnea y asistolia', en: 23, color: 'purpura', fila: 'abajo' }]),
            calc('¿Cómo recalentar? (calculadora de la ficha)', ['#ma-hipo-t', '#ma-hipo-iot'], ['#ma-hipo-resultado']),
            { tipo: 'racimos', titulo: 'Qué mirar', grupos: [
                { titulo: 'Diagnóstico', color: 'dorado', nodos: [n('#ma-hipo-temp', 'Temperatura'), n('#ma-hipo-lab', 'Laboratorio'), n('#ma-hipo-osborn', 'Onda de Osborn'), n('#ma-hipo-arritmias', 'Arritmias')] },
                { titulo: 'Recalentar', color: 'verde', nodos: [n('#ma-hipo-externo', 'Externo'), n('#ma-hipo-interno', 'Interno')] }
            ] }
        ]
    });

    // ---- Cap. 44 ----
    montarVisual('ma-fiebre-basicos', {
        guia: 'Qué es fiebre y qué la causa sin infección.',
        paneles: [
            FIGURAS,
            calc('¿Es fiebre? (calculadora de la ficha)', ['#ma-tconv-valor', '#ma-tconv-unidad', '#ma-tconv-neutro'], ['#ma-tconv-resultado']),
            reglaTemperatura('La fiebre en la escala de temperatura', [{ fuente: '#ma-fiebre-def', etiqueta: 'Fiebre: una medida ≥38,3 °C (neutropenia: 38,0 °C 1 h)', en: 38.3, color: 'rojo', fila: 'abajo' }]),
            { tipo: 'mapa', titulo: 'Fuentes de fiebre nueva en la UCI (Figura 44.1)', nodos: [
                { fuente: '#ma-ff-1', etiqueta: 'Ictus', organo: 'cabeza' },
                { fuente: '#ma-ff-2', etiqueta: 'Transfusiones, catéter, fármacos', organo: 'cateter', color: 'amarillo' },
                { fuente: '#ma-ff-3', etiqueta: 'Herida quirúrgica (esternotomía)', organo: 'esternon', color: 'dorado' },
                { fuente: '#ma-ff-4', etiqueta: 'Neumonía y embolia pulmonar', organo: 'pulmonDcho' },
                { fuente: '#ma-ff-5', etiqueta: 'Infarto y endocarditis', organo: 'corazon' },
                { fuente: '#ma-ff-6', etiqueta: 'Colecistitis alitiásica', organo: 'higado', color: 'amarillo' },
                { fuente: '#ma-ff-7', etiqueta: 'Intestino y C. difficile', organo: 'intestino', color: 'purpura' },
                { fuente: '#ma-ff-8', etiqueta: 'Infección urinaria', organo: 'vejiga', color: 'dorado' },
                { fuente: '#ma-ff-9', etiqueta: 'Trombosis venosa profunda', organo: 'piernaIzda', color: 'purpura' }] },
            { tipo: 'comparar', titulo: 'Causas no infecciosas (Tabla 44.2)', columnas: [
                { titulo: 'Más frecuentes', color: 'amarillo', nodos: [n('#ma-fiebre-postop', 'Posoperatoria'), n('#ma-fiebre-tev-transfusion', 'TEV y transfusión'), n('#ma-fiebre-farmacos', 'Fármacos')] },
                { titulo: 'Otras', color: 'purpura', nodos: [n('#ma-fiebre-otras', 'Otras')] }
            ] },
            { tipo: 'racimos', titulo: 'Fiebre por fármacos (Tabla 44.3)', tabla: '#ma-tabla-44-3', color: 'rojo' }
        ]
    });
    montarVisual('ma-infecciones-nosocomiales', {
        guia: 'Las infecciones de la UCI, hemocultivos bien hechos y antibiótico empírico.',
        paneles: [
            FIGURAS,
            { tipo: 'barras', titulo: 'Infecciones hospitalarias en EE. UU. (Tabla 44.4)', tabla: '#ma-tabla-44-4', series: [{ col: 1, nombre: 'Total', color: 'dorado' }, { col: 2, nombre: 'En UCI', color: 'rojo' }] },
            { tipo: 'barras', titulo: 'Bacteriemias detectadas según los hemocultivos (Figura 44.3, %)', tabla: '#ma-tabla-fig44-3', series: [{ col: 1, nombre: 'Endocarditis', color: 'rojo' }, { col: 2, nombre: 'Otras infecciones', color: 'dorado' }] },
            calc('¿Cuántos hemocultivos? (calculadora de la ficha)', ['#ma-hemoc-n', '#ma-hemoc-tipo'], ['#ma-hemoc-resultado']),
            calc('Tiempo diferencial (calculadora de la ficha)', ['#ma-dtp-cvc', '#ma-dtp-per'], ['#ma-dtp-resultado']),
            { tipo: 'racimos', titulo: 'Infecciones', grupos: [{ titulo: 'Focos', color: 'purpura', nodos: [n('#ma-iso-que', 'Herida quirúrgica'), n('#ma-iso-necrotizante', 'Necrotizante'), n('#ma-endocarditis', 'Endocarditis'), n('#ma-candidiasis', 'Candidiasis')] }] }
        ]
    });
    montarVisual('ma-antipireticos', {
        guia: 'La fiebre defiende: cuándo bajarla y con qué.',
        paneles: [
            FIGURAS,
            { tipo: 'flujo', titulo: '¿Bajar la fiebre?', nodos: [n('#ma-antip-defensa', 'La fiebre defiende', 'verde'), n('#ma-antip-clinica', 'Lo que dicen los ensayos', 'amarillo'), n('#ma-antip-guias', 'Las guías', 'dorado')] },
            { tipo: 'barras', titulo: 'Mortalidad según la temperatura inicial en la sepsis (Figura 44.5, %)', nota: 'Lectura aproximada de las categorías en °F.', tabla: '#ma-tabla-fig44-5', series: [{ col: 1, nombre: 'Mortalidad', color: 'rojo' }] },
            calc('¿Antipirético? (calculadora de la ficha)', ['#ma-antip-peso', '#ma-antip-cerebro', '#ma-antip-higado'], ['#ma-antip-resultado']),
            { tipo: 'comparar', titulo: 'Con qué', columnas: [
                { titulo: 'Paracetamol', color: 'verde', nodos: [n('#ma-antip-paracetamol', 'Paracetamol')] },
                { titulo: 'AINE', color: 'amarillo', nodos: [n('#ma-antip-aine', 'AINE')] },
                { titulo: 'Mantas', color: 'rojo', nodos: [n('#ma-antip-mantas', 'Enfriamiento externo')] }
            ] }
        ]
    });
}

export function initVisualMarinoCaps31a44() {
    renal();
    abdomen();
}
