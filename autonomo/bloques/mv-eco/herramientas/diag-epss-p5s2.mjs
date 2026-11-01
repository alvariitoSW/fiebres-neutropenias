import { usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadosForma } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(2); const { td } = estadosForma(process.argv[2] || 'normal');
const st = { ...td, mitral: 1, carga_mitral: 0 }, P = planoVista('plax', st);
for (const p of construirCorazon(st).partes) { if (!p.idx) continue; if (!/^(Mitral|Septo|VI end|VD end|Aorta|Ra)/.test(p.nombre)) continue; const c = cortarPieza(p, P); const pts=[]; for (let k=0;k<c.seg.length;k+=4) pts.push([c.seg[k],c.seg[k+1]]);
 const xs=pts.map(a=>a[0]),ys=pts.map(a=>a[1]); if(!xs.length) continue; console.log(p.nombre, 'x', Math.min(...xs).toFixed(0), Math.max(...xs).toFixed(0), 'y', Math.min(...ys).toFixed(0), Math.max(...ys).toFixed(0)); }
