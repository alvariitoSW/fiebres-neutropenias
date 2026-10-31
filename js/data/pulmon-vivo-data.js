// Los datos del pulmón con respirador: fuentes, notas, pacientes y estados (E1a). Sin DOM. Las citas llevan a los párrafos de la ficha de Merino Neumología (ids nep-).
// Sin DOM. Cada estado guarda sus fuentes como lista (REGLAS §7.11) y cada cita lleva a su párrafo de la ficha
// (data-resaltar, ids con prefijo nep- de cobertura-3d.md §4; los que aún no existen se ponen al llevarlo a la app) y
// al PDF de segunda opción. Las cifras de R, τ y auto-PEEP son del modelo (fisiología general), no de Marino.

export const PDF_A = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
export const PDF_B = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
export const PDF_LA1 = 'docs/libro-azul-seccion-iv-respiratorio-parte1.pdf';
export const PDF_LA2 = 'docs/libro-azul-seccion-iv-respiratorio-parte2.pdf';
const NEUMO = ['neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs'];
export const FICHA = {
  'neumo-vm-modos': [NEUMO, 'Ventilación mecánica: los modos', 'VM: modos', PDF_B, 'Marino 2024'],
  'neumo-vni-metodos': [NEUMO, 'Ventilación no invasiva: métodos', 'VNI: métodos', PDF_A, 'Marino 2024'],
  // El libro azul no tiene ficha en la app: la cita lleva solo al PDF (sin «Ver en la ficha»)
  'libro-azul-resp1': [null, 'El libro azul, sección IV (parte 1)', 'Libro azul IV', PDF_LA1, 'El libro azul IV'],
  'libro-azul-resp2': [null, 'El libro azul, sección IV (parte 2)', 'Libro azul IV', PDF_LA2, 'El libro azul IV'],
  'neumo-vm-ajuste': [NEUMO, 'Ventilación mecánica: ajustes', 'VM: ajustes', PDF_B, 'Marino 2024'],
  'neumo-peep-oculta': [NEUMO, 'PEEP oculta', 'PEEP oculta', PDF_B, 'Marino 2024'],
  'neumo-epoc-vpp': [NEUMO, 'EPOC: ventilación con presión positiva', 'EPOC y VPP', PDF_A, 'Marino 2024'],
  'neumo-asma-agudo': [NEUMO, 'Asma agudo', 'Asma agudo', PDF_A, 'Marino 2024'],
  'neumo-sdra-ventilacion': [NEUMO, 'SDRA: ventilación protectora', 'SDRA: ventilación', PDF_A, 'Marino 2024'],
  'neumo-vni-uso': [NEUMO, 'Ventilación no invasiva: uso clínico y corazón', 'VNI: uso y corazón', PDF_A, 'Marino 2024'],
  'mc-ic-manejo': [['cardiologia', 'merinoCardiologia', 'panel-merino-cardio-tabs'], 'Insuficiencia cardíaca aguda: manejo', 'IC aguda: manejo', 'docs/marino-2024-cardiac-disorders-caps18-21.pdf', 'Marino 2024'],
};
// Citas que se repiten: f (ficha), id (párrafo), sitio (cómo se llama), p (página del PDF, comprobada con pdftotext)
export const C = {
  vcv: { f: 'neumo-vm-modos', id: 'nep-vcv', sitio: 'Volumen control', p: 2 },
  pcv: { f: 'neumo-vm-modos', id: 'nep-pcv', sitio: 'Presión control', p: '2-4' },
  fig271: { f: 'neumo-vm-modos', id: 'nep-fig-27-1', sitio: 'Fig. 27.1', p: 2 },
  ec271: { f: 'neumo-vm-modos', id: 'nep-ec-27-1', sitio: 'Ec. 27.1 (pico = Pres + Pel)', p: '2-3' },
  meseta: { f: 'neumo-vm-modos', id: 'nep-meseta', sitio: 'La presión meseta (Ec. 27.2-27.3)', p: 3 },
  fig272: { f: 'neumo-vm-modos', id: 'nep-fig-27-2', sitio: 'Fig. 27.2', p: 3 },
  riesgo: { f: 'neumo-vm-modos', id: 'nep-riesgo-alveolar', sitio: 'Riesgo de lesión alveolar: meseta ≤30', p: 4 },
  pcvPros: { f: 'neumo-vm-modos', id: 'nep-pcv-pros', sitio: 'PCV: ventajas y desventajas', p: 4 },
  finEsp: { f: 'neumo-vm-modos', id: 'nep-fin-espiracion', sitio: 'Presión al final de la espiración (ZEEP, PEEP, oculta)', p: 5 },
  oclusion27: { f: 'neumo-vm-modos', id: 'nep-fin-espiracion', sitio: 'La oclusión espiratoria', p: 6 },
  pMedia: { f: 'neumo-vm-modos', id: 'nep-presion-media', sitio: 'Presión media de la vía aérea', p: 6 },
  cstat: { f: 'neumo-vm-modos', id: 'nep-compliance', sitio: 'Compliance torácica (Ec. 27.4)', p: 6 },
  t271: { f: 'neumo-vm-ajuste', id: 'nep-tabla-27-1', sitio: 'Tabla 27.1 (PBW, Vt, PEEP)', p: '13-14' },
  flujoIE: { f: 'neumo-vm-ajuste', id: 'nep-flujo-ie', sitio: 'Flujo inspiratorio e I:E', p: 14 },
  ocultaAjuste: { f: 'neumo-vm-ajuste', id: 'nep-ajustes-oculta', sitio: 'PEEP oculta: qué hacer', p: 15 },
  defOculta: { f: 'neumo-peep-oculta', id: 'nep-definicion-oculta', sitio: 'PEEP oculta: definición', p: 31 },
  efectos: { f: 'neumo-peep-oculta', id: 'nep-efectos', sitio: 'Efectos adversos', p: 31 },
  monOculta: { f: 'neumo-peep-oculta', id: 'nep-monitorizacion-oculta', sitio: 'Monitorización', p: 31 },
  oclusion28: { f: 'neumo-peep-oculta', id: 'nep-oclusion', sitio: 'Oclusión al final de la espiración', p: '31-32' },
  fig289: { f: 'neumo-peep-oculta', id: 'nep-fig-28-9', sitio: 'Fig. 28.9', p: 32 },
  manejo: { f: 'neumo-peep-oculta', id: 'nep-manejo-oculta', sitio: 'Manejo', p: 32 },
  peepAplicada: { f: 'neumo-peep-oculta', id: 'nep-peep-aplicada', sitio: 'PEEP aplicada', p: '32-33' },
  noMerece: { f: 'neumo-peep-oculta', id: 'nep-peep-aplicada', sitio: 'PEEP aplicada: «probablemente no merece la pena»', p: 33 },
  tubuladura: { f: 'neumo-vm-modos', id: 'nep-errores-compliance', sitio: 'Corrección por la tubuladura (3 mL × presión pico)', p: 7 },
  fig235: { f: 'neumo-epoc-vpp', id: 'nep-monitor-flujo', sitio: 'Fig. 23.5: el flujo que no llega a cero', p: 28 },
  vppConsec: { f: 'neumo-epoc-vpp', id: 'nep-vpp-consecuencias', sitio: 'Consecuencias de la hiperinflación', p: 28 },
  estrategias: { f: 'neumo-epoc-vpp', id: 'nep-estrategias-ventilador', sitio: 'Estrategias del respirador', p: 29 },
  t245: { f: 'neumo-sdra-ventilacion', id: 'nep-tabla-24-5', sitio: 'Tabla 24.5: protocolo protector', p: 48 },
  protectora: { f: 'neumo-sdra-ventilacion', id: 'nep-protectora', sitio: 'Ventilación protectora: meseta ≤30', p: 48 },
  vtTrad: { f: 'neumo-sdra-ventilacion', id: 'nep-vt-tradicional', sitio: 'Volutrauma: Vt tradicional 12-15 mL/kg', p: 46 },
  disparo: { f: 'neumo-vm-ajuste', id: 'nep-disparo-presion', sitio: 'Disparo por presión: 2 a 3 cmH₂O negativos', p: 8 },
  psv4: { f: 'neumo-vni-metodos', id: 'nep-psv-4-puntos', sitio: 'PSV: los 4 puntos de interacción (corte al 25 % del flujo pico)', p: 78 },
  tau: { f: 'libro-azul-resp2', id: null, sitio: 'Constante de tiempo (pp. 514-515)', p: 50 },
  colapsoPeep: { f: 'neumo-vm-ajuste', id: 'nep-mejor-peep', sitio: 'Sin PEEP el espacio aéreo colapsa y empeora el intercambio', p: 10 },
  mejorPeep: { f: 'neumo-vm-ajuste', id: 'nep-mejor-peep', sitio: 'PEEP y PaO₂/FiO₂ (La mejor PEEP)', p: '10-12' },
  atelect: { f: 'neumo-sdra-ventilacion', id: 'nep-atelectrauma', sitio: 'Atelectrauma: se abre y se cierra, y la PEEP lo evita', p: 48 },
  histeresis: { f: 'libro-azul-resp1', id: null, sitio: 'Histéresis: abrir pide más presión que mantener abierto; reclutamiento y desreclutamiento unas 30 000 veces por día (pp. 450-451)', p: '66-67' },
  inflexion: { f: 'libro-azul-resp2', id: null, sitio: 'Puntos de inflexión; el colapso empieza al espirar (pp. 550-551)', p: '86-87' },
  hipercapnia: { f: 'neumo-sdra-ventilacion', id: 'nep-hipercapnia', sitio: 'Hipercapnia permisiva', p: 49 },
};
export const NOTA_TIPO = { discrepan: ['Las fuentes discrepan', ''], calla: ['La fuente no lo dice', 'calla'], autor: ['Opinión del autor', 'autor'], errata: ['Errata de la fuente', 'errata'] };
export const NOTAS = [
  { k: 'r-tau', tipo: 'calla', txt: 'Marino no da la resistencia de la vía aérea, la constante de tiempo (τ = R·C) ni una cifra de PEEP oculta por paciente. El modelo las pone como ilustrativo: R 5 cmH₂O por L/s en el pulmón normal, 20 en el broncoespasmo (ninguna fuente de este plan da esas cifras; solo se apoya en que la presión pico suma resistencia y elastancia, cap. 27 p. 3, y en el orden de magnitud de Tuxen DV, Lane S. Am Rev Respir Dis 1987;136:872-9, PMID 3662241, que estudió la obstrucción grave); y en el broncoespasmo hace la resistencia espiratoria mayor que la inspiratoria (ilustrativo), que es lo que deja el pulmón sin vaciarse.', citas: [C.defOculta] },
  { k: 'oclusion-insp', tipo: 'errata', txt: 'En los ajustes del cap. 27 el libro dice «medir la PEEP oculta con el método de oclusión al final de la inspiración» (p. 15); en el mismo capítulo (p. 6) y en el cap. 28 (p. 31-32) la maniobra es al final de la espiración, que es la que mide la PEEP oculta (la inspiratoria mide la meseta). El modelo sigue la espiratoria y lo deja anotado.', citas: [C.ocultaAjuste, C.oclusion28] },
  { k: 'fig275-cifras', tipo: 'discrepan', txt: 'La Fig. 27.5 (cap. 27 p. 11) muestra, en su estudio de PEEP incremental a Vt 4 mL/kg, una compliance máxima de ≈21,5 mL/cmH₂O y una presión de conducción mínima de ≈11,7 cmH₂O (lecturas aproximadas de la gráfica). El modelo da con PEEP 12 una Cstat de 12 y una ΔP de 15 (ilustrativo, del modelo: un paciente inventado, con la corrección de la tubuladura de 3 mL × el pico). Las dos cifras no son comparables caso a caso: la gráfica solo fija el sentido, no el valor.', citas: [C.mejorPeep] },
  { k: 'meseta-30', tipo: 'discrepan', txt: 'El objetivo de meseta es «≤30 cmH₂O» en el texto (cap. 24 p. 48; cap. 27 p. 4) y la Tabla 24.5 baja el Vt «hasta meseta <30». El modelo marca en rojo por encima de 30 y muestra las dos formas.', citas: [C.protectora, C.t245] },
  { k: 'cifras-ilu', tipo: 'calla', txt: 'Ninguna fuente da estas cifras de tope, que son ilustrativas: volumen minuto 2-20 L/min (lo más cercano: «VM alta ≥10 L/min», cap. 27 p. 14; Tuxen 1987 ventiló a 10, 16 y 26 L/min en obstrucción grave), PEEP total ≤20 (el mecanismo está en cap. 28 p. 31-33; Marini 2011 como lectura), alarma de presión 45/50 (el 50 de ARDS Network 2000 es la meseta del brazo tradicional, no un pico; la ficha quiere la meseta ≤30, cap. 27 p. 14), Ti mínimo 0,2 s (sale de Ti = VT ÷ flujo; la ficha pide I:E ≥1:2), compliance mínima 15 (la ficha dice «<25», sin suelo) y resistencia 5/20. Nota: la presión pico depende sobre todo del flujo inspiratorio y no refleja el volumen pulmonar (Tuxen 1987).', citas: [C.t271] },
  { k: 'fr-35', tipo: 'calla', txt: 'La ficha pide no pasar de 35 respiraciones por minuto (cap. 27 p. 14, tabla 27.1). Por encima, el libro advierte de que la respiración rápida favorece la hiperinflación y la PEEP intrínseca, y eso puede bajar el gasto cardíaco (cap. 27 p. 55; lo dice a propósito de las pruebas de respiración espontánea). Tuxen 1987 (PMID 3662241): al subir la frecuencia, menos tiempo espiratorio, más hiperinflación e hipotensión.', citas: [C.t271] },
  { k: 'apnea', tipo: 'calla', txt: 'Al detener la ventilación, la saturación cae y el CO₂ sube en minutos (Farmery 1996; Benumof 1997; Eger 1961). La velocidad depende de la oxigenación previa, el consumo de O₂, el volumen alveolar y el shunt, y es peor en obesos. El modelo no calcula gases y no da cifras por minuto: ninguna de las fuentes abiertas aquí las trae.', citas: [] },
  { k: 'racimo-ilu', tipo: 'calla', txt: 'El libro describe el fenómeno (cada unidad abre a una presión y se mantiene abierta a otra más baja; abrir y cerrar unas 30 000 veces al día), pero no da las presiones. El racimo usa cuatro unidades con apertura a 16, 20 y 24 cmH₂O y cierre a 6, 8 y 10 (la primera siempre abierta), y una cola que se aplana por encima de 26-29: todo ilustrativo. Es un pulmón de SDRA reclutable inventado, no una medida. La PEEP aplicada "justo por debajo de la oculta" del EPOC (p. 32-33) sigue sin modelarse: aquel colapso es de la vía pequeña en la obstrucción.', citas: [C.histeresis, C.inflexion, C.peepAplicada] },
  { k: 'dp-sin-objetivo', tipo: 'calla', txt: 'La presión de conducción (meseta − PEEP) se calcula, pero Marino no da un objetivo numérico para ella, así que la calculadora no pone ninguno: el único objetivo de presión del libro es la meseta ≤30. La Fig. 27.5 solo la usa para buscar la mejor PEEP.', citas: [C.cstat, C.protectora] },
  { k: 'psv-ilu', tipo: 'calla', txt: 'En la presión de soporte el modelo pone como ilustrativo lo que Marino no da: la frecuencia del paciente (16 por minuto), la compliance y la resistencia de Herminia, el tiempo que tarda su esfuerzo en llegar al umbral (0,1 s) y la pequeña variación del esfuerzo entre respiraciones (siempre dentro de 2-3 cmH₂O, con semilla fija: sale igual cada vez). El esfuerzo muscular como tal no está en el modelo.', citas: [C.disparo, C.psv4] },
  { k: 'causas-pico', tipo: 'calla', txt: 'Las páginas citadas (cap. 27 pp. 2-4) separan la parte de resistencia de la parte elástica del pico (Ec. 27.1-27.3) pero no enumeran las causas clínicas de un pico alto; el árbol de la página solo reparte entre resistencia y elasticidad y no lista causas.', citas: [C.ec271, C.meseta] },
  { k: 'tau-ilu', tipo: 'calla', txt: 'El libro azul da la definición de la constante de tiempo y las 4-5 constantes para eliminar la auto-PEEP; la cifra del par del modelo (R 20 × C 60 = 1,2 s) es ilustrativa. El libro azul no tiene ficha en la app: la cita lleva solo al PDF.', citas: [C.tau] },
  { k: 'corazon-limite', tipo: 'calla', txt: 'El panel del corazón usa el motor del corazón del shock vivo, con la presión media de la vía aérea del pulmón como presión que llega a la pleura. Bradley 1992 (PMID 1736745): con CPAP 5, +22 % del VS indexado con PCP ≥12; con PCP <12 el gasto bajó (IC 3,14→2,89). El modelo da el sentido y el orden de magnitud (con CPAP 5, +8,5 % en el corazón de Ramiro con g = 1, por debajo del +22 % de Bradley; −7 % en el normal. El alivio se aplana con la presión: de CPAP 5 a 10 ya no sube más, y con presiones muy altas manda el llenado y el VS cae). El tope de la CPAP es 10 (usualmente 5-10, resp. p. 77). La retirada simpática y el menor trabajo respiratorio del paciente real no están, y tampoco la apertura de los alvéolos (el modelo no calcula gases).', citas: [{ f: 'mc-ic-manejo', id: 'mc-vpp', sitio: 'Ventilación con presión positiva en la IC', p: 14 }] },
  { k: 'corazon-herminia', tipo: 'calla', txt: 'El corazón de Herminia en el estado de CPAP es el de la insuficiencia cardíaca del shock vivo (Ramiro, gravedad máxima): ilustrativo. Marino no da las cifras de VS, GC ni PAM de un paciente concreto. En el estado de presión positiva en el sano, el corazón es el del escenario normal del motor. Con CPAP (sin soporte) el paciente respira por su cuenta y el modelo no calcula ese volumen: el Vt y el volumen minuto de la pantalla salen en 0 y no es un fallo de ventilación.', citas: [] },
];

// ---------------------------------------------------------------- pacientes del bloque (cobertura-3d.md §5)
export const PACIENTES = [
  { k: 'rafael', nombre: 'Rafael', chip: '52 a · politrauma · pulmón sano', linea: '52 años, 1,80 m, politrauma intubado (día 1: pulmones sanos). PBW 75 kg.', talla: 180, sexo: 'v', estado: 'normal-vcv' },
  { k: 'isidro', nombre: 'Isidro', chip: '64 a · SDRA moderado', linea: '64 años, 96 kg, 1,75 m, neumonía bilateral → SDRA (P/F 110 con PEEP 10). PBW 70,5 kg.', talla: 175, sexo: 'v', estado: 'sdra-rigido' },
  { k: 'jacinto', nombre: 'Jacinto', chip: '58 a · EPOC grave', linea: '58 años, 70 kg, 1,70 m, EPOC grave, fumador; intubado tras fracasar la VNI. PBW 66 kg.', talla: 170, sexo: 'v', estado: 'broncoespasmo-auto-peep' },
  { k: 'eulalia', nombre: 'Eulalia', chip: '27 a · asma casi fatal', linea: '27 años, 60 kg, 1,62 m, asma casi fatal (PaCO₂ 42 tras 3 nebulizaciones), intubada. PBW 54 kg.', talla: 162, sexo: 'm', estado: 'eulalia-conectada' },
  { k: 'herminia', nombre: 'Herminia', chip: '76 a · edema agudo de pulmón', linea: '76 años, 92 kg, 1,55 m, hipertensa, edema agudo de pulmón; ya respira por su cuenta con presión de soporte. PBW 47,9 kg.', talla: 155, sexo: 'm', estado: 'psv-disparo' },
];

// ---------------------------------------------------------------- estados con nombre
// resp y pulmon son los mandos; man, las maniobras; guia, los 3-5 pasos (s: qué señalar: «canal:tramo» del monitor,
// un selector de la escena o de la columna de cifras). Las frases de mecanismo citan su página (REGLAS §1.11).
const NORMAL = { c: 60, r: 5 };
export const ESTADOS = {
  'normal-vcv': {
    tit: 'Volumen control, pulmón sano', pac: 'rafael', resp: { modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60, pinsp: 10, ie: 2, pmax: 40 }, pulmon: NORMAL, man: {},
    frase: 'En volumen control mandas el volumen y la presión te la enseña el pulmón; en presión control, al revés.',
    guia: [
      { t: 'El respirador entrega el volumen marcado (500 mL) a flujo constante: la curva de flujo es un escalón de 60 L/min, y el volumen sube en línea recta.', s: ['flujo:insp', 'vol:insp'], c: C.vcv },
      { t: 'La presión en la vía aérea la decide el pulmón: sube en rampa porque cada mL que entra tensa más el tórax (Pel) y, encima, hay que empujar el aire por la vía aérea (Pres). Pico = Pres + Pel.', s: ['paw:insp'], c: C.ec271 },
      { t: 'La espiración es pasiva: el respirador abre la válvula espiratoria y el pulmón se vacía solo, con un flujo que decae hasta cero antes del siguiente ciclo. La presión cae hasta la PEEP, 5 cmH₂O.', s: ['#pul-esc-valvula-esp', 'flujo:esp', 'paw:esp'], c: C.finEsp },
      { t: 'Con 500 mL en un tórax de compliance 60 mL/cmH₂O y 5 cmH₂O de resistencia a 1 L/s, el pico ronda 18 cmH₂O. Es un pulmón sano: Cstat de 50 a 80.', org: 'ilustrativo (R y C) · ficha, cap. 27 p. 6 (Cstat 50-80)', s: ['[data-fila="pico"]', '#pul-esc-racimo'], c: C.cstat },
    ],
    fuentes: [C.vcv, C.fig271, C.ec271, C.finEsp, C.cstat],
  },
  'pcv': {
    tit: 'Presión control, pulmón sano', pac: 'rafael', resp: { modo: 'pcv', vt: 500, fr: 14, peep: 5, flujo: 60, pinsp: 10, ie: 2, pmax: 40 }, pulmon: NORMAL, man: {},
    frase: 'En presión control la presión es la meseta que tú marcas; el volumen lo pone el pulmón.',
    guia: [
      { t: 'Ahora el respirador fija la presión (PEEP 5 + 10 de presión de insuflación = 15) durante el tiempo inspiratorio. La curva de presión es una meseta plana.', s: ['paw:insp', '#pul-esc-pantalla'], c: C.pcv },
      { t: 'El flujo es desacelerante: muy alto al principio (toda la diferencia de presión entre la vía aérea y el alvéolo) y cae a cero cuando el alvéolo alcanza la presión marcada.', s: ['flujo:insp'], c: C.pcv },
      { t: 'El volumen que entra depende de la compliance: con 60 mL/cmH₂O, 10 cmH₂O meten unos 600 mL. Baja la compliance en la pestaña Pulmón y verás caer el volumen con la misma presión: es la desventaja de PCV.', s: ['vol:insp', '[data-fila="vt"]'], c: C.pcvPros },
      { t: 'Como al final de la inspiración ya no hay flujo, la presión que ves al final es la alveolar: la meseta sale sin pausa.', s: ['paw:pico'], c: C.pcv },
    ],
    fuentes: [C.pcv, C.fig271, C.pcvPros],
  },
  'pausa-inspiratoria': {
    tit: 'Pausa inspiratoria: del pico a la meseta', pac: 'rafael', resp: { modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60, pinsp: 10, ie: 2, pmax: 40 }, pulmon: NORMAL, man: { pausa: true },
    frase: 'Sin flujo, la presión que queda es la del alvéolo.',
    guia: [
      { t: 'Al final de la insuflación el respirador cierra la válvula espiratoria medio segundo (pausa o «inflation hold»): no entra ni sale aire.', s: ['#pul-esc-valvula-esp', 'flujo:pausa'], c: C.fig272 },
      { t: 'La presión cae del pico y se queda en una meseta: sin flujo, la presión proximal se iguala con la del alvéolo. Meseta = Palv = Pel.', s: ['paw:pausa', '[data-fila="meseta"]'], c: C.meseta },
      { t: 'Pico − meseta = la presión gastada en la resistencia de la vía aérea (Pres). Aquí ≈ 5 cmH₂O: R 5 × 1 L/s.', org: 'ilustrativo (R)', s: ['paw:pico', '[data-fila="pres"]'], c: C.meseta },
      { t: 'Con la meseta ya puedes calcular la compliance estática: Vt / (meseta − PEEP total). Ojo: la PEEP se resta, y al Vt se le quita lo que se queda en la tubuladura (3 mL por cada cmH₂O de la presión pico; en presión control, la de fin de inspiración): con pico 18,3, meseta 13,3 y PEEP 5, (500 − 3 × 18,3) / (13,3 − 5) ≈ 54 mL/cmH₂O.', s: ['[data-fila="cstat"]'], c: C.cstat },
      { t: 'Sin esa corrección saldrían 60: se sobreestima la compliance. Con el pico de 40 del ejemplo de Marino se pierden 3 × 40 = 120 mL (500 − 120 = 380 mL llegan al paciente); cuanto más alto el pico, más pesa la corrección.', s: ['[data-fila="cstat"]'], c: C.tubuladura },
      { t: 'La que importa para el alvéolo es la meseta, no el pico: el riesgo de rotura es insignificante si la meseta es ≤30 cmH₂O.', s: ['[data-fila="meseta"]', '#pul-esc-racimo'], c: C.riesgo },
    ],
    fuentes: [C.fig272, C.meseta, C.cstat, C.tubuladura, C.riesgo],
  },
  'sdra-rigido': {
    tit: 'SDRA: pulmón rígido con 6 mL/kg', pac: 'isidro', resp: { modo: 'vcv', vt: 420, fr: 30, peep: 10, flujo: 60, pinsp: 15, ie: 2, pmax: 50 }, pulmon: { c: 19, r: 8 }, man: { pausa: true },
    frase: 'Un pulmón al 50 % no admite el volumen de uno entero.',
    guia: [
      { t: 'Isidro tiene SDRA: su Cstat en el monitor es 14 mL/cmH₂O (en el SDRA es típicamente <25). El racimo de alvéolos está lleno de exudado y rígido.', s: ['#pul-esc-racimo', '[data-fila="cstat"]'], c: C.cstat },
      { t: 'Con Vt 6 mL/kg de peso predicho (420 mL) y PEEP 10, la meseta sube a 32: por encima de 30. El mismo volumen que un pulmón sano aguanta sin inmutarse aquí distiende de más.', s: ['paw:pausa', '[data-fila="meseta"]'], c: C.protectora },
      { t: 'El protocolo dice: si la meseta pasa de 30, baja el Vt de 1 en 1 mL/kg hasta que baje de 30 o llegues a 4 mL/kg. Pásate al estado «SDRA protector» o baja el Vt en la pestaña Respirador.', s: ['[data-fila="vtkg"]'], c: C.t245 },
      { t: 'La presión de conducción (meseta − PEEP) es 22. El libro no da un objetivo de presión de conducción, solo el mínimo de la Fig. 27.5 al buscar la mejor PEEP.', org: 'ficha (sin objetivo numérico)', s: ['[data-fila="dp"]'], c: C.cstat },
    ],
    fuentes: [C.cstat, C.protectora, C.t245],
  },
  'sdra-protector': {
    tit: 'SDRA protector: 5 mL/kg y meseta por debajo de 30', pac: 'isidro', resp: { modo: 'vcv', vt: 352, fr: 30, peep: 10, flujo: 60, pinsp: 15, ie: 2, pmax: 50 }, pulmon: { c: 19, r: 8 }, man: { pausa: true },
    frase: 'Se acepta el CO₂ alto a cambio de no romper el pulmón.',
    guia: [
      { t: 'Vt 5 mL/kg PBW (352 mL): la meseta baja a 28-29, por debajo de 30. El racimo deja de estar en terracota.', s: ['paw:pausa', '[data-fila="meseta"]', '#pul-esc-racimo'], c: C.t245 },
      { t: 'Menos volumen por respiración y el mismo CO₂ que eliminar: la FR sube hasta 30-35 para sostener el volumen minuto. Aquí, FR 30.', s: ['[data-fila="vm"]', 'flujo:esp'], c: C.t245 },
      { t: 'Aun así la PaCO₂ sube. El libro acepta PaCO₂ de 60-70 mmHg y pH 7,2-7,25 en la mayoría de los pacientes (hipercapnia permisiva); el objetivo del protocolo es pH 7,30-7,45.', s: ['#pul-esc-pantalla'], c: C.hipercapnia },
      { t: 'Con FR 30 y flujo 60, la inspiración dura 0,35 s y queda tiempo para exhalar: el flujo llega a cero antes de la siguiente insuflación. Si subes la FR a 35 con un flujo bajo, deja de llegar.', s: ['flujo:finesp'], c: C.flujoIE },
    ],
    fuentes: [C.t245, C.protectora, C.hipercapnia, C.flujoIE],
  },
  'volutrauma': {
    tit: 'Volutrauma: el volumen de un pulmón sano en uno al 50 %', pac: 'isidro', resp: { modo: 'vcv', vt: 600, fr: 20, peep: 10, flujo: 60, pinsp: 15, ie: 2, pmax: 50 }, pulmon: { c: 19, r: 8 }, man: { pausa: true },
    frase: 'Un volumen que un pulmón sano aguanta, aquí lo sobredistiende.',
    guia: [
      { t: 'El volutrauma es la rotura de la interfaz alveolo-capilar por sobredistensión alveolar durante la ventilación mecánica. Isidro lleva Vt 600 (8,5 mL/kg de peso predicho): por encima del 8 del que parte el protocolo.', s: ['[data-fila="vtkg"]', '#pul-esc-racimo'], c: C.vtTrad },
      { t: 'Hay dos factores: los volúmenes tidales altos (los tradicionales eran 12-15 mL/kg, el doble del normal de 6-7) y la capacidad reducida del SDRA, que opera al 50 %. Así se fuerza un volumen doble en un pulmón de la mitad de tamaño.', s: ['[data-fila="cstat"]'], c: C.vtTrad },
      { t: 'Con compliance 19, el mismo Vt sube la meseta a unos 42 cmH₂O. Una presión alveolar pico >30 crea riesgo de rotura alveolar: el racimo se pone en terracota.', org: 'modelo (C y R: ilustrativo) · umbral 30: ficha', s: ['paw:pausa', '[data-fila="meseta"]', '#pul-esc-racimo'], c: C.riesgo },
      { t: 'La salida del protocolo: si la meseta pasa de 30, baja el Vt de 1 en 1 mL/kg hasta que baje de 30 o llegues a 4 mL/kg. Pásate al estado «SDRA protector» para verlo.', s: ['[data-fila="vtkg"]'], c: C.t245 },
    ],
    fuentes: [C.vtTrad, C.riesgo, C.protectora, C.t245],
  },
  'broncoespasmo-auto-peep': {
    tit: 'EPOC: el flujo no llega a cero', pac: 'jacinto', resp: { modo: 'vcv', vt: 500, fr: 24, peep: 0, flujo: 60, pinsp: 15, ie: 2, pmax: 40 }, pulmon: { c: 60, r: 20, rEsp: 40 }, man: { oclusion: true },
    frase: 'El pulmón no termina de vaciarse: cada respiración empieza más lleno.',
    guia: [
      { t: 'Jacinto exhala contra una resistencia alta: el flujo espiratorio decae despacio y, cuando llega la siguiente insuflación, todavía está saliendo aire. Ese flujo al final de la espiración es la prueba de hiperinflación dinámica.', s: ['flujo:finesp', '[data-fila="flujofin"]'], c: C.fig235 },
      { t: 'El volumen no vuelve a su punto de partida: el pulmón se queda con aire atrapado y el racimo, hiperinsuflado. Fíjate en que la curva de volumen no baja a cero.', s: ['#pul-esc-racimo', 'vol:finesp'], c: C.defOculta },
      { t: 'En la curva de presión no ves nada: la presión proximal baja a la PEEP marcada (0). La presión alveolar sigue positiva. Por eso se llama PEEP oculta.', s: ['paw:finesp'], c: C.finEsp },
      { t: 'Para medirla, el respirador ocluye el circuito espiratorio al final de la espiración: sin flujo, la presión proximal se iguala con la alveolar y salta a la PEEP oculta, aquí unos 6 cmH₂O. Solo vale si el paciente no respira por su cuenta.', org: 'ficha (maniobra) · modelo (cifra)', s: ['paw:oclusion', '[data-fila="peeptot"]', '#pul-esc-valvula-esp'], c: C.oclusion28 },
      { t: 'Consecuencias: sube la presión intratorácica media (menos retorno venoso, menos gasto cardíaco), más trabajo para disparar, más riesgo de volutrauma y barotrauma, y una PVC falsamente alta.', s: ['#pul-esc-torax'], c: C.efectos },
    ],
    fuentes: [C.fig235, C.defOculta, C.finEsp, C.oclusion28, C.fig289, C.efectos],
  },
  'auto-peep-corregida': {
    tit: 'Dale tiempo para exhalar', pac: 'jacinto', resp: { modo: 'vcv', vt: 400, fr: 12, peep: 0, flujo: 80, pinsp: 15, ie: 2, pmax: 40 }, pulmon: { c: 60, r: 20, rEsp: 40 }, man: { oclusion: true },
    frase: 'Dale tiempo para exhalar: menos frecuencia, más flujo y menos volumen.',
    guia: [
      { t: 'Todo lo que corrige la PEEP oculta busca lo mismo: más tiempo de vaciado. FR 24 → 12, flujo 60 → 80 (la inspiración dura menos), Vt 500 → 400 (6 mL/kg PBW).', s: ['#pul-esc-pantalla'], c: C.manejo },
      { t: 'Ahora el flujo espiratorio llega a cero antes del siguiente ciclo: la inspiración ocupa mucho menos de un tercio del ciclo (I:E 1:15).', s: ['flujo:finesp', '[data-fila="ie"]'], c: C.estrategias },
      { t: 'La oclusión al final de la espiración ya casi no salta: la PEEP oculta baja de 6 a ≈1 cmH₂O y el volumen atrapado desaparece.', org: 'modelo (cifras)', s: ['paw:oclusion', 'vol:finesp'], c: C.ocultaAjuste },
      { t: 'El precio: el volumen minuto baja de 12 a 4,8 L/min y la PaCO₂ subirá. El libro lo avisa: algunas de estas maniobras bajan el volumen minuto y eso puede no ser deseable.', s: ['[data-fila="vm"]'], c: C.manejo },
    ],
    fuentes: [C.manejo, C.estrategias, C.ocultaAjuste, C.flujoIE],
  },
  'eulalia-conectada': {
    tit: 'Asma casi fatal, recién conectada', pac: 'eulalia', resp: { modo: 'vcv', vt: 500, fr: 26, peep: 0, flujo: 60, pinsp: 15, ie: 2, pmax: 50 }, pulmon: { c: 60, r: 20, rEsp: 65 }, man: { oclusion: true },
    frase: 'Con Vt 500 y FR 26, cada respiración empieza con unos 800 mL que no salieron.',
    guia: [
      { t: 'Eulalia llega intubada y el respirador se queda con Vt 500 (9 mL/kg PBW) y FR 26. La resistencia espiratoria del asma deja el flujo lejos de cero al final de cada espiración.', s: ['flujo:finesp'], c: C.fig235 },
      { t: 'El aire atrapado se acumula hasta un equilibrio: unos 800 mL por encima del reposo. La oclusión espiratoria lo traduce a presión: unos 14 cmH₂O de PEEP oculta.', org: 'modelo (cifras)', s: ['paw:oclusion', '[data-fila="peeptot"]'], c: C.oclusion28 },
      { t: 'El pico se dispara (42) por la resistencia inspiratoria y la hiperinflación. La presión intratorácica media sube e impide el retorno venoso: es la hipotensión al conectar.', s: ['[data-fila="pico"]', '#pul-esc-torax'], c: C.vppConsec },
      { t: 'La salida: evitar volúmenes >6-8 mL/kg y alargar la espiración (menos frecuencia, más flujo, inspiración ≤ un tercio del ciclo). Pásate al estado «Eulalia bien ajustada».', s: ['#pul-esc-pantalla'], c: C.estrategias },
    ],
    fuentes: [C.fig235, C.oclusion28, C.vppConsec, C.estrategias],
  },
  'eulalia-ajustada': {
    tit: 'Asma casi fatal, bien ajustada', pac: 'eulalia', resp: { modo: 'vcv', vt: 330, fr: 10, peep: 0, flujo: 80, pinsp: 15, ie: 2, pmax: 50 }, pulmon: { c: 60, r: 20, rEsp: 65 }, man: { oclusion: true },
    frase: 'FR 10, Vt 6 mL/kg, flujo 80: la espiración ocupa casi todo el ciclo y el aire sale.',
    guia: [
      { t: 'FR 10, Vt 330 (6 mL/kg PBW) y flujo 80 L/min: la inspiración dura 0,25 s y la espiración, más de 5. El flujo llega a cero.', s: ['flujo:finesp', '[data-fila="ie"]'], c: C.estrategias },
      { t: 'La oclusión espiratoria apenas salta: PEEP oculta ≈ 2 cmH₂O. El volumen atrapado se ha ido y la presión intratorácica media baja: la presión arterial se recupera.', org: 'modelo (cifras)', s: ['paw:oclusion', 'vol:finesp'], c: C.vppConsec },
      { t: 'El volumen minuto es ahora 3,3 L/min y la PaCO₂ subirá. El libro solo avisa de que estas maniobras pueden bajar el volumen minuto, «lo que quizá no sea deseable». Que en el asma se tolere a cambio de no hiperinsuflar no lo dice aquí: es fisiología general (la hipercapnia permisiva del cap. 24 es del SDRA).', org: 'fisiología general (tolerar la PaCO₂)', s: ['[data-fila="vm"]'], c: C.manejo },
    ],
    fuentes: [C.estrategias, C.vppConsec, C.manejo],
  },
  'atelectrauma-zeep': {
    tit: 'Sin PEEP: el alvéolo que se abre y se cierra', pac: 'isidro', resp: { modo: 'vcv', vt: 282, fr: 20, peep: 0, flujo: 60, pinsp: 15, ie: 2, pmax: 40 }, pulmon: { c: 19, r: 8, racimo: 'sdra' }, man: { pausa: true },
    frase: 'Sin PEEP, tres de las cuatro unidades se abren al inspirar y se cierran al espirar, en cada respiración.',
    piensa: {
      q: 'Isidro lleva PEEP 5 y tres de sus cuatro unidades se abren y se cierran en cada respiración. Subes la PEEP a 12 cmH₂O. ¿Qué le pasa al alvéolo que se cerraba?',
      ops: [
        { t: 'Se cierra aún más, porque más presión al final de la espiración lo comprime.', ok: false, e: 'Al revés: la PEEP sostiene la vía pequeña abierta. Si esto fuera cierto, la cizalla de abrir y cerrar seguiría en cada respiración y la lesión de la vía aérea se acumularía.', c: C.atelect },
        { t: 'Se queda abierto al espirar y deja de abrirse y cerrarse.', ok: true, e: 'Sus presiones de cierre (6, 8 y 10 cmH₂O en este modelo) quedan por debajo de la PEEP de 12: ya no colapsa al final de la espiración y no hay que volver a abrirlo.', c: C.atelect },
        { t: 'Nada: la PEEP solo cambia la oxigenación, no lo que ocurre dentro del alvéolo.', ok: false, e: 'La PEEP actúa justo ahí: sin ella el espacio aéreo colapsa al final de la espiración, empeora el intercambio de gases y favorece la hipoxemia.', c: C.colapsoPeep },
      ],
      exp: 'Abrir una unidad pide más presión que mantenerla abierta (histéresis): por eso una PEEP por encima de la presión de cierre la deja abierta todo el ciclo. Es el atelectrauma que evita la PEEP.',
    },
    guia: [
      { t: 'Isidro (SDRA) con Vt 282 mL (4 mL/kg, como en la Fig. 27.5) y PEEP 0. El racimo tiene cuatro unidades; la de arriba nunca se cierra. Las otras tres se abren a presiones distintas y, una vez abiertas, se mantienen abiertas hasta una presión de cierre más baja.', org: 'ilustrativo (presiones de apertura y cierre) · ficha (el fenómeno)', s: ['#pul-esc-racimo'], c: C.histeresis },
      { t: 'Al inspirar, la presión alveolar sube y cada unidad pasa de colapsada a abierta cuando llega a su presión de apertura, una detrás de otra. Mira el racimo mientras sube el volumen.', org: 'ilustrativo', s: ['#pul-esc-racimo', 'vol:insp'], c: C.histeresis },
      { t: 'Sin PEEP, la presión alveolar cae por debajo de la presión de cierre y las tres unidades se colapsan al espirar. En la siguiente respiración hay que abrirlas otra vez: el racimo muestra ese abrir y cerrar a cada ciclo.', org: 'ilustrativo (presiones) · ficha (mecanismo)', s: ['#pul-esc-racimo', 'vol:finesp'], c: C.atelect },
      { t: 'Ese abrir y cerrar crea fuerzas de cizalla que dañan el epitelio de la vía aérea: es el atelectrauma, y se evita o se reduce aplicando PEEP para mantener abierta la vía pequeña al final de la espiración. Con tantas respiraciones al día, la lesión se acumula: el Libro Azul (pág. 67 del PDF) habla de unas 30 000 aperturas y cierres por día.', org: 'ficha · Libro Azul IV, pág. 67 (30 000) · Marino cap. 22 p. 48 (atelectrauma)', s: ['#pul-esc-racimo', '#pul-esc-atel'], c: C.atelect },
      { t: 'La compliance lo paga: la Cstat sale baja porque parte del pulmón no participa. Sube la PEEP a 12 con el mando y compara: las tres unidades dejan de cerrarse.', org: 'modelo (cifras ilustrativas)', s: ['[data-fila="cstat"]', '#pul-esc-pantalla'], c: C.mejorPeep },
    ],
    fuentes: [C.atelect, C.histeresis, C.inflexion, C.mejorPeep],
  },
  'mejor-peep': {
    tit: 'La mejor PEEP: 4 → 12 → 20', pac: 'isidro', resp: { modo: 'vcv', vt: 282, fr: 20, peep: 12, flujo: 60, pinsp: 15, ie: 2, pmax: 40 }, pulmon: { c: 19, r: 8, racimo: 'sdra' }, man: { pausa: true },
    frase: 'Con PEEP 12 no hay unidades que se cierren y la compliance es la mejor; subirla más sobredistiende.',
    guia: [
      { t: 'Con PEEP baja (5-10 cmH₂O) se previene el colapso de los espacios aéreos distales; con más (10-20) se abren espacios ya colapsados (reclutamiento). Pero una PEEP alta también sobredistiende los alvéolos de las zonas sanas.', s: ['#pul-esc-racimo'], c: C.mejorPeep },
      { t: 'Con PEEP 12, Vt 4 mL/kg: las cuatro unidades están abiertas y ninguna se abre y se cierra. La compliance es la más alta de todo el barrido, y la presión de conducción (meseta − PEEP), la más baja. Aquí: Cstat 12 y ΔP 15 con PEEP 12 (ilustrativo, del modelo).', org: 'ilustrativo (modelo) · ficha (el sentido; la Fig. 27.5 da ≈21,5 y ≈11,7)', s: ['[data-fila="cstat"]', '[data-fila="dp"]'], c: C.mejorPeep },
      { t: 'Baja la PEEP a 4: parte de las unidades se cierra al espirar y la compliance cae (reclutamiento perdido). Súbela a 20 con el mando: las cuatro unidades pasan a la zona plana de su curva, la Cstat baja otra vez y la presión se dispara hasta que salta la alarma de presión. Ese es el riesgo de volutrauma que cita el libro.', org: 'ilustrativo', s: ['#pul-esc-racimo', '[data-fila="cstat"]'], c: C.mejorPeep },
      { t: 'El libro lo muestra con un estudio real de PEEP incremental a Vt 4 mL/kg: la compliance aumenta desde PEEP 4, alcanza un máximo hacia PEEP 12 y desciende de nuevo, y la presión de conducción hace lo contrario. De ahí sale «la mejor PEEP» de ese estudio: no una cifra para todos.', org: 'ficha (Fig. 27.5)', s: ['[data-fila="dp"]'], c: C.mejorPeep },
      { t: 'Otra forma de verlo, de la curva presión-volumen: la ventilación debería ocurrir entre los dos puntos de inflexión, el inferior (empieza el reclutamiento) y el superior (empieza la sobredistensión). El colapso empieza en la espiración, al caer la presión por debajo del punto de máxima curvatura.', s: ['#pul-esc-racimo'], c: C.inflexion },
    ],
    fuentes: [C.mejorPeep, C.inflexion, C.histeresis, C.atelect],
  },
  'psv-disparo': {
    tit: 'Presión de soporte: el paciente dispara y el flujo corta', pac: 'herminia', resp: { modo: 'psv', vt: 500, fr: 16, peep: 5, flujo: 60, pinsp: 10, ie: 2, pmax: 40, ps: 10, frEsp: 16 }, pulmon: { c: 40, r: 8 }, man: {},
    frase: 'En presión de soporte el paciente dispara cada respiración y el flujo decide cuándo termina.',
    guia: [
      { t: 'Herminia respira por su cuenta. Su esfuerzo baja la presión de la vía aérea 2 o 3 cmH₂O por debajo de la PEEP y eso abre la válvula sensible a la presión del respirador: es el disparo por presión. En la curva de presión ves el hundimiento antes de cada respiración.', org: 'ficha (2-3) · esfuerzo de cada respiración: ilustrativo', s: ['paw:disparo'], c: C.disparo },
      { t: 'Disparada la respiración, el flujo es alto al principio para subir la presión de la vía aérea lo antes posible hasta el nivel pedido (PEEP 5 + soporte 10 = 15), y luego el respirador lo ajusta a lo que el paciente pide.', org: 'ilustrativo (soporte 10)', s: ['paw:insp', 'flujo:insp'], c: C.psv4 },
      { t: 'La insuflación termina cuando el flujo inspiratorio cae al 25 % del flujo pico. Mira la curva de flujo: baja desde el pico y se corta antes de llegar a cero.', s: ['flujo:insp', '[data-fila="vt"]'], c: C.psv4 },
      { t: 'Por eso el paciente fija el tiempo de insuflación y el volumen: con la misma presión de soporte, si su pulmón se pone más rígido el flujo cae antes y entra menos volumen. Prueba a bajar la compliance en la pestaña Pulmón.', s: ['[data-fila="vt"]', 'vol:insp'], c: C.psv4 },
      { t: 'Aquí no hay pausa inspiratoria ni oclusión espiratoria: la oclusión solo es fiable si el paciente no respira por su cuenta, y el modelo apaga las dos maniobras.', org: 'ficha (oclusión) · la pausa: deducción', s: ['#pul-esc-pantalla'], c: C.oclusion28 },
    ],
    fuentes: [C.disparo, C.psv4, C.oclusion28],
  },
  // ───────── E3-enganche: el pulmón mueve el corazón (js/modules/libros/pulmon-vivo/corazon.js). `corazon` dice qué corazón se calcula
  // con el motor del corazón (eco/motor.mjs, el del shock vivo): 'ic' = el de Ramiro (RECETA_IC, g = 1), 'normal' = el sano.
  'cpap-eap': {
    tit: 'CPAP en el edema agudo de pulmón: el corazón que falla eyecta más', pac: 'herminia', corazon: { tipo: 'ic', tope: 10 },
    resp: { modo: 'psv', vt: 500, fr: 16, peep: 0, flujo: 60, pinsp: 10, ie: 2, pmax: 40, ps: 0, frEsp: 16 }, pulmon: { c: 40, r: 8 }, man: {},
    frase: 'En el corazón que falla, la presión positiva en el tórax le quita trabajo al ventrículo y el volumen sistólico sube.',
    guia: [
      { t: 'Herminia, en edema agudo de pulmón, respira con CPAP: una presión constante (usualmente 5-10 cmH₂O) que evita el colapso de las vías pequeñas y los alvéolos al final de la espiración. Aquí el mando PEEP hace de CPAP y el soporte está a 0. Empieza en 0 y súbelo a 5 y a 10.', org: 'ficha · el mando PEEP como CPAP: ilustrativo', s: ['[data-fila="cor-pm"]'], c: { f: 'neumo-vni-metodos', id: 'nep-cpap-presion', sitio: 'CPAP: presión constante, usualmente 5-10 cmH₂O', p: 77 } },
      { t: 'Esa presión llega a la pleura y rodea al corazón. Marino lo enseña con la presión arterial durante una insuflación con presión positiva: sube mientras sube la presión intratorácica, y el área sombreada de la curva, que es proporcional al volumen sistólico, crece.', s: ['[data-fila="cor-pm"]', '[data-fila="cor-vs"]'], c: { f: 'neumo-vni-uso', id: 'nep-vni-edema', sitio: 'CPAP en el edema agudo de pulmón y el volumen sistólico', p: 83 } },
      { t: 'La razón es la poscarga del ventrículo izquierdo: poscarga = presión de la cámara − presión pleural. Con la pleura más positiva, la pared se mueve hacia dentro con menos esfuerzo en la sístole y la presión positiva asiste al VI en la eyección.', s: ['[data-fila="cor-vs"]'], c: { f: 'neumo-vni-uso', id: 'nep-poscarga-vpp', sitio: 'Poscarga: la presión positiva la baja (Ec. 26.1)', p: 87 } },
      { t: 'El corazón que falla está en la parte plana de la curva de precarga y en la empinada de la de poscarga: bajar la poscarga le ayuda más de lo que le cuesta perder algo de llenado. Mira el VS y el GC del panel al subir la CPAP: suben, y la PAM con ellos.', s: ['[data-fila="cor-vs"]', '[data-fila="cor-gc"]', '[data-fila="cor-pam"]'], c: { f: 'neumo-vni-uso', id: 'nep-corazon-papel', sitio: 'El papel de la función cardíaca', p: 88 } },
      { t: 'Cuánto sube: con CPAP 5, Bradley 1992 (PMID 1736745) midió +22 % del VS indexado en 11 pacientes con PCP ≥12; con PCP <12 el gasto bajó (IC 3,14→2,89). El modelo da el sentido y el orden de magnitud. El tope de la CPAP es 10, el máximo de lo habitual (5-10).', org: 'ficha · Bradley 1992 · las cifras: modelo ilustrativo', s: ['[data-fila="cor-vs"]', '#pul-cor-limite'], c: { f: 'mc-ic-manejo', id: 'mc-vpp', sitio: 'Ventilación con presión positiva en la IC', p: 14 } },
    ],
    fuentes: [{ f: 'neumo-vni-metodos', id: 'nep-cpap-presion', sitio: 'CPAP: presión constante, usualmente 5-10 cmH₂O', p: 77 }, { f: 'neumo-vni-uso', id: 'nep-vni-edema', sitio: 'CPAP en el edema agudo de pulmón y el volumen sistólico', p: 83 }, { f: 'neumo-vni-uso', id: 'nep-poscarga-vpp', sitio: 'Poscarga: la presión positiva la baja (Ec. 26.1)', p: 87 }, { f: 'neumo-vni-uso', id: 'nep-corazon-papel', sitio: 'El papel de la función cardíaca', p: 88 }, { f: 'mc-ic-manejo', id: 'mc-vpp', sitio: 'Ventilación con presión positiva en la IC', p: 14 }],
  },
  'vpp-corazon-normal': {
    tit: 'Presión positiva en el corazón sano: el volumen sistólico baja', pac: 'rafael', corazon: { tipo: 'normal' },
    resp: { modo: 'vcv', vt: 500, fr: 14, peep: 4, flujo: 60, pinsp: 10, ie: 2, pmax: 40 }, pulmon: NORMAL, man: {},
    frase: 'En el corazón sano la misma presión le frena el llenado y el gasto baja, aunque el pulmón oxigene mejor.',
    guia: [
      { t: 'Rafael tiene el corazón sano. Sube la PEEP de 4 a 20 con el mando y mira el VS, el GC y la PAM del panel del corazón.', org: 'ilustrativo · el motor del corazón del shock vivo', s: ['[data-fila="cor-pm"]', '[data-fila="cor-vs"]', '[data-fila="cor-gc"]'] },
      { t: 'La presión positiva dificulta el llenado: baja el gradiente de presión para la entrada venosa al tórax y reduce la presión transmural que llena los ventrículos, sobre todo el derecho (Fig. 26.7).', s: ['[data-fila="cor-pm"]'], c: { f: 'neumo-vni-uso', id: 'nep-precarga-vpp', sitio: 'Precarga: la presión positiva frena el llenado (Fig. 26.7)', p: '85-86' } },
      { t: 'El corazón normal está en la parte empinada de la curva de precarga y en la plana de la de poscarga: perder precarga le cuesta más gasto del que gana con menos poscarga. Por eso la presión positiva tiende a bajarle el VS, y el motor lo muestra: Jellinek 2000 (PMID 10710387) midió −23 ± 22 % con 15 cmH₂O en pacientes anestesiados en apnea.', org: 'ficha · Jellinek 2000', s: ['[data-fila="cor-vs"]'], c: { f: 'neumo-vni-uso', id: 'nep-corazon-papel', sitio: 'El papel de la función cardíaca', p: 88 } },
      { t: 'Si hay hipovolemia el efecto se magnifica: durante la ventilación con presión positiva, sobre todo con presiones altas, hay que evitarla. En el corazón sano, mantener el volumen sostiene el retorno venoso.', s: ['[data-fila="cor-gc"]', '[data-fila="cor-pam"]'], c: { f: 'neumo-vni-uso', id: 'nep-precarga-vpp', sitio: 'La hipovolemia magnifica el efecto sobre el llenado', p: 86 } },
      { t: 'En el estudio de SDRA de Marino, el PaO₂/FiO₂ sube con cada escalón de PEEP mientras el índice cardíaco baja: la PEEP magnifica el freno al llenado y puede anular el beneficio en el aporte de O₂ (DO₂ = GC × CaO₂). Este modelo no calcula gases: la subida del cociente no se ve aquí, pero la caída del GC sí.', s: ['[data-fila="cor-gc"]'], c: { f: 'neumo-vm-ajuste', id: 'nep-peep-gc', sitio: 'PEEP: oxigenación y aporte de O₂ (Fig. 27.6)', p: 12 } },
    ],
    fuentes: [{ f: 'neumo-vni-uso', id: 'nep-precarga-vpp', sitio: 'Precarga: la presión positiva frena el llenado (Fig. 26.7)', p: '85-86' }, { f: 'neumo-vni-uso', id: 'nep-corazon-papel', sitio: 'El papel de la función cardíaca', p: 88 }, { f: 'neumo-vni-uso', id: 'nep-precarga-vpp', sitio: 'La hipovolemia magnifica el efecto sobre el llenado', p: 86 }, { f: 'neumo-vm-ajuste', id: 'nep-peep-gc', sitio: 'PEEP: oxigenación y aporte de O₂ (Fig. 27.6)', p: 12 }],
  },
};
export const ORDEN_ESTADOS = ['normal-vcv', 'pcv', 'pausa-inspiratoria', 'sdra-rigido', 'sdra-protector', 'volutrauma', 'broncoespasmo-auto-peep', 'auto-peep-corregida', 'eulalia-conectada', 'eulalia-ajustada', 'psv-disparo', 'atelectrauma-zeep', 'mejor-peep', 'cpap-eap', 'vpp-corazon-normal'];

export const PROFUNDIZAR = [
  { t: 'Presión soporte y el disparo (por presión 2-3 cmH₂O, por flujo 1-10 L/min): el paciente que respira entra en la pieza 4.', c: { f: 'neumo-vm-ajuste', id: 'nep-disparo-presion', sitio: 'Disparo por presión (p. 8) y por flujo (p. 9)', p: '8-9' } },
  { t: 'PRVC, el modo adaptativo que entrega el volumen con la menor presión.', c: { f: 'neumo-vm-modos', id: 'nep-prvc', sitio: 'PRVC', p: '4-5' } },
  { t: 'La presión media de la vía aérea (5-10 normal, 10-20 obstrucción, 20-30 pulmón rígido) y su relación con la hemodinámica: con el corazón (M8), en la pieza 3.', c: C.pMedia },
  { t: 'La mejor PEEP (4 → 12 → 20 a 4 mL/kg PBW) y el gasto cardíaco: Figs. 27.5-27.6.', c: { f: 'neumo-vm-ajuste', id: 'nep-mejor-peep', sitio: 'La mejor PEEP', p: '11-12' } },
  { t: 'La PEEP aplicada justo por debajo de la oculta («probablemente no merece la pena», p. 33): es el colapso de la vía pequeña en la obstrucción del EPOC, que el racimo de SDRA de esta pieza no modela.', c: C.noMerece },
  { t: 'Presión transpulmonar y balón esofágico: separar el pulmón de la pared torácica.', c: { f: 'neumo-vm-modos', id: 'nep-transpulmonar', sitio: 'Presión transpulmonar', p: 2 } },
];

export const REFS = [
  ['ARDS Network. Ventilation with lower tidal volumes as compared with traditional tidal volumes for acute lung injury and the ARDS. N Engl J Med. 2000;342(18):1301-8.', '10793162', '10.1056/NEJM200005043421801'],
  ['Tuxen DV, Lane S. Effects of ventilatory pattern on hyperinflation, airway pressures, and circulation in mechanical ventilation of patients with severe air-flow obstruction. Am Rev Respir Dis. 1987;136(4):872-9.', '3662241', '10.1164/ajrccm/136.4.872'],
  ['Marini JJ. Dynamic hyperinflation and auto-PEEP: lessons learned over 30 years. Am J Respir Crit Care Med. 2011;184(7):756-62.', '21700908', '10.1164/rccm.201102-0226PP'],
  ['Farmery AD, Roe PG. A model to describe the rate of oxyhaemoglobin desaturation during apnoea. Br J Anaesth. 1996;76(2):284-91.', '8777112', '10.1093/bja/76.2.284'],
  ['Benumof JL, Dagg R, Benumof R. Critical hemoglobin desaturation will occur before return to an unparalyzed state following 1 mg/kg intravenous succinylcholine. Anesthesiology. 1997;87(4):979-82.', '9357902', '10.1097/00000542-199710000-00034'],
  ['Eger EI, Severinghaus JW. The rate of rise of PaCO2 in the apneic anesthetized patient. Anesthesiology. 1961;22:419-25.', '13725901', '10.1097/00000542-196105000-00013'],
];

// ---------------------------------------------------------------- E4a · el paciente que respira y las asincronías
// Ceferino (asincronías y prueba de respiración espontánea) y Elvira (P-SILI) son pacientes de este bloque. La ficha no tiene ids
// propios en estos párrafos: la cita apunta a la hoja entera (data-resaltar con el id de la hoja).
const NEUMO_E4 = ['neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs'];
FICHA['neumo-sdra-no-ventilatorio'] = [NEUMO_E4, 'SDRA: tratamiento no ventilatorio', 'SDRA no ventilatorio', PDF_A, 'Marino 2024'];
FICHA['neumo-sbt'] = [NEUMO_E4, 'Prueba de respiración espontánea', 'Prueba de respiración espontánea', PDF_B, 'Marino 2024'];
Object.assign(C, {
  ecMov: { f: 'libro-azul-resp2', id: null, sitio: 'Ecuación del movimiento: Pmus + Pvent = flujo × resistencia + Vt/C + PEEP (p. 511)', p: 47 },
  asincronia: { f: 'libro-azul-resp2', id: null, sitio: 'Asincronías; esfuerzos ineficaces, la más frecuente (p. 557)', p: 93 },
  doble: { f: 'libro-azul-resp2', id: null, sitio: 'Doble desencadenante: dos inspiraciones en menos de la mitad del Ti; Fig. 27 (pp. 558-559)', p: '94-95' },
  inverso: { f: 'libro-azul-resp2', id: null, sitio: 'Desencadenante inverso: sobredistensión; Hering-Breuer, «en proceso de investigación» (pp. 558-559)', p: '94-95' },
  psili: { f: 'neumo-sdra-no-ventilatorio', id: 'nep-psili', sitio: 'P-SILI: esfuerzo aumentado, Vt ≥9,5 mL/kg e intubar antes que después (Fig. 24.4)', p: '40-42' },
  sbt: { f: 'neumo-sbt', id: 'nep-sbt-tabla', sitio: 'Tabla 30.1: criterios y predictores de éxito de la prueba', p: 52 },
  pimax: { f: 'neumo-sbt', id: 'nep-sbt-pimax', sitio: 'Presión inspiratoria máxima: −120 y −84 de media; amenaza a −20 o −30', p: 58 },
});
NOTAS.push(
  { k: 'pmus-ilu', tipo: 'calla', txt: 'La ecuación del movimiento (Libro azul IV, p. 511) incluye el esfuerzo del paciente (Pmus), pero ninguna fuente de este plan da su amplitud ni su duración. Aquí el esfuerzo es ilustrativo: 0 a 15 cmH₂O, con aviso a 12 y duración y ritmo propios de cada estado. La presión inspiratoria máxima de Marino (−120 y −84 cmH₂O de media, y amenaza de la ventilación a −20 o −30; cap. 30 p. 58) es un esfuerzo máximo contra vía cerrada, no el esfuerzo de reposo.', citas: [C.ecMov, C.pimax] },
  { k: 'refractario-ilu', tipo: 'calla', txt: 'El Libro azul define el doble disparo como dos inspiraciones en menos de la mitad del tiempo inspiratorio (Fig. 27) pero no da el valle entre ambas. El modelo usa un tiempo refractario de 0,25 s (ilustrativo) tras acabar la insuflación; el valle de la curva sale de ahí. El disparo inverso se rotula «en investigación» porque el propio libro dice que su mecanismo (Hering-Breuer) no está establecido.', citas: [C.doble, C.inverso] },
);
PACIENTES.push(
  { k: 'ceferino', nombre: 'Ceferino', chip: '67 a · neumonía en resolución', linea: '67 años, 1,75 m, neumonía en resolución, sedación ligera: dispara el respirador y se prueba su destete. PBW 70,5 kg.', talla: 175, sexo: 'v', estado: 'asincronia-ineficaz' },
  { k: 'elvira', nombre: 'Elvira', chip: '45 a · trasplantada renal · P-SILI', linea: '45 años, 58 kg, 1,60 m (talla ilustrativa), trasplantada renal; neumonía con fallo hipoxémico que sigue respirando con mucho esfuerzo; intubada. PBW 52,4 kg.', talla: 160, sexo: 'm', estado: 'p-sili' },
);
const RESP_E4 = { vt: 500, fr: 16, peep: 5, flujo: 60, pinsp: 10, ie: 2, pmax: 40 };
Object.assign(ESTADOS, {
  'asincronia-ineficaz': {
    tit: 'Esfuerzo ineficaz: empuja y no dispara', pac: 'ceferino', pmus: true, seg: 8, resp: { ...RESP_E4, modo: 'vcv', vt: 400, fr: 12, pmus: 2.5, tin: 0.8, frNeural: 20 }, pulmon: { c: 60, r: 8 }, man: {},
    frase: 'El paciente hace fuerza y el respirador no se entera: sin disparo, ese esfuerzo no recibe volumen.',
    guia: [
      { t: 'El esfuerzo del paciente (Pmus) se suma a la presión del respirador en la ecuación del movimiento: Pmus + Pvent = flujo × resistencia + Vt/C + PEEP. En la curva «Pmus» ves cada empujón de Ceferino, cada 3 s.', org: 'ficha (ecuación) · amplitud y ritmo del esfuerzo: ilustrativo', s: ['pmus:esp', '#pul-trazas'], c: C.ecMov },
      { t: 'Para disparar, el esfuerzo tiene que bajar la presión de la vía aérea 2 o 3 cmH₂O por debajo de la PEEP. Aquí el empujón es de 2,5 cmH₂O y la Paw apenas se hunde en la espiración: no llega al umbral y la válvula no se abre.', org: 'ficha (2-3) · 2,5: ilustrativo', s: ['paw:esp'], c: C.disparo },
      { t: 'Eso es un esfuerzo ineficaz: el paciente hace un esfuerzo inspiratorio que no consigue desencadenar la asistencia. Es la asincronía más frecuente. Con el disparo por presión, alrededor de un tercio de los esfuerzos inspiratorios fracasa.', s: ['paw:esp', 'pmus:esp'], c: C.asincronia },
      { t: 'Fíjate en que bajo la Paw no hay ningún triángulo de disparo en esos empujones: las respiraciones que sí entran son las de respaldo del respirador, por tiempo (FR 12). El respirador no entrega ningún volumen por los esfuerzos ineficaces.', org: 'ficha (disparo por tiempo) · cifras: modelo', s: ['paw:insp', 'flujo:insp'], c: C.disparo },
      { t: 'Prueba: sube el esfuerzo con el deslizador «Esfuerzo (Pmus)» hasta que dispare (hacia 3 cmH₂O con estos ajustes): aparece el triángulo bajo la Paw y entran 400 mL. Por encima de 12 cmH₂O sale el aviso de esfuerzo excesivo.', org: 'ilustrativo (3 y 12)', s: ['#pul-trazas'], c: C.disparo },
    ],
    fuentes: [C.ecMov, C.disparo, C.asincronia],
  },
  'doble-disparo': {
    tit: 'Doble disparo: dos respiraciones por un esfuerzo', pac: 'ceferino', pmus: true, seg: 6, resp: { ...RESP_E4, modo: 'vcv', vt: 300, fr: 12, flujo: 30, pmus: 14, tin: 2.2, frNeural: 12 }, pulmon: { c: 60, r: 8 }, man: {},
    frase: 'Un esfuerzo largo dispara dos veces: el volumen que entra es casi el doble del programado.',
    piensa: {
      q: 'Ceferino tiene programados 300 mL. En la pantalla, cada esfuerzo suyo produce dos picos de presión seguidos, con un valle corto entre ambos. ¿Qué asincronía ves?',
      ops: [
        { t: 'Esfuerzo ineficaz: el paciente empuja y el respirador no llega a dispararse nunca.', ok: false, e: 'En el esfuerzo ineficaz no hay ningún pico tras el empuje: ese esfuerzo no entrega volumen. Aquí cada esfuerzo entrega dos insuflaciones; si lo confundes, no verías que el Vt real se duplica.', c: C.asincronia },
        { t: 'Doble disparo: el esfuerzo dura más que la insuflación y dispara otra.', ok: true, e: 'Son dos inspiraciones en menos de la mitad del tiempo inspiratorio: el valle (0,25 s) es menor que la mitad del Ti (0,6 s). El paciente recibe dos volúmenes apilados.', c: C.doble },
        { t: 'Autodisparo: el respirador insufla sin que el paciente haga esfuerzo.', ok: false, e: 'El autodisparo es una insuflación sin esfuerzo previo del paciente. Aquí el esfuerzo (Pmus) es visible y precede a cada pico; tratarlo como autodisparo llevaría a sedar o a cambiar el umbral de disparo, y el Vt apilado seguiría.', c: C.doble },
      ],
      exp: 'Cuenta los picos de Paw por cada esfuerzo: ninguno es un esfuerzo ineficaz; dos con un valle corto son un doble disparo; uno sin esfuerzo previo es un autodisparo.',
    },
    guia: [
      { t: 'La causa: el esfuerzo del paciente dura más (2,2 s, ilustrativo) que la insuflación del respirador (0,6 s). Los tiempos inspiratorio y espiratorio neurales son distintos de los del ventilador: eso es una asincronía.', org: 'ficha (definición) · 2,2 s: ilustrativo', s: ['pmus:insp', 'paw:insp'], c: C.asincronia },
      { t: 'Cuando acaba la primera insuflación el esfuerzo sigue ahí y vuelve a bajar la Paw por debajo de la PEEP: el respirador dispara otra vez. Ves dos picos con un valle corto entre ambos, con el triángulo de disparo bajo cada uno.', org: 'ficha (Fig. 27) · valle de 0,25 s: ilustrativo', s: ['paw:insp', 'paw:esp'], c: C.doble },
      { t: 'Definición: dos inspiraciones en un tiempo inferior a la mitad del tiempo inspiratorio. Aquí el valle (0,25 s) cabe en la mitad del Ti de 0,6 s (0,3 s).', s: ['paw:esp'], c: C.doble },
      { t: 'Consecuencia: los dos volúmenes se apilan sin espirar entre ambos. Programaste 300 mL (4,3 mL/kg de peso ideal) y el Vt espirado sale cerca de 700 mL (9,9 mL/kg): la ventilación «protectora» deja de serlo.', org: 'ficha (6-8 mL/kg: Tabla 27.1) · cifras: modelo', s: ['[data-fila="vt"]', 'vol:insp'], c: C.t271 },
      { t: 'Su primo es el disparo inverso: un nuevo disparo dentro de un ciclo inspiratorio, con el riesgo de sobredistensión. Se relaciona con el reflejo de Hering-Breuer, pero el propio libro dice que está en proceso de investigación.', org: 'en investigación', s: ['#pul-trazas'], c: C.inverso },
    ],
    fuentes: [C.asincronia, C.doble, C.inverso, C.t271],
  },
  'p-sili': {
    tit: 'P-SILI: respira con tanto esfuerzo que se lesiona', pac: 'elvira', pmus: true, resp: { ...RESP_E4, modo: 'psv', ps: 10, frEsp: 26, pmus: 6.5, tin: 1 }, pulmon: { c: 40, r: 8 }, man: {},
    frase: 'Si el esfuerzo del paciente es muy grande, el volumen que mueve puede lesionar su propio pulmón.',
    guia: [
      { t: 'A la presión de soporte (10 cmH₂O) Elvira suma su propio esfuerzo (Pmus 6,5 cmH₂O): los dos empujan el aire a la vez, según la ecuación del movimiento. Mira el flujo y la curva «Pmus» durante la inspiración.', org: 'ficha (ecuación) · 6,5: ilustrativo', s: ['pmus:insp', 'flujo:insp'], c: C.ecMov },
      { t: 'El resultado es un Vt de unos 515 mL: 9,8 mL/kg de peso ideal (52,4 kg). Los pacientes que fracasan con la ventilación no invasiva tienen típicamente Vt ≥9,5 mL/kg, señal de un esfuerzo respiratorio aumentado.', org: 'ficha (9,5) · Vt: modelo', s: ['[data-fila="vt"]'], c: C.psili },
      { t: 'Eso es el P-SILI, la lesión pulmonar autoinducida por el paciente: respirar con mucho esfuerzo puede lesionar el pulmón como lo haría el propio ventilador. Si sigue con esfuerzo aumentado, la ficha aconseja intubar y ventilar antes mejor que después.', s: ['#pul-esc-racimo'], c: C.psili },
      { t: 'Baja el esfuerzo con el deslizador «Esfuerzo (Pmus)»: por debajo de 5 el Vt cae de 9,5 mL/kg y el sello desaparece. Es lo que buscan el oxígeno de alto flujo y la sedación: respirar cómodo, sin el volumen excesivo.', org: 'ficha (alivio de la disnea) · umbral 5: modelo', s: ['[data-fila="vt"]'], c: C.psili },
    ],
    fuentes: [C.ecMov, C.psili, C.disparo],
  },
  'sbt-ok': {
    tit: 'Prueba de respiración espontánea: la supera', pac: 'ceferino', pmus: false, resp: { ...RESP_E4, modo: 'psv', ps: 5, frEsp: 20 }, pulmon: { c: 80, r: 5 }, man: {},
    frase: 'Si respira con calma y volumen suficiente, la prueba sale bien.',
    guia: [
      { t: 'Ceferino cumple los criterios para intentarlo: SpO₂ ≥90 % con FiO₂ ≤50 %, PEEP ≤8, estable y despierto. Se deja conectado al respirador con un soporte bajo (5 cmH₂O), que vence la resistencia del circuito.', s: ['#pul-esc-pantalla'], c: C.sbt },
      { t: 'Durante la prueba se miden los predictores de éxito: Vt de 4 a 6 mL/kg, FR <40, cociente FR/Vt entre 60 y 105, presión inspiratoria máxima más negativa que −20 cmH₂O. Aquí: Vt de unos 300 mL (4,3 mL/kg), FR 20, FR/Vt de unos 66.', org: 'ficha (Tabla 30.1) · cifras: modelo', s: ['[data-fila="vt"]'], c: C.sbt },
      { t: 'Cada predictor falla a veces en un paciente concreto; juntos dan una buena idea de cómo irá, y los cambios seguidos pesan más que una medida suelta.', s: ['#pul-esc-pantalla'], c: C.sbt },
    ],
    fuentes: [C.sbt, C.pimax],
  },
  'sbt-fracaso': {
    tit: 'Prueba de respiración espontánea: respira rápido y superficial', pac: 'ceferino', pmus: false, resp: { ...RESP_E4, modo: 'psv', ps: 5, frEsp: 34, pmus: 3, tin: 1 }, pulmon: { c: 30, r: 12 }, man: {},
    frase: 'Mucha frecuencia y poco volumen: el cociente FR/Vt por encima de 105 anuncia que la prueba fracasa.',
    guia: [
      { t: 'La misma prueba, otro patrón (Ceferino otro día, con el pulmón más rígido: compliance 30, ilustrativo). Respira rápido y superficial: FR 34 y Vt de unos 170 mL (2,5 mL/kg).', org: 'cifras: modelo · compliance 30: ilustrativo', s: ['flujo:insp', '[data-fila="vt"]'], c: C.sbt },
      { t: 'El cociente FR/Vt sale cerca de 200 respiraciones por minuto y litro, muy por encima de 105. Dos predictores de éxito fallan a la vez: Vt por debajo de 4 mL/kg y FR/Vt >105.', org: 'ficha (Tabla 30.1) · cifras: modelo', s: ['[data-fila="vt"]'], c: C.sbt },
      { t: 'La respiración rápida y superficial es un patrón frecuente en los pacientes que fracasan la prueba. Por eso se hace conectado al respirador: permite ver el Vt y la FR.', s: ['#pul-esc-pantalla'], c: C.sbt },
      { t: 'Y si la presión inspiratoria máxima cae a −20 o −30 cmH₂O, la ventilación en reposo está amenazada: es el umbral de los predictores de la prueba.', org: 'ficha (PImax)', s: ['#pul-esc-pantalla'], c: C.pimax },
    ],
    fuentes: [C.sbt, C.pimax],
  },
});
ORDEN_ESTADOS.push('p-sili', 'asincronia-ineficaz', 'doble-disparo', 'sbt-ok', 'sbt-fracaso');

// ---------------------------------------------------------------- E4b · el neumotórax a tensión en el ventilado (neumotorax.js)
FICHA['neumo-cuidado-barotrauma'] = [NEUMO_E4, 'Cuidado del tubo y barotrauma', 'Barotrauma', PDF_B, 'Marino 2024'];
Object.assign(C, {
  tension: { f: 'neumo-cuidado-barotrauma', id: 'nep-neumotorax-tension', sitio: 'Neumotórax a tensión: hipoxemia o hipotensión inexplicadas en el ventilado (Fig. 28.7)', p: 28 },
  descompresion: { f: 'neumo-cuidado-barotrauma', id: 'nep-descompresion', sitio: 'Descompresión: angiocatéter 14 G de 8 cm, 5.º espacio, por delante de la línea axilar media', p: 29 },
});
export const NEUMOTORAX = {
  tope: 20, shock: 10.5, parada: 13.5, paso: 0.75, spo2Base: 98, spo2PorCmH2O: 0.6,   // ilustrativo: cmH₂O de presión pleural extra (shock obstructivo desde 10,5, donde la PAM del monitor queda en 59 mmHg tras acotar el alivio de la poscarga; parada sin pulso desde 13,5, donde el motor ya da un gasto de 0,2 L/min y una PAM de 18: sin pulso palpable); +0,75 por respiración (2 respiraciones por pulsación = +1,5); SpO₂ = 98 − 0,6 · P
  figura: 'js/modules/neumologia/img/neumo-fig28-7-radiografia-neumotorax-tension.jpg',
  sitios: {
    correcto: { k: 'correcto', et: '5.º espacio, por delante de la línea axilar media · 14 G, 8 cm', ok: true,
      e: 'Es el sitio y el catéter que recomienda Marino: angiocatéter de calibre 14 y 8 cm en el 5.º espacio intercostal, justo por delante de la línea axilar media. Llega al espacio pleural: el aire sale, la presión intratorácica cae, el pulmón se expande y el gasto vuelve. Después hace falta un tubo de tórax de calibre fino (8,5-14 French).', c: C.descompresion },
    clasico: { k: 'clasico', et: '2.º espacio, línea medioclavicular · aguja de 5 cm (ilustrativo)', ok: false,
      e: 'Es el error clásico: Marino dice que el fallo es más frecuente con catéteres más cortos y en el 2.º espacio a nivel de la línea medioclavicular. La pared torácica ahí es gruesa y la aguja corta no alcanza la pleura (la cifra de 5 cm es ilustrativa: la fuente solo dice «más corta»). El aire sigue dentro: el paciente continúa sin gasto. Elige el otro sitio; si la aguja falla, Marino recomienda la descompresión con el dedo.', c: C.descompresion },
  },
};
ESTADOS['neumotorax-tension'] = {
  tit: 'Neumotórax a tensión en el ventilado: la presión crece en cada ciclo', pac: 'rafael', corazon: { tipo: 'normal', neumo: true },
  resp: { modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60, pinsp: 10, ie: 2, pmax: 40 }, pulmon: NORMAL, man: { pausa: true },
  frase: 'El aire entra en la pleura con cada insuflación y no sale: el pico y la meseta suben a la vez, y la PA y la saturación caen.',
  guia: [
    { t: 'Rafael, el politrauma ventilado, de pronto tiene hipoxemia o hipotensión sin explicación. En el ventilado hay que pensar en el neumotórax a tensión: la presión positiva mete aire en la pleura y no deja que salga. Pulsa «Dejar pasar 2 respiraciones» y mira cómo crece la presión del neumotórax.', org: 'ficha · la presión que crece por ciclo: ilustrativo', s: ['#pul-neumo'], c: C.tension },
    { t: 'Pico y meseta suben juntos, y su diferencia se queda igual. Es una deducción nuestra de las ecuaciones: el pico es resistencia más elasticidad (Ec. 27.1), la meseta es solo la elasticidad (27.2) y su diferencia es la resistencia (27.3). El aire pleural endurece el sistema respiratorio, sube la parte elástica en las dos presiones y la resistencia no cambia.', org: 'deducción de la Ec. 27.1-27.3 · Marino no lo dice', s: ['[data-fila="pico"]', '[data-fila="meseta"]', '[data-fila="pres"]'], c: C.ec271 },
    { t: 'El aire pleural comprime el pulmón y aumenta la presión intratorácica. Marino lo describe: colapsa el pulmón del mismo lado y produce una caída progresiva del gasto cardíaco que acaba en shock obstructivo y, después, paro por actividad eléctrica sin pulso. En el modelo, desde 10,5 cmH₂O de aire pleural salta el sello de shock obstructivo (con 10,5 la PAM del monitor es ≈59 mmHg y la SpO₂ ≈92 %) y desde 13,5, el de parada sin pulso (sin PAM ni gasto medibles), y a 20 no sube más. Mira la PAM y la SpO₂.', org: 'ficha · cap. 28 p. 28 (shock obstructivo y paro sin pulso) · las cifras y el 10,5 del sello: modelo ilustrativo', s: ['[data-fila="cor-pam"]', '[data-fila="cor-gc"]', '[data-fila="neumo-spo2"]'], c: C.tension },
    { t: 'Se reconoce fácil en la radiografía portátil: sin marcas pulmonares en el hemitórax afectado, hemidiafragma deprimido y mediastino desplazado al lado contrario (Fig. 28.7). Es una emergencia médica: requiere descompresión inmediata, no esperar a la placa.', org: 'ficha', s: ['#pul-neumo-fig'], c: C.tension },
    { t: 'Descomprime: elige el sitio y pulsa «Descomprimir». El recomendado es un angiocatéter de 14 G y 8 cm en el 5.º espacio intercostal, justo por delante de la línea axilar media. Prueba antes el 2.º espacio en la línea medioclavicular con la aguja corta (5 cm, ilustrativa): es donde más falla.', org: 'ficha', s: ['#pul-neumo-sitios'], c: C.descompresion },
  ],
  fuentes: [C.tension, C.descompresion, C.ec271, C.meseta],
};
ORDEN_ESTADOS.push('neumotorax-tension');
NOTAS.push({ k: 'neumo-pico-meseta', tipo: 'calla', txt: 'Marino no dice cómo cambian el pico y la meseta en el neumotórax a tensión. Que suban juntos, con la misma diferencia, es una deducción de las Ec. 27.1-27.3 (pico = Pres + Pel; meseta = Pel; pico − meseta = Pres). La presión del neumotórax (1,5 cmH₂O por respiración, sello de shock desde 10,5, sello de parada sin pulso desde 13,5), la SpO₂ (98 − 0,6 por cmH₂O) y los 5 cm de la aguja corta son ilustrativos; la fuente no da cifras de saturación ni de presión pleural, solo dice «hipoxemia o hipotensión inexplicadas».', citas: [C.ec271, C.meseta, C.tension] });
