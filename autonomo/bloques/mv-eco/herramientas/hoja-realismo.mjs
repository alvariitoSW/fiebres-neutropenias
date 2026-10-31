// Genera capturas-realismo/hoja.html y hoja.md (captura | figura real, con página y cifras). Después comprueba que las imágenes cargan.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = join(dirname(fileURLToPath(import.meta.url)), '..', 'capturas-realismo');
const ESC = ['esc-ers-2022-hipertension-pulmonar-parte1.pdf', 'ESC/ERS 2022 HP, Fig. 4 (esquemas de eco)', 27, '3644'];
const LANG12 = ['lang-2015-cuantificacion-camaras-ase.pdf', 'Lang 2015, Fig. 4 (A4C, A2C y eje largo reales)', 12, '12'];
const MUK1 = ['mukherjee-2025-corazon-derecho-hp-ase.pdf', 'Mukherjee 2025, Fig. 1 (planos estándar: esquemas)', 6, '146'];
const PARES = [
  ['normal-a4c', 'Normal · apical 4 cámaras', 'normal', '-', LANG12],
  ['normal-psax', 'Normal · eje corto (papilares)', 'normal', '-', MUK1],
  ['normal-plax', 'Normal · paraesternal eje largo', 'normal', '-', MUK1],
  ['hp-a4c', 'HP crónica · A4C', 'hpcronica', '1', ESC],
  ['hp-psax', 'HP crónica · eje corto (papilares)', 'hpcronica', '1', ESC],
  ['tep-a4c', 'TEP · A4C', 'tep', '1', ESC],
  ['tep-psax', 'TEP · eje corto (papilares)', 'tep', '1', ESC],
  ['dilatada-a4c', 'Dilatada · A4C', 'dilatada', '1', ['mitchell-2019-ett-completa-ase.pdf', 'Mitchell 2019, Fig. 8 (VI de miocardiopatía dilatada, A4C real)', 8, '8']],
  ['derrame-sc4c', 'Derrame (taponamiento) · subcostal 4 cámaras', 'derrame', '1', ESC],
  ['hipertrofia-plax', 'Hipertrofia · PLAX', 'hipertrofia', '1', ['lang-2015-cuantificacion-camaras-ase.pdf', 'Lang 2015, Fig. 6 (geometría del VI por RWT; solo diagrama)', 17, '17']],
  ['hp-a4c-dibujo-hoy', 'HP crónica · A4C con el dibujo de hoy (antes/después de hp-a4c)', 'hpcronica', '1', ['mukherjee-2025-corazon-derecho-hp-ase.pdf', 'Mukherjee 2025, Fig. 4 (remodelado del corazón derecho en HP, A4C reales)', 32, '172']],
];
const cif = await readFile(join(D, 'cifras.md'), 'utf8');
const sec = (k) => (cif.split('## ').find(s => s.startsWith(k + ' (')) || '').split('\n').slice(1).filter(Boolean);
let html = `<!doctype html><meta charset="utf-8"><title>Realismo de la eco: captura | figura real</title><style>body{font:14px sans-serif;background:#111;color:#ddd;margin:16px}.par{display:flex;gap:12px;flex-wrap:wrap;margin:0 0 28px;border-top:1px solid #444;padding-top:10px}.par img{max-width:48vw;height:auto;background:#fff}.par .a img{background:#000}ul{font-size:12px}</style><h1>Eco con ?dibujo=2: captura | figura real</h1>`;
let md = '# Hoja de realismo: captura de la app | figura real\n\nTelediástole = fase A (contracción auricular), con pausa. Dibujo nuevo (`?dibujo=2`) salvo la última fila.\n\n';
for (const [k, tit, esc, g, [pdf, fig, pag, imp]] of PARES) {
  const c = sec(k), pie = `${pdf} · PDF p. ${pag} · página impresa ${imp} · ${fig}`;
  html += `<section class="par" id="${k}"><h2 style="width:100%">${tit} (escenario ${esc}, g=${g})</h2><div class="a"><img src="${k}.png" alt="captura ${k}"><p>${k}.png</p></div><div><img src="ref-${k}.png" alt="figura ${k}"><p>ref-${k}.png<br>${pie}</p></div><ul>${c.map(l => `<li>${l.replace(/^- /, '')}</li>`).join('')}</ul></section>`;
  md += `## ${tit}\n- Escenario ${esc}, g=${g}\n- Captura: \`${k}.png\`\n- Figura: \`ref-${k}.png\` (${pie})\n${c.join('\n')}\n\n`;
}
await writeFile(join(D, 'hoja.html'), html); await writeFile(join(D, 'hoja.md'), md); console.log('hoja escrita');
// comprobación: todas las imágenes cargan
const pw = await import('playwright').catch(() => import('/opt/node22/lib/node_modules/playwright/index.mjs'));
const nav = await pw.chromium.launch(); const pg = await nav.newPage();
await pg.goto('file://' + join(D, 'hoja.html')); await pg.waitForTimeout(800);
const malas = await pg.evaluate(() => [...document.images].filter(i => !(i.naturalWidth > 0)).map(i => i.alt));
console.log('imágenes:', await pg.evaluate(() => document.images.length), 'sin cargar:', malas); await nav.close();
