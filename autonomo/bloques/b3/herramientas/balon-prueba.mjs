// Prueba de la consola del balón (b3-shock): 1:1, 1:2, 1:3, aumento > sistólica propia, Espera/Inicio, desborde, NaN, capturas.
// node balon-prueba.mjs [ancho]   (servidor en PUERTO, por defecto 8793)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), ALTO = ANCHO === 390 ? 844 : 780;
const BASE = `http://127.0.0.1:${process.env.PUERTO || 8793}/autonomo/maquetas/`;
const CAP = '/tmp/plan-socialista/b3/capturas-balon/';
const fallos = [], errores = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
const tap = async (sel) => { await page.evaluate((s) => document.querySelector(s)?.click(), sel); await page.waitForTimeout(150); };
const desborde = async (t) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} en ${t}`); };
const L = () => page.evaluate(() => { const l = window.__cabecera.cab.lectura; return { razon: l.razon, pico: l.picoDia, tele: l.teleDia, picoNo: l.picoNo, teleNo: l.teleNo, sis: l.sisPropia, pas: l.u.pas, pad: l.u.pad_, aj: window.__cabecera.cab.ajuste.balon }; });
const cap = async (n) => { await page.evaluate(() => document.getElementById('iabp').scrollIntoView({ block: 'start' })); await page.waitForTimeout(300); await page.screenshot({ path: `${CAP}${n}-${ANCHO}.png` }); };
await page.goto(BASE + 'b3-shock.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
for (const [pac, g] of [['aurelio', null], ['aurelio', 100], ['aurelio', 30]]) {
  await tap(`[data-pac="${pac}"]`); if (g != null) { await tap('[data-pest="grav"]'); await page.evaluate((v) => { const d = document.getElementById('d-grav'); d.value = v; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }, g); await page.waitForTimeout(300); } await tap('[data-pest="sop"]'); await tap('[data-sop="balon"]'); await page.waitForTimeout(2500);
  ok(await page.evaluate(() => !document.getElementById('iabp').hidden), `${pac}: la consola no aparece`);
  const a = await L(); console.log(pac, '1:1', JSON.stringify(a));
  ok(a.pico > a.sis, `${pac} 1:1: aumento ${a.pico} no supera la sistólica propia ${a.sis}`);
  ok(a.picoNo == null, `${pac} 1:1: hay latido no asistido`);
  if (g == null) await cap('consola-1a1');
  await tap('[data-razon="2"]'); await page.waitForTimeout(2500); const b = await L(); console.log(pac, '1:2', JSON.stringify(b));
  ok(b.razon === 2 && b.picoNo != null && b.teleNo != null, `${pac} 1:2: sin lectura no asistida`);
  ok(b.pico > b.picoNo + 5, `${pac} 1:2: el pico asistido (${b.pico}) no supera al no asistido (${b.picoNo})`);
  ok(b.tele < b.teleNo, `${pac} 1:2: la telediastólica asistida (${b.tele}) no es menor que la no asistida (${b.teleNo})`);
  if (g == null) await cap('consola-1a2');
  await tap('[data-razon="3"]'); await page.waitForTimeout(2500); const c = await L(); console.log(pac, '1:3', JSON.stringify(c)); ok(c.razon === 3 && c.picoNo != null, `${pac} 1:3 sin no asistido`);
  await tap('[data-razon="1"]'); await page.waitForTimeout(1500);
  await tap('#iabp-espera'); await page.waitForTimeout(2500); const e = await L(); ok(e.aj === 0, `${pac}: Espera no apaga el balón`);
  ok(await page.evaluate(() => /—/.test(document.querySelector('#iabp .c-aum .v').textContent)), `${pac}: en Espera el aumento debe ser —`);
  await tap('#iabp-inicio'); await page.waitForTimeout(2500); const f = await L(); ok(f.aj > 0 && f.pico > f.sis, `${pac}: Inicio no recupera el aumento`);
  const txt = await page.evaluate(() => document.getElementById('iabp').innerText); ok(!/NaN|undefined|null/.test(txt), `${pac}: NaN/undefined en la consola`);
  await desborde(pac);
}
await tap('[data-pac="amparo"]'); await tap('[data-pest="sop"]'); await tap('[data-sop="balon"]'); await page.waitForTimeout(600);
ok(await page.evaluate(() => document.getElementById('iabp').hidden), 'Amparo (no indicado): la consola no debe verse');
await tap('[data-pac="joaquin"]'); await tap('[data-pest="sop"]'); await tap('[data-sop="balon"]'); await page.waitForTimeout(600);
ok(await page.evaluate(() => document.getElementById('iabp').hidden), 'Joaquín (disección): la consola no debe verse');
// fuentes de los textos de la consola
await tap('[data-pac="aurelio"]'); await tap('[data-pest="sop"]'); await tap('[data-sop="balon"]'); await tap('[data-razon="2"]'); await page.waitForTimeout(1500);
const min = await page.evaluate(() => { let m = 99; for (const t of document.querySelectorAll('#iabp svg text')) { const r = t.getBoundingClientRect(); if (!r.width) continue; m = Math.min(m, parseFloat(getComputedStyle(t).fontSize) * (r.width / (t.getComputedTextLength() || r.width))); } return m; });
console.log('texto mínimo en el svg de la consola', Math.round(min * 10) / 10); ok(min >= 7.5, 'rótulo de la consola < 7,5 px');
if (ANCHO === 360) await cap('consola-360');
await desborde('final');
ok(errores.length === 0, 'errores de consola: ' + errores.slice(0, 3).join(' | '));
console.log(fallos.length ? 'FALLOS:\n' + fallos.join('\n') : 'consola del balón: OK');
await browser.close(); process.exit(fallos.length ? 1 : 0);
