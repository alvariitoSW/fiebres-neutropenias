// Lee del eje vivo (la app, a 390 px) las cifras de cada paciente:paso del grupo 6H. Uso: node cifras-6h.mjs <url-base>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8766/').replace(/\/?$/, '/');
const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 800 } }); const p = await ctx.newPage();
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: 'toribio' }); x.className = 'especialidad-link'; document.body.appendChild(x); x.click(); });
await p.waitForTimeout(900);
const PLAN = JSON.parse(process.argv[3] || '[]');
for (const [pac, paso, hacer] of PLAN) {
  const r = await p.evaluate(([pac, paso, hacer]) => { window.__eje.ir({ pac, paso }); for (const h of hacer || []) window.__eje.ir({ hacer: h });
    return { leer: JSON.stringify(window.__eje.leer()), topes: JSON.stringify(window.__eje.topes()).slice(0, 300), frase: document.getElementById('eje-frase')?.textContent.slice(0, 300) }; }, [pac, paso, hacer]);
  console.log('==', pac, paso, JSON.stringify(hacer || []), '\n', r.leer, '\n', r.topes, '\n', r.frase);
}
await b.close();
