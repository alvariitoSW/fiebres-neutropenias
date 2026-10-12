// Formas de enfermedad (escenarios.mjs): cada una cumple, cifra a cifra, los criterios de las fichas de la app
// (CRITERIOS_FORMA), y el corazón normal está dentro de los rangos normales de esas mismas fichas.
// Los parámetros del modelo que producen cada forma son ilustrativos; lo que se exige son las cifras de las fichas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearMotor } from '../motor.mjs';
import { baseGeometrica, construirCorazon } from '../corazon-geo.mjs';
import { estadoGeo, extraDeMotor, aplanamientoSeptal, crearTablaFormas, instantesClave } from '../formas.mjs';
import { medidasCorazon } from '../ecografia.mjs';
import { ESCENARIOS, CRITERIOS_FORMA, evaluarForma, ASENTAR_FORMA } from '../escenarios.mjs';

const correr = (k) => { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m); if (k !== 'normal') m.correr(ASENTAR_FORMA); return m; };
const td = (m) => m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), m.onda[0]);
const medidas = (m) => medidasCorazon(estadoGeo(td(m), extraDeMotor(m)), m.p.sc);
const normal = correr('normal'), md0 = medidas(normal);

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
    for (const r of evaluarForma(k, m.ultimo, medidas(m), normal.ultimo, md0)) assert.ok(r.ok, `${r.texto}: ${r.v} (${r.fuente.ficha})`);
  });
}

test('el corazón normal no cumple todos los criterios de ninguna forma de enfermedad', () => {
  for (const k of Object.keys(CRITERIOS_FORMA)) {
    const r = evaluarForma(k, normal.ultimo, md0, normal.ultimo, md0);
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
