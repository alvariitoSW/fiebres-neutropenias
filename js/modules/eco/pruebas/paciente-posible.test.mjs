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
import { baseGeometrica, construirCorazon, REF, TAPSE_POR_ML } from '../corazon-geo.mjs';
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
  return { area: n * h * h / 100, largo: L, basal: ancho(0, 1 / 3), medio: ancho(1 / 3, 2 / 3) };
}

// Todo lo que se mide de un escenario (clave = id de REFERENCIAS_FORMA / REFERENCIAS, o del engrosamiento)
function medir(k) {
  const m = correr(k), o = m.onda, u = m.ultimo, sc = m.p.sc;
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a)), ts = o.reduce((a, b) => (b.vvi < a.vvi ? b : a)), ex = extraDeMotor(m);
  const eT = estadoGeo(td, ex), eS = estadoGeo(ts, ex), mT = medidasCorazon(eT, sc), mS = medidasCorazon(eS, sc);
  const gT = baseGeometrica(eT), vdT = medirVd(eT), vdS = medirVd(eS);
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
    'vd-pared': gT.tvdW(gT.wRV(-0.2 * gT.Lvd, (REF.phiA + REF.phiB) / 2)),
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
  normal: { 'vd-basal': { todo: 'N2 (VD en U: hoy ~16 mm en el A4C, banda 25-41)' } },
  hemorragia: {
    'vd-basal': { todo: 'N2 (VD en U)' }, 'vd-medio': { libre: 'hipovolemia: el VD se llena menos' }, 'vd-area-td-h': { libre: 'hipovolemia: el VD se llena menos' },
    'vi-rwt-h': { libre: 'cavidad más pequeña con la misma pared (Lang p. 17)' }, 'tapse': { todo: 'F5 (el TAPSE debe salir del acortamiento de la pared libre; hoy ∝ mL vaciados)' },
    'vi-septo-h': { todo: 'sin encargo: con el VI en 100 mL la pared telediastólica sale de 10,5 mm (miocardio de volumen constante)' },
  },
  fallo: {
    'vd-basal': { todo: 'N2 (VD en U)' }, 'tapse': { todo: 'F5' }, 'vi-vts-h': { libre: 'FE baja: el VI no se vacía' }, 'vi-vtsi-h': { libre: 'FE baja' },
    'vi-fe-h': { libre: 'es el fallo del VI' }, 'vi-engrosa': { libre: 'contractilidad baja' }, 'torsion': { libre: 'Mor-Avi p. 15: la torsión cae con la FE' },
    'vd-fe3d': { libre: 'el fallo del VI arrastra al VD' }, 'vd-fac': { libre: 'el fallo del VI arrastra al VD' }, 'vi-rwt-h': { libre: 'cavidad dilatada con pared sin engrosar' },
    'vi-vtdi-h': { libre: 'VI dilatado' }, 'vi-vtd-h': { libre: 'VI dilatado' }, 'vi-dtd-h': { libre: 'VI dilatado' }, 'vi-dts-h': { libre: 'VI dilatado' }, 'ai-vol': { libre: 'PCP alta' },
  },
  derrame: {
    'vd-basal': { todo: 'N2 (VD en U)' }, 'vd-medio': { libre: 'taponamiento: el VD se llena menos' }, 'vd-area-td-h': { libre: 'taponamiento: el VD se llena menos' },
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
  { k: 'tep', id: 'vd-basal', ok: (x) => x > 41, texto: 'VD basal >41 mm (Lang p. 17, 20)', todo: 'P4 (TEP con los criterios de Lang) y N2 (VD en U)' },
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
test('TEP: la torsión no debería subir con un VI vacío', { todo: 'B3 (torsión con fuente; hoy sube a ~10°, sin fuente)' }, () => {
  assert.ok(de('tep').v.torsion <= de('normal').v.torsion, `${fmt(de('tep').v.torsion)}° frente a ${fmt(de('normal').v.torsion)}°`);
});

// Huecos: la fuente no da la cifra (fuente-p2.md). Sin cifra, no hay prueba: queda marcado.
for (const [h, quien] of [['MAPSE (descenso de la base): no está en Lang ni Mor-Avi como cifra', 'B1'],
  ['rotación basal y apical por separado (solo la torsión neta, Mor-Avi p. 290)', 'B3'], ['S′ tricuspídea: el modelo no calcula velocidades del anillo', 'F5'],
  ['TSVD (RVOT) PLAX, proximal y distal: aún no se mide en el modelo', 'N2'], ['grosor sistólico de la pared libre del VD', 'B4'],
  ['volumen mínimo de la AI y de la AD (Lang solo da el máximo)', 'B2'], ['índice de excentricidad del tabique', 'F4']]) {
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
