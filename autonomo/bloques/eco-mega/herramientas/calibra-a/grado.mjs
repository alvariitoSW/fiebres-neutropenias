import { crearMotor } from '/home/user/fiebres-neutropenias/js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '/home/user/fiebres-neutropenias/js/modules/eco/escenarios.mjs';
import { medirLlenado, algoritmoAse } from '/home/user/fiebres-neutropenias/js/modules/eco/atlas/diastolica.mjs';
for (const [k, gs] of [['hipertrofia',[0,'def',0.5,1]],['dilatada',['def']],['fallo',[0,'def',1]],['normal',['def']]]) for (const g of gs) {
  const m = crearMotor({barorreflejo:true}); m.correr(12);
  if (k!=='normal') { g==='def'?ESCENARIOS[k].aplicar(m):ESCENARIOS[k].aplicar(m,g); m.correr(ESCENARIOS[k].forma?ASENTAR_FORMA:40); }
  const v = medirLlenado(m), r = algoritmoAse(v);
  console.log(k,g,'E/A',v.ea.toFixed(2),'e′',v.sep.toFixed(1),v.lat.toFixed(1),'E/e′',v.eeAvg.toFixed(1),'TR',v.vTr.toFixed(2),'LAVI',v.lavi.toFixed(0),'PCP',v.pai.toFixed(1),'→ rama',r.rama,'grado',r.grado);
}
