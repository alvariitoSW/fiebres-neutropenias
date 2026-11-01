// Capturas de Estudiar en las fichas 12 y 13 a 390 px. Uso: node e1-resp-capturas.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
for (const tab of ['neumo-ep-diagnostico', 'neumo-vm-modos', 'neumo-vm-ajuste']) {
  await p.evaluate(t => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, tab);
  await p.waitForTimeout(1200);
  const info = await p.evaluate(t => { const f = document.getElementById(t); const bs = [...f.querySelectorAll('button')].filter(e => /Estudiar|Mayéutica|Preguntas/i.test(e.textContent)); return { botones: bs.map(e => e.className + '|' + e.textContent.trim().slice(0, 30)), ancho: document.documentElement.scrollWidth }; }, tab);
  console.log(tab, JSON.stringify(info));
  await p.evaluate(t => [...document.getElementById(t).querySelectorAll('button')].find(e => /^\s*(📖\s*)?Estudiar/i.test(e.textContent))?.click(), tab);
  await p.waitForTimeout(800); await p.screenshot({ path: OUT + tab + '-estudiar.png' });
  console.log('desborde', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
}
console.log('errores', JSON.stringify(err.slice(0, 5)));
await b.close();
