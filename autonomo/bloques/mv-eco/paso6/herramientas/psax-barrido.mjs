// Barrido: por instante, qué alturas z (mm) del plano PSAX mitral cortan los seis festones, y z del centro de cierre.
import { planoVista, valvasEnPlano, planoSigueAnillo } from '../../../../../js/modules/eco/ecografia.mjs';
import { latido } from './psax-anillo.mjs';
for (const k of ['normal', 'dilatada', 'fallo']) { const { td, ins } = latido(k); const P0 = planoVista('psaxMv', td);
  for (const { e, g } of ins) { const ok = [], alguno = []; const at = (z) => new Set(valvasEnPlano(g.partes, { ...P0, O: [P0.O[0], P0.O[1], z] }).filter(x => x.valvula === 'Mitral').map(x => x.nombre));
    for (let z = -30; z <= 12; z += 1) { const s = at(z).size; if (s === 6) ok.push(z); else if (s > 0) alguno.push(z); }
    console.log(k, 'm' + e.mitral.toFixed(2), 'd' + g.descenso.toFixed(1), 'cen z' + g.comisuras.centro[2].toFixed(1), 'seis', ok.length ? ok[0] + '..' + ok[ok.length - 1] : '-', 'alguno', alguno.length ? alguno[0] + '..' + alguno[alguno.length - 1] : '-'); } }
