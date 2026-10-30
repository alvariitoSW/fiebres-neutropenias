// Mide cuánto tarda el hilo en atender el toque de cada paciente (uso: node shock-tiempo-pac.mjs PUERTO estado)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, puerto = '8000', estado = 'tapon'] = process.argv;
const nav = await chromium.launch(); const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
const pag = await ctx.newPage(); await pag.goto(`http://localhost:${puerto}/`); await pag.waitForTimeout(1500);
await pag.evaluate(e => { const b = document.createElement('button'); b.dataset.especialidad = 'libros'; b.dataset.view = 'shockVivo'; b.dataset.shockVivo = e; document.body.appendChild(b); b.click(); b.remove(); }, estado);
await pag.waitForTimeout(1300);
const n = await pag.locator('#shv-raiz [data-pac]').count();
for (let i = 0; i < n; i++) {
  const t0 = Date.now(); let r = 'ok';
  try { await pag.locator('#shv-raiz [data-pac]').nth(i).tap({ timeout: 8000 }); } catch (e) { r = 'FALLA ' + String(e.message).split('\n').slice(-3).join('|'); }
  const dt = Date.now() - t0;
  const h = await pag.evaluate(() => { const t = performance.now(); return new Promise(f => requestAnimationFrame(() => f(Math.round(performance.now() - t)))); });
  console.log(estado, i, dt + ' ms', r, 'raf', h);
}
await nav.close();
