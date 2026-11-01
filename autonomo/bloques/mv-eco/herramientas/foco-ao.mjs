// Foco VD sin aorta: distancia del plano al eje de la raíz aórtica (mm) y radio de la raíz, por escenario. uso: node foco-ao.mjs
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { baseGeometrica, usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { planoVista } from '../../../../js/modules/eco/ecografia.mjs';
export const distAo = (P, g) => Math.abs((g.ac[0] - P.O[0]) * P.n[0] + (g.ac[1] - P.O[1]) * P.n[1] + (16 - P.O[2]) * P.n[2]);
if (process.argv[1].endsWith('foco-ao.mjs')) for (const dib of [1, 2]) { usarDibujo(dib);
  for (const esc of [null, 'tep', 'hpcronica']) { const m = crearMotor(); m.correr(12); if (esc) { ESCENARIOS[esc].aplicar(m, 1); m.correr(ASENTAR_FORMA); }
    const ex = extraDeMotor(m), td = m.onda.reduce((b, x) => x.vvd > b.vvd ? x : b), est = estadoGeo(td, ex), g = baseGeometrica(est);
    console.log(dib, esc, 'rA', g.rA.toFixed(1), 'dist a4c', distAo(planoVista('a4c', est), g).toFixed(1), 'dist foco', distAo(planoVista('a4cVd', est), g).toFixed(1)); } }
