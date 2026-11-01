// Explicación guiada de Casimira: 4 pasos que señalan el dibujo (.foco). Cada paso lleva su página y su origen.
import { ZONAS } from './dibujo.js';
export const GUIA_SANO = ['Hígado sano · el camino del amonio', [
  { t: 'El amonio (NH₃) se fabrica sobre todo en el intestino: las bacterias del colon lo producen y la porta lo lleva al hígado.', z: ['colon'], p: 6, o: 'ficha' },
  { t: 'En el hepatocito, el NH₃ entra por el carril de la urea (la caja «ciclo de la urea»; sus pasos intermedios y el CO₂ en la mitocondria son fisiología general): con el hígado entero casi todo se procesa.', z: ['carril'], p: 6, o: 'ficha (ciclo de la urea) · pasos del dibujo: fisiología general' },
  { t: 'Sale como urea a la sangre y el amonio arterial queda por debajo de 60 µmol/L; el astrocito sigue de tamaño normal.', z: ['carril', 'arterial'], p: 7, o: 'ficha (normal <60) · cifra del modelo ilustrativa' }]];
export const GUIA_EDEMA = ['Edema cerebral · el astrocito se hincha', [
  { t: 'Casi sin hepatocitos el carril de la urea está apagado (aspas rojas): el NH₃ no se procesa y pasa a la sangre arterial.', z: ['carril', 'arterial'], p: 6, o: 'ficha' },
  { t: 'El astrocito usa el amonio para hacer glutamina, que arrastra agua: se hincha (edema citotóxico). Con >150 µmol/L arteriales el riesgo de edema está aumentado; la TC muestra los surcos borrados (Fig. 39.2).', z: ['astro'], p: 7, o: 'ficha' },
  { t: 'En el fallo agudo la CVVH es superior a la lactulosa y la rifaximina: saca el NH₃ de la sangre (las partículas pasan a su caja). Pulsa «Hazlo» y míralo.', z: ['cvvh', 'arterial'], p: 8, o: 'ficha', haz: 'cvvh', btn: 'Encender la CVVH' }]];
export const GUIA_HILARIO = ['Hilario · sangrado con cirrosis', [
  { t: 'Hematemesis con PA 85/50 (PAM ≈ 62): la meta de la Tabla 39.3 es PAM 65. Va albúmina al 5 %, no Ringer lactato.', z: ['arterial'], p: 9, o: 'ficha · PAM calculada' },
  { t: 'Con poco hígado y sangre en el intestino, la producción de NH₃ sube y el amonio arterial con ella: vigila la encefalopatía.', z: ['colon', 'arterial'], p: 6, o: 'ficha (intestino) · cifra ilustrativa' }]];
export const GUIA_ALTA = ['Sangrado digestivo · más NH₃ en el colon', [
  { t: 'La sangre en el intestino aumenta la producción de NH₃ (el libro lo sitúa sobre todo en el intestino).', z: ['colon'], p: 6, o: 'ficha' },
  { t: 'Con pocos hepatocitos el carril no da abasto: el amonio sube antes de lo habitual (umbral rápido de 120: opinión del autor; la ficha da >150).', z: ['carril', 'arterial'], p: 7, o: 'ficha (>150) · umbral 120: opinión del autor' }]];
export const GUIA = ['Casimira · fallo hepático agudo', [
  { t: 'El amonio se fabrica sobre todo en el intestino (el músculo y el riñón, menos) y viaja por la porta hasta el hepatocito, que lo convierte en urea por el ciclo de la urea.', z: ['colon', 'carril'], p: 6, o: 'ficha' },
  { t: 'En el fallo hepático quedan pocos hepatocitos: el carril de la urea se apaga paso a paso y el NH₃ que no se procesa pasa a la sangre arterial.', z: ['carril', 'arterial'], p: 6, o: 'ficha' },
  { t: 'El amonio cruza la barrera hematoencefálica; el astrocito lo usa para hacer glutamina, que arrastra agua y lo hincha (edema citotóxico). Con más de 150 µmol/L arteriales el riesgo de edema cerebral está aumentado (normal <60).', z: ['astro'], p: 6, o: 'ficha (barrera y glutamina: p. 6; >150 µmol/L: p. 7)' },
  { t: 'Lactulosa y rifaximina frenan la producción en el colon; en el fallo agudo la CVVH es superior y se empieza cuanto antes. Pulsa «Hazlo»: enciende la CVVH y mira bajar el amonio.', z: ['cvvh', 'colon'], p: 8, o: 'ficha', haz: 'cvvh', btn: 'Encender la CVVH' },
]];
// Guías de las vías de los tóxicos (cap. 52-53): 3-4 pasos que señalan las cuatro estaciones. Páginas del PDF de toxicología ('TX:página:id de la ficha').
const P4 = 'TX:4:mt-para-mecanismo', P5 = 'TX:5:mt-para-fases', P6 = 'TX:6:mt-para-nomograma', P7 = 'TX:7:mt-nac-por-que', P8 = 'TX:8:mt-nac-hd-txt', P26 = 'TX:26:mt-eg-mecanismo', P27 = 'TX:27:mt-alc-fomepizol', P28 = 'TX:28:mt-alc-hd', P28c = 'TX:28:mt-alc-coadyuvantes';
const C = ['carril'];
export const GUIA_VIAS = {
  terapeutico: ['Paracetamol a dosis terapéutica', [
    { t: 'Casi todo el paracetamol se conjuga con sulfato y glucurónido y sale por la orina (el libro dice «la mayor parte»; el ≈90 % es orientativo).', z: C, p: P4, o: 'ficha' },
    { t: 'Una fracción, ≈10 %, la oxida el P450 a un metabolito tóxico. Con hasta 4 g/día es poco y el glutatión lo neutraliza con su cisteína: glutatión 100 %, nada se acumula.', z: C, p: P5, o: 'ficha (4 g/día; el reparto exacto es ilustrativo)' },
    { t: 'Sube la dosis a más de 4 g y mira cómo la conjugación se satura y el glutatión empieza a bajar.', z: C, p: P5, o: 'ficha · cuánto baja por gramo: ilustrativo' }]],
  sobredosis: ['Eufrasia · sobredosis a las 4 h', [
    { t: 'Casi todo el paracetamol se conjuga y se elimina por la orina; un ≈10 % lo oxida el P450 a un metabolito tóxico, que el glutatión neutraliza con su cisteína.', z: C, p: P4, o: 'ficha' },
    { t: 'Con 12 g la conjugación (hasta 4 g/día) se satura, el P450 fabrica más metabolito y el glutatión se agota (−70 % ya es daño, p. 4). El hígado aún no ha sufrido: es la fase 1, antes de las 24 h.', z: C, p: P4, o: 'ficha (−70 %, p. 4; rango tóxico 7,5-15 g y fases, p. 5) · cifras del modelo ilustrativas' },
    { t: 'A las 4 h, 180 µg/mL está por encima de la línea de 150: se trata con NAC. El nivel solo vale con una ingestión aguda de hora conocida.', z: C, p: P6, o: 'ficha' },
    { t: 'La NAC repone la cisteína y, con ella, el glutatión. Pulsa «Hazlo» y mira cómo el metabolito deja de acumularse.', z: C, p: P7, o: 'ficha · cuánto sube el glutatión: ilustrativo', haz: 'nac', btn: 'Poner la NAC' }]],
  'riesgo-alcohol': ['Nicanor · alcohol crónico y dosis repetidas', [
    { t: 'Con alcohol crónico el P450 está inducido y, por la mala nutrición, el glutatión puede estar bajo: el libro dice «probablemente». La dosis tóxica es menor de 4 g.', z: C, p: 'TX:5:mt-para-riesgo', o: 'ficha · cuánto baja el umbral: ilustrativo' },
    { t: 'Tomó 5 g/día durante 4 días: con dosis repetidas no hay hora de ingestión y el nomograma no sirve. Se decide por la clínica y la ALT (900); el nivel no predice (p. 7).', z: C, p: P7, o: 'ficha · p. 6-7' },
    { t: 'El paracetamol es indetectable en el plasma en cerca de la mitad de los casos con daño hepático: se decide por la ALT y la clínica, y la NAC se da igual.', z: C, p: 3, o: 'ficha · p. 3 y 6' }]],
  nac: ['NAC · reponer la cisteína', [
    { t: 'El glutatión neutraliza el metabolito tóxico con su cisteína; cuando se agota, el metabolito queda libre.', z: C, p: P4, o: 'ficha' },
    { t: 'La NAC aporta la cisteína que falta: es el antídoto. IV: 150 mg/kg en 1 h, 50 mg/kg en 4 h y 100 mg/kg en 16 h.', z: C, p: 'TX:7:mt-tabla-52-1', o: 'ficha' },
    { t: 'Empezada pronto, el glutatión se mantiene (en el modelo, el hígado no sufre); empezada tarde, frena lo que falta pero no devuelve los hepatocitos muertos.', z: C, p: P7, o: 'ilustrativo (el freno y cuánto protege; la fuente no lo cuantifica)' }]],
  hemodialisis: ['Eleuterio · 950 µg/mL y encefalopatía a las 6 h', [
    { t: 'Ingesta masiva (≈70 g, ilustrativo: el mando llega a 30) y llega a las 6 h con la consciencia deprimida y 950 µg/mL (ilustrativo). Es la fase 1 (antes de las 24 h): el glutatión se agotó con la ingesta y la NAC lo está reponiendo, y el hígado aún no ha muerto; lo urgente es el nivel.', z: C, p: P5, o: 'ficha (fases) · dosis, hora y nivel: ilustrativo' },
    { t: 'Con paracetamol >900 µg/mL y encefalopatía, la ficha indica hemodiálisis además de la NAC; durante la diálisis, la NAC IV a 12,5 mg/kg/h como mínimo, porque la diálisis también la elimina.', z: C, p: P8, o: 'ficha' },
    { t: 'La NAC repone la cisteína y la diálisis retira el paracetamol; si el daño progresa a pesar de eso, no devuelven las células muertas.', z: C, p: P7, o: 'ficha · inferencia del modelo' },
    { t: 'Si aparecen signos de daño que progresa pese a la NAC, hay que valorar el trasplante hepático.', z: C, p: P8, o: 'ficha' }]],
  etilenglicol: ['Gumersindo · etilenglicol', [
    { t: 'La alcohol deshidrogenasa del hígado convierte el etilenglicol en ácido glicólico, glioxílico y oxálico; es la enzima que lo vuelve tóxico.', z: C, p: P26, o: 'ficha' },
    { t: 'El metabolismo gasta NAD y produce NADH, y además sube el lactato; la acidosis (pH 7,05, hiato aniónico alto) es sobre todo de los ácidos glicólico y oxálico.', z: C, p: P26, o: 'ficha (p. 26-27) · cifras del paciente inventadas' },
    { t: 'El ácido oxálico precipita con calcio como cristales de oxalato en el túbulo renal y en la orina.', z: C, p: 'TX:27:mt-eg-cristales', o: 'ficha' },
    { t: 'Con pH <7,1 hace falta hemodiálisis; el fomepizol bloquea la enzima. Pulsa «Hazlo» para bloquearla.', z: C, p: P28, o: 'ficha', haz: 'fomep', btn: 'Poner fomepizol' }]],
  metanol: ['Ruperto · metanol', [
    { t: 'La alcohol deshidrogenasa convierte el metanol en formaldehído y ácido fórmico, un ácido fuerte que produce acidosis con hiato aniónico alto.', z: C, p: P26, o: 'ficha' },
    { t: 'El ácido fórmico inhibe la citocromo oxidasa y bloquea la energía celular; los tejidos más vulnerables son la retina, el nervio óptico y los ganglios basales.', z: C, p: 'TX:27:mt-met-mecanismo', o: 'ficha' },
    { t: 'Los escotomas a las 9 h indican daño ocular: la alteración visual es, por sí sola, indicación de diálisis. El ácido folínico convierte el fórmico en metabolitos no tóxicos.', z: C, p: 'TX:29:mt-alc-hd', o: 'ficha' }]],
  fomepizol: ['Fomepizol · bloquear la enzima', [
    { t: 'El fomepizol bloquea la alcohol deshidrogenasa: deja de fabricarse el ácido tóxico (se ve la estación apagada).', z: C, p: P27, o: 'ficha' },
    { t: 'Mejor si empieza en las primeras 4 h tras la ingestión; se mantiene hasta que el alcohol en plasma baja de 20 mg/dL y el pH se normaliza.', z: C, p: 'TX:28:mt-tabla-53-2', o: 'ficha' },
    { t: 'No retira el ácido ya formado: con pH <7,1 sigue haciendo falta la hemodiálisis (inferencia del modelo).', z: C, p: P28, o: 'ficha (pH <7,1) · el resto: inferencia del modelo' }]],
  'hemodialisis-alcohol': ['Hemodiálisis en los alcoholes tóxicos', [
    { t: 'La hemodiálisis aumenta el aclaramiento del etilenglicol y de todos sus metabolitos.', z: C, p: P28, o: 'ficha' },
    { t: 'Indicaciones inmediatas: pH <7,1 o daño orgánico (coma, convulsiones, insuficiencia renal); en el metanol también la alteración visual.', z: C, p: P28, o: 'ficha' },
    { t: 'Con varias sesiones, el fomepizol pasa a 15 mg/kg cada 4 h. En el modelo el pH tiende a subir y el sello de «diálisis ya» queda en pausa mientras dura (cuánto sube: ilustrativo).', z: C, p: 'TX:28:mt-tabla-53-2', o: 'ficha (pauta) · subida del pH: ilustrativa' }]],
  coadyuvantes: ['Coadyuvantes · desviar el metabolismo', [
    { t: 'En el etilenglicol, la tiamina (100 mg IV al día) y la piridoxina (100 mg IV al día) desvían el ácido glioxílico hacia productos no tóxicos.', z: C, p: P28c, o: 'ficha' },
    { t: 'Son un apoyo: no sustituyen al fomepizol ni a la hemodiálisis cuando el pH está por debajo de 7,1.', z: C, p: P28, o: 'ficha · inferencia del modelo' }]],
};
const ALIAS = { eufrasia: 'sobredosis', nicanor: 'riesgo-alcohol', eleuterio: 'hemodialisis', gumersindo: 'etilenglicol', ruperto: 'metanol' };
export const focoSvg = (zs = []) => zs.map((z) => { const [x, y, w, h] = ZONAS[z]; return `<rect class="foco" x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`; }).join('');
import { verFrase } from '../../../core/frase-vista.js';
export function crearGuia({ dock, caja, hacer, setFoco, cita }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${cita(p.p)}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Cerrar'}</button></div>`;
    verFrase(caja, { dock, techo: 8, margen: 6 });
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g;
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); } else if (a === 'haz') { hacer(g[1][i].haz); setFoco(g[1][i].z); }
  });
  return { abrir: (clave) => { g = { casimira: GUIA, sano: GUIA_SANO, edema: GUIA_EDEMA, hilario: GUIA_HILARIO, alta: GUIA_ALTA, ...GUIA_VIAS }[clave] || GUIA_VIAS[ALIAS[clave]]; if (!g) return cerrar(); paso(0); }, cerrar };
}
