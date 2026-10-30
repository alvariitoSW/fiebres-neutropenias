// Capturas del mando CPAP (b3-paso4 g4): ic-cpap abierto y con CPAP 15 (sello), a 390 y 360 px. Uso: node g4-cpap-captura.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, dir] = [process.argv[2], process.argv[3]];
const b = await chromium.launch();
for (const w of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && err.push(m.text()));
  await p.goto(base + '/index.html'); await p.waitForTimeout(2500);
  const abrir = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
  await abrir('ic-cpap'); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${dir}/cpap-10-${w}.png` });
  await p.evaluate(() => document.querySelector('#shv-dock-panel [data-cpap="15"]').click()); await p.waitForTimeout(2500);
  await p.screenshot({ path: `${dir}/cpap-15-${w}.png` });
  console.log(w, 'desborde', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errores', err.length, err.slice(0, 2));
}
await b.close();
