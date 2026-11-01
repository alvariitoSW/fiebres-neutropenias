// Barrido de extremos de la cánula (REGLAS §4.16): de 0 al doble del tope, cifras de una paciente posible.
import * as D from '../../../../js/data/pulmon-vivo-data.js';
import * as H from '../../../../js/modules/libros/pulmon-vivo/hfno.js';
import { pbw, simular } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
const E = D.ESTADOS.hfno, kg = pbw(160, 'm');
for (const q of [0, 10, 15, 20, 30, 40, 50, 60, 90, 120]) {
  const lec = H.lectura(q, 80, { ...E.resp }, E.pulmon);
  const l = simular({ ...E.resp, pmus: lec.pmus, frEsp: lec.frEsp }, { ...E.pulmon, rEsp: E.pulmon.r }, {}, { ciclos: 10, ventana: 0.01 }).lectura;
  console.log(String(q).padStart(3), 'Pmus', lec.pmus, 'FR', lec.frEsp, 'Vt', Math.round(l.vtExh), (l.vtExh / kg).toFixed(1), 'VM', l.vm.toFixed(1), 'Vi', Math.round(lec.vi), 'FiO2', Math.round(lec.fio2Alv), 'SpO2', lec.spo2);
}
