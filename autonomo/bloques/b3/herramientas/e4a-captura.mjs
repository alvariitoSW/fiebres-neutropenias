// Capturas R1 del monitor del pulmón vivo en los estados de E4a: node e4a-captura.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const b = await chromium.launch();
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2 }), p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  for (const k of ['doble-disparo', 'asincronia-ineficaz', 'sbt-fracaso']) {
    await p.evaluate((k) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
    await p.waitForTimeout(1200); await p.evaluate(() => window.__pulPruebas().llenar());
    await p.evaluate(() => document.querySelector('#pul-monitor').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}mon-${k}-${w}.png` });
  }
  await ctx.close();
}
await b.close();
