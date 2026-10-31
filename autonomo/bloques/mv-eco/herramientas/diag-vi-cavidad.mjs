// Mv-eco 2b · diagnóstico: cavidad del VI frente a miocardio (A4C y eje corto) y tamaño de papilares frente a la cavidad.
//   node autonomo/bloques/mv-eco/herramientas/diag-vi-cavidad.mjs [hoy|nuevo]
import { estadosForma, contornosVista } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
const dib = process.argv[2] || 'nuevo';
const area = (cad) => { let s = 0; for (const c of cad) { const p = c.ps; let a = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; } s += a / 2; } return Math.abs(s); };
const ext = (cad, i) => { const p = cad.flatMap(c => c.ps); return Math.max(...p.map(q => q[i])) - Math.min(...p.map(q => q[i])); };
console.log(`dibujo ${dib} | forma | vista | área cavidad | área epi | cav/mio | paredes (mm): ancho y alto de la cavidad | LVEI`);
for (const [k, g] of [['normal', undefined], ['hpcronica', 1], ['tep', 1]]) {
  const { td } = estadosForma(k, g);
  for (const v of ['a4c', 'psaxPm']) {
    const C = contornosVista(v, td, dib), en = C.viEndo?.cad, ep = C.viEpi?.cad; if (!en || !ep) { console.log(k, v, 'sin contornos'); continue; }
    const ac = area(en), ae = area(ep);
    console.log(`${k} g=${g ?? '-'} | ${v} | ${ac.toFixed(0)} | ${ae.toFixed(0)} | ${(ac / (ae - ac)).toFixed(2)} | ${ext(en, 0).toFixed(1)} x ${ext(en, 1).toFixed(1)} | mvi=${td.mioVi} vvi=${td.vvi.toFixed(0)} | septo ${td.septo?.toFixed(2)}`);
  }
  const { vi } = (await import('../../../../js/modules/eco/corazon-geo.mjs')).baseGeometricaHoy(td, { septoContinuo: true });
  console.log(`   Rm=${vi.Rm.toFixed(1)} Rb=${vi.Rb.toFixed(1)} L=${vi.L.toFixed(0)} → papilar R0 5,5 mm vs radio cavidad; trabéculas 1 mm`);
}
