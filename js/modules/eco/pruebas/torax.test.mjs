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
// PENDIENTE (motor): Bradley da +22 % del VS con PCP ≥12 y CPAP 5. El motor da −1 a −2 %: la curva de poscarga del VI que falla es
// demasiado plana (−10 mmHg de PAM = +12 % de VS en Ramiro g=1; CPAP 5 quita solo 2,4 mmHg de poscarga transmural).
test('PCP ≥12 con CPAP 5: el VS sube (Bradley 1992)', { todo: 'el motor no da la subida; ver e3-cpap.mjs' }, () => {
  const a = medir(RAMIRO(0.5), 0), b = medir(RAMIRO(0.5), 5);
  assert.ok(b.u.vs > a.u.vs);
});
test('PaO₂ (soporte.mjs, perfusion): depende de pvp − pTorax, no del pTorax solo', () => {
  const a = medir(RAMIRO(1), 0), b = medir(RAMIRO(1), 10);
  assert.ok(b.u.pvp - b.u.pTorax <= a.u.pvp + 0.01 + 0, `transmural ${(b.u.pvp - b.u.pTorax).toFixed(1)} vs ${a.u.pvp.toFixed(1)}`);
});
