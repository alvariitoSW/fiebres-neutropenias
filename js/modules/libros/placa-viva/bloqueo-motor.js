// Motor del bloqueo neuromuscular: la lectura (leer) vive en bloqueo-base.js y las dosis en js/data/placa-viva-data.js;
// aquí solo se traduce el estado de B (un relajante, minutos desde la dosis) al de A.
// Inicios de la Tabla 46.7 (N p. 29): succinilcolina 1-1,5 min, rocuronio 1,5-3, cisatracurio 5-7. Neostigmina: tope 70 µg/kg, sin efecto con TOF 0 (N p. 31). Sugammadex 2/4/16 según profundidad (N p. 31).
import { nuevo as nuevoA, leer as leerA } from './bloqueo-base.js';
import { DOSIS, NEO } from '../../../data/placa-viva-data.js';
export { DOSIS, NEO, leerA };
const CLAVE = { succi: 'suc', roc: 'roc', cis: 'cis' };
export const neoEf = (s) => leerA(aA(s)).neoEf;
// Estado de B → estado de A. Dosis completa de cada relajante (1 / 1 / 0,15 mg/kg); la hora de la dosis es el minuto 0 de B.
export function aA(s) {
  const a = nuevoA('mel'); a.peso = s.peso; a.k0 = s.k; a.t = s.min; a.rec = 100; a.hielo = 0; a.via = !!s.via;
  if (s.rel) a[CLAVE[s.rel]] = { dosis: DOSIS[CLAVE[s.rel]].lleno, t0: 0 };
  a.neo = s.neo; a.neoOk = !!s.neoOk; a.neoT = s.neoT ?? 0;
  if (s.perf > 0 && s.rel !== 'succi') { a.perf = s.perf; a.perfT = s.perfT ?? 0; }
  if (s.sug > 0) a.sug = { dosis: s.sug, t0: s.sugT ?? 0, ok: !!s.sugOk };
  return a;
}
export const bloqueoDe = (s) => leerA(aA(s));
// Dosis de sugammadex que hace falta (N p. 31): 16 mg/kg si el rocuronio es de hace <3 min; 4 en bloqueo profundo (TOF 0); 2 en moderado.
export const sugNecesita = (s, tof) => (!s.rel || s.min < 3 ? 16 : tof === 0 ? 4 : 2);
// Estado de A para dibujar la hendidura: miastenia = 15 % de receptores (el preset de Serapio en A); fármaco y piridostigmina como en A.
export function aLupa(s) { const a = aA(s); if (s.est === 'miastenia') a.rec = 15; a.hielo = s.hielo || 0; a.emp = !!s.farm; a.piri = !!(s.piri && s.piriOk); return a; }
