// Lee en la app (390 px) el monitor de Consuelo (TEP): abre 'tep', y con la gravedad pedida / +500 mL, espera a que se asiente.
// Uso: node g6-app-cifras.mjs http://localhost:PUERTO/   (prueba g = 0.95, 0.8, 0.7, 0.6, 0.5, 0.4 y +500 mL a 0.95)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForFunction(() => document.getElementById('shv-raiz'));
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'tep' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForFunction(() => window.__shvPruebas, null, { timeout: 15000 });
const leer = async () => { let ant = '', n = 0;
  for (let i = 0; i < 40 && n < 4; i++) { await p.waitForTimeout(600);
    const f = await p.evaluate(() => [...document.querySelectorAll('[data-fila]')].filter(e => e.offsetParent && ['fc','pa','pvc','pcp','ic'].includes(e.dataset.fila)).map(e => e.dataset.fila + '=' + e.textContent.replace(/\s+/g, ' ').trim()).join(' | ') + ' || ' + (window.__shvPruebas().R?.estado || ''));
    n = f === ant ? n + 1 : 0; ant = f; } return ant; };
for (const g of [0.95, 0.8, 0.7, 0.6, 0.5, 0.4]) {
  await p.evaluate(g => { const a = window.__shvPruebas(); a.nuevoPaciente(a.est.pac, { g }); a.refrescar(true); }, g);
  console.log('g', g, await leer());
}
await p.evaluate(() => { const a = window.__shvPruebas(); a.nuevoPaciente(a.est.pac, { g: 0.95 }); a.refrescar(true); });
await p.waitForTimeout(800);
await p.evaluate(() => document.querySelector('[data-vol="500"]')?.click());
console.log('g 0.95 +500', await leer());
await b.close();
