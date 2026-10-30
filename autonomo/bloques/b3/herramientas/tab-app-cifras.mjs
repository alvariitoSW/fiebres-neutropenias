// Cifras que pinta el MONITOR de la app para Remedios (rotura-septo) con el orificio de la receta (0,3) y con 0,7.
// Uso: node tab-app-cifras.mjs http://localhost:PUERTO/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'rotura-septo' }); document.body.append(t); t.click(); t.remove(); });
const leer = () => p.evaluate(() => [...document.querySelectorAll('[data-fila]')].filter(e => e.offsetParent).map(e => e.dataset.fila + '=' + e.textContent.replace(/\s+/g, ' ').trim()).join(' | '));
async function asentar() { let ant = '', n = 0; for (let i = 0; i < 60 && n < 4; i++) { await p.waitForTimeout(700); const f = await leer(); n = f === ant ? n + 1 : 0; ant = f; } return ant; }
console.log('civ 0,3', await asentar());
await p.evaluate(() => { const s = document.querySelector('#shv-d-grav'); s.value = 70; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
console.log('civ 0,7', await asentar());
await b.close();
