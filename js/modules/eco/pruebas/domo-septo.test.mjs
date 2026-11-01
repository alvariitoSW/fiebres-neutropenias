// mv-eco-2a5 · paso 6, M1 y M2 · (1) la presión del VD y el gradiente VD−AD hacen domo en la eyección (Zoghbi 2017, Fig. 29, PDF p. 49);
// (2) el VI de la HP crónica es excéntrico (EI ≥ 1,1) también en sístole media (ESC/ERS 2022, Tabla 10, p. 3645: «sístole y/o diástole»;
// Ryan 1985: EI ≈ 1,0 en el normal; King 1983: el aplanamiento sistólico sigue a la presión relativa del VD).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { contornosVista } from './geometria-juez.mjs';

const montar = (k, g, ajustar) => { const m = crearMotor(); m.correr(12); if (k !== 'normal') ESCENARIOS[k].aplicar(m, g); ajustar?.(m); m.correr(ASENTAR_FORMA); m.correr(5); return m; };
// eyección = válvula pulmonar abierta; devuelve la forma de pVD−pAD y de pVD (% de la eyección, valores ÷ máximo)
export function forma(m) {
  const ab = m.onda.filter(s => s.vPul), t0 = ab[0].t, t1 = ab[ab.length - 1].t;
  const f = (sel) => { const ser = ab.map(s => [(s.t - t0) / (t1 - t0), sel(s)]), mx = Math.max(...ser.map(q => q[1]));
    const en = (x) => ser.reduce((a, q) => Math.abs(q[0] - x) < Math.abs(a[0] - x) ? q : a)[1] / mx;
    return { mx, pos: ser.find(q => q[1] === mx)[0], r25: en(0.25), r75: en(0.75) }; };
  return { grad: f(s => s.pvd - s.pad), pvd: f(s => s.pvd) };
}
const CASOS = [['normal', undefined], ['hpcronica', 0.6], ['hpcronica', 0.8], ['hpcronica', 1], ['tep', 1]];
for (const [k, g] of CASOS) test(`domo de pVD−pAD: ${k} g=${g ?? '-'}`, { todo: 'M1 pendiente: autonomo/bloques/mv-eco/paso6/m12-informe.md' }, () => {
  const { grad } = forma(montar(k, g));
  assert.ok(grad.pos >= 0.35 && grad.pos <= 0.65, `máximo al ${(100 * grad.pos).toFixed(0)} % de la eyección (35-65)`);
  assert.ok(grad.r25 <= 0.92 && grad.r75 <= 0.92, `r25 ${grad.r25.toFixed(2)} r75 ${grad.r75.toFixed(2)} (≤0,92)`);
});
// el máximo no cambia: vIT = √(gradiente/4) de la partida (M0), ±5 %; PSAP = máximo de pVD
test('M1 conserva el máximo (vIT ±5 % de la partida)', () => {
  const partida = { normal: 2.07, 'hpcronica1': 4.42, 'hpcronica0.6': 4.80, tep: 2.70 };
  for (const [k, g] of CASOS) { const { grad } = forma(montar(k, g)), v = Math.sqrt(grad.mx / 4), p = partida[k === 'hpcronica' ? k + g : k];
    if (p) assert.ok(Math.abs(v / p - 1) <= 0.05, `${k} ${g}: vIT ${v.toFixed(2)} vs ${p}`); }
});

// excentricidad del VI (eje corto, dibujo nuevo): max(x/y, y/x) del contorno endocárdico
function ei(m, t) {
  const o = m.onda, s = o.reduce((a, q) => Math.abs(q.t - t) < Math.abs(a.t - t) ? q : a), e = estadoGeo(s, extraDeMotor(m));
  const p = contornosVista('psaxPm', e, 'nuevo').viEndo?.cad?.flatMap(c => c.ps), ex = (j) => Math.max(...p.map(q => q[j])) - Math.min(...p.map(q => q[j])), a = ex(0) / ex(1);
  return Math.max(a, 1 / a);
}
const fases = (m) => { const u = m.ultimo, ds = u.tS2 - u.tS1; return { td: u.tS1 - 0.02, sm: u.tS1 + ds / 2, fs: u.tS2 - 0.01 }; };
for (const g of [0.6, 0.8, 1]) test(`EI del VI en la HP crónica g=${g}: ≥1,1 en sístole media (y en las otras fases)`, () => {
  const m = montar('hpcronica', g), f = fases(m);
  assert.ok(ei(m, f.sm) >= 1.1, `sístole media EI ${ei(m, f.sm).toFixed(2)}`);
  assert.ok(ei(m, f.td) >= 1.1 && ei(m, f.fs) >= 1.1, `td ${ei(m, f.td).toFixed(2)} fs ${ei(m, f.fs).toFixed(2)}`);
});
test('EI del VI normal ≈ 1,0 en las tres fases, también con FC 50 y 120', () => {
  for (const fc of [null, 50, 120]) { const m = montar('normal', undefined, fc ? (mm) => { mm.p.fc = fc; } : null), f = fases(m);
    for (const t of Object.values(f)) assert.ok(ei(m, t) <= 1.05, `FC ${fc}: EI ${ei(m, t).toFixed(2)}`); }
});
test('TEP g=1: el EI en sístole media no empeora (el normal es 1,0; el TEP agudo ya tiene D en diástole)', () => {
  const m = montar('tep', 1), f = fases(m); assert.ok(ei(m, f.sm) >= 1.0 && ei(m, f.td) >= 1.1);
});
