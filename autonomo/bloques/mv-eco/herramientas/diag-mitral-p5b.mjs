// mv-eco-2a5 · P5b: corte del plano sobre los dos velos mitrales (anterior azul, posterior rojo) a varias aperturas; SVG por vista.
// uso: node diag-mitral-p5b.mjs <salida.html>   (con ?dibujo=2: usarDibujo(2); DIB=1 para el dibujo de hoy)
import { usarDibujo, construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadosForma } from '../../../../js/modules/eco/pruebas/geometria-juez.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
import { writeFileSync } from 'node:fs';
usarDibujo(process.env.DIB ? 1 : 2);
const { td } = estadosForma('normal'); let html = '<body style="background:#111;color:#ccc;font:12px sans-serif">';
for (const vista of ['a4c', 'plax']) { html += `<h4>${vista}</h4>`;
  for (const [a, carga] of [[1, 0], [0.5, 0], [0, 0.6]]) {
    const st = { ...td, mitral: a, carga_mitral: carga }, P = planoVista(vista, st);
    let svg = '', n = 0, xs = [], ys = [];
    for (const p of construirCorazon(st).partes) { if (!/^Mitral/.test(p.nombre) || !p.idx) continue; const c = cortarPieza(p, P);
      const col = /anterior/.test(p.nombre) ? '#6af' : '#f66';
      for (let k = 0; k < c.seg.length; k += 4) { const s = c.seg.slice(k, k + 4); svg += `<line x1="${s[0]}" y1="${s[1]}" x2="${s[2]}" y2="${s[3]}" stroke="${col}" stroke-width="0.25"/>`; xs.push(s[0], s[2]); ys.push(s[1], s[3]); n++; } }
    const x0 = Math.min(...xs) - 3, y0 = Math.min(...ys) - 3, w = Math.max(...xs) - x0 + 3, h = Math.max(...ys) - y0 + 3;
    html += `<svg width="360" height="${360 * h / w}" viewBox="${x0} ${y0} ${w} ${h}" style="border:1px solid #444;margin:3px">${svg}</svg><span>a=${a} carga=${carga} seg=${n}</span>`; } }
writeFileSync(process.argv[2], html);
