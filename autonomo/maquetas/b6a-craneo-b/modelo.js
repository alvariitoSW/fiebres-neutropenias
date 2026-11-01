// Cráneo B · el motor: estado → PIC, PPC, estadio de herniación, GCS, pupilas y topes. Sin DOM.
// Cifras con fuente (Marino cap. 45-47): PIC <20 y PPC 50-70 (p. 45); PPC <50 a evitar (Manual UMI). Todo lo demás
// (cuánto sube la PIC con la masa, cuánto baja cada drenaje) es `ilustrativo`: forma, no medida.
// TODO pieza común UMBRALES (js/data/craneo-vivo-data.js): calcPpc() del cuaderno debería leerlos de allí.
export const U = { picMax: 80, pamMax: 150, ppcSin: 10, pic: 20, ppcMin: 50, ppcMax: 70, pasHic: 140, naMax: 155, naMin: 145 };
export const TIPOS = { hematoma: 'Hematoma', edema: 'Edema del ictus', ventricular: 'Sangre ventricular', hsa: 'HSA', tronco: 'Tronco' };
import { pupilaDe } from './cara.js';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const nuevo = (o = {}) => ({ tipo: 'hematoma', masa: 0, pas: 128, anti: 'ninguno', rev: false, t: 0, drenaje: 0, hiper: 0, mani: 0, vent: 'esp',
  nitro: false, cran: false, sensor: true, nimo: false, exc: false, na: 138, ...o });
export const pad = (s) => Math.round(0.55 * s.pas);                  // PAD supuesta: ilustrativo
export const pam = (s) => Math.round((s.pas + 2 * pad(s)) / 3);
export const resangra = (s) => s.tipo === 'hsa' && !s.exc && s.pas > U.pasHic && s.t >= 1 && s.t <= 3;   // a la hora 0 solo aviso (Marino p. 47)
// Estadios por PIC (ilustrativo): 0 normal · 1 línea media desplazada · 2 uncal (pupila D fija) · 3 decorticación · 4 descerebración · 5 flácido · 6 sin flujo
export function leer(s) {
  const m = resangra(s) ? Math.max(s.masa, 70) : s.masa, P = pam(s);
  let pic = s.tipo === 'tronco' ? 8 : 8 + 12 * (m / 50) ** 2 + (m > 70 ? (m - 70) * 3 : 0);
  pic -= (s.tipo === 'ventricular' ? 8 : 4) * s.drenaje + 5 * Math.min(s.hiper, 3) + 3 * Math.min(s.mani, 3) + (s.cran ? 10 : 0);
  pic += (s.vent !== 'esp' ? 3 : 0) - (s.vent === 'hv' ? 5 : 0) + (s.nitro ? 5 : 0);
  const picBruta = Math.round(pic); pic = Math.round(Math.min(Math.max(4, pic), U.picMax, P));   // tope 80: fisiología general
  const me = pic >= P - U.ppcSin + 1, est = me ? 6 : pic >= 60 ? 5 : pic >= 50 ? 4 : pic >= 40 ? 3 : pic >= 30 ? 2 : pic >= U.pic ? 1 : 0;
  let O = [4, 3, 2, 1, 1, 1, 1][est], V = [5, 4, 3, 2, 1, 1, 1][est], M = [6, 6, 4, 3, 2, 1, 1][est];
  if (s.tipo === 'hsa' && est <= 1) { O = 2; V = 3; M = 4; }   // Petronila: GCS 9 por la HSA, no por herniación (Tabla 45.4; ilustrativo)
  const hsaDiasEsp = s.tipo === 'hsa' && s.t >= 4 && s.t <= 14;
  const base = 0, gcs = s.tipo === 'tronco' ? null : Math.max(3, O + V + M - base - (hsaDiasEsp ? 2 : 0));
  const pup = pupilaDe(est, s.tipo);
  return { P, pic, ppc: P - pic, est, me, O, V, M, gcs, pup, masaEf: m, picBruta, hsaDiasEsp, shift: Math.round(26 * clamp(m, 0, 100) / 100) };
}
const T = (c, n, titulo, texto, pag, ficha, origen, off = []) => ({ c, n, titulo, texto, pag, ficha, origen, off });
export function topes(s) {
  const L = leer(s), t = [], hem = s.tipo === 'hematoma' || s.tipo === 'ventricular';
  if (L.me) t.push(T('me', 'sello', 'Sin flujo cerebral', 'PIC igual o casi igual a la PAM (PPC <10): casi no entra sangre; umbral PPC <10 ilustrativo. La muerte encefálica exige además la Tabla 45.6 (≥48 h, T >36 °C, PAM ≥75, causa suficiente).', 14, 'mn-me-definicion', 'ficha · p. 14-15 · umbral ilustrativo', ['#b-mas', '#b-hora']));
  else {
    if (L.est >= 4) t.push(T('desc', 'sello', 'Compresión del tronco', L.est >= 5 ? 'Extremidades flácidas, pupilas dilatadas y fijas: el daño llega al tronco bajo (p. 10; Tabla 45.4).' : 'Descerebración (mesencéfalo y protuberancia alta), pupilas dilatadas y fijas (p. 10; Tabla 45.4).', 10, 'mn-coma-posturas', 'ficha · p. 10-11', ['#b-mas']));
    else if (L.est >= 2 && s.tipo !== 'hsa') t.push(T('uncal', 'sello', 'Herniación uncal: masa en expansión', 'Una pupila dilatada y fija (la del lado de la masa); si sigue, la mano pasa a flexión y luego a extensión.', 11, 'mn-tabla-45-4', 'ficha · p. 10-11', ['#b-mas']));
  }
  if (!L.me && L.ppc < U.ppcMin) t.push(T('ppc', 'aviso', 'PPC <50', `PPC ${L.ppc}: el cerebro recibe poca presión de riego. Objetivo 50-70 en la hemorragia intracerebral.`, 45, 'mn-hic-ppc', 'ficha · p. 45; Manual UMI: <50 a evitar'));
  if (L.picBruta > U.picMax) t.push(T('pic80', 'aviso', 'PIC 80 mmHg', 'Tope del modelo: más de 80 mmHg no se muestra (fisiología general).', 45, 'mn-hic-pic', 'fisiología general'));
  if (L.pic >= U.pic && !L.me) t.push(T('pic', 'aviso', 'PIC ≥20', 'Por encima del objetivo: drenar LCR y bajar la presión.', 45, 'mn-hic-pic', 'ficha · p. 45'));
  if (L.gcs !== null && L.gcs <= 8 && !s.sensor && !L.me) t.push(T('sensor', 'aviso', 'GCS ≤8 sin sensor', 'Con GCS ≤8, sangre ventricular o midriasis unilateral hay que monitorizar la PIC.', 45, 'mn-hic-pic', 'ficha · p. 45'));
  if (s.tipo === 'edema' && s.sensor) t.push(T('edemasens', 'aviso', 'Ictus isquémico', 'En el edema del ictus no se recomienda monitorizar la PIC.', 40, 'mn-isq-edema-manejo', 'ficha · p. 40'));
  if (hem && s.anti !== 'ninguno' && !s.rev && s.t >= 3) t.push(T('crece', 'sello', 'Sigue sangrando', 'Con anticoagulante sin revertir el hematoma crece cada hora: lo primero es frenar el crecimiento, revertir ya.', 42, 'mn-hic-warfarina', 'ficha · p. 41-44', ['#b-hora']));
  if (hem && s.pas > U.pasHic && s.masa > 0) t.push(T('pas', 'aviso', 'PAS >140', 'En la hemorragia intracerebral el objetivo es PAS <140; por encima el hematoma crece más deprisa (dirección: ilustrativo).', 45, 'mn-hic-datos', 'ficha · p. 45'));
  if (s.nitro) t.push(T('nitro', 'sello', 'Nitroprusiato', 'Dilata los vasos del cerebro: la PIC sube. A evitar en el ictus agudo (la ficha no explica el porqué).', 36, 'mn-isq-hta-recomendaciones', 'ficha · p. 36', ['#b-nitro']));
  if (s.vent !== 'esp') t.push(T('vpp', 'aviso', s.vent === 'hv' ? 'Hiperventilación transitoria' : 'Presión positiva', s.vent === 'hv' ? 'PaCO₂ 30-35 solo un rato, nunca 24 h; baja la PIC pero también el flujo (Manual UMI).' : 'La ventilación con presión positiva sube la PIC y puede bajar la PPC.', s.vent === 'hv' ? null : 35, s.vent === 'hv' ? null : 'mn-isq-vm', s.vent === 'hv' ? 'Manual UMI · hipertensión intracraneal' : 'ficha · p. 35'));
  if (s.na > U.naMax) t.push(T('na', 'sello', 'Na⁺ >155', `Na⁺ ${s.na}: por encima del objetivo 145-155 del salino hipertónico; no se repite el bolo.`, 41, 'mn-isq-edema-manejo', 'ficha · p. 41', ['#b-hiper']));
  if (s.cran) t.push(T('cran', 'sello', 'Hueso retirado', 'La caja se abre por un lado y la PIC cae (magnitud ilustrativa); se plantea en el infarto maligno (≤60 años, ≤48 h: fuente web RCEM, no Marino).', null, null, 'fuente web RCEM · magnitud ilustrativa', ['#b-cran']));
  if (resangra(s)) t.push(T('resang', 'sello', 'Resangrado', 'Aneurisma sin excluir con PAS >140 en los primeros días: la sangre vuelve a salir (la mejor prevención es cerrarlo).', 47, 'mn-hsa-aneurisma', 'ficha · p. 47', ['#b-hora']));
  else if (s.tipo === 'hsa' && !s.exc && s.t === 0 && s.pas > U.pasHic) t.push(T('resang0', 'aviso', 'PAS >140 con aneurisma abierto', 'Riesgo de resangrado: la mejor prevención es cerrar el aneurisma; controla la PAS.', 47, 'mn-hsa-aneurisma', 'ficha · p. 47'));
  else if (s.tipo === 'hsa' && !s.exc && s.t > 3) t.push(T('exc', 'aviso', 'Aneurisma abierto', 'Cerrarlo en 3 días; nunca más allá de 7-10.', 47, 'mn-hsa-aneurisma', 'ficha · p. 47'));
  if (L.hsaDiasEsp) t.push(T('vaso', 'aviso', 'Días 4-14', 'Las arterias de la base se estrechan; el Doppler transcraneal sube su velocidad y el GCS pierde 2 puntos. Vigilar.', 48, 'mn-hsa-vigilar', 'ficha · p. 48'));
  return t;
}
// Una hora (hematoma) o un día (el resto). Magnitudes: ilustrativas.
export function avanzar(s) {
  s.t++;
  if (s.tipo === 'hematoma' || s.tipo === 'ventricular') s.masa = clamp(s.masa + (s.anti !== 'ninguno' && !s.rev ? (s.pas > U.pasHic ? 9 : 6) : s.pas > U.pasHic ? 2 : 0), 0, 100);
  else if (s.tipo === 'edema') s.masa = clamp(s.masa + 6, 0, 100);
}
export const unidad = (s) => (s.tipo === 'hematoma' || s.tipo === 'ventricular' ? 'h' : 'día');
