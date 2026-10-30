// Recorre el caso de Fermín hasta el paso indicado y escribe el rótulo SCAI y el monitor de cada paso. Uso: node shock-scai-caso-fermin.mjs <url>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8731/').replace(/\/?$/, '/');
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' });
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'hemo' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1800);
const Z = '#shv-zona-may', sl = (m) => p.waitForTimeout(m), clic = (s) => p.evaluate((s) => document.querySelector(s).click(), s);
await clic('#shv-modo-may'); await sl(600); await clic(`${Z} [data-ir="casos"]`); await sl(400); await clic(`${Z} [data-caso="1"]`); await sl(900);
for (let k = 0; k < 5; k++) {
  const r = await p.evaluate(() => { const w = window.__shvPruebas(), R = w.R; return { sc: document.getElementById('shv-scai-r').textContent, pam: R.pam, ic: R.ic, pvc: R.pvc, pcp: R.pcp, lact: +w.est.lab.lact.toFixed(1), h: w.est.horas, ap: w.cab.ajuste.dobuta }; });
  console.log('paso', k + 1, JSON.stringify(r));
  await clic(`${Z} [data-accion="ops"]`); await sl(200); await clic(`${Z} [data-op="0"]`); await sl(300); await clic(`${Z} [data-accion="sig"]`); await sl(500);
}
await b.close();
