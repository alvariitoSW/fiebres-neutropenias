// Vista Visual del cuaderno de fisiología renal y electrolitos: recetas para
// core/visual-kit.js. Hipopotasemia e hiperpotasemia tienen su propia
// simulación (hipopotasemia-sim.js, hiperpotasemia-sim.js). Los simuladores y
// calculadoras que ya existen en cada ficha se conectan con el panel
// 'calculadora' (escriben en sus campos reales y copian su resultado), y los
// diferenciales con 'selector'. Ningún dato nuevo: cada nodo apunta a una
// línea de la ficha.
import { panelNefronaViva } from './nefrona-viva.js';
import { montarVisual } from '../../core/visual-kit.js';
import { montarGlomerulo } from './glomerulo-vivo.js';

export function initVisualFisiologia() {
    montarVisual('fisio-anatomia', {
        guia: 'El riñón en cifras, el camino del filtrado y para qué sirve.',
        paneles: [
            { tipo: 'racimos', titulo: 'El riñón en cifras', grupos: [
                { titulo: 'Órgano', color: 'dorado', nodos: ['Tamaño', 'Ubicación', 'Nº de nefronas'] }
            ] },
            { tipo: 'flujo', titulo: 'Dos recorridos en serie', nodos: [
                { fuente: 'Vascularización', etiqueta: 'Sangre: dos lechos capilares en serie', color: 'rojo' },
                { fuente: 'Recorrido del filtrado', etiqueta: 'Filtrado: de la cápsula de Bowman al colector', color: 'amarillo' }
            ] },
            { tipo: 'racimos', titulo: 'Las funciones del riñón', tabla: 0, color: 'verde' }
        ]
    });

    montarVisual('fisio-filtracion', {
        guia: 'Una barrera de tres capas y un balance de presiones que deja ~10 mmHg a favor de filtrar.',
        paneles: [
            { tipo: 'flujo', titulo: 'La barrera, de la sangre al espacio de Bowman', nodos: [
                { fuente: 'Endotelio fenestrado', color: 'rojo' },
                { fuente: 'Membrana basal', color: 'amarillo' },
                { fuente: 'Podocitos', color: 'verde' }
            ] },
            { tipo: 'comparar', titulo: 'Fuerzas de Starling en el glomérulo', columnas: [
                { titulo: 'Empuja a filtrar', color: 'verde', nodos: ['PH glomerular'] },
                { titulo: 'Se oponen', color: 'rojo', nodos: ['PH capsular', 'P. oncótica'] }
            ] },
            { tipo: 'flujo', titulo: 'El resultado', nodos: [
                { fuente: 'Presión neta', color: 'amarillo' },
                { fuente: 'TFG normal', color: 'verde' },
                [{ fuente: 'Dintel de filtración', color: 'dorado' }, { fuente: '¿De qué depende la TFG?', color: 'dorado' }],
                { fuente: 'Cómo se mide en la práctica', color: 'purpura' }
            ] }
        ]
    });

    montarVisual('fisio-regulacion', {
        guia: 'Mueve la presión y mira cómo la arteriola aferente defiende la TFG.',
        paneles: [
            { tipo: 'propio', titulo: 'Glomérulo vivo: autorregulación', render: (c, x) => montarGlomerulo(c, x, {
                mandos: ['pam'], textos: { pam: 'g-t-miogenico' } }) },
            { tipo: 'comparar', titulo: 'Quién la regula', columnas: [
                { titulo: 'Intrínseco (el propio riñón)', color: 'verde', nodos: ['Mecanismo miogénico', 'Retroalimentación túbulo-glomerular'] },
                { titulo: 'Extrínseco (sistémico)', color: 'purpura', nodos: ['Sistema renina-angiotensina-aldosterona'] }
            ] },
            { tipo: 'racimos', titulo: 'Intrínseco frente a extrínseco (tabla)', tabla: 0, color: 'dorado' }
        ]
    });

    montarVisual('fisio-tubular', {
        guia: 'Se filtra muchísimo y se devuelve casi todo: cada tramo de la nefrona hace su parte.',
        paneles: [
            panelNefronaViva([['normal', 'Filtrado normal'], ['normal|furosemida', 'Con furosemida'], ['normal|tiazida', 'Con tiazida']]),
            { tipo: 'barras', titulo: 'Cuánto se reabsorbe de lo filtrado', nota: 'Tabla de la ficha, dibujada.',
              tabla: 0, series: [{ col: 2, nombre: '% reabsorbido', color: 'verde' }] },
            { tipo: 'flujo', titulo: 'Tramo a tramo', nodos: [
                { fuente: 'Túbulo proximal', color: 'amarillo' },
                { fuente: 'Asa de Henle — rama descendente delgada', etiqueta: 'Asa: rama descendente delgada', color: 'verde' },
                { fuente: 'Asa de Henle — rama ascendente delgada', etiqueta: 'Asa: rama ascendente delgada', color: 'dorado' },
                { fuente: 'Asa de Henle — rama ascendente gruesa', etiqueta: 'Asa: rama ascendente gruesa', color: 'rojo' },
                { fuente: 'Túbulo contorneado distal', color: 'purpura' },
                { fuente: 'Túbulo conector y conducto colector', color: 'gris' }
            ] },
            { tipo: 'comparar', titulo: 'Por dónde pasa', columnas: [
                { titulo: 'A través de la célula', color: 'dorado', nodos: ['Vía transcelular', 'Transporte máximo'] },
                { titulo: 'Entre células', color: 'verde', nodos: ['Vía paracelular'] }
            ] }
        ]
    });

    montarVisual('fisio-hormonal', {
        guia: 'Cuatro hormonas ajustan el final de la nefrona, cada una con su estímulo y su efecto.',
        paneles: [
            panelNefronaViva([['deshidratacion', 'ADH máxima'], ['normal|espironolactona', 'Sin aldosterona: espironolactona']]),
            { tipo: 'comparar', titulo: 'Qué ajusta cada una', columnas: [
                { titulo: 'Retienen agua o Na⁺', color: 'dorado', nodos: ['ADH (vasopresina)', 'Aldosterona'] },
                { titulo: 'Elimina Na⁺', color: 'verde', nodos: ['Péptido natriurético atrial'] },
                { titulo: 'Calcio', color: 'purpura', nodos: ['Hormona paratiroidea'] }
            ] }
        ]
    });

    montarVisual('fisio-endocrino', {
        guia: 'El riñón también es una glándula.',
        paneles: [
            { tipo: 'racimos', titulo: 'Lo que fabrica', grupos: [
                { titulo: 'Hormonas', color: 'rojo', nodos: ['Eritropoyetina', 'Renina y SRAA', 'Calcitriol'] },
                { titulo: 'Otros', color: 'dorado', nodos: ['Otros mediadores vasoactivos', 'Otras funciones metabólicas'] }
            ] }
        ]
    });

    montarVisual('fisio-agua-regulacion', {
        guia: 'Dónde está el agua, quién la regula y qué hace el riñón según la osmolalidad.',
        paneles: [
            panelNefronaViva([['deshidratacion', 'Deshidratación'], ['agua', 'Bebe mucha agua']]),
            { tipo: 'barras', titulo: 'Dónde está el agua (% del peso)', tabla: 1, series: [{ col: 1, nombre: '% del peso corporal', color: 'dorado' }] },
            { tipo: 'calculadora', titulo: 'Osmorregulación (simulador de la ficha)', campos: ['#agua-osm'],
              resultado: ['#fisio-agua-regulacion .tfg-vasos', '#fisio-agua-regulacion .tfg-resultados', '#agua-estado'] },
            { tipo: 'flujo', titulo: 'La ADH, de principio a fin', nodos: [
                [{ fuente: 'Estímulo osmótico', color: 'amarillo' }, { fuente: 'Estímulo no osmótico', color: 'rojo' }],
                { fuente: 'Mecanismo de acción (V2)', color: 'dorado' },
                { fuente: 'Rango de la osmolalidad urinaria', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Sodio y agua: dos sistemas distintos (tabla)', tabla: 0, color: 'purpura' },
            { tipo: 'selector', titulo: 'Hiponatremia según la volemia', control: '#agua-volemia-select', colores: ['amarillo', 'verde', 'purpura'],
              resultado: ['#agua-volemia-explicacion'] }
        ]
    });

    montarVisual('fisio-hiponatremia', {
        guia: 'Gravedad, causa por volemia, diagnóstico en tres pasos y corrección sin pasarse.',
        paneles: [
            panelNefronaViva([['siadh', 'SIADH'], ['normal|tiazida', 'Tiazida']]),
            { tipo: 'escalera', titulo: 'Gravedad por síntomas', tabla: 1 },
            { tipo: 'comparar', titulo: 'Causas según la volemia', columnas: [
                { titulo: 'Hipovolémica', color: 'amarillo', nodos: [{ fuente: 'Hipovolémica — diuréticos', etiqueta: 'Diuréticos' }, { fuente: 'Hipovolémica — síndrome pierde sal', etiqueta: 'Pierde sal renal' }] },
                { titulo: 'Euvolémica', color: 'verde', nodos: [{ fuente: 'Euvolémica — SIADH', etiqueta: 'SIADH' }, { fuente: 'Euvolémica — otras', etiqueta: 'Otras' }] },
                { titulo: 'Hipervolémica', color: 'purpura', nodos: [{ fuente: 'Hipervolémica', etiqueta: 'ICC, cirrosis, nefrótico' }] }
            ] },
            { tipo: 'flujo', titulo: 'Diagnóstico en tres pasos', nodos: [
                { fuente: '1º', etiqueta: '1º ¿Hipoosmolar de verdad?', color: 'amarillo' },
                { fuente: '2º', etiqueta: '2º ¿Orina diluida o no?', color: 'dorado' },
                { fuente: '3º', etiqueta: '3º ¿Cómo está el volumen?', color: 'verde' }
            ] },
            { tipo: 'calculadora', titulo: 'Efecto de 1 litro de suero (Adrogué-Madias, de la ficha)',
              campos: ['#correc-peso', '#correc-sexo', '#correc-na-actual', '#correc-suero'], resultado: ['#correc-resultado'] },
            { tipo: 'racimos', titulo: 'Tratamiento', grupos: [
                { titulo: 'Límites', color: 'rojo', nodos: ['Riesgo de sobrecorrección'] },
                { titulo: 'Protocolo del hospital', color: 'dorado', nodos: [{ fuente: 'Hiponatremias graves y/o agudas', etiqueta: 'Graves o agudas: hipertónico' }, { fuente: 'Hiponatremias leves y/o crónicas', etiqueta: 'Leves o crónicas: índice de Fürst' }] },
                { titulo: 'Situaciones', color: 'verde', nodos: ['Tratamiento crónico del SIADH', 'iSGLT2 en el SIADH', 'ClK y su efecto sobre la natremia', 'Hiponatremia del cirrótico'] }
            ] },
            { tipo: 'racimos', titulo: 'SIADH frente a pierde sal (tabla)', tabla: 5, color: 'purpura' }
        ]
    });

    montarVisual('fisio-hipernatremia', {
        guia: 'Falta agua, no sobra sodio: causas, el patrón de cada diabetes insípida y cómo tratar.',
        paneles: [
            panelNefronaViva([['di', 'Diabetes insípida']]),
            { tipo: 'racimos', titulo: 'Causas por mecanismo', tabla: 0, color: 'rojo' },
            { tipo: 'matriz', titulo: 'Patrón de laboratorio en la poliuria', tabla: 2, flechas: true },
            { tipo: 'flujo', titulo: 'Cómo se diferencia', nodos: [
                { fuente: 'Test de deprivación hídrica', color: 'amarillo' },
                { fuente: 'Copeptina', color: 'dorado' },
                { fuente: 'Protocolo del test de deshidratación', etiqueta: 'Protocolo del hospital (2 fases)', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Interpretación del test (tabla del protocolo)', tabla: 3, color: 'dorado' },
            { tipo: 'selector', titulo: 'Poliuria: ¿cuál es?', control: '#agua-di-select', colores: ['purpura', 'rojo', 'verde'], resultado: ['#agua-di-explicacion'] },
            { tipo: 'flujo', titulo: 'Tratamiento', nodos: [
                { fuente: 'Principio general', color: 'rojo' },
                { fuente: 'Cálculo del déficit de agua', color: 'amarillo' },
                [{ fuente: 'Tratamiento de la DI central', color: 'dorado' }, { fuente: 'Tratamiento de la DI nefrogénica', color: 'purpura' }]
            ] }
        ]
    });

    montarVisual('fisio-potasio-regulacion', {
        guia: 'El 98% del K⁺ está dentro de la célula: la bomba lo reparte y el riñón decide cuánto sale.',
        paneles: [
            { tipo: 'flujo', titulo: 'El camino del K⁺', nodos: [
                { fuente: 'Mecanismo', etiqueta: 'La bomba Na⁺/K⁺-ATPasa lo mete en la célula', color: 'dorado' },
                { fuente: 'Túbulo proximal', color: 'amarillo' },
                { fuente: 'Nefrona distal', color: 'verde' }
            ] },
            { tipo: 'selector', titulo: 'Qué mueve el K⁺ entre plasma y célula', control: '#k-factor-select', forma: 'chips', color: 'dorado',
              resultado: ['#k-factor-explicacion'] },
            { tipo: 'racimos', titulo: 'Qué regula la eliminación renal (tabla)', tabla: 1, color: 'verde' }
        ]
    });

    montarVisual('fisio-acidobase-acidosis', {
        guia: 'Clasifica la gasometría y busca la causa por el hiato aniónico.',
        paneles: [
            { tipo: 'calculadora', titulo: 'Clasificador de gasometrías (de la ficha)',
              campos: ['#ab-ph', '#ab-pco2', '#ab-hco3', '#ab-na', '#ab-cl'], resultado: ['#ab-clasificador-resultado'] },
            { tipo: 'racimos', titulo: 'Compensación esperada', tabla: 0, color: 'dorado' },
            { tipo: 'comparar', titulo: 'Acidosis metabólica: ¿hiato alto o normal?', columnas: [
                { titulo: 'Hiato elevado', color: 'rojo', nodos: ['Cetoacidosis diabética', 'Acidosis láctica', 'Intoxicación por alcoholes', 'Acidosis piroglutámica'] },
                { titulo: 'Hiato normal', color: 'verde', nodos: ['Pérdidas gastrointestinales', 'Acidosis tubular renal', 'ATR tipo IV', 'Acidosis en la ERC', 'Suero salino 0,9%'] }
            ] },
            { tipo: 'matriz', titulo: 'Diarrea frente a las ATR', tabla: 2, flechas: true }
        ]
    });

    montarVisual('fisio-acidobase-alcalosis', {
        guia: 'La orina dice la causa de una alcalosis metabólica; y los trastornos mixtos, cómo se combinan.',
        paneles: [
            { tipo: 'matriz', titulo: 'Iones en orina según la causa', tabla: 2, flechas: true },
            { tipo: 'selector', titulo: 'Alcalosis hipopotasémica sin HTA', control: '#ab-alcalosis-select', forma: 'chips', color: 'amarillo',
              resultado: ['#ab-alcalosis-explicacion'] },
            { tipo: 'racimos', titulo: 'Tratamiento según la situación (tabla)', tabla: 3, color: 'verde' },
            { tipo: 'racimos', titulo: 'Trastornos mixtos (tabla)', tabla: 5, color: 'purpura' }
        ]
    });

    montarVisual('fisio-hipocalcemia', {
        guia: 'Corrige por albúmina, mira la PTH y lee el patrón.',
        paneles: [
            { tipo: 'calculadora', titulo: 'Calcio corregido (calculadora de la ficha)', campos: ['#ca-corr-total', '#ca-corr-albumina'],
              resultado: ['#ca-corr-resultado'] },
            { tipo: 'selector', titulo: '¿Cómo está la PTH?', control: '#ca-hipo-select', colores: ['purpura', 'rojo'], resultado: ['#ca-hipo-explicacion'] },
            { tipo: 'matriz', titulo: 'Patrón de laboratorio por causa', tabla: 1, flechas: true },
            { tipo: 'racimos', titulo: 'Causas, una a una', grupos: [
                { titulo: 'Causas', color: 'dorado', nodos: ['Hipoparatiroidismo postquirúrgico', 'Hipoparatiroidismo hereditario y autoinmune', 'Déficit de vitamina D', 'Alteraciones del magnesio', 'Pseudohipoparatiroidismo', 'Fármacos y otras causas'] }
            ] },
            { tipo: 'flujo', titulo: 'Tratamiento', nodos: [
                { fuente: 'Agudo (sintomático)', color: 'rojo' },
                { fuente: 'Crónico', color: 'verde' }
            ] }
        ]
    });

    montarVisual('fisio-hipercalcemia', {
        guia: 'Dónde golpea, cómo se distingue la causa y el orden del tratamiento.',
        paneles: [
            { tipo: 'mapa', titulo: 'Clínica por sistemas', nodos: [
                { fuente: 'SNC', organo: 'cabeza' },
                { fuente: 'Neuromuscular periférico', organo: 'brazoDcho' },
                { fuente: 'Cardiovascular', organo: 'corazon' },
                { fuente: 'Gastrointestinal', organo: 'intestino' },
                { fuente: 'Renal', organo: 'rinon' }
            ] },
            { tipo: 'comparar', titulo: 'Causas', columnas: [
                { titulo: 'Mediadas por PTH', color: 'purpura', tabla: 0 },
                { titulo: 'No mediadas por PTH', color: 'rojo', tabla: 1 }
            ] },
            { tipo: 'matriz', titulo: 'Patrón de laboratorio por causa', tabla: 3, flechas: true },
            { tipo: 'selector', titulo: 'Diferencial', control: '#ca-hiper-select', colores: ['purpura', 'rojo', 'verde'], resultado: ['#ca-hiper-explicacion'] },
            { tipo: 'flujo', titulo: 'Tratamiento, en orden', tabla: 4, color: 'verde' },
            { tipo: 'racimos', titulo: 'Si no basta', grupos: [
                { titulo: 'Fármacos', color: 'dorado', tabla: 5 },
                { titulo: 'Otras vías', color: 'rojo', nodos: ['Inhibidores de la absorción intestinal', 'Depuración extrarrenal'] }
            ] }
        ]
    });

    montarVisual('fisio-fosforo', {
        guia: 'Por qué baja, por qué sube y qué produce cuando falta.',
        paneles: [
            { tipo: 'comparar', titulo: 'Mecanismos', columnas: [
                { titulo: 'Hipofosfatemia', color: 'purpura', tabla: 0 },
                { titulo: 'Hiperfosfatemia', color: 'rojo', tabla: 4 }
            ] },
            { tipo: 'mapa', titulo: 'Clínica de la hipofosfatemia', color: 'purpura', nodos: [
                { fuente: 'SNC:', etiqueta: 'SNC', organo: 'cabeza' },
                { fuente: 'Cardíaca:', etiqueta: 'Cardíaca', organo: 'corazon' },
                { fuente: 'Músculo-esquelético:', etiqueta: 'Músculo-esquelético', organo: 'brazoDcho' },
                { fuente: 'Metabolismo:', etiqueta: 'Metabolismo', organo: 'higado' },
                { fuente: 'Renal:', etiqueta: 'Renal', organo: 'rinon' },
                { fuente: 'Hematológica:', etiqueta: 'Hematológica', organo: 'medula' },
                { fuente: 'Ósea:', etiqueta: 'Ósea', organo: 'piernaIzda' }
            ] },
            { tipo: 'selector', titulo: 'Mecanismo de la alteración', control: '#p-select', colores: ['purpura', 'purpura', 'purpura', 'rojo', 'rojo'], resultado: ['#p-explicacion'] },
            { tipo: 'racimos', titulo: 'Suplementos de fósforo (tabla)', tabla: 3, color: 'verde' }
        ]
    });

    montarVisual('fisio-magnesio', {
        guia: 'Causas de la hipomagnesemia, qué produce y cómo se trata cada extremo.',
        paneles: [
            { tipo: 'racimos', titulo: 'Causas de hipomagnesemia', tabla: 0, color: 'purpura' },
            { tipo: 'mapa', titulo: 'Clínica de la hipomagnesemia', color: 'purpura', nodos: [
                { fuente: 'Neuromuscular:', etiqueta: 'Neuromuscular', organo: 'brazoDcho' },
                { fuente: 'Cardíaca:', etiqueta: 'Cardíaca', organo: 'corazon' },
                { fuente: 'Metabólica:', etiqueta: 'Metabólica', organo: 'higado' },
                { fuente: 'Esquelética:', etiqueta: 'Esquelética', organo: 'piernaIzda' }
            ] },
            { tipo: 'selector', titulo: 'Mecanismo de la hipomagnesemia', control: '#mg-select', forma: 'chips', color: 'purpura', resultado: ['#mg-explicacion'] },
            { tipo: 'comparar', titulo: 'Tratamiento', columnas: [
                { titulo: 'Hipomagnesemia', color: 'purpura', tabla: 2 },
                { titulo: 'Hipermagnesemia', color: 'rojo', tabla: 3 }
            ] }
        ]
    });
}
