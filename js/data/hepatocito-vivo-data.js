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
};
// Parámetros del modelo (ilustrativos: Marino da la dirección y los umbrales, no la cantidad por hora; ver NOTAS)
export const FIG = { A0: 36.3, kBasal: 0.02, kCvvh: 0.35, prod: [0.6, 1, 1.6], lactPorDep: 0.1, lactMaxDep: 3, rifa: 0.8, tipsFrac: 0.5, rl: 0.2, cap: 300, normal: 60, umbral: 150, umbralRapido: 120 };
export const PRESETS = {
  sano: { nombre: 'Hígado sano', s: { func: 100, prod: 1, dep: 0, rifa: 0, cvvh: 0 }, txt: 'Con el hígado entero, el carril de la urea procesa casi todo el NH₃ que llega por la porta: el amonio arterial queda por debajo de 60 µmol/L.' },
  casimira: { nombre: 'Casimira', s: { func: 20, prod: 1, dep: 0, rifa: 0, cvvh: 0 }, txt: 'Casimira, 44 años, fallo hepático agudo por paracetamol: quedan pocos hepatocitos y el amonio arterial marca 165 µmol/L (más de 150).' },
  edema: { nombre: 'Edema cerebral', s: { func: 5, prod: 1, dep: 0, rifa: 0, cvvh: 0 }, txt: 'Casi sin hepatocitos: el amonio arterial pasa de 150 y el astrocito se hincha de agua; es el cuadro que la CVVH debe evitar.' },
  hilario: { nombre: 'Hilario', s: { func: 52, prod: 1, dep: 0, rifa: 0, cvvh: 0, vit: { pa: '85/50', fc: '118' } }, txt: 'Hilario, 58 años, cirrótico alcohólico con hematemesis: PA 85/50 (PAM ≈ 62; la Tabla 39.3 pide PAM 65, p. 9), FC 118 (paciente inventado).' },
  alta: { nombre: 'Sangrado digestivo', s: { func: 25, prod: 2, dep: 0, rifa: 0, cvvh: 0 }, txt: 'Poco hígado y mucha producción intestinal de NH₃ (por ejemplo, tras una hemorragia digestiva): el amonio sube antes de lo que marca el umbral habitual.' },
};
export const FUENTES = [['Amonio: dónde se produce, ciclo de la urea, astrocito y glutamina', 6], ['Escala West Haven (Tabla 39.2)', 7], ['Amonio arterial >150 µmol/L (normal <60)', 7], ['Lactulosa y rifaximina: dosis y objetivo', 7], ['CVVH: cuándo y por qué es superior en el fallo agudo; trasplante', 8], ['NAC y paracetamol indetectable', 3], ['Albúmina al 5 % y no Ringer lactato', 5]];
export const NOTAS = [
  ['fuente no lo dice', 'Cuánto amonio fabrica el intestino: el libro dice solo «sobre todo en el intestino» (p. 6). Bajo, normal y alto son niveles ilustrativos, no cifras.'],
  ['fuente no lo dice', 'Cuánto baja el amonio por hora con lactulosa, rifaximina o CVVH: el libro dice «baja» y «cuanto antes». El modelo enseña el sentido, no la cifra. Su escala (tope del monitor en 300 µmol/L) es ilustrativa.'],
  ['fuente no lo dice', 'La relación exacta entre amonio y West Haven: el libro dice que se correlaciona «en muchos casos, no en todos» (p. 7). Aquí el grado cambia con los hepatocitos vivos, no con una tabla de amonio.'],
  ['fuente no lo dice', 'Los pasos intermedios del ciclo de la urea (y el CO₂ en la mitocondria): el libro solo lo nombra (p. 6); la cadena de cuatro estaciones del dibujo es fisiología general, no de la ficha.'],
  ['las fuentes discrepan', 'Ceftriaxona antes de la endoscopia: la Tabla 39.3 dice 1 g/día durante 5-7 días y el texto (p. 9) 2 g «en la mayoría de guías». Las dos son de Marino; se muestran las dos.'],
  ['opinión del autor', 'Que más producción intestinal y menos del 30 % de hepatocitos adelanten el riesgo de edema (umbral ilustrativo de 120 en el modelo) es una simplificación del modelo; el libro solo da >150 y que el amonio arterial predice mejor que el venoso al principio (p. 7).'],
];
export const PROFUNDIZAR = [['Asterixis y signos motores: pueden aparecer en cualquier fase (p. 6)', 6], ['Enema de retención: 200 g de lactulosa (300 mL) mezclados con 700 mL de agua, 30-60 min en Trendelenburg (p. 7)', 7], ['Trasplante: mortalidad del fallo agudo del 80 al 33 % (p. 8)', 8], ['Amonio arterial frente a venoso (p. 7)', 7], ['Lesión renal aguda en el 70 % del fallo hepático agudo; la terapia de reemplazo renal se usa con más decisión porque también quita amonio (p. 5)', 5], ['Ceftriaxona 1 g/día durante 5-7 días en el sangrado por varices (Tabla 39.3, p. 9)', 9]];
// [nombre, qué pasa, id de su ficha, página del PDF si la hay]
export const VIAS_APAGADAS = [['Paracetamol → glutatión', 'Se enciende en la ficha del paracetamol', 'ma-fha-paracetamol', 3], ['Cetonas', 'Se enciende en la ficha de la cetoacidosis', 'mr-cetoacidosis', 0], ['Lactato → glucosa', 'Se enciende en la ficha del lactato', 'mar-lactato-aerobio', 0], ['Alcoholes', 'Se enciende en la ficha de los alcoholes', 'mt-alcoholes', 0]];
// Cómo crece el modelo: un carril por ficha del libro (la misma célula; solo se añaden datos). Ficha y página de cada una.
export const CRECERA = [
  ['Encefalopatía hepática: carril de la urea, colon, astrocito, lactulosa, rifaximina y CVVH (este modelo)', 'ma-encefalopatia-hepatica', 6],
  ['Varices: el TIPS salta el hígado y el amonio sube; enlace al shock hemorrágico', 'ma-varices', 10],
  ['Peritonitis bacteriana y síndrome hepatorrenal: el riñón del cirrótico, con el filtro vivo', 'ma-pbe-shr', 10],
  ['Paracetamol: la vía del glutatión y la NAC', 'ma-fha-paracetamol', 3]];
export const ASTRO = ['El astrocito grande (con su glutamina y su agua) ocupará el hueco de la derecha del dibujo; hoy se ve en tamaño normal.', 'ma-eh-nh3', 6];
export const FILTRO_AMONIO = 'ma-eh-amonio';
export const FLUIDOS = { alb: { n: 'Albúmina 5 %', dpa: [10, 5], dfc: -6 }, sal: { n: 'Salino', dpa: [6, 3], dfc: -4 }, rl: { n: 'Ringer lactato', dpa: [5, 3], dfc: -3 } };
export const IDEA = ['El hígado convierte el NH₃ del intestino en urea; si falla, el NH₃ llega al astrocito, que lo vuelve glutamina y se hincha de agua.', 6];
