// Pruebas de la ecografía (ecografia.mjs): planos de cada vista, corte cerrado de las paredes, tamaño de la
// pared frente a la geometría, contraste de la imagen y moteado que sigue al tejido.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { construirCorazon, baseGeometrica, REF } from '../corazon-geo.mjs';
import { estadoGeo } from '../formas.mjs';
import { VISTAS, planoVista, enPlano, cortarPieza, elementosDelCorte, crearEcografo, ajusteAfin, campoDesplazamiento, desplazar, abanicoVista } from '../ecografia.mjs';

const m = crearMotor(); m.correr(12);
const o = m.onda, extra = { vviTd: m.ultimo.edv, liquidoPeri: 0 }, OP = { pericardio: true, detalle: true };
const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ts = o.reduce((a, b) => (b.vvi < a.vvi ? b : a));
const geo = (s) => construirCorazon(estadoGeo(s, extra), OP);
const gTd = geo(td), gTs = geo(ts);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const ec = crearEcografo({ ancho: 300, alto: 250 });

test('cada vista es un plano bien formado y pasa por lo que tiene que pasar', () => {
  const g = baseGeometrica(td), en = (P, p) => enPlano(P, p);
  for (const k of Object.keys(VISTAS)) {
    const P = planoVista(k, td);
    assert.ok(Math.abs(dot(P.r, P.d)) < 1e-9 && Math.abs(dot(P.n, P.d)) < 1e-9 && Math.abs(dot(P.n, P.n) - 1) < 1e-9, k);
    assert.ok(en(P, [0, 0, -g.vi.Le])[1] > 10, `${k}: el ápex queda delante del transductor`);
  }
  const a4 = planoVista('a4c', td), mit = [g.mc[0], g.mc[1], 0], tri = [g.ct[0], g.ct[1], 0];
  assert.ok(Math.abs(en(a4, mit)[2]) < 4 && Math.abs(en(a4, tri)[2]) < 4, 'el 4 cámaras pasa por la mitral y la tricúspide');
  assert.ok(en(a4, mit)[0] > en(a4, tri)[0], 'en el 4 cámaras el VI queda a la derecha');
  assert.ok(dot(a4.d, [0, 0, 1]) > 0.9, 'el haz apical va del ápex a la base');
  const pl = planoVista('plax', td), ao = [g.ac[0], g.ac[1], 0];
  for (const p of [[0, 0, -40], [0, 0, 0], ao, mit]) assert.ok(Math.abs(en(pl, p)[2]) < 3, 'el eje largo contiene el eje del VI y las dos válvulas');
  assert.ok(en(pl, ao)[0] > en(pl, [0, 0, -40])[0], 'en el eje largo la aorta queda a la derecha (la base) y el ápex a la izquierda');
  for (const k of ['psaxAo', 'psaxMv', 'psaxPm']) {
    const P = planoVista(k, td); assert.ok(Math.abs(dot(P.n, [0, 0, 1])) > 0.999, `${k}: perpendicular al eje del VI`);
    const fs = (REF.phiA + REF.phiB) / 2, z = en(P, [0, 0, 0])[2];
    assert.ok(en(P, [-30 * Math.cos(fs), -30 * Math.sin(fs), -z])[0] > 0, `${k}: la pared lateral (lejos del tabique) a la derecha`);
  }
  const ab = abanicoVista(a4); assert.equal(ab.idx.length % 3, 0); assert.ok(ab.pos.length > 9);
});

test('un triángulo paralelo al plano no deja corte (sería un borrón)', () => {
  const P = { O: [0, 0, 0], d: [0, 1, 0], r: [1, 0, 0], n: [0, 0, 1] };
  const plano = { pos: new Float32Array([0, 0, 0.0, 10, 0, 0, 0, 10, 0]), idx: new Uint32Array([0, 1, 2]) };
  assert.equal(cortarPieza(plano, P).seg.length, 0);
  const cruza = { pos: new Float32Array([0, 0, -1, 10, 0, 1, 0, 10, 1]), idx: new Uint32Array([0, 1, 2]) };
  assert.equal(cortarPieza(cruza, P).seg.length, 4);
});

test('las paredes cortadas quedan cerradas en todas las vistas y en todo el latido (sin rayas)', () => {
  for (const k of Object.keys(VISTAS)) {
    const P = planoVista(k, td);
    for (let i = 0; i < o.length; i += 60) {
      const els = elementosDelCorte(geo(o[i]).partes, P);
      for (const e of els) if (e.tipo === 'relleno') assert.equal(e.abiertos, 0, `${k} t ${o[i].t.toFixed(2)}: ${e.grupo} con extremos sin cerrar`);
    }
  }
});

// muestras de la rejilla polar de una etiqueta, en mm² (cada muestra mide r·dθ·dr)
const area = (im, tag) => { let a = 0; for (let q = 0; q < im.tag.length; q++) if (im.tag[q] === tag) a += Math.hypot(im.x[q], im.y[q]) * im.dth * im.dr; return a; };
const tagMuestra = (im, P, p) => { const [u, v] = enPlano(P, p), b = Math.round((Math.atan2(u, v) + P.mitad) / im.dth - 0.5), s = Math.round(Math.hypot(u, v) / im.dr - 0.5); return im.tag[s * im.nb + b]; };

test('en el eje corto de papilares, el área de la pared del VI es la de la geometría (±3%) y engorda en sístole', () => {
  // sin papilares, coronarias ni grasa, que en el corte tapan una parte de la pared
  const sinDet = (s) => construirCorazon(estadoGeo(s, extra), { pericardio: true, detalle: false }).partes;
  const P = planoVista('psaxPm', td), g = baseGeometrica(td), z = P.O[2];      // el corte está a la altura del transductor
  const im = ec.formar(sinDet(td), P), tag = im.etiquetas.get('VI');
  const esperado = Math.PI * (g.rEpiVi(z) ** 2 - g.rEndoVi(z) ** 2), medido = area(im, tag);
  assert.ok(Math.abs(medido - esperado) / esperado < 0.03, `pared ${medido.toFixed(0)} mm² frente a ${esperado.toFixed(0)}`);
  const imS = ec.formar(sinDet(ts), P);
  assert.ok(area(imS, imS.etiquetas.get('VI')) > medido * 1.1, 'la pared no engorda en sístole');
});

test('en el 4 cámaras, la cavidad del VI y la AI son sangre (las paredes no se filtran)', () => {
  const P = planoVista('a4c', td), im = ec.formar(gTd.partes, P), f = gTd.flujo;
  assert.equal(tagMuestra(im, P, f.transformar(f.enCamara.vi([0.4, 0, 0]))), 255, 'centro del VI');
  assert.equal(tagMuestra(im, P, f.transformar(f.enCamara.ai([0.45, 0, 0]))), 255, 'centro de la AI');
});

test('contraste: el miocardio brilla mucho más que la sangre y el pericardio más que el miocardio', () => {
  const P = planoVista('psaxPm', td), im = ec.formar(gTd.partes, P);
  const media = (fn) => { let s = 0, n = 0; for (let q = 0; q < im.tag.length; q++) if (fn(im.tag[q])) { s += im.db[q]; n++; } return s / n; };
  const vi = im.etiquetas.get('VI'), peri = im.etiquetas.get('Pericardio');
  const dMio = media(t => t === vi), dSangre = media(t => t === 255), dPeri = media(t => t === peri);
  assert.ok(dMio - dSangre > 25, `miocardio ${dMio.toFixed(0)} dB, sangre ${dSangre.toFixed(0)} dB`);
  assert.ok(dPeri > dMio + 4, `pericardio ${dPeri.toFixed(0)} dB, miocardio ${dMio.toFixed(0)} dB`);
});

test('el moteado sigue al tejido: el campo de desplazamiento predice dónde estaba en telediástole lo que se ve en sístole', () => {
  const P = planoVista('psaxPm', td);
  const els = elementosDelCorte(gTs.partes, P, gTd.partes), vi = els.find(e => e.tipo === 'relleno' && e.grupo === 'VI');
  // el campo se construye con la mitad de los puntos y se comprueba con la otra mitad (puntos que no ha visto)
  const par = (a, k) => a.filter((_, i) => (i >> 1) % 2 === k);
  const F = campoDesplazamiento(par(vi.seg, 0), par(vi.segRef, 0)), A = ajusteAfin(vi.seg, vi.segRef);
  const prueba = par(vi.seg, 1), ref = par(vi.segRef, 1);
  let eF = 0, eA = 0, e0 = 0, n = 0;
  for (let i = 0; i < prueba.length; i += 2) {
    const d = desplazar(F, prueba[i], prueba[i + 1]); assert.ok(d, 'un punto de la pared queda fuera del campo');
    const x = prueba[i] - A[0], y = prueba[i + 1] - A[1];
    eF += (d[0] - ref[i]) ** 2 + (d[1] - ref[i + 1]) ** 2;
    eA += (A[2] + A[4] * x + A[5] * y - ref[i]) ** 2 + (A[3] + A[6] * x + A[7] * y - ref[i + 1]) ** 2;
    e0 += (prueba[i] - ref[i]) ** 2 + (prueba[i + 1] - ref[i + 1]) ** 2; n++;
  }
  const [rF, rA, r0] = [eF, eA, e0].map(e => Math.sqrt(e / n));
  assert.ok(r0 > 3, `el tejido apenas se movió (${r0.toFixed(1)} mm)`);
  assert.ok(rF < 1, `el campo falla por ${rF.toFixed(2)} mm (afín ${rA.toFixed(1)}, sin seguir ${r0.toFixed(1)})`);
  assert.ok(rF < rA / 2, 'el campo no mejora al ajuste afín');
  // con los mismos puntos, el ajuste afín es la identidad
  const I = ajusteAfin(vi.seg, vi.seg); assert.ok(Math.abs(I[4] - 1) < 1e-9 && Math.abs(I[5]) < 1e-9 && Math.abs(I[7] - 1) < 1e-9);
});

test('la imagen es determinista para un mismo estado y la sangre cambia con el tiempo; el tejido, no', () => {
  const P = planoVista('a4c', td);
  const a = Float32Array.from(ec.formar(gTd.partes, P, { ref: gTd.partes, t: 1 }).db), b = Float32Array.from(ec.formar(gTd.partes, P, { ref: gTd.partes, t: 1 }).db);
  assert.deepEqual(a, b);
  const im = ec.formar(gTd.partes, P, { ref: gTd.partes, t: 1.5 }), vi = im.etiquetas.get('VI');
  let dT = 0, nT = 0, dS = 0, nS = 0;
  for (let q = 0; q < a.length; q++) { const d = Math.abs(im.db[q] - a[q]); if (im.tag[q] === vi) { dT += d; nT++; } else if (im.tag[q] === 255) { dS += d; nS++; } }
  assert.ok(dT / nT < 1, `el moteado del miocardio cambia sin moverse (${(dT / nT).toFixed(1)} dB)`);
  assert.ok(dS / nS > 3, `el ruido de la sangre no cambia con el tiempo (${(dS / nS).toFixed(1)} dB)`);
});
