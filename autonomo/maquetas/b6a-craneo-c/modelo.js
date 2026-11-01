// El modelo: un estado pequeño y una lectura, sin DOM. Dirección de cada efecto: Marino (páginas en datos.js); magnitudes: ilustrativas.
import { UMBRALES as U, ILUS, PRESETS } from './datos.js';
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const fmt = (x, d = 0) => (Number.isFinite(x) ? x.toFixed(d).replace('.', ',') : '—');
export const nuevo = (clave = 'herme', extra = {}) => { const s = { ...PRESETS[clave].s, ...extra }; return { ...s, pam0: s.pam, pic0: s.pic, pas0: null, vpp: false, nitro: false, dex: false }; };
const bump = (d) => (d < 4 || d > 14 ? 0 : 1 - Math.abs(d - 9) / 6);   // vasoespasmo: días 4-14 (N p. 48); el pico es ilustrativo
export function leer(s) {
  const picEf = Math.min(s.pic + (s.vpp ? ILUS.vpp : 0) + (s.nitro ? ILUS.nitro : 0), s.pam);
  const ppc = s.pam - picEf, ppc0 = s.pam0 - s.pic0;
  const pp = s.pp0 * s.pam / s.pam0, pas = s.pam + 2 * pp / 3, pad = s.pam - pp / 3;
  const sat = clamp(Math.round(s.sat0 + (s.fio2 - 21) * 0.55), 0, 100);
  const fo2 = 1 - ILUS.o2Max * (s.fio2 - 21) / 79;           // O₂ al 100 %: el flujo cae 15-30 % (N p. 34); 22,5 % es el punto medio
  const vas = s.hsa ? bump(s.dia) : 0;
  const rel = ppc / ppc0 * fo2;                                 // la recta del ictus: el flujo sigue a la presión (N p. 36)
  const flujo = ppc <= 0 ? 0 : 100 * rel * (1 - ILUS.vasoMax * vas);
  const dtc = ppc <= 0 ? null : ILUS.dtc0 * rel * (1 + ILUS.dtcVaso * vas);
  const vivos = ILUS.anillos.filter((t) => flujo >= t).length;
  const gcs = s.hsa ? 14 - (vas > 0 ? 2 : 0) : null;
  return { picEf, ppc, pas, pad, sat, flujo, dtc, vivos, vas, gcs, me: ppc <= 0 };
}
// topes: cada uno con consecuencia clínica y origen. n: 'sello' apaga lo de `off`; 'aviso' avisa; tono 'ok' = objetivo cumplido
export function topes(s, L) {
  const t = [], pas = Math.round(L.pas), pad = Math.round(L.pad);
  const pasaTpa = pas > U.pasTpa || pad > U.padTpa;
  if (!s.tpa && !s.hsa && s.pam < s.pam0 && pas <= U.pasSin && pad <= 120) t.push({ c: 'pasin', n: 'sello', titulo: 'Penumbra sin ganar nada', texto: 'Sin trombólisis solo se baja la PA por encima de 220/120 y sin pasar del 15 % en 24 h: antes, bajarla quita presión al flujo de la penumbra y no mejoró el pronóstico.', pag: '36', origen: 'ficha · p. 36', off: ['#b-baja', '#b-nitro'] });
  if (!s.tpa && !s.hsa && (pas > U.pasSin || pad > 120)) t.push({ c: 'pa220', n: 'aviso', titulo: 'Ya se puede bajar', texto: 'PA >220/120: bajarla, sin pasar del 15 % en 24 h.', pag: '36', origen: 'ficha · p. 36' });
  if (s.tpa && pasaTpa) t.push({ c: 'tpapa', n: 'sello', titulo: 'Riesgo de hemorragia', texto: `Tras la trombólisis la PA debe estar por debajo de 180/105 durante 24 h: con ${pas}/${pad} el riesgo de hemorragia es de 6,4-8,8 % (Fig. 47.2).`, pag: '39', origen: 'ficha · p. 36, 39', off: ['#b-sube'] });
  if (s.tpa && !pasaTpa && s.pam >= U.pamMin) t.push({ c: 'tpaok', n: 'sello', tono: 'ok', titulo: 'PA <180/105', texto: 'Objetivo tras la trombólisis, 24 h.', pag: '36', origen: 'ficha · p. 36' });
  if (s.pam < U.pamMin) t.push({ c: 'pam65', n: 'sello', titulo: 'Corregir ya', texto: `PAM ${Math.round(s.pam)}: con la autorregulación rota el flujo cae con la presión; Marino apunta a PAM >65 con líquidos y vasopresor.`, pag: '37', origen: 'ficha · p. 37', off: ['#b-baja', '#b-nitro'] });
  if (s.fio2 > 21 && L.sat > U.sat) t.push({ c: 'sat94', n: 'sello', titulo: 'Oxígeno de más', texto: `SaO₂ ${L.sat} %: por encima de 94 % hay peor resultado neurológico y el O₂ al ${s.fio2} % encoge los vasos cerebrales (el flujo cae 15-30 % al 100 %). El autor prefiere 90-92 %.`, pag: '35', origen: 'ficha · p. 34-35', off: ['[data-fio="30"]', '[data-fio="60"]', '[data-fio="100"]'] });
  if (s.nitro) t.push({ c: 'nitro', n: 'sello', titulo: 'Nitroprusiato: evitar', texto: 'Sube la PIC: la PPC baja justo donde la penumbra la necesita.', pag: '36', origen: 'ficha p. 36 (evitar); el porqué: inferencia; subida ilustrativa', off: ['#b-nitro'] });
  if (s.vpp && !L.me) t.push({ c: 'vpp', n: 'aviso', titulo: 'Presión positiva', texto: 'Puede subir la PIC y bajar la PPC: evitarla si no hace falta.', pag: '35:mn-isq-vm', origen: 'ficha · p. 35; subida ilustrativa' });
  if (L.me) t.push({ c: 'me', n: 'sello', titulo: 'PIC = PAM · sin flujo', texto: 'PPC 0: no entra sangre, no hay señal de Doppler. Es el cuadro de la muerte encefálica, que se confirma con exploración y apnea, no con el monitor.', pag: '14', origen: 'PPC: ficha · p. 45; cuadro: p. 14-16', off: ['#b-picu', '#b-picx', '#b-baja', '#b-nitro'] });
  else if (L.ppc < U.ppcMin) t.push({ c: 'ppc50', n: 'sello', titulo: 'PPC <50 · a evitar', texto: `PPC ${Math.round(L.ppc)}: por debajo de 50 el flujo no basta (Manual UMI); en la hemorragia Marino da 50-70 (no da objetivo en el ictus isquémico).`, pag: '45', origen: 'Manual UMI + ficha · p. 45', off: ['#b-baja', '#b-nitro'] });
  if (!L.me && L.picEf >= U.pic) t.push({ c: 'pic20', n: 'aviso', titulo: 'PIC ≥20', texto: 'Mantenerla por debajo de 20 (drenando LCR; en el ictus, salino hipertónico en bolos).', pag: '45', origen: 'ficha · p. 45; hipertónico p. 41' });
  if (s.glu > U.glu[1]) t.push({ c: 'gluA', n: 'aviso', titulo: 'Glucosa >180', texto: 'Tratar con insulina; objetivo 140-180. La hiperglucemia empeora la recuperación.', pag: '37:mn-isq-glucemia', origen: 'ficha · p. 37' });
  if (s.glu < U.gluBaja) t.push({ c: 'gluB', n: 'sello', titulo: 'Hipoglucemia', texto: 'Un control más estricto que 140-180 arriesga hipoglucemia (Marino): el cerebro isquémico no tolera quedarse sin glucosa.', pag: '37:mn-isq-glucemia', origen: 'ficha · p. 37; 70 mg/dL: fisiología general', off: ['#b-ins'] });
  if (s.dex) t.push({ c: 'dex', n: 'aviso', titulo: 'Sin glucosados', texto: 'Marino aconseja evitar los sueros glucosados en el ictus.', pag: '37:mn-isq-glucemia', origen: 'ficha · p. 37' });
  if (s.glu >= ILUS.gluMax) t.push({ c: 'gluM', n: 'sello', titulo: 'Tope del modelo', texto: 'No se simulan glucemias de 400 o más: ya habría que tratar mucho antes.', pag: '37:mn-isq-glucemia', origen: 'ilustrativo', off: ['#b-glu'] });
  if (s.temp >= ILUS.tMax) t.push({ c: 'tMax', n: 'sello', titulo: 'Fiebre extrema', texto: 'Tope del modelo: con fiebre así hay que bajarla y buscar infección sin demora.', pag: '37:mn-isq-fiebre', origen: 'ilustrativo; fisiología general', off: ['#b-fiebre'] });
  else if (s.temp >= U.febril) t.push({ c: 'fiebre', n: 'aviso', titulo: 'Fiebre', texto: 'Presente en el 60 % de los ictus: buscar infección y bajarla; el frío sistemático (TTM) no mejora.', pag: '37:mn-isq-fiebre', origen: 'ficha · p. 37; 38 °C: fisiología general' });
  if (s.hsa && s.dia >= 4 && s.dia <= 14) t.push({ c: 'dci', n: 'aviso', titulo: 'Isquemia diferida', texto: 'Días 4-14: la velocidad del Doppler sube con el vasoespasmo y la GCS puede caer 2 puntos.', pag: '48', origen: 'ficha · p. 48; velocidades ilustrativas' });
  if (s.hsa && s.dia >= 21) t.push({ c: 'dia21', n: 'aviso', titulo: 'Fin del nimodipino', texto: 'El nimodipino oral, 60 mg cada 4 h, se mantiene 3 semanas.', pag: '48:mn-hsa-nimodipino', origen: 'ficha · p. 48', off: ['#b-dia-mas'] });
  return L.me ? t.filter((x) => x.c === 'me') : t;
}
