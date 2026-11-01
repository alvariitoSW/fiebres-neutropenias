// Sonda: Elvira espontánea (PSV 0, PEEP 0) con varios Pmus/Tin/FR; imprime Vt, mL/kg, FR.
import { simular, pbw } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
const kg = pbw(160, 'm');
const base = { modo: 'psv', vt: 500, fr: 16, peep: 0, flujo: 60, pinsp: 10, ie: 2, pmax: 40, ps: 0 };
for (const [pm, fr, tin, c] of [[15, 26, 1, 40], [15, 26, 1.4, 40], [15, 26, 1.6, 40], [14, 26, 1.6, 40], [12, 26, 1.6, 40], [10, 22, 1.6, 40], [8, 20, 1.6, 40], [6, 18, 1.6, 40], [4, 16, 1.6, 40], [15, 26, 1.4, 45]]) {
  const l = simular({ ...base, frEsp: fr, pmus: pm, tin }, { c, r: 8, rEsp: 8 }, {}, { ciclos: 10, ventana: 0.01 }).lectura;
  console.log(pm, fr, tin, c, 'vt', Math.round(l.vtExh), (l.vtExh / kg).toFixed(1), 'frReal', l.frReal?.toFixed(1), 'vm', l.vm?.toFixed(1), 'ti', l.ti?.toFixed(2));
}
{ const l = simular({ ...base, frEsp: 28, pmus: 14, tin: 1 }, { c: 40, r: 8, rEsp: 8 }, {}, { ciclos: 10, ventana: 0.01 }).lectura; console.log(Object.keys(l).join(' ')); }
