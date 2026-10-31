// P2 (mv-eco-2a5): septoSigno continuo (0…+1) y septoFase del contrato, calculados del motor. El septo de hoy no se toca.
// Fuente de la fase: ESC/ERS 2022 Tabla 10, PDF p. 28 (impresa 3645): «flattening of the interventricular septum (LVEI >1,1 in systole and/or diastole)».
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { contratoDe, CAMPOS } from '../contrato.mjs';

const cache = new Map();
const caso = (k, g = 'def') => {
  const c = k + g;
  if (!cache.has(c)) {
    const m = crearMotor(); m.correr(12);
    if (k !== 'normal') { if (g === 'def') ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
    const ct = contratoDe(m);
    const s = ct.instantes.map(i => i.septoSigno);
    cache.set(c, { max: Math.max(...s), min: Math.min(...s), fase: ct.latido.septoFase, ct });
  }
  return cache.get(c);
};

test('campos registrados con origen motor', () => {
  assert.equal(CAMPOS.septoSigno.origen, 'motor'); assert.equal(CAMPOS.septoFase.origen, 'motor');
});
test('normal: septoSigno < 0,3 y sin fase', () => {
  const n = caso('normal'); assert.ok(n.max < 0.3, n.max); assert.equal(n.fase, null);
});
test('sin valores fuera de 0…1', () => {
  for (const [k, g] of [['normal'], ['tep'], ['hpcronica'], ['fallo']]) { const r = caso(k, g); assert.ok(r.min >= 0 && r.max <= 1, k); }
});
test('TEP y HP crónica por defecto: > 0,5 con fase sístole, diástole o ambas', () => {
  for (const k of ['tep', 'hpcronica']) { const r = caso(k); assert.ok(r.max > 0.5, k + ' ' + r.max); assert.ok(['sistole', 'diastole', 'ambas'].includes(r.fase), k + ' ' + r.fase); }
  assert.equal(caso('hpcronica').fase, 'ambas');
});
test('TEP crece de forma continua con g (0; 0,25; 0,5; 0,75; 1), sin salto 0 → 1', () => {
  const v = [0, 0.25, 0.5, 0.75, 1].map(g => caso('tep', g).max);
  for (let i = 1; i < v.length; i++) { assert.ok(v[i] > v[i - 1], 'no crece: ' + v.join(' ')); assert.ok(v[i] - v[i - 1] < 0.35, 'salto: ' + v.join(' ')); }
  assert.ok(v[0] < 0.3 && v[4] > 0.5);
});
test('hemorragia, vasoplejia, fallo del VI y derrame: como el normal o menos', () => {
  for (const [k, g] of [['hemorragia', 1], ['vasoplejia', 'def'], ['fallo', 'def'], ['derrame', 1]]) { const r = caso(k, g); assert.ok(r.max < 0.3, k + ' ' + r.max); assert.equal(r.fase, null); }
});
