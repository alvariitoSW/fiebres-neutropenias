// mv-eco-2a5 P1: e′ desde la dinámica del VI (motor.ultimo.ePrima) y E de la onda fusionada (doppler.medidasLatido).
// Fuentes: Nagueh 2025 (docs/nagueh-2025-funcion-diastolica-hfpef-ase.pdf): e′ septal y lateral 3-4 cm/s en el grado 3 avanzado
// (PDF 25); E/e′ medio normal 4,0-11,5 a 40-60 años y 5,2-14,0 a 60-80 (Tabla 5, p. 551 / PDF 15).
import test from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { medirForma } from './medir-forma.mjs';

test('e′ del motor · normal: septal 9-10,5 y lateral 11-13 cm/s', () => {
  const m = crearMotor(); m.correr(12);
  const p = m.ultimo.ePrima;
  assert.ok(p.sep >= 9 && p.sep <= 10.5, `septal ${p.sep.toFixed(1)}`);
  assert.ok(p.lat >= 11 && p.lat <= 13, `lateral ${p.lat.toFixed(1)}`);
  assert.ok(Math.abs(p.sep / p.lat - 0.8) < 1e-9, 'el septal conserva el 0,8 del lateral (SEPTAL del atlas)');
});

test('e′ del motor · fallo VI al 100 %: septal 3-4 cm/s (Nagueh 2025, PDF 25)', async () => {
  const { ESCENARIOS, ASENTAR_FORMA } = await import('../escenarios.mjs');
  const m = crearMotor(); m.correr(12); ESCENARIOS.fallo.aplicar(m, 1); m.correr(ESCENARIOS.fallo.forma ? ASENTAR_FORMA : 40);
  const p = m.ultimo.ePrima;
  assert.ok(p.sep >= 3 && p.sep <= 4, `septal ${p.sep.toFixed(2)}`);
});

test('TEP 0 / def / 0,5 / 0,9 / 0,95 / 1 · E/e′ posible (4-15), con la e′ del motor y con la de hoy', async () => {
  const { ESCENARIOS, ASENTAR_FORMA } = await import('../escenarios.mjs');
  for (const g of [0, 'def', 0.5, 0.9, 0.95, 1]) {
    const h = medirForma('tep', g);
    const m = crearMotor(); m.correr(12); if (g !== 0) { if (g === 'def') ESCENARIOS.tep.aplicar(m); else ESCENARIOS.tep.aplicar(m, g); } m.correr(ESCENARIOS.tep.forma ? ASENTAR_FORMA : 40);
    const eeMotor = h.E / m.ultimo.ePrima.avg;
    for (const [n, v] of [['de hoy', h.eE], ['del motor', eeMotor]]) assert.ok(v >= 4 && v <= 15, `TEP ${g}: E/e′ ${n} = ${v.toFixed(1)} (E ${h.E.toFixed(0)})`);
  }
});
