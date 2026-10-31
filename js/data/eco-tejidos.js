// Brillo de cada tejido en la imagen de eco: una sola tabla para la imagen (ecografia.mjs), la leyenda del
// simulador y la vista Visual. Los dB son relativos al miocardio (0 dB). Sin cifras de fuente: la escala es
// «ilustrativo» (el orden sí es fisiología general: sangre < miocardio < valva < pericardio).
// ancho: grosor (mm) de la línea cuando el tejido se dibuja como línea.
export const TEJIDOS = {
  sangre:        { nombre: 'Sangre (luz)',                 db: -42, origen: 'fisiología general', nota: 'Casi negra: no devuelve eco propio.' },
  extracardiaco: { nombre: 'Fuera del corazón',            db: -20, origen: 'ilustrativo' },
  suprahepatica: { nombre: 'Vena suprahepática',           db: -2, ancho: 0.8, origen: 'ilustrativo' },
  venaPared:     { nombre: 'Venas y seno coronario',       db: -3, ancho: 1.3, origen: 'ilustrativo' },
  auricula:      { nombre: 'Pared de aurícula',            db: -5, ancho: 2.6, origen: 'ilustrativo' },
  fosaOval:      { nombre: 'Fosa oval (tabique interauricular fino)', db: -16, ancho: 0.8, origen: 'ilustrativo', nota: 'Una sola lámina: más fina y débil que el resto del tabique. El grosor no lo da la fuente.' },
  eustaquio:     { nombre: 'Válvula de Eustaquio',         db: -2, ancho: 0.9, origen: 'ilustrativo', nota: 'Pliegue fino en la desembocadura de la cava inferior.' },
  miocardio:     { nombre: 'Miocardio (VI, VD, infundíbulo)', db: 0, origen: 'fisiología general', nota: 'Gris medio: la referencia de 0 dB.' },
  baseV:         { nombre: 'Base ventricular',             db: 0, ancho: 2, origen: 'ilustrativo' },
  papilar:       { nombre: 'Papilares y banda moderadora', db: 1, ancho: 3.5, origen: 'ilustrativo' },
  higado:        { nombre: 'Hígado',                       db: 1, origen: 'ilustrativo' },
  vci:           { nombre: 'Vena cava inferior (pared)',   db: 1, ancho: 1.2, origen: 'ilustrativo' },
  grasa:         { nombre: 'Grasa epicárdica',             db: 3, ancho: 3.5, origen: 'ilustrativo' },
  coronaria:     { nombre: 'Coronaria',                    db: 5, ancho: 1.4, origen: 'ilustrativo' },
  raiz:          { nombre: 'Raíz aórtica',                 db: 6, ancho: 2.2, origen: 'ilustrativo' },
  vaso:          { nombre: 'Grandes vasos (pared)',        db: 6, ancho: 2.2, origen: 'ilustrativo' },
  cuerda:        { nombre: 'Cuerdas tendinosas (en el plano)', db: 8, origen: 'ilustrativo', nota: 'Siempre más tenues que la valva.' },
  porta:         { nombre: 'Vena porta (vaina fibrosa)',   db: 9, ancho: 1.3, origen: 'ilustrativo' },
  diafragma:     { nombre: 'Diafragma',                    db: 9, origen: 'ilustrativo' },
  xifoides:      { nombre: 'Apófisis xifoides',            db: 12, origen: 'ilustrativo' },
  fibroso:       { nombre: 'Cortina aorto-mitral (continuidad fibrosa)', db: 11, ancho: 1.8, origen: 'ilustrativo', nota: 'Tejido fibroso denso: algo más brillante que la raíz y menos que la valva. La anatomía (continuidad fibrosa aorto-mitral) está en Hahn 2013, pp. 942-943 (PDF 22-23).' },
  valva:         { nombre: 'Valvas',                       db: 13, ancho: 1.4, origen: 'ilustrativo' },
  calcio:        { nombre: 'Calcio (valva o anillo calcificados)', db: 24, ancho: 2.4, atenuacion: 20, origen: 'ilustrativo', nota: 'Brilla mucho y no deja pasar el haz: sombra negra detrás. atenuacion: dB perdidos por mm de calcio.' },
  hueso:         { nombre: 'Hueso (columna, costilla)',   db: 22, ancho: 2.4, atenuacion: 20, origen: 'ilustrativo', nota: 'Cortical: brilla en su cara de delante y no deja pasar el haz (sombra negra detrás).' },
  pleura:        { nombre: 'Pleura-pulmón (interfaz con aire)', db: 20, ancho: 1.6, origen: 'ilustrativo', nota: 'El aire refleja casi todo: línea brillante y, detrás, líneas A repetidas (artefacto), no tejido.' },
  pericardio:    { nombre: 'Pericardio',                   db: 14, ancho: 2, origen: 'fisiología general', nota: 'El reflector más brillante del corazón.' },
};
// Pericardio del dibujo nuevo: una línea fina, la más brillante del corazón pero solo unos dB sobre el miocardio
// (en la eco real no es una cinta blanca; el orden «pericardio > miocardio» es fisiología general, los dB y el grosor, ilustrativos).
export const PERICARDIO_FINO = { db: 3.5, ancho: 1.1, moteadoDb: 3, origen: 'ilustrativo' };
// Caída del brillo con la profundidad del dibujo nuevo (dB por mm, neta tras la TGC; ilustrativo): el tejido blando atenúa
// y la TGC lo compensa solo en parte (POCUS I cap. 2, docs/tamagnone-pocus-ecografia-critica-muestra-parte1.pdf#page=9, impresa 41:
// el capítulo da los mandos de ganancia, no cifras). El campo lejano nunca supera al medio.
export const CAIDA_PROFUNDIDAD = { desdeMm: 20, dbPorMm: 0.06, origen: 'ilustrativo' };
// Caída lateral (dibujo nuevo): el haz fuera del eje está menos enfocado y recibe menos energía, el brillo baja hacia los bordes
// del abanico (dB en el borde, ∝ e²; ilustrativo; la teoría de la sonda de sector, POCUS I cap. 2, p. 41 impresa, no da cifras).
export const CAIDA_LATERAL = { dbBorde: 5, topeDb: 5, origen: 'ilustrativo' };
// Borde endocárdico (dibujo nuevo): interfaz sangre-tejido, unos dB sobre el miocardio medio, sin ser una línea dibujada (ilustrativo).
export const BORDE_ENDO = { db: 1, origen: 'ilustrativo' };
// Surco AV, coronarias, venas y seno coronario del dibujo nuevo: cortan el plano como bandas que se cruzan detrás de la aurícula (la «cruz»
// del PLAX); se apagan unos dB para que no compitan con la pared posterior (ilustrativo).
export const SURCOS_NUEVO = { db: -9, origen: 'ilustrativo' };
// Sombra y refuerzo del dibujo nuevo (multiplican los de hoy; ilustrativo): detrás de lo muy ecogénico (pericardio, costilla) el
// haz pierde más energía, y detrás de la sangre queda más (refuerzo posterior; POCUS I cap. 2, impresa 41, solo lo describe).
export const SOMBRA_NUEVA = { sombra: 1.6, refuerzo: 1.6, origen: 'ilustrativo' };
// Septo interauricular fino (fosa oval) en el A4C: paralelo al haz, se pierde a tramos (dropout). Fracción de tramos y dB: ilustrativo
// (Mitchell 2019, ASE, describe el dropout del septo interauricular como artefacto; no da cifras).
export const DROPOUT_SEPTO = { umbral: 0.15, db: 22, origen: 'ilustrativo' };
// Ajustes globales de la imagen (mismos dB relativos).
export const DB_IMAGEN = {
  borde: { db: -9, origen: 'ilustrativo' },        // borde endocárdico fino
  especular: { db: 9, origen: 'ilustrativo' },     // reflejo especular extra cuando el haz es perpendicular
};
// Pared libre del VD en el dibujo nuevo: es fina y el haz la corta oblicua; en vez de los −3 dB de hoy (más tenue que el VI) se
// realza unos dB para que se vea al menos al 60 % del tabique (ilustrativo; fisiología general: el VD es músculo, solo más delgado).
export const PARED_VD_NUEVO = { db: 4, origen: 'ilustrativo' };
