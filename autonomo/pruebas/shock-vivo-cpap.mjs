// Prueba corta del mando CPAP: solo con Ramiro; en los demás pacientes no existe. Uso: node shock-vivo-cpap.mjs http://localhost:PUERTO/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
let mal = 0;
for (const [k, esperado] of [['ic-cpap', true], ['ic-etapa-2', true], ['hemo', false], ['septico', false], ['cardio', false], ['tapon', false], ['tep', false], ['posparo', false], ['rotura-papilar', false]]) {
  await p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
  await p.waitForTimeout(1200);
  await p.click('#shv-dock-tabs [data-pest="sop"]'); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ n: document.querySelectorAll('#shv-dock-panel [data-cpap]').length, t: document.querySelector('#shv-dock-panel')?.textContent.includes('pruébalo con Aurelio') }));
  const bien = (r.n > 0) === esperado; if (!bien) mal++;
  console.log(bien ? 'ok ' : 'MAL', k, 'botones CPAP:', r.n, 'nota Aurelio:', r.t);
}
console.log('errores de consola:', err.length, err.slice(0, 2)); await b.close(); process.exit(mal || err.length ? 1 : 0);
