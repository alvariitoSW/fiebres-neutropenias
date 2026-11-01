// mv-eco-2a5 · P5s: corte PLAX de la raíz, válvulas y TSVD por pieza (colores) para un estado; uso: node diag-raiz-p5s.mjs <salida.html>  (env MIT, AO, PU)
import { usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadosForma } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
import { writeFileSync } from 'node:fs';
usarDibujo(2); const { td } = estadosForma('normal'); let html = '<body style="background:#111;color:#ccc;font:12px sans-serif">';
const COL = ['#6af', '#f66', '#6f6', '#fd6', '#f6f', '#6ff', '#fa6', '#aaa', '#8f8', '#88f'];
for (const [m, ao, pu] of [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0.5, 0, 0]]) {
  const st = { ...td, mitral: m, aortica: ao, pulmonar: pu, carga_mitral: 0 }, P = planoVista('plax', st); const nom = new Map(); let svg = '', xs = [], ys = [];
  for (const p of construirCorazon(st).partes) { if (!p.idx || !/^(Mitral|Cortina|Raíz|Aórtica|Pulmonar|Infund|Aorta$|VD endo|VD borde|Base)/.test(p.nombre)) continue; const c = cortarPieza(p, P);
    if (!nom.has(p.nombre)) nom.set(p.nombre, COL[nom.size % COL.length]); const col = nom.get(p.nombre);
    for (let k = 0; k < c.seg.length; k += 4) { const s = c.seg.slice(k, k + 4); if (s[0] < -10 || s[1] > 130 || s[1] < 15) continue; svg += `<line x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}" stroke="${col}" stroke-width="0.3"/>`; xs.push(s[0], s[2]); ys.push(s[1], s[3]); } }
  const x0 = Math.min(...xs) - 2, y0 = Math.min(...ys) - 2, w = Math.max(...xs) - x0 + 2, h = Math.max(...ys) - y0 + 2;
  html += `<div><svg width="520" height="${520 * h / w}" viewBox="${x0} ${y0} ${w} ${h}" style="border:1px solid #444">${svg}</svg><br>mit=${m} ao=${ao} pu=${pu} ${[...nom].map(([n, c]) => `<b style="color:${c}">${n}</b>`).join(' ')}</div>`; }
writeFileSync(process.argv[2], html);
