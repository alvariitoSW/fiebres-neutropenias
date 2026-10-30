// Prueba de M1 y M2 (R1). Uso: python3 -m http.server 8731 desde la raíz; NODE_PATH=$(npm root -g) node autonomo/maquetas/eco-reforma/prueba-m1m2.mjs
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = 'http://localhost:8731/autonomo/maquetas/eco-reforma/', OUT = '/tmp/plan-socialista/eco-reforma/capturas/';
const ok = (c, t) => { console.log((c ? 'OK   ' : 'FALLA') + ' ' + t); if (!c) process.exitCode = 1; };
const b = await chromium.launch();
for (const [w, h] of [[390, 844], [360, 780]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const err = []; p.on('console', m => m.type() === 'error' && err.push(m.text())); p.on('pageerror', e => err.push(String(e)));
  const esp = async () => { await p.waitForFunction(() => !document.body.dataset.calculando, null, { timeout: 20000 }); await p.waitForTimeout(400); };
  const desb = async (t) => ok(await p.evaluate(() => document.documentElement.scrollWidth) <= w, `${w}px sin desborde: ${t}`);
  // ---- M1
  await p.goto(BASE + 'm1-corazon.html'); await esp();
  const txt = (s) => p.locator(s).innerText();
  const a = await txt('#m1-lienzo >> nth=0').catch(() => ''); const t1 = await p.evaluate(() => [...document.querySelectorAll('#m1-lienzo text')].map(x => x.textContent).join('|'));
  await p.waitForTimeout(350); const t2 = await p.evaluate(() => [...document.querySelectorAll('#m1-lienzo text')].map(x => x.textContent).join('|'));
  ok(t1 !== t2, `M1 late (${w}): ${t1.slice(0, 40)} -> ${t2.slice(0, 40)}`);
  for (const id of ['normal', 'tep', 'hp', 'fallo', 'tapon']) {
    await p.click(`button[data-pac="${id}"]`); await esp();
    const f = await p.evaluate(() => ['fevi', 'fevd', 'pap', 'pvc', 'gc', 'tapse'].map(k => document.getElementById('f-' + k).textContent).join(' / ') + ' | E/e′ ' + document.getElementById('m1-eev').textContent);
    console.log(`  M1 ${id}: ${f}`); await desb('M1 ' + id);
    if (id === 'tep') {
      ok(await p.locator('#m1-ee-sello').isVisible(), 'TEP defecto: sello E/e′ imposible visible');
      ok((await txt('#m1-eev')) === '1,8', 'TEP defecto E/e′ = 1,8');
      if (w === 390) await p.screenshot({ path: OUT + 'm1-390.png' });
    }
  }
  await p.click('button[data-pac="tep"]'); await esp();
  await p.locator('#m1-g').fill('100'); await p.waitForTimeout(400); await esp();
  const sello = await txt('#m1-sello100'); ok(/VD claudica: GC 2,3, PAM 58/.test(sello), 'TEP 100 %: ' + sello);
  console.log('  M1 TEP 100%:', await p.evaluate(() => ['fevi', 'fevd', 'pap', 'pvc', 'gc', 'tapse'].map(k => document.getElementById('f-' + k).textContent).join(' / ') + ' | E/e′ ' + document.getElementById('m1-eev').textContent));
  ok(!(await p.locator('#m1-ee-sello').isVisible()), 'TEP 100 %: E/e′ 8,3 sin sello');
  await desb('M1 TEP 100');
  ok(await p.evaluate(() => { const r = document.querySelector('.fijas').getBoundingClientRect(); return r.bottom <= innerHeight + 1 && r.top > 0; }), 'barra de 6 cifras visible');
  if (w === 390) await p.screenshot({ path: OUT + 'm1-tep100.png' });
  ok(await p.evaluate(() => [...document.querySelectorAll('button')].every(x => x.getBoundingClientRect().height >= 43.5)), 'botones >= 44 px (M1)');
  // ---- M2
  await p.goto(BASE + 'm2-contrato.html'); await esp();
  const n = await p.locator('[data-hilo]').count(); ok(n === 9, `M2: ${n} hilos`);
  const v1 = await p.evaluate(() => document.getElementById('m2-valor').textContent); await p.waitForTimeout(400);
  const v2 = await p.evaluate(() => document.getElementById('m2-valor').textContent);
  console.log('  M2 valores', v1, '->', v2); ok(v1 !== v2, 'M2 valor vivo cambia');
  ok(/la imagen solo lee/i.test(await p.evaluate(() => document.body.innerText)), 'M2 rótulo fijo');
  const hilos = await p.locator('[data-hilo]').all();
  for (const hd of hilos) { await hd.click(); ok((await txt('#m2-nombre')).length > 0 && (await txt('#m2-usa')).length > 0, 'M2 hilo ' + await hd.getAttribute('data-hilo') + ': ' + await txt('#m2-nombre')); }
  await p.click('button[data-modo="hoy"]'); await p.waitForTimeout(200);
  ok((await p.locator('[data-reves="1"]').count()) === 3, 'M2 hoy: 3 hilos al revés');
  await desb('M2 hoy'); if (w === 390) await p.screenshot({ path: OUT + 'm2-hoy.png' });
  await p.click('button[data-modo="A"]'); await p.waitForTimeout(200);
  ok((await p.locator('[data-reves="1"]').count()) === 0, 'M2 A: ningún hilo al revés');
  await desb('M2 A'); if (w === 390) await p.screenshot({ path: OUT + 'm2-A.png' });
  await p.click('button[data-modo="hoy"]');
  for (const id of ['normal', 'tep', 'hp', 'fallo', 'tapon']) { await p.click(`button[data-pac="${id}"]`); await esp(); await p.locator('[data-hilo="pres"]').click(); console.log(`  M2 ${id}: pres = ${await txt('#m2-valor')}`); await desb('M2 ' + id); }
  ok(await p.evaluate(() => [...document.querySelectorAll('button')].every(x => x.getBoundingClientRect().height >= 43.5)), 'botones >= 44 px (M2)');
  ok(err.length === 0, `sin errores de consola (${w}) ${err.join(';')}`);
  await p.close();
}
await b.close();
