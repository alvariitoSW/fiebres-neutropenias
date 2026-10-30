// Prueba de la maqueta A (a-poe-shock.html): recorre las 6 pantallas a 390 y 360 px.
// Uso: PUERTO=8123 node autonomo/maquetas/educacion/herramientas/prueba-a.mjs  (servidor: python3 -m http.server 8123 en la raíz del repo)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const URL = `http://localhost:${process.env.PUERTO || 8000}/autonomo/maquetas/educacion/a-poe-shock.html`;
const b = await chromium.launch(); let fallos = 0;
const ok = (c, m) => { if (!c) { fallos++; console.log('  FALLO:', m); } };
for (const w of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce' })).newPage();
  const errs = []; p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push(String(e)));
  await p.goto(URL); await p.waitForSelector('#pant .q');
  const desborde = async (t) => { const d = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); ok(d[0] <= d[1], `${w}px ${t}: scrollWidth ${d[0]} > ${d[1]}`); };
  const txt = () => p.evaluate(() => document.body.innerText);
  const clic = async (re) => { const l = p.locator('button:visible', { hasText: re }).first(); await l.click(); await p.waitForTimeout(60); };
  const apuesta = async (n) => { await clic(/Ya lo tengo/); await p.locator('#pant .q').last().locator('.op').nth(n).click(); await p.waitForTimeout(60); };
  const vals = () => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('#rej b')].map(e => [e.id, e.textContent])));
  const esp = async (id, v, t) => { const g = await vals(); for (const k in v) ok(g['v-' + k] === v[k], `${w}px ${t}: ${k} ${g['v-' + k]} != ${v[k]}`); };
  // P1: velo y cifras de Amparo 0 % visibles (sin velo)
  await esp(0, { pam: '87', pa: '106/67', fc: '71', pvc: '4', ic: '2,8', irvs: '30', scvo2: '90', lact: '1,0', diur: '1,0' }, 'p1');
  const y = await p.evaluate(() => { const r = document.querySelector('#pant .q .btn').getBoundingClientRect(); return [r.bottom, innerHeight]; });
  ok(y[0] <= y[1], `${w}px p1: la pregunta A1 no se ve sin scroll (botón en y=${Math.round(y[0])} de ${y[1]})`);
  await desborde('p1');
  { // camino de fallo: monitor y consecuencia antes del porqué
    const p2 = await (await b.newContext({ viewport: { width: w, height: 800 }, reducedMotion: 'reduce' })).newPage();
    await p2.goto(URL); await p2.waitForSelector('#pant .q'); await p2.locator('button:visible', { hasText: /Ya lo tengo/ }).click(); await p2.locator('#pant .q .op').nth(0).click();
    await p2.locator('button:visible', { hasText: /Subir la sepsis/ }).click(); await p2.waitForTimeout(200);
    const r = await p2.evaluate(() => ({ pam: document.querySelector('#v-pam').textContent, plan: /Con tu plan \(a\)/.test(document.body.innerText), oculto: document.querySelector('.porque-box').hidden, orden: !!(document.querySelector('.ver.mal')?.compareDocumentPosition(document.querySelector('.porque-btn')) & 4), apuesta: /Tu apuesta/.test(document.body.innerText) && /Lo que pasó/.test(document.body.innerText) }));
    ok(r.pam === '54' && r.plan && r.oculto && r.orden && r.apuesta, `${w}px fallo: ${JSON.stringify(r)}`);
    await p2.locator('.porque-btn').click(); ok(!(await p2.evaluate(() => document.querySelector('.porque-box').hidden)), 'Por qué abre los porqués');
    const d2 = await p2.evaluate(() => document.documentElement.scrollWidth <= innerWidth); ok(d2, `${w}px fallo: desborde`); await p2.close();
  }
  await apuesta(1); ok(/Apuesta cerrada: \(b\)/.test(await txt()), 'p1 apuesta cerrada');
  await clic(/Subir la sepsis/); await p.waitForTimeout(200);
  // P2
  await esp(0, { pam: '54', pa: '73/34', fc: '123', pvc: '3', pcp: '6', ic: '3,1', irvs: '17', lact: '4,0', diur: '0,4' }, 'p2');
  ok(/Shock séptico/.test(await txt()) && /Acertaste: PVC baja, IC alto, IRVS baja/.test(await txt()), 'p2 estado y veredicto'); await desborde('p2');
  await clic(/Ahora explica: ¿por qué el gasto/); await apuesta(1); await desborde('p2 tras contestar'); await clic(/Seguir: otra herida/);
  // P3 con velo
  let g = await vals(); ok(g['v-pam'] === '···' && g['v-ic'] === '···' && g['v-hb'] === '···', 'p3 velo puesto');
  ok(!/13,8|135/.test(await p.evaluate(() => document.querySelector('#mon').innerText.replace(/\s/g, ''))), 'p3 cifras tapadas en el DOM');
  await apuesta(0); await desborde('p3 apuesta'); await clic(/Mirar el monitor de Mateo/);
  await esp(0, { pam: '71', pa: '78/63', fc: '135', pvc: '1', pcp: '3', ic: '1,8', irvs: '38', scvo2: '65', gap: '6', lact: '3,0', diur: '0,9', hb: '13,8' }, 'p3');
  await clic(/Ahora explica: ¿por qué la IRVS/); await apuesta(0); await desborde('p3 tras contestar'); await clic(/Seguir: de vuelta/);
  // P4
  ok((await vals())['v-pam'] === '···', 'p4 velo'); ok(/1\.750 mL de cristaloide/.test(await txt()), 'p4 plan');
  await apuesta(1); await clic(/Poner 1\.750 mL/);
  await esp(0, { pam: '77', pa: '111/43', fc: '93', pvc: '11', pcp: '14', ic: '4,2', irvs: '16' }, 'p4 h0');
  await clic(/Pasar una hora/); await esp(0, { pam: '63', pa: '86/39', fc: '114', pvc: '5', pcp: '8', ic: '3,5', irvs: '17', lact: '4,2', diur: '0,7' }, 'p4 h1');
  ok(/PAM 63 a la hora 1: el volumen no bastó/.test(await txt()), 'p4 giro'); await desborde('p4');
  await clic(/Ahora explica: ¿por qué la PAM volvió/); await clic(/Ya lo pensé/); await p.locator('.punto input').first().check(); await desborde('p4 A6'); await clic(/Seguir: la noradrenalina/);
  // P5
  ok((await vals())['v-pam'] === '···', 'p5 velo'); await apuesta(0); await clic(/Subir la noradrenalina/);
  await esp(0, { pam: '81', pa: '113/48', fc: '87', pvc: '6', ic: '3,6', irvs: '21' }, 'p5');
  { const tb = await p.locator('table').last().innerText(); ok(/68/.test(tb) && /71/.test(tb) && /81/.test(tb) && /Tu apuesta/.test(tb), 'p5 tabla NA'); }; await desborde('p5');
  await clic(/encuentra el error/); await p.locator('.fr').nth(1).click(); await p.locator('.fr').nth(4).click(); await clic(/^Comprobar/);
  ok(/Sin fallos/.test(await txt()), 'p5 A8 sin fallos'); await clic(/Ver la frase buena de la 2/); await desborde('p5 A8'); await clic(/Seguir: lo que te llevas/);
  // P6
  const t = await txt(); ok(/Elige: A · B · C/.test(t) && /estás aquí/.test(t) && /N1: predecir antes de ver/.test(t), 'p6 pie');
  const hrefs = await p.$$eval('.pie a', a => a.map(x => x.getAttribute('href'))); ok(hrefs.join() === 'a-poe-shock.html,b-error-capilar.html,c-entrelazado-rio.html', 'p6 enlaces');
  await desborde('p6');
  const chico = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 8).length); ok(chico === 0, 'texto <8 px');
  await p.screenshot({ path: `${process.env.SALIDA || '/tmp'}/a-${w}-p6.png`, fullPage: true });
  ok(!errs.length, 'consola: ' + errs.join(' | '));
  console.log(`${w} px: ${errs.length ? 'errores de consola' : 'sin errores de consola'}`);
}
await b.close(); console.log(fallos ? `FALLOS: ${fallos}` : 'TODO EN VERDE'); process.exit(fallos ? 1 : 0);
