// P5f · Doppler continuo de la insuficiencia tricuspídea: vIT de Bernoulli y PSAP = 4v² + PVC frente al motor.
// Fuentes: ESC/ERS 2022 (vIT ≤ 2,8 m/s normal; > 3,4 m/s sugiere HP); Zoghbi 2017 Fig. 29 (envolvente redondeada, toda la sístole).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { curvaLatido, medidasLatido, velRegTricus } from '../doppler.mjs';

function it(k, g, eroa) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') ESCENARIOS[k].aplicar(m, g);
  m.p.eroaTricus = eroa; m.correr(k !== 'normal' && ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
  const f = { tipo: 'valvula', n: 'regTricus', factor: 1 }, pvc = m.ultimo.pvc;
  const curva = curvaLatido(m.onda, f, 1, {}, { eroaTricus: eroa });
  return { curva, med: medidasLatido(curva, f, { pvc }), pvdMax: Math.max(...m.onda.map(x => x.pvd)), m };
}

test('IT sin EROA: sin chorro (la IT trivial fisiológica no se pinta)', () => {
  const r = it('normal', undefined, 0);
  assert.ok(r.curva.every(c => c.v === 0)); assert.equal(velRegTricus({ qTriReg: 5 }, 0), 0);
});
test('normal con IT: vIT ≤ 2,8 m/s, PSAP = 4v²+PVC ±3 mmHg del motor', () => {
  const { med, pvdMax } = it('normal', undefined, 0.1);
  assert.ok(med.vIT > 0 && med.vIT <= 2.8, 'vIT ' + med.vIT);
  assert.ok(Math.abs(med.psap - pvdMax) <= 3, `psap ${med.psap} vs PVD ${pvdMax}`);
});
test('HP crónica g=1: vIT ≥ 3,4 m/s y PSAP coherente', () => {
  const { med, pvdMax } = it('hpcronica', 1, 0.1);
  assert.ok(med.vIT >= 3.4, 'vIT ' + med.vIT); assert.ok(Math.abs(med.psap - pvdMax) <= 3, `psap ${med.psap} vs ${pvdMax}`);
});
test('TEP g=1: vIT 2,8-3,5 m/s y PSAP < 60', () => {
  const { med, pvdMax } = it('tep', 1, 0.1);
  assert.ok(med.vIT <= 3.5 && med.psap < 60, `vIT ${med.vIT} psap ${med.psap}`); assert.ok(Math.abs(med.psap - pvdMax) <= 3);
});
test('envolvente sistólica redondeada, sin NaN', () => {
  const { curva, med } = it('hpcronica', 1, 0.1);
  assert.ok(curva.every(c => Number.isFinite(c.v)) && Object.values(med).every(v => v == null || typeof v === 'string' || Number.isFinite(v)));
  const pico = Math.max(...curva.map(c => c.v)), dt = curva[1].t - curva[0].t;
  const sist = curva.filter(c => c.v > 0.1 * pico).length * dt, T = curva.length * dt;
  assert.ok(sist > 0.25 * T && sist < 0.9 * T, 'duración sistólica ' + sist);
  const iP = curva.findIndex(c => c.v === pico); assert.ok(iP > 0 && curva[iP].v >= curva[iP - 1].v);
});

// D1 · CW de la IM: el haz lee el máximo del chorro (vena contracta) × cos θ, y la columna admite línea de base desplazada
import { fuenteEnMuestra, columnaEspectro, velRegMitral } from '../doppler.mjs';
test('IM CW: el factor es ±cos θ (no depende de dónde cae la muestra en el chorro) y la curva es lisa', () => {
  const dir = [0, 1, 0], pts = Array.from({ length: 9 }, (_, i) => [0, 5 + i, 0]), geom = [{ n: 'regMitral', c: [0, 0, 0], dir, a: 30, v0: 1, vTubo: 1, salida: false, libre: true }];
  for (const haz of [[0, 1, 0], [Math.sin(0.35), Math.cos(0.35), 0]]) {
    const f = fuenteEnMuestra(pts, haz, { geom, valvulas: [], vasos: [] });
    if (!f) continue;
    assert.equal(f.n, 'regMitral'); assert.ok(Math.abs(Math.abs(f.factor) - Math.abs(haz[1])) < 1e-9, 'factor ' + f.factor);
  }
  const m = crearMotor(); m.correr(12); ESCENARIOS.dilatada.aplicar(m, 1); m.correr(ASENTAR_FORMA); m.p.eroaMitral = 0.3; m.correr(40);
  const c = curvaLatido(m.onda, { n: 'regMitral', factor: -0.94 }, -0.94, {}, { eroaMitral: 0.3 }), v = c.map(x => Math.abs(x.v));
  const pico = Math.max(...v), salto = Math.max(...v.slice(1).map((x, i) => Math.abs(x - v[i])));
  assert.ok(pico > 0 && salto < 0.2 * pico, `salto ${salto} pico ${pico}`);
  assert.ok(Math.abs(pico - 0.94 * Math.max(...m.onda.map(s => velRegMitral(s, 0.3)))) < 1e-6);
});
test('columnaEspectro con línea de base arriba: el chorro negativo cae en su fila y no hay fila por encima de la base', () => {
  const col = columnaEspectro([-300], 100, 250, 1, 0.2), fila = (v) => Math.floor((0.2 - v / 500) * 100);
  assert.ok(col[3 * fila(-300)] > col[3 * fila(-100)] && col[3 * fila(-300)] > col[3 * fila(100)]);
  const centro = columnaEspectro([-100], 100, 250, 1), arr = columnaEspectro([-100], 100, 250, 1, 0.5); assert.deepEqual(centro, arr);
});
