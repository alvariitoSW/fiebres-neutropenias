// Captura del panel del derrame (390 px): node derrame-captura.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, dir] = [process.argv[2], process.argv[3]];
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
await p.goto(base); await p.waitForTimeout(2500);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'derrame-paraneumonico' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1200);
const c = (s) => p.evaluate((s) => document.querySelector(s).click(), s);
for (const s of ['[data-g="tam"][data-v="locu"]', '[data-g="ph"][data-v="bajo"]', '[data-g="glu"][data-v="baja"]', '[data-g="gram"][data-v="pos"]', '[data-dr="tubo"]'].map(x => '#pul-derrame ' + x)) await c(s);
await p.evaluate(() => { const r = document.querySelector('#pul-derrame input[type=range]'); r.value = 48; r.dispatchEvent(new Event('input', { bubbles: true })); });
await p.waitForTimeout(400);
await p.locator('#pul-derrame').scrollIntoViewIfNeeded(); await p.locator('#pul-derrame').screenshot({ path: dir + '/derrame-48h-390.png' });
await b.close();
