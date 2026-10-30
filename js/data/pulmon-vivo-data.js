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
  t271: { f: 'neumo-vm-ajuste', id: 'nep-tabla-27-1', sitio: 'Tabla 27.1 (PBW, Vt, PEEP)', p: 14 },
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
  tubuladura: { f: 'neumo-vm-modos', id: 'nep-errores-compliance', sitio: 'Corrección por la tubuladura (3 mL/cmH₂O)', p: 7 },
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
  histeresis: { f: 'libro-azul-resp1', id: null, sitio: 'Histéresis: abrir pide más presión que mantener abierto; ~30 000 ciclos al día (pp. 450-451)', p: '66-67' },
  inflexion: { f: 'libro-azul-resp2', id: null, sitio: 'Puntos de inflexión; el colapso empieza al espirar (pp. 550-551)', p: '86-87' },
  hipercapnia: { f: 'neumo-sdra-ventilacion', id: 'nep-hipercapnia', sitio: 'Hipercapnia permisiva', p: 49 },
};
export const NOTA_TIPO = { discrepan: ['Las fuentes discrepan', ''], calla: ['La fuente no lo dice', 'calla'], autor: ['Opinión del autor', 'autor'], errata: ['Errata de la fuente', 'errata'] };
export const NOTAS = [
  { k: 'r-tau', tipo: 'calla', txt: 'Marino no da la resistencia de la vía aérea, la constante de tiempo (τ = R·C) ni una cifra de PEEP oculta por paciente. El modelo las pone como ilustrativo: R 5 cmH₂O por L/s en el pulmón normal, 20 en el broncoespasmo (ninguna fuente de este plan da esas cifras; solo se apoya en que la presión pico suma resistencia y elastancia, cap. 27 p. 3, y en Tuxen 1987); y en el broncoespasmo hace la resistencia espiratoria mayor que la inspiratoria (ilustrativo), que es lo que deja el pulmón sin vaciarse.', citas: [C.defOculta] },
  { k: 'oclusion-insp', tipo: 'errata', txt: 'En los ajustes del cap. 27 el libro dice «medir la PEEP oculta con el método de oclusión al final de la inspiración» (p. 15); en el mismo capítulo (p. 6) y en el cap. 28 (p. 31-32) la maniobra es al final de la espiración, que es la que mide la PEEP oculta (la inspiratoria mide la meseta). El modelo sigue la espiratoria y lo deja anotado.', citas: [C.ocultaAjuste, C.oclusion28] },
  { k: 'meseta-30', tipo: 'discrepan', txt: 'El objetivo de meseta es «≤30 cmH₂O» en el texto (cap. 24 p. 48; cap. 27 p. 4) y la Tabla 24.5 baja el Vt «hasta meseta <30». El modelo marca en rojo por encima de 30 y muestra las dos formas.', citas: [C.protectora, C.t245] },
  { k: 'cifras-ilu', tipo: 'calla', txt: 'Ninguna fuente da estas cifras de tope, que son ilustrativas: volumen minuto 2-20 L/min (lo más cercano: «VM alta ≥10 L/min», cap. 27 p. 14; Tuxen 1987 ventiló a 10, 16 y 26 L/min en obstrucción grave), PEEP total ≤20 (el mecanismo está en cap. 28 p. 31-33; Marini 2011 como lectura), alarma de presión 45/50 (el 50 de ARDS Network 2000 es la meseta del brazo tradicional, no un pico; la ficha quiere la meseta ≤30, cap. 27 p. 14), Ti mínimo 0,2 s (sale de Ti = VT ÷ flujo; la ficha pide I:E ≥1:2), compliance mínima 15 (la ficha dice «<25», sin suelo) y resistencia 5/20. Nota: la presión pico depende sobre todo del flujo inspiratorio y no refleja el volumen pulmonar (Tuxen 1987).', citas: [C.t271] },
  { k: 'fr-35', tipo: 'calla', txt: 'La ficha pide no pasar de 35 respiraciones por minuto (cap. 27 p. 14, tabla 27.1). Por encima, el libro advierte de que la respiración rápida favorece la hiperinflación y la PEEP intrínseca, y eso puede bajar el gasto cardíaco (cap. 27 p. 55; lo dice a propósito de las pruebas de respiración espontánea). Tuxen 1987 (PMID 3662241): al subir la frecuencia, menos tiempo espiratorio, más hiperinflación e hipotensión.', citas: [C.t271] },
  { k: 'apnea', tipo: 'calla', txt: 'Al detener la ventilación, la saturación cae y el CO₂ sube en minutos (Farmery 1996; Benumof 1997; Eger 1961). La velocidad depende de la oxigenación previa, el consumo de O₂, el volumen alveolar y el shunt, y es peor en obesos. El modelo no calcula gases y no da cifras por minuto: ninguna de las fuentes abiertas aquí las trae.', citas: [] },
  { k: 'racimo-ilu', tipo: 'calla', txt: 'El libro describe el fenómeno (cada unidad abre a una presión y se mantiene abierta a otra más baja; abrir y cerrar unas 30 000 veces al día), pero no da las presiones. El racimo usa cuatro unidades con apertura a 16, 20 y 24 cmH₂O y cierre a 6, 8 y 10 (la primera siempre abierta), y una cola que se aplana por encima de 26-29: todo ilustrativo. Es un pulmón de SDRA reclutable inventado, no una medida. La PEEP aplicada "justo por debajo de la oculta" del EPOC (p. 32-33) sigue sin modelarse: aquel colapso es de la vía pequeña en la obstrucción.', citas: [C.histeresis, C.inflexion, C.peepAplicada] },
  { k: 'dp-sin-objetivo', tipo: 'calla', txt: 'La presión de conducción (meseta − PEEP) se calcula, pero Marino no da un objetivo numérico para ella, así que la calculadora no pone ninguno: el único objetivo de presión del libro es la meseta ≤30. La Fig. 27.5 solo la usa para buscar la mejor PEEP.', citas: [C.cstat, C.protectora] },
  { k: 'psv-ilu', tipo: 'calla', txt: 'En la presión de soporte el modelo pone como ilustrativo lo que Marino no da: la frecuencia del paciente (16 por minuto), la compliance y la resistencia de Herminia, el tiempo que tarda su esfuerzo en llegar al umbral (0,1 s) y la pequeña variación del esfuerzo entre respiraciones (siempre dentro de 2-3 cmH₂O, con semilla fija: sale igual cada vez). El esfuerzo muscular como tal no está en el modelo.', citas: [C.disparo, C.psv4] },
  { k: 'causas-pico', tipo: 'calla', txt: 'Las páginas citadas (cap. 27 pp. 2-4) separan la parte de resistencia de la parte elástica del pico (Ec. 27.1-27.3) pero no enumeran las causas clínicas de un pico alto; el árbol de la página solo reparte entre resistencia y elasticidad y no lista causas.', citas: [C.ec271, C.meseta] },
  { k: 'tau-ilu', tipo: 'calla', txt: 'El libro azul da la definición de la constante de tiempo y las 4-5 constantes para eliminar la auto-PEEP; la cifra del par del modelo (R 20 × C 60 = 1,2 s) es ilustrativa. El libro azul no tiene ficha en la app: la cita lleva solo al PDF.', citas: [C.tau] },
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
      { t: 'Con la meseta ya puedes calcular la compliance estática: Vt / (meseta − PEEP total). Ojo: la PEEP se resta, y al Vt se le quita lo que se queda en la tubuladura (3 mL por cmH₂O): (500 − 25) / (13 − 5) ≈ 57 mL/cmH₂O.', s: ['[data-fila="cstat"]'], c: C.cstat },
      { t: 'Sin esa corrección saldrían 60: en un pulmón sano es poco; con una meseta de 40 se pierden 120 mL y la compliance se sobreestima.', s: ['[data-fila="cstat"]'], c: C.tubuladura },
      { t: 'La que importa para el alvéolo es la meseta, no el pico: el riesgo de rotura es insignificante si la meseta es ≤30 cmH₂O.', s: ['[data-fila="meseta"]', '#pul-esc-racimo'], c: C.riesgo },
    ],
    fuentes: [C.fig272, C.meseta, C.cstat, C.tubuladura, C.riesgo],
  },
  'sdra-rigido': {
    tit: 'SDRA: pulmón rígido con 6 mL/kg', pac: 'isidro', resp: { modo: 'vcv', vt: 420, fr: 30, peep: 10, flujo: 60, pinsp: 15, ie: 2, pmax: 50 }, pulmon: { c: 19, r: 8 }, man: { pausa: true },
    frase: 'Un pulmón al 50 % no admite el volumen de uno entero.',
    guia: [
      { t: 'Isidro tiene SDRA: compliance 19 mL/cmH₂O (en el SDRA es típicamente <25). El racimo de alvéolos está lleno de exudado y rígido.', s: ['#pul-esc-racimo', '[data-fila="cstat"]'], c: C.cstat },
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
      { t: 'Ese abrir y cerrar crea fuerzas de cizalla que dañan el epitelio de la vía aérea: es el atelectrauma, y se evita o se reduce aplicando PEEP para mantener abierta la vía pequeña al final de la espiración. Con tantas respiraciones al día, la lesión se acumula (unas 30 000 aperturas y cierres).', s: ['#pul-esc-racimo', '#pul-esc-atel'], c: C.atelect },
      { t: 'La compliance lo paga: la Cstat sale baja porque parte del pulmón no participa. Sube la PEEP a 12 con el mando y compara: las tres unidades dejan de cerrarse.', org: 'modelo (cifras ilustrativas)', s: ['[data-fila="cstat"]', '#pul-esc-pantalla'], c: C.mejorPeep },
    ],
    fuentes: [C.atelect, C.histeresis, C.inflexion, C.mejorPeep],
  },
  'mejor-peep': {
    tit: 'La mejor PEEP: 4 → 12 → 20', pac: 'isidro', resp: { modo: 'vcv', vt: 282, fr: 20, peep: 12, flujo: 60, pinsp: 15, ie: 2, pmax: 40 }, pulmon: { c: 19, r: 8, racimo: 'sdra' }, man: { pausa: true },
    frase: 'Con PEEP 12 no hay unidades que se cierren y la compliance es la mejor; subirla más sobredistiende.',
    guia: [
      { t: 'Con PEEP baja (5-10 cmH₂O) se previene el colapso de los espacios aéreos distales; con más (10-20) se abren espacios ya colapsados (reclutamiento). Pero una PEEP alta también sobredistiende los alvéolos de las zonas sanas.', s: ['#pul-esc-racimo'], c: C.mejorPeep },
      { t: 'Con PEEP 12, Vt 4 mL/kg: las cuatro unidades están abiertas y ninguna se abre y se cierra. La compliance es la más alta de todo el barrido, y la presión de conducción (meseta − PEEP), la más baja.', org: 'modelo (cifras ilustrativas) · ficha (el sentido)', s: ['[data-fila="cstat"]', '[data-fila="dp"]'], c: C.mejorPeep },
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
};
export const ORDEN_ESTADOS = ['normal-vcv', 'pcv', 'pausa-inspiratoria', 'sdra-rigido', 'sdra-protector', 'volutrauma', 'broncoespasmo-auto-peep', 'auto-peep-corregida', 'eulalia-conectada', 'eulalia-ajustada', 'psv-disparo', 'atelectrauma-zeep', 'mejor-peep'];

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
