// Cifras del monitor de la app (390 px) del neumotórax a tensión en cada paso de "Dejar pasar": presión pleural, PAM, GC, SpO2 y sello.
// Uso: node nx-cifras.mjs http://localhost:PUERTO/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/');
const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'neumotorax-tension' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1200);
const leer = () => p.evaluate(() => { const v = (s) => document.querySelector(s)?.textContent.trim(); return { ptx: v('#pul-neumo [data-fila="neumo-p"] .v'), spo2: v('#pul-neumo [data-fila="neumo-spo2"] .v'), pam: v('#pul-corazon [data-fila="cor-pam"] .v'), gc: v('#pul-corazon [data-fila="cor-gc"] .v'), sello: [...document.querySelectorAll('#pul-raiz .tope-sello')].filter(e => e.getClientRects().length).map(e => e.textContent.slice(0, 40)).join('|') }; });
for (let i = 0; i < 11; i++) {
  await p.evaluate(() => { window.__pulPruebas().llenar?.(); }); await p.waitForTimeout(+(process.argv[3] || 2500));
  console.log(JSON.stringify(await leer()));
  if (await p.evaluate(() => document.querySelector('#pul-neumo [data-nx="pasar"]').disabled)) break;
  await p.evaluate(() => document.querySelector('#pul-neumo [data-nx="pasar"]').click()); await p.waitForTimeout(300);
}
if (process.argv[4]) { await p.waitForTimeout(+process.argv[4]); console.log("tras espera", JSON.stringify(await leer())); }
await b.close();
