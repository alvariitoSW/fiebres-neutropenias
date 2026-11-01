// Datos del sinusoide: citas, textos y pruebas. Cada frase de mecanismo lleva su página del PDF (Marino 2024, caps. 39-44).
export const PDF = '../../docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
// página del PDF → párrafo de la ficha `ma-*` (data-resaltar)
export const FICHA = { 3: 'ma-fha-paracetamol', 5: 'ma-fha-hemodinamica', 6: 'ma-eh-amonio', 7: 'ma-eh-nh3', 8: 'ma-eh-cvvh', 10: 'ma-var-tips' };
export const IMG = { f392: '../../js/modules/libros/img/mar-fig39-2-tc-edema-cerebral.jpg', f393: '../../js/modules/libros/img/mar-fig39-3-varices-esofagicas.jpg' };
export const IDEA = ['El amonio nace en el intestino, el hígado lo convierte en urea y, si no puede, cruza al cerebro: el astrocito fabrica glutamina y se hincha.', 6];
export const PRESETS = {
  normal: { nombre: 'Hígado sano', s: { fn: 100 } },
  casimira: { nombre: 'Casimira 44', s: { fn: 21, wh: 2 } },
};
export const FUENTES = [
  ['Marino, El Libro de la UCI, 2024, cap. 39 (amonio p. 7-8; astrocito p. 6; TIPS p. 10)', 'ficha'],
  ['Cifras de los mandos (cuánto baja cada tratamiento el amonio): solo la dirección sale de la fuente', 'ilustrativo'],
  ['Hipovolemia por diarrea de lactulosa: la PA baja al perder volumen', 'fisiología general'],
];
export const NOTAS = [
  ['La fuente no lo dice', 'Marino no da un amonio máximo ni cuánto baja cada tratamiento. El monitor sube hasta 300 µmol/L como techo ilustrativo; los factores de lactulosa, rifaximina, CVVH y TIPS solo respetan la dirección (p. 7, 8 y 10).'],
  ['La fuente discrepa de sí misma', 'La correlación entre amonio y grado de West Haven existe «en muchos casos, no en todos» (p. 7). El grado del monitor sale del amonio salvo en los pacientes, donde se usa el clínico.'],
  ['Errata de la fuente', 'En la p. 10 el libro imprime «transesophageal portosystemic shunt» y «noninvasive» para el TIPS; la técnica es transyugular intrahepática. Se reproduce lo que imprime el libro.'],
  ['Opinión del autor', 'El libro afirma que la CVVH es hoy superior a lactulosa y rifaximina en el fallo hepático agudo (p. 8); las guías de cirrosis no se contrastan aquí.'],
];
export const PROFUNDIZAR = [
  ['Paracetamol, cetonas, alcoholes y lactato: las vías que se encienden en Tóxicos y en Renal (puertas cerradas del dibujo).'],
  ['Trasplante hepático: criterios y momento. El libro solo dice «consultar al especialista» (p. 8).'],
  ['Cirrosis: varices, peritonitis bacteriana y síndrome hepatorrenal, en sus fichas.'],
];
export const CRECERA = ['Ciclo de la urea paso a paso dentro del hepatocito', 'Glutamina y glutamato: por qué el astrocito se hincha (lupa del cerebro)', 'Sinusoide con presión portal real (eje portal del bloque)'];
export const GUIA = [
  { t: 'El intestino fabrica amonio', x: 'Las bacterias del colon sueltan amonio al degradar proteínas; es el origen principal.', p: 6, foco: [2, 54, 72, 92] },
  { t: 'El hígado lo convierte en urea', x: 'Cada hepatocito pasa el amonio por el ciclo de la urea: entra el pentágono, sale el hexágono.', p: 6, foco: [114, 44, 128, 112] },
  { t: 'Si el hígado falla, el amonio escapa', x: 'Sin hepatocitos que lo limpien, el amonio sigue por la vena hepática hasta el cerebro. Apaga hepatocitos y mira.', p: 6, foco: [236, 40, 124, 90], haz: ['fn', 15, 'Apagar hepatocitos'] },
  { t: 'El astrocito fabrica glutamina y se hincha', x: 'Con amonio arterial por encima de 150 µmol/L sube el riesgo de edema cerebral: la glutamina atrae agua.', p: 7, foco: [250, 180, 108, 118] },
  { t: 'Quitar el amonio de la sangre', x: 'La hemofiltración continua (CVVH) lo retira de la sangre y se considera superior a lactulosa y rifaximina; cuanto antes.', p: 8, foco: [132, 198, 108, 40], haz: ['cvvh', 1, 'Poner CVVH'] },
];
const dife = (a, b) => ({ t: a, p: b });
// Apuesta: Casimira. correcta = índice 2 (la tercera). Sin la respuesta en el HTML: viven aquí.
export const APUESTA = {
  enun: 'Casimira tiene amonio arterial 165 µmol/L y creatinina 1,1 mg/dL. ¿Qué baja antes el amonio?',
  ops: [
    ['Lactulosa hasta 2-3 deposiciones al día: solo baja la producción en el intestino, el amonio sigue por encima de 150 y el edema cerebral se acerca.'],
    ['Rifaximina 400 mg tres veces al día: tarda días en bajar el amonio y el riesgo de edema sigue.'],
    ['CVVH ya: retira el amonio directamente de la sangre, aunque la creatinina sea normal.'],
  ],
  ok: 2, p: 8,
  por: 'Con amonio >150 µmol/L la CVVH se considera superior a lactulosa y rifaximina, sea cual sea la creatinina, y cuanto antes. (p. 8)',
  llevas: [['Amonio arterial >150 µmol/L: CVVH ya.', 8], ['La creatinina no manda.', 8]],
};
export const ERROR = {
  enun: 'Plan para una paciente con amonio 165 y West Haven 2. Marca cada frase: ¿bien o error?',
  fr: [
    { f: 'Amonio arterial 165 µmol/L: más riesgo de edema cerebral.', mal: false, p: 7, por: 'Correcto: >150 marca más riesgo.' },
    { f: 'Lactulosa hasta 5-6 deposiciones al día.', mal: true, p: 7, por: 'Error: se ajusta a 2-3 deposiciones blandas al día; más es diarrea osmótica, que hay que reducir o parar.' },
    { f: 'CVVH no indicada, porque la creatinina es normal.', mal: true, p: 8, por: 'Error: con amonio >150 se considera sea cual sea la creatinina.' },
    { f: 'Rifaximina 400 mg tres veces al día, al menos 10 días.', mal: false, p: 7, por: 'Correcto.' },
  ],
  llevas: [['Lactulosa: 2-3 deposiciones al día.', 7], ['CVVH sin mirar la creatinina.', 8]],
};
// Casimira, 44 años. Cada paso es un momento posible de la misma paciente. correcta distinta posición y longitud.
export const CASO = {
  paciente: 'Casimira, 44 años',
  pasos: [
    { s: { fn: 60 }, ctx: 'Hora 36 de una sobredosis de paracetamol. ALT 5.800 U/L, bilirrubina 2,1 mg/dL, INR 3,4. Paracetamol indetectable en sangre.', q: '¿Pones N-acetilcisteína?',
      ops: ['Sí, ahora mismo: se empieza a cualquier hora, aunque hayan pasado más de 10 horas o el paracetamol sea indetectable, y se mantiene hasta que el hígado mejore.', 'No: pasaron más de 10 horas y el antídoto ya no sirve; la paciente queda sin protección.', 'Espero el nivel de paracetamol: si es indetectable no hay sobredosis y la lesión hepática pasa sin tratamiento.'], ok: 0, p: 3,
      por: 'La NAC rinde más en las primeras 10 h, pero se empieza a cualquier hora y se sigue hasta que el hígado mejore; el paracetamol es indetectable en el 50 % de los casos.' },
    { s: { fn: 21, wh: 2 }, ctx: 'Día 2. Desorientada en el tiempo (West Haven 2). Amonio arterial 165 µmol/L, creatinina 1,1 mg/dL.', q: '¿Qué haces con el amonio?',
      ops: ['Lactulosa hasta 5-6 deposiciones diarias: la diarrea osmótica la deshidrata y no frena el edema.', 'CVVH ya, sin mirar la creatinina.', 'Espero a que suba la creatinina para indicar la CVVH, mientras el amonio sigue por encima de 150.'], ok: 1, p: 8,
      por: 'Amonio >150: CVVH cuanto antes, sea cual sea la creatinina.', patch: { cvvh: 1 } },
    { s: { fn: 15, wh: 2, cvvh: 1, oliguria: 1, pa: [82, 45], fc: 118 }, ctx: 'Día 3. Diuresis 0,3 mL/kg/h, PA 82/45 mmHg, albúmina sérica 2,6 g/dL.', q: '¿Qué fluido y qué apoyo?',
      ops: ['Ringer lactato en bolos: es un cristaloide barato, pero favorece la hiponatremia y empeora el edema cerebral.', 'Furosemida para sacar orina: con la paciente hipotensa y sin volumen eficaz, solo la deja más seca.', 'Albúmina al 5 % y noradrenalina, sin Ringer lactato: así no baja el sodio.'], ok: 2, p: 5,
      por: 'Con albúmina <3 g/dL se prefiere albúmina; el 5 % deja el 70 % en el vaso. El Ringer lactato promueve hiponatremia y agrava el edema.' },
    { s: { fn: 5, wh: 3, cvvh: 1, oliguria: 1, pa: [90, 52], fc: 110 }, ctx: 'Día 4. Estupor (West Haven 3), PA 90/52 mmHg con noradrenalina. La TC craneal muestra surcos borrados (Fig. 39.2). Sigue en CVVH.', q: '¿Qué más?',
      ops: ['Consultar ya con trasplante, porque la encefalopatía es progresiva.', 'Subir la lactulosa a 6 deposiciones: provoca hipovolemia y no resuelve el edema.', 'Seguir igual: la creatinina es normal y no hay nada más que indicar.'], ok: 0, p: 8,
      por: 'El trasplante es el tratamiento definitivo; al especialista se consulta ante cualquier encefalopatía progresiva.' },
  ],
  llevas: [['Amonio >150: CVVH ya.', 8], ['La creatinina no manda.', 8], ['Nada de Ringer lactato.', 5]],
};
