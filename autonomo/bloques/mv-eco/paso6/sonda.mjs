// Sonda 154: gradiente transeptal pVD−pVI en la relajación isovolumétrica del VI y IE con dos definiciones de telesístole
const dir = process.argv[2]; const extra = JSON.parse(process.argv[3] || '{}');
const { crearMotor } = await import(dir + '/js/modules/eco/motor.mjs');
const { ESCENARIOS, ASENTAR_FORMA } = await import(dir + '/js/modules/eco/escenarios.mjs');
const { medirVd, indiceExcentricidad, aceleracionTsvd } = await import(dir + '/js/modules/eco/atlas/vd.mjs');
const { septoSignoDe } = await import(dir + '/js/modules/eco/contrato.mjs');
const { estadoGeo, extraDeMotor } = await import(dir + '/js/modules/eco/formas.mjs');
const { baseGeometrica } = await import(dir + '/js/modules/eco/corazon-geo.mjs');
for (const [k, g] of [['normal'], ['tep'], ['tep', 0.3], ['tep', 1], ['hpcronica']]) {
  const m = crearMotor(); m.correr(12); if (g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g);
  if (k === 'tep') for (const [kk, vv] of Object.entries(extra)) m.p[kk] = typeof vv === 'number' && typeof m.p[kk] === 'number' && extra._mult ? m.p[kk] * vv : vv;
  if (k === 'tep' && extra.eesVdX) m.p.vd.ees *= extra.eesVdX;
  if (k !== 'normal') m.correr(ASENTAR_FORMA);
  const o = m.onda, u = m.ultimo, v = medirVd(m);
  const iS2 = o.findIndex(x => x.t >= u.tS2), iMit = o.findIndex(x => x.t >= u.tMitAbre);
  const ms = (i) => Math.round((o[i].t - u.tS2) * 1000);
  // cruce: primer instante tras S2 con pVD > pVI; máximo gradiente entre S2 y apertura mitral + 80 ms
  let iCruce = -1, iMax = iS2; for (let i = iS2; i < o.length && o[i].t < u.tMitAbre + 0.08; i++) { if (iCruce < 0 && o[i].pvd > o[i].pvi) iCruce = i; if (o[i].pvd - o[i].pvi > o[iMax].pvd - o[iMax].pvi) iMax = i; }
  // IE en el instante de máximo septoSigno en la ventana S2 … apertura mitral + 80 ms (Ryan: cavidad mínima del VI en eje corto; Marcus: abombamiento máx. en diástole precoz)
  let iSig = iS2; for (let i = iS2; i < o.length && o[i].t < u.tMitAbre + 0.08; i++) if (septoSignoDe(o[i].pvd - o[i].pvi, o[i].pvi) > septoSignoDe(o[iSig].pvd - o[iSig].pvi, o[iSig].pvi)) iSig = i;
  const ex = extraDeMotor(m), td = o.reduce((a, x) => x.vvi > a.vvi ? x : a), gTd = baseGeometrica(estadoGeo(td, ex));
  const ie = (s) => { const gg = baseGeometrica(estadoGeo(s, ex)); return indiceExcentricidad(gg, -0.45 * gTd.vi.L - (gg.vi.Le - gTd.vi.Le)).ei; };
  const domo = (() => { let ab = [], cur = []; for (const q of o) { if (q.pvd > q.pad) cur.push(q); else { if (cur.length > ab.length) ab = cur; cur = []; } } if (cur.length > ab.length) ab = cur; let im = 0; ab.forEach((q, i) => { if (q.pvd - q.pad > ab[im].pvd - ab[im].pad) im = i; }); return im / (ab.length - 1); })();
  const f = (i) => `${o[i].pvd.toFixed(0)}/${o[i].pvi.toFixed(0)} (${ms(i)} ms)`;
  console.log(`${(k + (g ?? '')).padEnd(12)} S2 ${f(iS2)} · mitAbre ${f(iMit)} IVRT ${ms(iMit)} · cruce ${iCruce < 0 ? 'NO' : f(iCruce)} · gradMax ${(o[iMax].pvd - o[iMax].pvi).toFixed(1)} @${ms(iMax)} ms · IE Vmin ${v.eiS.toFixed(2)} | IE maxSigno ${ie(o[iSig]).toFixed(2)} @${ms(iSig)} ms (signo ${septoSignoDe(o[iSig].pvd - o[iSig].pvi, o[iSig].pvi).toFixed(2)}) | IE td ${v.eiD.toFixed(2)} | FC ${u.fc.toFixed(0)} GC ${u.gc.toFixed(2)} PAM ${u.pam.toFixed(0)} PAPs ${u.paps.toFixed(0)} TAPSE ${v.tapse.toFixed(1)} vIT ${v.vTr.toFixed(2)} S2p−S2 ${Math.round((u.tS2p - u.tS2) * 1000)} ms · TAP ${aceleracionTsvd(o).act.toFixed(0)} ms · domo ${(100 * domo).toFixed(0)} % · FEVD ${(100 * u.feD).toFixed(0)} · VDbasal ${(10 * v.dVd).toFixed(0)} mm · edvD ${u.edvD.toFixed(0)}`);
}
