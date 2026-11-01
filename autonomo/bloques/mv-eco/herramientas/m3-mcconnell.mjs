// M3 · desplazamiento (mm) hacia dentro, de telediástole a telesístole, de tres puntos del endocardio de la pared libre del VD
// (base 0,10 · media 0,45 · ápex 0,85 del largo; ángulo 2,4 rad) en el TEP, con el dibujo 2. «antes» = estado.mcconnell = 0 (sin M3).
// uso: node autonomo/bloques/mv-eco/herramientas/m3-mcconnell.mjs   (g = gravedad del TEP; por defecto 1, 0.5)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { baseGeometrica, usarDibujo } from '../../../../js/modules/eco/corazon-geo.mjs';
usarDibujo(2);
export function desplazamientos(g) {
  const m = crearMotor(); m.correr(12); ESCENARIOS.tep.aplicar(m, g); m.correr(ASENTAR_FORMA);
  const ex = extraDeMotor(m), o = m.onda;
  const iTd = o.reduce((b, x, i) => x.vvd > o[b].vvd ? i : b, 0), iTs = o.reduce((b, x, i) => x.vvd < o[b].vvd ? i : b, 0);
  const salida = {};
  for (const [nombre, mc] of [['antes', 0], ['despues', ex.mcconnell]]) {
    const gs = [iTd, iTs].map(i => baseGeometrica({ ...estadoGeo(o[i], ex), mcconnell: mc }));
    salida[nombre] = {};
    for (const [seg, fz] of [['base', 0.10], ['media', 0.45], ['apice', 0.85]]) {
      const r = gs.map(G => { const z = -G.Lvd * fz; const p = G.endoVd(z, +(process.env.F || 2.4)); return Math.hypot(p[0], p[1]) - 0; });
      salida[nombre][seg] = +(r[0] - r[1]).toFixed(2);
    }
  }
  return { g, mcconnell: +ex.mcconnell.toFixed(2), ...salida };
}
if (process.argv[1]?.endsWith('m3-mcconnell.mjs')) for (const g of [1, 0.5]) console.log(JSON.stringify(desplazamientos(g)));
