// mv-eco-2a5 · vuelta 5: dibuja el corte PSAX del VI (endocardio rojo, papilares azul, epicardio naranja) en un SVG.
//   SVG=/ruta.svg node diag-psax-svg.mjs [escenario] [g]
import { writeFileSync } from 'node:fs';
import { usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadosForma } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
usarDibujo(2);
const k = process.argv[2] || 'tep', g = +(process.argv[3] ?? 1), { td } = estadosForma(k, g), P = planoVista('psaxPm', td);
const col = { 'VI endocardio': 'red', 'VI epicardio': 'orange' }; let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 40 120 100" width="720" height="600"><rect x="-60" y="40" width="120" height="100" fill="#111"/>';
for (const p of construirCorazon(td).partes) { const c = /^Papilar/.test(p.nombre) ? 'cyan' : col[p.nombre]; if (!c || !p.idx) continue;
  const r = cortarPieza(p, P); for (let i = 0; i < r.seg.length; i += 4) { const q = r.seg.slice(i, i + 4); s += `<line x1="${q[0]}" y1="${q[1]}" x2="${q[2]}" y2="${q[3]}" stroke="${c}" stroke-width="0.4"/>`; } }
writeFileSync(process.env.SVG || '/tmp/claude-0/s/psax.svg', s + '</svg>');
