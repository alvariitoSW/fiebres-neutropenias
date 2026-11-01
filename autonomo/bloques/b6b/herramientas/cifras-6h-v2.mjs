// Cifras del eje vivo con estado a medida (app a 390 px). Uso: node cifras-6h-v2.mjs <url> '<json de [pac, set]>'
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8766/').replace(/\/?$/, '/');
const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 800 } }); const p = await ctx.newPage();
await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: 'toribio' }); x.className = 'especialidad-link'; document.body.appendChild(x); x.click(); });
await p.waitForTimeout(900);
for (const [pac, set] of JSON.parse(process.argv[3] || '[]')) {
  const r = await p.evaluate(([pac, set]) => { window.__eje.ir({ pac, set }); return JSON.stringify(window.__eje.leer()); }, [pac, set]);
  console.log(pac, JSON.stringify(set), '\n ', r);
}
await b.close();
