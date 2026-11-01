// Captura la escena (lupa de la tráquea) del estado `subglotica` en 3 situaciones. Uso: node m1-captura.mjs <url> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [url, dir] = [process.argv[2], process.argv[3].replace(/\/?$/, '/')];
const b = await chromium.launch();
for (const w of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })).newPage();
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'subglotica' }); document.body.append(t); t.click(); });
  await p.waitForFunction(() => document.getElementById('pul-esc-svg')?.getBoundingClientRect().height > 50, null, { timeout: 15000 });
  await p.waitForTimeout(1500);
  const sh = async (n) => { await p.evaluate(() => { const e = document.getElementById('pul-esc-svg'); e.closest('details').open = true; e.scrollIntoView({ block: 'start' }); }); await p.waitForTimeout(250); await p.screenshot({ path: `${dir}m1-escena-${n}-${w}.png` }); };
  const pide = (v) => p.evaluate((v) => { const d = document.querySelector('#pul-dock-panel input[data-m="cuff"]'); d.max = 200; d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await sh('sin-aspiracion');
  await p.evaluate(() => document.querySelector('#pul-dock-panel [data-m="asp"]').click()); await p.waitForTimeout(300); await sh('aspirando');
  await pide(8); await p.waitForTimeout(300); await sh('balon-bajo');
  await pide(60); await p.waitForTimeout(300); await sh('tope');
}
await b.close();
