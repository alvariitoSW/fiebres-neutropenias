const R = new URL('../../../../js/modules/eco/pruebas/', import.meta.url).href;
const { medirForma, CASOS_FORMA, claveCaso } = await import(R + 'medir-forma.mjs');
const f = (x, d = 0) => (x == null || Number.isNaN(x)) ? '-' : Number(x).toFixed(d);
for (const [k, g] of CASOS_FORMA) {
  const r = medirForma(k, g);
  console.log([claveCaso(k, g), `PAM${f(r.pam)} FC${f(r.fc)} PVC${f(r.pvc,1)} PCP${f(r.pcp,1)} GC${f(r.gc,2)}`,
    `E${f(r.E)} A${f(r.A)} E/A${f(r.ea,2)} DT${f(r.dt)}`, `e'sep${f(r.eSep,1)} lat${f(r.eLat,1)} avg${f(r.eAvg,1)} E/e'avg${f(r.eE,1)}`,
    `VP S${f(r.S)} D${f(r.D)} Ar${f(r.Ar)} S/D${f(r.sd,2)}`, `mL/s S${f(r.S*4*2.5)} D${f(r.D*4*2.5)} Ar${f(r.Ar/0.35*4*2.5)}`,
    `aAI${f(r.aAI,1)} aAD${f(r.aAD,1)}`, `bombaAI${f(r.bombaAI)}% AD${f(r.bombaAD)}%`,
    `TAPSE${f(r.tapse,1)} VDtd${f(r.vdTd)} VDts${f(r.vdTs)} FEvd${f(100*(r.vdTd-r.vdTs)/r.vdTd)}% VD/VI${f(r.vdTd/r.viTd,2)}`, `fuera:${r.fuera.join(',') || 'no'}`].join(' | '));
}
