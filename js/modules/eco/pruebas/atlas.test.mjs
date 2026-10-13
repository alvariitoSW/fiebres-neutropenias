// Pruebas del Atlas de ecocardiografía (sin navegador): la física de los capítulos 01-03 y que los capítulos 06-07,
// movidos por el motor del latido, cumplen lo que dice su texto (Alhakak 2025 y las direcciones de cada corazón).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fisica, reflexion, Z } from '../atlas/pulso.mjs';
import { frecuenciaImagen } from '../atlas/imagen.mjs';
import { doppler, enrollar } from '../atlas/efecto-doppler.mjs';
import { crearMotor } from '../motor.mjs';
import { duraciones } from '../atlas/ciclo.mjs';
import { PRESETS, asentar, medidasAsa } from '../atlas/asa.mjs';
import { motorFlujo, analizarFlujo, estimarPad, analizarDerechas, motorEscenario } from '../atlas/hemodinamica.mjs';
import { modeloVci } from '../abdomen.mjs';
import { motorLlenado, medirLlenado, algoritmoAse } from '../atlas/diastolica.mjs';
import { motorSistolico, medirSistolica, bandaFe } from '../atlas/sistolica.mjs';
import { REFERENCIAS } from '../atlas/referencias.js';
import { CAPITULOS } from '../atlas/atlas.js';
import { readFileSync } from 'node:fs';

const cerca = (a, b, tol) => Math.abs(a - b) <= tol;

test('01 Pulso: 13 µs por cm, λ = c/f, resolución axial = ciclos·λ/2, y la penetración cae con la frecuencia', () => {
  const f3 = fisica(3, 2), f7 = fisica(7, 2);
  assert.ok(cerca(f3.us(10), 129.9, 0.5), `10 cm → ${f3.us(10)} µs`);
  assert.ok(cerca(f7.lambda, 0.22, 0.005), `λ a 7 MHz ${f7.lambda}`);        // el 0,22 mm del texto
  assert.ok(cerca(f3.axial, f3.lambda, 1e-9));                                // 2 ciclos → λ
  assert.ok(f7.util < f3.util && f7.perdida(10) > f3.perdida(10));
  // la interfaz grasa-músculo con la tabla del IAEA refleja ~1,1% (la nota de fidelidad del capítulo)
  assert.ok(cerca(reflexion(Z.grasa, Z.musculo), 0.0108, 0.0003));
  assert.ok(reflexion(Z.musculo, Z.aire) > 0.99);
});

test('02 Imagen: 16 cm y 100 líneas ≈ 48 imágenes/s; un sector más estrecho sube la frecuencia', () => {
  const f = frecuenciaImagen(16, 100, 1);
  assert.equal(f.lineas, 100);
  assert.ok(cerca(f.fps, 48, 1), `fps ${f.fps}`);
  assert.ok(frecuenciaImagen(16, 40, 1.2).fps > frecuenciaImagen(16, 80, 1.2).fps);
  assert.ok(frecuenciaImagen(16, 60, 1.2, 2).fps < frecuenciaImagen(16, 60, 1.2, 1).fps);
});

test('03 Doppler: cos θ, Nyquist = c²/(8·prof·f0), aliasing solo en pulsado y color', () => {
  const d = doppler({ v: 1, angulo: 60, prof: 10, f0: 2.5, modo: 'pulsado' });
  assert.ok(cerca(d.vm, 0.5, 1e-9));
  assert.ok(cerca(d.nyquist, 1540 ** 2 / (8 * 0.10 * 2.5e6), 1e-6));
  assert.ok(cerca(doppler({ v: 1, angulo: 20, prof: 10, f0: 2.5, modo: 'pulsado' }).infra, 0.06, 0.005));   // ~6% a 20°
  assert.equal(doppler({ v: 3, angulo: 0, prof: 10, f0: 2.5, modo: 'pulsado' }).aliasing, true);
  assert.equal(doppler({ v: 3, angulo: 0, prof: 10, f0: 2.5, modo: 'continuo' }).aliasing, false);
  assert.ok(doppler({ v: 1, angulo: 0, prof: 5, f0: 2.5 }).nyquist > doppler({ v: 1, angulo: 0, prof: 15, f0: 2.5 }).nyquist);
  assert.ok(cerca(enrollar(1.5, 1), -0.5, 1e-9) && cerca(enrollar(0.4, 1), 0.4, 1e-9));
});

test('06 Ciclo: las duraciones del motor caen en la media ± 2 DE de Alhakak 2025 y la aurícula aporta ~1/5', () => {
  const m = crearMotor(); m.correr(12);
  const d = duraciones(m);
  assert.ok(d.tciv >= 20 && d.tciv <= 60, `TCIV ${d.tciv}`);
  assert.ok(d.eyeccion >= 246 && d.eyeccion <= 338, `eyección ${d.eyeccion}`);
  assert.ok(d.triv >= 58 && d.triv <= 134, `TRIV ${d.triv}`);
  assert.ok(d.aporteAuricular > 0.1 && d.aporteAuricular < 0.35, `aporte auricular ${d.aporteAuricular}`);
});

test('07 Asa: cada corazón va en la dirección del texto', () => {
  const n = medidasAsa(asentar(PRESETS.normal));
  const hfref = medidasAsa(asentar(PRESETS.hfref)), hfpef = medidasAsa(asentar(PRESETS.hfpef));
  const pres = medidasAsa(asentar(PRESETS.presion)), im = medidasAsa(asentar(PRESETS.im));
  assert.ok(n.acoplamiento >= 0.4 && n.acoplamiento <= 1.0, `Ea/Ees normal ${n.acoplamiento}`);
  // hipocontráctil: se dilata y expulsa una fracción pequeña
  assert.ok(hfref.edv > n.edv + 20 && hfref.fe < 0.45, `HFrEF ${hfref.edv} ${hfref.fe}`);
  // rígido: presión de llenado alta con volumen casi normal y FE conservada
  assert.ok(hfpef.ptd > n.ptd + 8 && hfpef.fe >= 0.5 && Math.abs(hfpef.edv - n.edv) < 30, `HFpEF ${hfpef.ptd} ${hfpef.fe} ${hfpef.edv}`);
  // sobrecarga de presión: más presión sistólica y menos FE
  assert.ok(pres.pts > n.pts + 25 && pres.fe < n.fe && pres.ea > n.ea);
  // IM: asa ancha y a la derecha, PTD solo algo más alta, sin contracción isovolumétrica y parte del VS a la AI
  assert.ok(im.edv > n.edv + 50 && im.vsTotal > n.vsTotal + 40, `IM ${im.edv} ${im.vsTotal}`);
  assert.ok(im.ptd > n.ptd && im.ptd < n.ptd + 8, `PTD IM ${im.ptd}`);
  assert.ok(im.caidaB > 1, `el VI pierde volumen antes de abrir la aórtica: ${im.caidaB}`);
  assert.ok(im.vReg >= 60 && im.vsAorta < im.vsTotal * 0.6, `IM ${im.vReg} ${im.vsAorta}`);
  // FE = Ees/(Ees+Ea): la fórmula y la del motor van en la misma dirección
  assert.ok(pres.feTeorica < n.feTeorica && hfref.feTeorica < n.feTeorica);
});

test('Motor: la eyección normal pica a ~90 ms con un cociente pico/media de flujo <2 (efecto de la eyección)', () => {
  const m = crearMotor(); m.correr(14);
  const u = m.ultimo, ej = m.onda.filter(x => x.t >= u.tAoAbre && x.t <= u.tS2);
  const pico = ej.reduce((a, b) => (b.qAo > a.qAo ? b : a)), media = u.vs / ((u.tS2 - u.tAoAbre));
  const tPico = (pico.t - u.tAoAbre) * 1000;
  assert.ok(tPico > 65 && tPico < 130, `pico a ${tPico} ms de la apertura`);
  assert.ok(pico.qAo / media < 2, `pico/media ${pico.qAo / media}`);
});

test('08 Hemodinámica: continuidad, cociente de velocidades, error del TSVI al cuadrado y gradiente medio ≠ 4·(v media)²', () => {
  const n = analizarFlujo(motorFlujo({ area: 3.0 }));
  assert.ok(n.cociente > 0.85 && n.vMaxA < 2, `normal: cociente ${n.cociente}, v ${n.vMaxA}`);
  const e = analizarFlujo(motorFlujo({ area: 0.8 }), { dReal: 2.0, dMedido: 2.0 });
  assert.ok(cerca(e.avaCont, 0.8, 0.02), `AVA por continuidad ${e.avaCont}`);
  assert.ok(e.vMaxA > 3.5 && e.cociente <= 0.27, `v ${e.vMaxA}, cociente ${e.cociente}`);
  assert.ok(e.gradMedio > e.gradDeVelMedia, 'la media de 4v² es mayor que 4·(v media)²');
  const err = analizarFlujo(motorFlujo({ area: 0.8 }), { dReal: 2.0, dMedido: 2.2 });
  assert.ok(cerca(err.vsDoppler / e.vsDoppler, 1.21, 0.01), '2 mm de error → ~21%');
});

test('08 Hemodinámica: la recuperación de presión es mayor con una aorta pequeña (Doppler > catéter)', () => {
  const p = analizarFlujo(motorFlujo({ area: 0.8, dAorta: 2.4 })), g = analizarFlujo(motorFlujo({ area: 0.8, dAorta: 4.0 }));
  assert.ok(p.recuperacion > g.recuperacion && p.cateter < g.cateter, `catéter ${p.cateter} vs ${g.cateter}`);
  assert.ok(p.gradMax > p.cateter, 'el Doppler supera a la caída neta');
});

test('08 Hemodinámica: PAD por la VCI (ASE 2025) y PSVD = 4v² + PAD cerca de la del motor', () => {
  assert.equal(estimarPad(18, 0.6).pad, 3); assert.equal(estimarPad(24, 0.3).pad, 15);
  assert.equal(estimarPad(24, 0.6).pad, 8); assert.equal(estimarPad(18, 0.3).pad, 8);
  assert.equal(estimarPad(18, 0.25, 'tranquila').pad, 3); assert.equal(estimarPad(18, 0.5, 'vm').pad, null);
  for (const k of ['normal', 'tep']) {
    const r = analizarDerechas(motorEscenario(k)), v = modeloVci(r.pvc), est = estimarPad(v.dmax, v.colapso).pad;
    assert.ok(Math.abs(r.gradTr + est - r.pvdMax) < 7, `${k}: ${r.gradTr} + ${est} frente a ${r.pvdMax}`);
    if (k === 'tep') assert.ok(r.vTr >= 2.8, `TEP: v IT ${r.vTr}`);
    else assert.ok(r.vTr < 2.8, `normal: v IT ${r.vTr}`);
  }
});

// 10 Función diastólica: los cuatro corazones de referencia caen en su patrón con el algoritmo de la guía, y su
// presión de la AI (la del motor, como un catéter) coincide con lo que dice el algoritmo
test('10 Diastólica: normal, grado 1, 2 y 3 con el algoritmo ASE 2025, y la PAI del motor coincide', () => {
  const v = [0, 1, 2, 3].map(f => medirLlenado(motorLlenado(f))), r = v.map(algoritmoAse);
  assert.deepEqual(r.map(x => x.grado), [0, 1, 2, 3], JSON.stringify(r.map(x => [x.rama, x.pai, x.grado])));
  assert.ok(v[0].ea >= 1 && v[0].ea <= 1.5 && v[0].tde >= 140 && v[0].tde <= 250, `normal E/A ${v[0].ea} TDE ${v[0].tde}`);
  assert.ok(v[1].ea <= 0.8 && v[1].triv > v[0].triv && v[1].tde > v[0].tde, 'relajación lenta: E/A ≤0,8, TRIV y TDE más largos');
  assert.ok(v[2].ea > 0.8 && v[2].ea < 2, `seudonormal E/A ${v[2].ea}`);
  assert.ok(v[3].ea >= 2 && v[3].tde < 160 && v[3].triv <= 70, `restrictivo E/A ${v[3].ea} TDE ${v[3].tde} TRIV ${v[3].triv}`);
  for (let i = 0; i < 4; i++) assert.equal(r[i].pai === 'elevada', v[i].pai > 12, `corazón ${i}: PAI del motor ${v[i].pai}`);
  for (const x of v) assert.ok(x.fe >= 0.5, 'la FEVI se mantiene preservada');
});

test('10 Diastólica: el algoritmo con los casos del texto (grado 1, grado 3, sin grado)', () => {
  const base = { sep: 5, lat: 6.5, avg: 5.75, eeSep: 10, eeLat: 8, eeAvg: 9, vTr: 2.3, lars: 35, lavi: 28, triv: 110 };
  assert.equal(algoritmoAse({ ...base, ea: 0.7 }).grado, 1);
  assert.deepEqual([algoritmoAse({ ...base, ea: 1.1 }).pai, algoritmoAse({ ...base, ea: 1.1 }).grado], ['normal', null]);
  const tres = { ...base, eeSep: 20, eeLat: 15, eeAvg: 17, vTr: 3.1, ea: 2.5 };
  assert.deepEqual([algoritmoAse(tres).pai, algoritmoAse(tres).grado], ['elevada', 3]);
  assert.equal(algoritmoAse({ ...base, ea: 1.1, lavi: 40 }).grado, 2);
});

// 09 Función sistólica: el biplano sobre la geometría de la app se acerca al volumen real del motor, el acortamiento del
// ápex infraestima los dos volúmenes, y las bandas de FEVI y el acortamiento del borde van en el sentido de cada corazón
test('09 Sistólica: biplano ≈ volumen del motor, el ápex acortado infraestima, y FEVI y strain por corazón', () => {
  const n = motorSistolico('normal'), a = medirSistolica(n, 0), b = medirSistolica(n, 16);
  assert.ok(Math.abs(a.D.biplano - a.D.real) / a.D.real < 0.1 && Math.abs(a.S.biplano - a.S.real) / a.S.real < 0.12, `${a.D.biplano}/${a.D.real} ${a.S.biplano}/${a.S.real}`);
  assert.ok(Math.abs(a.feBiplano - a.feReal) < 0.04);
  assert.ok(b.D.biplano < a.D.biplano - 10 && b.S.biplano < a.S.biplano - 5 && b.D.t4.L < a.D.t4.L, 'acortado: menos volumen y L más corta');
  assert.equal(bandaFe(a.feBiplano).banda, 'normal');
  assert.ok(a.gls < -18, `strain del borde normal ${a.gls}`);
  const d = medirSistolica(motorSistolico('dilatada'), 0), h = medirSistolica(motorSistolico('hipertrofia'), 0);
  assert.ok(d.feBiplano <= 0.4 && d.edvi > 74, `dilatada FE ${d.feBiplano} VTDi ${d.edvi}`);
  assert.ok(h.feBiplano >= 0.5 && h.gls > -16, `HVI FE ${h.feBiplano} strain ${h.gls}`);
});

test('Atlas: cada cita de los capítulos de la app está en la bibliografía, y cada capítulo tiene su fragmento', () => {
  for (const [k, c] of Object.entries(CAPITULOS)) {
    const html = readFileSync(new URL(`../atlas/${c.html}`, import.meta.url), 'utf8');
    const refs = [...html.matchAll(/data-ref="([^"]+)"/g)].flatMap(x => x[1].split(','));
    assert.ok(refs.length > 0, `${k} sin citas`);
    for (const r of refs) assert.ok(REFERENCIAS[r.trim()], `${k}: cita sin referencia ${r}`);
    assert.ok(html.includes('class="card at-figura"'), `${k} sin figura`);
  }
});
