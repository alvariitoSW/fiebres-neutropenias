// Capturas a 390 px del Estudiar de las fichas de asma. Uso: node e4-captura-asma.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = (process.argv[3] || '/tmp').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
const err = []; p.on('console', m => m.type() === 'error' && err.push(m.text())); p.on('pageerror', e => err.push(String(e)));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const ancho = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
for (const ficha of ['neumo-asma-epoc-basicos', 'neumo-asma-agudo']) {
  await p.evaluate(f => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: f }); document.body.append(t); t.click(); t.remove(); }, ficha);
  await p.waitForTimeout(900);
  await p.click(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(600);
  const pasos = await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-ir`)].map(e => e.dataset.irPaso), ficha);
  console.log(ficha, 'pasos', pasos.join(','), 'desborde', await ancho());
  await p.screenshot({ path: OUT + ficha + '-1.png' });
  for (const paso of ['juega', 'piensa', 'examen', 'caso']) {
    await p.evaluate(([f, s]) => document.querySelector(`#${f} [data-ir-paso="${s}"]`)?.click(), [ficha, paso]); await p.waitForTimeout(500);
    console.log(' ', paso, 'desborde', await ancho(), 'botones modelo', await p.evaluate(f => document.querySelectorAll(`#${f} .may-modelo`).length, ficha));
    await p.evaluate(f => document.querySelector(`#${f} .est-paso:not([hidden])`)?.scrollIntoView(), ficha); await p.waitForTimeout(200);
    await p.screenshot({ path: OUT + `${ficha}-${paso}.png` });
  }
}
console.log('errores', JSON.stringify(err.slice(0, 5)));
await b.close();
