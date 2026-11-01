// M0 paso 6 · medir (no cambia nada): pVD-pAD en sístole, excentricidad del VI por fases, regional TEP.
//   node autonomo/bloques/mv-eco/herramientas/m0-paso6.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { septoSignoDe } from '../../../../js/modules/eco/contrato.mjs';
import { contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
const casos = [['normal'], ['hpcronica', 1], ['hpcronica', 0.6], ['tep', 1]];
for (const [k, g] of casos) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') ESCENARIOS[k].aplicar(m, g);
  m.correr(ASENTAR_FORMA); m.correr(5);
  const o = m.onda, u = m.ultimo, t0 = u.tS1, t1 = u.tS2, ds = t1 - t0;
  console.log(`\n== ${k} g=${g ?? '-'} · tS1=${t0?.toFixed(3)} tS2=${t1?.toFixed(3)} sístole=${(ds * 1000).toFixed(0)} ms · periodo=${u.periodo.toFixed(3)}`);
  // 1. pVD-pAD durante la sístole (cada ~10 ms)
  const ser = []; let last = -1;
  for (const s of o) if (s.t >= t0 && s.t <= t1 && s.t - last >= 0.0099) { ser.push([(s.t - t0) / ds, s.pvd - s.pad]); last = s.t; }
  let im = 0; ser.forEach((q, i) => { if (q[1] > ser[im][1]) im = i; });
  const mx = ser[im][1], en = (f) => ser.reduce((a, q) => Math.abs(q[0] - f) < Math.abs(a[0] - f) ? q : a)[1];
  console.log(`pVD-pAD max=${mx.toFixed(1)} mmHg en ${(100 * ser[im][0]).toFixed(0)}% sístole · r25=${(en(.25) / mx).toFixed(2)} r75=${(en(.75) / mx).toFixed(2)} · vIT=${Math.sqrt(Math.max(0, mx) / 4).toFixed(2)} m/s · n=${ser.length}`);
  console.log('curva(%sist:mmHg) ' + ser.filter((_, i) => i % 3 === 0).map(q => (100 * q[0]).toFixed(0) + ':' + q[1].toFixed(0)).join(' '));
  // 2. excentricidad (VI psaxPm, dibujo nuevo) en telediástole, sístole media, fin de sístole
  const extra = extraDeMotor(m);
  const cerca = (t) => o.reduce((a, s) => Math.abs(s.t - t) < Math.abs(a.t - t) ? s : a);
  for (const [nom, t] of [['telediástole', t0 - 0.02], ['sístole media', t0 + ds / 2], ['fin sístole', t1 - 0.01]]) {
    const s = cerca(t), e = estadoGeo(s, extra), C = contornosVista('psaxPm', e, 'nuevo'), p = C.viEndo?.cad?.flatMap(c => c.ps);
    const ex = (j) => Math.max(...p.map(q => q[j])) - Math.min(...p.map(q => q[j])), a = ex(0) / ex(1);
    console.log(`  ${nom}: EI=max(x/y,y/x)=${Math.max(a, 1 / a).toFixed(2)} (x/y=${a.toFixed(2)}) septoSigno=${septoSignoDe(s.pvd - s.pvi).toFixed(2)} septoEst=${e.septo.toFixed(2)} pvd-pvi=${(s.pvd - s.pvi).toFixed(1)}`);
  }
  // 3. regional
  if (k === 'tep' || k === 'normal') { const c = (await import('../../../../js/modules/eco/contrato.mjs')).contratoDe(m); console.log('  regional VD (pared basal, media, ápex) =', c.latido.regional.slice(17).map(v => v.toFixed(2)).join(' '), '· VI[0]=', c.latido.regional[0].toFixed(2)); }
}
