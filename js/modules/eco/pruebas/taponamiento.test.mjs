// P1 (eco-mega, parada 2) · Taponamiento: colapso de la AD y del VD desde la presión TRANSMURAL del motor, y un saco
// pericárdico que abraza las aurículas con el derrame repartido como en el paciente tumbado (detrás primero).
// Fuentes de lo que se ve: Fisiopatología UCI · Cardiología, Ficha 11, «Taponamiento cardíaco» (el colapso pasivo de la
// pared libre de la AD es de los signos más precoces y precede al colapso diastólico del VD; El Libro Azul, parte 2,
// p. 65 del PDF) y Marino, cap. 21 (p. 64 del PDF: «diastolic collapse of the right ventricle»). El umbral de 1 mmHg, la
// «≥1/3 del ciclo» y el reparto del líquido son ilustrativos (plan de ideas, P1); la guía de pericardio de la ASE
// (Klein 2013) no está en docs/: hueco.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { construirCorazon } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { ESCENARIOS, aplicarEscenario } from '../escenarios.mjs';
import { planoVista, elementosDelCorte } from '../ecografia.mjs';

const OP = { pericardio: true, detalle: true };
const cache = new Map();
function paciente(k, g) {
  const clave = k + ':' + g; if (cache.has(clave)) return cache.get(clave);
  const m = crearMotor(); m.correr(10); if (k !== 'normal') aplicarEscenario(m, k, g); m.correr(30);
  const r = { m, o: m.onda, u: m.ultimo, ex: extraDeMotor(m), e: m.onda.map(s => estadoGeo(s)) };
  cache.set(clave, r); return r;
}
const fraccion = (e, k, umbral = 0.5) => e.filter(x => x[k] > umbral).length / e.length;
const maximo = (e, k) => Math.max(...e.map(x => x[k]));
const instanteMax = (p, k) => { let i = 0; p.e.forEach((x, j) => { if (x[k] > p.e[i][k]) i = j; }); return i; };
const dentroDeMalla = (pz) => {
  const D = [0.5773, 0.5774, 0.5773], E1 = [0.7071, -0.7071, 0], E2 = [D[1] * E1[2] - D[2] * E1[1], D[2] * E1[0] - D[0] * E1[2], D[0] * E1[1] - D[1] * E1[0]];
  const pr = (p) => [p[0] * E1[0] + p[1] * E1[1] + p[2] * E1[2], p[0] * E2[0] + p[1] * E2[1] + p[2] * E2[2]], C = 4, rej = new Map();
  const tri = []; for (let k = 0; k < pz.idx.length; k += 3) tri.push([0, 1, 2].map(j => [0, 1, 2].map(c => pz.pos[3 * pz.idx[k + j] + c])));
  tri.forEach((t, n) => { const q = t.map(pr), [x0, x1] = [Math.min(...q.map(a => a[0])), Math.max(...q.map(a => a[0]))], [y0, y1] = [Math.min(...q.map(a => a[1])), Math.max(...q.map(a => a[1]))];
    for (let i = Math.floor(x0 / C); i <= Math.floor(x1 / C); i++) for (let j = Math.floor(y0 / C); j <= Math.floor(y1 / C); j++) { const k = i + ',' + j; if (!rej.has(k)) rej.set(k, []); rej.get(k).push(n); } });
  return (p) => { let n = 0; const q = pr(p);
    for (const i of rej.get(Math.floor(q[0] / C) + ',' + Math.floor(q[1] / C)) || []) {
      const [a, b, c] = tri[i], e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const h = [D[1] * e2[2] - D[2] * e2[1], D[2] * e2[0] - D[0] * e2[2], D[0] * e2[1] - D[1] * e2[0]], det = e1[0] * h[0] + e1[1] * h[1] + e1[2] * h[2];
      if (Math.abs(det) < 1e-12) continue;
      const s = [p[0] - a[0], p[1] - a[1], p[2] - a[2]], u = (s[0] * h[0] + s[1] * h[1] + s[2] * h[2]) / det; if (u < 0 || u > 1) continue;
      const w = [s[1] * e1[2] - s[2] * e1[1], s[2] * e1[0] - s[0] * e1[2], s[0] * e1[1] - s[1] * e1[0]], v = (D[0] * w[0] + D[1] * w[1] + D[2] * w[2]) / det;
      if (v < 0 || u + v > 1) continue;
      if ((e2[0] * w[0] + e2[1] * w[1] + e2[2] * w[2]) / det > 1e-9) n++;
    }
    return n % 2 === 1; };
};
// volumen encerrado por una malla cerrada (teorema de la divergencia), mL
function volMalla(pa) { const P = pa.pos, I = pa.idx; let v = 0;
  for (let i = 0; i < I.length; i += 3) { const [a, b, c] = [I[i] * 3, I[i + 1] * 3, I[i + 2] * 3];
    v += P[a] * (P[b + 1] * P[c + 2] - P[b + 2] * P[c + 1]) - P[a + 1] * (P[b] * P[c + 2] - P[b + 2] * P[c]) + P[a + 2] * (P[b] * P[c + 1] - P[b + 1] * P[c]); }
  return Math.abs(v) / 6000; }

test('P1 · sin derrame no se pliega ninguna pared, en ningún escenario ni en ningún instante', () => {
  for (const k of Object.keys(ESCENARIOS)) {
    if (k === 'derrame') continue;
    const p = paciente(k);
    assert.equal(maximo(p.e, 'pliegueAd'), 0, `${k}: AD`); assert.equal(maximo(p.e, 'pliegueVd'), 0, `${k}: VD`);
  }
  // el derrame a 0 tampoco
  const p0 = paciente('derrame', 0);
  assert.equal(maximo(p0.e, 'pliegueAd') + maximo(p0.e, 'pliegueVd'), 0);
});

test('P1 · la AD se colapsa antes que el VD al crecer el derrame, y a fondo los dos (la AD ≥1/3 del ciclo)', () => {
  const G = [0.1, 0.2, 0.3, 0.43, 0.5, 0.6, 0.75, 0.9, 1];
  const primero = (k) => G.find(g => maximo(paciente('derrame', g).e, k) > 0.5);
  const gAd = primero('pliegueAd'), gVd = primero('pliegueVd');
  assert.ok(gAd != null && gVd != null, `AD desde ${gAd}, VD desde ${gVd}`);
  assert.ok(gAd < gVd, `la AD (desde g = ${gAd}) antes que el VD (desde g = ${gVd})`);
  const f = paciente('derrame', 1);
  assert.ok(fraccion(f.e, 'pliegueAd') >= 1 / 3, `AD plegada el ${(100 * fraccion(f.e, 'pliegueAd')).toFixed(0)} % del ciclo`);
  // el derrame por defecto (260 mL): la AD ya se pliega y el VD todavía no (el signo precoz)
  const d = paciente('derrame', ESCENARIOS.derrame.gravedad.defecto);
  assert.ok(maximo(d.e, 'pliegueAd') > 0.5 && maximo(d.e, 'pliegueVd') < 0.2);
});

test('P1 · cada colapso en su tiempo: la AD en telediástole y comienzo de la sístole; el VD en el llenado (diástole precoz), nunca eyectando', () => {
  for (const g of [0.75, 1]) {
    const p = paciente('derrame', g), pr = p.m.p.pr;
    // la AD: plegada al empezar la sístole ventricular (QRS: t = PR) y a lo largo de la contracción isovolumétrica
    const enQrs = p.o.reduce((a, b) => Math.abs(b.t - pr) < Math.abs(a.t - pr) ? b : a);
    assert.ok(estadoGeo(enQrs).pliegueAd > 0.5, `g ${g}: AD en el QRS ${estadoGeo(enQrs).pliegueAd.toFixed(2)}`);
    // el VD: se pliega al acabar la relajación y en el llenado rápido (E-F: la diástole precoz), con la tricúspide abierta
    // o a punto de abrirse; sigue plegado hasta la contracción auricular y nunca mientras eyecta
    const i0 = p.o.findLastIndex(s => s.qPul > 1), orden = [...p.o.keys()].map(k => (i0 + 1 + k) % p.o.length);
    const iOn = orden.find(i => p.e[i].pliegueVd > 0.5);
    assert.ok(iOn != null && 'EF'.includes(p.o[iOn].fase), `g ${g}: el VD empieza a plegarse en la fase ${p.o[iOn]?.fase}`);
    p.o.forEach((s, i) => { if (s.qPul > 1) assert.ok(p.e[i].pliegueVd < 0.05, `g ${g}: VD plegado eyectando (t ${s.t})`); });
  }
});

test('P1 · el pliegue se dibuja: la pared libre de la AD y la del VD se hunden y la cavidad conserva el volumen del motor', () => {
  const p = paciente('derrame', 1);
  for (const [k, pieza] of [['pliegueAd', 'AD'], ['pliegueVd', 'VD endocardio']]) {
    const s = p.o[instanteMax(p, k)], e = estadoGeo(s, p.ex), e0 = { ...e, [k]: 0 };
    const g = construirCorazon(e, { detalle: false }), g0 = construirCorazon(e0, { detalle: false });
    const a = g.partes.find(x => x.nombre === pieza).pos, b = g0.partes.find(x => x.nombre === pieza).pos;
    let hundido = 0; for (let i = 0; i < a.length; i += 3) hundido = Math.max(hundido, Math.hypot(a[i] - b[i], a[i + 1] - b[i + 1], a[i + 2] - b[i + 2]));
    assert.ok(hundido > 4, `${pieza}: la pared se mueve ${hundido.toFixed(1)} mm`);
  }
  // la AD plegada tiene los mL de la AD del motor (como sin pliegue, B2: ±12 %), medida en la AD más llena de las plegadas
  // del derrame por defecto (con el taponamiento a fondo la AD plegada está en el mínimo que se dibuja, 15 mL)
  const pd = paciente('derrame', ESCENARIOS.derrame.gravedad.defecto);
  const s = pd.o.filter((x, i) => pd.e[i].pliegueAd > 0.6).reduce((a, b) => (b.vad > a.vad ? b : a)), e = estadoGeo(s, pd.ex);
  assert.ok(s.vad > 20 && e.pliegueAd > 0.6, `AD de ${s.vad.toFixed(0)} mL plegada ${e.pliegueAd.toFixed(2)}`);
  // N1: la fosa oval (una lámina del tabique, pieza aparte con la malla de la AD) cuenta como pared de la AD
  const gAd = construirCorazon(e, { detalle: false }), ad0 = gAd.partes.find(x => x.nombre === 'AD'), fosaAd = gAd.partes.find(x => x.nombre === 'Fosa oval');
  const ad = { pos: ad0.pos, idx: Uint32Array.from([...ad0.idx, ...(fosaAd ? fosaAd.idx : [])]) };
  const P = ad.pos, I = ad.idx; let zMin = Infinity; for (let i = 2; i < P.length; i += 3) zMin = Math.min(zMin, P[i]);
  let n = 0, zs = 0; for (let i = 2; i < P.length; i += 3) if (P[i] < zMin + 2) { zs += P[i]; n++; }
  const z0 = zs / n; let v = 0;
  for (let i = 0; i < I.length; i += 3) { const [a, b, c] = [I[i] * 3, I[i + 1] * 3, I[i + 2] * 3];
    const A = [P[a], P[a + 1], P[a + 2] - z0], B = [P[b], P[b + 1], P[b + 2] - z0], C = [P[c], P[c + 1], P[c + 2] - z0];
    v += A[0] * (B[1] * C[2] - B[2] * C[1]) - A[1] * (B[0] * C[2] - B[2] * C[0]) + A[2] * (B[0] * C[1] - B[1] * C[0]); }
  const vAd = Math.abs(v) / 6000, vMotor = Math.max(s.vad, 15);   // LIMITES.au: la cúpula no baja de 15 mL
  assert.ok(Math.abs(vAd - vMotor) / vMotor < 0.12, `AD dibujada ${vAd.toFixed(1)} mL, motor ${s.vad.toFixed(1)} (dibujo desde 15)`);
});

// radio de una malla en el plano horizontal z0, en la dirección f0 (rayo desde el eje), tal como se dibuja (ya movida)
function radioEn(pz, z0, f0) {
  const P = pz.pos, I = pz.idx, dx = Math.cos(f0), dy = Math.sin(f0); let best = 0;
  for (let k = 0; k < I.length; k += 3) { const t = [0, 1, 2].map(j => [P[3 * I[k + j]], P[3 * I[k + j] + 1], P[3 * I[k + j] + 2]]), q = [];
    for (let e = 0; e < 3; e++) { const a = t[e], b = t[(e + 1) % 3]; if ((a[2] < z0) !== (b[2] < z0)) { const f = (z0 - a[2]) / (b[2] - a[2]); q.push([a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1])]); } }
    if (q.length !== 2) continue; const [A, B] = q, ex = B[0] - A[0], ey = B[1] - A[1], den = dx * ey - dy * ex; if (Math.abs(den) < 1e-12) continue;
    const tt = (A[0] * ey - A[1] * ex) / den, ss = (A[0] * dy - A[1] * dx) / den; if (tt > 0 && ss >= 0 && ss <= 1) best = Math.max(best, tt); }
  return best;
}
// grosor del líquido en una dirección: radio del saco con derrame menos sin derrame, a una altura dada
function grosor(liq, z0, f0) {
  const p = paciente('normal'), s = p.o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const radio = (L) => radioEn(construirCorazon({ ...estadoGeo(s, p.ex), liquidoPeri: L }, OP).partes.find(x => x.nombre === 'Pericardio'), z0, f0);
  return radio(liq) - radio(0);
}

test('P1 · el líquido empieza por detrás (lo declive con el paciente tumbado) y al crecer rodea al VD y a la AD', () => {
  const zV = -30;   // tercio medio de los ventrículos (el corazón ya movido: el saco se mide tal como se ve)
  const atras = grosor(60, zV, -Math.PI / 2), delante = grosor(60, zV, Math.PI / 2);
  assert.ok(atras > 2 * delante && atras > 3, `60 mL: detrás ${atras.toFixed(1)} mm, delante ${delante.toFixed(1)} mm`);
  const atrasG = grosor(388, zV, -Math.PI / 2), delanteG = grosor(388, zV, Math.PI / 2), ad = grosor(388, 15, Math.PI);
  assert.ok(delanteG > 8, `388 mL: delante ${delanteG.toFixed(1)} mm (detrás ${atrasG.toFixed(1)})`);
  assert.ok(ad > 6, `388 mL: junto a la AD ${ad.toFixed(1)} mm`);
});

test('P1 · el líquido dibujado es el del motor (±10 %)', () => {
  const p = paciente('normal'), s = p.o[0];
  const vol = (L) => volMalla(construirCorazon({ ...estadoGeo(s, p.ex), liquidoPeri: L }, OP).partes.find(x => x.nombre === 'Pericardio'));
  const v0 = vol(0);
  for (const L of [60, 260, 388]) { const dv = vol(L) - v0; assert.ok(Math.abs(dv - L) / L < 0.1, `${L} mL: dibujados ${dv.toFixed(0)} mL`); }
});

// instantes que se prueban de cada grado de derrame: telediástole, telesístole y los dos pliegues máximos
function instantes(g) {
  const p = paciente('derrame', g), o = p.o;
  return [o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), o.reduce((a, b) => (b.vvi < a.vvi ? b : a)), o[instanteMax(p, 'pliegueAd')], o[instanteMax(p, 'pliegueVd')]]
    .map(s => ({ p, e: estadoGeo(s, p.ex) }));
}

test('P1 · nada se cruza con el derrame: el corazón dentro del líquido y el líquido dentro del saco, también plegado y a fondo', () => {
  const dentro = /^(VI |VD |Infundíbulo|AI$|AD$|Orejuela|Base V|Raíz aórtica|Papilar|Banda|Grasa|Coronaria|Seno coronario)/;
  for (const g of [0.2, ESCENARIOS.derrame.gravedad.defecto, 1]) for (const { e } of instantes(g)) {
    const geo = construirCorazon(e, OP);
    const saco = geo.partes.find(x => x.nombre === 'Pericardio'), der = geo.partes.find(x => x.nombre === 'Derrame');
    const enSaco = dentroDeMalla(saco), enDer = dentroDeMalla(der);
    for (const pz of geo.partes) { if (!pz.pos) continue;
      for (let i = 0; i < pz.pos.length; i++) assert.ok(Number.isFinite(pz.pos[i]), `${pz.nombre}: coordenada no finita`);
      if (!dentro.test(pz.nombre)) continue;
      for (let i = 0; i < pz.pos.length; i += 3 * 3) { const q = [pz.pos[i], pz.pos[i + 1], pz.pos[i + 2]];
        assert.ok(enDer(q), `${pz.nombre} fuera del derrame (${q.map(x => x.toFixed(0))}) g ${g}`); } }
    for (let i = 0; i < der.pos.length; i += 3 * 5) { const q = [der.pos[i], der.pos[i + 1], der.pos[i + 2]]; assert.ok(enSaco(q), `derrame fuera del saco g ${g}`); }
  }
});

// ¿Está (x, y) dentro de la sopa de segmentos [x0, y0, x1, y1, …] de un corte? (paridad con un rayo horizontal)
function dentroCorte(seg, x, y) { let n = 0;
  for (let i = 0; i < seg.length; i += 4) { const [x0, y0, x1, y1] = [seg[i], seg[i + 1], seg[i + 2], seg[i + 3]];
    if ((y0 > y) !== (y1 > y) && x < x0 + (y - y0) * (x1 - x0) / (y1 - y0)) n++; }
  return n % 2 === 1; }

test('P1 · el saco cubre las aurículas en todas las vistas (sin derrame, con derrame y en el taponamiento)', () => {
  const vistas = ['plax', 'psaxAo', 'psaxMv', 'a4c', 'a2c', 'a3c', 'sc4c'];
  let vistas_con_auricula = 0;
  for (const g of [0, 0.43, 1]) for (const { e } of g === 0 ? [{ e: estadoGeo(paciente('normal').o[0], paciente('normal').ex) }] : instantes(g)) {
    const geo = construirCorazon(e, OP);
    for (const v of vistas) {
      const els = elementosDelCorte(geo.partes, planoVista(v, e)), masc = els[0].seg;
      for (const el of els) { if (!/^(AI|AD)$/.test(el.grupo || '')) continue; vistas_con_auricula++;
        for (let i = 0; i < el.seg.length; i += 2) assert.ok(dentroCorte(masc, el.seg[i] + 1e-3, el.seg[i + 1] + 1e-3), `${v}: ${el.grupo} fuera del saco (g ${g})`); }
    }
  }
  assert.ok(vistas_con_auricula > 20, `se cortan aurículas en ${vistas_con_auricula} casos`);
});

// R1 (eco-mega, parada 3) · el saco del derrame grande es una lámina lisa que abraza al corazón: en los cortes de la eco no hay
// esquinas (la caja del subcostal 4C, la V del apical 4C) ni saltos de la distancia al corazón. Con poco líquido sigue pegado.
import { cortes, estadoGeo as estadoGeoR1, pacienteDerrame, telediastole } from '../../../../autonomo/bloques/eco-mega/herramientas/saco-contorno.mjs';
test('R1 · a 388 mL, el contorno del saco en A4C, SC4C y PLAX no tiene esquinas (<120° a 12 mm) ni saltos de distancia al corazón', () => {
  const p = pacienteDerrame(1), e = estadoGeoR1(telediastole(p), p.ex);
  for (const v of ['a4c', 'sc4c', 'plax']) {
    const c = cortes(1, v, e), n = c.pts.length;
    assert.ok(n > 100, `${v}: contorno de ${n} puntos`);
    const mn = Math.min(...c.ang); assert.ok(mn >= 120, `${v}: esquina de ${mn.toFixed(0)}°`);
    let salto = 0; for (let i = 0; i < n; i++) salto = Math.max(salto, Math.abs(c.dist[i] - c.dist[(i + 1) % n]));
    assert.ok(salto <= 4.5, `${v}: la distancia saco-corazón salta ${salto.toFixed(1)} mm en 3 mm de contorno`);
  }
});

test('R1 · con poco líquido (60 mL) el saco sigue pegado: detrás crece menos de 7 mm frente a sin derrame', () => {
  const p = paciente('normal'), e = estadoGeo(p.o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), p.ex);
  const radio = (L) => radioEn(construirCorazon({ ...e, liquidoPeri: L }, OP).partes.find(x => x.nombre === 'Pericardio'), -30, -Math.PI / 2);
  const d60 = radio(60) - radio(0); assert.ok(d60 < 7, `60 mL: el saco crece ${d60.toFixed(1)} mm detrás`);
});

// R2 · la pared libre de la AD y la del VD se INVAGINAN (concavidad hacia la luz, con sangre a los dos lados del pliegue)
// en vez de borrar la cámara. Utilidades de contorno: autonomo/bloques/eco-mega/herramientas/r2-contorno.mjs
import { contornoPared, area } from '../../../../autonomo/bloques/eco-mega/herramientas/r2-contorno.mjs';
const giro = (b, i, k = 4) => { const n = b.length, a = b[(i + n - k) % n], q = b[i], c = b[(i + k) % n];
  const u = [q[0] - a[0], q[1] - a[1]], v = [c[0] - q[0], c[1] - q[1]]; return Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]); };
const orient = (b) => Math.sign(b.reduce((s, p, i) => s + p[0] * b[(i + 1) % b.length][1] - b[(i + 1) % b.length][0] * p[1], 0));
const distA = (q, b) => Math.min(...b.map(p => Math.hypot(p[0] - q[0], p[1] - q[1])));
for (const [k, pieza, vista] of [['pliegueAd', 'AD', 'a4c'], ['pliegueVd', 'VD', 'psaxPm']]) {
  test(`R2 · a 388 mL, la pared libre de la ${pieza} en ${vista} se invagina: cóncava hacia la luz, con luz a los dos lados`, async () => {
    const p = paciente('derrame', 1), s = p.o[instanteMax(p, k)], e = estadoGeo(s, p.ex);
    assert.ok(e[k] > 0.9, `pliegue ${e[k].toFixed(2)}`);
    const f = (await contornoPared(e, pieza, vista)).pts, s0 = (await contornoPared({ ...e, [k]: 0 }, pieza, vista)).pts;
    // puntos desplazados por el pliegue (entran en la luz del corte sin plegar, > 40 % del máximo hundimiento): la mayor tanda seguida, y su tercio medio
    const dentro = (q, b) => { let c = false; for (let i = 0, j = b.length - 1; i < b.length; j = i++) if ((b[i][1] > q[1]) !== (b[j][1] > q[1]) && q[0] < (b[j][0] - b[i][0]) * (q[1] - b[i][1]) / (b[j][1] - b[i][1]) + b[i][0]) c = !c; return c; };
    const dd = f.map(q => dentro(q, s0) ? distA(q, s0) : 0), dm = Math.max(...dd), des = dd.map(x => x > 0.4 * dm), n = f.length;
    assert.ok(dm > 3, `hundimiento máximo ${dm.toFixed(1)} mm`);
    let ini = 0, lon = 0; for (let i = 0; i < n; i++) { if (!des[i]) continue; let l = 0; while (l < n && des[(i + l) % n]) l++; if (l > lon && l < n) { lon = l; ini = i; } }
    assert.ok(lon >= 6, `tanda desplazada de ${lon} puntos`);
    const medio = Array.from({ length: Math.max(1, Math.floor(lon / 3)) }, (_, j) => (ini + Math.floor(lon / 3) + j) % n);
    const sig = orient(f), cur = medio.map(i => giro(f, i) * sig).reduce((a, b) => a + b, 0) / medio.length;   // < 0: cóncavo hacia la luz
    assert.ok(cur < -0.05, `curvatura media del tercio medio ${cur.toFixed(3)} rad (cóncava < 0)`);
    // la cámara sigue con luz a los lados: conserva al menos el 35 % del área del mismo corte sin pliegue y el hundimiento no la parte en dos (el volumen es el del motor: lo que pierde en el pliegue lo recoloca en los extremos, por eso el área puede subir)
    const a = area(f), a0 = area(s0);
    assert.ok(a / a0 > 0.35 && a / a0 < 1.25, `área ${a.toFixed(0)} frente a ${a0.toFixed(0)} mm² sin pliegue`);
    const punta = f[medio[Math.floor(medio.length / 2)]], lejos = f.filter((_, i) => { const d = Math.min((i - ini + n) % n, (ini - i + n) % n); return d > n / 4; });
    assert.ok(distA(punta, lejos) > 2, `la punta del pliegue queda a ${distA(punta, lejos).toFixed(1)} mm de la pared de enfrente`);
  });
}

test('R2 · el pliegue de la AD es local: solo se mueve la pared libre (≤12 % de la malla más de 1 mm) y el hundimiento llega a ≥6 mm', () => {
  const p = paciente('derrame', 1), e = estadoGeo(p.o[instanteMax(p, 'pliegueAd')], p.ex);
  const a = construirCorazon(e, { detalle: false }).partes.find(x => x.nombre === 'AD').pos, b = construirCorazon({ ...e, pliegueAd: 0 }, { detalle: false }).partes.find(x => x.nombre === 'AD').pos;
  let n = 0, mx = 0; for (let i = 0; i < a.length; i += 3) { const d = Math.hypot(a[i] - b[i], a[i + 1] - b[i + 1]); if (d > 1) n++; mx = Math.max(mx, d); }
  assert.ok(n / (a.length / 3) <= 0.12, `${(100 * n / (a.length / 3)).toFixed(0)} % de la malla movida`);
  assert.ok(mx >= 6, `hundimiento ${mx.toFixed(1)} mm`);
});
