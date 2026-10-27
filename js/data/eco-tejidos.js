// Brillo de cada tejido en la imagen de eco: una sola tabla para la imagen (ecografia.mjs), la leyenda del
// simulador y la vista Visual. Los dB son relativos al miocardio (0 dB). Sin cifras de fuente: la escala es
// «ilustrativo» (el orden sí es fisiología general: sangre < miocardio < valva < pericardio).
// ancho: grosor (mm) de la línea cuando el tejido se dibuja como línea.
export const TEJIDOS = {
  sangre:        { nombre: 'Sangre (luz)',                 db: -42, origen: 'fisiología general', nota: 'Casi negra: no devuelve eco propio.' },
  extracardiaco: { nombre: 'Fuera del corazón',            db: -20, origen: 'ilustrativo' },
  suprahepatica: { nombre: 'Vena suprahepática',           db: -2, ancho: 0.8, origen: 'ilustrativo' },
  venaPared:     { nombre: 'Venas y seno coronario',       db: -3, ancho: 1.3, origen: 'ilustrativo' },
  auricula:      { nombre: 'Pared de aurícula',            db: -1, ancho: 2.6, origen: 'ilustrativo' },
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
  fibroso:       { nombre: 'Cortina aorto-mitral (continuidad fibrosa)', db: 11, ancho: 1.8, origen: 'ilustrativo', nota: 'Tejido fibroso denso: algo más brillante que la raíz y menos que la valva.' },
  valva:         { nombre: 'Valvas',                       db: 13, ancho: 1.4, origen: 'ilustrativo' },
  calcio:        { nombre: 'Calcio (valva o anillo calcificados)', db: 24, ancho: 2.4, atenuacion: 20, origen: 'ilustrativo', nota: 'Brilla mucho y no deja pasar el haz: sombra negra detrás. atenuacion: dB perdidos por mm de calcio.' },
  hueso:         { nombre: 'Hueso (columna, costilla)',   db: 22, ancho: 2.4, atenuacion: 20, origen: 'ilustrativo', nota: 'Cortical: brilla en su cara de delante y no deja pasar el haz (sombra negra detrás).' },
  pleura:        { nombre: 'Pleura-pulmón (interfaz con aire)', db: 20, ancho: 1.6, origen: 'ilustrativo', nota: 'El aire refleja casi todo: línea brillante y, detrás, líneas A repetidas (artefacto), no tejido.' },
  pericardio:    { nombre: 'Pericardio',                   db: 14, ancho: 2, origen: 'fisiología general', nota: 'El reflector más brillante del corazón.' },
};
// Ajustes globales de la imagen (mismos dB relativos).
export const DB_IMAGEN = {
  borde: { db: -9, origen: 'ilustrativo' },        // borde endocárdico fino
  especular: { db: 9, origen: 'ilustrativo' },     // reflejo especular extra cuando el haz es perpendicular
};
