// Los datos del pulmón con respirador, pieza 1 (maqueta; en la app: js/data/pulmon-vivo-estados.js y pacientes-b3.js).
// Sin DOM. Cada estado guarda sus fuentes como lista (REGLAS §7.11) y cada cita lleva a su párrafo de la ficha
// (data-resaltar, ids con prefijo nep- de cobertura-3d.md §4; los que aún no existen se ponen al llevarlo a la app) y
// al PDF de segunda opción. Las cifras de R, τ y auto-PEEP son del modelo (fisiología general), no de Marino.

export const PDF_A = '../../docs/marino-2024-respiratory-management-caps22-26.pdf';
export const PDF_B = '../../docs/marino-2024-respiratory-management-caps27-30.pdf';
const NEUMO = ['neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs'];
export const FICHA = {
  'neumo-vm-modos': [NEUMO, 'Ventilación mecánica: los modos', 'VM: modos', PDF_B, 'Marino 2024'],
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
  ec271: { f: 'neumo-vm-modos', id: 'nep-vcv', sitio: 'Ec. 27.1 (pico = Pres + Pel)', p: '2-3' },
  meseta: { f: 'neumo-vm-modos', id: 'nep-meseta', sitio: 'La presión meseta (Ec. 27.2-27.3)', p: 3 },
  fig272: { f: 'neumo-vm-modos', id: 'nep-fig-27-2', sitio: 'Fig. 27.2', p: 3 },
  riesgo: { f: 'neumo-vm-modos', id: 'nep-riesgo-alveolar', sitio: 'Riesgo de lesión alveolar: meseta ≤30', p: 4 },
  pcvPros: { f: 'neumo-vm-modos', id: 'nep-pcv-pros', sitio: 'PCV: ventajas y desventajas', p: 4 },
  finEsp: { f: 'neumo-vm-modos', id: 'nep-fin-espiracion', sitio: 'Presión al final de la espiración (ZEEP, PEEP, oculta)', p: 5 },
  oclusion27: { f: 'neumo-vm-modos', id: 'nep-fin-espiracion', sitio: 'La oclusión espiratoria', p: 6 },
  pMedia: { f: 'neumo-vm-modos', id: 'nep-presion-media', sitio: 'Presión media de la vía aérea', p: 6 },
  cstat: { f: 'neumo-vm-modos', id: 'nep-compliance', sitio: 'Compliance torácica (Ec. 27.4)', p: 6 },
  t271: { f: 'neumo-vm-ajuste', id: 'nep-tabla-27-1', sitio: 'Tabla 27.1 (PBW, Vt, PEEP)', p: 14 },
  flujoIE: { f: 'neumo-vm-ajuste', id: 'nep-ajustes', sitio: 'Flujo inspiratorio e I:E', p: 14 },
  ocultaAjuste: { f: 'neumo-vm-ajuste', id: 'nep-ajustes', sitio: 'PEEP oculta: qué hacer', p: 15 },
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
  hipercapnia: { f: 'neumo-sdra-ventilacion', id: 'nep-hipercapnia', sitio: 'Hipercapnia permisiva', p: 49 },
};
export const NOTA_TIPO = { discrepan: ['Las fuentes discrepan', ''], calla: ['La fuente no lo dice', 'calla'], autor: ['Opinión del autor', 'autor'], errata: ['Errata de la fuente', 'errata'] };
export const NOTAS = [
  { k: 'r-tau', tipo: 'calla', txt: 'Marino no da la resistencia de la vía aérea, la constante de tiempo (τ = R·C) ni una cifra de PEEP oculta por paciente. El modelo las pone como fisiología general: R 5 cmH₂O por L/s en el pulmón normal, 20 en el broncoespasmo; y en el broncoespasmo hace la resistencia espiratoria mayor que la inspiratoria (ilustrativo), que es lo que deja el pulmón sin vaciarse.', citas: [C.defOculta] },
  { k: 'oclusion-insp', tipo: 'errata', txt: 'En los ajustes del cap. 27 el libro dice «medir la PEEP oculta con el método de oclusión al final de la inspiración» (p. 15); en el mismo capítulo (p. 6) y en el cap. 28 (p. 31-32) la maniobra es al final de la espiración, que es la que mide la PEEP oculta (la inspiratoria mide la meseta). La maqueta sigue la espiratoria y lo deja anotado.', citas: [C.ocultaAjuste, C.oclusion28] },
  { k: 'meseta-30', tipo: 'discrepan', txt: 'El objetivo de meseta es «≤30 cmH₂O» en el texto (cap. 24 p. 48; cap. 27 p. 4) y la Tabla 24.5 baja el Vt «hasta meseta <30». La maqueta marca en rojo por encima de 30 y muestra las dos formas.', citas: [C.protectora, C.t245] },
  { k: 'peep-lineal', tipo: 'calla', txt: 'La PEEP aplicada «justo por debajo de la oculta» reduce la hiperinflación porque sostiene abiertas las vías pequeñas que se colapsan (p. 32-33). Un pulmón de un compartimento no tiene ese colapso: en esta pieza la PEEP aplicada no reduce la oculta. Va en la pieza siguiente (racimo con vías que se cierran). Y el propio libro añade que reducir la PEEP oculta con PEEP aplicada «probablemente no merece la pena» (p. 33).', citas: [C.peepAplicada, C.noMerece] },
];

// ---------------------------------------------------------------- pacientes del bloque (cobertura-3d.md §5)
export const PACIENTES = [
  { k: 'rafael', nombre: 'Rafael', chip: '52 a · politrauma · pulmón sano', linea: '52 años, 1,80 m, politrauma intubado (día 1: pulmones sanos). PBW 75 kg.', talla: 180, sexo: 'v', estado: 'normal-vcv' },
  { k: 'isidro', nombre: 'Isidro', chip: '64 a · SDRA moderado', linea: '64 años, 96 kg, 1,75 m, neumonía bilateral → SDRA (P/F 110 con PEEP 10). PBW 70,5 kg.', talla: 175, sexo: 'v', estado: 'sdra-rigido' },
  { k: 'jacinto', nombre: 'Jacinto', chip: '58 a · EPOC grave', linea: '58 años, 70 kg, 1,70 m, EPOC grave, fumador; intubado tras fracasar la VNI. PBW 66 kg.', talla: 170, sexo: 'v', estado: 'broncoespasmo-auto-peep' },
  { k: 'eulalia', nombre: 'Eulalia', chip: '27 a · asma casi fatal', linea: '27 años, 60 kg, 1,62 m, asma casi fatal (PaCO₂ 42 tras 3 nebulizaciones), intubada. PBW 54 kg.', talla: 162, sexo: 'm', estado: 'eulalia-conectada' },
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
      { t: 'La espiración es pasiva: el respirador abre la válvula espiratoria y el pulmón se vacía solo, con un flujo que decae hasta cero antes del siguiente ciclo. La presión cae hasta la PEEP, 5 cmH₂O.', s: ['flujo:esp', 'paw:esp', '#esc-valvula-esp'], c: C.finEsp },
      { t: 'Con 500 mL en un tórax de compliance 60 mL/cmH₂O y 5 cmH₂O de resistencia a 1 L/s, el pico ronda 18 cmH₂O. Es un pulmón sano: Cstat de 50 a 80.', org: 'fisiología general (R y C) · ficha (Cstat 50-80)', s: ['[data-fila="pico"]', '#esc-racimo'], c: C.cstat },
    ],
    fuentes: [C.vcv, C.fig271, C.ec271, C.finEsp, C.cstat],
  },
  'normal-pcv': {
    tit: 'Presión control, pulmón sano', pac: 'rafael', resp: { modo: 'pcv', vt: 500, fr: 14, peep: 5, flujo: 60, pinsp: 10, ie: 2, pmax: 40 }, pulmon: NORMAL, man: {},
    frase: 'En presión control la presión es la meseta que tú marcas; el volumen lo pone el pulmón.',
    guia: [
      { t: 'Ahora el respirador fija la presión (PEEP 5 + 10 de presión de insuflación = 15) durante el tiempo inspiratorio. La curva de presión es una meseta plana.', s: ['paw:insp', '#esc-pantalla'], c: C.pcv },
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
      { t: 'Al final de la insuflación el respirador cierra la válvula espiratoria medio segundo (pausa o «inflation hold»): no entra ni sale aire.', s: ['#esc-valvula-esp', 'flujo:pausa'], c: C.fig272 },
      { t: 'La presión cae del pico y se queda en una meseta: sin flujo, la presión proximal se iguala con la del alvéolo. Meseta = Palv = Pel.', s: ['paw:pausa', '[data-fila="meseta"]'], c: C.meseta },
      { t: 'Pico − meseta = la presión gastada en la resistencia de la vía aérea (Pres). Aquí ≈ 5 cmH₂O: R 5 × 1 L/s.', org: 'fisiología general (R)', s: ['paw:pico', '[data-fila="pres"]'], c: C.meseta },
      { t: 'Con la meseta ya puedes calcular la compliance estática: Vt / (meseta − PEEP total). Ojo: la PEEP se resta, y al Vt se le quita lo que se queda en la tubuladura (3 mL por cmH₂O): (500 − 25) / (13 − 5) ≈ 57 mL/cmH₂O.', s: ['[data-fila="cstat"]'], c: C.cstat },
      { t: 'Sin esa corrección saldrían 60: en un pulmón sano es poco; con una meseta de 40 se pierden 120 mL y la compliance se sobreestima.', s: ['[data-fila="cstat"]'], c: C.tubuladura },
      { t: 'La que importa para el alvéolo es la meseta, no el pico: el riesgo de rotura es insignificante si la meseta es ≤30 cmH₂O.', s: ['[data-fila="meseta"]', '#esc-racimo'], c: C.riesgo },
    ],
    fuentes: [C.fig272, C.meseta, C.cstat, C.tubuladura, C.riesgo],
  },
  'sdra-rigido': {
    tit: 'SDRA: pulmón rígido con 6 mL/kg', pac: 'isidro', resp: { modo: 'vcv', vt: 420, fr: 30, peep: 10, flujo: 60, pinsp: 15, ie: 2, pmax: 50 }, pulmon: { c: 19, r: 8 }, man: { pausa: true },
    frase: 'Un pulmón al 50 % no admite el volumen de uno entero.',
    guia: [
      { t: 'Isidro tiene SDRA: compliance 19 mL/cmH₂O (en el SDRA es típicamente <25). El racimo de alvéolos está lleno de exudado y rígido.', s: ['#esc-racimo', '[data-fila="cstat"]'], c: C.cstat },
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
      { t: 'Vt 5 mL/kg PBW (352 mL): la meseta baja a 28-29, por debajo de 30. El racimo deja de estar en terracota.', s: ['paw:pausa', '[data-fila="meseta"]', '#esc-racimo'], c: C.t245 },
      { t: 'Menos volumen por respiración y el mismo CO₂ que eliminar: la FR sube hasta 30-35 para sostener el volumen minuto. Aquí, FR 30.', s: ['[data-fila="vm"]', 'flujo:esp'], c: C.t245 },
      { t: 'Aun así la PaCO₂ sube. El libro acepta PaCO₂ de 60-70 mmHg y pH 7,2-7,25 en la mayoría de los pacientes (hipercapnia permisiva); el objetivo del protocolo es pH 7,30-7,45.', s: ['#esc-pantalla'], c: C.hipercapnia },
      { t: 'Con FR 30 y flujo 60, la inspiración dura 0,35 s y queda tiempo para exhalar: el flujo llega a cero antes de la siguiente insuflación. Si subes la FR a 35 con un flujo bajo, deja de llegar.', s: ['flujo:finesp'], c: C.flujoIE },
    ],
    fuentes: [C.t245, C.protectora, C.hipercapnia, C.flujoIE],
  },
  'broncoespasmo-auto-peep': {
    tit: 'EPOC: el flujo no llega a cero', pac: 'jacinto', resp: { modo: 'vcv', vt: 500, fr: 24, peep: 0, flujo: 60, pinsp: 15, ie: 2, pmax: 40 }, pulmon: { c: 60, r: 20, rEsp: 40 }, man: { oclusion: true },
    frase: 'El pulmón no termina de vaciarse: cada respiración empieza más lleno.',
    guia: [
      { t: 'Jacinto exhala contra una resistencia alta: el flujo espiratorio decae despacio y, cuando llega la siguiente insuflación, todavía está saliendo aire. Ese flujo al final de la espiración es la prueba de hiperinflación dinámica.', s: ['flujo:finesp', '[data-fila="flujofin"]'], c: C.fig235 },
      { t: 'El volumen no vuelve a su punto de partida: el pulmón se queda con aire atrapado y el racimo, hiperinsuflado. Fíjate en que la curva de volumen no baja a cero.', s: ['vol:finesp', '#esc-racimo'], c: C.defOculta },
      { t: 'En la curva de presión no ves nada: la presión proximal baja a la PEEP marcada (0). La presión alveolar sigue positiva. Por eso se llama PEEP oculta.', s: ['paw:finesp'], c: C.finEsp },
      { t: 'Para medirla, el respirador ocluye el circuito espiratorio al final de la espiración: sin flujo, la presión proximal se iguala con la alveolar y salta a la PEEP oculta, aquí unos 6 cmH₂O. Solo vale si el paciente no respira por su cuenta.', org: 'ficha (maniobra) · modelo (cifra)', s: ['paw:oclusion', '[data-fila="peeptot"]', '#esc-valvula-esp'], c: C.oclusion28 },
      { t: 'Consecuencias: sube la presión intratorácica media (menos retorno venoso, menos gasto cardíaco), más trabajo para disparar, más riesgo de volutrauma y barotrauma, y una PVC falsamente alta.', s: ['#esc-torax'], c: C.efectos },
    ],
    fuentes: [C.fig235, C.defOculta, C.finEsp, C.oclusion28, C.fig289, C.efectos],
  },
  'auto-peep-corregida': {
    tit: 'Dale tiempo para exhalar', pac: 'jacinto', resp: { modo: 'vcv', vt: 400, fr: 12, peep: 0, flujo: 80, pinsp: 15, ie: 2, pmax: 40 }, pulmon: { c: 60, r: 20, rEsp: 40 }, man: { oclusion: true },
    frase: 'Dale tiempo para exhalar: menos frecuencia, más flujo y menos volumen.',
    guia: [
      { t: 'Todo lo que corrige la PEEP oculta busca lo mismo: más tiempo de vaciado. FR 24 → 12, flujo 60 → 80 (la inspiración dura menos), Vt 500 → 400 (6 mL/kg PBW).', s: ['#esc-pantalla'], c: C.manejo },
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
      { t: 'El pico se dispara (42) por la resistencia inspiratoria y la hiperinflación. La presión intratorácica media sube e impide el retorno venoso: es la hipotensión al conectar.', s: ['[data-fila="pico"]', '#esc-torax'], c: C.vppConsec },
      { t: 'La salida: evitar volúmenes >6-8 mL/kg y alargar la espiración (menos frecuencia, más flujo, inspiración ≤ un tercio del ciclo). Pásate al estado «Eulalia bien ajustada».', s: ['#esc-pantalla'], c: C.estrategias },
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
};
export const ORDEN_ESTADOS = ['normal-vcv', 'normal-pcv', 'pausa-inspiratoria', 'sdra-rigido', 'sdra-protector', 'broncoespasmo-auto-peep', 'auto-peep-corregida', 'eulalia-conectada', 'eulalia-ajustada'];

export const PROFUNDIZAR = [
  { t: 'Presión soporte y el disparo (por presión 2-3 cmH₂O, por flujo 1-10 L/min): el paciente que respira entra en la pieza 4.', c: { f: 'neumo-vm-ajuste', id: 'nep-disparo-presion', sitio: 'Disparo por presión (p. 8) y por flujo (p. 9)', p: '8-9' } },
  { t: 'PRVC, el modo adaptativo que entrega el volumen con la menor presión.', c: { f: 'neumo-vm-modos', id: 'nep-prvc', sitio: 'PRVC', p: '4-5' } },
  { t: 'La presión media de la vía aérea (5-10 normal, 10-20 obstrucción, 20-30 pulmón rígido) y su relación con la hemodinámica: con el corazón (M8), en la pieza 3.', c: C.pMedia },
  { t: 'La mejor PEEP (4 → 12 → 20 a 4 mL/kg PBW) y el gasto cardíaco: Figs. 27.5-27.6.', c: { f: 'neumo-vm-ajuste', id: 'nep-mejor-peep', sitio: 'La mejor PEEP', p: '11-12' } },
  { t: 'La PEEP aplicada justo por debajo de la oculta («probablemente no merece la pena», p. 33): necesita vías aéreas que se colapsan (pieza 2).', c: C.noMerece },
  { t: 'Presión transpulmonar y balón esofágico: separar el pulmón de la pared torácica.', c: { f: 'neumo-vm-modos', id: 'nep-transpulmonar', sitio: 'Presión transpulmonar', p: 2 } },
];

// ---------------------------------------------------------------- Mayéutica de muestra (REGLAS §8)
// Las opciones correctas van en posiciones distintas (1, 3, 2, 2, 4) y no son las más largas ni las más cortas en más
// de un tercio de los tests. «predice»: el monitor se tapa hasta contestar; «estado» pone el modelo ahí.
export const RECORRIDO = [
  { num: 1, grupo: 'guia', tipo: 'test', predice: true, estado: 'pausa-inspiratoria',
    enunciado: 'Rafael, pulmones sanos: volumen control, Vt 500 mL a 60 L/min, PEEP 5. Le haces una pausa inspiratoria. ¿Qué vas a leer en la curva de presión?',
    opciones: [
      { t: 'Pico ≈18 y meseta ≈13: la diferencia es lo que cuesta mover 1 L/s por la vía aérea.', ok: true },
      { t: 'Pico y meseta iguales, ≈13: sin flujo no hay nada que caiga.', porque: 'Creerías que la vía aérea no opone resistencia. En un broncoespasmo verías subir el pico y no sabrías leer que la meseta sigue baja (el alvéolo está a salvo).' },
      { t: 'Meseta ≈18 y pico ≈13: la pausa sube la presión porque el aire sigue entrando.', porque: 'Durante la pausa no entra aire. Si leyeras la meseta por encima del pico, bajarías el Vt a un pulmón sano sin motivo.' },
      { t: 'Meseta ≈8: la PEEP no cuenta en la meseta.', porque: 'La meseta se lee con la PEEP incluida (13); la PEEP se resta solo para calcular la compliance. Con 8 calcularías 500/(8 − 5) ≈ 167 mL/cmH₂O, imposible.' },
    ],
    explicacion: 'Pico = Pres + Pel (Ec. 27.1). En la pausa no hay flujo y la presión que queda es la alveolar: meseta = Palv = Pel (27.2). Pico − meseta = Pres (27.3). R 5 × 1 L/s ≈ 5 cmH₂O (fisiología general).',
    fuente: C.meseta, fuente2: C.fig272, tocar: { txt: 'Compruébalo en el monitor', estado: 'pausa-inspiratoria' } },
  { num: 2, grupo: 'guia', tipo: 'test', estado: 'normal-vcv',
    enunciado: 'El pico de la VCV es más alto que el de la PCV para el mismo volumen. ¿Por qué ese pico más alto no rompe el alvéolo?',
    opciones: [
      { t: 'Porque el respirador en volumen control limita el pico a 30 cmH₂O por diseño y corta la insuflación antes.', porque: 'El límite de presión es una alarma que tú pones, no una propiedad de VCV. Si confiaras en ella, dejarías pasar mesetas de 35 con la alarma en 40.' },
      { t: 'Porque el pico se mide en el alvéolo y no en el tubo, y por eso ya es la presión que importa.', porque: 'Es al revés: todo se mide en el tubo. Tomarías el pico por la presión alveolar y bajarías el Vt en un broncoespasmo que solo tiene pico alto.' },
      { t: 'Porque el riesgo depende de la presión alveolar (la meseta) y el pico incluye la presión gastada en la resistencia.', ok: true },
      { t: 'Sí lo rompe: por eso en el SDRA se prefiere PCV.', porque: 'La presión alveolar para un mismo volumen es la misma en VCV y PCV (fisiología general: depende del volumen y la compliance, no del modo). Cambiarías de modo y perderías la garantía de un Vt constante, que es la base de la ventilación protectora.' },
    ],
    explicacion: 'El riesgo de rotura alveolar es función de la presión alveolar, es decir, de la meseta: es insignificante si la meseta es ≤30 cmH₂O. La ventaja de VCV es mantener el Vt constante aunque cambie la mecánica.',
    fuente: C.riesgo, fuente2: C.pcvPros },
  { num: 3, grupo: 'examen', tipo: 'error', estado: 'broncoespasmo-auto-peep',
    enunciado: 'Plan de guardia para Jacinto (EPOC, VCV Vt 500, FR 24, flujo 60, PEEP 0). Puede haber 0, 1 o 2 errores. Marca los que veas.',
    frases: [
      { t: 'El flujo espiratorio no llega a cero antes de la siguiente insuflación: hay hiperinflación dinámica.' },
      { t: 'La PEEP oculta se ve en la curva de presión del respirador como una PEEP de unos 6 cmH₂O al final de la espiración.', mal: true, buena: 'La PEEP oculta no se ve en la presión proximal: la curva baja a la PEEP marcada (0) mientras el alvéolo sigue positivo. Se detecta en la curva de flujo y se mide con la oclusión espiratoria.', cita: C.monOculta },
      { t: 'Para medirla ocluyo el circuito espiratorio al final de la espiración; solo es fiable si no respira espontáneamente.' },
      { t: 'Para reducirla subo la FR a 30: así bajo la PaCO₂ y el paciente deja de atrapar aire.', mal: true, buena: 'Subir la FR acorta la espiración y aumenta la hiperinflación. Lo que la reduce es bajar la FR, bajar el Vt y subir el flujo inspiratorio (alargar el tiempo de vaciado), aunque baje el volumen minuto.', cita: C.manejo },
      { t: 'La PVC de 14 puede estar falsamente alta: la PEEP oculta se transmite a la cava superior.' },
    ],
    explicacion: 'Dos errores. La PEEP oculta es «oculta» porque no aparece en la presión proximal (cap. 27 p. 5; cap. 28 p. 31); se reduce dando tiempo de vaciado (p. 32), nunca con más frecuencia.',
    fuente: C.defOculta, fuente2: C.efectos },
  { num: 4, grupo: 'examen', tipo: 'test', predice: true, estado: 'sdra-rigido',
    enunciado: 'Isidro, SDRA, compliance 19, PEEP 10, Vt 6 mL/kg PBW (420 mL), FR 30. Mides la meseta. ¿Qué lees y qué haces?',
    opciones: [
      { t: 'Meseta ≈32: subo la PEEP a 14 para reclutar y que baje la meseta.', porque: 'En el modelo de un compartimento, con la misma compliance, más PEEP sube la meseta (y la presión media): irías a 36 y el gasto cardíaco bajaría. En un pulmón reclutable más PEEP puede mejorar la compliance (Fig. 27.5, p. 11), pero la PEEP se sube por oxigenación o buscando la mejor PEEP, no para bajar la meseta.' },
      { t: 'Meseta ≈32: bajo el Vt de 1 en 1 mL/kg hasta meseta <30 o 4 mL/kg, y subo la FR si el pH cae.', ok: true },
      { t: 'Meseta ≈22: la PEEP se resta y está en objetivo, no toco nada.', porque: 'La meseta se lee entera (32); la resta de la PEEP es para la compliance. Dejarías un pulmón de SDRA con 32 cmH₂O en el alvéolo: riesgo de volutrauma.' },
      { t: 'Meseta ≈32: paso a PCV con 20 de presión, que entrega el mismo Vt con menos presión alveolar.', porque: 'Para el mismo volumen, la presión alveolar es la misma en PCV. Con 20 + PEEP 10 la meseta sería 30 y el Vt bajaría a 380 sin que lo controles.' },
    ],
    explicacion: 'Meseta = PEEP 10 + 420/19 ≈ 32 (modelo). Tabla 24.5: con Vt 6 mL/kg, si la meseta >30, reducir el Vt de 1 en 1 mL/kg hasta meseta <30 o Vt 4 mL/kg; si el pH 7,15-7,30, subir la FR hasta 35.',
    fuente: C.t245, fuente2: C.protectora, tocar: { txt: 'Compruébalo en el monitor', estado: 'sdra-protector' } },
];
export const CASO = {
  titulo: 'Eulalia, asma casi fatal',
  pasos: [
    { num: 'C1', tipo: 'test', dia: 'Día 0 · 22:40 · UCI', estado: 'eulalia-conectada', tapar: true,
      paciente: [['Edad', '27 años, mujer, 60 kg, 1,62 m (PBW 54)'], ['Motivo', 'Asma casi fatal: PEFR 30 %, PaCO₂ 42 mmHg tras 3 nebulizaciones'], ['Tratamiento', 'Albuterol continuo 10 mg/h, ipratropio, metilprednisolona 60 mg, Mg 2 g; intubada con ketamina'], ['Respirador', 'VCV Vt 500, FR 26, flujo 60, PEEP 0'], ['A los 5 min', 'PA 78/40 (venía con 125/80), FC 130, pico 42 cmH₂O']],
      enunciado: 'Se hipotensa al conectarla. ¿Qué miras primero?',
      opciones: [
        { t: 'Noradrenalina y 500 mL de cristaloide: es un shock séptico por la neumonía que la descompensó.', porque: 'No hay neumonía en el cuadro. Subirías la presión unos minutos y seguiría atrapando aire; la causa está en el respirador.' },
        { t: 'La curva de flujo: si sigue saliendo aire cuando llega la siguiente insuflación, es hiperinflación dinámica que impide el retorno venoso.', ok: true },
        { t: 'Drenar un neumotórax a tensión con aguja, sin más comprobación: pico 42 e hipotensión bastan.', porque: 'Pincharías un tórax hiperinsuflado. El pico alto en el asma es sobre todo resistencia; antes, mira el flujo y la meseta (la meseta no está alta).' },
        { t: 'Subir la FR a 30: la PaCO₂ de 42 en un asma indica fatiga y hay que ventilar más.', porque: 'Más frecuencia, menos tiempo de vaciado: más atrapamiento y más hipotensión. La PaCO₂ 42 ya te avisó antes de intubar; ahora el problema es el tiempo espiratorio.' },
      ],
      explicacion: 'La ventilación con presión positiva agrava la hiperinflación con volúmenes altos o frecuencias rápidas; el aumento de la presión intratorácica media impide el retorno venoso. Se detecta en la curva de flujo (Fig. 23.5).',
      fuente: C.vppConsec, fuente2: C.fig235 },
    { num: 'C2', tipo: 'test', predice: true, dia: 'Día 0 · 22:45', estado: 'eulalia-conectada',
      paciente: [['Maniobra', 'Oclusión del circuito espiratorio al final de la espiración (sedada, sin esfuerzo)']],
      enunciado: 'Haces la oclusión al final de la espiración. ¿Qué marca la presión y qué significa?',
      opciones: [
        { t: '≈0 cmH₂O: la PEEP está en 0 y la oclusión solo mide la PEEP que tú aplicas.', porque: 'Si esperaras 0, no entenderías la hipotensión. La oclusión iguala la presión proximal con la alveolar: mide la PEEP total, aplicada más oculta.' },
        { t: '≈42 cmH₂O: la oclusión deja la presión en el pico de la última insuflación.', porque: 'El pico es inspiratorio. Confundirías la resistencia inspiratoria con la hiperinflación y no sabrías cuánto aire atrapa.' },
        { t: '≈22 cmH₂O: mide la meseta, la presión alveolar al final de la inspiración.', porque: 'Esa es la pausa inspiratoria. Con la oclusión espiratoria mides el alvéolo al final de la espiración, que es lo que estorba al retorno venoso.' },
        { t: '≈14 cmH₂O: es la PEEP oculta; cada respiración empieza con unos 800 mL que no salieron.', ok: true },
      ],
      explicacion: 'Sin flujo, la presión proximal se iguala con la alveolar al final de la espiración: la PEEP oculta salta a la vista (Fig. 28.9). La cifra (≈14) y el volumen atrapado (≈800 mL) son del modelo con la resistencia espiratoria del asma (fisiología general).',
      fuente: C.oclusion28, fuente2: C.fig289, tocar: { txt: 'Compruébalo: la oclusión en el monitor', estado: 'eulalia-conectada' } },
    { num: 'C3', tipo: 'error', dia: 'Día 0 · 22:50', estado: 'eulalia-conectada',
      paciente: [['Plan', 'Del residente de guardia (abajo)']],
      enunciado: 'El plan del residente. Puede haber 0, 1 o 2 errores. Marca los que veas.',
      frases: [
        { t: 'Bajo la FR a 10 y el Vt a 6 mL/kg PBW (≈330 mL): volúmenes de 6-8 mL/kg como máximo.' },
        { t: 'Subo el flujo inspiratorio a 80 L/min para que la inspiración ocupe un tercio del ciclo o menos.' },
        { t: 'Pongo PEEP 16, por encima de la oculta (14), para vencerla y que exhale mejor.', mal: true, buena: 'La PEEP aplicada debe quedar justo por debajo de la oculta: si la supera, estorba el flujo espiratorio y añade hiperinflación. Primero, alargar la espiración; la PEEP aplicada es el paso siguiente si no basta (cap. 27 p. 15), y el cap. 28 duda de que merezca la pena (p. 33).', cita: C.noMerece },
        { t: 'Mantengo la sedación profunda: así no dispara y la oclusión espiratoria mide bien.' },
      ],
      explicacion: 'Un error. Las medidas del asma ventilada: evitar Vt >6-8 mL/kg y maximizar el tiempo de exhalación (frenar la frecuencia con sedación, subir el flujo). La PEEP aplicada, si se usa, justo por debajo de la oculta, nunca por encima; y el libro avisa de que «probablemente no merece la pena» (p. 33).',
      fuente: C.estrategias, fuente2: C.peepAplicada },
    { num: 'C4', tipo: 'destapa', dia: 'Día 0 · 23:00', estado: 'eulalia-ajustada',
      paciente: [['Respirador', 'VCV Vt 330, FR 10, flujo 80, PEEP 0'], ['Giro', 'Hipotensión al conectar: era la hiperinflación']],
      enunciado: 'Con los ajustes nuevos, ¿qué tres cosas esperas ver en dos minutos, y por qué?',
      puntos: [
        { t: 'El flujo espiratorio llega a cero antes de la siguiente insuflación: la espiración ocupa casi todo el ciclo (0,25 s frente a 5,75 s: I:E 1:23).', c: C.fig235 },
        { t: 'La oclusión espiratoria baja de 14 a ≈2 cmH₂O: el volumen atrapado se ha ido (modelo).', c: C.oclusion28 },
        { t: 'La presión arterial se recupera: baja la presión intratorácica media y vuelve el retorno venoso. El precio es un volumen minuto de 3,3 L/min y una PaCO₂ que subirá.', c: C.vppConsec },
      ],
      explicacion: 'Mira el estado «Eulalia bien ajustada»: el mismo pulmón, otro respirador.' },
  ],
  llevas: [
    'La hipotensión al conectar a un asmático es hiperinflación hasta que se demuestre lo contrario: mira el flujo al final de la espiración.',
    'La PEEP oculta no se ve en la presión; se mide con la oclusión al final de la espiración (si no respira por su cuenta).',
    'Se corrige con tiempo de vaciado: menos frecuencia, menos volumen, más flujo. La PEEP aplicada, si se usa, justo por debajo de la oculta (y el libro duda de que merezca la pena).',
  ],
  vuelta: C.fig235,
  modelo: { txt: 'Ver a Eulalia bien ajustada en el modelo', estado: 'eulalia-ajustada' },
};
