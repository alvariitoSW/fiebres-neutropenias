// Hepatocito vivo · opción B «La fábrica por dentro». Datos del modelo: cada cifra con su origen y su página (M = Marino 2024, cap. 39, PDF B).
export const PDF = 'docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
export const IMG = 'js/modules/libros/img/mar-fig39-2-tc-edema-cerebral.jpg';
// Párrafo de la ficha al que lleva «Ver en la ficha» según la página del PDF
const FICHA_DE = { 3: 'ma-fha-paracetamol', 5: 'ma-fha-hemodinamica', 6: 'ma-eh-nh3', 7: 'ma-eh-amonio', 8: 'ma-eh-cvvh', 9: 'ma-varices', 10: 'ma-var-tips' };
export const fichaDe = (p) => FICHA_DE[p] || 'ma-encefalopatia-hepatica';
export const FICHA_MANDO = { lac: 'ma-eh-lactulosa', rifa: 'ma-eh-rifaximina', cvvh: 'ma-eh-cvvh', amonio: 'ma-eh-amonio', nh3: 'ma-eh-nh3' };
// Dónde vive cada párrafo: [vista, panel, ficha]. El enlace cruzado de la app abre la ficha y resalta el párrafo (data-resaltar).
const ABD = ['marinoAbdomen', 'panel-marino-abd-tabs'];
export const UBICACION = {
  'ma-fha-paracetamol': [...ABD, 'ma-fallo-hepatico-agudo'], 'ma-fha-hemodinamica': [...ABD, 'ma-fallo-hepatico-agudo'],
  'ma-encefalopatia-hepatica': [...ABD, 'ma-encefalopatia-hepatica'], 'ma-eh-nh3': [...ABD, 'ma-encefalopatia-hepatica'], 'ma-eh-amonio': [...ABD, 'ma-encefalopatia-hepatica'],
  'ma-eh-lactulosa': [...ABD, 'ma-encefalopatia-hepatica'], 'ma-eh-rifaximina': [...ABD, 'ma-encefalopatia-hepatica'], 'ma-eh-cvvh': [...ABD, 'ma-encefalopatia-hepatica'],
  'ma-varices': [...ABD, 'ma-varices'], 'ma-var-tips': [...ABD, 'ma-varices'], 'ma-pbe-shr': [...ABD, 'ma-pbe-shr'],
  'mr-cetoacidosis': ['marinoRenal', 'panel-marino-renal-tabs', 'mr-cetoacidosis'],
  'mar-lactato-aerobio': ['marinoFundamentos', 'panel-marino-fund-tabs', 'mar-extraccion-lactato'],
  'mt-alcoholes': ['marinoToxicos', 'panel-marino-tox-tabs', 'mt-alcoholes'],
  ...Object.fromEntries([['mt-paracetamol', 'mt-paracetamol'], ['mt-para-mecanismo', 'mt-paracetamol'], ['mt-para-dosis', 'mt-paracetamol'], ['mt-para-riesgo', 'mt-paracetamol'], ['mt-para-fases', 'mt-paracetamol'], ['mt-para-nomograma', 'mt-paracetamol'],
    ['mt-nac', 'mt-nac'], ['mt-nac-por-que', 'mt-nac'], ['mt-nac-indicacion', 'mt-nac'], ['mt-tabla-52-1', 'mt-nac'], ['mt-nac-hd-txt', 'mt-nac'],
    ['mt-eg-mecanismo', 'mt-alcoholes'], ['mt-eg-cristales', 'mt-alcoholes'], ['mt-met-mecanismo', 'mt-alcoholes'], ['mt-alc-fomepizol', 'mt-alcoholes'], ['mt-tabla-53-2', 'mt-alcoholes'], ['mt-alc-hd', 'mt-alcoholes'], ['mt-alc-coadyuvantes', 'mt-alcoholes']]
    .map(([id, tab]) => [id, ['marinoToxicos', 'panel-marino-tox-tabs', tab]])),
};
// Tóxicos: Marino cap. 52-53 (PDF TX). Página = página del PDF.
export const PDF_TX = 'docs/marino-2024-toxicologia-caps52-53-apendices.pdf';
export const IMG_VIA = { paracetamol: 'js/modules/libros/img/mar-fig52-2-metabolismo-paracetamol.jpg', alcoholes: 'js/modules/libros/img/mar-fig53-3-alcoholes.jpg', oxalato: 'js/modules/libros/img/mar-fig53-4-oxalato.jpg' };
export const FIG_VIA = { paracetamol: ['Fig. 52.2 · metabolismo del paracetamol', 4, 'mt-para-mecanismo'], alcoholes: ['Fig. 53.3 · metabolismo de los alcoholes tóxicos', 26, 'mt-eg-mecanismo'] };
// Parámetros de los tóxicos (ilustrativos salvo los umbrales de la ficha: 4 g, 7,5-15 g, glutatión −70 %, fases 24/72/96 h, 150 µg/mL a las 4 h, >900, pH <7,1)
export const TX = { saturaG: 4, pendiente: 20, tope: 30, aviso: 15, tox: 7.5, glutDano: 30, hdPar: 900, parMax: 1000, nomo: 150, phMin: 6.8, phMax: 7.6, phDialisis: 7.1, relojMax: 96, nacFreno: 0.3, alcoholU: 1 };
// Parámetros del modelo (ilustrativos: Marino da la dirección y los umbrales, no la cantidad por hora; ver NOTAS)
export const FIG = { A0: 36.3, kBasal: 0.02, kCvvh: 0.35, prod: [0.6, 1, 1.6], lactPorDep: 0.1, lactMaxDep: 3, rifa: 0.8, tipsFrac: 0.5, rl: 0.2, cap: 300, normal: 60, umbral: 150, umbralRapido: 120 };
export const PRESETS = {
  sano: { nombre: 'Hígado sano', s: { func: 100, prod: 1, dep: 0, rifa: 0, cvvh: 0 }, txt: 'Con el hígado entero, el carril de la urea procesa casi todo el NH₃ que llega por la porta: el amonio arterial queda por debajo de 60 µmol/L.' },
  casimira: { nombre: 'Casimira', via: 'paracetamol', s: { func: 20, prod: 1, dep: 0, rifa: 0, cvvh: 0, dosis: 6, glut: 10, h: 36, par: 0, lab: { alt: '5.800', inr: '3,4' } }, txt: 'Casimira, 44 años, fallo hepático agudo por paracetamol: quedan pocos hepatocitos (la dosis, 6 g, es la acumulada de varios días: ilustrativo) y el amonio arterial marca 165 µmol/L (más de 150).' },
  edema: { nombre: 'Edema cerebral', s: { func: 5, prod: 1, dep: 0, rifa: 0, cvvh: 0, edema: true }, txt: 'Casi sin hepatocitos: el amonio arterial pasa de 150 y el astrocito se hincha de agua; es el cuadro que la CVVH debe evitar.' },
  hilario: { nombre: 'Hilario', s: { func: 52, prod: 1, dep: 0, rifa: 0, cvvh: 0, vit: { pa: '85/50', fc: '118' } }, txt: 'Hilario, 58 años, cirrótico alcohólico con hematemesis: PA 85/50 (PAM ≈ 62; la Tabla 39.3 pide PAM 65, p. 9), FC 118 (paciente inventado).' },
  eufrasia: { nombre: 'Eufrasia', via: 'paracetamol', s: { func: 100, via: 'paracetamol', dosis: 12, h: 4, par: 180, glut: 0, vit: { pa: '118/70', fc: '92' } }, txt: 'Eufrasia, 23 años, 55 kg: 12 g de paracetamol a las 20:00, llega a las 00:00 (h 4). Paracetamol 180 µg/mL, por encima de la línea de 150 a las 4 h (paciente inventado).' },
  nicanor: { nombre: 'Nicanor', via: 'paracetamol', s: { func: 60, via: 'paracetamol', dosis: 5, h: 72, par: 30, bebedor: 1, rep: 1, glut: 20, lab: { alt: '900' }, vit: { pa: '124/76', fc: '88' } }, txt: 'Nicanor, 54 años, alcohólico: 5 g/día durante 4 días por dolor, ALT 900. Con dosis repetidas el nivel no predice; con alcohol el hígado se daña por debajo de 4 g (paciente inventado).' },
  eleuterio: { nombre: 'Eleuterio', via: 'paracetamol', s: { func: 100, via: 'paracetamol', dosis: 30, h: 6, hNac: 6, par: 950, nac: 1, hd: 1, glut0: 0, glut: 50, vit: { pa: '98/58', fc: '112' } }, txt: 'Eleuterio, 38 años, 70 kg: ingesta masiva de unos 70 g de paracetamol (ilustrativo; el mando llega a 30 g) y llega a las 6 h con la consciencia deprimida. Paracetamol 950 µg/mL (nivel fijado, ilustrativo) y encefalopatía: hemodiálisis más NAC. El hígado aún no ha fallado (fase 1, antes de las 24 h): lo que se ve es el nivel altísimo, no el daño (paciente inventado).' },
  gumersindo: { nombre: 'Gumersindo', via: 'alcoholes', s: { func: 100, via: 'alcoholes', alc: 'eg', ph: 7.05, ga: 28, go: 40, lact: 6, vit: { pa: '110/68', fc: '104' } }, txt: 'Gumersindo, 41 años, 75 kg: anticongelante, «borracho» sin olor. pH 7,05, hiato aniónico 28, hiato osmolar 40, lactato 6 y cristales en la orina (paciente inventado).' },
  ruperto: { nombre: 'Ruperto', via: 'alcoholes', s: { func: 100, via: 'alcoholes', alc: 'met', ph: 7.18, vision: 1, vit: { pa: '130/80', fc: '92' } }, txt: 'Ruperto, 73 años: bebió limpiaparabrisas y a las 9 h ve escotomas. pH 7,18 (paciente inventado).' },
  alta: { nombre: 'Sangrado digestivo', s: { func: 25, prod: 2, dep: 0, rifa: 0, cvvh: 0 }, txt: 'Poco hígado y mucha producción intestinal de NH₃ (por ejemplo, tras una hemorragia digestiva): el amonio sube antes de lo que marca el umbral habitual.' },
};
export const FUENTES = [['Amonio: dónde se produce, ciclo de la urea, astrocito y glutamina', 6], ['Escala West Haven (Tabla 39.2)', 7], ['Amonio arterial >150 µmol/L (normal <60)', 7], ['Lactulosa y rifaximina: dosis y objetivo', 7], ['CVVH: cuándo y por qué es superior en el fallo agudo; trasplante', 8], ['NAC y paracetamol indetectable', 3], ['Albúmina al 5 % y no Ringer lactato', 5], ['Metabolismo del paracetamol y glutatión −70 %', 4, 'TX'], ['Nomograma 150 → 5 / 300 → 10', 6, 'TX'], ['NAC IV 300 mg/kg en 21 h y criterios de parada', 7, 'TX'], ['Hemodiálisis >900 + encefalopatía', 8, 'TX'], ['Etilenglicol y metanol, Fig. 53.3', 26, 'TX'], ['Fomepizol, Tabla 53.2', 28, 'TX']];
export const NOTAS = [
  ['fuente no lo dice', 'Cuánto amonio fabrica el intestino: el libro dice solo «sobre todo en el intestino» (p. 6). Bajo, normal y alto son niveles ilustrativos, no cifras.'],
  ['fuente no lo dice', 'Cuánto baja el amonio por hora con lactulosa, rifaximina o CVVH: el libro dice «baja» y «cuanto antes». El modelo enseña el sentido, no la cifra. Su escala (tope del monitor en 300 µmol/L) es ilustrativa.'],
  ['fuente no lo dice', 'La relación exacta entre amonio y West Haven: el libro dice que se correlaciona «en muchos casos, no en todos» (p. 7). Aquí el grado cambia con los hepatocitos vivos, no con una tabla de amonio.'],
  ['fuente no lo dice', 'Los pasos intermedios del ciclo de la urea (y el CO₂ en la mitocondria): el libro solo lo nombra (p. 6); la cadena de cuatro estaciones del dibujo es fisiología general, no de la ficha.'],
  ['las fuentes discrepan', 'Ceftriaxona antes de la endoscopia: la Tabla 39.3 dice 1 g/día durante 5-7 días y el texto (p. 9) 2 g «en la mayoría de guías». Las dos son de Marino; se muestran las dos.'],
  ['fuente no lo dice', 'Cuánto tarda el glutatión en reponerse con NAC ni cuántos hepatocitos mueren por hora: el modelo enseña el sentido (p. 4-7). La pendiente de 20 puntos de glutatión por gramo sobre 4 g, el 30 % de daño con NAC y el paso del glutatión al daño son ilustrativos.'],
  ['fuente no lo dice', 'Cuánto sube el pH con fomepizol o con diálisis, y la línea del nomograma entre las 4 y las 24 h (el libro da los dos puntos: 150 a las 4 h y 5 a las 24 h; p. 6). El modelo no los inventa.'],
  ['errata de la fuente', 'Glutatión: la Fig. 52.2 y el texto imprimen «glutamina, cistina y glicina» (errata); el modelo rotula glutamato, cisteína y glicina como conocimiento general (el glutatión es un tripéptido de glutamato, cisteína y glicina). El cap. 39 (p. 3) y el cap. 52 (p. 4-8) hablan del mismo paracetamol: el primero del fallo ya establecido, el segundo de cómo se llega.'],
  ['opinión del autor', 'Los cortes de West Haven según los hepatocitos vivos (60 / 40 / 15 / 5 %) son una escala del modelo, ilustrativa: la ficha (Tabla 39.2, p. 7) describe los grados por la clínica, no por un porcentaje de hígado.'],
  ['opinión del autor', 'Que más producción intestinal y menos del 30 % de hepatocitos adelanten el riesgo de edema (umbral ilustrativo de 120 en el modelo) es una simplificación del modelo; el libro solo da >150 y que el amonio arterial predice mejor que el venoso al principio (p. 7).'],
];
export const PROFUNDIZAR = [['Asterixis y signos motores: pueden aparecer en cualquier fase (p. 6)', 6], ['Enema de retención: 200 g de lactulosa (300 mL) mezclados con 700 mL de agua, 30-60 min en Trendelenburg (p. 7)', 7], ['Trasplante: mortalidad del fallo agudo del 80 al 33 % (p. 8)', 8], ['Amonio arterial frente a venoso (p. 7)', 7], ['Lesión renal aguda en el 70 % del fallo hepático agudo; la terapia de reemplazo renal se usa con más decisión porque también quita amonio (p. 5)', 5], ['Ceftriaxona 1 g/día durante 5-7 días en el sangrado por varices (Tabla 39.3, p. 9)', 9]];
// Vías del hepatocito. La urea es la vía 0 (la que dibuja el modelo de siempre). Cada paso: [rótulo, página, id de la ficha]; `nodos`: las cuatro estaciones del carril (dos líneas cortas).
// `on`: se puede encender hoy. `pdf`: 'B' (cap. 39) o 'TX' (cap. 52-53). Las apagadas conservan [nombre, qué pasa, ficha, página] en `off`.
export const VIAS = [
  { id: 'urea', nombre: 'Urea', on: true, pdf: 'B', pasos: [['NH₃ entra al hepatocito', 6, 'ma-eh-nh3'], ['1.º paso del ciclo en la mitocondria', 6, 'ma-eh-nh3'], ['resto del ciclo', 6, 'ma-eh-nh3'], ['urea a la sangre', 6, 'ma-eh-nh3']], fuentes: [['Marino cap. 39', 6, 'ma-eh-nh3']] },
  { id: 'paracetamol', nombre: 'Paracetamol', on: true, pdf: 'TX', fichas: ['mt-para-mecanismo', 'ma-fha-paracetamol'],
    nodos: [['Conjugación', '≈90 % orina'], ['P450', '≈10 % tóxico'], ['Glutatión', 'neutraliza'], ['NAC', 'cisteína']],
    pasos: [['conjugación con sulfato y glucurónido → orina (≈90 %; el libro: «la mayor parte»)', 4, 'mt-para-mecanismo'], ['P450 → metabolito tóxico (≈10 %, por el P450)', 4, 'mt-para-mecanismo'], ['glutatión: su cisteína neutraliza el metabolito (glutamato + cisteína + glicina: conocimiento general; el libro imprime glutamina/cistina)', 4, 'mt-para-mecanismo'], ['NAC repone la cisteína', 7, 'mt-nac-por-que']],
    titulo: 'El paracetamol en el hepatocito', eyebrow: 'Modelo vivo · Marino cap. 52', idea: ['La mayor parte del paracetamol se conjuga y sale por la orina; el P450 oxida una fracción a un metabolito tóxico que el glutatión neutraliza. Si el glutatión se agota, el metabolito mata hepatocitos; la NAC repone la cisteína.', 'TX:4:mt-para-mecanismo'], aria: 'Un hepatocito con las cuatro estaciones del paracetamol: conjugación, P450, glutatión y NAC',
    estados: { terapeutico: ['sano', { via: 'paracetamol', dosis: 4, glut: 100 }, 'Dosis terapéutica (hasta 4 g/día): la conjugación aguanta, el P450 fabrica poco metabolito y el glutatión lo neutraliza; no se acumula nada tóxico.', 'ficha · p. 4-5'], sobredosis: ['eufrasia', {}], 'riesgo-alcohol': ['nicanor', {}], nac: ['eufrasia', { nac: 1 }, 'Eufrasia con NAC desde la hora 4: repone la cisteína, el glutatión se recupera y el metabolito se neutraliza antes de dañar al hepatocito. Cuánto sube el glutatión: ilustrativo.', 'ficha · p. 7'], hemodialisis: ['eleuterio', {}] },
    fuentes: [['Marino cap. 52 · mecanismo, dosis, nomograma, NAC', 4, 'mt-para-mecanismo'], ['Marino cap. 39 · NAC en el fallo establecido y paracetamol indetectable', 3, 'ma-fha-paracetamol']] },
  { id: 'alcoholes', nombre: 'Alcoholes', on: true, pdf: 'TX', fichas: ['mt-eg-mecanismo', 'mt-met-mecanismo'],
    nodos: [['ADH', 'enzima'], ['Ácidos', 'tóxicos'], ['NAD → NADH', 'sube lactato'], ['Daño', 'oxalato']], nodosMet: [['ADH', 'enzima'], ['Fórmico', 'ácido'], ['NAD → NADH', 'sube lactato'], ['Daño', 'retina']],
    pasos: [['alcohol deshidrogenasa', 26, 'mt-eg-mecanismo'], ['etilenglicol → glicólico → glioxílico → oxálico / metanol → formaldehído → fórmico', 26, 'mt-eg-mecanismo'], ['NAD → NADH: el lactato sube', 26, 'mt-eg-mecanismo'], ['oxálico + Ca → oxalato en el túbulo (Fig. 53.4) / fórmico: citocromo oxidasa, retina', 27, 'mt-eg-cristales'], ['fomepizol bloquea la alcohol deshidrogenasa', 27, 'mt-alc-fomepizol'], ['tiamina + piridoxina (etilenglicol) o folínico (metanol) desvían', 28, 'mt-alc-coadyuvantes']],
    titulo: 'Los alcoholes tóxicos en el hepatocito', eyebrow: 'Modelo vivo · Marino cap. 53', idea: ['La alcohol deshidrogenasa del hígado convierte el etilenglicol y el metanol en ácidos tóxicos y sube el NADH (y el lactato). El fomepizol bloquea la enzima; la hemodiálisis quita el tóxico y los ácidos.', 'TX:26:mt-eg-mecanismo'], aria: 'Un hepatocito con las cuatro estaciones de los alcoholes tóxicos: enzima, ácidos, NADH y daño',
    estados: { etilenglicol: ['gumersindo', {}], metanol: ['ruperto', {}], fomepizol: ['gumersindo', { fomep: 1 }, 'Fomepizol: bloquea la alcohol deshidrogenasa y deja de fabricarse ácido; el que ya se formó sigue ahí, así que con pH <7,1 hace falta además diálisis (esto último es inferencia del modelo).', 'ficha · p. 27-28'], 'hemodialisis-alcohol': ['gumersindo', { hd: 1 }, 'Hemodiálisis: quita el alcohol y sus ácidos; el pH tiende a subir y el hiato a bajar (cuánto, el libro no lo dice: ilustrativo).', 'ficha · p. 28-29'], coadyuvantes: ['gumersindo', { coad: 1 }, 'Coadyuvantes (tiamina y piridoxina en el etilenglicol): desvían el ácido glioxílico hacia productos no tóxicos.', 'ficha · p. 28'] },
    fuentes: [['Marino cap. 53 · etilenglicol y metanol', 26, 'mt-eg-mecanismo'], ['Marino cap. 53 · fomepizol, diálisis y coadyuvantes', 28, 'mt-alc-fomepizol']] },
  { id: 'cetonas', on: false, nombre: 'Cetonas', off: ['Cetonas', 'Se enciende en la ficha de la cetoacidosis', 'mr-cetoacidosis', 0] },
  { id: 'lactato-glucosa', on: false, nombre: 'Lactato → glucosa', off: ['Lactato → glucosa', 'Se enciende en la ficha del lactato', 'mar-lactato-aerobio', 0] },
];
export const VIAS_APAGADAS = VIAS.filter((v) => !v.on).map((v) => v.off);
export const viaDe = (id) => VIAS.find((v) => v.id === id) || VIAS[0];
// Cómo crece el modelo: un carril por ficha del libro (la misma célula; solo se añaden datos). Ficha y página de cada una.
export const CRECERA = [
  ['Encefalopatía hepática: carril de la urea, colon, astrocito, lactulosa, rifaximina y CVVH (este modelo)', 'ma-encefalopatia-hepatica', 6],
  ['Varices: el TIPS salta el hígado y el amonio sube; enlace al shock hemorrágico', 'ma-varices', 10],
  ['Peritonitis bacteriana y síndrome hepatorrenal: el riñón del cirrótico, con el filtro vivo', 'ma-pbe-shr', 10],
  ['Paracetamol: la vía del glutatión y la NAC (hecha)', 'mt-paracetamol', 4], ['Alcoholes: etilenglicol y metanol (hecha)', 'mt-alcoholes', 26]];
export const ASTRO = ['El astrocito grande (con su glutamina y su agua) ocupará el hueco de la derecha del dibujo; hoy se ve en tamaño normal.', 'ma-eh-nh3', 6];
export const TRR_FICHA = ['nefrologia', 'trr', 'panel-trr-tabs', 'trr-indicaciones'];
export const FILTRO_AMONIO = 'ma-eh-amonio';
export const FLUIDOS = { alb: { n: 'Albúmina 5 %', dpa: [10, 5], dfc: -6 }, sal: { n: 'Salino', dpa: [6, 3], dfc: -4 }, rl: { n: 'Ringer lactato', dpa: [5, 3], dfc: -3 } };
export const IDEA = ['El hígado convierte el NH₃ del intestino en urea; si falla, el NH₃ llega al astrocito, que lo vuelve glutamina y se hincha de agua.', 6];
