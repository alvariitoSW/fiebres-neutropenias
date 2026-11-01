// Movimiento regional (mv-eco-2a5 P5b): 20 segmentos 0-1 del contrato; McConnell en el TEP (Marino 2024 cap. 22, PDF p. 7).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { contratoDe, SEGMENTOS_REGIONAL, CAMPOS } from '../contrato.mjs';

const reg = (k, g) => {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') { ESCENARIOS[k].aplicar(m, g); m.correr(k === 'fallo' ? 40 : ASENTAR_FORMA); }
  return contratoDe(m).latido.regional;
};
const media = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const casos = [['normal'], ['tep'], ['tep', 0.5], ['tep', 1], ['hpcronica'], ['fallo', 1]];

test('regional: 20 valores 0-1 con nombre, origen motor', () => {
  assert.equal(SEGMENTOS_REGIONAL.length, 20);
  assert.equal(CAMPOS.regional.origen, 'motor');
  for (const [k, g] of casos) { const r = reg(k, g); assert.equal(r.length, 20); assert.ok(r.every(x => x >= 0 && x <= 1), `${k} ${g}`); }
});
test('regional: normal, todos ≥ 0,9', () => assert.ok(reg('normal').every(x => x >= 0.9)));
test('McConnell: TEP defecto, 0,5 y 1: pared libre basal+media < 0,5 × ápex del VD', () => {
  for (const g of [undefined, 0.5, 1]) { const r = reg('tep', g); assert.ok((r[17] + r[18]) / 2 < 0.5 * r[19], `g ${g}: ${r.slice(17)}`); }
});
test('HP crónica: sin McConnell (ápex VD no > 1,5 × pared libre)', () => {
  const r = reg('hpcronica'); assert.ok(r[19] <= 1.5 * (r[17] + r[18]) / 2, String(r.slice(17)));
});
// Umbral 0,3 (P6b: el fallo al 100 % vuelve a FEVI ≈11 %)
test('fallo 1: VI global bajo', () => assert.ok(media(reg('fallo', 1).slice(0, 17)) < 0.3));
test('tabla (informativa)', () => { for (const [k, g] of casos) { const r = reg(k, g); console.log(k, g ?? 'def', 'VI', media(r.slice(0, 17)).toFixed(2), 'VD', r.slice(17).map(x => x.toFixed(2)).join(' ')); } });
// M3 · McConnell 1996 (PMID 8752195): pared libre media −0,2 ± 0,8 mm, ápex 5,7 ± 0,8 mm (normal)
test('McConnell: ápex del VD cerca de lo normal, pared media casi acinética (TEP g=1)', () => {
  const r = reg('tep', 1); assert.ok(r[19] >= 0.7, String(r.slice(17))); assert.ok(r[18] <= 0.3 * r[19], String(r.slice(17)));
});
test('McConnell en el dibujo 2 (TEP g=1): la pared media se mueve ≤ 0,3 × el ápex y el ápex ≥ 5 mm', async () => {
  const { desplazamientos } = await import('../../../../autonomo/bloques/mv-eco/herramientas/m3-mcconnell.mjs');
  const d = desplazamientos(1).despues; console.log('M3 desplazamientos (mm)', JSON.stringify(d));
  assert.ok(Math.abs(d.media) <= 0.3 * d.apice, JSON.stringify(d)); assert.ok(d.apice >= 5, JSON.stringify(d)); assert.ok(Math.abs(d.media) <= 2, JSON.stringify(d));
});
