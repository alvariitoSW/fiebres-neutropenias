// Prueba Node del pulmón de un compartimento: node autonomo/maquetas/b3-pulmon/pruebas.mjs
// Comprueba (REGLAS §1.7, CLAUDE §12) que en los estados de la maqueta y en los extremos y el punto medio de cada
// mando las cifras son las de un paciente posible, y que el modelo reproduce lo que Marino afirma (Ec. 27.1-27.4,
// Fig. 23.5, Fig. 28.9). Los valores esperados de los pacientes son los de cobertura-3d.md §3 y §5.
import { simular, pbw } from './pulmon.mjs';

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

console.log(`\n${n - fallos} de ${n} comprobaciones en verde${fallos ? ` · ${fallos} FALLOS` : ''}`);
process.exit(fallos ? 1 : 0);
