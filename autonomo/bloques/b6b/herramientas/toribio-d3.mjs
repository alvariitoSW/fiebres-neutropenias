// Mide en el eje vivo las constantes de Toribio día 3 con hidrocortisona, con NA y sin ella. Uso: node toribio-d3.mjs <url-base>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8793/').replace(/\/?$/, '/');
const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 800 } }); const p = await ctx.newPage();
await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: 'toribio' }); x.className = 'especialidad-link'; document.body.appendChild(x); x.click(); });
await p.waitForTimeout(900);
for (const na of [0.4, 0.1, 0]) console.log('NA', na, JSON.stringify(await p.evaluate((na) => { const L = window.__eje.ir({ pac: 'toribio', set: { hc: 1, hcD: 0, dia: 3, na } }); return { pa: L.pas + '/' + L.pad, fc: L.fc, lact: L.lact, t: L.t }; }, na)));
await b.close();
