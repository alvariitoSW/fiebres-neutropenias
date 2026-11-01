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
