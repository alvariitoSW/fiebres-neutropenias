// Lista los botones de «Juega» de una ficha. Uso: node juega-estados.mjs <url-base> <ficha>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [BASE, ficha] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE + 'index.html'); await p.waitForFunction(() => document.getElementById('mar-cristaloides')?.querySelector(':scope > .vista-estudiar'), null, { timeout: 15000 });
await p.evaluate(t => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, ficha);
await p.waitForTimeout(500);
await p.evaluate(f => document.querySelector(`#${f} > .vista-toggle [data-vista="estudiar"]`).click(), ficha); await p.waitForTimeout(300);
await p.evaluate(f => document.querySelector(`#${f} .est-ir[data-ir-paso="juega"]`).click(), ficha); await p.waitForTimeout(300);
console.log(await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-juega`)].map(e => e.dataset.ritmoVivo + ' :: ' + e.textContent).join('\n'), ficha));
await b.close();
