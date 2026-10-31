// El interruptor del dibujo: con usarDibujo(2) el resultado es idéntico al de 1 (mientras el nuevo delega) y usarDibujo(1) lo devuelve.
import test from 'node:test';
import assert from 'node:assert/strict';
import { construirCorazon, baseGeometrica, usarDibujo } from '../corazon-geo.mjs';
import { construirCorazon2 } from '../corazon-geo-2.mjs';

const est = { vvi: 0.9, vvd: 0.9, vai: 0.8, vad: 0.8, mitral: 1, tricus: 1, aortica: 0, pulmonar: 0, liquidoPeri: 0 };
const firma = () => JSON.stringify([baseGeometrica(est), construirCorazon(est).partes.map(p => [p.nombre ?? p.id ?? '', p.tris?.length ?? p.verts?.length ?? 0])]);
test('interruptor del dibujo', () => {
  assert.equal(usarDibujo(1), 1);
  const a = firma();
  assert.equal(usarDibujo(2), 1);
  assert.equal(firma(), a);
  assert.equal(construirCorazon2(est).partes.length, construirCorazon(est).partes.length);
  assert.equal(usarDibujo(1), 2);
  assert.equal(firma(), a);
});
