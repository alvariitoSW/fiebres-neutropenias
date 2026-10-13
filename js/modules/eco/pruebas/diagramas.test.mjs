// Pruebas de las funciones puras del Wiggers y del asa presión-volumen (sin navegador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { segmentosFase, muestraEn, estadoRevision, muestraCercanaPV, escalas, LADOS, eesLatido } from '../diagramas.mjs';

const m = crearMotor(); m.correr(20);
const o = m.onda, T = m.ultimo.periodo;

test('las fases del último latido salen A-G, contiguas y cubriendo todo el latido', () => {
  const seg = segmentosFase(o, T);
  assert.deepEqual(seg.map(g => g.f), ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  assert.equal(seg[0].t0, 0);
  assert.equal(seg[seg.length - 1].t1, T);
  for (let i = 1; i < seg.length; i++) assert.equal(seg[i].t0, seg[i - 1].t1, `hueco entre ${seg[i - 1].f} y ${seg[i].f}`);
});

test('el centro de cada fase cae en esa fase (lo usa la barra del ciclo para ir a ella)', () => {
  for (const g of segmentosFase(o, T)) assert.equal(estadoRevision(o, (g.t0 + g.t1) / 2).fase, g.f);
});

test('muestraEn devuelve la muestra más cercana y estadoRevision la marca con su tiempo', () => {
  const t = 0.3137, s = muestraEn(o, t);
  for (const x of o) assert.ok(Math.abs(x.t - t) >= Math.abs(s.t - t) - 1e-12);
  const e = estadoRevision(o, t);
  assert.equal(e.tLatido, s.t); assert.equal(e.vvi, s.vvi); assert.equal(e.revisando, true);
  assert.equal(muestraEn([], 0.2), null);
  assert.equal(muestraEn(o, -5), o[0]); assert.equal(muestraEn(o, 99), o[o.length - 1]);
});

test('en el asa, tocar el punto de una muestra devuelve esa misma muestra', () => {
  const e = escalas(o, 'izquierdo', T);
  for (const i of [10, 120, 250, o.length - 5]) {
    const x = o[i];
    assert.equal(muestraCercanaPV(o, 'vvi', 'pvi', x.vvi, x.pvi, e.pvVMax, e.pvPMax), x);
  }
});

test('las escalas contienen todas las curvas del latido, en los dos lados', () => {
  for (const lado of Object.keys(LADOS)) {
    const L = LADOS[lado], e = escalas(o, lado, T);
    for (const x of o) {
      for (const [k] of L.presiones) assert.ok(x[k] <= e.pMax && x[k] <= e.pvPMax, `${lado} ${k} ${x[k]} > ${e.pMax}`);
      assert.ok(x[L.vol] >= e.vMin && x[L.vol] <= e.vMax && x[L.vol] <= e.pvVMax, `${lado} ${L.vol}`);
    }
  }
});

test('el motor expone el latido en curso, que crece hasta cerrarse', () => {
  const mm = crearMotor(); mm.correr(5);
  const n0 = mm.s.nLatido, l0 = mm.ondaActual.length;
  for (let i = 0; i < 200; i++) mm.paso();
  if (mm.s.nLatido === n0) assert.ok(mm.ondaActual.length > l0);
  assert.ok(mm.periodo > 0.3 && mm.periodo < 2);
});

test('la ESPVR que se dibuja pasa por la esquina telesistólica (Ees de un latido) y queda cerca de la Ees del motor', () => {
  const es = o.reduce((a, x) => (x.vvi < a.vvi ? x : a));
  const ees = eesLatido(o, LADOS.izquierdo, m.p.vi.v0);
  assert.ok(Math.abs(es.pvi - ees * (es.vvi - m.p.vi.v0)) < 1e-9);
  // el efecto de la eyección deja la esquina de un latido que expulsa algo por debajo de la elastancia máxima
  const r = ees / m.ef.eesVi;
  assert.ok(r > 0.8 && r <= 1.02, `Ees del latido ÷ Ees del motor = ${r.toFixed(3)}`);
});
