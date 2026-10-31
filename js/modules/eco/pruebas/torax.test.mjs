// E3 · la presión positiva del tórax (pTorax = CPAP/PEEP, cmH₂O) y el volumen sistólico. Medido con
// autonomo/bloques/b3/herramientas/e3-cpap.mjs. Fuentes: Jellinek 2000 (PMID 10710387; normal, 15 cmH₂O → VS −23 ± 22 %);
// Bradley 1992 (PMID 1736745; PCP ≥12 y CPAP 5 → +22 % del VS indexado; PCP <12, IC 3,14 → 2,89); Marino resp. cap. 26, pdf 87-88.
import test from 'node:test';
import assert from 'node:assert/strict';
const S = await import('../../libros/shock-vivo/soporte.mjs');
const medir = (rec, cpap) => { const c = S.crearCabecera(rec); c.ajustar({ cpap }); c.correr(40); return c.lectura; };
const NORMAL = { esc: 'normal', hb: 14 }, SECO = { esc: 'hemorragia', g: 0.2, hb: 13.8 };
const RAMIRO = (g) => ({ ...S.RECETA_IC, g });

test('normal: 15 cmH₂O bajan el VS un 23 ± 5 % (Jellinek 2000)', () => {
  const d = 100 * (medir(NORMAL, 15).u.vs / medir(NORMAL, 0).u.vs - 1);
  assert.ok(d > -28 && d < -18, `dVS = ${d.toFixed(1)} %`);
});
test('pTorax 0: cifras idénticas a no usar el mando', () => {
  const a = medir(NORMAL, 0), c = S.crearCabecera(NORMAL); c.correr(40);
  assert.equal(a.u.vs, c.lectura.u.vs); assert.equal(a.gcTotal, c.lectura.gcTotal); assert.equal(a.u.pTorax, 0);
});
test('PCP <12 (paciente seco): la CPAP 5 baja el VS y el gasto (Bradley 1992, IC 3,14 → 2,89)', () => {
  const a = medir(SECO, 0), b = medir(SECO, 5);
  assert.ok(a.u.pvp < 12 && b.u.vs < a.u.vs && b.gcTotal < a.gcTotal);
});
test('PCP ≥12 (Ramiro): la CPAP 5 no baja el VS más de un 3 % y el gasto cae menos que en el normal', () => {
  for (const g of [0.25, 0.5, 1]) {
    const a = medir(RAMIRO(g), 0), b = medir(RAMIRO(g), 5), n = medir(NORMAL, 0), n5 = medir(NORMAL, 5);
    assert.ok(a.u.pvp >= 12);
    assert.ok(b.u.vs / a.u.vs > 0.97, `g ${g}`);
    assert.ok(b.gcTotal / a.gcTotal > n5.gcTotal / n.gcTotal, `g ${g}`);
  }
});
// Bradley 1992 (PMID 1736745): con PCP ≥12 y CPAP 5 el VS indexado sube (+22 %; con PCP <12 baja). El motor lo da por el alivio
// de la poscarga en la eyección (motor.mjs, alivioEyeccion): crece cuanto más baja la Ees del VI. Ramiro g=1 (Ees 0,17 de la normal)
test('PCP ≥12 con CPAP 5: el VS sube (Bradley 1992)', () => {
  const a = medir(RAMIRO(1), 0), b = medir(RAMIRO(1), 5);
  assert.ok(a.u.pvp >= 12 && b.u.pvp >= 12);
  const d = b.u.vs / a.u.vs - 1;
  assert.ok(d > 0.08 && d < 0.30, `dVS ${(100 * d).toFixed(1)} %`);
});
test('VI con Ees moderada (PCP ≥12): el VS no cae más de un 3 % con CPAP 5', () => {
  const a = medir(RAMIRO(0.5), 0), b = medir(RAMIRO(0.5), 5);
  assert.ok(b.u.vs / a.u.vs > 0.97);
});
test('VI normal (Ees normal): el alivio no actúa, el VS baja con CPAP 15 como en Jellinek', () => {
  const a = medir({ esc: 'normal', hb: 14 }, 0), b = medir({ esc: 'normal', hb: 14 }, 15);
  const d = b.u.vs / a.u.vs - 1;
  assert.ok(d < -0.18 && d > -0.28, `dVS ${(100 * d).toFixed(1)} %`);
});
test('PaO₂ (soporte.mjs, perfusion): depende de pvp − pTorax, no del pTorax solo', () => {
  const a = medir(RAMIRO(1), 0), b = medir(RAMIRO(1), 10);
  assert.ok(b.u.pvp - b.u.pTorax <= a.u.pvp + 0.01 + 0, `transmural ${(b.u.pvp - b.u.pTorax).toFixed(1)} vs ${a.u.pvp.toFixed(1)}`);
});

// El alivio de la poscarga satura (motor.mjs, alivioEyeccion): ni la CPAP ni el aire a tensión pueden subir el VS por encima de
// 1,4 × el basal, y con presión pleural alta (≥ 20 cmH₂O) el taponamiento manda: VS y gasto por debajo del basal.
const medirP = (rec, aj) => { const c = S.crearCabecera(rec); c.ajustar(aj); c.correr(40); return c.lectura; };
test('el VS nunca pasa de 1,4 × basal con pleura 0-30 ni con CPAP 0-20 (Ramiro g=1 y normal)', () => {
  for (const rec of [RAMIRO(1), NORMAL]) {
    const b = medirP(rec, {}).u.vs;
    for (const pleura of [0, 5, 10, 15, 20, 25, 30]) assert.ok(medirP(rec, { pleura }).u.vs <= 1.4 * b, `pleura ${pleura}`);
    for (const cpap of [0, 5, 10, 15, 20]) assert.ok(medirP(rec, { cpap }).u.vs <= 1.4 * b, `cpap ${cpap}`);
  }
});
test('pleura ≥ 20: VS y gasto bajo el basal en Ramiro g=1 y en el normal', () => {
  for (const rec of [RAMIRO(1), NORMAL]) {
    const b = medirP(rec, {});
    for (const pleura of [20, 25, 30]) { const a = medirP(rec, { pleura }); assert.ok(a.u.vs < b.u.vs && a.gcTotal < b.gcTotal, `pleura ${pleura}`); }
  }
});
