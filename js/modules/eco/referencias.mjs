// Cifras del latido normal y su referencia. Una sola fuente para las pruebas automáticas y para la tabla
// de la página del latido (latido.html): ninguna marca ✓ está escrita a mano.
//
// origen: 'ficha'  → la referencia está en una ficha de la app (se cita cuál y su PDF en docs/)
//         'atlas'  → la cita un capítulo del Atlas de ecocardiografía de la app (con su fuente original)
//         'general' → fisiología general de texto, sin ficha propia en la app todavía
// pendiente: el motor todavía no cumple esa referencia; se calibrará en la fase de cifras. Las pruebas lo
//            muestran como "pendiente" (no fallan), pero si un día pasa a cumplirse, avisan para quitar la marca.
const F5 = 'Fisiopatología UCI · Cardiología, Ficha 5 (El Libro Azul, cap. 5)';
const ALH = 'Alhakak 2025 (1.969 adultos sanos, Copenhagen City Heart Study; media ± 2 DE), en Atlas · Ciclo cardíaco';
const F10 = 'Fisiopatología UCI · Cardiología, Ficha 10 (El Libro Azul, cap. 10, tabla de macrohemodinamia)';
const T81 = 'Marino · Fundamentos, Tabla 8.1 (#mar-tabla-8-1; docs/marino-2024-practicas-monitorizacion-caps5-9.pdf, p. 61)';

const extremos = (o, k) => [Math.min(...o.map(x => x[k])), Math.max(...o.map(x => x[k]))];
export const REFERENCIAS = [
  { id: 'pvc', nombre: 'PVC (AD media)', unidad: 'mmHg', valor: (u) => u.pvc, min: 0, max: 8, texto: '0-8', origen: 'ficha', fuente: F5 },
  { id: 'pcp', nombre: 'PCP / enclavamiento (AI media)', unidad: 'mmHg', valor: (u) => u.pcp, min: 6, max: 12, texto: '6-12', origen: 'ficha', fuente: F5 },
  { id: 'paps', nombre: 'Arteria pulmonar sistólica', unidad: 'mmHg', valor: (u) => u.paps, min: 20, max: 25, texto: '20-25', origen: 'ficha', fuente: F5 },
  { id: 'papd', nombre: 'Arteria pulmonar diastólica', unidad: 'mmHg', valor: (u) => u.papd, min: 6, max: 12, texto: '6-12', origen: 'ficha', fuente: F5 },
  { id: 'pvdmax', nombre: 'VD sistólica', unidad: 'mmHg', valor: (u) => u.pvd_max, min: 20, max: 25, texto: '20-25', origen: 'ficha', fuente: F5 },
  { id: 'rvs', nombre: 'RVS', unidad: 'dyn·s·cm⁻⁵', valor: (u) => u.rvs, min: 900, max: 1200, texto: '900-1200', origen: 'ficha', fuente: F5,
    pendiente: 'el motor da ~1.285 (IRVS ~29,7: dentro de la Tabla 8.1, 25-30). Con el GC de ~5,1 que deja el ITV del TSVI en 18-22 cm (Ficha 11), bajar de 1.200 llevaría la PAM por debajo de ~81 y la PA por debajo de ~105/65' },
  { id: 'gc', nombre: 'Gasto cardíaco', unidad: 'L/min', valor: (u) => u.gc, min: 4, max: 6, texto: '4-6', origen: 'ficha', fuente: F10, dec: 2 },
  { id: 'ic', nombre: 'Índice cardíaco', unidad: 'L/min/m²', valor: (u) => u.ic, min: 2.4, max: 4, texto: '2,4-4', origen: 'ficha', fuente: F10, dec: 2 },
  { id: 'do2', nombre: 'DO₂', unidad: 'mL/min', valor: (u) => u.do2, min: 870, max: 1200, texto: '870-1200', origen: 'ficha', fuente: F10 },
  { id: 'vo2', nombre: 'VO₂', unidad: 'mL/min', valor: (u) => u.vo2, min: 180, max: 300, texto: '180-300', origen: 'ficha', fuente: F10 },
  { id: 'oei', nombre: 'Índice de extracción de O₂', unidad: '%', valor: (u) => u.er * 100, min: 20, max: 30, texto: '20-30', origen: 'ficha', fuente: F10 },
  { id: 'pas', nombre: 'Presión arterial sistólica', unidad: 'mmHg', valor: (u) => u.pas, min: 105, max: 135, texto: '~120', origen: 'general' },
  { id: 'pad', nombre: 'Presión arterial diastólica', unidad: 'mmHg', valor: (u) => u.pad_, min: 65, max: 85, texto: '~80', origen: 'general' },
  { id: 'pam', nombre: 'PAM', unidad: 'mmHg', valor: (u) => u.pam, min: 70, max: 105, texto: '70-105', origen: 'general' },
  { id: 'edv', nombre: 'VI: volumen telediastólico', unidad: 'mL', valor: (u) => u.edv, min: 100, max: 150, texto: '100-150', origen: 'general' },
  { id: 'vs', nombre: 'VI: volumen sistólico', unidad: 'mL', valor: (u) => u.vs, min: 58, max: 134, texto: '96 ± 19', origen: 'atlas', fuente: ALH },
  { id: 'fe', nombre: 'Fracción de eyección VI', unidad: '%', valor: (u) => u.fe * 100, min: 55, max: 70, texto: '55-70', origen: 'general' },
  { id: 'ptdvi', nombre: 'PTDVI', unidad: 'mmHg', valor: (u) => u.ptdvi, min: 5, max: 12, texto: '5-12', origen: 'general', dec: 1 },
  { id: 'fed', nombre: 'Fracción de eyección VD', unidad: '%', valor: (u) => u.feD * 100, min: 45, max: 62, texto: '45-60', origen: 'general' },
  { id: 'pmls', nombre: 'Presión media de llenado sistémico', unidad: 'mmHg', valor: (u) => u.pmls, min: 5, max: 10, texto: '~7', origen: 'general', dec: 1 },
  { id: 'ppc', nombre: 'Presión de perfusión coronaria', unidad: 'mmHg', valor: (u) => u.ppc, min: 50, max: Infinity, texto: '>50', origen: 'general' },
  { id: 'tcivol', nombre: 'Contracción isovolumétrica', unidad: 'ms', valor: (u) => (u.tAoAbre - u.tS1) * 1000, min: 20, max: 60, texto: '40 ± 10', origen: 'atlas', fuente: ALH },
  { id: 'teyec', nombre: 'Eyección', unidad: 'ms', valor: (u) => (u.tS2 - u.tAoAbre) * 1000, min: 246, max: 338, texto: '292 ± 23', origen: 'atlas', fuente: ALH },
  { id: 'trivol', nombre: 'Relajación isovolumétrica', unidad: 'ms', valor: (u) => (u.tMitAbre - u.tS2) * 1000, min: 58, max: 134, texto: '96 ± 19', origen: 'atlas', fuente: ALH },
  { id: 'aimin', nombre: 'Aurícula izquierda (mínimo)', unidad: 'mL', valor: (u, o) => extremos(o, 'vai')[0], min: 15, max: 35, texto: '~20-30', origen: 'general' },
  { id: 'aimax', nombre: 'Aurícula izquierda (máximo)', unidad: 'mL', valor: (u, o) => extremos(o, 'vai')[1], min: 40, max: 65, texto: '~50-60', origen: 'general' },
  { id: 'admin', nombre: 'Aurícula derecha (mínimo)', unidad: 'mL', valor: (u, o) => extremos(o, 'vad')[0], min: 10, max: 30, texto: '~15-25', origen: 'general' },
  { id: 'admax', nombre: 'Aurícula derecha (máximo)', unidad: 'mL', valor: (u, o) => extremos(o, 'vad')[1], min: 35, max: 65, texto: '~40-60', origen: 'general' },
  { id: 'svo2', nombre: 'SvO₂', unidad: '%', valor: (u) => u.svo2 * 100, min: 65, max: 80, texto: '70-75', origen: 'general' },
  // Tabla 8.1 de Marino (lo que mide el catéter de arteria pulmonar). El enclavamiento es la presión de las venas
  // pulmonares del motor (lecturas.mjs, LUGARES.enclavado): con el globo hinchado la punta lee la presión venosa del
  // lado izquierdo (#mar-enclavamiento-ondas)
  { id: 'pvc-t81', nombre: 'PVC (Tabla 8.1 del catéter)', unidad: 'mmHg', valor: (u) => u.pvc, min: 0, max: 5, texto: '0-5', origen: 'ficha', fuente: T81, dec: 2 },
  // IRVS = (PAM − PVC) / IC, en unidades Wood indexadas (mmHg/L/min/m²), como la define la ficha (#mar-tabla-8-1)
  { id: 'irvs-t81', nombre: 'IRVS (Tabla 8.1 del catéter)', unidad: 'U. Wood·m²', valor: (u) => (u.pam - u.pvc) / u.ic, min: 25, max: 30, texto: '25-30', origen: 'ficha', fuente: T81, dec: 1 },
  { id: 'pawp-t81', nombre: 'Enclavamiento (Tabla 8.1 del catéter)', unidad: 'mmHg', valor: (u) => u.pvp, min: 6, max: 12, texto: '6-12', origen: 'ficha', fuente: T81, dec: 1 },
];

// Devuelve, para un latido (u = motor.ultimo, o = motor.onda), cada referencia con su valor y si cumple
export function evaluar(u, o) {
  return REFERENCIAS.map(r => { const v = r.valor(u, o); return { ...r, v, ok: Number.isFinite(v) && v >= r.min && v <= r.max }; });
}

// ---------------------------------------------------------------------------------------------------------------
// Cifras de forma y tamaño (parada 2 de eco-mega, 26/10/2026; lector de fuente): normales de las cámaras, grosores,
// función del VD y torsión. Mismo formato que arriba, pero NO las evalúa `evaluar()`: el motor no mide diámetros
// ni áreas (los mide la geometría), así que `valor` es SIN_MEDIR (NaN). Las usará la prueba «paciente posible»
// (paciente-posible.test.mjs, B1) con su propia medida. Rango = límites de la fuente; si la fuente solo da media ± DE,
// se dice en `nota` que el rango es media ± 2 DE calculado aquí. Las páginas son las del PDF (en Lang 2015 coinciden
// con las impresas; en Mor-Avi 2011, impresa = PDF + 276).
const LANG = (p) => 'Lang 2015 (ASE/EACVI, cuantificación de cámaras; docs/lang-2015-cuantificacion-camaras-ase.pdf, p. ' + p + ')';
const MOR = (p, q) => 'Mor-Avi 2011 (ASE/EAE, mecánica cardíaca; docs/mor-avi-2011-mecanica-cardiaca-ase.pdf, p. PDF ' + p + ' = impresa ' + q + ')';
const SIN_MEDIR = () => NaN;
export const REFERENCIAS_FORMA = [
  { id: 'vi-dtd-h', nombre: 'VI: diámetro telediastólico (varón)', unidad: 'mm', valor: SIN_MEDIR, min: 42, max: 58.4, texto: '50,2 ± 4,1 (42,0-58,4)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-dtd-m', nombre: 'VI: diámetro telediastólico (mujer)', unidad: 'mm', valor: SIN_MEDIR, min: 37.8, max: 52.2, texto: '45,0 ± 3,6 (37,8-52,2)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-dts-h', nombre: 'VI: diámetro telesistólico (varón)', unidad: 'mm', valor: SIN_MEDIR, min: 25, max: 39.8, texto: '32,4 ± 3,7 (25,0-39,8)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-dts-m', nombre: 'VI: diámetro telesistólico (mujer)', unidad: 'mm', valor: SIN_MEDIR, min: 21.6, max: 34.8, texto: '28,2 ± 3,3 (21,6-34,8)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vtd-h', nombre: 'VI: volumen telediastólico biplano (varón)', unidad: 'mL', valor: SIN_MEDIR, min: 62, max: 150, texto: '106 ± 22 (62-150)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vtd-m', nombre: 'VI: volumen telediastólico biplano (mujer)', unidad: 'mL', valor: SIN_MEDIR, min: 46, max: 106, texto: '76 ± 15 (46-106)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vts-h', nombre: 'VI: volumen telesistólico biplano (varón)', unidad: 'mL', valor: SIN_MEDIR, min: 21, max: 61, texto: '41 ± 10 (21-61)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vts-m', nombre: 'VI: volumen telesistólico biplano (mujer)', unidad: 'mL', valor: SIN_MEDIR, min: 14, max: 42, texto: '28 ± 7 (14-42)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vtdi-h', nombre: 'VI: volumen telediastólico indexado (varón)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 34, max: 74, texto: '54 ± 10 (34-74)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vtdi-m', nombre: 'VI: volumen telediastólico indexado (mujer)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 29, max: 61, texto: '45 ± 8 (29-61)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vtsi-h', nombre: 'VI: volumen telesistólico indexado (varón)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 11, max: 31, texto: '21 ± 5 (11-31)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-vtsi-m', nombre: 'VI: volumen telesistólico indexado (mujer)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 8, max: 24, texto: '16 ± 4 (8-24)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-fe-h', nombre: 'VI: fracción de eyección biplana (varón)', unidad: '%', valor: SIN_MEDIR, min: 52, max: 72, texto: '62 ± 5 (52-72)', origen: 'ficha', fuente: LANG(7), nota: 'el texto da 63 ± 5 (53-73) para ambos sexos (p. 7)' },
  { id: 'vi-fe-m', nombre: 'VI: fracción de eyección biplana (mujer)', unidad: '%', valor: SIN_MEDIR, min: 54, max: 74, texto: '64 ± 5 (54-74)', origen: 'ficha', fuente: LANG(7) },
  { id: 'vi-septo-h', nombre: 'VI: grosor del septo y de la pared posterior (varón)', unidad: 'cm', valor: SIN_MEDIR, min: 0.6, max: 1.0, texto: '0,6-1,0', origen: 'ficha', fuente: LANG(17), nota: 'método lineal; la fuente no da media ± DE' },
  { id: 'vi-septo-m', nombre: 'VI: grosor del septo y de la pared posterior (mujer)', unidad: 'cm', valor: SIN_MEDIR, min: 0.6, max: 0.9, texto: '0,6-0,9', origen: 'ficha', fuente: LANG(17), nota: 'método lineal; la fuente no da media ± DE' },
  { id: 'vi-rwt-h', nombre: 'VI: grosor relativo de pared (varón)', unidad: '', valor: SIN_MEDIR, min: 0.24, max: 0.42, texto: '0,24-0,42', origen: 'ficha', fuente: LANG(17), nota: 'RWT = 2 × pared posterior / DTDVI. La tabla rotula la unidad «cm» (errata de la fuente: es un cociente)' },
  { id: 'vi-rwt-m', nombre: 'VI: grosor relativo de pared (mujer)', unidad: '', valor: SIN_MEDIR, min: 0.22, max: 0.42, texto: '0,22-0,42', origen: 'ficha', fuente: LANG(17) },
  { id: 'vi-masa-h', nombre: 'VI: masa indexada, método 2D (varón)', unidad: 'g/m²', valor: SIN_MEDIR, min: 50, max: 102, texto: '50-102', origen: 'ficha', fuente: LANG(17) },
  { id: 'vi-masa-m', nombre: 'VI: masa indexada, método 2D (mujer)', unidad: 'g/m²', valor: SIN_MEDIR, min: 44, max: 88, texto: '44-88', origen: 'ficha', fuente: LANG(17) },
  { id: 'ai-vol', nombre: 'Aurícula izquierda: volumen máximo indexado (biplano)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 16, max: 34, texto: '16-34 (media 25)', origen: 'ficha', fuente: LANG(10), nota: 'la media 25 mL/m² está en la p. 25; el límite superior pasó de 28 a 34' },
  { id: 'ad-vol-h', nombre: 'Aurícula derecha: volumen indexado, 4C monoplano (varón)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 11, max: 39, texto: '25 ± 7', origen: 'ficha', fuente: LANG(30), nota: 'la fuente da solo media ± DE (también en el texto, p. 28); el rango es media ± 2 DE calculado aquí' },
  { id: 'ad-vol-m', nombre: 'Aurícula derecha: volumen indexado, 4C monoplano (mujer)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 9, max: 33, texto: '21 ± 6', origen: 'ficha', fuente: LANG(30), nota: 'la fuente da solo media ± DE (también en el texto, p. 28); el rango es media ± 2 DE calculado aquí' },
  { id: 'ad-eje-menor', nombre: 'Aurícula derecha: eje menor indexado', unidad: 'cm/m²', valor: SIN_MEDIR, min: 1.3, max: 2.5, texto: '1,9 ± 0,3 (ambos sexos)', origen: 'ficha', fuente: LANG(30), nota: 'rango = media ± 2 DE calculado aquí' },
  { id: 'ad-eje-mayor', nombre: 'Aurícula derecha: eje mayor indexado', unidad: 'cm/m²', valor: SIN_MEDIR, min: 1.8, max: 3.1, texto: '2,5 ± 0,3 mujer; 2,4 ± 0,3 varón', origen: 'ficha', fuente: LANG(30), nota: 'rango = media ± 2 DE de la mujer, calculado aquí' },
  { id: 'vd-basal', nombre: 'VD: diámetro basal (vista enfocada al VD)', unidad: 'mm', valor: SIN_MEDIR, min: 25, max: 41, texto: '33 ± 4 (25-41); dilatado >41', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-medio', nombre: 'VD: diámetro medio', unidad: 'mm', valor: SIN_MEDIR, min: 19, max: 35, texto: '27 ± 4 (19-35); dilatado >35', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-largo', nombre: 'VD: diámetro longitudinal', unidad: 'mm', valor: SIN_MEDIR, min: 59, max: 83, texto: '71 ± 6 (59-83)', origen: 'ficha', fuente: LANG(20) },
  { id: 'rvot-plax', nombre: 'TSVD: diámetro en PLAX', unidad: 'mm', valor: SIN_MEDIR, min: 20, max: 30, texto: '25 ± 2,5 (20-30)', origen: 'ficha', fuente: LANG(20) },
  { id: 'rvot-prox', nombre: 'TSVD: diámetro proximal', unidad: 'mm', valor: SIN_MEDIR, min: 21, max: 35, texto: '28 ± 3,5 (21-35)', origen: 'ficha', fuente: LANG(20) },
  { id: 'rvot-dist', nombre: 'TSVD: diámetro distal', unidad: 'mm', valor: SIN_MEDIR, min: 17, max: 27, texto: '22 ± 2,5 (17-27)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-pared', nombre: 'VD: grosor de la pared libre (telediástole)', unidad: 'mm', valor: SIN_MEDIR, min: 1, max: 5, texto: '3 ± 1 (1-5)', origen: 'ficha', fuente: LANG(20), nota: 'sin cifra sistólica en la fuente (hueco)' },
  { id: 'vd-area-td-h', nombre: 'VD: área telediastólica (varón)', unidad: 'cm²', valor: SIN_MEDIR, min: 10, max: 24, texto: '17 ± 3,5 (10-24)', origen: 'ficha', fuente: LANG(20), nota: 'errata de la fuente: la tabla rotula esta fila «RVOT EDA»; por contexto es el área telediastólica del VD' },
  { id: 'vd-area-td-m', nombre: 'VD: área telediastólica (mujer)', unidad: 'cm²', valor: SIN_MEDIR, min: 8, max: 20, texto: '14 ± 3 (8-20)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-area-ts-h', nombre: 'VD: área telesistólica (varón)', unidad: 'cm²', valor: SIN_MEDIR, min: 3, max: 15, texto: '9 ± 3 (3-15)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-area-ts-m', nombre: 'VD: área telesistólica (mujer)', unidad: 'cm²', valor: SIN_MEDIR, min: 3, max: 11, texto: '7 ± 2 (3-11)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-vtdi-h', nombre: 'VD: volumen telediastólico indexado, 3D (varón)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 35, max: 87, texto: '61 ± 13 (35-87)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-vtdi-m', nombre: 'VD: volumen telediastólico indexado, 3D (mujer)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 32, max: 74, texto: '53 ± 10,5 (32-74)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-vtsi-h', nombre: 'VD: volumen telesistólico indexado, 3D (varón)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 10, max: 44, texto: '27 ± 8,5 (10-44)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-vtsi-m', nombre: 'VD: volumen telesistólico indexado, 3D (mujer)', unidad: 'mL/m²', valor: SIN_MEDIR, min: 8, max: 36, texto: '22 ± 7 (8-36)', origen: 'ficha', fuente: LANG(20) },
  { id: 'vd-fe3d', nombre: 'VD: fracción de eyección 3D', unidad: '%', valor: SIN_MEDIR, min: 45, max: Infinity, texto: '58 ± 6,5; anormal <45', origen: 'ficha', fuente: LANG(23) },
  { id: 'tapse', nombre: 'TAPSE (anillo tricuspídeo lateral)', unidad: 'mm', valor: SIN_MEDIR, min: 17, max: 31, texto: '24 ± 3,5; anormal <17', origen: 'ficha', fuente: LANG(23), nota: 'tope 31 = media + 2 DE calculado aquí; el PDF solo da el umbral <17 (también en p. 19)' },
  { id: 'vd-s', nombre: 'Onda S′ tricuspídea lateral (Doppler pulsado)', unidad: 'cm/s', valor: SIN_MEDIR, min: 9.5, max: 18.7, texto: '14,1 ± 2,3; anormal <9,5', origen: 'ficha', fuente: LANG(23), nota: 'tope 18,7 = media + 2 DE calculado aquí; umbral <9,5 también en p. 20' },
  { id: 'vd-fac', nombre: 'VD: cambio fraccional de área (FAC)', unidad: '%', valor: SIN_MEDIR, min: 35, max: 63, texto: '49 ± 7; anormal <35', origen: 'ficha', fuente: LANG(23), nota: 'tope 63 = media + 2 DE calculado aquí' },
  { id: 'torsion', nombre: 'VI: torsión máxima (giro neto ápex − base)', unidad: '°', valor: SIN_MEDIR, min: 0.7, max: 14.7, texto: '7,7 ± 3,5', origen: 'ficha', fuente: MOR(14, 290), nota: 'rango = media ± 2 DE calculado aquí. Por edad: <40 años 6,7 ± 2,9; 40-60 8,0 ± 3,0; >60 10,8 ± 4,9. Rotación basal y apical por separado: hueco' },
];
