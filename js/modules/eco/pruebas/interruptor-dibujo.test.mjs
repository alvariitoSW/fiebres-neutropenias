// El interruptor del dibujo: usarDibujo(2) cambia al dibujo nuevo y usarDibujo(1) lo devuelve. Lo común (cifras de la base,
// piezas) es idéntico; desde P4a-1 el nuevo engrosa la pared libre del VD donde va oblicua (epicardio distinto, endocardio igual).
import test from 'node:test';
import assert from 'node:assert/strict';
import { construirCorazon, baseGeometrica, usarDibujo } from '../corazon-geo.mjs';
import { construirCorazon2 } from '../corazon-geo-2.mjs';
import { estadosForma } from './geometria-juez.mjs';

const est = { vvi: 0.9, vvd: 0.9, vai: 0.8, vad: 0.8, mitral: 1, tricus: 1, aortica: 0, pulmonar: 0, liquidoPeri: 0 };
const firma = () => JSON.stringify([baseGeometrica(est), construirCorazon(est).partes.map(p => [p.nombre ?? p.id ?? '', p.tris?.length ?? p.verts?.length ?? 0])]);
test('interruptor del dibujo', () => {
  assert.equal(usarDibujo(1), 1);
  const a = firma();
  assert.equal(usarDibujo(2), 1);
  assert.equal(firma(), a);
  assert.equal(construirCorazon2(est).partes.length, construirCorazon(est).partes.length);
  const hp = { ...estadosForma('hpcronica', 1).td, septoSigno: undefined };   // sin septoSigno el tabique es el de hoy (P4b lo cambia aparte)   // HP crónica grave: VD dilatado y abombado, pared gruesa
  const g2 = baseGeometrica(hp), z = -0.4 * g2.Lvd, f = 3.3;   // pared libre del VD, tercio medio
  assert.equal(usarDibujo(1), 2);
  assert.equal(firma(), a);
  const g1 = baseGeometrica(hp);
  assert.deepEqual(g2.endoVd(z, f), g1.endoVd(z, f));
  const r = (p) => Math.hypot(p[0], p[1]);
  assert.ok(r(g2.epiVd(z, f)) > r(g1.epiVd(z, f)) + 0.3, 'en HP el nuevo engrosa la pared del VD oblicua');
  assert.ok(r(g2.epiVd(z, f)) - r(g1.epiVd(z, f)) < g1.tvdW(99), 'el ajuste oblicuo no pasa de doblar la pared');
});
