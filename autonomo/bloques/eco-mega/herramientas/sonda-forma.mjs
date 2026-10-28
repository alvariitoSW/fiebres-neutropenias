// Sonda de las pruebas sensibles a la AI (usa ECO_OVR con ovr-preload.mjs): E/A del restrictivo (atlas 10), IC del derrame al 95 %,
// PCP de la hemorragia al 100 %, PAM del TEP al 100 % y E/A de la dilatada
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { faltaParaAsentar } from '../../../../js/modules/eco/maniobras.mjs';
import { motorLlenado, medirLlenado } from '../../../../js/modules/eco/atlas/diastolica.mjs';
const esc = (k, g) => { const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); m.p.tEscenario = m.s.t; m.correr(faltaParaAsentar(m) + 0); return m.ultimo; };
const r = (x, d = 2) => x.toFixed(d);
const rest = medirLlenado(motorLlenado(3)), pseudo = medirLlenado(motorLlenado(2)), lenta = medirLlenado(motorLlenado(1)), nor = medirLlenado(motorLlenado(0));
const d95 = esc('derrame', 0.95), h = esc('hemorragia', 1), t = esc('tep', 1);
console.log(`atlas E/A n${r(nor.ea)} l${r(lenta.ea)} s${r(pseudo.ea)} r${r(rest.ea)} | derr95 IC${r(d95.ic)} | hem1 PCP${r(h.pcp)} | tep1 PAM${r(t.pam,0)} IC${r(t.ic)}`);
const cs = (s) => { const m = crearMotor(); m.correr(12); ESCENARIOS.fallo.aplicar(m, 1); m.correr(40); m.p.soporte = s; m.correr(30); return m; };
const abre = (m) => { const o = m.onda, i = o.findIndex((x, k) => k > 0 && x.vAo && !o[k - 1].vAo); return o[i].pao; };
console.log(`balón: sin ${abre(cs(null)).toFixed(2)} con ${abre(cs({ balon: 40 })).toFixed(2)} dif ${(abre(cs(null)) - abre(cs({ balon: 40 }))).toFixed(2)}`);
