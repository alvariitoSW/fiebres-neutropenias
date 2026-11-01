// 154 · pVD, pVI y pVD/pVI del TEP agudo y la HP crónica en telediástole, mitad de eyección, cierre aórtico,
// volumen mínimo del VI (Lang 2015 p. 6) y primer fotograma de E; más FC, GC, PAPs y TAPSE. Uso: node … [json]
import { crearMotor } from '../../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../../js/modules/eco/escenarios.mjs';
import { medirVd } from '../../../../../js/modules/eco/atlas/vd.mjs';
const casos = [['normal'], ['tep'], ['tep', 0], ['tep', 0.3], ['tep', 1], ['hpcronica'], ['hpcronica', 0], ['hpcronica', 1]];
const out = {};
for (const [k, g] of casos) {
  const m = crearMotor(); m.correr(12); if (g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); if (k !== 'normal') m.correr(ASENTAR_FORMA);
  const o = m.onda, u = m.ultimo, iAo = o.map((x, i) => x.vAo ? i : -1).filter(i => i >= 0);
  const td = o.reduce((a, x, i) => (x.vvi > o[a].vvi ? i : a), 0), mid = iAo[Math.floor(iAo.length / 2)], cierre = iAo[iAo.length - 1] + 1;
  const vmin = o.reduce((a, x, i) => (x.vvi < o[a].vvi ? i : a), 0), e0 = o.findIndex(x => x.fase === 'E');
  const f = (i) => `${o[i].pvd.toFixed(1)}/${o[i].pvi.toFixed(1)}=${(o[i].pvd / o[i].pvi).toFixed(2)}`;
  const v = medirVd(m), cl = `${k}${g === undefined ? '' : ' g=' + g}`;
  out[cl] = o.map(x => [x.pvd, x.pvi]);
  console.log(`${cl.padEnd(14)} TD ${f(td)} | midEy ${f(mid)} | cierreAo(${cierre}) ${f(cierre)} | Vmin(${vmin}) ${f(vmin)} | E0(${e0}) ${f(e0)} | FC ${u.fc.toFixed(0)} GC ${u.gc.toFixed(2)} PAM ${u.pam.toFixed(0)} PAPs ${u.paps.toFixed(0)} TAPSE ${v.tapse.toFixed(1)} IE td ${v.eiD.toFixed(2)} ts ${v.eiS.toFixed(2)} eVdFin ${o[vmin].eVd.toFixed(2)} eViFin ${o[vmin].eVi.toFixed(2)}`);
}
if (process.argv[2] === 'json') console.log(JSON.stringify(out));
