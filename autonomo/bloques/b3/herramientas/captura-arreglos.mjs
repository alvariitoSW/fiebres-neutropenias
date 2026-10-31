// Capturas a 390 px: neumotórax en el tope (con las cifras del corazón) y doble disparo. Uso: node …/captura-arreglos.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }), p = await ctx.newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
const abrir = async (k) => { await p.evaluate((k) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: k }); document.body.append(t); t.click(); t.remove(); }, k); await p.waitForTimeout(1200); await p.evaluate(() => window.__pulPruebas().llenar()); };
await abrir('neumotorax-tension');
for (let i = 0; i < 9; i++) { await p.evaluate(() => document.querySelector('#pul-neumo [data-nx="pasar"]').click()); await p.waitForTimeout(150); }
await p.waitForTimeout(3500);
console.log(await p.evaluate(() => ({ ptx: document.querySelector('[data-fila="neumo-p"] .v').textContent, spo2: document.querySelector('[data-fila="neumo-spo2"] .v').textContent, vs: document.querySelector('[data-fila="cor-vs"] .v').textContent, gc: document.querySelector('[data-fila="cor-gc"] .v').textContent, pam: document.querySelector('[data-fila="cor-pam"] .v').textContent, sello: [...document.querySelectorAll('#pul-raiz .tope-sello')].filter((e) => e.getClientRects().length).map((e) => e.textContent.replace(/\s+/g, ' ').slice(0, 260)) })));
await p.evaluate(() => document.querySelector('#pul-corazon').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
await p.screenshot({ path: OUT + 'neumotorax-tope-390.png' });
await abrir('doble-disparo'); await p.waitForTimeout(800);
await p.evaluate(() => document.querySelector('#pul-monitor').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
await p.screenshot({ path: OUT + 'doble-disparo-390.png' });
await b.close();
