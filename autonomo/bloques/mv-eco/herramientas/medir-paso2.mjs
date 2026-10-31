// mv-eco-2a5 paso 0: cifras de HOY del motor del corazón en los 9 escenarios (g = 0, defecto, 0,5, 1).
// Uso: node autonomo/bloques/mv-eco/herramientas/medir-paso2.mjs > salida.txt   (no escribe nada en la app)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../../../../js/modules/eco/escenarios.mjs';
import { contratoDe } from '../../../../js/modules/eco/contrato.mjs';
import { puenteHoy } from '../../../../js/modules/eco/contrato-puente-hoy.mjs';
import { medirForma } from '../../../../js/modules/eco/pruebas/medir-forma.mjs';
const f = (x, d = 1) => x == null || Number.isNaN(x) ? '-' : Number(x).toFixed(d);
const cols = ['caso', 'FC', 'PAM', 'GC', 'PSAP', 'PVC', 'PCP', 'FEVI', 'FEVD', 'VD/VI', 'E', 'eSep', 'eLat', 'E/e′', 'TAP ms', 'sept.max', 'sept.TD', 'PVI ini', 'PVI fin'];
console.log(cols.join('\t'));
for (const k of Object.keys(ESCENARIOS)) {
  const gr = ESCENARIOS[k].gravedad, puntos = gr ? [[0, '0'], ['def', 'def'], [0.5, '0.5'], [1, '1']] : [[undefined, '-']];
  for (const [g, et] of puntos) {
    const m = crearMotor(); m.correr(12);
    if (k !== 'normal') { if (g === 'def' || g === undefined) ESCENARIOS[k].aplicar(m); else ESCENARIOS[k].aplicar(m, g); m.correr(ESCENARIOS[k].forma ? ASENTAR_FORMA : 40); }
    const c = contratoDe(m, puenteHoy(m)), L = c.latido, h = medirForma(k, g === 'def' ? undefined : g), o = m.onda;
    const iTd = o.reduce((a, x, i) => x.vvi > o[a].vvi ? i : a, 0), sep = c.instantes.map(i => i.septo);
    console.log([`${k}:${et}`, f(L.fc, 0), f(L.pam, 0), f(L.gc), f(L.paps, 0), f(L.pvc), f(L.pcp), f(L.fe, 0), f(L.feVd, 0), f(L.vdvi, 2), f(h.E, 0), f(h.eSep), f(h.eLat), f(L.eE), f(L['tiempos.tap'], 0),
      f(Math.max(...sep), 2), f(sep[iTd], 2), f(o[0].pvi), f(o[o.length - 1].pvi)].join('\t'));
  }
}
