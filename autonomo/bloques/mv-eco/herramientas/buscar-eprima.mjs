// mv-eco-2a5 P1b: búsqueda de constantes de la e′ del motor contra las bandas J1 (sin tocar la app).
// Uso: node autonomo/bloques/mv-eco/herramientas/buscar-eprima.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { medirForma } from '../../../../js/modules/eco/pruebas/medir-forma.mjs';
import { BANDAS } from '../../../../js/modules/eco/pruebas/bandas-paciente.mjs';
const filas = [];
for (const k of Object.keys(ESCENARIOS)) {
  const pts = ESCENARIOS[k].gravedad ? [0, 'def', 0.5, 0.9, 0.95, 1] : [undefined];
  for (const g of pts) {
    const m = crearMotor(); m.correr(12);
    if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
    const u = m.ultimo, h = medirForma(k, g === 'def' ? undefined : g);
    filas.push({ id: g === undefined ? k : `${k}:${g}`, tasa: u.ePrima.tasa, rel: m.p.relajacion, fe: u.fe, pcp: u.pcp, E: h.E, fus: h.fusion });
  }
}
export const FILAS = filas;
export function evalua(modelo) {
  const mal = [];
  for (const f of filas) {
    const lat = Math.min(1e9, modelo(f)), sep = 0.8 * lat, avg = 0.9 * lat, eE = f.E / avg, r = { eSep: sep, eLat: lat, eAvg: avg, eE };
    const bs = BANDAS[f.id] || [];
    for (const b of bs) { if (!(b.medida in r) || b.diagnostico) continue; const v = r[b.medida]; if (!(v >= b.min && v <= b.max)) mal.push(`${f.id} ${b.medida} ${v.toFixed(1)}∉[${b.min},${b.max}]`); }
    if (!f.fus && !(eE >= 4)) mal.push(`${f.id} eE ${eE.toFixed(1)}<4`);
    if (eE > 15 && !f.fus && f.id.startsWith('tep')) mal.push(`${f.id} eE ${eE.toFixed(1)}>15`);
    if (f.id.startsWith('tep') && !(eE >= 4 && eE <= 15)) mal.push(`${f.id} E/e′ ${eE.toFixed(1)} fuera 4-15`);
    if ((f.id === 'vasoplejia' || f.id.startsWith('hemorragia') || f.id.startsWith('normal')) && lat > 16) mal.push(`${f.id} lat ${lat.toFixed(1)}>16`);
    if (f.id === 'normal' && !(sep >= 9 && sep <= 10.5 && lat >= 11 && lat <= 13)) mal.push(`normal ${sep.toFixed(1)}/${lat.toFixed(1)}`);
    if (f.id === 'fallo:def' && !(sep >= 3 && sep <= 4)) mal.push(`fallo:def sep ${sep.toFixed(1)}`);
    if (f.id === 'fallo:1' && !(sep >= 2)) mal.push(`fallo:1 sep ${sep.toFixed(1)}`);
  }
  return mal;
}
if (process.argv[1].endsWith('buscar-eprima.mjs')) {
  console.log('id\ttasa\trel\tfe\tpcp\tE'); for (const f of filas) console.log([f.id, f.tasa.toFixed(2), f.rel.toFixed(2), f.fe.toFixed(2), f.pcp.toFixed(1), f.E.toFixed(0)].join('\t'));
  const res = [];
  for (const A of [0, 1.5]) for (const K of [1.4, 1.8, 2.2, 2.6, 3]) for (const a of [0.8, 1, 1.3]) for (const b of [-0.6, -0.3, 0, 0.3]) for (const c of [0.3, 0.6, 0.9, 1.2]) for (const d of [0, 1]) for (const pmin of [2, 8]) {
    const Lm = 16;
    const mod = (f) => { const x = A + K * Math.pow(f.tasa, a) * Math.pow(f.rel, b) / Math.pow(Math.max(f.pcp, pmin) / 8, c / Math.pow(f.rel, d)); return Lm * (1 - Math.exp(-x / Lm)); };
    const ff = filas.find(f => f.id === 'fallo:1'); res.push({ n: evalua(mod), dev: (A > 0) + (b !== 0) + (d !== 0) + (c > 0.6) * 0.5, A, K, a, b, c, d, pmin, Lm });
  }
  res.sort((x, y) => (x.n.length - y.n.length) || (x.dev - y.dev)); for (const r of res.slice(0, 8)) console.log(JSON.stringify(r));
}
