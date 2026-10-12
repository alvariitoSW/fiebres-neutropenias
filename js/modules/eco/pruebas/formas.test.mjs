// Pruebas de las formas precalculadas (formas.mjs): dónde se calculan, que la mezcla se parece a la geometría
// exacta, y que solo se usa cuando representa al estado que se muestra.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { construirCorazon } from '../corazon-geo.mjs';
import { crearTablaFormas, instantesClave, estadoGeo, posicionesMezcladas, semejantes, valorEn, VALVULAS, TOLERANCIA } from '../formas.mjs';
import { ESCENARIOS } from '../escenarios.mjs';

const m = crearMotor(); m.correr(12);
const OP = { pericardio: true, detalle: true };
const extra = () => ({ vviTd: m.ultimo.edv, liquidoPeri: m.p.liquidoPeri });
const tabla = crearTablaFormas();
tabla.pedir(m.onda, m.ultimo, OP, extra()); while (tabla.construyendo) tabla.trabajar();

test('los instantes clave cubren el latido, con error acotado y más densos donde todo cambia deprisa', () => {
  const o = m.onda, u = m.ultimo, k = instantesClave(o);
  assert.equal(k[0], o[0]); assert.equal(k[k.length - 1], o[o.length - 1]);
  for (let i = 1; i < k.length; i++) assert.ok(k[i].t - k[i - 1].t <= 0.0601, `separación ${(k[i].t - k[i - 1].t).toFixed(3)} s`);
  // entre dos formas seguidas, interpolar volúmenes y aperturas se separa poco de cada muestra real
  for (let i = 1; i < k.length; i++) for (const x of o) {
    if (x.t <= k[i - 1].t || x.t >= k[i].t) continue;
    const w = (x.t - k[i - 1].t) / (k[i].t - k[i - 1].t), a = estadoGeo(k[i - 1]), b = estadoGeo(k[i]), e = estadoGeo(x);
    for (const c of ['vvi', 'vvd', 'vai', 'vad']) assert.ok(Math.abs(a[c] + (b[c] - a[c]) * w - e[c]) <= TOLERANCIA.volumen / 2 + 1e-9, `${c} en t ${x.t}`);
    for (const v of VALVULAS) assert.ok(Math.abs(a[v.n] + (b[v.n] - a[v.n]) * w - e[v.n]) <= TOLERANCIA.apertura / 2 + 1e-9, `${v.n} en t ${x.t}`);
  }
  const cuenta = (t0, t1) => k.filter(x => x.t >= t0 && x.t < t1).length;
  assert.ok(cuenta(u.tAoAbre - 0.04, u.tAoAbre + 0.04) > cuenta(u.tMitAbre + 0.15, u.tMitAbre + 0.23), 'no hay más formas en la apertura aórtica que en la diástasis');
  assert.ok(k.length >= 20 && k.length <= 60, `${k.length} formas por latido`);
});

test('en el instante de una forma, la mezcla es exactamente esa forma', () => {
  for (const x of instantesClave(m.onda).filter((_, i) => i % 7 === 0)) {
    const s = { ...x, tLatido: x.t }, mz = tabla.mezclar(s, extra());
    assert.ok(mz, `sin mezcla en t ${x.t}`);
    const g = construirCorazon(estadoGeo(s, extra()), OP);
    mz.partes.forEach((p, j) => { if (!p.pos) return; const P = posicionesMezcladas(p), Q = g.partes[j].pos;
      for (let i = 0; i < P.length; i++) assert.ok(Math.abs(P[i] - Q[i]) < 1e-4, `${p.nombre} en t ${x.t}`); });
  }
});

test('en el latido siguiente, la mezcla se usa casi siempre y se separa muy poco de la geometría exacta', () => {
  const mm = crearMotor(); mm.correr(12);
  let validas = 0, total = 0; const d = [];
  for (let k = 0; k < 430; k++) {
    for (let i = 0; i < 20; i++) mm.paso(0.0001);
    total++; const mz = tabla.mezclar(mm.s, extra()); if (!mz) continue; validas++;
    if (k % 6) continue;
    const g = construirCorazon(estadoGeo(mm.s, extra()), OP);
    mz.partes.forEach((p, j) => { if (!p.pos) return; const P = posicionesMezcladas(p), Q = g.partes[j].pos;
      for (let i = 0; i < P.length; i += 3) d.push(Math.hypot(P[i] - Q[i], P[i + 1] - Q[i + 1], P[i + 2] - Q[i + 2])); });
  }
  d.sort((a, b) => a - b); const q = (f) => d[Math.floor(f * (d.length - 1))];
  assert.ok(validas / total > 0.95, `mezcla válida en ${validas} de ${total} fotogramas`);
  // la mayoría de los vértices casi no se mueve; los pocos saltos grandes vienen de la propia geometría exacta (ver README)
  assert.ok(q(0.99) < 0.5, `percentil 99: ${q(0.99).toFixed(2)} mm`);
  assert.ok(q(0.999) < 1.5, `percentil 99,9: ${q(0.999).toFixed(2)} mm`);
});

test('si la mezcla no representa al estado mostrado, no se usa (se construye la geometría exacta)', () => {
  const x = m.onda[100], s = { ...x, tLatido: x.t };
  assert.ok(tabla.mezclar(s, extra()));
  assert.equal(tabla.mezclar({ ...s, vvi: s.vvi + 5 }, extra()), null, 'volumen distinto');
  assert.equal(tabla.mezclar({ ...s, qAo: 400 }, extra()), null, 'aórtica abierta en la forma, cerrada en el estado (o al revés)');
  assert.equal(tabla.mezclar(s, { ...extra(), liquidoPeri: 300 }), null, 'derrame distinto');
  const t2 = crearTablaFormas(); t2.pedir(m.onda, m.ultimo, { ...OP, corte: { phi: 2.6 } }, extra());
  assert.equal(t2.construyendo, false, 'con corte no se precalcula (cambia la topología)');
});

test('dos latidos estables seguidos son semejantes; tras una hemorragia, la tabla caduca', () => {
  const mm = crearMotor(); mm.correr(12); const o1 = mm.onda; mm.correr(mm.ultimo.periodo + 0.01);
  assert.ok(semejantes(o1, mm.onda), 'dos latidos en reposo deberían parecerse');
  assert.equal(tabla.caduca(mm.onda), false);
  ESCENARIOS.hemorragia.aplicar(mm); mm.correr(3);
  assert.ok(tabla.caduca(mm.onda), 'tras la hemorragia, la tabla del latido normal ya no vale');
  assert.ok(Math.abs(valorEn(o1, o1[5].t, 'vvi') - o1[5].vvi) < 1e-12);
});
