// Busca NaN/undefined/Infinity en el texto de un estado del shock vivo. Uso: node g3-estados-nan.mjs <url-base> <estado>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, k] = process.argv.slice(2);
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
await p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
await p.waitForTimeout(2000);
console.log(await p.evaluate(() => { const x = document.getElementById('shv-raiz').innerText; return [...x.matchAll(/.{0,60}(NaN|undefined|Infinity).{0,40}/g)].map(m => m[0].replace(/\s+/g, ' ')); }));
await b.close();
