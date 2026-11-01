// v2m · pVD, pAD, qTri durante un latido (cada 25 ms) y gradiente diastólico (ventana fuera del chorro de IT)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
export const CASOS = [['normal'], ['hpcronica', 0.6], ['hpcronica', 1], ['tep', 0.5], ['tep', 1]];
export function serie(k, g, aj = {}) { const m = crearMotor(); m.correr(12); if (k !== 'normal') ESCENARIOS[k].aplicar(m, g); Object.assign(m.p, aj); m.correr(ASENTAR_FORMA); m.correr(5); return m.onda; }
// diástole con la tricúspide abierta: desde que abre (pad>pvd, o flujo qTri>0) hasta que el VD empieza a contraer (eVd sube sobre 0,02)
export function gradDiastole(o) { let mx = -99, tm = 0, ab = false, ant = 0; for (const s of o) { if (s.pad > s.pvd || s.qTri > 0) ab = true; else if (s.eVd > 0.02 && s.eVd > ant) ab = false; ant = s.eVd; if (ab) { const d = s.pvd - s.pad; if (d > mx) { mx = d; tm = s.t; } } } return { mx, tm }; }
if (process.argv[1].endsWith('m1-diastole.mjs')) {
  const aj = process.argv[2] ? JSON.parse(process.argv[2]) : {};
  for (const [k, g] of CASOS) { const o = serie(k, g, aj); const r = gradDiastole(o);
    console.log(`${k} g=${g ?? '-'} diástole (fases F,G,A): max(pVD-pAD) ${r.mx.toFixed(1)} mmHg en t=${r.tm.toFixed(3)} (v ${Math.sqrt(Math.max(0, r.mx) / 4).toFixed(2)} m/s)`); }
}
