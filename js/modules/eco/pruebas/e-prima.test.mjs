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

test('e′ del motor · fallo VI: septal 3-4 cm/s con el defecto, ≥2 al 100 %; E/e′ >14; el VI sigue dilatado y mayor que el VD', async () => {
  // P6b: al 100 % el llenado es restrictivo (PCP ~34): E/e′ medio >14 (Tabla 7, p. 557). Con FEVI ~11 % el motor da e′ septal ~2,2 y E ~50 cm/s,
  // por debajo de los 3-4 cm/s (p. 561) y de E 70 de P6: ese P6 subía la rigidez del VI, lo achicaba (VTD 96 mL) y dilataba el VD (196 mL):
  // un patrón de fallo derecho. Un shock cardiogénico izquierdo manda: VTD del VI ≥ el del defecto y VD/VI en volumen <1.
  const { ESCENARIOS } = await import('../escenarios.mjs');
  const hDef = medirForma('fallo', 'def');
  for (const g of ['def', 1]) {
    const m = crearMotor(); m.correr(12); if (g === 'def') ESCENARIOS.fallo.aplicar(m); else ESCENARIOS.fallo.aplicar(m, g); m.correr(40);
    const p = m.ultimo.ePrima, h = medirForma('fallo', g);
    assert.ok(p.sep >= (g === 1 ? 2 : 3) && p.sep <= 4, `fallo ${g}: septal ${p.sep.toFixed(2)}`);
    assert.ok(h.eE > 14, `fallo ${g}: E/e′ ${h.eE.toFixed(1)}`);
    if (g === 1) {
      assert.ok(h.E >= 45, `fallo 100 %: E ${h.E.toFixed(0)} cm/s`);
      assert.ok(m.ultimo.pam >= 50 && m.ultimo.pam <= 65 && m.ultimo.gc <= 2.7 && m.ultimo.pcp > 18, 'PAM 50-65, GC ≤2,7, PCP >18');
      assert.ok(h.viTd >= hDef.viTd, `VTD del VI al 100 % (${h.viTd.toFixed(0)}) ≥ el del defecto (${hDef.viTd.toFixed(0)})`);
      assert.ok(h.vdTd / h.viTd < 1, `VD/VI en volumen ${(h.vdTd / h.viTd).toFixed(2)} <1`);
    }
  }
});

test('e′ del motor · la vasoplejia y la hemorragia no pasan de 16 cm/s lateral (normal de un adulto)', async () => {
  const { ESCENARIOS, ASENTAR_FORMA } = await import('../escenarios.mjs');
  for (const [k, g] of [['vasoplejia'], ['hemorragia', 'def'], ['hemorragia', 1]]) {
    const m = crearMotor(); m.correr(12); if (g === undefined || g === 'def') ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
    assert.ok(m.ultimo.ePrima.lat <= 16, `${k} ${g ?? ''}: lateral ${m.ultimo.ePrima.lat.toFixed(1)}`);
  }
});

test('e′ del motor · la presión de la AI no la sube: dilatada e hipertrofia con e′ septal ≤6 pese a PCP alta', async () => {
  const { ESCENARIOS, ASENTAR_FORMA } = await import('../escenarios.mjs');
  for (const [k, g] of [['dilatada'], ['hipertrofia', 1]]) {
    const m = crearMotor(); m.correr(12); if (g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40);
    assert.ok(m.ultimo.pcp > 15 && m.ultimo.ePrima.sep <= 6, `${k}: PCP ${m.ultimo.pcp.toFixed(0)}, septal ${m.ultimo.ePrima.sep.toFixed(1)}`);
  }
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
