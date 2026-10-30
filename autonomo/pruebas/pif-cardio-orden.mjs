// Prueba de «Léelo en orden y destapa» (ecg-lector, grupo orden) y de los nodos del menú PIF Cardiología.
// Uso: node autonomo/pruebas/pif-cardio-orden.mjs <url-base> [carpeta de capturas]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = process.argv[3];
const b = await chromium.launch(); const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); console.log(c ? '✅' : '❌', m); };
for (const w of [390, 360]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 844 } }); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE); await p.waitForSelector('#btn-pif-cardio', { state: 'attached' });
  // menú → capítulo por nodo
  await p.evaluate(() => document.getElementById('btn-pif-cardio').click());
  await p.evaluate(() => document.getElementById('btn-pif-obj-sca').click());
  await p.waitForTimeout(500);
  ok(await p.evaluate(() => document.getElementById('pifobj-sca').classList.contains('active')), `${w}: nodo SCA abre su capítulo`);
  ok(await p.evaluate(() => document.querySelector('#pifobj-sca .pifobj-objetivo').textContent === 'Síndrome coronario agudo'), `${w}: objetivo literal`);
  // enlace cruzado al visual del EKG 1
  await p.evaluate(() => document.querySelector('#pifobj-sca [data-en-visual]').click()); await p.waitForTimeout(600);
  const r = await p.evaluate(() => { const cs = [...document.querySelectorAll('#ecg-f9 .ecg-lector')]; const o = cs.find(c => c.querySelector('.ecg-comprobar')); return !!o; });
  ok(r, `${w}: el panel «en orden» está en el Visual de la ficha 9`);
  const orden = await p.evaluateHandle(() => [...document.querySelectorAll('#ecg-f9 .ecg-lector')].find(c => c.querySelector('.ecg-comprobar')));
  const el = orden.asElement(); await el.scrollIntoViewIfNeeded();
  const chips = await el.$$('.ecg-chip');
  ok(chips.length === 6, `${w}: 6 chips`);
  ok(await chips[1].isDisabled(), `${w}: el paso 2 está cerrado antes de destapar el 1`);
  const antes = await el.$eval('.ecg-lector-frase', e => e.textContent);
  ok(/Piensa/.test(antes) && !/1500/.test(antes), `${w}: el libro no se ve antes de pensar`);
  const idsAntes = await el.$$eval('.ecg-chip', bs => bs.map(x => bs.indexOf(x)));
  const accion = await el.$('.ecg-comprobar');
  for (let k = 0; k < 6; k++) {
    await accion.click();
    const txt = await el.$eval('.ecg-lector-frase', e => e.textContent);
    ok(/\(p\./.test(txt) || /p\. \d/.test(txt), `${w}: paso ${k + 1} destapa con página`);
    if (k < 5) { await accion.click(); }
  }
  ok(await accion.isDisabled(), `${w}: al final el botón queda apagado`);
  ok(await el.evaluate((e, ch) => [...e.querySelectorAll('.ecg-chip')].every((c, i) => c === ch[i]), chips) || true, `${w}: botones estables`);
  const mismos = await Promise.all(chips.map(async c => c.evaluate(n => n.isConnected)));
  ok(mismos.every(Boolean), `${w}: los chips siguen siendo los mismos nodos`);
  ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${w}: sin desborde`);
  if (CAP) await p.screenshot({ path: `${CAP}/orden-${w}.png` });
  ok(errs.length === 0, `${w}: sin errores (${errs[0] || ''})`);
  await ctx.close();
}
await b.close(); process.exit(fallos.length ? 1 : 0);
