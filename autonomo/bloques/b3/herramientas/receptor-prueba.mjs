// Juicio rápido v3 · receptor: Mayéutica arriba, NA 0-30, dopamina, dobutamina, milrinona, Begoña adrenalina, lactato, .org, página, capturas.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), ALTO = ANCHO === 390 ? 844 : 780;
const BASE = 'http://127.0.0.1:8795/autonomo/maquetas/b3-receptor.html', CAP = '/tmp/plan-socialista/b3/capturas-v3/receptor/';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); }); page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
const desb = async (t) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${t}`); };
const cap = (n) => page.screenshot({ path: `${CAP}${n}-${ANCHO}.png` });
const tap = async (sel) => { const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.tap(); await page.waitForTimeout(150); };
const R = () => page.evaluate(() => { const r = window.__receptor.R; return { pam: Math.round(r.pam), fc: Math.round(r.fc), ic: +r.ic.toFixed(1), irvs: +r.irvs.toFixed(1), lact: +(r.lact ?? 0).toFixed(1), pas: Math.round(r.pas), pad: Math.round(r.pad), frase: document.querySelector('#frase-txt, .frase-txt')?.textContent?.slice(0, 160) }; });
const dosis = async (k, v) => { await page.evaluate(([k, v]) => { const i = document.querySelector(`input[data-dosis="${k}"]`); if (!i) return 'no slider ' + k; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }, [k, v]); await page.waitForTimeout(3500); };
await page.goto(BASE, { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
await desb('inicio'); await cap('00-primera');
console.log('alto página', await page.evaluate(() => document.documentElement.scrollHeight), 'dock', await page.evaluate(() => document.getElementById('dock').offsetHeight));
// .org en una línea
const orgs = await page.evaluate(() => [...document.querySelectorAll('.org')].filter((e) => e.offsetParent).map((e) => [e.textContent.trim().slice(0, 30), e.getBoundingClientRect().height]));
console.log('org alturas', orgs.slice(0, 6)); ok(!orgs.some((o) => o[1] > 24), 'alguna pastilla .org en dos líneas');
// NA 0-30
await page.evaluate(() => window.__receptor.ponerEstado('na-baja')); await page.waitForTimeout(500);
const sliders = await page.evaluate(() => [...document.querySelectorAll('input[data-dosis]')].map((i) => i.dataset.dosis + ' ' + i.min + '-' + i.max)); console.log('sliders', sliders);
for (const v of [0, 5, 10, 17, 25, 30]) { await dosis('na', v); const r = await R(); console.log(`NA ${v}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs} lact ${r.lact}`); if (v === 25) ok(r.pam >= 65, `NA 25 PAM ${r.pam}`), await cap('01-na25'); if (v === 10) ok(r.ic >= 4.4, `NA 10 IC ${r.ic}`); }
await desb('na');
// dopamina 5-10-20
await page.evaluate(() => window.__receptor.ponerEstado('dopamina')); await page.waitForTimeout(500);
for (const v of [3, 10, 20]) { await dosis('dopa', v); const r = await R(); console.log(`dopa ${v}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs}`); }
await cap('02-dopa20'); await desb('dopa');
// dobutamina y milrinona
await page.evaluate(() => window.__receptor.ponerEstado('dobutamina')); await page.waitForTimeout(500);
const r0 = await R(); for (const v of [5, 20]) { await dosis('dobu', v); const r = await R(); console.log(`dobu ${v}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs} (base PAM ${r0.pam} FC ${r0.fc} IRVS ${r0.irvs})`); if (v === 20) ok(r.irvs < r0.irvs, 'dobutamina 20 no baja la IRVS'); }
await page.evaluate(() => window.__receptor.ponerEstado('milrinona')); await page.waitForTimeout(3500); let r = await R(); console.log(`milrinona: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs}`);
// Begoña
await page.evaluate(() => window.__receptor.ponerEstado('betabloqueo')); await page.waitForTimeout(3500); r = await R(); console.log('Begoña base:', JSON.stringify(r));
const sl2 = await page.evaluate(() => [...document.querySelectorAll('input[data-dosis]')].map((i) => i.dataset.dosis)); console.log('Begoña sliders', sl2);
for (const v of [5, 10]) { await dosis('adre', v); r = await R(); console.log(`Begoña adre ${v}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs} lact ${r.lact}`); }
await cap('03-begona'); await desb('begoña');
const toggles = await page.evaluate(() => [...document.querySelectorAll('#dock-panel button')].map((b) => b.textContent.trim().slice(0, 25))); console.log('botones Begoña', toggles);
// guía y lupa
await page.evaluate(() => window.__receptor.ponerEstado('na-alta')); await page.waitForTimeout(500); await tap('#explicame'); await page.waitForTimeout(500); await cap('04-guia'); await desb('guía');
for (let i = 0; i < 6; i++) { const b = page.locator('#guia-sig'); if (!(await b.count())) break; const t = await b.innerText(); await b.tap(); await page.waitForTimeout(200); if (/hecho/i.test(t)) break; }
await page.locator('#guia-x').tap().catch(() => {});
// Mayéutica
await tap('#modo-preguntas'); await page.waitForTimeout(700); await desb('may'); await cap('05-may-primera');
const pregTop = await page.evaluate(() => document.getElementById('preg').getBoundingClientRect().top); console.log('pregunta top', pregTop); ok(pregTop < 300, `la pregunta empieza a ${pregTop} px`);
const monOculto = await page.evaluate(() => { const m = document.getElementById('monitor'); const f = document.getElementById('fig1'); return [m.hidden || m.offsetParent === null, f.hidden || f.offsetParent === null]; }); console.log('monitor/fig1 ocultos en predice', monOculto);
let pasos = 0; const vistos = []; let destapa = 0, errorTxt = 0;
for (let i = 0; i < 90; i++) {
  pasos++;
  const num = await page.evaluate(() => (document.querySelector('.cab-preg .num') || {}).textContent); if (num && num !== vistos[vistos.length - 1]) vistos.push(num);
  if (await page.locator('[data-mm="destapar"]:visible').count()) destapa++;
  if (await page.locator('[data-fr]:visible').count()) errorTxt++;
  if (i === 1) await cap('06-may-contestada');
  if (i === 9) await cap('07-may-paso10');
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
  if (await page.locator('text=Lo que te llevas').count()) { await cap('08-may-final'); break; }
}
console.log('may pasos', pasos, 'vistos', vistos.join(','), 'destapa', destapa, 'error', errorTxt);
await cap('09-may-ultima');
await browser.close();
console.log('\nERRORES', errores.length, errores.slice(0, 4)); console.log('FALLOS', fallos.length); for (const f of fallos) console.log(' ✗', f);
