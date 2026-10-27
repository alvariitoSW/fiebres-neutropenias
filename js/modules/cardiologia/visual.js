// Vista Visual de Merino Cardiología (Marino, caps. 14-21; bloque 3): recetas para core/visual-kit.js. En las
// fichas con Estudiar, es el paso «Mira». Cada nodo apunta a su texto por id (`fuente: '#mc-…'`), así que la
// etiqueta y el detalle se leen de la ficha y «Ver en el texto» lleva a su párrafo. Las tablas con cifras se dibujan
// leyendo sus celdas; las calculadoras y selectores de la ficha se conectan sin copiar su lógica. Las cifras de las
// etiquetas son las de la ficha (con su página en el texto); las láminas del libro van en un panel `figuras`.
import { montarVisual } from '../../core/visual-kit.js';

const LAMINAS = { tipo: 'figuras', titulo: 'Las láminas del libro', nota: 'Desliza para verlas; tócalas para ampliarlas.', todas: true };

const RECETAS = {
    /* ---------- Cap. 14 · Shock ---------- */
    'mc-definiciones': {
        guia: 'El shock es un fallo en el uso del O₂, no una cifra de presión. De PAM = GC × RVS + PAD (la presión de la aurícula derecha) salen los cuatro tipos.',
        paneles: [
            { tipo: 'flujo', titulo: 'De la ecuación a los cuatro tipos', nodos: [
                { fuente: '#mc-shock-definicion', etiqueta: 'Shock: la célula no usa bien el O₂', color: 'purpura' },
                { fuente: '#mc-shock-ecuacion', etiqueta: 'PAM = (GC × RVS) + PAD', color: 'dorado' },
                [{ fuente: '#mc-shock-hipovolemico', etiqueta: 'PAD baja: hipovolémico', color: 'rojo' },
                 { fuente: '#mc-shock-cardiogenico', etiqueta: 'GC bajo: cardiogénico', color: 'rojo' },
                 { fuente: '#mc-shock-obstructivo', etiqueta: 'GC bajo: obstructivo', color: 'amarillo' },
                 { fuente: '#mc-shock-vasodilatador', etiqueta: 'RVS baja: vasodilatador', color: 'purpura' }]
            ] },
            { tipo: 'matriz', titulo: 'Tabla 14.1: el patrón de cada shock', nota: 'Cardiogénico y obstructivo comparten patrón: lo separa la causa (la eco), no los números.',
              tabla: '#mc-tabla-14-1', normales: ['normal o alto'], leyenda: ['normal o alto', 'alterado'] },
            { tipo: 'calculadora', titulo: '¿Qué shock es? (selector de la ficha)', campos: ['#mc-shock-pvc', '#mc-shock-gc', '#mc-shock-rvs'], resultado: ['#mc-shock-tipo-resultado'] },
            { tipo: 'comparar', titulo: 'Qué se monitoriza', columnas: [
                { titulo: 'La presión', color: 'dorado', nodos: [
                    { fuente: '#mc-pam-objetivo', etiqueta: 'PAM ≥65, con catéter arterial' },
                    { fuente: '#mc-amplificacion', etiqueta: 'La sistólica se amplifica hasta 20 mmHg' },
                    { fuente: '#mc-pa-precision', etiqueta: 'El manguito puede errar hasta 55 mmHg' }] },
                { titulo: 'La perfusión', color: 'verde', nodos: [
                    { fuente: '#mc-gap-pco2', etiqueta: 'Gap de PCO₂ <6 mmHg' },
                    { fuente: '#mc-diuresis', etiqueta: 'Diuresis >0,5 mL/kg/h' },
                    { fuente: '#mc-scvo2', etiqueta: 'ScvO₂ 65-75 %; ≥80 % en el séptico' }] }
            ] },
            { tipo: 'racimos', titulo: 'Tabla 14.3: cuándo la perfusión no basta', tabla: '#mc-tabla-14-3', color: 'rojo' },
            { tipo: 'comparar', titulo: 'Los objetivos según el tipo', columnas: [
                { titulo: 'Bajo flujo (3 de 4)', color: 'amarillo', nodos: [{ fuente: '#mc-o2-objetivos', etiqueta: 'IC >2,5 · DO₂ >300 · VO₂ >110 · ScvO₂ >50 %' }] },
                { titulo: 'Séptico', color: 'purpura', nodos: [{ fuente: '#mc-septico-excepcion', etiqueta: 'No falta O₂: falla la mitocondria' }] }
            ] },
            { tipo: 'flujo', titulo: 'Volumen y una palabra final', nodos: [
                { fuente: '#mc-vol-ini-septico', etiqueta: 'Séptico: ≥30 mL/kg en 3 h; en general, ≤2 L en 1-2 h', color: 'verde' },
                { fuente: '#mc-hipotension-consecuencia', etiqueta: '¿La hipotensión es la causa o la consecuencia?', color: 'purpura' }
            ] },
            LAMINAS
        ]
    },
    'mc-vasopresores': {
        guia: 'Qué receptor toca cada vasopresor, a qué dosis cambia de efecto y qué hacer si se sale de la vena.',
        paneles: [
            { tipo: 'linea', titulo: 'La norepinefrina según la dosis', nota: 'Cifras de la ficha (pág. 12-13): el efecto cambia con la dosis.', min: 0, max: 40, ticks: [0, 10, 20, 30, 40], unidad: 'µg/min',
              bandas: [{ desde: 0, hasta: 10, texto: 'β: sube el gasto', color: 'verde' }, { desde: 10, hasta: 30, texto: 'α: sube la RVS', color: 'rojo', alinear: 'fin' }], nodos: [
                { fuente: '#mc-norepinefrina', etiqueta: 'Empieza a 5-10, sin carga', en: 5, fila: 'abajo', color: 'verde' },
                { fuente: '#mc-norepinefrina', etiqueta: 'A 30, techo: pensar en otro', en: 30, fila: 'abajo', color: 'rojo' },
                { fuente: '#mc-tabla-14-4', etiqueta: 'Tabla 14.4: hasta 40', en: 40, color: 'gris' }
            ] },
            { tipo: 'linea', titulo: 'La dopamina en tres escalones', nota: 'Cifras de la ficha (pág. 14-15).', min: 0, max: 20, ticks: [0, 3, 10, 20], unidad: 'µg/kg/min',
              bandas: [{ desde: 0, hasta: 3, texto: 'dopaminérgico', color: 'verde' }, { desde: 3, hasta: 10, texto: 'β', color: 'amarillo' }, { desde: 10, hasta: 20, texto: 'α', color: 'rojo', alinear: 'fin' }], nodos: [
                { fuente: '#mc-dopamina', etiqueta: '≤3: flujo renal y esplácnico', en: 2, fila: 'abajo', color: 'verde' },
                { fuente: '#mc-dopamina', etiqueta: '3-10: sube el volumen sistólico', en: 6, fila: 'abajo', color: 'amarillo' },
                { fuente: '#mc-dopamina', etiqueta: '>10: vasoconstricción', en: 15, color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Los vasopresores de la ficha', grupos: [
                { titulo: 'Catecolaminas', color: 'rojo', nodos: ['#mc-norepinefrina', '#mc-epinefrina', '#mc-dopamina', '#mc-fenilefrina'] },
                { titulo: 'Sin receptor adrenérgico', color: 'purpura', nodos: ['#mc-vasopresina', '#mc-angiotensina'] },
                { titulo: 'Oral', color: 'gris', nodos: ['#mc-midodrina'] }
            ] },
            { tipo: 'selector', titulo: '¿Qué agente para este escenario? (selector de la ficha)', control: '#mc-vasopresor-escenario', forma: 'chips', color: 'dorado', resultado: ['#mc-vasopresor-escenario-resultado'] },
            { tipo: 'flujo', titulo: 'La vía y la extravasación', nodos: [
                { fuente: '#mc-via-periferica', etiqueta: 'Vía periférica hasta 48 h; línea media, 7 días', color: 'verde' },
                { fuente: '#mc-extravasacion', etiqueta: 'Extravasación: parar, aspirar sin lavar y fentolamina antes de 12 h', color: 'rojo' },
                { fuente: '#mc-vaso-pam', etiqueta: 'Objetivo: PAM ≥65', color: 'dorado' },
                { fuente: '#mc-seguridad-na', etiqueta: 'La NA inmunosuprime: una señal de alarma', color: 'amarillo' }
            ] }
        ]
    },

    /* ---------- Cap. 15 · Shock hemorrágico ---------- */
    'mc-hemorragico-clasificacion': {
        guia: 'Cuánta sangre hay, cómo se defiende el cuerpo y por qué la Hb del ingreso no mide lo perdido.',
        paneles: [
            { tipo: 'grados', titulo: 'Tabla 15.1: las cuatro clases', nota: 'Toca una clase para ver todas sus filas.', tabla: '#mc-tabla-15-1', filasResumen: [0, 6, 7] },
            { tipo: 'flujo', titulo: 'Cómo se defiende el cuerpo', nodos: [
                { fuente: '#mc-volemia', etiqueta: 'Volemia: 66 mL/kg (varón) · 60 (mujer)', color: 'dorado' },
                { fuente: '#mc-compensacion', etiqueta: 'Relleno transcapilar (hasta 1 L), simpático, ADH y renina', color: 'verde' },
                [{ fuente: '#mc-clase-ii', etiqueta: 'Clase II: aguanta apretando los vasos', color: 'amarillo' }, { fuente: '#mc-clase-iii', etiqueta: 'Clase III: ya no basta', color: 'rojo' }]
            ] },
            { tipo: 'calculadora', titulo: 'Clasificador de la ficha', campos: ['#mc-clase-perdida'], etiquetas: { '#mc-clase-perdida': 'Sangre perdida (% de la volemia)' }, resultado: ['#mc-clase-resultado'] },
            { tipo: 'flujo', titulo: 'La trampa de la Hb', nodos: [
                { fuente: '#mc-hto-trampa', etiqueta: 'Se pierde sangre entera: el Hto no cambia', color: 'purpura' },
                { fuente: '#mc-hto-fluido', etiqueta: 'El salino lo diluye; la sangre completa no', color: 'amarillo' },
                { fuente: '#mc-hto-reanimacion', etiqueta: 'Las primeras horas miden la reanimación', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Fig. 15.6: objetivos en el shock hemorrágico', tabla: '#mc-fig-15-6', color: 'verde' },
            LAMINAS
        ]
    },
    'mc-hemorragico-fluidos': {
        guia: 'Por dónde entra rápido el volumen, qué hace cada fluido y cuánto hace falta en la Clase II.',
        paneles: [
            { tipo: 'barras', titulo: 'Fig. 15.2: flujo por gravedad (L/h)', nota: 'Corto y grueso gana: el central de 8" pasa la quinta parte.', tabla: '#mc-fig-15-2',
              series: [{ col: 1, nombre: '16 G', color: 'verde' }, { col: 2, nombre: '18 G', color: 'dorado' }] },
            { tipo: 'barras', titulo: 'Tabla 15.3: los hematíes, según cómo se pasan (mL/min)', tabla: '#mc-tabla-15-3',
              series: [{ col: 1, nombre: '18 G', color: 'dorado' }, { col: 2, nombre: '16 G', color: 'verde' }, { col: 3, nombre: '7 Fr', color: 'rojo' }] },
            { tipo: 'barras', titulo: 'Fig. 15.3: cuánto sube el IC cada fluido', nota: 'Lectura aproximada de la figura (sin cifras en el libro).', tabla: '#mc-fig-15-3',
              series: [{ col: 1, nombre: 'a los 30 min', color: 'amarillo' }, { col: 2, nombre: 'a los 60 min', color: 'verde' }] },
            { tipo: 'racimos', titulo: 'Los fluidos y la sangre', grupos: [
                { titulo: 'Tabla 15.2', color: 'dorado', tabla: '#mc-tabla-15-2' },
                { titulo: 'Hemoderivados', color: 'rojo', nodos: ['#mc-hematies', '#mc-plasma', '#mc-crio', '#mc-sangre-completa', '#mc-sangre-o'] }
            ] },
            { tipo: 'calculadora', titulo: 'Tabla 15.4: volumen para una Clase II (calculadora de la ficha)', campos: ['#mc-vr-peso', '#mc-vr-sexo', '#mc-vr-perdida', '#mc-vr-fluido'], resultado: ['#mc-vr-resultado'] },
            { tipo: 'comparar', titulo: 'Dos trampas', columnas: [
                { titulo: 'El catéter', color: 'amarillo', nodos: [{ fuente: '#mc-introductor', etiqueta: 'Puerto lateral del introductor: solo el 25 %' }] },
                { titulo: 'La hemorragia sin shock', color: 'verde', nodos: [{ fuente: '#mc-hemorragia-sin-shock', etiqueta: 'Hb 7-8 · PFC si INR >1,5 · plaquetas si <50.000' }] }
            ] }
        ]
    },
    'mc-damage-control': {
        guia: 'Los cuatro pilares del control de daños, la coagulopatía del trauma y cómo la TEG guía cada bolsa.',
        paneles: [
            { tipo: 'flujo', titulo: 'Reanimación de control de daños', nodos: [
                { fuente: '#mc-dcr', etiqueta: 'Fuente, hipotensión permisiva, pocos cristaloides, sangre entera', color: 'dorado' },
                { fuente: '#mc-hipotension-permisiva', etiqueta: 'PAS 80-90 o PAM 50, vigilando lactato y diuresis', color: 'amarillo' },
                [{ fuente: '#mc-coagulopatia', etiqueta: 'Acidosis, frío y dilución', color: 'rojo' }, { fuente: '#mc-tic', etiqueta: 'TIC: la proteína C activada', color: 'rojo' }]
            ] },
            { tipo: 'flujo', titulo: 'Fig. 15.4: reanimación hemostática', nodos: [
                { fuente: '#mc-fig-15-4', etiqueta: 'Hematíes y PFC 1:1, plaquetas cada 5', color: 'rojo' },
                { fuente: '#mc-fig-15-4', etiqueta: 'Calentar a 37 °C', color: 'amarillo' },
                { fuente: '#mc-fig-15-4', etiqueta: 'Calcio, crio si fibrinógeno <100, ácido tranexámico', color: 'verde' },
                { fuente: '#mc-hemostasia-objetivos', etiqueta: 'Fibrinógeno >100 · INR <1,5 · plaquetas ≥100.000', color: 'dorado' }
            ] },
            { tipo: 'calculadora', titulo: 'Tabla 15.5: terapia guiada por TEG (intérprete de la ficha)', campos: ['#mc-teg-r', '#mc-teg-k', '#mc-teg-alfa', '#mc-teg-ma', '#mc-teg-ly30'], resultado: ['#mc-teg-resultado'] },
            { tipo: 'flujo', titulo: 'Después de reanimar', nodos: [
                { fuente: '#mc-postresucitacion', etiqueta: '48-72 h: fallo multiorgánico, el pulmón primero', color: 'rojo' },
                { fuente: '#mc-dcr-resumen', etiqueta: 'El resumen práctico', color: 'dorado' }
            ] },
            LAMINAS
        ]
    },

    /* ---------- Cap. 16 · Shock cardiogénico ---------- */
    'mc-cardiogenico-fisio': {
        guia: 'Por qué falla la bomba tras un infarto, qué la rompe y qué separa el shock de la insuficiencia cardíaca.',
        paneles: [
            { tipo: 'barras', titulo: 'Fig. 16.1: mecanismos del shock por IAM', tabla: '#mc-fig-16-1', series: [{ col: 1, nombre: '% de los casos', color: 'rojo' }] },
            { tipo: 'racimos', titulo: 'Las roturas, en las primeras 24 h', grupos: [
                { titulo: 'Roturas', color: 'rojo', nodos: ['#mc-papilar', '#mc-septo-rotura', '#mc-pared-libre'] },
                { titulo: 'Otras causas (Tabla 16.1)', color: 'amarillo', nodos: ['#mc-tsvi-dinamico', '#mc-postcardiotomia', '#mc-periparto', '#mc-cs-obstructivo'] }
            ] },
            { tipo: 'flujo', titulo: 'Los cambios hemodinámicos', nodos: [
                { fuente: '#mc-cs-hemodinamica', etiqueta: 'GC ↓, presiones de llenado ↑, RVS ↑', color: 'rojo' },
                [{ fuente: '#mc-cs-vd', etiqueta: 'Falla el VD: PVC/PCP ↑', color: 'purpura' }, { fuente: '#mc-cs-excepciones', etiqueta: 'Excepciones: PCP normal en el 30 %', color: 'amarillo' }],
                [{ fuente: '#mc-cs-microcirculacion', etiqueta: 'La microcirculación', color: 'verde' }, { fuente: '#mc-cs-inflamacion', etiqueta: 'Inflamación sistémica: RVS más baja', color: 'rojo' }]
            ] },
            { tipo: 'selector', titulo: '¿Qué perfil tengo delante? (selector de la ficha)', control: '#mc-cardiogenico-perfil-select', forma: 'chips', color: 'rojo', resultado: ['#mc-cardiogenico-perfil-resultado'] }
        ]
    },
    'mc-cardiogenico-farmaco': {
        guia: 'Primero el llenado, luego la presión y después la fuerza; y no tardar en pasar al soporte mecánico.',
        paneles: [
            { tipo: 'calculadora', titulo: 'Tabla 16.2: ¿estoy en objetivo? (calculadora de la ficha)',
              campos: ['#mc-obj-pcp', '#mc-obj-ic', '#mc-obj-irvs', '#mc-obj-pam', '#mc-obj-gap', '#mc-obj-diuresis', '#mc-obj-svo2', '#mc-obj-lactato'], resultado: ['#mc-objetivos-resultado'] },
            { tipo: 'flujo', titulo: 'El orden del tratamiento', nodos: [
                { fuente: '#mc-llenado-optimo', etiqueta: 'Volumen hasta PCP 18-20', color: 'verde' },
                { fuente: '#mc-cs-vasopresor', etiqueta: 'Norepinefrina: PAM ≥65', color: 'amarillo' },
                { fuente: '#mc-cs-inotropicos', etiqueta: 'Inotrópico (no en la obstrucción del TSVI)', color: 'rojo' },
                { fuente: '#mc-carga-trabajo', etiqueta: 'Si no mejora pronto: soporte mecánico', color: 'purpura' }
            ] },
            { tipo: 'comparar', titulo: 'Tabla 16.3: los tres inotrópicos', columnas: [
                { titulo: 'Dobutamina', color: 'amarillo', nodos: [{ fuente: '#mc-dobutamina', etiqueta: 'β₁: FC +5-15 lpm' }] },
                { titulo: 'Milrinona', color: 'rojo', nodos: [{ fuente: '#mc-milrinona', etiqueta: 'Inhibe la PDE: hipotensión' }] },
                { titulo: 'Levosimendán', color: 'verde', nodos: [{ fuente: '#mc-levosimendan', etiqueta: 'Sensibiliza al calcio; 24 h' }] }
            ] }
        ]
    },
    'mc-soporte-mecanico': {
        guia: 'Tres aparatos para ganar tiempo: el balón descarga, el Impella empuja y el ECMO hace de corazón y pulmón.',
        paneles: [
            { tipo: 'comparar', titulo: 'Balón, Impella y ECMO', columnas: [
                { titulo: 'Balón', color: 'dorado', nodos: [{ fuente: '#mc-iabp', etiqueta: 'Se infla en la diástole; 35-40 mL de helio' }] },
                { titulo: 'Impella', color: 'verde', nodos: [{ fuente: '#mc-impella', etiqueta: 'Flujo continuo VI → aorta, 2,5-5,5 L/min' }] },
                { titulo: 'ECMO VA', color: 'rojo', nodos: [{ fuente: '#mc-ecmo', etiqueta: 'Vena → arteria, 5-6 L/min; sube la poscarga del VI' }] }
            ] },
            { tipo: 'selector', titulo: 'Selección de dispositivo (selector de la ficha)', control: '#mc-dispositivo-select', forma: 'chips', color: 'purpura', resultado: ['#mc-dispositivo-resultado'] },
            { tipo: 'flujo', titulo: 'Resultados y elección', nodos: [
                { fuente: '#mc-mcs-resultados', etiqueta: 'Supervivencia al alta con ECMO: 42 %', color: 'amarillo' },
                { fuente: '#mc-mcs-seleccion', etiqueta: 'ECMO si hay fallo respiratorio', color: 'verde' }
            ] },
            LAMINAS
        ]
    },

    /* ---------- Cap. 17 · Shock inflamatorio ---------- */
    'mc-inflamacion-ros': {
        guia: 'El neutrófilo quema O₂ para fabricar lejía; cuando la inflamación se descontrola, daña al propio paciente.',
        paneles: [
            { tipo: 'flujo', titulo: 'Fig. 17.1: el estallido respiratorio', nodos: [
                { fuente: '#mc-estallido', etiqueta: 'El neutrófilo multiplica ×20 su consumo de O₂', color: 'amarillo' },
                { fuente: '#mc-fig-17-1', etiqueta: 'NADPH oxidasa: O₂ → superóxido → H₂O₂', color: 'rojo' },
                [{ fuente: '#mc-fig-17-1', etiqueta: 'Con hierro: radical hidroxilo', color: 'rojo' }, { fuente: '#mc-fig-17-1', etiqueta: 'Con mieloperoxidasa: hipoclorito', color: 'purpura' }]
            ] },
            { tipo: 'flujo', titulo: 'Del microbio al paciente', nodos: [
                { fuente: '#mc-lesion-oxidante', etiqueta: 'Estrés oxidante: ROS > antioxidantes', color: 'rojo' },
                { fuente: '#mc-endotelio', etiqueta: 'Superóxido + NO → peroxinitrito', color: 'purpura' },
                { fuente: '#mc-inflamacion-maligna', etiqueta: 'Inflamación maligna: se autoperpetúa', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Tabla 17.1: el órgano y su nombre', tabla: '#mc-tabla-17-1', color: 'amarillo' },
            { tipo: 'barras', titulo: 'Fig. 17.2: mortalidad por órganos fallados', nota: 'Lectura aproximada del gráfico.', tabla: '#mc-fig-17-2',
              series: [{ col: 1, nombre: 'EE. UU.', color: 'rojo' }, { col: 2, nombre: 'Europa', color: 'dorado' }] }
        ]
    },
    'mc-shock-septico': {
        guia: 'Vasos abiertos, una mitocondria que no usa el O₂ y cuatro pilares del manejo inicial.',
        paneles: [
            { tipo: 'flujo', titulo: 'Qué pasa en el shock séptico', nodos: [
                { fuente: '#mc-sepsis-definiciones', etiqueta: 'Vasopresor y lactato >2', color: 'purpura' },
                [{ fuente: '#mc-sepsis-hemodinamica', etiqueta: 'Vasodilatación y fuga; GC normal o alto', color: 'rojo' }, { fuente: '#mc-mitocondria', etiqueta: 'La mitocondria no usa el O₂', color: 'amarillo' }],
                { fuente: '#mc-sepsis-monitorizacion', etiqueta: 'ScvO₂ alta engaña; el gap de PCO₂, no', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Tabla 17.2: el manejo inicial', tabla: '#mc-tabla-17-2', color: 'dorado' },
            { tipo: 'flujo', titulo: 'El manejo, en orden', nodos: [
                { fuente: '#mc-antimicrobianos', etiqueta: 'Antibiótico en la 1.ª hora, tras 2 sets de 20 mL', color: 'rojo' },
                { fuente: '#mc-sepsis-volumen', etiqueta: 'En 3 h: 30 mL/kg de peso ideal; luego igualar pérdidas', color: 'verde' },
                { fuente: '#mc-sepsis-vasopresores', etiqueta: 'NA → vasopresina → adrenalina', color: 'amarillo' },
                { fuente: '#mc-corticoides', etiqueta: 'Hidrocortisona 50 mg/6 h si NA ≥0,25', color: 'purpura' }
            ] }
        ]
    },
    'mc-shock-toxico': {
        guia: 'Una toxina que enciende a los linfocitos: fallo multiorgánico en 48 h. Estafilococo frente a estreptococo.',
        paneles: [
            { tipo: 'racimos', titulo: 'Tabla 17.3: estafilocócico frente a estreptocócico', tabla: '#mc-tabla-17-3', color: 'amarillo' },
            { tipo: 'requisitos', modo: 'ninguno', sinPuerta: true, iconoMarcado: '☑', titulo: '¿Estafilocócico o estreptocócico? (selector de la ficha)', items: [{ checks: '.mc-tss-check' }], resultado: ['#mc-tss-resultado'] },
            { tipo: 'flujo', titulo: 'Del exantema al desbridamiento', nodos: [
                { fuente: '#mc-tss-patogenia', etiqueta: 'Toxinas → linfocitos T → tormenta de citocinas', color: 'rojo' },
                { fuente: '#mc-tss-clinica-texto', etiqueta: 'Exantema y fallo de órganos en 48 h', color: 'amarillo' },
                { fuente: '#mc-tss-diagnostico', etiqueta: 'Dolor desproporcionado: RM o eco', color: 'purpura' },
                { fuente: '#mc-tss-manejo', etiqueta: 'Clindamicina en todos; quitar o desbridar la fuente', color: 'verde' }
            ] }
        ]
    },
    'mc-anafilaxia': {
        guia: 'Solo la adrenalina frena la reacción. Si falla en quien toma betabloqueantes, el glucagón; y siempre volumen.',
        paneles: [
            { tipo: 'barras', titulo: 'Tabla 17.4: cuánto aparece cada signo', tabla: '#mc-tabla-17-4', series: [{ col: 1, nombre: '% de las anafilaxias', color: 'rojo' }] },
            { tipo: 'escalera', titulo: 'Tabla 17.5: cuatro diluciones de adrenalina', nota: 'Cada dilución, para una cosa: confundirlas es un error grave.', tabla: '#mc-tabla-17-5' },
            { tipo: 'comparar', titulo: 'Para la reacción o solo alivia', columnas: [
                { titulo: 'Para la reacción', color: 'verde', nodos: [{ fuente: '#mc-adrenalina-im', etiqueta: 'Adrenalina IM 0,3-0,5 mg en el muslo' }] },
                { titulo: 'Solo alivia', color: 'gris', nodos: [{ fuente: '#mc-segunda-linea', etiqueta: 'Antihistamínicos y broncodilatadores' }, { fuente: '#mc-anafilaxia-corticoides', etiqueta: 'Corticoides: ningún papel agudo' }] }
            ] },
            { tipo: 'flujo', titulo: 'Más allá de la adrenalina', nodos: [
                { fuente: '#mc-anaf-volumen', etiqueta: 'Shock: hasta el 35 % del volumen se escapa', color: 'rojo' },
                { fuente: '#mc-glucagon', etiqueta: 'Con betabloqueante: glucagón', color: 'amarillo' },
                { fuente: '#mc-kounis', etiqueta: 'Kounis: el SCA que se pasa por alto', color: 'purpura' }
            ] }
        ]
    },

    /* ---------- Cap. 18 · Insuficiencia cardíaca aguda ---------- */
    'mc-ic-tipos': {
        guia: 'Sistólica o diastólica, izquierda o derecha, y las tres etapas: primero sube la presión de llenado.',
        paneles: [
            { tipo: 'grados', titulo: 'Tabla 18.1: la IC según la FEVI', tabla: '#mc-tabla-18-1', filasResumen: [] },
            { tipo: 'flujo', titulo: 'Las tres etapas de la IC izquierda', nota: 'La Fig. 18.3 es el registro real de un paciente.', nodos: [
                { fuente: '#mc-ic-etapas', etiqueta: '1 · Sube la presión de enclavamiento: disnea', color: 'amarillo' },
                { fuente: '#mc-ic-etapas', etiqueta: '2 · Baja el VS y sube la FC', color: 'rojo' },
                { fuente: '#mc-ic-etapas', etiqueta: '3 · Cae el gasto: descompensada', color: 'purpura' }
            ] },
            { tipo: 'comparar', titulo: 'Izquierda y derecha', columnas: [
                { titulo: 'HFpEF', color: 'amarillo', nodos: [{ fuente: '#mc-hfpef', etiqueta: '≥50 % de las IC izquierdas' }] },
                { titulo: 'IC derecha', color: 'purpura', nodos: [{ fuente: '#mc-ic-derecha', etiqueta: 'La PVC tarda en subir' }, { fuente: '#mc-vd-septo', etiqueta: 'El tabique empuja al VI' }] }
            ] },
            { tipo: 'racimos', titulo: 'Las consecuencias', grupos: [
                { titulo: 'Congestión', color: 'rojo', nodos: [{ fuente: '#mc-congestion', etiqueta: 'La congestión domina la clínica' }, '#mc-cardiorrenal'] },
                { titulo: 'Biomarcadores', color: 'verde', nodos: [{ fuente: '#mc-bnp', etiqueta: 'BNP <100: excluye mejor que confirma' }] }
            ] },
            LAMINAS
        ]
    },
    'mc-ic-manejo': {
        guia: 'La presión arterial decide: vasodilatador si está alta, diurético si es normal, y cuidado con el exceso de diurético.',
        paneles: [
            { tipo: 'comparar', titulo: 'La PA decide el primer paso', columnas: [
                { titulo: 'PA alta', color: 'rojo', nodos: [{ fuente: '#mc-ic-pa-alta', etiqueta: 'Vasodilatador primero' }, '#mc-nitroglicerina', '#mc-nitroprusiato'] },
                { titulo: 'PA normal', color: 'verde', nodos: [{ fuente: '#mc-ic-pa-normal', etiqueta: 'Diurético en la primera hora' }, { fuente: '#mc-furosemida', etiqueta: 'Furosemida: 40 mg; doblar a las 2 h' }] }
            ] },
            { tipo: 'flujo', titulo: 'Cuidado con los diuréticos', nodos: [
                { fuente: '#mc-diureticos-preocupaciones', etiqueta: 'La furosemida IV baja el gasto', color: 'rojo' },
                [{ fuente: '#mc-resistencia-furosemida', etiqueta: 'Resistencia', color: 'amarillo' }, { fuente: '#mc-infusion-continua', etiqueta: 'Infusión continua', color: 'amarillo' }],
                { fuente: '#mc-vpp', etiqueta: 'La CPAP baja la poscarga del VI', color: 'verde' },
                { fuente: '#mc-ic-final', etiqueta: 'Diurético limitado, mejores resultados', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Tabla 18.5: a largo plazo, en la HFrEF', tabla: '#mc-tabla-18-5', color: 'verde' }
        ]
    },

    /* ---------- Cap. 19 · Taquiarritmias ---------- */
    'mc-taqui-reconocimiento': {
        guia: 'Tres preguntas al ECG, en orden: el QRS, el R-R y la aurícula.',
        paneles: [
            { tipo: 'flujo', titulo: 'Fig. 19.1: el flujograma', nodos: [
                { fuente: '#mc-taqui-hallazgos', etiqueta: 'QRS · R-R · aurícula', color: 'dorado' },
                [{ fuente: '#mc-qrs-estrecho-regular', etiqueta: 'Estrecho y regular: sinusal, nodal o flutter', color: 'verde' },
                 { fuente: '#mc-qrs-estrecho-irregular', etiqueta: 'Estrecho e irregular: TAM o FA', color: 'amarillo' },
                 { fuente: '#mc-qrs-ancho', etiqueta: 'Ancho: TV o aberrancia', color: 'rojo' }]
            ] },
            LAMINAS
        ]
    },
    'mc-fa-frecuencia': {
        guia: 'La FA quita la patada auricular; frenar el nodo es el objetivo, y el déficit de pulso, el punto final.',
        paneles: [
            { tipo: 'racimos', titulo: 'Lo que hace la FA', grupos: [
                { titulo: 'Dónde aparece', color: 'dorado', nodos: ['#mc-fa-epidemiologia', '#mc-fa-hospital'] },
                { titulo: 'Consecuencias', color: 'rojo', nodos: ['#mc-fa-consecuencias'] }
            ] },
            { tipo: 'racimos', titulo: 'Tabla 19.1: control agudo de la frecuencia', tabla: '#mc-tabla-19-1', color: 'verde' },
            { tipo: 'selector', titulo: '¿Qué fármaco para este paciente? (selector de la ficha)', control: '#mc-fa-farmaco-select', forma: 'chips', color: 'verde', resultado: ['#mc-fa-farmaco-resultado'] },
            { tipo: 'flujo', titulo: 'Cuánto y hasta dónde', nodos: [
                { fuente: '#mc-fig-19-5', etiqueta: 'El diltiazem frena antes (Fig. 19.5)', color: 'verde' },
                { fuente: '#mc-amiodarona-iv', etiqueta: 'Amiodarona: menos hipotensión', color: 'amarillo' },
                { fuente: '#mc-fa-punto-final', etiqueta: 'Punto final: el déficit de pulso', color: 'purpura' }
            ] },
            LAMINAS
        ]
    },
    'mc-fa-cardioversion': {
        guia: 'A quién cardiovertir, a quién anticoagular y con qué; y por qué el WPW cambia todo.',
        paneles: [
            { tipo: 'puntos', titulo: 'Tabla 19.2: CHA₂DS₂-VASc (calculadora de la ficha)', resultado: ['#mc-cha2ds2-resultado'], items: [
                { checks: '#mc-cha-chf, #mc-cha-htn, #mc-cha-dm, #mc-cha-vasc, #mc-cha-age65, #mc-cha-sexo', pts: 1 },
                { checks: '#mc-cha-age75, #mc-cha-stroke', pts: 2 }] },
            { tipo: 'racimos', titulo: 'Tabla 19.3: los anticoagulantes orales', tabla: '#mc-tabla-19-3', color: 'dorado' },
            { tipo: 'comparar', titulo: 'Warfarina o ACOD', columnas: [
                { titulo: 'Warfarina', color: 'amarillo', nodos: [{ fuente: '#mc-warfarina', etiqueta: 'II, VII, IX y X; necesita INR' }] },
                { titulo: 'ACOD', color: 'verde', nodos: [{ fuente: '#mc-doac', etiqueta: 'Preferidos en la FA no valvular' }] }
            ] },
            { tipo: 'flujo', titulo: 'Cardioversión y WPW', nodos: [
                { fuente: '#mc-cardioversion', etiqueta: '100 J bifásicos; mirar antes la aurícula', color: 'dorado' },
                { fuente: '#mc-wpw', etiqueta: 'WPW: no frenar el nodo; cardioversión', color: 'rojo' }
            ] }
        ]
    },
    'mc-otras-taqui': {
        guia: 'TAM, reentrada nodal, TV y torsade: cada una con su mecanismo y su tratamiento.',
        paneles: [
            { tipo: 'racimos', titulo: 'QRS estrecho', grupos: [
                { titulo: 'TAM', color: 'amarillo', nodos: ['#mc-tam'] },
                { titulo: 'Reentrada nodal', color: 'verde', nodos: ['#mc-psvt', '#mc-adenosina'] }
            ] },
            { tipo: 'racimos', titulo: 'Tabla 19.4: la adenosina', tabla: '#mc-tabla-19-4', color: 'verde' },
            { tipo: 'flujo', titulo: 'Fig. 19.8: QRS ancho', nodos: [
                { fuente: '#mc-tv-vs-svt', etiqueta: 'Disociación AV y latidos de fusión: TV', color: 'rojo' },
                [{ fuente: '#mc-fig-19-8', etiqueta: 'Inestable: cardioversión', color: 'rojo' }, { fuente: '#mc-fig-19-8', etiqueta: 'TV cierta: amiodarona', color: 'amarillo' }, { fuente: '#mc-fig-19-8', etiqueta: 'Dudosa: adenosina', color: 'verde' }]
            ] },
            { tipo: 'calculadora', titulo: 'QTc (calculadora de la ficha)', campos: ['#mc-qtc-qt', '#mc-qtc-fc'], resultado: ['#mc-qtc-resultado'] },
            { tipo: 'flujo', titulo: 'La torsade', nodos: [
                { fuente: '#mc-torsade', etiqueta: 'QT largo: fármacos y K, Ca, Mg bajos', color: 'purpura' },
                { fuente: '#mc-tv-polimorfica', etiqueta: 'Desfibrilar y magnesio', color: 'rojo' },
                { fuente: '#mc-madeja', etiqueta: 'La TV nunca es irregular', color: 'dorado' }
            ] },
            LAMINAS
        ]
    },

    /* ---------- Cap. 20 · SCA y disección ---------- */
    'mc-sca-diagnostico': {
        guia: 'El infarto es un coágulo sobre una placa rota; el ECG y la troponina lo separan en tres síndromes.',
        paneles: [
            { tipo: 'flujo', titulo: 'De la placa al síndrome', nodos: [
                { fuente: '#mc-placa', etiqueta: 'La placa se rompe y se tapa', color: 'rojo' },
                [{ fuente: '#mc-sca-sindromes', etiqueta: 'Oclusión completa: STEMI', color: 'rojo' }, { fuente: '#mc-sca-sindromes', etiqueta: 'Parcial: NSTEMI', color: 'amarillo' }, { fuente: '#mc-sca-sindromes', etiqueta: 'Intermitente: angina inestable', color: 'verde' }]
            ] },
            { tipo: 'racimos', titulo: 'Tabla 20.1: el ECG', tabla: '#mc-tabla-20-1', color: 'rojo' },
            { tipo: 'calculadora', titulo: 'Delta de troponina (calculadora de la ficha)', campos: ['#mc-troponina-inicial', '#mc-troponina-1h'], resultado: ['#mc-troponina-resultado'] },
            LAMINAS
        ]
    },
    'mc-sca-tratamiento': {
        guia: 'Abrir la arteria cuanto antes: angioplastia en 90-120 min o trombólisis en 30; y la doble antiagregación.',
        paneles: [
            { tipo: 'linea', titulo: 'El reloj del STEMI', nota: 'Plazos de la ficha (pág. 42-44).', min: 0, max: 180, ticks: [0, 30, 90, 120, 180], unidad: 'minutos desde la llegada', nodos: [
                { fuente: '#mc-puerta-balon', etiqueta: 'Puerta-aguja <30', en: 30, color: 'amarillo' },
                { fuente: '#mc-puerta-balon', etiqueta: 'Puerta-balón 90-120', en: 105, fila: 'abajo', color: 'verde' },
                { fuente: '#mc-fig-20-2', etiqueta: '>120: sube la mortalidad', en: 150, color: 'rojo' }
            ] },
            { tipo: 'flujo', titulo: 'La trombólisis', nodos: [
                { fuente: '#mc-trombolitico-mecanismo', etiqueta: 'Plasminógeno unido a la fibrina → plasmina', color: 'dorado' },
                { fuente: '#mc-fig-20-3', etiqueta: 'El beneficio se pierde tras 12 h', color: 'amarillo' },
                { fuente: '#mc-trombolisis', etiqueta: 'Sangra el 10 %; fibrinógeno <100 → crio', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Tablas 20.3 y 20.4', grupos: [
                { titulo: 'Cardioprotección', color: 'verde', tabla: '#mc-tabla-20-3' },
                { titulo: 'Antitrombóticos', color: 'rojo', tabla: '#mc-tabla-20-4' }
            ] },
            { tipo: 'flujo', titulo: 'Una palabra final', nodos: [{ fuente: '#mc-oferta-demanda', etiqueta: 'El infarto es un coágulo, no falta de O₂', color: 'purpura' }] }
        ]
    },
    'mc-diseccion-aortica': {
        guia: 'Puede parecer un SCA; se baja la presión sin acelerar el corazón y se opera.',
        paneles: [
            { tipo: 'barras', titulo: 'La imagen: sensibilidad y especificidad', nota: 'Cifras de la ficha (pág. 50).', tabla: '#mc-diseccion-imagen-tabla',
              series: [{ col: 1, nombre: 'Sensibilidad', color: 'verde' }, { col: 2, nombre: 'Especificidad', color: 'dorado' }] },
            { tipo: 'flujo', titulo: 'El manejo', nodos: [
                { fuente: '#mc-diseccion-manejo', etiqueta: 'Bajar la PA sin taquicardia', color: 'rojo' },
                { fuente: '#mc-diseccion-objetivos', etiqueta: 'PAS 120, opioides y cirugía', color: 'verde' }
            ] },
            { tipo: 'selector', titulo: '¿Qué antihipertensivo? (selector de la ficha)', control: '#mc-diseccion-farmaco-select', forma: 'chips', color: 'purpura', resultado: ['#mc-diseccion-farmaco-resultado'] },
            LAMINAS
        ]
    },

    /* ---------- Cap. 21 · Parada cardíaca ---------- */
    'mc-paro-soporte': {
        guia: 'Cuatro minutos de O₂: compresiones buenas, choque pronto y adrenalina cada 3-5 minutos.',
        paneles: [
            { tipo: 'barras', titulo: 'Tabla 21.1: la parada en cifras', tabla: '#mc-tabla-21-1', excluir: ['Nº de casos'],
              series: [{ col: 1, nombre: 'Fuera del hospital', color: 'dorado' }, { col: 2, nombre: 'En el hospital', color: 'rojo' }] },
            { tipo: 'linea', titulo: 'Fig. 21.1: el minuto del primer choque', nota: 'Supervivencia según el minuto del primer choque (ficha, pág. 59).', min: 0, max: 20, ticks: [0, 5, 10, 15, 20], unidad: 'minutos desde el colapso', nodos: [
                { fuente: '#mc-fig-21-1', etiqueta: '40 % a los 5', en: 5, color: 'verde' },
                { fuente: '#mc-fig-21-1', etiqueta: '29 % a los 10', en: 10, fila: 'abajo', color: 'amarillo' },
                { fuente: '#mc-fig-21-1', etiqueta: '19 % a los 15', en: 15, color: 'rojo' },
                { fuente: '#mc-fig-21-1', etiqueta: '9 % a los 20', en: 20, fila: 'abajo', color: 'purpura' }
            ] },
            { tipo: 'flujo', titulo: 'Tabla 21.2: el soporte vital básico', nodos: [
                { fuente: '#mc-svb-tiempo', etiqueta: '1 L de O₂ a 250 mL/min: 4 minutos', color: 'rojo' },
                { fuente: '#mc-tabla-21-2', etiqueta: '<10 s · 5-6 cm · 100-120/min · 30:2', color: 'verde' },
                { fuente: '#mc-insuflaciones', etiqueta: 'Insuflar deprisa: PEEP intrínseca', color: 'amarillo' }
            ] },
            { tipo: 'comparar', titulo: 'Las dos vías', columnas: [
                { titulo: 'Desfibrilable', color: 'rojo', nodos: ['#mc-desfibrilacion'] },
                { titulo: 'No desfibrilable', color: 'gris', nodos: ['#mc-aesp'] }
            ] },
            { tipo: 'flujo', titulo: 'La adrenalina', nodos: [{ fuente: '#mc-epinefrina-paro', etiqueta: '+30 % de presión coronaria, unos 3 min', color: 'amarillo' }] }
        ]
    },
    'mc-paro-monitorizacion': {
        guia: 'Con la ventilación constante, la ETCO₂ es el gasto que consiguen tus manos.',
        paneles: [
            { tipo: 'linea', titulo: 'Fig. 21.4: la ETCO₂ en 20 minutos', nota: 'Lectura del gráfico (ficha, pág. 63).', min: 0, max: 40, ticks: [0, 10, 15, 20, 30, 40], unidad: 'mmHg',
              bandas: [{ desde: 10, hasta: 15, texto: 'umbral a los 20 min', color: 'amarillo' }], nodos: [
                { fuente: '#mc-fig-21-4', etiqueta: 'Sin RCE: de ~19 a ~7', en: 7, color: 'rojo' },
                { fuente: '#mc-fig-21-4', etiqueta: 'Con RCE: de ~27 a ~32', en: 32, color: 'verde' }
            ] },
            { tipo: 'calculadora', titulo: 'ETCO₂ a los 20 minutos (intérprete de la ficha)', campos: ['#mc-etco2-20min'], resultado: ['#mc-etco2-resultado'] },
            { tipo: 'flujo', titulo: 'La ecografía en la parada', nodos: [{ fuente: '#mc-eco-paro', etiqueta: 'Neumotórax y derrame; el colapso del VD no es fiable', color: 'dorado' }] },
            LAMINAS
        ]
    },
    'mc-posresucitacion': {
        guia: 'Tras el pulso, el síndrome posparo: evitar la fiebre, no dar O₂ de más y esperar al día 4 para pronosticar.',
        paneles: [
            { tipo: 'racimos', titulo: 'El síndrome posparo', grupos: [{ titulo: 'Tres frentes', color: 'rojo', nodos: [{ fuente: '#mc-posparo', etiqueta: 'Cerebro, corazón aturdido e inflamación' }] }] },
            { tipo: 'calculadora', titulo: 'Tabla 21.3: la temperatura (calculadora de la ficha)', campos: ['#mc-ttm-temp'], resultado: ['#mc-ttm-resultado'] },
            { tipo: 'racimos', titulo: 'Tabla 21.4: otras preocupaciones', tabla: '#mc-tabla-21-4', color: 'amarillo' },
            { tipo: 'requisitos', modo: 'ninguno', sinPuerta: true, titulo: 'Tabla 21.5: predictores de mal resultado', items: [{ checks: '.mc-pronostico-check' }], resultado: ['#mc-pronostico-resultado'] },
            { tipo: 'flujo', titulo: 'Esperar', nodos: [
                { fuente: '#mc-despertar', etiqueta: '80-95 % despierta en 72 h; puede tardar 5 días', color: 'verde' },
                { fuente: '#mc-rcp-percepcion', etiqueta: 'La RCP funciona en el 1-7 %', color: 'purpura' }
            ] }
        ]
    }
};

export function init() {
    for (const [ficha, receta] of Object.entries(RECETAS)) montarVisual(ficha, receta);
}
