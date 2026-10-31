// Monta los ejercicios del cuaderno Neuro: abre cada ficha, comprueba ids y errores, destapa zonas y saca capturas. Uso: node radio-neuro-lee.mjs <url-base> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8742/').replace(/\/?$/, '/'); const OUT = process.argv[3] || '/tmp';
const b = await chromium.launch(); const fallos = [];
for (const w of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true })).newPage();
  const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)));
  await p.goto(BASE); await p.waitForSelector('#radio-caja-neuro-marshall', { state: 'attached' });
  const r = await p.evaluate(() => {
    const ids = [...document.querySelectorAll('[id^="rl-neuro-"][id$="-img"]')].map(i => i.id);
    const dup = [...document.querySelectorAll('[id]')].map(e => e.id).filter((x, i, a) => a.indexOf(x) !== i);
    const rotos = [...document.querySelectorAll('[id^="radio-caja-neuro-"] img')].filter(i => i.complete && i.naturalWidth === 0).length;
    return { n: ids.length, dup: [...new Set(dup)], rotos };
  });
  if (r.n !== 12) fallos.push(`${w} imágenes montadas ${r.n}/12`);
  if (r.dup.length) fallos.push(`${w} ids duplicados ${r.dup}`);
  if (r.rotos) fallos.push(`${w} imágenes rotas ${r.rotos}`);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (ov) fallos.push(`${w} desborde`);
  if (errs.length) fallos.push(`${w} consola: ${errs.join(' | ')}`);
  if (w === 390) for (const id of ['neuro-hemorragia-tpa', 'neuro-tc-ventriculos', 'neuro-marshall', 'neuro-hsa-media']) {
    const c = p.locator('#radio-caja-' + id); await c.evaluate(e => { for (let n = e; n; n = n.parentElement) { if (n.hidden) n.hidden = false; } });
    await p.evaluate(i => { const t = document.getElementById('radio-caja-' + i).closest('.tab-content'); document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active')); t.classList.add('active'); let v = t; while (v) { v.style.display = v.style.display; v = v.parentElement; } }, id).catch(() => {});
    await c.scrollIntoViewIfNeeded().catch(() => {});
    await c.screenshot({ path: `${OUT}/${id}.png` }).catch(e => fallos.push('captura ' + id + ' ' + e.message.slice(0, 80)));
  }
}
await b.close(); console.log(fallos.length ? 'FALLOS\n' + fallos.join('\n') : 'OK'); process.exit(fallos.length ? 1 : 0);
