// Juicio de Educación de las dos maquetas del eje (b6b): medidas en texto de la primera pantalla (monitor, escena frente al dock,
// citas «Ver en la ficha», sellos sobre el monitor), recorrido del caso hasta el final con el monitor en cada paso, apuesta fallada
// a propósito, y ≤4 capturas por maqueta a 390 px. Uso: node juicio-eje.mjs   (servidor en el puerto 8279, cerrado por su PID)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b6b/capturas/juicio/'; mkdirSync(CAP, { recursive: true });
const srv = spawn('python3', ['-m', 'http.server', '8279'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const b = await chromium.launch(); const out = [];
const log = (...a) => { console.log(...a); out.push(a.join(' ')); };
const geo = (p, et) => p.evaluate((et) => {
  window.scrollTo(0, 0);
  const R = (id) => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height) }; };
  const mon = R('monitor'), svg = R('eje-svg'), fr = R('frase'), dk = R('dock'), vh = innerHeight;
  const fijo = (fr ? fr.h : 0) + (dk ? dk.h : 0);
  const sellos = [...document.querySelectorAll('#sellos [data-tope], #avisos [data-tope], .tope-avisos [data-tope], .sello, .aviso')].filter((n) => n.offsetParent !== null);
  const pisa = sellos.filter((n) => { const r = n.getBoundingClientRect(); const m = document.getElementById('monitor').getBoundingClientRect(); return r.top < m.bottom && r.bottom > m.top && getComputedStyle(n).position !== 'static'; }).length;
  const citas = document.querySelectorAll('.cita').length, ver = document.querySelectorAll('[data-resaltar]').length;
  const txt = document.getElementById('frase-txt')?.textContent.trim() || '';
  return `${et}: vh ${vh} · monitor ${mon?.t}-${mon?.b} (${mon?.h}px) · svg ${svg?.t}-${svg?.b} (${svg?.h}px) · frase ${fr?.h}px + dock ${dk?.h}px = ${fijo}px fijos (${Math.round(100 * fijo / vh)} %) · svg ${svg && dk && svg.b <= Math.min(dk.t, fr?.t ?? dk.t) ? 'ENTERO sobre el dock' : 'CORTADO por el dock (' + (svg?.b - Math.min(dk?.t, fr?.t ?? dk?.t)) + 'px)'} · sellos visibles ${sellos.length}, sobre el monitor ${pisa} · citas ${citas}, «Ver en la ficha» ${ver} · frase «${txt.slice(0, 90)}»`;
}, et);
const mon = (p) => p.evaluate(() => ['m-pa', 'm-pam', 'm-fc', 'm-rit', 'm-t', 'm-na', 'm-lac', 'm-nor', 'm-c1', 'm-c2', 'm-c3', 'm-c4'].filter((i) => document.getElementById(i)).map((i) => i.slice(2) + '=' + document.getElementById(i).textContent.trim()).join(' '));
const clickOp = async (p, re) => { const o = await p.$$('#prueba .ops:last-of-type .op, #prueba .op'); const t = await Promise.all(o.map((x) => x.textContent())); let k = t.findIndex((x) => re.test(x)); if (k < 0) { log('  no encuentro', re); return null; } await o[k].click(); await p.waitForTimeout(150); return t.map((x) => x.length); };
const porTxt = (p) => p.evaluate(() => [...document.querySelectorAll('#prueba .por, #prueba .expl, #prueba p.ok, #prueba p.no')].map((x) => x.textContent.trim().slice(0, 140)).pop() || '');
try {
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  // ======================= A =======================
  log('\n===== A · El termostato hormonal =====');
  await p.goto('http://127.0.0.1:8279/autonomo/maquetas/b6b-eje-a.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  log(await geo(p, 'A inicio (Toribio)')); log('  monitor:', await mon(p)); await p.screenshot({ path: CAP + 'A-01-inicio.png' });
  await p.evaluate(() => window.__eje.ponerPreset('bibi')); await p.waitForTimeout(100); log(await geo(p, 'A Bibiana')); log('  monitor:', await mon(p));
  await p.evaluate(() => window.__eje.hacer('acth')); await p.waitForTimeout(400); log('  tras ACTH:', await mon(p), '· topes', JSON.stringify(await p.evaluate(() => window.__eje.topes().map((t) => t.clave))));
  await p.screenshot({ path: CAP + 'A-02-bibiana-acth.png' });
  await p.evaluate(() => window.__eje.ponerPreset('lucr')); await p.waitForTimeout(100); log(await geo(p, 'A Lucrecia')); log('  monitor:', await mon(p));
  await p.evaluate(() => { document.getElementById('b-ptu')?.click(); document.getElementById('b-yodo')?.click(); document.getElementById('b-hc')?.click(); }); await p.waitForTimeout(400);
  log('  tras PTU+yodo+HC:', await mon(p), '· topes', JSON.stringify(await p.evaluate(() => window.__eje.topes().map((t) => t.clave))));
  // reloj: ¿la tormenta cede con el tratamiento y los días?
  await p.evaluate(() => { for (let i = 0; i < 3; i++) document.getElementById('b-d7')?.click(); }); await p.waitForTimeout(200); log('  +21 días:', await mon(p), '· topes', JSON.stringify(await p.evaluate(() => window.__eje.topes().map((t) => t.clave))));
  await p.screenshot({ path: CAP + 'A-03-lucrecia-tratada.png' });
  // dock: qué mandos hay
  log('  mandos del dock:', await p.evaluate(() => [...document.querySelectorAll('#dock button, #dock input, #dock select')].map((x) => (x.id || x.dataset.gl || x.dataset.pre || x.dataset.pest || x.type) + (x.disabled ? '(off)' : '')).join(' ')));
  // apuesta fallada a propósito
  await p.evaluate(() => window.__eje.modoPrueba('apuesta')); await p.waitForTimeout(100); let L = await clickOp(p, /^Normal/); log('  apuesta (fallo a propósito), longitudes', L, '→', await porTxt(p)); log('  monitor tras apuesta:', await mon(p));
  // error
  await p.evaluate(() => window.__eje.modoPrueba('error')); await p.waitForTimeout(100); log('  error: frases', await p.$$eval('#prueba .ops', (o) => o.length), '· botones por frase', await p.$$eval('#prueba .ops', (o) => o.map((x) => x.querySelectorAll('.op').length).join('/')));
  // caso hasta el final
  await p.evaluate(() => window.__eje.modoPrueba('caso')); await p.waitForTimeout(100);
  for (const [i, [, re]] of [[1, /^Hidrocortisona 100/], [2, /^La bajas poco/], [3, /^Rebote/]].entries()) {
    const Lg = await clickOp(p, re); log(`  caso A paso ${i + 1}: longitudes ${Lg} · ${await porTxt(p)}`); log('   monitor:', await mon(p));
    const sig = await p.$('#prueba button.prim'); if (sig && i < 2) { await sig.click(); await p.waitForTimeout(150); }
  }
  log('  llevas A:', await p.$$eval('#prueba .llevas li', (l) => l.length), '· ver en la ficha en #prueba:', await p.$$eval('#prueba [data-resaltar]', (l) => l.length));
  await p.evaluate(() => document.querySelector('#prueba .llevas')?.scrollIntoView({ block: 'end' })); await p.waitForTimeout(150); await p.screenshot({ path: CAP + 'A-04-caso-final.png' });
  log('  errores consola A:', errs.length ? errs.slice(0, 3) : 'ninguno'); errs.length = 0;
  // ======================= B =======================
  log('\n===== B · Dos glándulas, un enfermo =====');
  await p.goto('http://127.0.0.1:8279/autonomo/maquetas/b6b-eje-b.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(2800);
  log(await geo(p, 'B inicio (Toribio)')); log('  monitor:', await mon(p)); await p.screenshot({ path: CAP + 'B-01-inicio.png' });
  await p.evaluate(() => window.__eje.ponerPreset('lucrecia')); await p.evaluate(() => window.__eje.setLup('ti')); await p.waitForTimeout(2600); log(await geo(p, 'B Lucrecia lupa tiroides')); log('  monitor:', await mon(p));
  await p.evaluate(() => { document.querySelector('[data-pest="tiro"]')?.click(); document.querySelector('[data-atd="ptu"]')?.click(); document.querySelector('[data-a="yodo"]')?.click(); document.querySelector('[data-bb="prop"]')?.click(); document.getElementById('b-hc')?.click(); }); await p.waitForTimeout(600);
  log('  tras PTU+yodo+prop+HC:', await mon(p), '· topes', JSON.stringify(await p.evaluate(() => window.__eje.topes ? window.__eje.topes().map((t) => t.c || t.clave) : 'sin api'))); log(await geo(p, 'B Lucrecia tratada'));
  log('  texto de la lupa:', await p.evaluate(() => [...document.querySelectorAll('#eje-svg text')].map((t) => t.textContent).join(' | ')));
  await p.screenshot({ path: CAP + 'B-02-lucrecia-tratada.png' });
  log('  mandos del dock:', await p.evaluate(() => { document.getElementById('dock').classList.add('abierto'); return [...document.querySelectorAll('#dock button, #dock input')].map((x) => (x.id || x.dataset.a || x.dataset.atd || x.dataset.bb || x.dataset.pest || x.type) + (x.disabled || x.classList.contains('tope-apagado') ? '(off)' : '')).join(' '); }));
  await p.evaluate(() => window.__eje.ponerPreset('bibiana')); await p.waitForTimeout(2600); log(await geo(p, 'B Bibiana')); log('  monitor:', await mon(p)); log('  texto de la lupa:', await p.evaluate(() => [...document.querySelectorAll('#eje-svg text')].map((t) => t.textContent).join(' | ')));
  await p.screenshot({ path: CAP + 'B-03-bibiana.png' });
  await p.evaluate(() => window.__eje.modoPrueba('apuesta')); await p.waitForTimeout(100); L = await clickOp(p, /^Pido un cortisol/); log('  apuesta (fallo a propósito), longitudes', L, '→', await porTxt(p)); log('  monitor tras apuesta:', await mon(p));
  await p.evaluate(() => window.__eje.modoPrueba('error')); await p.waitForTimeout(100); log('  error: botones', await p.$$eval('#prueba .op', (o) => o.length));
  await p.evaluate(() => window.__eje.modoPrueba('caso')); await p.waitForTimeout(100);
  for (const [i, [, re]] of [[1, /^Sospecho mixedema/], [2, /^Primario/], [3, /^Levotiroxina en bolo/], [4, /^Levotiroxina 50-100/]].entries()) {
    const Lg = await clickOp(p, re); log(`  caso B paso ${i + 1}: longitudes ${Lg} · ${await porTxt(p)}`); log('   monitor:', await mon(p));
    const sig = await p.$('#prueba [data-sig]'); if (sig) { await sig.click(); await p.waitForTimeout(150); }
  }
  log('  llevas B:', await p.$$eval('#prueba .llevas li', (l) => l.length), '· ver en la ficha en #prueba:', await p.$$eval('#prueba [data-resaltar]', (l) => l.length));
  await p.evaluate(() => document.querySelector('#prueba .llevas')?.scrollIntoView({ block: 'end' })); await p.waitForTimeout(150); await p.screenshot({ path: CAP + 'B-04-caso-final.png' });
  log('  errores consola B:', errs.length ? errs.slice(0, 3) : 'ninguno');
} catch (e) { log('EXCEPCIÓN', e.message); } finally { await b.close(); try { process.kill(pid); } catch {} }
