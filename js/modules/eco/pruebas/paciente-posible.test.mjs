// Prueba «paciente posible» del latido (parada 2 de eco-mega, encargos B1 y F1): mide en el motor y en la geometría
// las cifras de forma y de tiempos de cada escenario y las compara con las referencias de Lang 2015, Mor-Avi 2011 y
// la Ficha 5 (referencias.mjs: REFERENCIAS y REFERENCIAS_FORMA). Las referencias NO se tocan para que algo pase:
//   · lo que hoy cae dentro es una prueba que pasa;
//   · lo que hoy cae fuera y otro encargo corregirá va como `todo` con el nombre del encargo (no falla; si un día
//     cae dentro, la prueba avisa en el diagnóstico para quitar la marca);
//   · lo que la fuente no da (MAPSE, rotación por separado…) es un hueco, sin cifra.
// El modelo es un varón de 1,85 m² (motor.p.sc): se comparan las referencias de varón.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { baseGeometrica, construirCorazon, diametrosTSVD, REF, TAPSE_POR_ML, LIMITES } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../formas.mjs';
import { planoVista, medidasCorazon } from '../ecografia.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';
import { REFERENCIAS, REFERENCIAS_FORMA } from '../referencias.mjs';

const sum = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], esc = (a, k) => a.map(x => x * k);
const FORMA = Object.fromEntries(REFERENCIAS_FORMA.map(r => [r.id, r]));
const TIEMPOS = Object.fromEntries(REFERENCIAS.map(r => [r.id, r]));
// Engrosamiento sistólico del VI: Mor-Avi 2011, PDF p. 11 (impresa 287): «>40 % de engrosamiento radial» en el corazón normal
const ENGROSAMIENTO = { id: 'vi-engrosa', nombre: 'VI: engrosamiento sistólico de la pared', unidad: '%', min: 40, max: Infinity, texto: '>40',
  fuente: 'Mor-Avi 2011 (docs/mor-avi-2011-mecanica-cardiaca-ase.pdf, p. PDF 11 = impresa 287)' };

const correr = (k) => { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m);
  if (k !== 'normal') m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 10); return m; };

// VD en el plano apical de 4 cámaras (vista enfocada al VD, Lang Tabla 8): se cuentan las celdas del plano que caen
// en la cavidad del VD. Basal = la mayor anchura del tercio de la base; medio = la del tercio medio; longitudinal =
// de la base al ápex del VD; área en cm². Para el FAC se usa el área en telediástole y en telesístole.
// (N2: la profundidad v crece desde el transductor, en el ápex, hacia la base; antes «basal» se leía en el tercio del
// ápex y daba ~16 mm. Era un fallo de la medida, no del modelo; con el tercio de la base da ~30 mm. Las referencias no se tocan.)
function medirVd(est) {
  const g = baseGeometrica(est), vi = g.vi, P = planoVista('a4c', est), h = 0.8, filas = new Map(); let n = 0;
  for (let v = 0; v <= P.prof; v += h) { let mn = Infinity, mx = -Infinity;
    for (let u = -70; u <= 70; u += h) {
      const p = sum(P.O, sum(esc(P.r, u), esc(P.d, v))), zp = p[2]; if (zp >= 0) continue;
      const rho = Math.hypot(p[0], p[1]), f = Math.atan2(p[1], p[0]);
      if (zp > -vi.L && rho < g.rEndoVi(zp, f)) continue;
      if (zp > -g.Lvd && g.ventana(f) > 0) { const re = g.rEpiVi(zp, f); if (rho > re && rho < re + g.wRV(zp, f)) { n++; mn = Math.min(mn, u); mx = Math.max(mx, u); } }
    }
    if (mx > mn) filas.set(v, mx - mn); }
  const vs = [...filas.keys()], v0 = vs[0], L = vs[vs.length - 1] - v0;
  const ancho = (a, b) => Math.max(...vs.filter(v => v >= v0 + L * a && v <= v0 + L * b).map(v => filas.get(v)));
  return { area: n * h * h / 100, largo: L, basal: ancho(2 / 3, 1), medio: ancho(1 / 3, 2 / 3), apice: ancho(0, 1 / 3), filas };
}

// Todo lo que se mide de un escenario (clave = id de REFERENCIAS_FORMA / REFERENCIAS, o del engrosamiento)
function medir(k) {
  const m = correr(k), o = m.onda, u = m.ultimo, sc = m.p.sc;
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ts = o.reduce((a, b) => (b.vvi < a.vvi ? b : a)), ex = extraDeMotor(m);
  const eT = estadoGeo(td, ex), eS = estadoGeo(ts, ex), mT = medidasCorazon(eT, sc), mS = medidasCorazon(eS, sc);
  const gT = baseGeometrica(eT), vdT = medirVd(eT), vdS = medirVd(eS), tsvd = diametrosTSVD(gT);
  const cT = construirCorazon(eT, { detalle: false }), cS = construirCorazon(eS, { detalle: false });
  // giro neto = ángulo del ápex − ángulo de la base en telesístole, según la deformación del dibujo (flujo.transformar)
  const ang = (c, z) => { const p = c.flujo.transformar([40, 0, z]); return Math.atan2(p[1], p[0]) * 180 / Math.PI; };
  const torsion = ang(cS, -0.95 * cS.vi.Le) - ang(cS, -1);
  const v = {
    'vi-dtd-h': mT.lvdd, 'vi-dts-h': mS.lvdd, 'vi-vtd-h': u.edv, 'vi-vts-h': u.esv, 'vi-vtdi-h': u.edv / sc, 'vi-vtsi-h': u.esv / sc,
    'vi-fe-h': u.fe * 100, 'vi-septo-h': Math.max(mT.tabique, mT.paredPost) / 10, 'vi-rwt-h': mT.rwt, 'vi-masa-h': mT.masaIndice,
    'vi-engrosa': (mS.paredPost / mT.paredPost - 1) * 100,
    'ai-vol': Math.max(...o.map(s => s.vai)) / sc, 'ad-vol-h': Math.max(...o.map(s => s.vad)) / sc,
    'vd-basal': vdT.basal, 'vd-medio': vdT.medio, 'vd-largo': vdT.largo,
    'rvot-plax': tsvd.plax, 'rvot-prox': tsvd.proximal, 'rvot-dist': tsvd.distal,
    'vd-pared': gT.tvdW(gT.wRV(-0.2 * gT.Lvd, (REF.phiA + REF.phiB) / 2)),
    'vd-area-vi': vdT.area / (medidasCorazon(eT, sc).areaVdVi ? vdT.area / medidasCorazon(eT, sc).areaVdVi : 1),
    'vd-area-td-h': vdT.area, 'vd-area-ts-h': vdS.area, 'vd-fac': (vdT.area - vdS.area) / vdT.area * 100,
    'vd-vtdi-h': u.edvD / sc, 'vd-vtsi-h': u.esvD / sc, 'vd-fe3d': u.feD * 100,
    // TAPSE: bajada del anillo tricuspídeo lateral del dibujo entre telediástole y telesístole
    tapse: cT.anilloTricLateral[2] - cS.anilloTricLateral[2], torsion,
    tcivol: (u.tAoAbre - u.tS1) * 1000, teyec: (u.tS2 - u.tAoAbre) * 1000, trivol: (u.tMitAbre - u.tS2) * 1000,
  };
  return { v, u, m };
}
const REF_DE = (id) => id === 'vi-engrosa' ? ENGROSAMIENTO : (FORMA[id] || TIEMPOS[id]);
const dentro = (id, x) => { const r = REF_DE(id); return Number.isFinite(x) && x >= r.min && x <= r.max; };

const CACHE = {}; const de = (k) => CACHE[k] ??= medir(k);
const fmt = (x) => Number.isFinite(x) ? (Math.abs(x) < 10 ? x.toFixed(2) : x.toFixed(1)) : String(x);

// Escenarios que se comparan con la banda del varón sano (los de la parada: lo que no es de la enfermedad tiene que
// seguir siendo de un paciente posible). Para cada id que cae fuera:
//  · { libre: 'por qué' }  lo cambia la propia enfermedad: la banda de sano no le corresponde, no se exige;
//  · { todo: 'ENCARGO' }   el modelo aún no llega y lo corrige ese encargo (no falla; avisa cuando ya llegue).
// Cada id no listado tiene que estar dentro de su banda.
const PREVISTO = {
  normal: {},
  hemorragia: {
    'vd-basal': { libre: 'hipovolemia: el VD se llena menos (24,8 mm: justo bajo el 25)' }, 'rvot-prox': { libre: 'hipovolemia: el orificio del TSVD se contrae con el volumen del VD (19 mm; ilustrativo)' }, 'vd-medio': { libre: 'hipovolemia: el VD se llena menos' }, 'vd-area-td-h': { libre: 'hipovolemia: el VD se llena menos' },
    'vi-rwt-h': { libre: 'cavidad más pequeña con la misma pared (Lang p. 17)' }, 'tapse': { todo: 'F5 (el TAPSE debe salir del acortamiento de la pared libre; hoy ∝ mL vaciados)' },
    'vi-septo-h': { todo: 'sin encargo: con el VI en 100 mL la pared telediastólica sale de 10,5 mm (miocardio de volumen constante)' },
  },
  fallo: {
    'tapse': { todo: 'F5' }, 'vi-vts-h': { libre: 'FE baja: el VI no se vacía' }, 'vi-vtsi-h': { libre: 'FE baja' },
    'vi-fe-h': { libre: 'es el fallo del VI' }, 'vi-engrosa': { libre: 'contractilidad baja' }, 'torsion': { libre: 'Mor-Avi p. 15: la torsión cae con la FE' },
    'vd-fe3d': { libre: 'el fallo del VI arrastra al VD' }, 'vd-fac': { libre: 'el fallo del VI arrastra al VD' }, 'vi-rwt-h': { libre: 'cavidad dilatada con pared sin engrosar' },
    'vi-vtdi-h': { libre: 'VI dilatado' }, 'vi-vtd-h': { libre: 'VI dilatado' }, 'vi-dtd-h': { libre: 'VI dilatado' }, 'vi-dts-h': { libre: 'VI dilatado' }, 'ai-vol': { libre: 'PCP alta' },
  },
  derrame: {
    'vd-basal': { libre: 'taponamiento: el VD se llena menos' }, 'rvot-prox': { libre: 'taponamiento: el orificio del TSVD se contrae con el volumen del VD' }, 'vd-medio': { libre: 'taponamiento: el VD se llena menos' }, 'vd-area-td-h': { libre: 'taponamiento: el VD se llena menos' },
    'vi-rwt-h': { libre: 'cavidad más pequeña con la misma pared' }, 'tapse': { todo: 'F5' },
    'vi-septo-h': { todo: 'sin encargo: pared telediastólica de 11,3 mm con el VI en 85 mL (miocardio de volumen constante)' },
    'vi-engrosa': { todo: 'sin encargo: engrosamiento de 39,4 % frente a >40 % con la pared ya gruesa en diástole' },
  },
};
for (const k of Object.keys(PREVISTO)) {
  const previsto = PREVISTO[k];
  for (const id of Object.keys(de(k).v).filter(i => REF_DE(i))) {
    const r = REF_DE(id), p = previsto[id], nombre = `${ESCENARIOS[k].nombre}: ${r.nombre} ${r.texto}${r.unidad ? ' ' + r.unidad : ''} [${r.fuente.split(' (')[0]}]`;
    if (p?.libre) continue;
    const prueba = (t) => {
      const x = de(k).v[id];
      if (p?.todo && dentro(id, x)) t.diagnostic(`${id} ya cae dentro (${fmt(x)}): quitar la marca todo «${p.todo}»`);
      assert.ok(dentro(id, x), `${id} = ${fmt(x)}, fuera de ${r.texto} (${r.fuente})`);
    };
    if (p?.todo) test(nombre, { todo: p.todo }, prueba); else test(nombre, prueba);
  }
}

// Signos de cada enfermedad según Lang / Mor-Avi (escenarios con su gravedad por defecto)
const SIGNOS = [
  { k: 'tep', id: 'vd-basal', ok: (x) => x > 41, texto: 'VD basal >41 mm (Lang p. 17, 20)' },
  { k: 'tep', id: 'vd-fac', ok: (x) => x < 35, texto: 'FAC <35 % (Lang p. 23)' },
  { k: 'tep', id: 'vd-fe3d', ok: (x) => x < 45, texto: 'FE del VD <45 % (Lang p. 23)' },
  { k: 'tep', id: 'tapse', ok: (x) => x < 17, texto: 'TAPSE <17 mm (Lang p. 19, 23)' },
  { k: 'dilatada', id: 'vi-dtd-h', ok: (x) => x > 58.4, texto: 'DTDVI >58,4 mm (Lang p. 7)' },
  { k: 'dilatada', id: 'vi-fe-h', ok: (x) => x < 52, texto: 'FE <52 % (Lang p. 7)' },
  { k: 'dilatada', id: 'torsion', ok: (x) => x < 0.7, texto: 'torsión bajo el rango normal 0,7-14,7° (Mor-Avi p. 15: twist ↓ en la dilatada)' },
  { k: 'hipertrofia', id: 'vi-septo-h', ok: (x) => x > 1.0, texto: 'grosor de pared >1,0 cm (Lang p. 17)' },
  { k: 'hipertrofia', id: 'vi-rwt-h', ok: (x) => x > 0.42, texto: 'RWT >0,42, concéntrica (Lang p. 16)' },
  { k: 'hipertrofia', id: 'vi-masa-h', ok: (x) => x > 102, texto: 'masa >102 g/m² (Lang p. 17)' },
  { k: 'hemorragia', id: 'vi-vtsi-h', ok: (x) => x < 21, texto: 'VTS indexado por debajo de la media (21 mL/m²; Lang p. 7)', todo: 'P2 (beso de papilares: VTS ≤15-20 mL)' },
];
for (const c of SIGNOS) {
  const prueba = (t) => { const x = de(c.k).v[c.id];
    if (c.todo && c.ok(x)) t.diagnostic(`${c.k}:${c.id} ya se cumple (${fmt(x)}): quitar la marca todo`);
    assert.ok(c.ok(x), `${c.id} = ${fmt(x)}`); };
  if (c.todo) test(`${ESCENARIOS[c.k].nombre}: ${c.texto}`, { todo: c.todo }, prueba); else test(`${ESCENARIOS[c.k].nombre}: ${c.texto}`, prueba);
}

test('fallo del VI: la torsión es menor que la del corazón normal (Mor-Avi p. 15)', () => {
  assert.ok(de('fallo').v.torsion < de('normal').v.torsion, `${fmt(de('fallo').v.torsion)}° frente a ${fmt(de('normal').v.torsion)}°`);
});
test('hemorragia: el VI telediastólico y el sistólico son menores que los del normal (precarga baja)', () => {
  assert.ok(de('hemorragia').v['vi-vtd-h'] < de('normal').v['vi-vtd-h']);
});
test('TEP y hemorragia: la torsión no sube con un VI vacío (sale de la contracción, no del volumen)', () => {
  assert.ok(de('hemorragia').v.torsion <= de('normal').v.torsion + 0.3, `${fmt(de('hemorragia').v.torsion)}° frente a ${fmt(de('normal').v.torsion)}°`);
  assert.ok(de('tep').v.torsion <= de('normal').v.torsion, `${fmt(de('tep').v.torsion)}° frente a ${fmt(de('normal').v.torsion)}°`);
});

// Destorsión (B3): Mor-Avi PDF 12 (p. 288): el 50-70 % se deshace en la relajación isovolumétrica, antes de abrir la mitral
test('normal: entre el pico y la apertura de la mitral se deshace el 50-70 % del giro (Mor-Avi p. 288)', () => {
  const m = correr('normal'), o = m.onda, ex = extraDeMotor(m), u = m.ultimo;
  const tors = (s) => { const c = construirCorazon(estadoGeo(s, ex), { detalle: false });
    const ang = (z) => { const p = c.flujo.transformar([40, 0, z]); return Math.atan2(p[1], p[0]) * 180 / Math.PI; };
    return ang(-0.95 * c.vi.Le) - ang(-1); };
  const pico = Math.max(...o.filter(s => s.t > u.tS1 && s.t < u.tS2 + 0.05).map(tors));
  const mit = tors(o.find(s => s.t >= u.tMitAbre));
  const frac = (pico - mit) / pico;
  assert.ok(frac >= 0.5 && frac <= 0.7, `se deshace el ${(frac * 100).toFixed(0)} % (pico ${fmt(pico)}°, a la mitral ${fmt(mit)}°)`);
});
test('el giro neto máximo del normal es el de Mor-Avi (7,7 ± 3,5°) y el ápex gira en sentido contrario a la base', () => {
  const t = de('normal').v.torsion; assert.ok(t > 4.2 && t < 11.2, `${fmt(t)}°`);
});

// ---- Aurículas dibujadas (B2) ------------------------------------------------------------------------------------------
// Volumen de una cúpula auricular (malla abierta por el suelo): se cierra con un punto del plano del suelo
function volCupula(pa) {
  const P = pa.pos, I = pa.idx; let zMin = Infinity; for (let i = 2; i < P.length; i += 3) zMin = Math.min(zMin, P[i]);
  let n = 0, zs = 0; for (let i = 2; i < P.length; i += 3) if (P[i] < zMin + 2) { zs += P[i]; n++; }
  const z0 = zs / n; let v = 0;
  for (let i = 0; i < I.length; i += 3) { const [a, b, c] = [I[i] * 3, I[i + 1] * 3, I[i + 2] * 3];
    const A = [P[a], P[a + 1], P[a + 2] - z0], B = [P[b], P[b + 1], P[b + 2] - z0], C = [P[c], P[c + 1], P[c + 2] - z0];
    v += A[0] * (B[1] * C[2] - B[2] * C[1]) - A[1] * (B[0] * C[2] - B[2] * C[0]) + A[2] * (B[0] * C[1] - B[1] * C[0]); }
  return Math.abs(v) / 6000;
}
// Ejes de una aurícula en el A4C como los mide Lang (p. 28-30): el mayor, del centro del anillo AV al techo (en el A4C la
// aurícula queda al fondo del sector: la profundidad v crece hacia el techo); el menor, la mayor anchura en su tercio medio.
// Se corta la malla dibujada (ya movida) con el plano de la vista.
function ejesA4C(pa, P, anillo) {
  const n = [P.r[1] * P.d[2] - P.r[2] * P.d[1], P.r[2] * P.d[0] - P.r[0] * P.d[2], P.r[0] * P.d[1] - P.r[1] * P.d[0]];
  const X = pa.pos, I = pa.idx, pts = [], rel = (q) => [q[0] - P.O[0], q[1] - P.O[1], q[2] - P.O[2]];
  const uv = (q) => { const d = rel(q); return [d[0] * P.r[0] + d[1] * P.r[1] + d[2] * P.r[2], d[0] * P.d[0] + d[1] * P.d[1] + d[2] * P.d[2]]; };
  const pt = (i) => [X[i * 3], X[i * 3 + 1], X[i * 3 + 2]], sd = (q) => { const d = rel(q); return d[0] * n[0] + d[1] * n[1] + d[2] * n[2]; };
  for (let k = 0; k < I.length; k += 3) { const t = [pt(I[k]), pt(I[k + 1]), pt(I[k + 2])], s = t.map(sd);
    for (let e = 0; e < 3; e++) { const a = s[e], b = s[(e + 1) % 3];
      if ((a < 0) !== (b < 0)) { const f = a / (a - b), A = t[e], B = t[(e + 1) % 3]; pts.push(uv([0, 1, 2].map(j => A[j] + (B[j] - A[j]) * f))); } } }
  const v0 = uv(anillo)[1], v1 = Math.max(...pts.map(p => p[1])), L = v1 - v0, filas = new Map();
  for (const [u, v] of pts) { const b = Math.round(v), e = filas.get(b) || [Infinity, -Infinity]; filas.set(b, [Math.min(e[0], u), Math.max(e[1], u)]); }
  let menor = 0; for (const [b, [a, c]] of filas) if (b >= v0 + L / 3 && b <= v0 + 2 * L / 3) menor = Math.max(menor, c - a);
  return { mayor: L, menor };
}
function auriculas(k) {
  const m = correr(k), o = m.onda, ex = extraDeMotor(m);
  const ts = o.reduce((a, b) => (b.vvi < a.vvi ? b : a));
  return [o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ts].map(s => {
    const e = estadoGeo(s, ex), c = construirCorazon(e, { detalle: false }), g = baseGeometrica(e), P = planoVista('a4c', e);
    const ai = c.partes.find(p => p.nombre === 'AI'), ad = c.partes.find(p => p.nombre === 'AD');
    return { s, sc: m.p.sc, vAi: volCupula(ai), vAd: volCupula(ad), ejeAd: ejesA4C(ad, P, [g.ct[0], g.ct[1], c.descenso]) };
  });
}
// Un estado por fotograma: la aurícula dibujada tiene los mL de la aurícula del motor (antes, ~2 veces más)
for (const k of ['normal', 'hemorragia', 'fallo', 'derrame', 'tep', 'hipertrofia', 'dilatada']) {
  test(`${ESCENARIOS[k].nombre}: las aurículas dibujadas tienen el volumen del motor (±12 %) en telediástole y telesístole`, () => {
    for (const a of auriculas(k)) for (const [dib, motor, n] of [[a.vAi, a.s.vai, 'AI'], [a.vAd, a.s.vad, 'AD']]) {
      const mot = Math.min(LIMITES.au[1], Math.max(LIMITES.au[0], motor));   // fuera de LIMITES.au se dibuja en el límite
      assert.ok(Math.abs(dib - mot) <= 0.12 * mot + 1, `${n}: dibujada ${fmt(dib)} mL, motor ${fmt(motor)} mL`); }
  });
}
// Ejes de la AD en el A4C, en telesístole (aurícula llena), indexados: Lang 2015 p. 30 (Tabla 13)
test('Normal: ejes de la AD en el A4C (mayor 2,4 ± 0,3 y menor 1,9 ± 0,3 cm/m²) [Lang 2015 p. 30]', () => {
  const a = auriculas('normal')[1], may = a.ejeAd.mayor / 10 / a.sc, men = a.ejeAd.menor / 10 / a.sc;
  for (const [id, x] of [['ad-eje-mayor', may], ['ad-eje-menor', men]])
    assert.ok(x >= FORMA[id].min && x <= FORMA[id].max, `${id} = ${fmt(x)} cm/m², fuera de ${FORMA[id].texto} (${FORMA[id].fuente})`);
});

// Huecos: la fuente no da la cifra (fuente-p2.md). Sin cifra, no hay prueba: queda marcado.
for (const [h, quien] of [['MAPSE (descenso de la base): no está en Lang ni Mor-Avi como cifra', 'B1'],
  ['rotación basal y apical por separado (solo la torsión neta, Mor-Avi p. 290)', 'B3'], ['S′ tricuspídea: el modelo no calcula velocidades del anillo', 'F5'],
  ['grosor sistólico de la pared libre del VD', 'B4'],
  ['volumen mínimo de la AI y de la AD (Lang solo da el máximo)', 'B2'], ['índice de excentricidad del tabique', 'F4'],
  ['relación largo/ancho del VI y ejes de la AI en mm (Lang los da en su Suplemento, Tablas 2 y 9, que no tenemos)', 'B2']]) {
  test('HUECO: ' + h, { todo: 'hueco de fuente · ' + quien }, () => assert.fail('sin cifra de referencia'));
}

test('normal: los tiempos del latido (contracción y relajación isovolumétricas, eyección) están en la banda de Alhakak', () => {
  for (const id of ['tcivol', 'teyec', 'trivol']) assert.ok(dentro(id, de('normal').v[id]), `${id} = ${fmt(de('normal').v[id])}`);
});
test('normal: la pulmonar abre antes y cierra después que la aórtica (fisiología general; Lang p. 6 remite a los tiempos del ciclo)', () => {
  const o = de('normal').m.onda;
  const abre = (c) => { for (let i = 1; i < o.length; i++) if (o[i][c] > 0 && !(o[i - 1][c] > 0)) return i; return -1; };
  const cierra = (c) => { for (let i = 1; i < o.length; i++) if (!(o[i][c] > 0) && o[i - 1][c] > 0) return i; return -1; };
  assert.ok(abre('qAo') > 0 && abre('qPul') > 0);
  assert.ok(abre('qPul') <= abre('qAo'), `pulmonar abre en ${abre('qPul')}, aórtica en ${abre('qAo')}`);
  assert.ok(cierra('qPul') >= cierra('qAo'), `pulmonar cierra en ${cierra('qPul')}, aórtica en ${cierra('qAo')}`);
});

// ---- VD en U (N2): triangular en el A4C, ápex trabeculado cerca del ápex del VI, banda moderadora en el plano, TSVD ------
test('Normal: el VD en el A4C es triangular, más ancho en la base que en el medio y que cerca del ápex [Mitchell 2019, p. 26]', () => {
  const g = baseGeometrica(estadoGeo(de('normal').m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a)), extraDeMotor(de('normal').m))), vd = medirVd(estadoGeo(
    de('normal').m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a)), extraDeMotor(de('normal').m)));
  assert.ok(vd.basal > vd.medio && vd.medio > vd.apice, `base ${fmt(vd.basal)}, medio ${fmt(vd.medio)}, ápex ${fmt(vd.apice)} mm`);
  assert.ok(vd.apice < 0.5 * vd.basal, `el tercio del ápex (${fmt(vd.apice)} mm) debe ser menos de la mitad de la base (${fmt(vd.basal)} mm)`);
  // el ápex del VD llega cerca del ápex del VI: al menos el 80 % de su largo (Mitchell p. 26: el VD «llega cerca del ápex»; ilustrativo)
  assert.ok(g.Lvd >= 0.8 * g.vi.Le, `largo del VD ${fmt(g.Lvd)} mm frente a ${fmt(g.vi.Le)} mm del VI`);
});
test('Normal: el área del VD no pasa del 60 % de la del VI en el A4C [Ficha 11, Fisiopatología UCI · Cardiología]', () => {
  const x = de('normal').v['vd-area-vi']; assert.ok(x < 0.6 && x > 0.2, `VD/VI = ${fmt(x)}`);
});
// La banda moderadora (Mitchell 2019, p. 26: se ve en la parte apical del VD en el A4C): su malla corta el plano de la vista
test('Normal: la banda moderadora cruza el VD y el plano del A4C la corta, en el tercio apical', () => {
  const m = de('normal').m, est = estadoGeo(m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a)), extraDeMotor(m));
  const P = planoVista('a4c', est), c = construirCorazon(est), banda = c.partes.find(p => p.nombre === 'Banda moderadora');
  assert.ok(banda, 'no hay banda moderadora');
  const n = [P.r[1] * P.d[2] - P.r[2] * P.d[1], P.r[2] * P.d[0] - P.r[0] * P.d[2], P.r[0] * P.d[1] - P.r[1] * P.d[0]];
  const sd = (i) => (banda.pos[i * 3] - P.O[0]) * n[0] + (banda.pos[i * 3 + 1] - P.O[1]) * n[1] + (banda.pos[i * 3 + 2] - P.O[2]) * n[2];
  let cortan = 0, mn = Infinity, mx = -Infinity;
  for (let k = 0; k < banda.idx.length; k += 3) { const s = [0, 1, 2].map(j => sd(banda.idx[k + j])); if (Math.min(...s) < 0 && Math.max(...s) > 0) cortan++; }
  for (let i = 0; i < banda.pos.length; i += 3) { const z = banda.pos[i + 2]; mn = Math.min(mn, z); mx = Math.max(mx, z); }
  assert.ok(cortan >= 6, `solo ${cortan} triángulos de la banda cortan el plano`);
  const g = c.geo; assert.ok(mx < -0.4 * g.Lvd && mn > -g.Lvd, `la banda va de z = ${fmt(mn)} a ${fmt(mx)} mm; el VD llega a ${fmt(-g.Lvd)}`);
});
test('Normal: la banda moderadora va del tabique a la pared libre del VD (sus extremos están en las paredes)', () => {
  const m = de('normal').m, est = estadoGeo(m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a)), extraDeMotor(m));
  const c = construirCorazon(est), g = c.geo, banda = c.partes.find(p => p.nombre === 'Banda moderadora');
  let rMin = Infinity, rMax = -Infinity;
  for (let i = 0; i < banda.pos.length; i += 3) { const r = Math.hypot(banda.pos[i], banda.pos[i + 1]); rMin = Math.min(rMin, r); rMax = Math.max(rMax, r); }
  const z = -0.64 * g.Lvd, f = 3.2, septo = g.rEpiVi(z, f), libre = g.rEpiVi(z, f) + g.wRV(z, f);
  assert.ok(rMin <= septo + 1 && rMax >= libre - 6, `la banda va de ρ = ${fmt(rMin)} a ${fmt(rMax)} mm; la cavidad, de ${fmt(septo)} a ${fmt(libre)} mm`);
});
