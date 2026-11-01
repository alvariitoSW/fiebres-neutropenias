// E2: abre la ficha 16 en Estudiar, recorre Piensa/Examínate/Caso y captura a 390 px. Uso: node e2-peep-estudio.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: 'neumo-peep-oculta' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1200);
const info = await p.evaluate(() => { const f = document.getElementById('neumo-peep-oculta'); return { act: f.classList.contains('active'), botones: [...f.querySelectorAll('button')].map(x => x.textContent.trim()).filter(x => /Estudiar|Mayéutica|Texto/.test(x)).slice(0, 6), ancho: document.documentElement.scrollWidth }; });
console.log(JSON.stringify(info));
await p.evaluate(() => [...document.querySelectorAll('#neumo-peep-oculta button')].find(x => /^Estudiar/.test(x.textContent.trim()))?.click());
await p.waitForTimeout(800); await p.screenshot({ path: OUT + 'estudiar.png' });
const pasos = await p.evaluate(() => [...document.querySelectorAll('#neumo-peep-oculta [class*="may"] button')].map(x => x.textContent.trim().slice(0, 40)).slice(0, 14));
console.log(pasos.join(' | '));
console.log('errores', JSON.stringify(err.slice(0, 5)), 'ancho', await p.evaluate(() => document.documentElement.scrollWidth));
await b.close();
