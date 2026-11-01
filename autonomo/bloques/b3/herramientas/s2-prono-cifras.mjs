// Cifras del monitor de la app para el estado prono (supino, prono 1 h, prono 16 h, supino 4 h después). Uso: node s2-prono-cifras.mjs <url>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2] || 'http://localhost:8412/';
const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && !/favicon/.test(m.text()) && err.push(m.text()));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'prono' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForTimeout(1200);
const llenar = () => p.evaluate(() => window.__pulPruebas().llenar());
const leer = () => p.evaluate(() => { const c = (k) => document.querySelector(`#pul-raiz [data-fila="${k}"]`); const g = (k) => c(k)?.querySelector('.v, .g')?.textContent; return { pf: c('fio2')?.querySelector('.sub')?.textContent, vt: g('vt'), vtkg: g('vtkg'), vm: g('vm'), fr: g('fr'), meseta: g('meseta'), dp: g('dp'), cstat: g('cstat'), pico: g('pico'), cons: document.querySelectorAll('.esc-alv.prono-cons').length, sello: [...document.querySelectorAll('#pul-raiz .tope-sello')].map(e => e.textContent.slice(0, 60)).join('|') }; });
const clic = async (s) => { await p.evaluate(s => document.querySelector(s).click(), s); await p.waitForTimeout(150); await llenar(); };
const mando = async (v) => { await p.evaluate(v => { const d = document.querySelector('#pul-dock-panel input[data-m="horas"]'); d.max = 64; d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); }, v); await p.waitForTimeout(150); await llenar(); };
await llenar(); console.log('supino', JSON.stringify(await leer()));
for (const h of [1, 4, 8, 12, 16, 24, 32]) { await mando(h); console.log('prono', h, 'h', JSON.stringify(await leer())); }
await mando(16); await clic('#pul-dock-panel [data-m="pos"][data-v="post"]'); console.log('supino +4h', JSON.stringify(await leer()));
await clic('#pul-dock-panel [data-m="pos"][data-v="supino"]'); await clic('#pul-dock-panel [data-m="ci"][data-v="pic"]'); await clic('#pul-dock-panel [data-m="pos"][data-v="prono"]'); console.log('con PIC', JSON.stringify(await leer()));
await p.screenshot({ path: '/tmp/plan-socialista/b3/s2/ci.png' });
console.log('errores', err);
await b.close();
