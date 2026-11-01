// Capturas del paso Mira de las fichas asma/EPOC a 390 px. Uso: node v2-captura-mira.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), OUT = (process.argv[3] || '/tmp').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
const err = []; p.on('console', m => { if (['error', 'warning'].includes(m.type())) err.push(m.text().slice(0, 160)); });
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
for (const t of ['neumo-asma-epoc-basicos', 'neumo-asma-agudo', 'neumo-epoc-vpp']) {
  await p.evaluate((t) => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, t);
  await p.waitForTimeout(900);
  await p.evaluate((t) => document.querySelector(`#${t} > .vista-toggle button[data-vista="estudiar"]`).click(), t); await p.waitForTimeout(300);
  await p.evaluate((t) => document.querySelector(`#${t} .est-ir[data-ir-paso="mira"]`)?.click(), t); await p.waitForTimeout(800);
  await p.evaluate((t) => document.querySelector(`#${t} .est-paso[data-paso="mira"]`).scrollIntoView(), t); await p.waitForTimeout(300);
  await p.screenshot({ path: OUT + t + '.png' });
  console.log(t, await p.evaluate((t) => document.querySelectorAll(`#${t} .est-paso[data-paso="mira"] .vista-visual > *`).length, t));
}
console.log('consola', err);
await b.close();
