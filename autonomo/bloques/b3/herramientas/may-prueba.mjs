// Mayéutica entera (pulmón o ritmo) con el bucle completo: ops, destapar+tenia, error+corregir+buena, tocar, comprueba, sig. node may-prueba.mjs b3-pulmon
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const M = process.argv[2] || 'b3-pulmon', W = +(process.argv[3] || 390), H = W === 390 ? 844 : 780;
const BASE = `http://127.0.0.1:${process.env.PUERTO || 8795}/autonomo/maquetas/`, CAP = `/tmp/plan-socialista/b3/capturas-v3/${M.slice(3)}/`;
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: W, height: H }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage(); page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); }); page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
const desb = async (t) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${t}`); };
await page.goto(BASE + M + '.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
await page.locator('#modo-may, #modo-preguntas').first().tap(); await page.waitForTimeout(700);
const vistos = []; const log = []; let destapa = 0, errs = 0, tocar = 0;
for (let i = 0; i < 120; i++) {
  const num = await page.evaluate(() => (document.querySelector('.cab-preg .num, .mm-num, .num') || {}).textContent); if (num && num !== vistos[vistos.length - 1]) { vistos.push(num); const enun = await page.evaluate(() => { const z = document.querySelector('#zona-may, #preg, #zona-preg'); const p = z?.querySelector('.enun, .pregunta, p'); return (p?.textContent || z?.innerText || '').replace(/\s+/g, ' ').slice(0, 130); }); log.push(`${num} · ${enun}`); }
  const r = await page.evaluate((i) => {
    const vis = (s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent !== null && !e.disabled);
    const q = (s) => vis(s)[0];
    const llevas = [...document.querySelectorAll('h2, h3, .mm-llevas, .llevas')].some((e) => e.offsetParent && /Lo que te llevas/.test(e.textContent)); if (llevas) return 'FIN';
    let e = q('[data-mm="ops"]'); if (e) { e.click(); return 'ops'; }
    const ops = vis('[data-op]'); if (ops.length) { ops[i % 4 === 1 ? ops.length - 1 : 0].click(); return 'op'; }
    e = q('[data-mm="destapar"]'); if (e) { e.click(); return 'destapar'; }
    const ten = vis('[data-tenia]'); if (ten.length && q('[data-mm="destapado"]')) { ten.forEach((t, k) => { if (k !== 1) t.click(); }); q('[data-mm="destapado"]').click(); return 'tenia'; }
    const fr = vis('[data-fr]'); if (fr.length && q('[data-mm="corregir"]')) { fr[0].click(); if (fr[2]) fr[2].click(); q('[data-mm="corregir"]').click(); return 'fr'; }
    const bu = vis('[data-buena]'); if (bu.length) { bu.forEach((b) => b.click()); return 'buena'; }
    e = q('[data-mm="tocar"]'); if (e) { e.click(); return 'tocar'; }
    e = q('[data-mm="comprueba"]') || q('[data-acc="comprueba"]'); if (e) { e.click(); return 'comprueba'; }
    e = q('[data-mm="sig"]') || q('[data-mm="otra"]'); if (e) { e.click(); return 'sig'; }
    return null;
  }, i);
  if (r === 'destapar') destapa++; if (r === 'fr') errs++; if (r === 'tocar') { tocar++; await page.waitForTimeout(4000); }
  await page.waitForTimeout(300); await desb(`${M} may ${i}`);
  const txt = await page.evaluate(() => document.body.innerText); ok(!/undefined|NaN/.test(txt), `${M} may ${i}: undefined/NaN`);
  if (['op', 'fr', 'buena', 'tenia', 'comprueba'].includes(r) && i < 60 && i % 2 === 0) await page.screenshot({ path: `${CAP}may-${String(i).padStart(2, '0')}-${r}-${W}.png` });
  if (r === 'FIN') { await page.screenshot({ path: `${CAP}may-final-${W}.png` }); break; }
  if (!r) { await page.screenshot({ path: `${CAP}may-atasco-${i}-${W}.png` }); console.log('ATASCO en', i, 'tras', vistos.slice(-1)); break; }
}
console.log(`${M}: ${vistos.length} pantallas · destapa ${destapa} · encuentra-error ${errs} · tocar ${tocar}`); console.log(log.join('\n'));
const vuelta = await page.$('[data-mm="modelo"]'); if (vuelta) { await vuelta.click(); await page.waitForTimeout(1200); console.log('vuelta al modelo:', await page.evaluate(() => document.querySelector('#frase-txt, .frase-txt')?.textContent.replace(/\s+/g, ' ').slice(0, 160))); await page.screenshot({ path: `${CAP}may-vuelta-${W}.png` }); }
await browser.close();
console.log('\nERRORES', errores.length, errores.slice(0, 4)); console.log('FALLOS', fallos.length); for (const f of fallos) console.log(' ✗', f);
