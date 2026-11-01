// Cifras de las calculadoras de 6G tecleadas en la app real (mu-npt-calc, mu-real-calc). Uso: node cifras-6g.mjs <url-base>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE + 'index.html'); await p.waitForTimeout(2500);
const txt = id => p.evaluate(i => document.getElementById(i).innerText, id);
const set = (id, v) => p.evaluate(([i, v]) => { const e = document.getElementById(i); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, [id, String(v)]);
for (const [peso, prot, lip, prop, riesgo] of [[70, 1.4, 250, 0, 'no'], [70, 1.4, 250, 10, 'no'], [70, 1.4, 250, 10, 'si'], [70, 1.4, 250, 20, 'no']]) {
  await set('mu-npt-peso', peso); await set('mu-npt-prot', prot); await set('mu-npt-lip', lip); await set('mu-npt-propofol', prop); await set('mu-npt-riesgo', riesgo);
  console.log(JSON.stringify({ peso, prot, lip, prop, riesgo }), '\n' + await txt('mu-npt-resultado') + '\n');
}
await p.evaluate(() => { document.querySelectorAll('.mu-real-check').forEach(c => { if (['IMC ≤18,5', 'ingesta pobre 5 días', 'K, fosfato o Mg bajos'].includes(c.value)) { c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); } }); });
await set('mu-real-peso', 40);
console.log('REAL', await txt('mu-real-resultado'));
await b.close();
