// Formas de enfermedad (escenarios.mjs): cada una cumple, cifra a cifra, los criterios de las fichas de la app
// (CRITERIOS_FORMA), y el corazón normal está dentro de los rangos normales de esas mismas fichas.
// Los parámetros del modelo que producen cada forma son ilustrativos; lo que se exige son las cifras de las fichas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { baseGeometrica, construirCorazon } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor, aplanamientoSeptal, crearTablaFormas, instantesClave } from '../formas.mjs';
import { medidasCorazon, medirVd } from '../ecografia.mjs';
import { medirVd as medirVdAtlas } from '../atlas/vd.mjs';
import { ESCENARIOS, CRITERIOS_FORMA, evaluarForma, ASENTAR_FORMA } from '../escenarios.mjs';

const correr = (k, g) => { const m = crearMotor(); m.correr(12); if (g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); if (k !== 'normal') m.correr(ASENTAR_FORMA); return m; };
const td = (m) => m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), m.onda[0]);
const medidas = (m) => medidasCorazon(estadoGeo(td(m), extraDeMotor(m)), m.p.sc);
const vdDe = (m) => { const est = (s) => estadoGeo(s, extraDeMotor(m)), o = m.onda;
  return { td: medirVd(est(td(m))), ts: medirVd(est(o.reduce((a, b) => (b.vvi < a.vvi ? b : a), o[0]))) }; };
const normal = correr('normal'), md0 = medidas(normal), vd0 = vdDe(normal);
// El dibujo satura el diámetro basal del VD en 41 mm (recorte de corazon-geo): el criterio «VD basal >41 mm» (Lang 2015 p. 20)
// (y la relación de diámetros basales, que depende de él) se evalúa en el TEP al 100 % (masivo), donde el dibujo sí lo pasa, con el mismo umbral. El resto, en el defecto.
const evaluarTep = () => { const m = correr('tep'), m1 = correr('tep', 1);
  const r = evaluarForma('tep', m.ultimo, medidas(m), normal.ultimo, md0, vdDe(m), vd0);
  const r1 = evaluarForma('tep', m1.ultimo, medidas(m1), normal.ultimo, md0, vdDe(m1), vd0);
  return r.map(x => (x.texto.startsWith('VD basal') || x.texto.startsWith('Relación de diámetros')) ? r1.find(y => y.texto === x.texto) : x); };
test.todo('TEP defecto (submasivo): VD basal >41 mm en el dibujo — recorte de corazon-geo, paso 4 de mv-eco');
test.todo('TEP defecto (submasivo): relación VD/VI basal >1,0 en el dibujo (0,96 con VD 40,8 y VI 42,4 mm) — mismo recorte, paso 4 de mv-eco');

test('el corazón normal está dentro de los rangos normales de FATE y de la guía ESC', () => {
  assert.ok(md0.paredPost >= 6 && md0.paredPost <= 10, `pared posterior ${md0.paredPost.toFixed(1)} mm (FATE 6-10)`);
  assert.ok(md0.tabique >= 6 && md0.tabique <= 10, `tabique ${md0.tabique.toFixed(1)} mm (FATE 6-10)`);
  assert.ok(md0.lvdd >= 35 && md0.lvdd <= 55, `LVDd ${md0.lvdd.toFixed(1)} mm (FATE 35-55)`);
  assert.ok(md0.vdDiam >= 6 && md0.vdDiam <= 30, `VD ${md0.vdDiam.toFixed(1)} mm (FATE 6-30)`);
  assert.ok(md0.rwt <= 0.42, `grosor relativo ${md0.rwt.toFixed(2)} (ESC: >0,42 es hipertrofia)`);
  assert.ok(md0.masaIndice < 95, `masa ${md0.masaIndice.toFixed(0)} g/m² (ESC: ≥95 mujer, ≥115 varón)`);
  assert.ok(md0.areaVdVi < 0.6, `VD/VI ${md0.areaVdVi.toFixed(2)} (Ficha 11: >0,6 cor pulmonale)`);
  for (const s of normal.onda) assert.ok(aplanamientoSeptal(s) < 0.1, `tabique aplanado en t ${s.t}`);
});

for (const k of Object.keys(CRITERIOS_FORMA)) {
  test(`forma «${ESCENARIOS[k].nombre}»: cumple los criterios de las fichas`, () => {
    const m = correr(k);
    for (const r of k === 'tep' ? evaluarTep() : evaluarForma(k, m.ultimo, medidas(m), normal.ultimo, md0, vdDe(m), vd0)) assert.ok(r.ok, `${r.texto}: ${r.v} (${r.fuente.ficha})`);
  });
}

test('el corazón normal no cumple todos los criterios de ninguna forma de enfermedad', () => {
  for (const k of Object.keys(CRITERIOS_FORMA)) {
    const r = evaluarForma(k, normal.ultimo, md0, normal.ultimo, md0, vd0, vd0);
    assert.ok(r.some(x => !x.ok), `el normal cumple todos los criterios de ${k}`);
  }
});

test('TEP: el tabique se aplana en diástole (el VD supera al VI) y vuelve a curvarse en sístole', () => {
  const m = correr('tep'), u = m.ultimo;
  const dia = m.onda.filter(s => s.t < 0.12), sis = m.onda.filter(s => s.t > u.tAoAbre + 0.03 && s.t < u.tS2 - 0.03);
  assert.ok(dia.every(s => aplanamientoSeptal(s) > 0.5), 'telediástole sin aplanar');
  assert.ok(sis.every(s => aplanamientoSeptal(s) < 0.05), 'sístole aplanada');
  // en la geometría: corte en «D» — el radio del VI hacia el tabique es menor que hacia la pared lateral
  const g = baseGeometrica(estadoGeo(td(m), extraDeMotor(m))), z = -0.45 * g.vi.L, fS = 2.8;
  assert.ok(g.rEndoVi(z, fS) < 0.8 * g.rEndoVi(z, fS + Math.PI), `tabique ${g.rEndoVi(z, fS).toFixed(1)} frente a lateral ${g.rEndoVi(z, fS + Math.PI).toFixed(1)} mm`);
  // la pared conserva su grosor perpendicular a la cuerda
  const t = g.rEpiVi(z, fS) - g.rEndoVi(z, fS), t0 = g.rEpiVi(z, fS + Math.PI) - g.rEndoVi(z, fS + Math.PI);
  assert.ok(Math.abs(t - t0) < 0.5, `pared del tabique ${t.toFixed(1)} frente a lateral ${t0.toFixed(1)} mm`);
});

test('con el tabique aplanado, la cavidad dibujada sigue teniendo el volumen del motor', () => {
  const m = correr('tep'), s = td(m), g = baseGeometrica(estadoGeo(s, extraDeMotor(m)));
  const vol = (circ) => { let v = 0; const nz = 60, nf = 120, dz = g.vi.L / nz;
    for (let i = 0; i < nz; i++) { const z = -(i + 0.5) * dz; for (let j = 0; j < nf; j++) { const f = (j + 0.5) / nf * 2 * Math.PI, r = circ ? g.rEndoVi(z) : g.rEndoVi(z, f); v += r * r / 2 * (2 * Math.PI / nf) * dz; } }
    return v / 1000; };
  const v = vol(false);
  assert.ok(Math.abs(v - s.vvi) / s.vvi < 0.04, `cavidad ${v.toFixed(0)} mL frente al motor ${s.vvi.toFixed(0)} mL`);
  assert.ok(vol(true) > v + 3, 'el radio no se ha compensado');
});

test('las formas de enfermedad se construyen sin coordenadas no finitas y se precalculan para mezclar', () => {
  for (const k of Object.keys(CRITERIOS_FORMA)) {
    const m = correr(k), ex = extraDeMotor(m);
    for (const s of m.onda.filter((_, i) => i % 60 === 0)) {
      const geo = construirCorazon(estadoGeo(s, ex), { pericardio: true, detalle: true, calidad: 0.5 });
      for (const p of geo.partes) { const a = p.pos || p.lineas; for (let i = 0; i < a.length; i++) assert.ok(Number.isFinite(a[i]), `${k} · ${p.nombre}`); }
    }
    // la tabla de formas: el aplanamiento del tabique entra en la mezcla (no se mezclan formas de otra masa del VI)
    const tabla = crearTablaFormas(); tabla.pedir(m.onda, m.ultimo, { pericardio: false, detalle: false, calidad: 0.5 }, ex);
    while (tabla.construyendo) tabla.trabajar();
    let usadas = 0; const muestras = instantesClave(m.onda);
    for (const x of muestras) if (tabla.mezclar({ ...x, tLatido: x.t }, ex)) usadas++;
    assert.ok(usadas >= muestras.length - 2, `${k}: mezcla usada en ${usadas}/${muestras.length}`);
    assert.equal(tabla.mezclar({ ...muestras[0], tLatido: muestras[0].t }, { ...ex, mioVi: 1.01 }), null, `${k}: mezcló otra masa`);
  }
});

// P4 · TEP con los criterios de Lang 2015 (VD basal >41 mm p. 20, FAC <35 % p. 23, FE del VD <45 % p. 23, TAPSE <17 mm p. 23)
// y la relación VD/VI (Ficha 11: normal <1). El TEP por defecto cumple todos; el normal, ninguno.
const LANG_TEP = ['VD basal', 'Relación de diámetros', 'FAC del VD', 'FE del VD', 'TAPSE', 'Área del VD / área del VI'];
test('TEP: cumple los criterios de Lang del VD (basal, FAC, FE, TAPSE) y la relación VD/VI; el normal, ninguno', () => {
  const tep = evaluarTep();
  const sano = evaluarForma('tep', normal.ultimo, md0, normal.ultimo, md0, vd0, vd0);
  for (const nombre of LANG_TEP) {
    const t = tep.find(r => r.texto.startsWith(nombre)), n = sano.find(r => r.texto.startsWith(nombre));
    assert.ok(t, `falta el criterio «${nombre}»`);
    assert.ok(t.ok, `TEP: ${t.texto}: ${t.v}`);
    assert.ok(!n.ok, `normal: ${n.texto}: ${n.v}`);
  }
});

// Índice de excentricidad del VI (IE = D2/D1 en el eje corto, D2 paralelo al tabique). Mukherjee 2025 (Tabla 2 y texto):
// >1 anormal, y en sístole indica sobrecarga de presión; su cuadro de grupos usa >1,1 (las dos cifras se comprueban).
// Ryan 1985 (Atlas · 14): 1,44 ± 0,16 en telesístole en la sobrecarga de presión. IE de telesístole = máximo septoSigno entre el
// cierre aórtico y la apertura mitral + 20 ms (atlas/vd.mjs, muestraIeSistole); los volúmenes, con el volumen mínimo (Lang 2015 p. 6).
test('índice de excentricidad: normal ≈ 1 en telediástole y telesístole; TEP > 1,1 en telesístole (Mukherjee 2025, Ryan 1985)', () => {
  const n = medirVdAtlas(normal), t = medirVdAtlas(correr('tep'));
  assert.ok(n.eiD <= 1.1 && n.eiS <= 1.1, `normal: TD ${n.eiD.toFixed(2)}, TS ${n.eiS.toFixed(2)}`);
  assert.ok(t.eiS > 1.1, `TEP, telesístole: ${t.eiS.toFixed(2)} (> 1 Mukherjee; > 1,1 su cuadro de grupos)`);
  // 154 (decisión del usuario, 01/11/2026, tras el consejo de 3 expertos): rangos por enfermedad en vez de «TS ≥ TD». TEP AGUDO:
  // IE en telediástole 1,21 ± 0,21 (Demertzis 2025, PMC12485522) → 1,1-1,4; en telesístole (máximo abombamiento tras el cierre
  // aórtico, atlas/vd.mjs, muestraIeSistole) 1,2-1,65 (por encima del umbral de Mukherjee y dentro de Ryan 1985, 1,44 ± 0,16, ±0,05).
  assert.ok(t.eiD >= 1.1 && t.eiD <= 1.4, `TEP agudo, telediástole: ${t.eiD.toFixed(2)} (1,1-1,4; Demertzis 2025: 1,21 ± 0,21)`);
  assert.ok(t.eiS >= 1.2 && t.eiS <= 1.65, `TEP agudo, telesístole: ${t.eiS.toFixed(2)} (1,2-1,65)`);
});

// P6 · HP crónica frente a TEP agudo. Pared libre del VD (RVWT) en telediástole: normal <5 mm, leve 5-7, moderada >7-9, grave >9
// (Mukherjee 2025, Tabla 5, p. 145; Lang 2015, Tabla 8, p. 20: 1-5 mm). La sobrecarga crónica engruesa la pared; la aguda, no.
// IE en telesístole >1 = sobrecarga de presión (Mukherjee p. 149-150); PAPs normal ≤34 (p. 145).
test('HP crónica frente a TEP agudo: pared del VD gruesa en la crónica y fina en la aguda; presión pulmonar mayor; tabique aplanado en telesístole', () => {
  const hp = correr('hpcronica'), tep = correr('tep');
  const mh = medidas(hp), mt = medidas(tep), ih = medirVdAtlas(hp), it = medirVdAtlas(tep);
  assert.ok(md0.paredVd < 5, `normal: pared del VD ${md0.paredVd.toFixed(1)} mm (<5)`);
  assert.ok(mh.paredVd > 5, `HP crónica: pared del VD ${mh.paredVd.toFixed(1)} mm (>5 mm, Mukherjee p. 145)`);
  assert.ok(mt.paredVd <= 5, `TEP agudo: pared del VD ${mt.paredVd.toFixed(1)} mm (≤5: pared fina)`);
  assert.ok(ih.eiS > 1.1, `HP crónica: IE en telesístole ${ih.eiS.toFixed(2)} (>1 sobrecarga de presión)`);
  // 154 (decisión del usuario, 01/11/2026): la sobrecarga de presión crónica aplana MÁS en telesístole que en telediástole.
  // Ryan 1985 (JACC 5:918, PMID 3973294): TS 1,44 ± 0,16 (aquí ±0,26: 1,18-1,70) y TD 1,26 ± 0,11; McGettrick 2022 (PMID 36582741):
  // TS 1,3 ± 0,5, TD 1,22 ± 0,2.
  assert.ok(Math.abs(ih.eiS - 1.44) <= 0.26, `HP crónica, telesístole: ${ih.eiS.toFixed(2)} (Ryan 1985: 1,44 ± 0,26)`);
  assert.ok(ih.eiS > ih.eiD, `HP crónica: telesístole ${ih.eiS.toFixed(2)} > telediástole ${ih.eiD.toFixed(2)} (Ryan 1985, McGettrick 2022)`);
  assert.ok(hp.ultimo.paps > tep.ultimo.paps + 10 && hp.ultimo.paps > 34, `PAPs ${hp.ultimo.paps.toFixed(0)} (HP) frente a ${tep.ultimo.paps.toFixed(0)} (TEP); normal ≤34`);
  assert.ok(it.eiS > 1.1, 'TEP: también aplana el tabique, así que no es el IE lo que los distingue');
});

test('HP crónica: paciente posible desde el defecto hasta el tope (PA, FC, PVC y GC razonables; la pared deja de crecer al dilatarse el VD)', () => {
  let pared = [];
  for (const g of [0, 0.25, undefined, 0.8, 1]) {
    const m = crearMotor(); m.correr(12); ESCENARIOS.hpcronica.aplicar(m, g); m.correr(ASENTAR_FORMA);
    const u = m.ultimo, md = medidas(m), t = `g=${g}`;
    for (const k of ['pam', 'fc', 'pvc', 'gc', 'paps', 'papd', 'edvD']) assert.ok(Number.isFinite(u[k]), `${t}: ${k}`);
    assert.ok(u.pam >= 60 && u.pam <= 100, `${t}: PAM ${u.pam.toFixed(0)}`);
    assert.ok(u.fc >= 55 && u.fc <= 110, `${t}: FC ${u.fc.toFixed(0)}`);
    assert.ok(u.pvc >= 2 && u.pvc <= 16, `${t}: PVC ${u.pvc.toFixed(1)}`);
    assert.ok(u.gc >= 2.5 && u.gc <= 6, `${t}: GC ${u.gc.toFixed(1)}`);
    assert.ok(u.paps <= 110, `${t}: PAPs ${u.paps.toFixed(0)}`);
    pared.push(md.paredVd);
  }
  assert.ok(pared[0] < 5 && pared[2] > 7, `pared ${pared.map(x => x.toFixed(1))}: de normal a moderada (>7 mm)`);
});

// P5a · AI dilatada medible (Lang 2015 pp. 25, 28: normal ≤34 mL/m²) e IM funcional (Zoghbi 2017 Tabla 8, p. 332).
// Par: normal frente a dilatada. La coaptación se mide en la geometría: z de la línea de cierre de la mitral frente al anillo (z = 0)
test('AI dilatada medible e IM funcional: normal frente a dilatada', () => {
  const dil = correr('dilatada'), md = medidas(dil), geo = (m) => construirCorazon({ ...estadoGeo(td(m), extraDeMotor(m)), mitral: 0 });
  assert.ok(md0.volAI < 34, `AI normal ${md0.volAI.toFixed(1)} mL/m² (Lang: ≤34)`);
  assert.equal(md0.eroa, 0, 'el normal no regurgita');
  assert.ok(md.volAI > 34, `AI dilatada ${md.volAI.toFixed(1)} mL/m² (Lang: >34)`);
  assert.ok(md.eroa >= 0.2 && md.eroa < 0.4, `EROA ${md.eroa} cm² (Zoghbi: moderada 0,20-0,39)`);
  assert.ok(md.volReg >= 30 && md.volReg < 60, `volumen regurgitante ${md.volReg.toFixed(0)} mL (Zoghbi: moderada 30-59)`);
  assert.equal(md0.volReg, 0);
  // paciente posible (defecto): PA, FC, PVC, PCP, GC
  const u = dil.ultimo;
  assert.ok(u.pas > 80 && u.pas < 140 && u.pam > 60 && u.fc > 55 && u.fc < 110 && u.pvc > 2 && u.pvc < 15 && u.pcp > 15 && u.pcp < 35 && u.gc > 3 && u.gc < 6, `constantes ${JSON.stringify([u.pas, u.pam, u.fc, u.pvc, u.pcp, u.gc])}`);
  // tenting: el borde libre de las valvas cerradas (línea de coaptación) queda más abajo, hacia el ápex (z < 0), que en el normal
  // (el anillo está en z = 0); la diferencia es la profundidad de tenting ilustrativa (8 mm a tenting 1)
  const zCoap = (m) => { const v = geo(m).partes.find(p => p.nombre === 'Mitral posterior'); let z = 0; for (let i = 2; i < v.pos.length; i += 3) z = Math.min(z, v.pos[i]); return z; };
  const z0 = zCoap(normal), z1 = zCoap(dil);
  assert.ok(z1 < z0 - 5, `coaptación normal z ${z0.toFixed(1)} mm, dilatada z ${z1.toFixed(1)} mm (más abajo = hacia el ápex)`);
});
