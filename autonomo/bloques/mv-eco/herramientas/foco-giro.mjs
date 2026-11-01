// Foco VD: giro (grados) del plano respecto al A4C y VD/VI del corte, normal y TEP g=1. uso: node foco-giro.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { planoVista, desviacion } from '../../../../js/modules/eco/ecografia.mjs';
import { usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
usarDibujo(+(process.env.D || 2));
for (const [n, esc] of [['normal', null], ['tep', 'tep']]) {
  const m = crearMotor(); m.correr(12); if (esc) { ESCENARIOS[esc].aplicar(m, 1); m.correr(ASENTAR_FORMA); }
  const ex = extraDeMotor(m), o = m.onda, td = o.reduce((b, x) => x.vvd > b.vvd ? x : b), est = estadoGeo(td, ex);
  const A = planoVista('a4c', est), F = planoVista('a4cVd', est);
  const dn = Math.acos(Math.abs(A.n[0]*F.n[0]+A.n[1]*F.n[1]+A.n[2]*F.n[2]))*180/Math.PI; console.log(n, 'plano girado', dn.toFixed(1), 'giro', desviacion(A, F).grados.toFixed(1), 'mitad°', (F.mitad * 180 / Math.PI).toFixed(0), 'A4C mitad°', (A.mitad * 180 / Math.PI).toFixed(0));
}
