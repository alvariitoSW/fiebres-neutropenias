// mv-eco-2a5 P1b: variables que podrían explicar e′: tasa de llenado, relajación, FE, PCP, FC, volumen telediastólico.
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { ePrima } from '../../../../js/modules/eco/atlas/diastolica.mjs';
const f = (x, d = 2) => Number(x).toFixed(d);
console.log('caso\ttasa\trelaj\tFE\tPCP\tFC\tvTd\teMotor\teAtlas');
for (const k of Object.keys(ESCENARIOS)) {
  const gr = ESCENARIOS[k].gravedad, pts = gr ? [0, 'def', 0.5, 0.9, 0.95, 1] : [undefined];
  for (const g of pts) {
    const m = crearMotor(); m.correr(12);
    if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
    const u = m.ultimo, e = u.ePrima, vTd = Math.max(...m.onda.map(x => x.vvi));
    console.log([`${k}:${g ?? '-'}`, f(e.tasa, 1), f(m.p.relajacion), f(u.fe, 0), f(u.pcp, 0), f(u.fc, 0), f(vTd, 0), f(e.lat, 1), f(ePrima(m.p.relajacion, u.fe).lat, 1)].join('\t'));
  }
}
