// v3m · barrido del TEP (forma del chorro, vIT, PSAP, TA, gradiente telediastólico y diastólico pasivo, PVC)
import { medir } from './m1-chorro.mjs';
for (const g of [0.5, 0.7, 0.85, 0.9, 0.95, 1]) { const r = medir('tep', g);
  console.log(g, 'pico', (100 * r.pos).toFixed(0), 'r25', r.r25.toFixed(2), 'r75', r.r75.toFixed(2), 'vIT', r.vIT.toFixed(2), 'PSAP', r.psap.toFixed(1), 'TA', r.ta.toFixed(0), 'gD', r.gd.toFixed(1), 'dPas', r.dPas.toFixed(1), 'PVC', r.pvc.toFixed(1), 'FEVD', r.fevd.toFixed(1)); }
