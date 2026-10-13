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

test('Atlas: cada cita de los capítulos de la app está en la bibliografía, y cada capítulo tiene su fragmento', () => {
  for (const [k, c] of Object.entries(CAPITULOS)) {
    const html = readFileSync(new URL(`../atlas/${c.html}`, import.meta.url), 'utf8');
    const refs = [...html.matchAll(/data-ref="([^"]+)"/g)].flatMap(x => x[1].split(','));
    assert.ok(refs.length > 0, `${k} sin citas`);
    for (const r of refs) assert.ok(REFERENCIAS[r.trim()], `${k}: cita sin referencia ${r}`);
    assert.ok(html.includes('class="card at-figura"'), `${k} sin figura`);
  }
});
