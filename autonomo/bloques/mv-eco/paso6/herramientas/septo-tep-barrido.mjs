// 154 · barrido de la gravedad del TEP (y HP crónica, normal): FC, PAM, GC, PAPs, TAPSE, vIT, TAP, P2−A2, gradiente pVD−pVI en la RIV del VI, IE
// Uso: node septo-tep-barrido.mjs [raíz del repo]
const dir = process.argv[2] || new URL('../../../../../', import.meta.url).pathname;
const { crearMotor } = await import(dir + '/js/modules/eco/motor.mjs');
const { ESCENARIOS, ASENTAR_FORMA } = await import(dir + '/js/modules/eco/escenarios.mjs');
const { medirVd, aceleracionTsvd } = await import(dir + '/js/modules/eco/atlas/vd.mjs');
const casos = [['normal'], ['tep', 0], ['tep', 0.3], ['tep'], ['tep', 0.85], ['tep', 1], ['hpcronica'], ['hpcronica', 0]];
console.log('caso        FC   PAM   GC    PAPs  TAPSE vIT   TAP  P2-A2 gradRIV  IE_TS IE_TD');
for (const [k, g] of casos) {
  const m = crearMotor(); m.correr(12); if (g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g);
  if (k !== 'normal') m.correr(ASENTAR_FORMA);
  const o = m.onda, u = m.ultimo, v = medirVd(m);
  // ventana de la RIV del VI: del cierre aórtico (tS2) a la primera apertura mitral POSTERIOR (la de u.tMitAbre puede ser la del latido previo)
  const iS2 = o.findIndex(x => x.t >= u.tS2);
  let iM = o.findIndex((x, i) => i > iS2 && x.pvi < x.pai); if (iM < 0) iM = o.length - 1;
  let g8 = -Infinity; for (let i = iS2; i <= iM; i++) g8 = Math.max(g8, o[i].pvd - o[i].pvi);
  const f = (x, d = 0) => (x ?? NaN).toFixed(d).padStart(5);
  console.log(`${(k + (g ?? '·')).padEnd(11)}${f(u.fc)} ${f(u.pam, 1)} ${f(u.gc, 2)} ${f(u.paps, 1)} ${f(v.tapse, 1)} ${f(v.vTr, 2)} ${f(aceleracionTsvd(o).act)} ${f((u.tS2p - u.tS2) * 1000)} ${f(g8, 1)}   ${f(v.eiS, 2)} ${f(v.eiD, 2)}`);
}
