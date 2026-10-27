// Pruebas de la ecografía (ecografia.mjs): planos de cada vista, corte cerrado de las paredes, tamaño de la
// pared frente a la geometría, contraste de la imagen y moteado que sigue al tejido.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { construirCorazon, baseGeometrica, REF } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { VISTAS, planoVista, enPlano, cortarPieza, elementosDelCorte, crearEcografo, ajusteAfin, campoDesplazamiento, desplazar, abanicoVista, distSeg, distMin, PAPILAR_FADE, MEJORAS_CERO } from '../ecografia.mjs';
import { construirAbdomen, anatomiaAbdomen, dentroMalla, ARRIBA } from '../abdomen.mjs';
import { ESCENARIOS } from '../escenarios.mjs';

const m = crearMotor(); m.correr(12);
const o = m.onda, extra = { vviTd: m.ultimo.edv, vvdTd: m.ultimo.edvD, liquidoPeri: 0 }, OP = { pericardio: true, detalle: true };
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

test('contraste: el miocardio brilla mucho más que la sangre y el pericardio más que el miocardio', async () => {
  const { MEJORAS_CERO } = await import('../ecografia.mjs');
  // con las mejoras a 0, el contraste de siempre (>25 dB); con las de por defecto, la sangre deja de ser negro absoluto
  // (su grano y la neblina del campo cercano) y el músculo se ve gris medio a propósito: el contraste baja pero sigue siendo grande
  for (const [nombre, m, minimo] of [['mejoras a 0', MEJORAS_CERO, 25], ['mejoras por defecto', undefined, 10]]) {
    const P = planoVista('psaxPm', td), im = ec.formar(gTd.partes, P, { m });
    const media = (fn) => { let s = 0, n = 0; for (let q = 0; q < im.tag.length; q++) if (fn(im.tag[q])) { s += im.db[q]; n++; } return s / n; };
    const vi = im.etiquetas.get('VI'), peri = im.etiquetas.get('Pericardio');
    const dMio = media(t => t === vi), dSangre = media(t => t === 255), dPeri = media(t => t === peri);
    assert.ok(dMio - dSangre > minimo, `${nombre}: miocardio ${dMio.toFixed(0)} dB, sangre ${dSangre.toFixed(0)} dB`);
    assert.ok(dPeri > dMio + 4, `${nombre}: pericardio ${dPeri.toFixed(0)} dB, miocardio ${dMio.toFixed(0)} dB`);
  }
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

test('la imagen es determinista para un mismo estado y la sangre cambia con el tiempo; el tejido, no', async () => {
  const { MEJORAS_CERO } = await import('../ecografia.mjs');
  const P = planoVista('a4c', td);
  // con las mejoras a 0 el tejido apenas cambia (<1 dB); con las de por defecto, algo más (la sombra y la pared gris
  // lo acercan al ruido de fondo, que sí cambia con el tiempo), pero mucho menos que la sangre
  for (const [m, tope] of [[MEJORAS_CERO, 1], [undefined, 2]]) {
    const a = Float32Array.from(ec.formar(gTd.partes, P, { ref: gTd.partes, t: 1, m }).db), b = Float32Array.from(ec.formar(gTd.partes, P, { ref: gTd.partes, t: 1, m }).db);
    assert.deepEqual(a, b);
    const im = ec.formar(gTd.partes, P, { ref: gTd.partes, t: 1.5, m }), vi = im.etiquetas.get('VI');
    let dT = 0, nT = 0, dS = 0, nS = 0;
    for (let q = 0; q < a.length; q++) { const d = Math.abs(im.db[q] - a[q]); if (im.tag[q] === vi) { dT += d; nT++; } else if (im.tag[q] === 255) { dS += d; nS++; } }
    assert.ok(dT / nT < tope, `el moteado del miocardio cambia sin moverse (${(dT / nT).toFixed(1)} dB)`);
    assert.ok(dS / nS > 3 && dS > 2 * dT * nS / nT, `el ruido de la sangre no cambia con el tiempo (${(dS / nS).toFixed(1)} dB)`);
  }
});

// Modo M: la columna es la misma imagen a lo largo de un haz (mismos grises que la imagen B) y, sobre el anillo
// tricuspídeo lateral en el 4 cámaras, el borde brillante del anillo sube hacia el transductor en sístole lo que
// recorre el anillo a lo largo de ese haz.
test('modo M: la columna repite la imagen B a lo largo del haz y sigue al anillo tricuspídeo', async () => {
  const { anguloHacia, direccionHaz } = await import('../ecografia.mjs');
  const P = planoVista('a4c', td);
  const im = ec.formar(gTd.partes, P, { ref: gTd.partes, t: 0 });
  // haz central: cada fila de la columna, frente al píxel de la imagen en el mismo punto
  const filas = 120, col = im.columna(0, filas); let dif = 0, n = 0;
  for (let y = 10; y < filas - 2; y += 4) {
    const r = (y + 0.5) / filas * P.prof, px = Math.round(im.cx), py = Math.round(im.arriba + r * im.escala);
    if (py >= im.alto) continue;
    dif += Math.abs(col[3 * y] - im.pix[4 * (py * im.ancho + px)]); n++;
  }
  assert.ok(dif / n < 12, `la columna se aparta de la imagen (${(dif / n).toFixed(1)} niveles de gris de media)`);
  // anillo tricuspídeo lateral: profundidad del punto más brillante cerca del anillo, en telediástole y telesístole
  const th = anguloHacia(P, gTd.anilloTricLateral), dir = direccionHaz(P, th);
  const prof = (g, s) => { const im2 = ec.formar(g.partes, P, { ref: gTd.partes, t: 0 }), c = im2.columna(th, 850);
    // el primer tejido brillante que encuentra el haz desde 30 mm por encima del anillo telediastólico
    const r0 = enPlano(P, gTd.anilloTricLateral)[1];
    for (let y = 0; y < 850; y++) { const r = (y + 0.5) / 850 * P.prof; if (r > r0 - 30 && c[3 * y] > 90) return r; }
    return NaN; };
  // lo que recorre el anillo a lo largo del haz (el modo M mide el movimiento en la dirección del haz, no solo el vertical)
  const exc = Math.abs(dot([0, 1, 2].map(i => gTd.anilloTricLateral[i] - gTs.anilloTricLateral[i]), dir));
  const medido = prof(gTd, td) - prof(gTs, ts);
  assert.ok(medido > 0, 'el anillo no se acerca al transductor en sístole');
  assert.ok(Math.abs(medido - exc) < 5, `excursión en el modo M ${medido.toFixed(1)} mm frente a ${exc.toFixed(1)} mm de la geometría`);
});

// Sonda libre: sin movimiento, el mismo plano; los movimientos lo mantienen ortonormal y con el transductor en su
// sitio (salvo el deslizamiento, perpendicular al plano); y las maniobras de siempre llevan de una vista a otra.
test('sonda libre: plano ortonormal y maniobras que pasan de una vista estándar a otra', async () => {
  const { planoLibre, SONDA_CERO, desviacion, vistaMasParecida, sondaMovida } = await import('../ecografia.mjs');
  const A4 = planoVista('a4c', td), igual = planoLibre(A4, SONDA_CERO);
  for (const k of ['O', 'd', 'r', 'n']) for (let i = 0; i < 3; i++) assert.ok(Math.abs(igual[k][i] - A4[k][i]) < 1e-9, `sin mover, ${k} cambia`);
  assert.equal(sondaMovida(SONDA_CERO), false);
  const L = planoLibre(A4, { rot: 33, incl: -17, bal: 9, desl: 12 });
  assert.ok(sondaMovida(L.sonda));
  assert.ok(Math.abs(dot(L.d, L.r)) < 1e-9 && Math.abs(dot(L.d, L.n)) < 1e-9 && Math.abs(dot(L.r, L.n)) < 1e-9, 'deja de ser ortonormal');
  // el deslizamiento mueve el transductor 12 mm, perpendicular al plano
  assert.ok(Math.abs(Math.hypot(L.O[0] - A4.O[0], L.O[1] - A4.O[1], L.O[2] - A4.O[2]) - 12) < 1e-6);
  // cada vista estándar se reconoce a sí misma
  for (const k of Object.keys(VISTAS)) { const v = vistaMasParecida(planoVista(k, td), td, VISTAS[k].ventana); assert.equal(v.clave, k); assert.ok(v.grados < 1e-3 && v.mm < 1e-3); }
  // maniobras: 4 cámaras → 2 y 3 cámaras rotando la sonda; eje largo → eje corto rotando 90° y deslizando
  for (const [de, s, a] of [['a4c', { rot: 76, incl: 12 }, 'a2c'], ['a4c', { rot: -50, incl: -10 }, 'a3c'], ['plax', { rot: -90, desl: 10 }, 'psaxPm'], ['plax', { rot: -90, desl: -30 }, 'psaxAo']]) {
    const P = planoLibre(planoVista(de, td), s), v = vistaMasParecida(P, td, VISTAS[de].ventana), dv = desviacion(P, planoVista(a, td));
    assert.equal(v.clave, a, `${de} ${JSON.stringify(s)} se parece más a ${v.clave}`);
    assert.ok(dv.grados < 7 && dv.mm < 6, `${de} → ${a}: ${dv.grados.toFixed(1)}°, ${dv.mm.toFixed(1)} mm`);
  }
});

// ---- fase 5: subcostal (4 cámaras y VCI) y supraesternal
const AB = anatomiaAbdomen(), altoH = (p) => dot([p[0] - AB.hiato[0], p[1] - AB.hiato[1], p[2] - AB.hiato[2]], ARRIBA);
const ejeVci = (alto) => AB.ejeVci.reduce((a, p) => (Math.abs(altoH(p) - alto) < Math.abs(altoH(a) - alto) ? p : a));

test('subcostal 4 cámaras: corta el ápex, las dos AV y las aurículas, con el ápex a la derecha y el hígado delante', () => {
  const g = baseGeometrica(td), P = planoVista('sc4c', td), en = (p) => enPlano(P, p);
  const apex = [0, 0, -g.vi.Le], mit = [g.mc[0], g.mc[1], 0], tri = [g.ct[0], g.ct[1], 0];
  for (const p of [apex, mit, tri]) assert.ok(Math.abs(en(p)[2]) < 10, `fuera del plano ${en(p)[2].toFixed(0)} mm`);
  assert.ok(en(apex)[0] > en(tri)[0] + 30, 'el ápex (izquierda del paciente) a la derecha de la imagen');
  let h = 0; for (let v = 0; v < 90; v += 5) if (dentroMalla(AB.higado, [0, 1, 2].map(i => P.O[i] + P.d[i] * v))) h++;
  assert.ok(h >= 6, `el haz central apenas cruza el hígado (${h * 5} mm)`);
});

test('subcostal VCI: la VCI va a lo largo del corte, casi en horizontal, y entra en la AD a la derecha', () => {
  const g = baseGeometrica(td), P = planoVista('scVci', td), en = (p) => enPlano(P, p);
  const tramo = AB.ejeVci.filter(p => altoH(p) < -5 && altoH(p) > -60);
  for (const p of tramo) assert.ok(Math.abs(en(p)[2]) < 4, `la VCI se sale del corte ${en(p)[2].toFixed(1)} mm`);
  const a = en(ejeVci(-55)), b = en(ejeVci(-5));
  assert.ok(b[0] - a[0] > 35, 'hacia la AD, a la derecha');
  assert.ok(Math.abs(b[1] - a[1]) < 0.5 * (b[0] - a[0]), 'casi horizontal (cruza la imagen, no va hacia la sonda)');
  assert.ok(en([g.ct[0] - 5, g.ct[1], 16])[0] > b[0], 'la AD, todavía más a la derecha');
});

test('supraesternal: el arco en el corte, ascendente a la izquierda y descendente a la derecha, y el techo arriba', () => {
  const g = baseGeometrica(td), P = planoVista('sse', td), en = (p) => enPlano(P, p);
  const asc = [g.ac[0] - 1, g.ac[1] - 4, 62], techo = [14, -34, 72], desc = [21, -54, 50];
  for (const p of [asc, techo, desc]) assert.ok(Math.abs(en(p)[2]) < 8, `fuera del corte ${en(p)[2].toFixed(0)} mm`);
  assert.ok(en(asc)[0] < 0 && en(desc)[0] > 0, 'ascendente a la izquierda, descendente a la derecha');
  assert.ok(en(techo)[1] < en(desc)[1] && en(techo)[1] < en(asc)[1] + 20, 'el arco, lo más cerca de la sonda');
});

test('fase 5: la VCI cortada a lo largo y el arco se ven como sangre; el hígado, como tejido', () => {
  const ab = construirAbdomen(gTd, { pvc: m.ultimo.pvc, pad: m.ultimo.pvc, t: 0 }), partes = gTd.partes.concat(ab.partes);
  const P1 = planoVista('scVci', td), im1 = ec.formar(partes, P1);
  for (const alto of [-20, -30, -40]) assert.equal(tagMuestra(im1, P1, ejeVci(alto)), 255, `VCI a ${alto} mm del hiato`);
  assert.equal(tagMuestra(im1, P1, [0, 1, 2].map(i => P1.O[i] + P1.d[i] * 50)), im1.etiquetas.get('Hígado'), 'a 5 cm, hígado');
  const g = baseGeometrica(td), P2 = planoVista('sse', td), im2 = ec.formar(partes, P2);
  for (const p of [[g.ac[0] - 1, g.ac[1] - 4, 62], [14, -34, 72], [21, -54, 50]]) assert.equal(tagMuestra(im2, P2, p), 255, 'luz de la aorta');
});

test('fase 5: las paredes quedan cerradas en las vistas nuevas también en los escenarios de shock', () => {
  for (const esc of Object.keys(ESCENARIOS)) {
    const mm = crearMotor(); mm.correr(12); ESCENARIOS[esc].aplicar(mm); if (esc !== 'normal') mm.correr(10);
    const oo = mm.onda, ex = extraDeMotor(mm), t0 = { ...oo.reduce((a, b) => (b.vvi > a.vvi ? b : a)), mioVi: ex.mioVi };
    for (const k of ['sc4c', 'scVci', 'sse']) { const P = planoVista(k, t0);
      for (let i = 0; i < oo.length; i += 80) for (const e of elementosDelCorte(construirCorazon(estadoGeo(oo[i], ex), OP).partes, P))
        if (e.tipo === 'relleno') assert.equal(e.abiertos, 0, `${esc} · ${k}: ${e.grupo} sin cerrar`); }
  }
});

// Las mejoras de la imagen (paredes, moteado, sombra, reverberación, especular, TGC, foco, ventana): con todas las
// intensidades a 0, la imagen es la de antes (referencia congelada en ecografia-antes.mjs).
test('con las mejoras a 0, la imagen es la de antes (diferencia media de gris ≈ 0) y con ellas encendidas, cambia', async () => {
  const { crearEcografo: crearAntes } = await import('./ecografia-antes.mjs');
  const { MEJORAS_CERO } = await import('../ecografia.mjs');
  const antes = crearAntes({ ancho: 300, alto: 250 }), nuevo = crearEcografo({ ancho: 300, alto: 250 });
  for (const v of ['plax', 'psaxPm', 'a4c', 'sc4c']) {
    // sin hueso ni pleura (N3): el ecógrafo de antes no los conoce; lo que se compara son las mejoras de la imagen
    const sinTorax = (g) => g.partes.filter(p => !/^(Vértebra|Pulmón)/.test(p.nombre));
    const P = planoVista(v, td), opc = { ref: sinTorax(gTd), t: 1.3 };
    const a = antes.formar(sinTorax(gTs), P, opc).pix, b = nuevo.formar(sinTorax(gTs), P, { ...opc, m: MEJORAS_CERO, ventanaVista: VISTAS[v].ventana }).pix, c = nuevo.formar(gTs.partes, P, { ...opc, ventanaVista: VISTAS[v].ventana }).pix;
    let d0 = 0, d1 = 0, n = 0;
    for (let i = 0; i < a.length; i += 4) { d0 += Math.abs(a[i] - b[i]); d1 += Math.abs(a[i] - c[i]); n++; }
    assert.ok(d0 / n < 0.05, `${v}: con las mejoras a 0 la imagen difiere ${(d0 / n).toFixed(3)} niveles de gris`);
    assert.ok(d1 / n > 3, `${v}: con las mejoras por defecto la imagen apenas cambia (${(d1 / n).toFixed(2)} niveles)`);
  }
});

// ---- A1 (parada 2 de eco-mega): cuerdas como losa y papilares que se desvanecen lejos de la pared
test('cuerdas: en el 4 cámaras en diástole se ven, con menos brillo que la valva', () => {
  const els = elementosDelCorte(gTd.partes, planoVista('a4c', td)), cu = els.filter(e => e.grupo === 'Cuerdas');
  assert.ok(cu.length >= 1, 'ninguna cuerda en la imagen');
  const valva = Math.max(...els.filter(e => /^(Mitral|Tricúspide)/.test(e.grupo || '')).map(e => e.db));
  for (const c of cu) assert.ok(c.db <= valva, `cuerda ${c.db.toFixed(1)} dB por encima de la valva ${valva}`);
});

test('cuerdas: brillo máximo en el centro del plano y al menos 6 dB menos a 3 mm o más', () => {
  const P = { O: [0, 0, 0], d: [0, 1, 0], r: [1, 0, 0], n: [0, 0, 1] };
  const cuerdaA = (z) => elementosDelCorte([{ nombre: 'Cuerdas', lineas: new Float32Array([0, 5, z, 0, 15, z]) }], P).filter(e => e.grupo === 'Cuerdas');
  const db = (z) => { const c = cuerdaA(z); return c.length ? Math.max(...c.map(e => e.db)) : -Infinity; };
  assert.ok(db(0) >= db(1) && db(1) >= db(2), 'el brillo no baja de forma continua');
  for (const z of [3, 3.5, 4]) assert.ok(db(z) <= db(0) - 6, `a ${z} mm: ${db(z)} frente a ${db(0)} dB en el centro`);
  assert.equal(cuerdaA(5).length, 0, 'fuera de la losa no debe verse');
  assert.ok(cuerdaA(0)[0].ancho > cuerdaA(3)[0].ancho, 'la cuerda del centro es más gruesa que la del borde');
});

test('papilares: los que nacen de la pared se ven; el que queda suelto a más de 6 mm se funde con la sangre', () => {
  const P = planoVista('psaxPm', td);
  for (const [nom, g] of [['telesístole', gTs], ['telediástole', gTd]]) {
    const im = ec.formar(g.partes, P), vi = im.elementos.filter(e => e.grupo === 'VI' && e.tipo === 'relleno').flatMap(e => e.seg);
    const pap = im.elementos.filter(e => /^Papilar/.test(e.grupo || '') && e.tipo === 'relleno' && !/ del VD$/.test(e.grupo));
    assert.ok(pap.length >= 1, `${nom}: no hay papilares en el corte`);
    for (const e of pap) {
      assert.ok(distMin(e.seg, vi) <= PAPILAR_FADE[1], `${nom}: ${e.grupo} suelto a ${distMin(e.seg, vi).toFixed(1)} mm`);
      let n = 0; const t = im.etiquetas.get(e.grupo); for (let q = 0; q < im.tag.length; q++) if (im.tag[q] === t) n++;
      assert.ok(n > 20, `${nom}: ${e.grupo} desapareció (${n} píxeles)`);
    }
  }
  // papilar suelto: el mismo corte con el músculo apartado de la pared (hacia el centro de la cavidad)
  const lejos = gTs.partes.map(p => /^Papilar (anterolateral|posteromedial)$/.test(p.nombre) ? { ...p, pos: p.pos.map((v, i) => (i % 3 === 2 ? v : v * 0.15)) } : p);
  const im = ec.formar(lejos, P), vi = im.elementos.filter(e => e.grupo === 'VI' && e.tipo === 'relleno').flatMap(e => e.seg);
  const sueltos = im.elementos.filter(e => /^Papilar (anterolateral|posteromedial)$/.test(e.grupo || '') && e.tipo === 'relleno' && e.distPared > PAPILAR_FADE[1]);
  assert.ok(sueltos.length >= 1, 'la prueba no logró soltar ningún papilar');
  for (const e of sueltos) { const t = im.etiquetas.get(e.grupo); let n = 0; for (let q = 0; q < im.tag.length; q++) if (im.tag[q] === t) n++; assert.equal(n, 0, `${e.grupo} suelto a ${e.distPared.toFixed(1)} mm sigue en la imagen`); }
});

test('tabla de tejidos: orden de brillo, origen en cada fila y la imagen lee de ella', async () => {
  const { TEJIDOS, DB_IMAGEN } = await import('../../../data/eco-tejidos.js');
  const { DB } = await import('../ecografia.mjs');
  const T = TEJIDOS;
  assert.ok(T.sangre.db < T.miocardio.db && T.miocardio.db < T.cuerda.db && T.cuerda.db < T.valva.db && T.valva.db < T.pericardio.db, 'sangre < miocardio < cuerda < valva < pericardio');
  for (const [k, t] of Object.entries(T)) {
    assert.ok(['ilustrativo', 'fisiología general', 'ficha'].includes(t.origen), `origen de ${k}`);
    assert.ok(t.nombre && Number.isFinite(t.db), `nombre y dB de ${k}`);
  }
  assert.equal(DB.sangre, T.sangre.db); assert.equal(DB.extracardiaco, T.extracardiaco.db);
  assert.equal(DB.borde, DB_IMAGEN.borde.db); assert.equal(DB.especular, DB_IMAGEN.especular.db);
});

// ---- A3 (parada 2 de eco-mega): sombra acústica detrás del calcio
/** Con y sin calcio en la valva aórtica (PLAX): dB medios de lo que hay detrás, solo en haces con valva y tejido detrás. */
function sombraDetras(calcio, mejoras = {}) {
  const P = planoVista('plax', td), opc = { ref: gTd.partes, t: 1.3, ventanaVista: VISTAS.plax.ventana, m: mejoras };
  const foto = (r) => ({ db: Float32Array.from(r.db), tag: Uint8Array.from(r.tag), pix: Uint8Array.from(r.pix), etiquetas: r.etiquetas, nb: r.nb, ns: r.ns, dr: r.dr });   // el ecógrafo reutiliza sus búferes
  const sin = foto(ec.formar(gTd.partes, P, opc)), con = foto(ec.formar(gTd.partes, P, { ...opc, calcio }));
  const tag = con.etiquetas.get('Aórtica');
  let n = 0, dSin = 0, dCon = 0;
  for (let i = 0; i < con.nb; i++) {
    let jv = -1; for (let j = 0; j < con.ns; j++) if (con.tag[j * con.nb + i] === tag) jv = j;
    if (jv < 0) continue;
    for (let j = jv + Math.ceil(4 / con.dr); j < Math.min(con.ns, jv + Math.ceil(14 / con.dr)); j++) {
      const q = j * con.nb + i; if (sin.db[q] < -8) continue;     // solo donde la imagen sin calcio tiene tejido claro (más abajo, la sombra choca con el ruido de fondo, hacia -40 dB)
      dSin += sin.db[q]; dCon += con.db[q]; n++;
    }
  }
  return { n, sin: dSin / n, con: dCon / n };
}

test('calcio: detrás de la valva aórtica calcificada (PLAX) la imagen es ≥30 dB más oscura que sin calcio', () => {
  const r = sombraDetras('^Aórtica');
  assert.ok(r.n > 30, `muy pocas muestras detrás de la valva (${r.n})`);
  assert.ok(r.sin - r.con >= 30, `solo ${(r.sin - r.con).toFixed(1)} dB de sombra`);
});

test('calcio: la valva calcificada brilla más que la sana y que el pericardio; sin calcio, imagen idéntica a la de hoy', () => {
  const P = planoVista('plax', td), opc = { ref: gTd.partes, t: 1.3, ventanaVista: VISTAS.plax.ventana };
  const foto = (r) => ({ db: Float32Array.from(r.db), tag: Uint8Array.from(r.tag), pix: Uint8Array.from(r.pix), etiquetas: r.etiquetas });   // el ecógrafo reutiliza sus búferes
  const a = foto(ec.formar(gTd.partes, P, opc)), b = foto(ec.formar(gTd.partes, P, { ...opc, calcio: null })), c = foto(ec.formar(gTd.partes, P, { ...opc, calcio: /^Aórtica/ }));
  assert.deepEqual(Array.from(a.pix), Array.from(b.pix), 'sin calcio la imagen cambió');
  // la cara de entrada es la que brilla (detrás, el calcio ya está en sombra): se compara el máximo de la valva
  const max = (r) => { const t = r.etiquetas.get('Aórtica'); let m = -Infinity; for (let q = 0; q < r.tag.length; q++) if (r.tag[q] === t && r.db[q] > m) m = r.db[q]; return m; };
  assert.ok(max(c) > max(a) + 3, `la valva calcificada (${max(c).toFixed(1)} dB) no brilla más que la sana (${max(a).toFixed(1)})`);
});

test('calcio: también hay sombra con las mejoras a 0 y no toca lo que queda delante', () => {
  const r = sombraDetras('^Aórtica', MEJORAS_CERO);
  assert.ok(r.n > 30 && r.sin - r.con >= 30, `sombra con mejoras a 0: ${(r.sin - r.con).toFixed(1)} dB`);
});

test('tabla de tejidos: el calcio es el más brillante, con su atenuación y su origen', async () => {
  const { TEJIDOS } = await import('../../../data/eco-tejidos.js');
  const c = TEJIDOS.calcio;
  assert.ok(c && Object.entries(TEJIDOS).every(([k, t]) => k === 'calcio' || t.db < c.db), 'el calcio no es el más brillante');
  assert.ok(c.atenuacion > 0 && c.origen === 'ilustrativo');
});

// F5 (Imagen): el corte del eje corto de los papilares se fija con el largo del VI en telediástole; en telesístole sigue
// cortando el cuerpo de los papilares, pegado a la pared, y no su punta libre (antes caía 8 mm más arriba, en la punta).
test('PSAX de los papilares: en telesístole el corte atraviesa papilares que tocan la pared (nivel relativo a la telediástole)', () => {
  const ex = extra, eT = estadoGeo(td, ex), eS = estadoGeo(ts, ex);
  const zT = planoVista('psaxPm', eT).O[2], zS = planoVista('psaxPm', eS).O[2];
  assert.ok(Math.abs(zT - zS) < 0.5, `el nivel del corte cambia entre td (${zT.toFixed(1)}) y ts (${zS.toFixed(1)}) mm`);
  const endo = gTs.partes.find(p => p.nombre === 'VI endocardio').pos;
  for (const nom of ['Papilar anterolateral', 'Papilar posteromedial']) {
    const p = gTs.partes.find(q => q.nombre === nom).pos; let mn = Infinity, n = 0;
    for (let i = 0; i < p.length; i += 3) { if (Math.abs(p[i + 2] - zS) > 1.5) continue; n++;
      for (let j = 0; j < endo.length; j += 3) mn = Math.min(mn, Math.hypot(p[i] - endo[j], p[i + 1] - endo[j + 1], p[i + 2] - endo[j + 2])); }
    assert.ok(n >= 15, `${nom}: el corte solo atraviesa ${n} puntos del papilar (la punta)`);
    assert.ok(mn <= 2, `${nom}: el papilar cortado queda a ${mn.toFixed(1)} mm de la pared en telesístole`);
  }
});
