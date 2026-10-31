// PAM, VS y SpO2 que enseña la app en cada insuflación del neumotórax a tensión. Uso: node ... <url-base>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE); await p.waitForTimeout(2500);
const num = s => { const m = String(s ?? '').replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? +m[0] : null; };
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'neumotorax-tension' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1200);
for (let i = 0; i <= 14; i++) {
  await p.evaluate(() => window.__pulPruebas().llenar()); 
  try { await p.waitForFunction(() => { const s = document.getElementById('pul-corazon'), n = window.__pulPruebas(); return !s.hidden && !/…/.test(s.textContent) && +s.dataset.presion === Math.round((n.L?.pMedia ?? 0) + (+document.querySelector('#pul-neumo [data-fila="neumo-p"] .v').textContent.replace(',', '.'))); }, null, { timeout: 12000 }); } catch {}
  await p.waitForTimeout(300);
  const g = k => p.evaluate(k => document.querySelector(k)?.textContent || '', k);
  console.log('ptx', num(await g('#pul-neumo [data-fila="neumo-p"] .v')), 'PAM', num(await g('#pul-corazon [data-fila="cor-pam"] .v')), 'VS', num(await g('#pul-corazon [data-fila="cor-vs"] .v')), 'GC', num(await g('#pul-corazon [data-fila="cor-gc"] .v')), 'sello', await p.evaluate(() => [...document.querySelectorAll('#pul-raiz .tope-sello')].filter(e => e.getClientRects().length).map(e => e.textContent.slice(0, 30))));
  await p.evaluate(() => document.querySelector('#pul-neumo [data-nx="pasar"]').click()); await p.waitForTimeout(250);
}
await b.close();
