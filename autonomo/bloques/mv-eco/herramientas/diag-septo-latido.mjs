// V2-S · septoSigno, pVD−pVI y LVEI (paralelo/perpendicular al tabique) a lo largo del latido, hpcronica g=1 y normal.
//   node autonomo/bloques/mv-eco/herramientas/diag-septo-latido.mjs [hoy|nuevo]
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { ESCENARIOS } from '../../../../js/modules/eco/escenarios.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { septoSignoDe } from '../../../../js/modules/eco/contrato.mjs';
import { contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
const dib = process.argv[2] || 'nuevo';
for (const [k, g] of [['normal'], ['hpcronica', 1]]) {
  const m = crearMotor(); m.correr(12);
  if (k !== 'normal') { ESCENARIOS[k].aplicar(m, g); m.correr(40); }
  const o = m.onda, extra = extraDeMotor(m), n = o.length;
  console.log(k, 'muestras', n);
  for (let i = 0; i < n; i += Math.max(1, Math.round(n / 14))) {
    const s = o[i], e = estadoGeo(s, extra), C = contornosVista('psaxPm', e, dib), p = C.viEndo?.cad?.flatMap(c => c.ps);
    const ex = (j) => Math.max(...p.map(q => q[j])) - Math.min(...p.map(q => q[j]));
    console.log(`i${i} vAo=${+!!s.vAo} vvi=${s.vvi.toFixed(0)} pvd-pvi=${(s.pvd - s.pvi).toFixed(1)} sig=${septoSignoDe(s.pvd - s.pvi).toFixed(2)} septoEst=${e.septo.toFixed(2)} EI(x/y)=${(ex(0) / ex(1)).toFixed(2)} EI(y/x)=${(ex(1) / ex(0)).toFixed(2)}`);
  }
}
