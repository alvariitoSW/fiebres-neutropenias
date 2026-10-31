// Pared del VI, VI telediastólico y LVEI del TEP como las ve la prueba de enfermedad (mv-eco-2a5)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { medidasCorazon } from '../../../../js/modules/eco/ecografia.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
for (const g of process.argv.slice(2).map(Number)) {
  const m = crearMotor(); m.correr(12); ESCENARIOS.tep.aplicar(m, g); m.correr(ASENTAR_FORMA);
  const td = m.onda.reduce((a, b) => (b.vvi > a.vvi ? b : a), m.onda[0]);
  const md = medidasCorazon(estadoGeo(td, extraDeMotor(m)), m.p.sc), u = m.ultimo;
  console.log(`g${g}: VItd(onda) ${td.vvi.toFixed(1)} edv ${u.edv.toFixed(1)} pared ${md.paredPost.toFixed(1)} mm lvdd ${md.lvdd.toFixed(1)} VD/VI área ${md.areaVdVi.toFixed(2)} PAM ${u.pam.toFixed(1)} GC ${u.gc.toFixed(2)}`);
}
