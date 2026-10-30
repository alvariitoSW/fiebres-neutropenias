// Lee en la app (390 px) lo que pinta el monitor de Ramiro en un estado del modelo vivo, esperando a que se asiente.
// Uso: node g4-app-cifras.mjs http://localhost:PUERTO/ ic-etapa-3 [ic-cpap ...]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), claves = process.argv.slice(3);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
for (const k of claves) {
  await p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
  let ant = '', n = 0;
  for (let i = 0; i < 60 && n < 4; i++) { await p.waitForTimeout(700);
    const f = await p.evaluate(() => [...document.querySelectorAll('#shv-dock [data-fila], #shv-fila-lista [data-fila], [data-fila]')].filter(e => e.offsetParent).map(e => e.dataset.fila + '=' + e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
    n = f === ant ? n + 1 : 0; ant = f; }
  console.log(k, ant);
}
await b.close();
