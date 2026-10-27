const R = new URL('../../../../js/modules/eco/', import.meta.url).href;
const { crearMotor } = await import(R + 'motor.mjs');
const { ESCENARIOS, ASENTAR_FORMA } = await import(R + 'escenarios.mjs');
const { tapseDeLatido, LIMITES, baseGeometrica } = await import(R + 'corazon-geo.mjs');
const { estadoGeo, extraDeMotor } = await import(R + 'formas.mjs');
const D = await import(R + 'doppler.mjs');
const { ePrima } = await import(R + 'atlas/diastolica.mjs');
const f = (x, d = 0) => (x == null || Number.isNaN(x)) ? '-' : Number(x).toFixed(d);
const casos = [['normal'], ['vasoplejia'], ['hipertrofia'], ['dilatada']];
for (const k of ['hemorragia', 'fallo', 'derrame', 'tep', 'hpcronica']) casos.push([k, 0], [k, 'def'], [k, 1]);
for (const [k, g] of casos) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
  const o = m.onda, u = m.ultimo;
  const td = o.reduce((a, b) => (b.vvi > a.vvi ? b : a));
  const areas = D.areasAnillo(baseGeometrica(estadoGeo(td, extraDeMotor(m))));
  const mit = D.medidasLatido(D.curvaLatido(o, { tipo: 'valvula', n: 'mitral', factor: 1 }, 1, areas, {}), { tipo: 'valvula', n: 'mitral', factor: 1 });
  const pv = D.medidasLatido(D.curvaLatido(o, { tipo: 'vaso', vasoTipo: 'pulmonar', factor: 1, r: 5 }, 1, areas, { rRetorno: m.p.rRetorno, pvc: u.pvc }), { tipo: 'vaso', vasoTipo: 'pulmonar', factor: 1 });
  const e = ePrima(m.p.relajacion);
  const dt = o[1].t - o[0].t, A = o.filter(x => x.fase === 'A');
  const aW = (key) => Math.max(...A.map(x => x[key])) - A[0][key];
  const bomba = (q) => { const ll = o.reduce((a, x) => a + Math.max(0, x[q]) * dt, 0); return 100 * A.reduce((a, x) => a + Math.max(0, x[q]) * dt, 0) / ll; };
  const vvdTd = Math.max(...o.map(x => x.vvd)), vvdTs = Math.min(...o.map(x => x.vvd)), vviTd = Math.max(...o.map(x => x.vvi));
  // aviso: cualquier muestra del latido fuera de LIMITES (reproduce simulador.mjs l.847)
  const ex = [];
  const ch = (n, vals, lim) => { const mx = Math.max(...vals), mn = Math.min(...vals); if (mx > lim[1]) ex.push(`${n}+${f(mx - lim[1])}(${f(mx)})`); if (mn < lim[0]) ex.push(`${n}-${f(lim[0] - mn)}(${f(mn)})`); };
  ch('VI', o.map(x => x.vvi), LIMITES.vi); ch('VD', o.map(x => x.vvd), LIMITES.vd);
  ch('AI/AD', o.flatMap(x => [x.vai, x.vad]), LIMITES.au);
  console.log([`${k}:${g ?? '-'}`, `PAM${f(u.pam)} FC${f(u.fc)} PVC${f(u.pvc,1)} PCP${f(u.pcp,1)} GC${f(u.gc,2)}`,
    `E${f(mit.E)} A${f(mit.A)} E/A${f(mit.ea,2)} DT${f(mit.tde)}`, `e'sep${f(e.sep,1)} lat${f(e.lat,1)} avg${f(e.avg,1)} E/e'avg${f(mit.E / e.avg,1)}`,
    `VP S${f(pv.S)} D${f(pv.D)} Ar${f(pv.Ar)} S/D${f(pv.sd,2)}`, `mL/s S${f(pv.S*4*2.5)} D${f(pv.D*4*2.5)} Ar${f(pv.Ar/0.35*4*2.5)}`,
    `aAI${f(aW('pai'),1)} aAD${f(aW('pad'),1)}`, `bombaAI${f(bomba('qMit'))}% AD${f(bomba('qTri'))}%`,
    `TAPSE${f(tapseDeLatido(u),1)} VDtd${f(vvdTd)} VDts${f(vvdTs)} FEvd${f(100*(vvdTd-vvdTs)/vvdTd)}% VD/VI${f(vvdTd/vviTd,2)}`, `fuera:${ex.join(',') || 'no'}`].join(' | '));
}
