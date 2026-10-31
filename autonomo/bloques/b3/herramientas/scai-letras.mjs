// Letras SCAI por paciente/ajuste, medidas en el monitor de la app. Uso: node scai-letras.mjs <url>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const U = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +(process.argv[3]||390), height: 844 }, reducedMotion: process.argv[4] ? 'reduce' : 'no-preference' })).newPage();
await p.goto(U, { waitUntil: 'networkidle' });
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'x' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1500);
const clic = s => p.evaluate(s => document.querySelector(s).click(), s);
const T = [['aurelio', 0, {}], ['aurelio', 100, {}], ['aurelio', 100, { na: 5, dobuta: true, soporte: 'ecmo' }], ['aurelio', 0, { dobuta: true }], ['fermin', 0, {}], ['fermin', 100, {}]];
for (const [k, g, a] of T) {
  await clic(`#shv-pacientes [data-pac="${k}"]`); await p.waitForTimeout(300); await clic('#shv-dock-tabs [data-pest="grav"]');
  await p.evaluate(v => { const d = document.getElementById('shv-d-grav'); d.value = v; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }, g);
  await p.waitForTimeout(500);
  await p.evaluate(o => window.__shvPruebas().cab.ajustar(o), { na: 0, vaso: false, dobuta: false, soporte: 'no', venteo: 'no' });
  await p.evaluate(o => window.__shvPruebas().cab.ajustar(o), a);
  for (const t of [500, 1500, 3000, 6000]) { await p.waitForTimeout(t === 500 ? 500 : 1500); console.log(k, g, JSON.stringify(a), t, await p.evaluate(() => document.getElementById('shv-scai-r').textContent + ' | lact ' + window.__shvPruebas().est.lab.lact.toFixed(1) + ' | ' + document.getElementById('shv-scai-p').textContent.slice(0, 60))); }
}
await b.close();
