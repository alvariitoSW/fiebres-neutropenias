// Cifras del monitor de la app en sbt-fracaso (390 px). Uso: node a4b-sbt-cifras.mjs http://localhost:PUERTO/ [estado]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), EST = process.argv[3] || 'sbt-fracaso';
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.evaluate((e) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: e }); document.body.append(t); t.click(); t.remove(); }, EST);
await p.waitForTimeout(6000);
console.log(await p.evaluate(() => [...document.querySelectorAll('[data-fila]')].filter(e => e.offsetParent).map(e => e.dataset.fila + ': ' + e.textContent.replace(/\s+/g, ' ').trim().slice(0, 70)).join('\n')));
console.log(await p.evaluate(() => [...document.querySelectorAll('.pul-info, #pul-info, [class*=info]')].filter(e => /FR\/Vt/.test(e.textContent)).map(e => e.textContent.slice(0, 250))[0]));
await b.close();
