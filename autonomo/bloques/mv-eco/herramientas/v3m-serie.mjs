// v3m · serie de un latido (cada 10 ms): eAur, eVd, pAD, pVD, qTri, VAD, VVD, qRet
//   node v3m-serie.mjs tep 1 ['{"ad":{"a":..},"p":{...}}']
import { serie } from './m1-diastole.mjs';
const [k = 'normal', g] = process.argv.slice(2);
const o = serie(k, g == null ? undefined : +g, process.argv[4] ? JSON.parse(process.argv[4]) : {});
let ult = -1;
for (const s of o) { if (s.t - ult < 0.0099) continue; ult = s.t;
  console.log(`${s.t.toFixed(2)} eA ${s.eAur.toFixed(2)} eVd ${s.eVd.toFixed(2)} pad ${s.pad.toFixed(1)} pvd ${s.pvd.toFixed(1)} d ${(s.pvd - s.pad).toFixed(1)} qTri ${s.qTri.toFixed(0)} vad ${s.vad.toFixed(0)} vvd ${s.vvd.toFixed(0)} pven ${s.pven?.toFixed(1)} pap ${s.pap?.toFixed(1)} qPul ${s.qPul?.toFixed(0)} ${s.fase}`); }
