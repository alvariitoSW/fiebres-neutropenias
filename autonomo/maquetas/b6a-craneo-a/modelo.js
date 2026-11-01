// Física ilustrativa de la caja cerrada. NO es de Marino: el libro solo dice que la PIC sube y la PPC = PAM − PIC (p. 45). Todo `ilustrativo`.
import { P, PEND } from './datos.js';
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const fmt = (x) => Math.round(x);
export const nuevo = (o = {}) => ({ tipo: 'hv', m: 0, pam: 95, drain: 0, na: 140, vpp: false, co2: 40, h: 0, ictus: false, ...o });
// volumen que "ocupa" la masa y lo que se quita (LCR drenado, hipertónico), en unidades de la caja (no son mL)
export function volumen(s) {
  let v = 0.3 * s.m;
  if (s.tipo === 'hv' && s.h >= 12) v += 3;                       // hidrocefalia obstructiva por la sangre ventricular (p. 45)
  if (s.tipo === 'edema') v += Math.min(s.h, 72) * 0.05;
  v += 0.25 * (s.co2 - 40);                                         // sangre cerebral: sube con la PaCO₂ (fisiología general)
  v -= (s.tipo === 'edema' ? 0.35 : 0.1) * (s.na - 140);            // el hipertónico saca agua del edema (p. 41)
  v -= 3 * s.drain;                                                 // LCR drenado (p. 45)
  return Math.max(0, v);
}
export const picDe = (v) => 8 + 4 * Math.min(v, 15) / 15 + (v > 15 ? 90 * Math.pow((v - 15) / 15, 1.4) : 0);
export function leer(s) {
  const v = volumen(s); let pic = picDe(v) + (s.vpp ? P.vpp : 0);
  const pam = clamp(s.pam - (s.vpp ? 5 : 0), 30, 150);             // la VPP baja el retorno venoso (p. 35; magnitud ilustrativa)
  const tope = pic >= pam - 0.5 || pic >= 80; pic = Math.min(pic, pam, 80);
  const ppc = pam - pic;
  const gcs = pic >= pam - 0.5 ? 3 : pic < 15 ? 14 : pic < 20 ? 12 : pic < 30 ? 9 : pic < 45 ? 6 : 3;
  const pup = ppc <= 0.5 ? 'medias fijas' : pic >= 40 ? 'dilatadas fijas' : pic >= 25 && s.tipo !== 'edema' ? 'una dilatada fija' : pic >= 25 ? 'dilatadas fijas' : 'normales';
  return { v, pic, pam, ppc, gcs, pup, tope, hidro: s.tipo === 'hv' && s.h >= 12, fc: s.pam < 65 ? 105 : 78 };
}
const c = (pag, texto, o = {}) => ({ pag, texto, ...o });
// Los topes: cada uno con página u origen y su consecuencia clínica. Sello = apaga el mando que lo causó.
export function topes(s) {
  const L = leer(s), t = [];
  if (L.ppc <= 0.5) t.push({ c: 'flujo', n: 'sello', titulo: 'Flujo cerebral detenido', texto: 'La PIC iguala a la PAM: PPC 0, pupilas medias fijas; si es irreversible, muerte encefálica.', pag: 14, origen: 'ficha · p. 14, p. 10-11', off: ['#b-masa-mas', '#b-reloj', '#b-pam-menos'] });
  else if (L.pic >= 80) t.push({ c: 'pic80', n: 'sello', titulo: 'PIC 80: tope del modelo', texto: `PPC ${fmt(L.ppc)}: casi sin flujo; si la PIC iguala a la PAM el flujo se detiene y las pupilas quedan medias fijas.`, pag: 14, origen: 'ficha · p. 14; tope: ilustrativo', off: ['#b-masa-mas', '#b-reloj', '#b-pam-menos'] });
  else if (L.ppc < P.ppcMin) t.push({ c: 'ppc', n: 'sello', titulo: 'PPC por debajo de 50-70', texto: `PPC ${fmt(L.ppc)}: por debajo del objetivo; el Manual UMI la da «<50 a evitar».`, pag: 45, origen: 'ficha · p. 45 + Manual UMI' });
  else if (L.ppc > P.ppcMax) t.push({ c: 'ppc', n: 'aviso', titulo: 'PPC por encima de 70', texto: `PPC ${fmt(L.ppc)} (objetivo 50-70): si la PIC sigue ≥20, drena antes de subir más la PAM.`, pag: 45, origen: 'ficha · p. 45' });
  if (L.pic >= P.picAviso && L.ppc > 0.5) t.push({ c: 'pic', n: 'aviso', titulo: 'PIC ≥ 20', texto: 'Drenar LCR (PIC <20 mmHg).', pag: 45, origen: 'ficha · p. 45' });
  if (s.na > P.naMax) t.push({ c: 'na', n: 'sello', titulo: 'Na⁺ por encima de 155', texto: `Na⁺ ${s.na}: fuera del objetivo 145-155; no más bolos.`, pag: 41, origen: 'ficha · p. 41', off: ['#b-hiper'] });
  if (s.co2 < 30) t.push({ c: 'co2', n: 'sello', titulo: 'Hiperventilación excesiva', texto: 'Solo moderada y transitoria (30-35), no las primeras 24 h; vasoconstricción y menos flujo.', pag: 0, origen: 'Manual UMI (umi-pic)', off: ['#b-co2-menos'] });
  if (s.co2 > 45) t.push({ c: 'co2a', n: 'aviso', titulo: 'PaCO₂ >45', texto: 'La sangre cerebral crece y la PIC sube.', pag: 0, origen: 'fisiología general · ' + PEND, off: s.co2 >= 50 ? ['#b-co2-mas'] : [] });
  if (s.vpp) t.push({ c: 'vpp', n: 'aviso', titulo: 'Presión positiva', texto: 'Sube la PIC y puede bajar la PPC.', pag: 35, origen: 'ficha · p. 35' });
  if (s.ictus && s.pam < 65) t.push({ c: 'pam', n: 'sello', titulo: 'PAM <65 en el ictus', texto: 'Hipotensión: corregir ya (PAM >65); el flujo depende de la presión.', pag: 37, origen: 'ficha · p. 36-37', off: ['#b-pam-menos'] });
  if (s.pam >= 150) t.push({ c: 'pamx', n: 'aviso', titulo: 'PAM 150 (tope del mando)', texto: 'Tope de rango del modelo.', pag: 0, origen: 'fisiología general', off: ['#b-pam-mas'] });
  if (s.pam <= 40) t.push({ c: 'pamn', n: 'sello', titulo: 'PAM 40 (tope del mando)', texto: 'Shock: perfusión de todo el cuerpo en riesgo.', pag: 0, origen: 'fisiología general', off: ['#b-pam-menos'] });
  if (s.drain >= P.drenajeMax) t.push({ c: 'dren', n: 'aviso', titulo: '3 tramos drenados', texto: 'No queda más LCR que drenar sin colapsar los ventrículos (magnitud ilustrativa).', pag: 0, origen: 'ilustrativo', off: ['#b-dren'] });
  if (s.m >= 100) t.push({ c: 'mmax', n: 'aviso', titulo: 'Masa al máximo', texto: 'Tope del mando (ilustrativo, sin cifra de volumen).', pag: 0, origen: 'ilustrativo', off: ['#b-masa-mas'] });
  if (L.hidro) t.push({ c: 'hid', n: 'aviso', titulo: 'Hidrocefalia obstructiva', texto: 'La sangre ventricular bloquea el LCR: el compartimento crece; hace falta catéter.', pag: 45, origen: 'ficha · p. 45' });
  if (s.h >= 72) t.push({ c: 'h', n: 'aviso', titulo: '72 h', texto: 'Fin del reloj del modelo.', pag: 0, origen: 'ilustrativo', off: ['#b-reloj'] });
  return t;
}
