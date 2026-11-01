// M1 paso 6 · mide la forma de pVD−pAD en la ventana del chorro de IT (pVD>pAD en la sístole) en los 6 escenarios + FEVD, TAPSE, TA pulmonar.
//   node autonomo/bloques/mv-eco/herramientas/m1-chorro.mjs ['{"hp":{"fSubidaVd":.5},"normal":{...}}']   (ajustes opcionales, tras aplicar el escenario)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { contratoDe } from '../../../../js/modules/eco/contrato.mjs';
export const CASOS = [['normal'], ['hpcronica', 0.6], ['hpcronica', 0.8], ['hpcronica', 1], ['tep', 0.5], ['tep', 1]];
export function chorro(m) {
  // ventana del chorro de IT = la racha más larga de muestras seguidas con pVD>pAD (la sístole del VD, aunque dure más que la del VI)
  let ab = [], cur = []; for (const s of m.onda) { if (s.pvd > s.pad) cur.push(s); else { if (cur.length > ab.length) ab = cur; cur = []; } } if (cur.length > ab.length) ab = cur;
  const t0 = ab[0].t, t1 = ab[ab.length - 1].t, ser = ab.map(s => [(s.t - t0) / (t1 - t0), s.pvd - s.pad]), mx = Math.max(...ser.map(q => q[1]));
  const en = (x) => ser.reduce((a, q) => Math.abs(q[0] - x) < Math.abs(a[0] - x) ? q : a)[1] / mx;
  return { mx, pos: ser.find(q => q[1] === mx)[0], r25: en(0.25), r75: en(0.75), dur: t1 - t0 };
}
export function medir(k, g, aj = {}) {
  const m = crearMotor(); m.correr(12); if (k !== 'normal') ESCENARIOS[k].aplicar(m, g);
  const a = aj[k === 'normal' ? 'normal' : k === 'tep' ? 'tep' : 'hp'];
  if (a) { for (const [n, v] of Object.entries(a)) { if (n === 'eesVd') m.p.vd.ees *= v; else if (n === 'durVdX') m.p.durVd *= v; else m.p[n] = v; } }
  m.correr(ASENTAR_FORMA); m.correr(5);
  const c = chorro(m), L = contratoDe(m).latido;
  return { k, g, pos: c.pos, r25: c.r25, r75: c.r75, vIT: Math.sqrt(c.mx / 4), psap: L.paps, fevd: L.feVd, tapse: L.tapse, ta: L['tiempos.tap'] };
}
if (process.argv[1].endsWith('m1-chorro.mjs')) {
  const aj = process.argv[2] ? JSON.parse(process.argv[2]) : {};
  for (const [k, g] of CASOS) { const r = medir(k, g, aj);
    console.log(`${k.padEnd(9)} g=${String(g ?? '-').padEnd(3)} pico ${(100 * r.pos).toFixed(0).padStart(3)}% r25 ${r.r25.toFixed(2)} r75 ${r.r75.toFixed(2)} vIT ${r.vIT.toFixed(2)} PSAP ${r.psap?.toFixed(0)} FEVD ${r.fevd?.toFixed(1)} TAPSE ${r.tapse?.toFixed(1)} TA ${r.ta?.toFixed?.(0)}`); }
}
