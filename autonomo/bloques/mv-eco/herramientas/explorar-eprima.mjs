// P1: candidatos de e′ desde la dinámica del VI (exploración; no escribe nada en la app)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
const f = (x, d = 2) => Number(x).toFixed(d);
for (const k of Object.keys(ESCENARIOS)) {
  const gr = ESCENARIOS[k].gravedad, pts = gr ? [0, 'def', 1] : [undefined];
  for (const g of pts) {
    const m = crearMotor(); m.correr(12);
    if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
    const o = m.onda, u = m.ultimo; let gMax = 0, dpk = 0, vpk = 0, dvMax = 0, dpMin = 0, lenMax = 0;
    for (let i = 1; i < o.length - 1; i++) {
      const x = o[i]; if (!(x.t > 0) ) continue;
      const dv = (o[i + 1].vvi - o[i - 1].vvi) / 0.004, dp = (o[i + 1].pvi - o[i - 1].pvi) / 0.004;
      const gr2 = x.pai - x.pvi; if (x.fase === 'F' || x.fase === 'E' || x.fase === 'FG') { if (dv > 0.5 * 100 && gr2 > 0.3) gMax = Math.max(gMax, dv / gr2); if (dv > dvMax) { dpk = gr2; vpk = x.vvi; } }
      if (x.fase === 'F' || x.fase === 'E' || x.fase === 'FG') { dvMax = Math.max(dvMax, dv); lenMax = Math.max(lenMax, 0.27 * 80 * Math.pow(x.vvi / 120, 0.27) * dv / x.vvi / 10); }
      if (x.pvi > 0 && dp < dpMin && x.fase !== 'A') dpMin = dp;
    }
    console.log(`${k}:${g}`.padEnd(16), 'fe', f(u.fe * 100, 0), 'dV/dt', f(dvMax, 0), 'lenMax cm/s', f(lenMax), '-dP/dtmin', f(dpMin, 0), 'edv', f(u.edv, 0), 'cond', f(gMax, 0), 'dPpk', f(dpk), 'dV/V', f(dvMax / vpk * 1, 2), 'fases', [...new Set(o.map(x => x.fase))].join(''));
  }
}
