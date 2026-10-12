// Pruebas del abdomen (hígado, diafragma, VCI, suprahepáticas y porta) bajo el corazón (sin navegador).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirCorazon } from '../corazon-geo.mjs';
import { construirAbdomen, anatomiaAbdomen, dentroMalla, modeloVci, respiracion, ARRIBA } from '../abdomen.mjs';
import { ABDOMEN } from '../abdomen-data.mjs';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS } from '../escenarios.mjs';
import { dot } from '../mat.mjs';

const NORMAL = { vvi: 120, vvd: 140, vai: 40, vad: 35, mitral: 0, tricus: 0, aortica: 0, pulmonar: 0 };
const res = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

test('VCI: el modelo cae en las bandas de la tabla de FATE (Manual UMI) para PVC baja y alta', () => {
  // PVC 0-5: <21 mm y colapso >50%; PVC 10-20: >21 mm y colapso <50%
  for (const pvc of [0, 2, 4, 5]) { const v = modeloVci(pvc); assert.ok(v.dmax < 21 && v.colapso > 0.5, `PVC ${pvc}: ${v.dmax} mm, ${v.colapso}`); }
  for (const pvc of [11, 15, 20]) { const v = modeloVci(pvc); assert.ok(v.dmax > 21 && v.colapso < 0.5, `PVC ${pvc}: ${v.dmax} mm, ${v.colapso}`); }
  // monótono: más PVC, vena más ancha y que colapsa menos
  for (let p = 0; p < 25; p++) { const a = modeloVci(p), b = modeloVci(p + 1); assert.ok(b.dmax >= a.dmax && b.colapso <= a.colapso); }
});

test('VCI: con la respiración el diámetro va del máximo (espiración) al mínimo (fin de la inspiración)', () => {
  const g = construirCorazon(NORMAL, { detalle: true });
  let min = Infinity, max = 0;
  for (let t = 0; t < 4; t += 0.05) { const { vci } = construirAbdomen(g, { pvc: 4, pad: 4, t }); min = Math.min(min, vci.d); max = Math.max(max, vci.d); }
  const v = modeloVci(4);
  assert.ok(Math.abs(max - v.dmax) < 0.05 && Math.abs(min - v.dmin) < 0.05, `${min}-${max} frente a ${v.dmin}-${v.dmax}`);
  assert.equal(respiracion(0), 0);
});

test('VCI en los escenarios del motor: la hemorragia la deja fina y colapsable; el derrame, sin colapso del 50%', () => {
  const pvcDe = (k) => { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m); if (k !== 'normal') m.correr(10); return m.ultimo.pvc; };
  const hem = modeloVci(pvcDe('hemorragia')), der = modeloVci(pvcDe('derrame')), nor = modeloVci(pvcDe('normal'));
  assert.ok(hem.dmax < 21 && hem.colapso > 0.5, JSON.stringify(hem));
  assert.ok(der.colapso < 0.5 && der.dmax > nor.dmax, JSON.stringify(der));
});

test('el hígado y el diafragma quedan bajo el corazón: casi ningún vértice del corazón cae dentro del hígado', () => {
  const g = construirCorazon(NORMAL, { detalle: true, pericardio: true }), A = anatomiaAbdomen();
  let dentro = 0, total = 0;
  for (const p of g.partes) if (p.pos) for (let i = 0; i < p.pos.length; i += 45) { total++; if (dentroMalla(A.higado, [p.pos[i], p.pos[i + 1], p.pos[i + 2]])) dentro++; }
  assert.ok(dentro / total < 0.02, `${dentro} de ${total}`);
  // el hiato está por debajo de la AD y el hígado, por debajo del hiato
  assert.ok(dot(res(ABDOMEN.hiato, g.flujo.enCamara.ad([0.5, 0, 0])), ARRIBA) < 0);
});

test('la VCI sale de la AD (se mueve con el latido arriba) y por debajo del hiato está quieta', () => {
  const sis = construirCorazon({ ...NORMAL, vvi: 50, vvd: 60 }, { detalle: true }), dia = construirCorazon(NORMAL, { detalle: true });
  const a = construirAbdomen(sis, { pvc: 5, pad: 5, t: 0 }).partes.find(p => p.nombre === 'Vena cava inferior');
  const b = construirAbdomen(dia, { pvc: 5, pad: 5, t: 0 }).partes.find(p => p.nombre === 'Vena cava inferior');
  assert.equal(a.pos.length, b.pos.length);
  const n = a.pos.length / 3, d = (i) => Math.hypot(a.pos[3 * i] - b.pos[3 * i], a.pos[3 * i + 1] - b.pos[3 * i + 1], a.pos[3 * i + 2] - b.pos[3 * i + 2]);
  // el tubo va de abajo (quieto) arriba (la AD)
  assert.ok(d(n - 1) > 2, `arriba se mueve ${d(n - 1).toFixed(1)} mm`);
  assert.ok(d(0) < 1e-6, `abajo quieta ${d(0)}`);
  // su boca, dentro de la cavidad de la AD: el primer punto del eje es la vía de la sangre hacia la AD
  const boca = sis.flujo.transformar(sis.flujo.enVia('vci', 1)), ad = sis.flujo.transformar(sis.flujo.enCamara.ad([0.3, 0.6, 0]));
  assert.ok(Math.hypot(...res(boca, ad)) < 45);
});

test('suprahepáticas y ramas portales van por dentro del hígado; las piezas fijas se reutilizan entre fotogramas', () => {
  const A = anatomiaAbdomen();
  for (const v of A.suprahepaticas) { const fuera = v.eje.slice(1).filter(p => !dentroMalla(A.higado, p)).length;
    assert.ok(fuera / v.eje.length < 0.15, `${v.nombre}: ${fuera} de ${v.eje.length} puntos fuera`); }
  const g = construirCorazon(NORMAL, { detalle: true });
  const x = construirAbdomen(g, { pvc: 5, pad: 5, t: 0 }), y = construirAbdomen(g, { pvc: 9, pad: 9, t: 1 });
  for (const n of ['Hígado', 'Diafragma', 'Apófisis xifoides', 'Vena porta']) assert.equal(x.partes.find(p => p.nombre === n).pos, y.partes.find(p => p.nombre === n).pos);
  for (const p of x.partes) { for (const v of p.pos) assert.ok(Number.isFinite(v)); const nv = p.pos.length / 3; for (const k of p.idx) assert.ok(k < nv, p.nombre); }
});
