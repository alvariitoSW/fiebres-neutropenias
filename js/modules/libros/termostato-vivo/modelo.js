// Lectura del estado: el paso fija la temperatura (no hay mando continuo de T) y el tratamiento/«¿y si…?» la modifican.
import { ESTADOS, YSI } from '../../../data/termostato-vivo-data.js';
import { leerLibre, topesLibre } from './libre.js';
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const fmt = (v, d = 1) => (v == null ? '—' : v.toFixed(d).replace('.', ','));
export const nuevo = () => ({ est: 'fiebre', paso: 1, trat: 0, ysi: null });
export function leer(s) {
  const E = ESTADOS[s.est], P = E.pasos[s.paso - 1];
  if (s.est === 'juega') return { ...P, ...leerLibre(s.j), nombre: E.nombre, pac: s.j.pac || E.pac, tratado: false };
  const l = { cap: 1, esc: 0, sud: 0, rig: 0, ca: 0, clon: 0, ...P, ...(s.trat ? P.con : {}) };
  if (s.ysi === 'fiebre') { l.esc = 1; l.cap = 0; }            // manta: vasoconstricción y escalofrío (p. 72)
  l.nombre = E.nombre; l.pac = E.pac; l.tratado = !!(s.trat && P.con);
  return l;
}
const fv = (s, k) => (s.ysi === k);
export function topes(s, l) {
  if (s.est === 'juega') return topesLibre(s.j, l);
  const t = [], E = s.est, p = s.paso;
  if (s.ysi) { const y = YSI[s.ysi]; t.push({ c: 'ysi', n: 'sello', titulo: y.t, texto: y.x, pag: y.c, origen: y.o + '; las cifras del paciente son ilustrativas', off: ['#tmv-m-trat'] }); }
  if (E === 'golpe' && !s.ysi && l.T >= 41) t.push({ c: 'golpe', n: 'sello', titulo: 'Golpe de calor', texto: `T ${fmt(l.T)} °C, sin sudor, PA ${l.pa}, FC ${l.fc}: el cerebro falla. Enfriar ya, hasta 38 °C.`, pag: '46|ma-calor-golpe', origen: 'umbral ≥41 °C: ficha p. 46-47; PA y FC ilustrativas', bajo: '#tmv-m-trat' });
  if (E === 'golpe' && l.tratado && l.T <= 38.5) t.push({ c: 'para38', n: 'aviso', titulo: 'Parar a 38 °C', texto: 'Al llegar a unos 38 °C se deja de enfriar: más frío provoca escalofrío y la temperatura vuelve a subir. A 0,3 °C/min, de 41,6 a 38,2 son unos 11 min.', pag: '47|ma-calor-golpe', origen: 'ficha · p. 47; minutos: cuenta del modelo', bajo: '#tmv-m-trat' });
  if (E === 'hm' && !s.ysi && p === 3) t.push({ c: 'co2', n: 'aviso', titulo: 'CO₂ espirado: primer signo', texto: `CO₂ ${l.co2} mmHg y masetero rígido con T ${fmt(l.T)} °C: suspender el halogenado y dar dantroleno antes de que llegue la fiebre.`, pag: '49|ma-hm-clinica', origen: 'ficha · p. 49; cifras ilustrativas', bajo: '#tmv-m-trat' });
  if (E === 'hm' && !s.ysi && p >= 4 && !l.tratado) t.push({ c: 'hm', n: 'sello', titulo: 'Hipertermia maligna: T >40 °C', texto: `T ${fmt(l.T)} °C, K⁺ ${fmt(l.k)}, CK ${l.ck.toLocaleString('es')}, FC ${l.fc}: rabdomiólisis y riesgo renal. Dantroleno hasta 10 mg/kg.`, pag: '49|ma-hm-clinica', origen: 'ficha · p. 48-49; K⁺ y CK ilustrativos', bajo: '#tmv-m-trat' });
  if (E === 'snm' && !s.ysi && p === 4) t.push({ c: 'ck', n: 'aviso', titulo: 'CK >1.000 U/L', texto: `CK ${l.ck.toLocaleString('es')} con rigidez: SNM, no una distonía (que solo la eleva algo). Fluidos para la rabdomiólisis.`, pag: '50|ma-snm-clinica', origen: 'ficha · p. 50; CK ilustrativa', bajo: '#tmv-m-trat' });
  if (E === 'ss' && !s.ysi && p === 4) t.push({ c: 'ss60', n: 'aviso', titulo: 'Temperatura normal no descarta el SS', texto: 'La temperatura alta solo está en el 60 %: manda el clonus (ocular, el más fiable), la hiperreflexia y las mioclonías.', pag: '52|ma-ss-claves', origen: 'ficha · p. 52', bajo: '#tmv-m-trat' });
  if (E === 'fiebre' && l.tratado) t.push({ c: 'pcm', n: 'aviso', titulo: 'Paracetamol: 3 g o 4 g al día', texto: '1 g/8 h IV = 3 g/día, el máximo en el cap. 44 (p. 72); el cap. 6 admite 4 g/día. Contraindicado en insuficiencia hepática.', pag: '72|ma-antipireticos', origen: 'ficha · p. 72 y cap. 6 (las fuentes discrepan)', bajo: '#tmv-m-trat' });
  if (E === 'fiebre' && !s.ysi && !l.tratado && p === 5) t.push({ c: 'sepsis', n: 'aviso', titulo: 'Antipirético: no de rutina', texto: 'Dorotea tiene un shock séptico a 39,6 °C: la fiebre protege. Se baja con lesión cerebral isquémica (p. ej. tras una parada).', pag: '71|ma-antipireticos', origen: 'ficha · p. 71-72', bajo: '#tmv-m-trat' });
  if (E === 'hipo' && !s.ysi && p === 3) t.push({ c: 'fv', n: 'sello', titulo: 'Menos de 28 °C: fibrilación ventricular', texto: `T ${fmt(l.T)} °C, FC ${l.fc}, PA ${l.pa}, K⁺ ${fmt(l.k)}: coma, pupilas fijas, sin escalofrío. El corazón frío fibrila con cualquier estímulo.`, pag: '54|ma-hipo-grados', origen: 'ficha · p. 54-56; cifras de Honorato ilustrativas' });
  if (E === 'hipo' && !s.ysi && p >= 4 && !l.tratado) t.push({ c: 'asist', n: 'sello', titulo: 'No declarar la muerte: recalentar', texto: 'Por debajo de 24 °C son esperables la apnea y la asistolia: no se declara la muerte sin haber recalentado al paciente.', pag: '54|ma-hipo-grados', origen: 'ficha · p. 54', bajo: '#tmv-m-trat' });
  if (E === 'hipo' && l.tratado) t.push({ c: 'gases', n: 'aviso', titulo: 'Gases calientes: +2,5 °C/h', texto: 'Los gases a 40-45 °C suben 2,5 °C/h; los fluidos calientes no recalientan. Si hay parada, ECMO VA.', pag: '56|ma-hipo-externo', origen: 'ficha · p. 56-57', bajo: '#tmv-m-trat' });
  return t;
}
