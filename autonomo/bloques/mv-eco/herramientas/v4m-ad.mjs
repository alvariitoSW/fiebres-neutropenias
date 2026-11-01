// v4m · barrido de la AD (Ees, V0, A) con el reloj nuevo: gradiente telediastólico VD−AD, catéter (VD telediastólica − PVC),
// AD mínima (mL), PAS normal, y en el TEP 1 la diastólica VD−VI (tabique aplanado en diástole).
//   node autonomo/bloques/mv-eco/herramientas/v4m-ad.mjs '[{"ees":0.22},{"ees":0.3,"v0":2}]' ['{"vd":{"a":1.9}}']
import { BASE, crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { telediastolicaVd } from '../../../../js/modules/eco/lecturas.mjs';
import { gradDiastole } from './m1-diastole.mjs';
const vals = JSON.parse(process.argv[2] || '[{}]'), extra = JSON.parse(process.argv[3] || '{}');
for (const [k, v] of Object.entries(extra)) { if (typeof v === 'object') Object.assign(BASE[k], v); else BASE[k] = v; }
const ad0 = { ...BASE.ad };
for (const a of vals) {
  Object.assign(BASE.ad, ad0, a); const lin = [JSON.stringify(a)];
  for (const [k, g] of [['normal'], ['hpcronica', 1], ['tep', 0.5], ['tep', 1]]) {
    const m = crearMotor(); m.correr(12); if (k !== 'normal') { ESCENARIOS[k].aplicar(m, g); m.correr(ASENTAR_FORMA); } m.correr(5);
    const o = m.onda, u = m.ultimo, td = telediastolicaVd(o, u), gd = gradDiastole(o).mx;
    const dia = o.filter(s => s.eVd < 0.01 && s.eVi < 0.02); const sep = dia.length ? Math.max(...dia.map(s => s.pvd - s.pvi)) : NaN;
    lin.push(`${k[0]}${g ?? ''} gd ${gd.toFixed(1)} td−PVC ${(td - u.pvc).toFixed(1)} PVC ${u.pvc.toFixed(1)} ADmin ${Math.min(...o.map(s => s.vad)).toFixed(0)} ADmax ${Math.max(...o.map(s => s.vad)).toFixed(0)} PAS ${u.pas.toFixed(0)} VD−VIdia ${sep.toFixed(1)} GC ${u.gc?.toFixed(2)}`);
  }
  console.log(lin.join('\n   '));
}
