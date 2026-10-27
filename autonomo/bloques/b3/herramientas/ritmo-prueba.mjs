// Juicio rápido v3 · ritmo: QRS por estado, ventana tras evento, tira (ondas F/f, K), FA+dilt, lupa junto al monitor, dock, Mayéutica, capturas.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), ALTO = ANCHO === 390 ? 844 : 780;
const BASE = `http://127.0.0.1:${process.env.PUERTO || 8795}/autonomo/maquetas/b3-ritmo.html`, CAP = '/tmp/plan-socialista/b3/capturas-v3/ritmo/';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); }); page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
const desb = async (t) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${t}`); };
const cap = (n) => page.screenshot({ path: `${CAP}${n}-${ANCHO}.png` });
const tap = async (sel) => { const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.tap(); await page.waitForTimeout(150); };
await page.goto(BASE, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
await desb('inicio'); await cap('00-primera');
console.log('alto página', await page.evaluate(() => document.documentElement.scrollHeight), 'dock', await page.evaluate(() => document.getElementById('dock').offsetHeight));
// medidas por estado (ventana de 8 s simulados)
const medir = async (clave, extra, acc, n = 8) => page.evaluate(([clave, extra, acc, n]) => {
  const R = window.__ritmo; R.ponerEstado(clave, extra || {}); for (const a of acc || []) R.accion(a);
  const out = []; for (let i = 0; i < n; i++) { R.avanzarHasta(R.simT + 1); const L = R.leer(); out.push(L ? { fc: L.fc, qrs: L.qrs && +L.qrs.toFixed(3), qtc: L.qtc && +L.qtc.toFixed(2), pul: L.pul, pa: L.pas + '/' + L.pad, def: L.deficit } : null); }
  return out; }, [clave, extra, acc, n]);
const fmt = (o) => o.map((x) => x ? `${x.fc}|${x.qrs}|${x.pul}|${x.pa}` : '—').join('  ');
for (const [k, ex] of [['sinusal'], ['rama'], ['tv'], ['aberrancia'], ['wpw'], ['wpw', { wpwFa: true }], ['fa'], ['flutter'], ['hiperk', { k: 8.2 }], ['torsade'], ['tam']]) {
  const o = await medir(k, ex); console.log(k, JSON.stringify(ex || {}), fmt(o));
  const qrs = o.filter((x) => x && x.qrs).map((x) => x.qrs);
  if (k === 'tv') ok(Math.max(...qrs) - Math.min(...qrs) < 0.02, `TV: QRS oscila ${Math.min(...qrs)}-${Math.max(...qrs)}`), ok(Math.max(...qrs) <= 0.18, `TV QRS ${Math.max(...qrs)}`);
  if (k === 'wpw' && ex) ok(Math.max(...qrs) <= 0.2, `WPW+FA QRS ${Math.max(...qrs)}`);
  if (k === 'rama') ok(Math.max(...qrs) <= 0.18, `rama QRS ${Math.max(...qrs)}`);
}
// eventos: ventana
let o = await medir('nodal', {}, ['ade6'], 14); console.log('nodal + ade6', fmt(o)); ok(!o.some((x) => x && x.fc && x.fc < 45 && x.fc > 0), 'nodal+ade6: FC <45 en la ventana');
o = await medir('wpw', { wpwFa: true }, ['cv-wpw'], 10); console.log('wpw-fa + cv', fmt(o)); ok(!o.some((x) => x && x.pul && x.fc && Math.abs(x.fc - x.pul) > 20), 'wpw-fa+cv: déficit de pulso espurio');
o = await medir('fv', {}, ['comp', 'choque'], 12); console.log('fv + choque', fmt(o));
o = await medir('fa', {}, ['w-dilt'], 12); console.log('fa + dilt', fmt(o));
// FA + diltiazem por horas (tocar el dock real)
await page.evaluate(() => window.__ritmo.ponerEstado('fa', {})); await page.waitForTimeout(400); await desb('fa'); await cap('01-fa');
const mini = await page.evaluate(() => !document.getElementById('mini-lupa').hidden); console.log('FA: mini-lupa visible', mini);
for (const k of ['flutter', 'hiperk']) { await page.evaluate((k) => window.__ritmo.ponerEstado(k, k === 'hiperk' ? { k: 8.2 } : {}), k); await page.waitForTimeout(2500); await cap('02-' + k); await desb(k); }
// guía en nodal
await page.evaluate(() => window.__ritmo.ponerEstado('nodal', {})); await page.waitForTimeout(300); await tap('#explicame'); await page.waitForTimeout(500); await cap('03-guia-nodal'); await desb('guía');
for (let i = 0; i < 6; i++) { const b = page.locator('#guia-sig'); if (!(await b.count())) break; const t = await b.innerText(); await b.tap(); await page.waitForTimeout(200); if (/hecho/i.test(t)) break; }
await page.locator('#guia-x').tap().catch(() => {});
// Mayéutica entera
await tap('#modo-preguntas'); await page.waitForTimeout(600); await desb('may'); await cap('04-may-primera');
const vistos = []; let pasos = 0, destapa = 0, errorTxt = 0;
for (let i = 0; i < 90; i++) {
  pasos++;
  const num = await page.evaluate(() => (document.querySelector('.cab-preg .num') || {}).textContent); if (num && num !== vistos[vistos.length - 1]) vistos.push(num);
  const html = await page.evaluate(() => document.getElementById('zona-preg')?.innerHTML || document.body.innerHTML.length);
  if (await page.locator('[data-mm="destapar"]:visible').count()) destapa++;
  if (await page.locator('[data-fr]:visible').count()) errorTxt++;
  if (i === 2) await cap('05-may-paso3');
  if (i === 6) await cap('06-may-paso7');
  const clicked = await page.evaluate((i) => {
    const q = (s) => [...document.querySelectorAll(s)].find((e) => e.offsetParent !== null && !e.disabled);
    let e = q('[data-mm="ops"]') || q('[data-mm="destapar"]'); if (e) { e.click(); return 'a'; }
    const ops = [...document.querySelectorAll('[data-op]')].filter((e) => e.offsetParent !== null && !e.disabled); if (ops.length) { ops[i % 3 === 1 ? ops.length - 1 : 0].click(); return 'op'; }
    const fr = [...document.querySelectorAll('[data-fr]')].filter((e) => e.offsetParent !== null); if (fr.length) { fr[0].click(); e = q('[data-mm="corregir"]'); e && e.click(); return 'fr'; }
    for (const t of document.querySelectorAll('[data-tenia]')) if (t.offsetParent !== null) t.click();
    e = q('[data-mm="tocar"]') || q('[data-mm="destapado"]') || q('[data-mm="sig"]') || q('[data-mm="otra"]') || q('[data-mm="comprueba"]'); if (e) { e.click(); return 'n'; } return null;
  }, i);
  await page.waitForTimeout(200); await desb('may paso ' + i);
  const txt = await page.evaluate(() => document.body.innerText); ok(!/undefined|NaN/.test(txt), `may paso ${i}: undefined/NaN`);
  if (!clicked) break;
  if (await page.locator('text=Lo que te llevas').count()) { await cap('07-may-final'); break; }
}
console.log('may pasos', pasos, 'vistos', vistos.join(','), 'destapa', destapa, 'error', errorTxt);
await cap('08-may-ultima');
await browser.close();
console.log('\nERRORES', errores.length, errores.slice(0, 4)); console.log('FALLOS', fallos.length); for (const f of fallos) console.log(' ✗', f);
