// Frase viva del neumotórax tras cada pulsación (390 px). Uso: node a4b-frase-neumo.mjs http://localhost:PUERTO/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'neumotorax-tension' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1500);
for (let i = 0; i < 6; i++) {
  console.log(i, await p.evaluate(() => document.querySelector('[data-fila="neumo-p"] .v')?.textContent + ' | ' + document.querySelector('[data-nx="msg"]')?.textContent));
  await p.evaluate(() => document.querySelector('[data-nx="pasar"]').click()); await p.waitForTimeout(2200);
}
await b.close();
