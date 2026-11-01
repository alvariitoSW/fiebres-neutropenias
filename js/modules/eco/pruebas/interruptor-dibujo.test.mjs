// El interruptor del dibujo: usarDibujo(2) cambia al dibujo nuevo y usarDibujo(1) lo devuelve. Lo común (cifras de la base,
// piezas) es idéntico; desde P4a-1 el nuevo engrosa la pared libre del VD donde va oblicua (epicardio distinto, endocardio igual).
import test from 'node:test';
import assert from 'node:assert/strict';
import { construirCorazon, baseGeometrica, usarDibujo } from '../corazon-geo.mjs';
import { construirCorazon2 } from '../corazon-geo-2.mjs';
import { estadosForma } from './geometria-juez.mjs';

const est = { vvi: 0.9, vvd: 0.9, vai: 0.8, vad: 0.8, mitral: 1, tricus: 1, aortica: 0, pulmonar: 0, liquidoPeri: 0 };
const sinVd = (g) => ({ ...g, Lvd: 0, A: 0, C0: 0 });   // el largo del VD es propio del dibujo nuevo (vdLargoPropio)
const firma = () => JSON.stringify([sinVd(baseGeometrica(est)), construirCorazon(est).partes.map(p => [p.nombre ?? p.id ?? '', p.tris?.length ?? p.verts?.length ?? 0])]);
test('interruptor del dibujo', () => {
  assert.equal(usarDibujo(1), 2, 'por defecto es el dibujo nuevo (encendido el 01/11/2026)');   // ahora dibujo 1 = el de antes
  const a = firma();
  assert.equal(usarDibujo(2), 1);
  assert.equal(firma(), a);
  assert.equal(construirCorazon2(est).partes.length, construirCorazon(est).partes.length);
  const hp = { ...estadosForma('hpcronica', 1).td, septoSigno: undefined };   // sin septoSigno el tabique es el de hoy (P4b lo cambia aparte)   // HP crónica grave: VD dilatado y abombado, pared gruesa
  const g2 = baseGeometrica(hp);   // vdLargoPropio (mv-eco-2a5): el VD tiene su largo, así que se compara a la misma altura relativa
  assert.equal(usarDibujo(1), 2);
  assert.equal(firma(), a);
  const g1 = baseGeometrica(hp);
  assert.ok(g2.Lvd > g1.Lvd + 5, 'en HP el VD dilatado es más largo que el de hoy (atado al VI)');
  const r = (p) => Math.hypot(p[0], p[1]), f = 3.3;
  const grosor = (g, z) => r(g.epiVd(z, f)) - r(g.endoVd(z, f));
  const grosor1 = grosor(g1, -0.4 * g1.Lvd), grosor2 = grosor(g2, -0.4 * g2.Lvd);
  assert.ok(grosor2 > grosor1 + 0.3 || grosor2 > g1.tvdW(99) * 0.9, 'en HP el nuevo mantiene el grosor de la pared del VD oblicua');
  assert.ok(grosor2 < 2 * g1.tvdW(99) + 0.5, 'el ajuste oblicuo no pasa de doblar la pared');
  assert.equal(usarDibujo(2), 1);   // vuelve al defecto
});
