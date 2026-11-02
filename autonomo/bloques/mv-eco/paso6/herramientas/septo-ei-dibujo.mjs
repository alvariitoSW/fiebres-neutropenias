// 154 · EI del dibujo nuevo (como domo-septo.test.mjs) y IE del atlas (medirVd) en HP crónica y TEP, para elegir el tope diastólico
const dir = process.argv[2] || new URL('../../../../../', import.meta.url).pathname;
const { crearMotor } = await import(dir + '/js/modules/eco/motor.mjs');
const { ESCENARIOS, ASENTAR_FORMA } = await import(dir + '/js/modules/eco/escenarios.mjs');
const { estadoGeo, extraDeMotor } = await import(dir + '/js/modules/eco/formas.mjs');
const { contornosVista } = await import(dir + '/js/modules/eco/pruebas/geometria-juez.mjs');
const { medirVd } = await import(dir + '/js/modules/eco/atlas/vd.mjs');
const montar = (k, g) => { const m = crearMotor(); m.correr(12); if (k !== 'normal') ESCENARIOS[k].aplicar(m, g); m.correr(ASENTAR_FORMA); m.correr(5); return m; };
function ei(m, t) {
  const o = m.onda, s = o.reduce((a, q) => Math.abs(q.t - t) < Math.abs(a.t - t) ? q : a), e = estadoGeo(s, extraDeMotor(m));
  const p = contornosVista('psaxPm', e, 'nuevo').viEndo?.cad?.flatMap(c => c.ps), ex = (j) => Math.max(...p.map(q => q[j])) - Math.min(...p.map(q => q[j])), a = ex(0) / ex(1);
  return Math.max(a, 1 / a);
}
const out = [];
for (const [k, g] of [['hpcronica', 0.6], ['hpcronica', 0.8], ['hpcronica', 1], ['hpcronica'], ['tep', 1], ['tep'], ['tep', 0.3]]) {
  const m = montar(k, g), u = m.ultimo, ds = u.tS2 - u.tS1, v = medirVd(m);
  out.push(`${k}${g ?? '·'} dib td ${ei(m, u.tS1 - 0.02).toFixed(3)} sm ${ei(m, u.tS1 + ds / 2).toFixed(2)} fs ${ei(m, u.tS2 - 0.01).toFixed(3)} | atlas TD ${v.eiD.toFixed(3)} TS ${v.eiS.toFixed(2)}`);
}
console.log(out.join('\n'));
