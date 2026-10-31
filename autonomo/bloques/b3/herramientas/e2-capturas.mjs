// Capturas de la prueba móvil R1 de E2 (racimo con histéresis): node e2-capturas.mjs <url-base> <carpeta>
// 1) el racimo con el sello (PEEP 0), dock plegado, la lupa abierta; 2) «Piensa antes» de la guía a 390 px.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), OUT = (process.argv[3] || '/tmp').replace(/\/?$/, '/');
const b = await chromium.launch();
for (const ANCHO of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2 }), p = await ctx.newPage();
  await p.goto(BASE); await p.waitForTimeout(1500);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'atelectrauma-zeep' }); document.body.append(t); t.click(); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { document.getElementById('pul-lupa').open = true; document.getElementById('pul-esc-svg').scrollIntoView({ block: 'center' }); });
  await p.waitForTimeout(1200); await p.screenshot({ path: `${OUT}e2-racimo-${ANCHO}.png` });
  await p.evaluate(() => document.getElementById('pul-btn-guia').click()); await p.waitForTimeout(500);
  await p.evaluate(() => document.getElementById('pul-pq-ver').click()); await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}e2-piensa-${ANCHO}.png` });
  await ctx.close();
}
await b.close();
