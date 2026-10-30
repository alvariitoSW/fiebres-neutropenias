// Rx de tórax portátil dibujada · lógica pura (sin DOM): mandos, estados, coherencia y textos.
// Maqueta del encargo motor-radio (30/10/2026). No es parte de la app.
// Cifras: tabla §2 de ideas.md, comprobadas en el PDF (págs. = página del PDF, #page=N).
// Lo que no tiene cifra en la fuente va rotulado «ilustrativo».

const D = '../../docs/';
const M27 = D + 'marino-2024-respiratory-management-caps27-30.pdf#page=';
const M22 = D + 'marino-2024-respiratory-management-caps22-26.pdf#page=';
const M18 = D + 'marino-2024-cardiac-disorders-caps18-21.pdf#page=';
const AV = D + 'marino-2024-acceso-vascular-practicas-caps1-4.pdf#page=';
const NU = D + 'marino-2024-nutricion-endocrino-caps48-51.pdf#page=';
const SP_PX = 'https://www.ncbi.nlm.nih.gov/sites/books/NBK441885/';
const SP_LI = 'https://www.ncbi.nlm.nih.gov/sites/books/NBK558976/';

// Fuentes con nombre legible para la lista «Fuentes».
const c = (texto, origen, href, cita) => ({ texto, origen, href, cita });

// Ficha de la app donde vive cada tema (para «Ver en la ficha»).
const FICHA_PLEURA = { resaltar: '#radio-t1-pasos', nombre: 'Tórax de UCI · aire y líquido en la pleura' };
const FICHA_PATRON = { resaltar: '#radio-t2-pasos', nombre: 'Tórax de UCI · patrones del pulmón' };
const FICHA_TUBO = { resaltar: '#radio-f2-idea', nombre: 'Lee esta placa · el tubo' };
const FICHA_VIA = { resaltar: '#radio-f3-idea', nombre: 'Lee esta placa · la vía central' };
const FICHA_SNG = { resaltar: '#radio-f4-idea', nombre: 'Lee esta placa · la sonda' };

// Figuras reales de Marino (R4), rutas desde autonomo/maquetas/.
const F = {
  tension: { src: '../../js/modules/neumologia/img/neumo-fig28-7-radiografia-neumotorax-tension.jpg', pie: 'Neumotórax a tensión izquierdo: sin trama, mediastino a la derecha y cúpula izquierda deprimida. Marino, fig. 28.7', href: M27 + 29, pag: 'pág. 29' },
  tubo: { src: '../../js/modules/neumologia/img/neumo-fig28-1-radiografia-tubo-et.jpg', pie: 'Tubo bien puesto: punta a medio camino entre la entrada del tórax y la carina. Marino, fig. 28.1', href: M27 + 18, pag: 'pág. 18' },
  selectivo: { src: '../../js/modules/neumologia/img/neumo-fig28-2-radiografia-intubacion-selectiva.jpg', pie: 'Tubo en el bronquio derecho y pulmón izquierdo colapsado. Marino, fig. 28.2', href: M27 + 19, pag: 'pág. 19' },
  carina: { src: '../../js/modules/libros/img/mar-fig2-6-punta-carina.jpg', pie: 'Punta del catéter a la altura de la carina. Marino, fig. 2.6', href: AV + 36, pag: 'pág. 36' },
  vcs: { src: '../../js/modules/libros/img/mar-fig3-1-perforacion-vcs.jpg', pie: 'Catéter izquierdo apoyado en la pared de la vena cava superior: perforación. Marino, fig. 3.1', href: AV + 46, pag: 'pág. 46' },
  sng: { src: '../../js/modules/libros/img/mar-fig49-2-sonda-correcta.jpg', pie: 'Sonda bien puesta: recta por el mediastino y punta bajo la cúpula izquierda. Marino, fig. 49.2', href: NU + 28, pag: 'pág. 28' },
  sngPulmon: { src: '../../js/modules/libros/img/mar-fig49-3-sonda-pulmon.jpg', pie: 'Sonda en el pulmón derecho: se desvía a la derecha a la altura de la carina. Marino, fig. 49.3', href: NU + 29, pag: 'pág. 29' },
  edema: { src: '../../js/modules/cardiologia/img/mc-fig18-4-edema-pulmonar.jpg', pie: 'Edema pulmonar cardiogénico: infiltrados que salen de los hilios. Marino, fig. 18.4', href: M18 + 8, pag: 'pág. 8' },
  sdra: { src: '../../js/modules/neumologia/img/neumo-fig24-2-radiografia-sdra.jpg', pie: 'SDRA: arriba el aspecto clásico; abajo, infiltrados localizados. Marino, fig. 24.2', href: M22 + 38, pag: 'pág. 38' },
};

// Mandos y estados. `peligro`: saca sello. `aviso`: el escalón de antes del peligro (aviso al 80 %).
export const ESTADOS = {
  postura: { titulo: 'Postura', patologia: false, ficha: FICHA_PLEURA, estados: [
    { id: 'erguido', rotulo: 'Sentado' },
    { id: 'supino', rotulo: 'Tumbado' },
  ] },
  ntx: { titulo: 'Neumotórax', patologia: true, lado: 'izquierdo', ficha: FICHA_PLEURA, estados: [
    { id: 'no', rotulo: 'No' },
    { id: 'pequeno', rotulo: 'Pequeño' },
    { id: 'grande', rotulo: 'Grande', aviso: true },
    { id: 'tension', rotulo: 'A tensión', peligro: true, figura: F.tension },
  ] },
  derrame: { titulo: 'Derrame paraneumónico', patologia: true, lado: 'derecho', ficha: FICHA_PLEURA, estados: [
    { id: 'no', rotulo: 'No' },
    { id: 'pequeno', rotulo: '< 10 mm' },
    { id: 'medio', rotulo: '10 mm a ½', aviso: true },
    { id: 'grande', rotulo: '> ½', peligro: true },
  ] },
  patron: { titulo: 'Patrón', patologia: true, ficha: FICHA_PATRON, estados: [
    { id: 'no', rotulo: 'Normal' },
    { id: 'edema', rotulo: 'Edema cardiaco', figura: F.edema },
    { id: 'sdra', rotulo: 'SDRA clásico', peligro: true, figura: F.sdra },
    { id: 'sdraLoc', rotulo: 'SDRA localizado', peligro: true, figura: F.sdra },
  ] },
  consol: { titulo: 'Consolidación', patologia: true, lado: 'derecho', ficha: FICHA_PATRON, estados: [
    { id: 'no', rotulo: 'No' },
    { id: 'si', rotulo: 'Base derecha', peligro: true },
  ] },
  atel: { titulo: 'Atelectasia', patologia: true, lado: 'izquierdo', ficha: FICHA_PATRON, estados: [
    { id: 'no', rotulo: 'No' },
    { id: 'lii', rotulo: 'Lóbulo inferior', aviso: true },
    { id: 'pulmon', rotulo: 'Pulmón entero', peligro: true, figura: F.selectivo },
  ] },
  tubo: { titulo: 'Tubo', patologia: false, ficha: FICHA_TUBO, estados: [
    { id: 'no', rotulo: 'Sin tubo' },
    { id: 'alto', rotulo: 'Alto', peligro: true, figura: { ...F.tubo, pie: 'Referencia: posición correcta del tubo (no es el tubo alto del dibujo). Marino, fig. 28.1' } },
    { id: 'bien', rotulo: 'Bien', figura: F.tubo },
    { id: 'selectivo', rotulo: 'Selectivo derecho', peligro: true, figura: F.selectivo },
  ] },
  via: { titulo: 'Vía central', patologia: false, ficha: FICHA_VIA, estados: [
    { id: 'no', rotulo: 'Sin vía' },
    { id: 'bien', rotulo: 'Bien', figura: F.carina },
    { id: 'ad', rotulo: 'En aurícula', figura: { ...F.carina, pie: 'Referencia: posición correcta de la punta, a la altura de la carina (no es la punta en la aurícula del dibujo). Marino, fig. 2.6' } },
    { id: 'pared', rotulo: 'Contra la pared', peligro: true, figura: F.vcs },
    { id: 'yugular', rotulo: 'Sube a la yugular', peligro: true },
  ] },
  sng: { titulo: 'Sonda', patologia: false, ficha: FICHA_SNG, estados: [
    { id: 'no', rotulo: 'Sin sonda' },
    { id: 'bien', rotulo: 'Bien', figura: F.sng },
    { id: 'bronquio', rotulo: 'En el bronquio', peligro: true, figura: F.sngPulmon },
  ] },
};

export const MANDOS = Object.keys(ESTADOS);
export const MAX_PATOLOGIAS = 3;
export const ESTADO_INICIAL = { postura: 'erguido', ntx: 'no', derrame: 'no', patron: 'no', consol: 'no', atel: 'no', tubo: 'no', via: 'no', sng: 'no', foco: 'postura', senal: null, ocultarPostura: false };

const PATOLOGICOS = MANDOS.filter(k => ESTADOS[k].patologia);
export const patologiasEncendidas = e => PATOLOGICOS.filter(k => e[k] && e[k] !== 'no');

// Reglas de coherencia (§3). Devuelve el estado que se dibuja y los derivados (nunca mandos).
export function normalizar(entrada) {
  const e = { ...ESTADO_INICIAL, ...entrada };
  for (const k of MANDOS) if (!ESTADOS[k].estados.some(s => s.id === e[k])) e[k] = ESTADO_INICIAL[k];
  const encendidas = patologiasEncendidas(e);
  const imposible = encendidas.length > MAX_PATOLOGIAS;
  // Más de 3 patologías: se dibujan las 3 primeras encendidas, el resto queda apagado.
  if (imposible) for (const k of encendidas.slice(MAX_PATOLOGIAS)) e[k] = 'no';
  const selectivo = e.tubo === 'selectivo';
  const atel = selectivo ? 'pulmon' : e.atel; // el tubo selectivo deja sin aire el pulmón izquierdo (M27 fig. 28.2)
  const tension = e.ntx === 'tension';         // la tensión lleva el neumotórax a grande
  // Desvío del mediastino en px de la imagen (+ = hacia la derecha de la imagen = izquierda del paciente).
  let desvio = 0;
  if (tension) desvio = -22;                       // al lado contrario (M27 págs. 27-28)
  else if (atel === 'pulmon') desvio = 16;         // hacia el lado colapsado (SP-LI)
  else if (atel === 'lii') desvio = 6;
  if (!tension && e.derrame === 'grande') desvio += 10; // al lado contrario del derrame: ilustrativo
  const cupulaIzq = tension ? 18 : atel === 'pulmon' ? -16 : atel === 'lii' ? -8 : 0; // + baja, − sube
  return { e: { ...e, atel }, d: { selectivo, tension, desvio, cupulaIzq, imposible, encendidas, atelDerivada: selectivo && e.atel !== 'pulmon', perforacion: e.via === 'pared' } };
}

// Textos de cada estado: frase viva, cifras con su origen, sello y aviso.
function textos(k, id, supino) {
  const T = {
    postura: {
      erguido: { frase: 'Sentado, el aire sube al vértice y el líquido baja al fondo del seno costofrénico. Por eso, de pie, el neumotórax se busca arriba y el derrame abajo.',
        cifras: [c('Aire al vértice, líquido abajo', 'fisiología general', null, 'gravedad')] },
      supino: { frase: 'Tumbado, lo más alto del tórax es la cara de delante de las bases: ahí va el aire, no al vértice. El líquido se extiende en capa por detrás.',
        cifras: [c('Supino: el aire se junta delante de las bases', 'ficha', M27 + 26, 'Marino cap. 28, pág. 26'), c('Líquido en capa por detrás', 'ilustrativo', null, 'sin cifra en la fuente')] },
    },
    ntx: {
      no: { frase: 'Sin aire en la pleura: la trama de los vasos llega hasta la pared en los dos lados.', cifras: [c('Trama hasta la periferia', 'fisiología general', null, '')] },
      pequeno: supino
        ? { frase: 'Tumbado, el aire se junta delante de la base: la base se ve más negra y el seno costofrénico más hondo. No hay línea que ver en el vértice.',
          cifras: [c('La placa portátil no ve hasta el 50 % de los neumotórax del crítico: en supino el aire se queda delante de las bases', 'ficha', AV + 34, 'Marino cap. 2, pág. 34'), c('Supino: colección basal y subpulmonar', 'ficha', M27 + 26, 'Marino cap. 28, pág. 26'), c('Seno costofrénico hondo («surco profundo»)', 'StatPearls', SP_PX, 'StatPearls, Pneumothorax, fig. 1 (Marino no lo nombra)')] }
        : { frase: 'Sentado, el aire sube al vértice: arriba se ve una línea fina, la pleura del pulmón, y por fuera de ella nada de trama.',
          cifras: [c('Línea pleural y vértice sin trama', 'StatPearls', SP_PX, 'StatPearls, Pneumothorax (Marino no lo nombra)'), c('Tamaño del dibujo', 'ilustrativo', null, '')] },
      grande: supino
        ? { frase: 'Tumbado, el aire se reparte por delante: toda la base izquierda se ve negra y el seno costofrénico baja mucho. Un neumotórax delante puede no verse en la placa y sí en la TC.',
          cifras: [c('La placa portátil no ve hasta el 50 % de los neumotórax del crítico: en supino el aire se queda delante de las bases', 'ficha', AV + 34, 'Marino cap. 2, pág. 34'), c('Neumotórax anterior: placa negativa, TC positiva', 'ficha', M27 + 27, 'Marino cap. 28, fig. 28.5, pág. 27'), c('Surco profundo', 'StatPearls', SP_PX, 'StatPearls, Pneumothorax, fig. 1')],
          aviso: 'Un paso más y es a tensión: vigila la tensión arterial y la oxigenación (aviso de fisiología general).' }
        : { frase: 'El pulmón se ha separado mucho de la pared: hay una franja ancha sin trama. Mira el mediastino y la cúpula: si se mueven, ya es a tensión.',
          cifras: [c('Línea pleural y franja sin trama', 'StatPearls', SP_PX, 'StatPearls, Pneumothorax (Marino no lo nombra)'), c('Tamaño del dibujo', 'ilustrativo', null, '')],
          aviso: 'Un paso más y es a tensión: vigila la tensión arterial y la oxigenación (aviso de fisiología general).' },
      tension: { frase: 'El aire a presión empuja: el hemitórax izquierdo no tiene trama, el mediastino se va a la derecha y la cúpula izquierda baja.',
        cifras: [c('Mediastino al lado contrario y cúpula deprimida', 'ficha', M27 + 28, 'Marino cap. 28, fig. 28.7, págs. 27-29'), c('Angiocatéter de 14 G en el 5.º espacio, por delante de la axilar media; luego tubo de 8,5-14 Fr', 'ficha', M27 + 29, 'Marino cap. 28, pág. 29')],
        sello: 'Neumotórax a tensión. Si hay hipoxemia o hipotensión sin causa, descomprime de inmediato (Marino: descompresión inmediata).', selloHref: M27 + 29 },
    },
    derrame: {
      no: { frase: 'Sin líquido: los senos costofrénicos son agudos y la cúpula derecha se ve entera.', cifras: [c('Senos costofrénicos agudos', 'fisiología general', null, '')] },
      pequeno: supino
        ? { frase: 'Derrame paraneumónico pequeño. Tumbado, el líquido se extiende por detrás en capa fina: casi no cambia la placa. La eco mide mejor el tamaño.',
          cifras: [c('Derrame paraneumónico, menos de 10 mm: sin toracocentesis', 'ficha', M27 + 46, 'Marino cap. 29, pág. 46'), c('Eco para tamaño y sitio', 'ficha', M27 + 45, 'Marino cap. 29, pág. 45'), c('Veladura en supino', 'ilustrativo', null, '')] }
        : { frase: 'Derrame paraneumónico pequeño. Sentado, el líquido baja al seno costofrénico y lo borra: el ángulo agudo se vuelve romo.',
          cifras: [c('Derrame paraneumónico, menos de 10 mm: sin toracocentesis', 'ficha', M27 + 46, 'Marino cap. 29, pág. 46'), c('Se mide con eco, TC o en decúbito lateral', 'ficha', M27 + 46, 'Marino cap. 29, pág. 46')] },
      medio: { frase: supino
          ? 'Tumbado no hay menisco: el líquido vela el hemitórax entero por igual y los vasos se siguen viendo a través.'
          : 'Sentado, el líquido sube por la pared y dibuja una curva cóncava, el menisco, más alta por fuera.',
        cifras: [c('Derrame paraneumónico, más de 10 mm y menos de ½ hemitórax: toracocentesis', 'ficha', M27 + 46, 'Marino cap. 29, pág. 46'), c(supino ? 'Veladura sin menisco' : 'Forma del menisco', 'ilustrativo', null, '')],
        aviso: 'Si el derrame paraneumónico pasa de la mitad del hemitórax, el infectado necesita tubo.' },
      grande: { frase: supino
          ? 'Más de la mitad del hemitórax: tumbado, todo el lado derecho se ve gris y la cúpula desaparece. El mediastino se aparta.'
          : 'Más de la mitad del hemitórax: el lado derecho se ve blanco hasta arriba, la cúpula desaparece y el mediastino se aparta.',
        cifras: [c('Derrame paraneumónico de más de ½ o loculado: tubo de 8,5-14 Fr si está infectado (pH < 7,20, glucosa < 60 mg/dL o Gram +)', 'ficha', M27 + 46, 'Marino cap. 29, pág. 46'), c('Desvío del mediastino', 'ilustrativo', null, 'sin cifra en la fuente')],
        sello: 'Derrame paraneumónico de más de la mitad del hemitórax: si está infectado, tubo de 8,5-14 Fr. (Las reglas de Marino son del paraneumónico; el de insuficiencia cardiaca o el hemotórax no las siguen.)', selloHref: M27 + 46 },
    },
    patron: {
      no: { frase: 'Pulmones negros con vasos finos que se afilan hacia la pared.', cifras: [c('Trama normal', 'fisiología general', null, '')] },
      edema: { frase: 'El agua sale de los hilios a los dos lados, en alas. El corazón es grande y suele haber derrame en las dos bases.',
        cifras: [c('Infiltrados desde los hilios, bilaterales; derrames frecuentes', 'ficha', M18 + 7, 'Marino cap. 18, págs. 7-8'), c('Cardiomegalia y derrames', 'StatPearls', SP_LI, 'StatPearls, Lung Imaging, «Plain Films»'), c('Tamaño del corazón', 'ilustrativo', null, 'sin índice: no hay cifra en la fuente')] },
      sdra: { frase: 'Blanco fino y parejo en todos los campos, hasta la pared, sin derrame. Este aspecto clásico es la minoría.',
        cifras: [c('Aspecto clásico solo en el 15-25 %', 'ficha', M22 + 36, 'Marino cap. 24, pág. 36'), c('Placa negativa frente a TC: valor predictivo negativo del 47 %', 'ficha', M22 + 36, 'Marino cap. 24, pág. 36')],
        sello: 'La placa no distingue edema de SDRA: orienta, no diagnostica.', selloHref: M22 + 36 },
      sdraLoc: { frase: 'Lo más frecuente en el SDRA: manchas en los campos inferiores, que se confunden con edema cardiogénico.',
        cifras: [c('Infiltrados localizados: lo más frecuente', 'ficha', M22 + 36, 'Marino cap. 24, pág. 36'), c('Placa normal posible en las primeras horas', 'ficha', M22 + 35, 'Marino cap. 24, pág. 35')],
        sello: 'La placa no distingue edema de SDRA: orienta, no diagnostica.', selloHref: M22 + 36 },
    },
    consol: {
      no: { frase: 'La base derecha está negra y la cúpula derecha se ve entera.', cifras: [c('Base normal', 'fisiología general', null, '')] },
      si: { frase: 'La base derecha está blanca, pero dentro se ven los bronquios llenos de aire en negro. El volumen no cambia: el mediastino no se mueve.',
        cifras: [c('Infiltrado nuevo: sensibilidad 89 %, especificidad 26 %', 'ficha', M27 + 40, 'Marino cap. 28, pág. 40'), c('Volumen conservado y broncograma aéreo', 'StatPearls', SP_LI, 'StatPearls, Lung Imaging')],
        sello: 'Un infiltrado nuevo no confirma neumonía: puede ser atelectasia, edema o SDRA.', selloHref: M27 + 40 },
    },
    atel: {
      no: { frase: 'Los dos pulmones con su volumen: el mediastino en el centro.', cifras: [c('Sin pérdida de volumen', 'fisiología general', null, '')] },
      lii: { frase: 'El lóbulo inferior izquierdo pierde el aire: un triángulo blanco detrás del corazón. Tira del mediastino hacia su lado y sube la cúpula.',
        cifras: [c('Pérdida de volumen, desvío hacia el lado y cúpula elevada', 'StatPearls', SP_LI, 'StatPearls, Lung Imaging, «Plain Films»'), c('Atelectasia segmentaria con caída brusca de la oxigenación: tapón', 'ficha', M27 + 23, 'Marino cap. 28, pág. 23')],
        aviso: 'Si se cierra el pulmón entero, la oxigenación cae de golpe.' },
      pulmon: { frase: 'El pulmón izquierdo entero sin aire: el hemitórax se ve blanco, el mediastino se va hacia la izquierda y la cúpula sube.',
        cifras: [c('Pérdida de volumen y desvío hacia el lado colapsado', 'StatPearls', SP_LI, 'StatPearls, Lung Imaging, «Plain Films»'), c('Con tubo en el bronquio derecho: atelectasia del pulmón izquierdo', 'ficha', M27 + 19, 'Marino cap. 28, fig. 28.2, pág. 19')],
        sello: 'Caída brusca de la oxigenación: aspira las secreciones o retira el tubo si está metido de más (maniobra: fisiología general).', selloHref: M27 + 23 },
    },
    tubo: {
      no: { frase: 'Sin tubo: la tráquea se ve como una columna negra que se parte en dos en la carina.', cifras: [c('Carina a la altura de T4-T5', 'ficha', M27 + 18, 'Marino cap. 28, pág. 18')] },
      bien: { frase: 'La punta queda de 3 a 5 cm por encima de la carina. Al doblar o estirar el cuello, la punta se mueve 2 cm.',
        cifras: [c('Punta 3-5 cm sobre la carina, o a medio camino de las cuerdas', 'ficha', M27 + 18, 'Marino cap. 28, pág. 18'), c('Si no se ve la carina: T4-T5', 'ficha', M27 + 18, 'Marino cap. 28, pág. 18'), c('El cuello mueve la punta 2 cm', 'ficha', M27 + 18, 'Marino cap. 28, pág. 18')] },
      alto: { frase: 'La punta queda muy por encima de la carina, cerca de la entrada del tórax. Al mover el cuello se desplaza 2 cm y puede salirse.',
        cifras: [c('El cuello mueve la punta 2 cm', 'ficha', M27 + 18, 'Marino cap. 28, pág. 18'), c('Punta a unos 7 cm de la carina', 'ilustrativo', null, 'la fuente da solo el sitio correcto')],
        sello: 'Tubo alto: riesgo de extubarse al mover el cuello. Recolócalo.', selloHref: M27 + 18 },
      selectivo: { frase: 'El tubo pasa la carina y entra en el bronquio derecho, que es más recto. El pulmón izquierdo se queda sin aire y se colapsa.',
        cifras: [c('Intubación del bronquio derecho y atelectasia del pulmón izquierdo', 'ficha', M27 + 19, 'Marino cap. 28, fig. 28.2, pág. 19'), c('Punta a unos 3 cm por debajo de la carina', 'ilustrativo', null, '')],
        sello: 'Tubo en el bronquio derecho: retíralo hasta 3-5 cm por encima de la carina (posición correcta: Marino pág. 18).', selloHref: M27 + 18 },
    },
    via: {
      no: { frase: 'Sin vía. La carina queda justo por encima de donde la vena cava superior entra en la aurícula.', cifras: [c('Carina: referencia de la unión cava-aurícula', 'ficha', AV + 36, 'Marino cap. 2, pág. 36')] },
      bien: { frase: 'La punta queda en la vena cava superior, a la altura de la carina o algo por encima.',
        cifras: [c('Punta en la cava, 1-2 cm sobre la aurícula derecha', 'ficha', AV + 36, 'Marino cap. 2, fig. 2.6, pág. 36'), c('Mal puestos: 15-18 %, sobre todo desde la subclavia', 'ficha', AV + 36, 'Marino cap. 2, pág. 36')] },
      ad: { frase: 'La punta baja por debajo de la carina y entra en la aurícula derecha. En un estudio grande no dio problemas: puede dejarse.',
        cifras: [c('2.348 pacientes con la punta en la aurícula: ni perforaciones ni arritmias problemáticas', 'ficha', AV + 37, 'Marino cap. 2, pág. 37')] },
      pared: { frase: 'El catéter izquierdo no gira hacia abajo: cruza recto y apoya la punta en la pared de la cava. Puede perforarla.',
        cifras: [c('Punta contra la pared lateral de la cava: perforación', 'ficha', AV + 46, 'Marino cap. 3, fig. 3.1, pág. 46'), c('Mediastino ancho y derrame tras la perforación', 'ficha', AV + 45, 'Marino cap. 3, pág. 45'), c('Tamaño del derrame del dibujo', 'ilustrativo', null, '')],
        sello: 'Mediastino que se ensancha y derrame nuevo con esta punta: piensa en perforación de la cava.', selloHref: AV + 45 },
      yugular: { frase: 'Desde la subclavia, la punta no baja: sube por la yugular del mismo lado, hacia el cuello.',
        cifras: [c('La punta puede subir a la yugular: hay que corregirla', 'ficha', AV + 37, 'Marino cap. 2, pág. 37')],
        sello: 'La punta va hacia el cuello: recoloca el catéter.', selloHref: AV + 37 },
    },
    sng: {
      no: { frase: 'Sin sonda. El esófago va recto por el mediastino, detrás de la tráquea.', cifras: [c('Trayecto del esófago', 'fisiología general', null, '')] },
      bien: { frase: 'La sonda baja recta por el centro, parte en dos el ángulo de la carina y acaba bajo la cúpula izquierda.',
        cifras: [c('Recta por el mediastino; parte en dos el ángulo de la carina', 'ficha', NU + 27, 'Marino cap. 49, págs. 27-28'), c('Punta unos 10 cm bajo la cúpula izquierda', 'ficha', NU + 27, 'Marino cap. 49, pág. 27'), c('Distancia nariz-oreja-xifoides: 50-60 cm', 'ficha', NU + 26, 'Marino cap. 49, pág. 26')] },
      bronquio: { frase: 'A la altura de la carina la sonda se tuerce a la derecha: ha seguido el bronquio derecho y está en el pulmón.',
        cifras: [c('Pasa a pulmón en el 1 % de las sondas', 'ficha', NU + 27, 'Marino cap. 49, pág. 27'), c('Se desvía a la derecha en la carina', 'ficha', NU + 28, 'Marino cap. 49, fig. 49.3, págs. 28-29'), c('CO₂ espirado que sube a 15 mmHg: está en el pulmón', 'ficha', NU + 29, 'Marino cap. 49, pág. 29')],
        sello: 'Sonda en el pulmón: no empieces la nutrición. Puede dar neumotórax.', selloHref: NU + 29 },
    },
  };
  return T[k][id];
}

// La salida común de las tres maquetas: frase viva y cifras del mando en foco; sellos de todo lo peligroso.
export function describir(entrada) {
  const { e, d } = normalizar(entrada);
  const supino = e.postura === 'supino';
  const foco = MANDOS.includes(e.foco) ? e.foco : 'postura';
  const t = textos(foco, e[foco], supino);
  const est = ESTADOS[foco].estados.find(s => s.id === e[foco]);
  let frase = t.frase;
  if (foco === 'tubo' && d.selectivo) frase += ' Por eso la placa enseña la atelectasia izquierda aunque no la hayas pedido.';
  if (foco === 'via' && d.perforacion) frase += ' En el dibujo, el mediastino ya se ha ensanchado y hay derrame derecho.';
  const sellos = [];
  if (d.imposible) sellos.push({ mando: 'placa', texto: `Placa imposible: más de ${MAX_PATOLOGIAS} cosas a la vez no enseñan a leer. Apaga una antes de encender otra.`, href: null });
  for (const k of MANDOS) {
    const x = textos(k, e[k], supino);
    if (x && x.sello) sellos.push({ mando: k, texto: x.sello, href: x.selloHref });
  }
  // Primero el sello del mando en foco; si no tiene, el más grave en orden de la tabla.
  sellos.sort((a, b) => (b.mando === 'placa') - (a.mando === 'placa') || (b.mando === foco) - (a.mando === foco));
  const ilustrativo = t.cifras.some(x => x.origen === 'ilustrativo');
  return { frase, cifras: t.cifras, sello: sellos[0] ? sellos[0].texto : null, selloHref: sellos[0] ? sellos[0].href : null, sellos,
    aviso: t.aviso || null, figura: est.figura || null, ficha: ESTADOS[foco].ficha, ilustrativo, foco, estado: e, derivados: d };
}
