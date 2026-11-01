// mv-eco-2a5 · P5s: EPSS en el PLAX (mitral abierta): distancia mínima de la punta del velo anterior al endocardio septal (corte del plano).
import { usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadosForma } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(process.env.DIB ? 1 : 2);
for (const forma of ['normal', 'dilatada']) { const E = estadosForma(forma); const td = E.td;
  for (const a of [1, 0.7]) { const st = { ...td, mitral: a, carga_mitral: 0 }, P = planoVista('plax', st);
    const partes = construirCorazon(st).partes; let tip = [], sep = [];
    for (const p of partes) { if (!p.idx) continue; const c = cortarPieza(p, P);
      const pts = []; for (let k = 0; k < c.seg.length; k += 4) pts.push([c.seg[k], c.seg[k + 1]], [c.seg[k + 2], c.seg[k + 3]]);
      if (/^Mitral anterior/.test(p.nombre)) tip.push(...pts); if (p.nombre === 'VI endocardio') sep.push(...pts); }
    // punta = punto del velo más lejano al anillo (mayor distancia al punto del velo más cercano a la raíz): usamos el de menor distancia al septo y el máximo en el eje
    let best = 1e9, bp = null; for (const t of tip) for (const s of sep) { const d = Math.hypot(t[0] - s[0], t[1] - s[1]); if (d < best) { best = d; bp = t; } }
    console.log('punta', bp.map(x=>x.toFixed(1)).join(','), 'septo', sep.filter((s,i)=>i%12==0).map(s=>s.map(x=>x.toFixed(0)).join(',')).join(' '));
    console.log(forma, 'mitral', a, 'n velo', tip.length, 'dist mín velo-VI endo', best.toFixed(1), 'mm'); } }
