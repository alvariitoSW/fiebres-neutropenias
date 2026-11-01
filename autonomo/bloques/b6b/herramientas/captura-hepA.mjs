// Capturas a 390 px del hepatocito con una vía de tóxicos. Uso: node captura-hepA.mjs <url-base> <carpeta>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, dir] = process.argv.slice(2);
const b = await chromium.launch(); const ctx = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
await p.goto(base); await p.waitForTimeout(1500);
for (const est of ['sobredosis', 'hemodialisis', 'metanol']) {
  await p.evaluate((est) => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'hepatocitoVivo', hepatocitoVivo: est }); document.body.append(x); x.click(); x.remove(); }, est);
  await p.waitForTimeout(1200);
  const t = await p.evaluate(() => document.getElementById('hpv-raiz').innerText);
  console.log(est, t.match(/NH₃ arterial|West Haven \d|Carril|carril de la urea|cap\. 39|Lactulosa/g));
  await p.screenshot({ path: `${dir}/${est}.png` });
}
await b.close();
