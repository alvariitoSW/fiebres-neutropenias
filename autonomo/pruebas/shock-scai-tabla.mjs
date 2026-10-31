// Mide la letra SCAI del monitor de la app (texto de #shv-scai-r) en varios pacientes/ajustes. Uso: node shock-scai-tabla.mjs <url>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8731/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'cardio' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1800);
const sleep = (m) => p.waitForTimeout(m);
const leer = () => p.evaluate(() => { const c = window.__shvPruebas(); return { sc: document.getElementById('shv-scai-r').textContent + ' | ' + document.getElementById('shv-scai-p').textContent, pam: c.R.pam, lact: +c.est.lab.lact.toFixed(1), h: c.est.horas, ap: c.cab.ajuste.soporte, na: c.cab.ajuste.na }; });
const grav = async (v) => { await p.evaluate(() => { const d = document.getElementById('shv-dock'); if (d.classList.contains('dock-plegado')) d.querySelector('.dock-asa').click(); document.querySelector('#shv-dock-tabs [data-pest="grav"]').click(); }); await sleep(100); await p.evaluate((v) => { const d = document.getElementById('shv-d-grav'); d.value = v; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }, v); await sleep(500); };
const pac = async (k) => { await p.click(`#shv-pacientes [data-pac="${k}"]`); await sleep(400); };
const aj = (o) => p.evaluate((o) => { const c = window.__shvPruebas(); c.cab.ajustar(o); }, o);
const reloj = async (h) => { await p.evaluate(() => document.querySelector('#shv-dock-tabs [data-pest="reloj"]')?.click()); await sleep(100); };
for (const k of (process.argv[3] || 'aurelio,fermin,amparo').split(',')) {
  await pac(k);
  for (const g of [0, 50, 100]) { await grav(g); console.log(k, 'g' + g, 'sin nada', JSON.stringify(await leer())); }
  await grav(100);
  await aj({ na: 5 }); await sleep(600); console.log(k, 'NA 5', JSON.stringify(await leer()));
  await aj({ soporte: k === 'aurelio' ? 'ecmo' : 'no', dobuta: true }); await sleep(600); console.log(k, '+dobu/soporte', JSON.stringify(await leer()));
}
// una sola intervención con el reloj: +5 h y +18 h (dobutamina sola)
for (const k of ['aurelio', 'fermin', 'amparo']) {
  await pac(k); await grav(100); await aj({ na: 0, vaso: false, dobuta: false, soporte: 'no', venteo: 'no' }); await aj({ [k === 'amparo' ? 'na' : 'dobuta']: k === 'amparo' ? 8 : true }); await sleep(400);
  for (const h of [5, 18]) { await p.evaluate(() => document.querySelector('#shv-dock-tabs [data-pest="reloj"]').click()); await sleep(100); await p.evaluate((h) => document.querySelector(`[data-h="${h}"]`)?.click(), h); await sleep(700); console.log(k, 'una intervención +' + h + ' h', JSON.stringify(await leer())); }
}
await b.close();
