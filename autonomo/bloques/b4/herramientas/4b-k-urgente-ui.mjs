// Prueba del botón «K⁺ urgente» de mr-trr: abre el filtro con K⁺ 7 y el aviso del calcio. Uso: node 4b-k-urgente-ui.mjs <puerto>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(`http://127.0.0.1:${process.argv[2] || 8147}/`); await p.waitForTimeout(1500);
await p.evaluate(() => document.querySelector('#btn-marino-renal, [data-especialidad="libros"]')?.click());
await p.evaluate(() => document.querySelector('button[data-filtro-vivo]').click()); await p.waitForTimeout(1500);
const r = await p.evaluate(() => { const h = document.querySelector('[data-fv-rango="horas"]'); h.value = 3; h.dispatchEvent(new Event('input')); const c = h.closest('.nv-cuerpo,div[class]').parentElement; return [...document.querySelectorAll('.gl-avisos')].map(a => a.textContent.slice(0, 160)).filter(Boolean).concat([document.querySelector('[data-fv-out="horas"]').textContent, document.documentElement.scrollWidth]); });
console.log(r); await p.screenshot({ path: '/tmp/plan-socialista/b4-4b/k-urgente-390.png' }); await b.close();
