// Abre Estudiar en las fichas del 4C a 390 y 360 px, recorre el caso de Nicolás y mide el desborde. Uso: node estudiar-b4c.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [base, dir] = [process.argv[2], process.argv[3]];
const b = await chromium.launch(); let fallos = 0;
for (const w of [390, 360]) for (const ficha of ['mr-osmolalidad', 'mr-hipernatremia']) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 }, reducedMotion: 'reduce' }); const pg = await ctx.newPage();
  const err = []; pg.on('pageerror', e => err.push(e.message)); pg.on('console', m => m.type() === 'error' && err.push(m.text()));
  await pg.goto(base + 'index.html'); await pg.waitForTimeout(2500);
  await pg.evaluate(f => { const bt = document.createElement('button'); bt.dataset.especialidad = 'libros'; bt.dataset.view = 'marinoRenal'; bt.dataset.panel = 'panel-marino-renal-tabs'; bt.dataset.tab = f; bt.id = 'tmp-ir'; document.body.append(bt); bt.click(); }, ficha);
  await pg.waitForTimeout(1200);
  const info = await pg.evaluate(f => { const t = document.getElementById(f); const bs = [...t.querySelectorAll('button')].filter(x => /Estudiar/i.test(x.textContent)); return { visible: t.offsetParent !== null, estudiar: bs.length }; }, ficha);
  const bt = pg.locator(`#${ficha} button`, { hasText: /Estudiar/ }).first();
  if (info.estudiar) { await bt.click(); await pg.waitForTimeout(800); }
  const ov = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await pg.screenshot({ path: `${dir}/${ficha}-${w}.png` });
  console.log(w, ficha, JSON.stringify(info), 'desborde', ov, 'errores', err.length ? err.slice(0, 3) : 0);
  if (!info.estudiar || ov > 0 || err.length) fallos++;
  await ctx.close();
}
await b.close(); process.exit(fallos ? 1 : 0);
