// Prueba de la maqueta «termostato B · El cuerpo que arde y tirita» (390 y 360): desborde, rótulos, cifras de cada estado en pasos 1/3/5 (con y sin tratamiento),
// cada «¿Y si…?» con su sello y mando apagado, topes por paso, apuesta/error/caso, figuras, altura del dock+frase y consola.
// Uso: node termostato-b.mjs [ancho]   (lanza su propio servidor en el puerto 8163 y lo cierra por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b5/capturas/termostato-b/';
import { mkdirSync } from 'node:fs'; mkdirSync(CAP, { recursive: true });
const srv = spawn('python3', ['-m', 'http.server', '8163'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('response', (r) => r.status() >= 400 && errores.push('HTTP ' + r.status() + ' ' + r.url())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8163/autonomo/maquetas/b5-termostato-b.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__ter.leer(); return `T ${l.T} pt ${l.pt} FC ${l.fc} CO2 ${l.co2 ?? '-'} CK ${l.ck ?? '-'} esc${l.esc} sud${l.sud} rig${l.rig}${l.pa ? ' PA ' + l.pa : ''}`; });
  const tp = () => p.evaluate(() => window.__ter.topes().map((t) => t.c + ':' + t.n).sort().join(' '));
  const sellos = () => p.evaluate(() => [...document.querySelectorAll('.tope-sello')].filter((e) => !e.hidden).length);
  const ir = (o) => p.evaluate((o) => window.__ter.ir(o), o);
  const dis = (id) => p.evaluate((id) => document.getElementById(id).disabled, id);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('ter-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; const tx = [...sv.querySelectorAll('text')].filter((x) => x.textContent.trim()); tx.forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; });
    const pisa = []; const bb = tx.map((x) => ({ t: x.textContent, r: x.getBBox() })); for (let i = 0; i < bb.length; i++) for (let j = i + 1; j < bb.length; j++) { const a = bb[i].r, c = bb[j].r; if (a.x < c.x + c.width && c.x < a.x + a.width && a.y < c.y + c.height && c.y < a.y + a.height) pisa.push(bb[i].t + '|' + bb[j].t); }
    let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; });
    return { svg: +min.toFixed(1), html: +mh.toFixed(1), pisa }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); ok(m.pisa.length === 0, `${ANCHO}: rótulos que se pisan en ${t}: ${m.pisa.slice(0, 3)}`); return m; };
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio')));
  const dk = await p.evaluate(() => { const f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); return { dock: Math.round(d.height), frase: Math.round(f.height), tapa: Math.round(innerHeight - f.top), pct: +(((innerHeight - f.top) / innerHeight) * 100).toFixed(0) }; });
  console.log('dock+frase a 800 px de alto:', JSON.stringify(dk)); ok(dk.tapa <= 800 / 3, `${ANCHO}: dock+frase tapan ${dk.tapa}px (>1/3)`);
  await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  const est = await p.evaluate(() => Object.keys(window.__ter.ESTADOS));
  for (const e of est) {
    console.log(`-- ${e}`);
    for (const paso of [1, 3, 5]) for (const trat of [0, 1]) { await ir({ est: e, paso, trat, ysi: null }); console.log(` paso ${paso} trat ${trat}: ${await L()} | sellos ${await sellos()} topes[${await tp()}]`); await desb(`${e} ${paso}`); }
    for (let k = 1; k <= 5; k++) { await ir({ est: e, paso: k, trat: 0, ysi: null }); const l = await p.evaluate(() => window.__ter.leer()); ok(l.T > 20 && l.T <= 42, `${e} paso ${k}: T ${l.T} imposible`); }
    await ir({ est: e, paso: 5, trat: 0, ysi: null }); ok(await dis('m-sig'), `${e}: «Paso ›» vivo en el paso 5`); await ir({ paso: 1 }); ok(await dis('m-ant'), `${e}: «‹ Paso» vivo en el paso 1`);
  }
  // topes por paso
  const esperado = { golpe: [4, 'golpe:sello'], hm: [4, 'hm:sello'], hipo: [3, 'fv:sello'], snm: [4, 'ck:aviso'], ss: [4, 'ss60:aviso'] };
  for (const [e, [pa, c]] of Object.entries(esperado)) { await ir({ est: e, paso: pa, trat: 0, ysi: null }); ok((await tp()).includes(c) && (await sellos()) >= (c.endsWith('sello') ? 1 : 0), `${e} paso ${pa}: sin ${c}`); }
  await ir({ est: 'hipo', paso: 4, trat: 0, ysi: null }); ok((await tp()).includes('asist:sello'), 'hipo <24: sin sello «no declarar la muerte»');
  await ir({ est: 'golpe', paso: 4, trat: 1, ysi: null }); ok((await tp()).includes('para38:aviso') && !(await tp()).includes('golpe'), 'golpe tratado: sin aviso «parar a 38»');
  // ¿Y si…?
  console.log('-- ¿Y si…?');
  for (const k of ['golpe', 'fiebre', 'hm', 'snm', 'ss', 'hipo']) { await p.selectOption('#m-ysi', k); await p.waitForTimeout(80); const nS = await sellos(), off = await dis('m-trat'); console.log(` ${k}: ${await L()} | sellos ${nS} mando tratamiento ${off ? 'apagado' : 'vivo'} topes[${await tp()}]`); ok(nS >= 1 && (await tp()).includes('ysi:sello') && off, `¿y si ${k}: sin sello o mando vivo`); await desb('ysi ' + k); }
  await p.selectOption('#m-ysi', ''); ok(!(await tp()).includes('ysi') && !(await dis('m-trat')), 'quitar «¿y si?» no limpia el sello');
  if (ANCHO === 390) { await p.selectOption('#m-ysi', 'hm'); await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}02-ysi-hm-sello-${ANCHO}.png` }); await p.selectOption('#m-ysi', ''); }
  // figuras
  await ir({ est: 'hipo', paso: 3, trat: 0, ysi: null }); await p.evaluate(() => { document.getElementById('fig445').open = true; }); await p.waitForTimeout(500);
  const im = await p.evaluate(() => ['imgosb', 'img445'].map((i) => document.getElementById(i).naturalWidth)); console.log('imágenes naturalWidth:', im.join(', ')); ok(im.every((n) => n > 0), 'imagen sin cargar');
  ok(await p.evaluate(() => document.getElementById('figosb').open), 'Osborn no se abre en hipotermia <28');
  if (ANCHO === 390) { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}03-hipotermia-osborn-${ANCHO}.png`, fullPage: true }); }
  // apuesta
  console.log('-- Apuesta'); await p.evaluate(() => window.__ter.modoPrueba('apuesta'));
  ok(!(await p.evaluate(() => document.getElementById('prueba').innerHTML.includes('data-ok'))), 'respuesta en el HTML'); ok((await p.evaluate(() => document.getElementById('mon-t').textContent)) === '?', 'apuesta: la T se ve antes de contestar');
  const ops = await p.$$('#prueba .op'); ok(ops.length === 3, 'apuesta: 3 opciones'); await ops[1].click(); await p.waitForTimeout(150);
  console.log(` ${await L()}; fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)}; llevas ${await p.evaluate(() => document.querySelectorAll('#prueba .llevas li').length)}`); ok((await L()).includes('CO2 68'), 'apuesta: no enseña CO₂ 68 tras contestar'); await desb('apuesta');
  // error
  console.log('-- Error (3 rondas: 2, 0 y 1 errores, en posiciones distintas)'); const nErr = []; const posErr = [];
  for (let r = 0; r < 3; r++) { await p.evaluate(() => window.__ter.modoPrueba('error')); const gr = await p.$$('#prueba .ops'); ok(gr.length >= 5 && gr.length <= 6, `error ronda ${r}: ${gr.length} frases`);
    ok(!(await p.evaluate(() => /data-mal|data-ok/.test(document.getElementById('prueba').innerHTML))), 'error: respuesta en el HTML');
    const datos = await p.evaluate((r) => window.__ter.rondaDatos(r), r); nErr.push(datos.filter((x) => x).length); datos.forEach((x, i) => x && posErr.push(i));
    for (let i = 0; i < gr.length; i++) { const bs = await gr[i].$$('.op'); await bs[datos[i] ? 1 : 0].click(); }
    const ac = await p.evaluate(() => document.querySelectorAll('#prueba .por.ok').length); ok(ac === gr.length && !!(await p.evaluate(() => document.getElementById('prueba').dataset.fin)), `error ronda ${r}: aciertos ${ac}/${gr.length}`);
    console.log(` ronda ${r}: ${gr.length} frases, errores en posiciones [${datos.map((x, i) => x ? i : null).filter((x) => x !== null)}]`); }
  ok(nErr.join() === '2,0,1', 'error: rondas con ' + nErr.join() + ' errores'); ok(new Set(posErr).size >= 3, 'error: el error va siempre en la misma posición');
  // caso
  console.log('-- Caso (Marcial, 4 pasos)'); await p.evaluate(() => window.__ter.modoPrueba('caso')); const bien = [0, 1, 1, 0];
  for (let i = 0; i < 4; i++) { const o = await p.$$('#prueba .paso .op'); ok(o.length === 3, `caso paso ${i + 1}: opciones`);
    const fv0 = await p.evaluate(() => document.getElementById('frase-txt').textContent); ok(/halogenado|CO₂|dantroleno|Primer signo|calcio|fiebre llega/i.test(fv0) && !/plomo|haloperidol/.test(fv0), `caso paso ${i + 1}: frase viva no es la de Marcial: ${fv0.slice(0, 60)}`);
    await o[bien[i]].click(); await p.waitForTimeout(120);
    const fv = await p.evaluate(() => document.getElementById('frase-txt').textContent); ok(fv === fv0, `caso paso ${i + 1}: la frase cambió tras contestar`);
    const sol = await p.evaluate(() => { const m = document.getElementById('monitor').getBoundingClientRect(); return [...document.querySelectorAll('.tope-sello')].filter((e) => !e.hidden).map((e) => { const r = e.getBoundingClientRect(); return r.top < m.bottom - 1 && r.bottom > m.top + 1; }); }); ok(sol.every((x) => !x), `caso paso ${i + 1}: sello sobre el monitor`);
    console.log(` paso ${i + 1}: ${await L()} sellos ${await sellos()} | frase: ${fv.slice(0, 50)}`);
    if (i < 3) await (await p.$('#prueba > button.prim')).click(); }
  ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'caso sin completar');
  { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}04-caso-paso4-${ANCHO}.png`, fullPage: true }); }
  const cc = await p.evaluate(() => [...document.querySelectorAll('.cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length); ok(cc === 0, 'cita sin doble botón');
  await p.evaluate(() => window.__ter.modoPrueba('explorar')); console.log('rótulos finales', JSON.stringify(await rotulos('final')));
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); try { process.kill(pid); } catch {} }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(fallos.length ? 'FALLOS:\n- ' + fallos.join('\n- ') : 'TODO EN VERDE');
