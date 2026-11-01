// P2 (b3-pulmon-estudio): recuperación gradual tras descomprimir el neumotórax a tensión + barrido de extremos de la presión pleural.
// Solo Node, sin navegador. Reproduce la cadena de la app: aire pleural (neumotorax.js) → compliance efectiva → pulmón (pMedia) → corazón (soporte.mjs, mismo cálculo que corazon.js).
import { crearPulmon } from '../../js/modules/libros/pulmon-vivo/pulmon.mjs';
import * as S from '../../js/modules/libros/shock-vivo/soporte.mjs';
import { NEUMOTORAX as N, ESTADOS } from '../../js/data/pulmon-vivo-data.js';
let fallos = 0; const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos++; };
const E = ESTADOS['neumotorax-tension'], vt = E.resp.vt, cab = S.crearCabecera({ esc: 'normal', hb: 14 });
const pMedia = (ptx) => { const P = crearPulmon(E.resp, E.pulmon, E.man); P.pulmonAjustar({ c: ptx > 0 ? vt / (vt / E.pulmon.c + ptx) : E.pulmon.c }); for (let i = 0; i < 8 * 4.3 / 0.005; i++) P.paso(0.005); return P.lectura().pMedia; };
const lee = (ptx) => { const x = Math.round(pMedia(ptx)), pl = Math.round(ptx); cab.ajustar({ cpap: x, pleura: pl }); cab.correr(30); const u = cab.lectura.u; return { pam: u.pam, fc: u.fc, gc: cab.lectura.gcTotal, spo2: Math.round(N.spo2Base - N.spo2PorCmH2O * ptx), x }; };
const base = lee(0), f = (n) => Math.round(n * 10) / 10;
ok(N.recuperacion >= 4 && N.recuperacion <= 8, `recuperación en ${N.recuperacion} respiraciones (rango 4-8)`);
for (const ptx0 of [N.shock, N.parada - 0.75, 20]) {
  const ser = []; let p = ptx0; for (let k = 0; k <= N.recuperacion; k++) { ser.push({ k, ptx: p, ...lee(p) }); p = Math.max(0, p - ptx0 / N.recuperacion); }
  console.log(`  desde ${ptx0} cmH₂O · PAM por ciclo: ${ser.map((s) => f(s.pam)).join(' → ')} · FC ${ser.map((s) => Math.round(s.fc)).join(' → ')} · SpO₂ ${ser.map((s) => s.spo2).join(' → ')}`);
  // por encima de la parada (13,5) el motor del corazón no es monótono (cifra mala del motor, REGLAS §1.14: se avisa, no se tapa): ahí se mira desde el 2.º ciclo
  const d0 = ptx0 > N.parada ? 2 : 1, mono = (k) => ser.every((s, i) => i < d0 || s[k] >= ser[i - 1][k] - 0.5);
  if (ptx0 > N.parada) console.log(`  AVISO motor: desde ${ptx0} la PAM baja de ${f(ser[0].pam)} a ${f(ser[1].pam)} en el 1.er ciclo (zona de parada, el motor no es monótono)`);
  ok(mono('pam') && mono('spo2') && ser.every((s, i) => i < d0 || s.fc <= ser[i - 1].fc + 0.5), `desde ${ptx0}: PAM y SpO₂ suben y la FC baja ciclo a ciclo${d0 > 1 ? ' (desde el 2.º ciclo)' : ''}`);
  ok(ser.every((s) => s.pam <= base.pam * 1.05 && s.spo2 <= N.spo2Base && s.fc >= base.fc * 0.95), `desde ${ptx0}: ninguna constante pasa el basal (PAM ${f(base.pam)} +5 %, SpO₂ ${N.spo2Base}, FC ${Math.round(base.fc)})`);
  ok(ser.at(-1).ptx === 0 && Math.abs(ser.at(-1).pam - base.pam) < 1 && ser.slice(0, -1).every((s) => s.ptx > 0), `desde ${ptx0}: tarda ${N.recuperacion} ciclos y acaba en el basal`);
}
// barrido de 0 al doble del tope: ningún valor imposible (el tope de la app es 20; 40 es solo del motor)
const bar = []; for (let p = 0; p <= 2 * N.tope; p += 2.5) bar.push({ p, ...lee(p) });
ok(bar.every((s) => s.pam >= 0 && s.pam <= 130 && s.fc >= 40 && s.fc <= 200 && s.gc >= 0 && s.gc <= 10 && s.spo2 >= 60 && s.spo2 <= 100), `barrido 0-${2 * N.tope} cmH₂O: PAM ${f(Math.min(...bar.map((s) => s.pam)))}-${f(Math.max(...bar.map((s) => s.pam)))}, FC ${Math.round(Math.min(...bar.map((s) => s.fc)))}-${Math.round(Math.max(...bar.map((s) => s.fc)))}, SpO₂ ${Math.min(...bar.map((s) => s.spo2))}-${Math.max(...bar.map((s) => s.spo2))}: todo posible`);
const sub = bar.filter((s) => s.p <= N.parada);
ok(sub.every((s, i) => i === 0 || s.pam <= sub[i - 1].pam + 0.5), `de 0 a la parada (${N.parada}) la PAM solo baja al subir el aire pleural`);
console.log(`  (por encima del tope: PAM a 20 = ${f(lee(20).pam)}, a 40 = ${f(lee(40).pam)}; el motor del corazón no es monótono ahí)`);
process.exit(fallos ? 1 : 0);
