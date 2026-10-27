// Tabla TAPSE / FE VD / PAM por forma y gravedad. Uso: node autonomo/bloques/eco-mega/herramientas/tapse-tabla.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { tapseDeLatido } from '../../../../js/modules/eco/corazon-geo.mjs';
const casos = [['normal'], ['tep', 0], ['tep'], ['tep', 1], ['hpcronica', 0], ['hpcronica'], ['hpcronica', 1]];
for (const [k, g] of casos) {
  const m = crearMotor(); m.correr(12); ESCENARIOS[k].aplicar(m, g); if (k !== 'normal') m.correr(ASENTAR_FORMA);
  const u = m.ultimo;
  console.log(`${k} g=${g ?? 'def'}  TAPSE ${tapseDeLatido(u).toFixed(1)}  FEvd ${(u.feD * 100).toFixed(0)}%  PAM ${(u.pam ?? NaN).toFixed?.(0)}  keys:${Object.keys(u).filter(x=>/pa|map|pam/i.test(x)).join(',')}`);
}
