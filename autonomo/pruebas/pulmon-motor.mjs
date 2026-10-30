// Prueba Node del pulmón de un compartimento: node autonomo/maquetas/b3-pulmon/pruebas.mjs
// Comprueba (REGLAS §1.7, CLAUDE §12) que en los estados de la maqueta y en los extremos y el punto medio de cada
// mando las cifras son las de un paciente posible, y que el modelo reproduce lo que Marino afirma (Ec. 27.1-27.4,
// Fig. 23.5, Fig. 28.9). Los valores esperados de los pacientes son los de cobertura-3d.md §3 y §5.
import { simular, crearPulmon, pbw, avisosAjuste } from '../../js/modules/libros/pulmon-vivo/pulmon.mjs';

let fallos = 0, n = 0;
const ok = (cond, msg) => { n++; if (!cond) { fallos++; console.log('  ✗ ' + msg); } };
const entre = (v, a, b) => v != null && v >= a && v <= b;
const r1 = (v) => (v == null ? '—' : Math.round(v * 10) / 10);
const resumen = (L) => `pico ${r1(L.pico)} meseta ${r1(L.meseta)} PEEPtot ${r1(L.peepTot)} auto ${r1(L.autoPeep)} Cstat ${r1(L.cstat)} DP ${r1(L.dp)} Vt ${r1(L.vtExh)} flujoFin ${r1(L.flujoFinEsp)} I:E 1:${r1(L.ie)}`;
const MAN = { pausa: true, oclusion: true };

console.log('PBW (Tabla 24.5)');
ok(Math.abs(pbw(175, 'v') - 70.5) < 0.2, `Isidro 1,75 m varón → ${pbw(175, 'v')} (esperado 70,5)`);
ok(Math.abs(pbw(180, 'v') - 75) < 0.5, `Rafael 1,80 m varón → ${pbw(180, 'v')} (esperado ≈75)`);
ok(Math.abs(pbw(162, 'm') - 54.2) < 0.3, `Eulalia 1,62 m mujer → ${pbw(162, 'm')} (esperado 54,2)`);

console.log('Normal (C 60, R 5): Vt 500 a 60 L/min, PEEP 5 → Pres 5, Pel 8, pico ~18, meseta ~13');
let L = simular({ modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60 }, { c: 60, r: 5 }, MAN).lectura;
console.log('  ' + resumen(L));
ok(entre(L.pres, 4.5, 5.5), 'Pres = pico − meseta ≈ 5'); ok(entre(L.meseta, 12.5, 14), 'meseta ≈ 13');
ok(entre(L.pico, 17.5, 19.5), 'pico ≈ 18'); ok(entre(L.peepTot, 4.8, 5.4), 'PEEP total = PEEP aplicada (sin oculta)');
ok(entre(L.cstat, 55, 60), 'Cstat ≈ 57 (60 menos los 25 mL de la tubuladura, cap. 27 p. 7)'); ok(L.flujoFinEsp > -1.5, 'el flujo llega a cero al final de la espiración');
ok(entre(L.pMedia, 5, 10), 'presión media 5-10 (pulmón normal, cap. 27 p. 6)');

console.log('Normal en PCV (Pinsp 10 sobre PEEP 5, I:E 1:2) → Vt ≈ C·Pinsp; con C 19 el Vt cae');
L = simular({ modo: 'pcv', pinsp: 10, ie: 2, fr: 14, peep: 5 }, { c: 60, r: 5 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(entre(L.vtExh, 540, 620), 'Vt 540-620 con C 60'); ok(entre(L.pico, 14.5, 15.5), 'pico = PEEP + Pinsp = 15'); ok(entre(L.ie, 1.9, 2.1), 'I:E 1:2');
L = simular({ modo: 'pcv', pinsp: 10, ie: 2, fr: 14, peep: 5 }, { c: 19, r: 8 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(entre(L.vtExh, 150, 220), 'Vt 150-220 con C 19 (cap. 27 p. 4: en PCV el Vt baja si baja la compliance)');

console.log('SDRA, Isidro (C 19, R 8, PEEP 10): Vt 6 mL/kg = 420 → meseta 32; Vt 5 mL/kg = 352 → meseta < 30');
L = simular({ modo: 'vcv', vt: 420, fr: 30, peep: 10, flujo: 60, pmax: 50 }, { c: 19, r: 8 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(entre(L.meseta, 31, 33), 'meseta ≈ 32'); ok(entre(L.pico, 39, 41), 'pico = meseta + R·flujo ≈ 40'); ok(entre(L.cstat, 15, 21), 'Cstat < 25 (cap. 27 p. 6), corregida por la tubuladura'); ok(L.cabe, 'cabe la espiración a FR 30');
L = simular({ modo: 'vcv', vt: 352, fr: 30, peep: 10, flujo: 60 }, { c: 19, r: 8 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(entre(L.meseta, 27, 30), 'meseta ≤ 30 con 5 mL/kg'); ok(entre(L.pMedia, 10, 20), 'presión media sube con la PEEP 10');
L = simular({ modo: 'vcv', vt: 564, fr: 30, peep: 10, flujo: 60, pmax: 50 }, { c: 19, r: 8 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(entre(L.meseta, 38, 41), 'con 8 mL/kg (564) la meseta pasa de 30 (≈ 40)');
L = simular({ modo: 'vcv', vt: 564, fr: 30, peep: 10, flujo: 60 }, { c: 19, r: 8 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(L.alarmaPresion && L.pico <= 40.5 && L.vtExh < 564, 'con la alarma en 40 el respirador corta la insuflación y el Vt no llega');

console.log('Broncoespasmo, Jacinto (C 60, R 20/40, PEEP 0): FR 24 → el flujo no llega a cero, auto-PEEP 5-8 por oclusión');
L = simular({ modo: 'vcv', vt: 500, fr: 24, peep: 0, flujo: 60 }, { c: 60, r: 20, rEsp: 40 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(L.flujoFinEsp < -5, 'flujo al final de la espiración < −5 L/min (Fig. 23.5)'); ok(entre(L.autoPeep, 5, 8), 'auto-PEEP 5-8'); ok(entre(L.pres, 19, 21), 'Pres = R·flujo = 20');
ok(L.pMedia > 5, 'presión media por encima de la del pulmón normal con PEEP 0');
const sinOcl = simular({ modo: 'vcv', vt: 500, fr: 24, peep: 0, flujo: 60 }, { c: 60, r: 20, rEsp: 40 }, { pausa: true }).lectura;
ok(sinOcl.peepTot == null && sinOcl.autoPeepReal > 5, 'sin la oclusión, la PEEP oculta no se ve en la presión proximal (cap. 27 p. 5)');
console.log('Corregida: FR 12, flujo 80, Vt 400 → el flujo vuelve a cero');
L = simular({ modo: 'vcv', vt: 400, fr: 12, peep: 0, flujo: 80 }, { c: 60, r: 20, rEsp: 40 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(L.flujoFinEsp > -2.5, 'flujo al final ≈ 0'); ok(L.autoPeep < 2, 'auto-PEEP < 2'); ok(L.ie >= 3, 'I:E ≥ 1:3');

console.log('Eulalia, asma casi fatal (C 60, R 20/65): mal conectada (Vt 500, FR 26) → oclusión 12-16; bien (FR 10, Vt 330, flujo 80, I:E ~1:4) → vuelve');
L = simular({ modo: 'vcv', vt: 500, fr: 26, peep: 0, flujo: 60, pmax: 60 }, { c: 60, r: 20, rEsp: 65 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(entre(L.autoPeep, 12, 16), 'auto-PEEP 12-16'); ok(L.pico < 50, 'pico < 50 (alarma de presión del respirador en 60)'); ok(L.vAtrapado > 500, 'volumen atrapado > 500 mL');
L = simular({ modo: 'vcv', vt: 330, fr: 10, peep: 0, flujo: 80 }, { c: 60, r: 20, rEsp: 65 }, MAN).lectura;
console.log('  ' + resumen(L)); ok(L.autoPeep < 3, 'auto-PEEP < 3'); ok(L.ie >= 3.5, 'I:E ≥ 1:3,5'); ok(L.flujoFinEsp > -4, 'flujo al final casi cero');

console.log('Extremos y punto medio de cada mando (VCV): ninguna cifra imposible, y el aviso cuando no cabe la espiración');
const VT = [250, 500, 800], FR = [8, 20, 35], PEEP = [0, 10, 20], FL = [30, 60, 100], CC = [15, 50, 100], RR = [2, 15, 40];
let combos = 0, avisos = 0, alarmas = 0, pMax = 0;
for (const vt of VT) for (const fr of FR) for (const peep of PEEP) for (const flujo of FL) for (const c of CC) for (const r of RR) {
  const x = simular({ modo: 'vcv', vt, fr, peep, flujo }, { c, r }, MAN, { ciclos: 6, dt: 0.01 }).lectura; combos++;
  const nums = [x.pico, x.meseta, x.peepTot, x.cstat, x.vtExh, x.flujoFinEsp, x.pMedia];
  if (nums.some((v) => v == null || !isFinite(v))) { ok(false, `NaN en vt ${vt} fr ${fr} peep ${peep} flujo ${flujo} c ${c} r ${r}`); continue; }
  if (!x.cabe) avisos++;
  pMax = Math.max(pMax, x.pico);
  if (x.alarmaPresion) alarmas++;
  if (x.pico > 40.5 || x.meseta < peep - 0.1 || x.vtExh < 0 || x.vtExh > vt + 1) ok(false, `imposible: ${resumen(x)} en vt ${vt} fr ${fr} peep ${peep} flujo ${flujo} c ${c} r ${r}`);
  if (x.cabe && !x.alarmaPresion && Math.abs(x.pres - r * flujo / 60) > 0.6) ok(false, `Pres ≠ R·flujo en vt ${vt} fr ${fr} flujo ${flujo} r ${r}: ${r1(x.pres)}`);
}
ok(combos === 729, `${combos} combinaciones`); ok(avisos > 0 && avisos < combos / 2, `${avisos} combinaciones «no cabe la espiración» (Vt alto, FR alta y flujo bajo)`);
ok(alarmas > 0 && alarmas < combos, `${alarmas} combinaciones con la alarma de presión a 40 cmH₂O (el respirador corta la insuflación: pico ≤ 40, Vt recortado)`);
console.log(`  pico máximo del barrido: ${r1(pMax)} cmH₂O`);

console.log('Ajustes extremos: el modelo no se recorta, pero avisa (volumen por kg y volumen minuto)');
let ax = simular({ modo: 'pcv', pinsp: 30, ie: 2, fr: 14, peep: 5 }, { c: 60, r: 5 }, MAN).lectura;
let av = avisosAjuste(ax, 70.5).map((a) => a.k);
console.log('  PCV 30: ' + resumen(ax) + ' · VM ' + r1(ax.vm) + ' · avisos ' + av.join(','));
ok(av.includes('vtkg') && av.includes('vm'), 'PCV 30 sobre PEEP 5 en C 60 avisa de volumen por kg y de volumen minuto');
ax = simular({ modo: 'vcv', vt: 800, fr: 35, peep: 5, flujo: 100 }, { c: 60, r: 5 }, MAN).lectura;
av = avisosAjuste(ax, 70.5).map((a) => a.k); console.log('  VCV 800 × 35: VM ' + r1(ax.vm) + ' · avisos ' + av.join(','));
ok(av.includes('vtkg') && av.includes('vm'), 'VCV 800 × 35 avisa');
ax = simular({ modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60 }, { c: 60, r: 5 }, MAN).lectura;
ok(avisosAjuste(ax, 70.5).length === 0, 'el ajuste normal no avisa');
ax = simular({ modo: 'vcv', vt: 352, fr: 30, peep: 10, flujo: 60 }, { c: 19, r: 8 }, MAN).lectura;
ok(avisosAjuste(ax, 70.5).length === 0, 'Isidro protector (5 mL/kg, FR 30) no avisa');

console.log('Errores de fondo corregidos (26/10): pmax en PCV, C en vivo, sin ventilación');
ax = simular({ modo: 'pcv', pinsp: 30, ie: 2, fr: 14, peep: 5, pmax: 30 }, { c: 60, r: 5 }, MAN).lectura;
ok(ax.pico <= 30.01 && ax.alarmaPresion, `PCV con pmax 30: el pico no pasa de 30 (${r1(ax.pico)}) y salta la alarma`);
ax = simular({ modo: 'pcv', pinsp: 30, ie: 2, fr: 14, peep: 5 }, { c: 60, r: 5 }, MAN).lectura;
ok(ax.pico > 34.9 && !ax.alarmaPresion, 'PCV 30 + PEEP 5 con pmax 40: pasa sin alarma');
{
  const p = crearPulmon({ modo: 'pcv', pinsp: 20, ie: 2, fr: 14, peep: 10, pmax: 40 }, { c: 100, r: 5 }, MAN);
  for (let i = 0; i < 8000; i++) p.paso(0.005);
  const antes = p.palv; p.pulmonAjustar({ c: 15 });
  ok(Math.abs(p.palv - antes) < 0.01, `cambiar C no mueve la presión alveolar (${r1(antes)} → ${r1(p.palv)})`);
  let max = 0; for (let i = 0; i < 6000; i++) { p.paso(0.005); max = Math.max(max, p.palv); }
  ok(max < 41, `tras C 100 → 15 la presión alveolar no pasa de la que aplica el respirador (${r1(max)})`);
}
ax = simular({ modo: 'pcv', pinsp: 15, ie: 2, fr: 14, peep: 5, pmax: 40 }, { c: 60, r: 40 }, MAN).lectura;
ok(avisosAjuste(ax, 75).some((a) => a.k === 'sinvent') === (ax.vm < 2), `R 40: VM ${r1(ax.vm)} L/min y el aviso «sin ventilación» concuerda`);
ax = simular({ modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60, pmax: 30 }, { c: 60, r: 40 }, MAN).lectura;
ok(ax.vm < 2 && avisosAjuste(ax, 75).some((a) => a.k === 'sinvent'), `VCV con R 40 y pmax 30: Vt ${r1(ax.vtExh)} mL, avisa «sin ventilación»`);

// ---- E1b: el ciclo (pares 4 y 6, cambio en la respiración siguiente, semilla fija, calculadora)
import { tau, calcVentilacion, PSV } from '../../js/data/ventilacion-data.js';
console.log('Par 4: constante de tiempo (LA2 pdf 50-51): R 20, C 60 → τ 1,2 s; con Te ≥ 4-5 τ la auto-PEEP ≈ 0; con Te < 4 τ el flujo final ≠ 0');
ok(Math.abs(tau(20, 60) - 1.2) < 1e-9, `τ = ${tau(20, 60)} s (esperado 1,2)`);
let Lt = simular({ modo: 'vcv', vt: 500, fr: 8, peep: 0, flujo: 60 }, { c: 60, r: 20 }, {}, { ciclos: 8 }).lectura;
ok(Lt.teTau >= 5 && Lt.autoPeepReal < 0.2 && Math.abs(Lt.flujoFinEsp) < 1, `Te ${r1(Lt.te)} s = ${r1(Lt.teTau)} τ: auto-PEEP ${r1(Lt.autoPeepReal)}, flujo final ${r1(Lt.flujoFinEsp)}`);
Lt = simular({ modo: 'vcv', vt: 500, fr: 24, peep: 0, flujo: 60 }, { c: 60, r: 20 }, {}, { ciclos: 12 }).lectura;
ok(Lt.teTau < 4 && Lt.flujoFinEsp < -2 && Lt.autoPeepReal > 1, `Te ${r1(Lt.te)} s = ${r1(Lt.teTau)} τ < 4: flujo final ${r1(Lt.flujoFinEsp)} L/min, auto-PEEP ${r1(Lt.autoPeepReal)}`);

console.log('Par 6: PSV (Herminia: PS 10, PEEP 5, C 40, R 8): el flujo cicla al 25 % del pico; disparo de −2 a −3 cmH₂O');
const PSVR = { modo: 'psv', ps: 10, peep: 5, frEsp: 16, fr: 16, pmax: 40 }, PSVP = { c: 40, r: 8 };
const sp = simular(PSVR, PSVP, {}, { ciclos: 12, ventana: 12 }), Lp = sp.lectura;
ok(Lp.psv && Math.abs(Lp.psv.qCiclo - PSV.ciclado) < 0.04, `ciclado a ${r1(Lp.psv.qCiclo * 100)} % del flujo pico (${r1(Lp.psv.qPico)} L/min)`);
ok(Lp.psv.disparo >= 2 && Lp.psv.disparo <= 3, `esfuerzo de disparo ${r1(Lp.psv.disparo)} cmH₂O (2-3, M27 pdf 8)`);
ok(Math.abs(Math.min(...sp.paw) - (5 - Lp.psv.disparo)) < 0.15 || Math.min(...sp.paw) <= 5 - 1.9, `la presión baja por debajo de la PEEP en el disparo (mín ${r1(Math.min(...sp.paw))})`);
ok(entre(Lp.pico, 14.9, 15.1) && Lp.vtExh > 250 && Lp.vtExh < 450 && Lp.meseta == null, `PS 10 + PEEP 5 → pico 15, Vt ${r1(Lp.vtExh)} mL, sin meseta (el paciente respira solo)`);
ok(entre(Lp.frReal, 15.5, 16.5), `FR del paciente ${r1(Lp.frReal)} /min`);
const p2 = simular(PSVR, PSVP, { pausa: true, oclusion: true }, { ciclos: 12 }).lectura;
ok(p2.meseta == null && p2.peepTot == null, 'en PSV la pausa y la oclusión no valen (el paciente respira por su cuenta, cap. 28 p. 31)');
ok(sp.fase.includes('disparo') && sp.fase.includes('insp') && sp.fase.includes('esp'), 'el ciclo PSV pasa por disparo, inspiración y espiración');

console.log('Un mando movido a mitad de ciclo entra en la respiración siguiente (nunca a mitad)');
{
  const P = crearPulmon({ modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60 }, { c: 60, r: 5 });
  while (P.lectura() == null) P.paso(0.005);
  while (P.fase !== 'insp') P.paso(0.005);   // empieza una inspiración (ciclo en curso)
  const ref = crearPulmon({ modo: 'vcv', vt: 500, fr: 14, peep: 5, flujo: 60 }, { c: 60, r: 5 });
  while (ref.lectura() == null) ref.paso(0.005); while (ref.fase !== 'insp') ref.paso(0.005);
  const Ti = 500 / (60000 / 60), traza = [], trazaRef = [];
  for (let i = 0, n = Math.round(Ti / 2 / 0.005); i < n; i++) { P.paso(0.005); ref.paso(0.005); }
  P.ajustar({ peep: 12, vt: 700 });   // a t = Ti/2
  ok(P.pendientes().includes('peep') && P.pendientes().includes('vt'), 'los mandos movidos quedan pendientes');
  for (let i = 0; P.fase === 'insp' && i < 4000; i++) { P.paso(0.005); ref.paso(0.005); traza.push(P.paw); trazaRef.push(ref.paw); }
  ok(traza.every((v, i) => v === trazaRef[i]), 'el resto de la inspiración en curso es idéntico al de referencia sin cambio');
  const Lc = P.lectura(); let g = 0; while (P.fase !== 'esp' && g++ < 9000) P.paso(0.005);
  while (P.fase === 'esp' && g++ < 20000) P.paso(0.005);
  while (P.fase !== 'esp' && g++ < 30000) P.paso(0.005);   // fin de la siguiente inspiración
  ok(P.activo.peep === 12 && P.activo.vt === 700 && P.pendientes().length === 0, 'en la respiración siguiente ya entran PEEP 12 y Vt 700');
  ok(Lc.vtIns < 520, `el Vt del ciclo en curso no cambió (${r1(Lc.vtIns)} mL)`);
}

console.log('Semilla fija: dos corridas dan las mismas cifras');
const sa = simular(PSVR, PSVP, {}, { ciclos: 12 }), sb = simular(PSVR, PSVP, {}, { ciclos: 12 });
ok(JSON.stringify(sa.paw) === JSON.stringify(sb.paw) && sa.lectura.psv.disparo === sb.lectura.psv.disparo, 'las dos corridas PSV son idénticas muestra a muestra');

console.log('Calculadora (PBW, Vt/kg, Cstat, ΔP)');
let cv = calcVentilacion({ talla: 175, sexo: 'v', vt: 576, meseta: 32, peep: 10 });
ok(cv.pbw === 70.5, `Isidro 1,75 m → PBW ${cv.pbw}`); ok(cv.vtkg === 8.2 && cv.avisos.some((a) => /8 mL\/kg/.test(a)), `576 mL = ${cv.vtkg} mL/kg PBW (6 × el peso real 96 kg = 576): avisa`);
ok(cv.dp === 22 && Math.abs(cv.cstat - (576 - 66) / 22) < 0.1, `ΔP ${cv.dp}, Cstat ${cv.cstat}`);
cv = calcVentilacion({ talla: '', sexo: 'v', vt: 500, meseta: '', peep: '' });
ok(cv.pbw == null && cv.cstat == null && cv.dp == null, 'un campo vacío no es 0');

console.log('Par 5 · racimo con histéresis (E2; presiones de apertura y cierre ilustrativas; Libro azul IV pp. 450-451, Marino cap. 24 p. 48, cap. 27 p. 10-12)');
{
  const R = (peep, vt = 282, racimo = 'sdra') => simular({ modo: 'vcv', vt, fr: 20, peep, flujo: 60, pmax: 90 }, { c: 19, r: 8, rEsp: 8, racimo }, MAN0, { ciclos: 8 });
  const MAN0 = { pausa: true };
  // a igual presión alveolar, el volumen de la rama espiratoria es ≥ el de la inspiratoria (último ciclo, por tramos de 1 cmH₂O)
  const s5 = R(5), n5 = s5.fase.length; let ini = n5 - 1; while (ini > 0 && !(s5.fase[ini] === 'insp' && s5.fase[ini - 1] !== 'insp')) ini--;
  const ins = new Map(), esp = new Map(), acum = (m, k, v) => { const a = m.get(k) || [0, 0]; a[0] += v; a[1]++; m.set(k, a); };
  for (let i = ini; i < n5; i++) { const k = Math.floor(s5.palv[i]); if (s5.fase[i] === 'insp' || s5.fase[i] === 'pausa') acum(ins, k, s5.vol[i]); else if (s5.fase[i] === 'esp') acum(esp, k, s5.vol[i]); }
  let comunes = 0, peor = Infinity, mayor = 0;
  for (const [k, a] of ins) if (esp.has(k)) { const d = esp.get(k)[0] / esp.get(k)[1] - a[0] / a[1]; comunes++; peor = Math.min(peor, d); mayor = Math.max(mayor, d); }
  console.log(`  ${comunes} tramos de presión comunes; diferencia espiratoria − inspiratoria: mínima ${r1(peor)} mL, máxima ${r1(mayor)} mL`);
  ok(comunes >= 5, 'hay tramos de presión comunes a las dos ramas'); ok(peor >= -1, 'a igual presión, la rama espiratoria lleva ≥ volumen que la inspiratoria'); ok(mayor > 10, 'y en algún tramo la diferencia se ve (histéresis > 10 mL)');
  const cp = {}; for (const pe of [0, 5, 8, 12, 16, 20]) { cp[pe] = R(pe).lectura; }
  console.log('  Vt 4 mL/kg (282 mL), PEEP → Cstat · abre-cierra · abiertas · sobredistendidas: ' + Object.entries(cp).map(([pe, l]) => `${pe}: ${r1(l.cstat)} · ${l.nAbreCierra} · ${l.nAbiertas} · ${l.unidades.filter((u) => u.sobre).length}`).join(' | '));
  ok(cp[0].nAbreCierra === 3 && cp[0].nAbiertas === 1, 'PEEP 0 (por debajo de los cierres 6, 8 y 10): tres unidades se abren y se cierran en cada ciclo');
  ok(cp[0].cstat < cp[12].cstat - 3, `PEEP 0: la Cstat baja (${r1(cp[0].cstat)} frente a ${r1(cp[12].cstat)} con PEEP 12)`);
  ok(cp[12].nAbreCierra === 0 && cp[12].nAbiertas === 4, 'PEEP 12, por encima del cierre más alto (10): las cuatro quedan abiertas y ninguna se cierra');
  ok(cp[5].nAbreCierra >= 1 && cp[12].nAbreCierra === 0, 'PEEP 5 → 12: lo que se cerraba deja de cerrarse');
  ok(cp[12].cstat > cp[5].cstat && cp[12].cstat > cp[20].cstat, `la mejor PEEP está en 12 (Fig. 27.5): Cstat ${r1(cp[5].cstat)} (5) < ${r1(cp[12].cstat)} (12) > ${r1(cp[20].cstat)} (20)`);
  ok(cp[20].unidades.every((u) => u.sobre) && cp[20].cstat < cp[16].cstat, `PEEP 20, todo sobredistendido: la Cstat BAJA (${r1(cp[16].cstat)} → ${r1(cp[20].cstat)}; la cola se aplana)`);
  const sano = R(5, 282, 'sano').lectura; ok(sano.nAbreCierra === 0 && sano.nAbiertas === 4, 'sin racimo (pulmón sano) nada se abre ni se cierra');
  // al cambiar de perfil en vivo, el reposo es el de la PEEP
  const P = crearPulmon({ modo: 'vcv', vt: 282, fr: 20, peep: 12, flujo: 60 }, { c: 19, r: 8 }); P.pulmonAjustar({ racimo: 'sdra' });
  ok(P.unidades.every((u) => u.abierta), 'con PEEP 12 el racimo empieza con las cuatro unidades abiertas');
}

console.log('Par 8 · asincronías que salen del motor (E4a; Libro azul IV pdf 47 y 93-95; Marino cap. 27 p. 8; esfuerzo ilustrativo)');
{
  const corre = (resp, pu = { c: 60, r: 8 }, seg = 40) => { const P = crearPulmon({ modo: 'vcv', vt: 400, fr: 12, peep: 5, flujo: 60, pmax: 60, tin: 0.8, frNeural: 20, ...resp }, pu); let marcas = 0, minPaw = 99; for (let i = 0; i < seg / 0.005; i++) { P.paso(0.005); if (P.disparo) marcas++; if (P.paw < minPaw) minPaw = P.paw; } return { P, marcas, minPaw, ef: P.esfuerzos.slice(2) }; };
  // sin esfuerzo (pmus 0) el motor es el de siempre: ninguna insuflación disparada por el paciente
  let r = corre({ pmus: 0 }); ok(r.ef.length === 0 && r.marcas === 0, 'pmus 0: no hay esfuerzos ni marcas de disparo del paciente (el motor es el de siempre)');
  // esfuerzo ineficaz: no baja la Paw 2 cmH₂O bajo la PEEP (umbral 2-3, M27 pdf 8) y no entrega Vt
  r = corre({ pmus: 2.5 }); const tipos = new Set(r.ef.map((e) => e.tipo));
  ok(r.ef.length >= 6 && tipos.size === 1 && tipos.has('ineficaz'), `pmus 2,5: todos los esfuerzos son ineficaces (${[...tipos]})`);
  ok(r.ef.every((e) => e.vt === 0 && e.disparos === 0), 'el esfuerzo ineficaz no da Vt (0 mL y 0 disparos)');
  console.log('  Paw mínima con esfuerzo 2,5: ' + r1(r.minPaw) + ' (PEEP 5; umbral 2 por debajo = 3)'); ok(r.minPaw > 5 - 2, 'la Paw no baja 2 cmH₂O de la PEEP: no dispara');
  // el mismo paciente con más esfuerzo dispara
  r = corre({ pmus: 8 }); ok(r.ef.every((e) => e.tipo === 'sincronico' && Math.abs(e.vt - 400) < 12), 'pmus 8: cada esfuerzo dispara una insuflación de 400 mL');
  // doble disparo (Fig. 27): ~2 Vt con menos de Ti/2 entre las dos insuflaciones; dos picos de Paw con un valle
  r = corre({ vt: 300, flujo: 30, pmus: 14, tin: 2.2, frNeural: 12 }); const d = r.ef.filter((e) => e.tipo === 'doble');
  ok(d.length >= 5 && d.length === r.ef.length, `doble disparo: todos los esfuerzos dan doble (${d.length} de ${r.ef.length})`);
  ok(d.every((e) => e.vt > 1.9 * 300 && e.vt < 2.1 * 300 && e.valle > 0 && e.valle < e.ti / 2), `doble disparo: ~2 Vt (${Math.round(d[0].vt)} mL) con el valle (${r1(d[0].valle)} s) < Ti/2 (${r1(d[0].ti / 2)} s)`);
  ok(r.marcas >= 2 * d.length, 'dos marcas de disparo por esfuerzo');
  { const P = crearPulmon({ modo: 'vcv', vt: 300, fr: 12, peep: 5, flujo: 30, pmax: 60, pmus: 14, tin: 2.2, frNeural: 12 }, { c: 60, r: 8 }); const paw = [], fase = []; for (let i = 0; i < 40 / 0.005; i++) { P.paso(0.005); paw.push(P.paw); } const sub = paw.slice(-2000);
    let picos = 0; for (let i = 1; i < sub.length - 1; i++) if (sub[i] > 12 && sub[i] >= sub[i - 1] && sub[i] > sub[i + 1]) picos++; ok(picos >= 2, `la curva de Paw tiene dos picos seguidos (${picos} máximos en la ventana)`);
    const L2 = P.lectura(); ok(L2 && L2.vtExh > 600 && L2.vtExh < 800, `el Vt espirado del doble disparo ronda 2 Vt (${r1(L2?.vtExh)} mL)`); }
  // disparo inverso: el esfuerzo llega con la insuflación ya empezada (insuflación por tiempo)
  r = corre({ pmus: 10, tin: 1.0, retraso: 0.3, fr: 14 }); ok(r.ef.length >= 5 && r.ef.every((e) => e.tipo === 'inverso'), 'disparo inverso: el esfuerzo llega dentro de la insuflación por tiempo');
  // PSV: el esfuerzo se suma al soporte (P-SILI): más Vt a igual soporte
  const psv = (pmus) => simular({ modo: 'psv', vt: 500, fr: 16, peep: 5, flujo: 60, pmax: 40, ps: 10, frEsp: 26, pmus, tin: 1 }, { c: 40, r: 8 }, {}, { ciclos: 14 }).lectura;
  const a0 = psv(0), a65 = psv(6.5); ok(a65.vtExh > a0.vtExh + 100 && a65.vtExh / pbw(160, 'm') >= 9.5, `PSV: con Pmus 6,5 el Vt sube de ${r1(a0.vtExh)} a ${r1(a65.vtExh)} mL (${r1(a65.vtExh / pbw(160, 'm'))} mL/kg ≥9,5)`);
}

console.log(`\n${n - fallos} de ${n} comprobaciones en verde${fallos ? ` · ${fallos} FALLOS` : ''}`);
process.exit(fallos ? 1 : 0);
