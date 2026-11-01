// P1: constante por pulsación y barrido del neumotórax (cadena de la app: aire pleural → compliance → pMedia → corazón)
import { crearPulmon } from '../../../../js/modules/libros/pulmon-vivo/pulmon.mjs';
import * as S from '../../../../js/modules/libros/shock-vivo/soporte.mjs';
import { NEUMOTORAX as N, ESTADOS } from '../../../../js/data/pulmon-vivo-data.js';
const E = ESTADOS['neumotorax-tension'], vt = E.resp.vt, cab = S.crearCabecera({ esc: 'normal', hb: 14 });
const pMedia = (ptx) => { const P = crearPulmon(E.resp, E.pulmon, E.man); P.pulmonAjustar({ c: ptx > 0 ? vt / (vt / E.pulmon.c + ptx) : E.pulmon.c }); for (let i = 0; i < 8 * 4.3 / 0.005; i++) P.paso(0.005); return P.lectura().pMedia; };
const lee = (ptx) => { const x = Math.round(pMedia(ptx)), pl = Math.round(ptx); cab.ajustar({ cpap: x, pleura: pl }); cab.correr(30); const u = cab.lectura.u; return { ptx, x, vs: Math.round(u.vs), gc: +cab.lectura.gcTotal.toFixed(1), pam: Math.round(u.pam), spo2: Math.round(N.spo2Base - N.spo2PorCmH2O * ptx) }; };
console.log('paso por ciclo', N.paso, '· por pulsación (2 ciclos)', 2 * N.paso, '· pulsaciones hasta shock', N.shock / (2 * N.paso), 'hasta parada', N.parada / (2 * N.paso), 'hasta tope', N.tope / (2 * N.paso));
for (let k = 0; k <= 14; k++) { const p = Math.min(N.tope, k * 1.5); console.log('pulsación', k, JSON.stringify(lee(p))); if (p >= N.tope) break; }
