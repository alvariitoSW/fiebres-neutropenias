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
    pendiente: 'el motor da ~1.450: PAM algo alta (~100) para un GC de 5,2' },
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
  { id: 'pvc-t81', nombre: 'PVC (Tabla 8.1 del catéter)', unidad: 'mmHg', valor: (u) => u.pvc, min: 0, max: 5, texto: '0-5', origen: 'ficha', fuente: T81, dec: 2,
    pendiente: 'el motor da 5,02 mmHg: en el borde alto (con la Ficha 5, 0-8, cumple)' },
  { id: 'pawp-t81', nombre: 'Enclavamiento (Tabla 8.1 del catéter)', unidad: 'mmHg', valor: (u) => u.pvp, min: 6, max: 12, texto: '6-12', origen: 'ficha', fuente: T81, dec: 1 },
];

// Devuelve, para un latido (u = motor.ultimo, o = motor.onda), cada referencia con su valor y si cumple
export function evaluar(u, o) {
  return REFERENCIAS.map(r => { const v = r.valor(u, o); return { ...r, v, ok: Number.isFinite(v) && v >= r.min && v <= r.max }; });
}
