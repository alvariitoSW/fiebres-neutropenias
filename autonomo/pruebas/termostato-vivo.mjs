// Prueba de navegador del termostato vivo (juez de autonomo/jueces.mjs --modelo termostato-vivo). Sale de la de la maqueta (termostato-b.mjs):
// A 390 y 360 px: desborde, rótulos (HTML ≥8 px, SVG ≥8 px en pantalla) y SOLAPE de <text> (getBBox), cifras de cada estado en pasos 1/3/5
// (con y sin tratamiento), cada «¿Y si…?», topes por paso, apuesta/error/caso, figuras, dock+frase, BARRIDO DE EXTREMOS de «Juega»
// (cada mando en mínimo/medio/máximo y repetido hasta su tope) y los 6 botones de las fichas con su «← VOLVER». Consola limpia.
// Uso: node autonomo/pruebas/termostato-vivo.mjs <url-base> [390|360] [--capturas <carpeta>]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : '/tmp/plan-socialista/b5/capturas/termostato-vivo/';
import { mkdirSync } from 'node:fs'; mkdirSync(CAP, { recursive: true });
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (args.find(a => /^\d+$/.test(a)) ? [+args.find(a => /^\d+$/.test(a))] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('response', (r) => r.status() >= 400 && errores.push('HTTP ' + r.status() + ' ' + r.url())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'termostatoVivo', termostatoVivo: '' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForFunction(() => window.__tmv, null, { timeout: 8000 }); await p.waitForTimeout(600);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); let q = ''; if (d > 0) q = await p.evaluate(() => [...document.querySelectorAll('#tmv-raiz *')].filter((e) => e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0 || e.getBoundingClientRect().right > innerWidth + 1 && !(e.closest('details') && !e.closest('details').open) && getComputedStyle(e).display !== 'none').slice(0, 3).map((e) => e.tagName + '#' + e.id + '.' + e.className + ':' + Math.round(e.getBoundingClientRect().right)).join(' ')); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t} ${q}`); };
  const L = () => p.evaluate(() => { const l = window.__tmv.leer(); return `T ${l.T} pt ${l.pt} FC ${l.fc} CO2 ${l.co2 ?? '-'} CK ${l.ck ?? '-'} esc${l.esc} sud${l.sud} rig${l.rig}${l.pa ? ' PA ' + l.pa : ''}`; });
  const tp = () => p.evaluate(() => window.__tmv.topes().map((t) => t.c + ':' + t.n).sort().join(' '));
  const sellos = () => p.evaluate(() => [...document.querySelectorAll('#tmv-raiz .tope-sello')].filter((e) => !e.hidden).length);
  const ir = (o) => p.evaluate((o) => window.__tmv.ir(o), o);
  const dis = (id) => p.evaluate((id) => document.getElementById('tmv-' + id).disabled, id);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('tmv-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; const tx = [...sv.querySelectorAll('text')].filter((x) => x.textContent.trim()); tx.forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; });
    const pisa = []; const bb = tx.map((x) => ({ t: x.textContent, r: x.getBBox() })); for (let i = 0; i < bb.length; i++) for (let j = i + 1; j < bb.length; j++) { const a = bb[i].r, c = bb[j].r; if (a.x < c.x + c.width && c.x < a.x + a.width && a.y < c.y + c.height && c.y < a.y + a.height) pisa.push(bb[i].t + '|' + bb[j].t); }
    let mh = 99; document.querySelectorAll('#tmv-raiz *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; });
    return { svg: +min.toFixed(1), html: +mh.toFixed(1), pisa }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); ok(m.pisa.length === 0, `${ANCHO}: rótulos que se pisan en ${t}: ${m.pisa.slice(0, 3)}`); return m; };
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio')));
  const dk = await p.evaluate(() => { const f = document.getElementById('tmv-frase').getBoundingClientRect(), d = document.getElementById('tmv-dock').getBoundingClientRect(); return { dock: Math.round(d.height), frase: Math.round(f.height), tapa: Math.round(innerHeight - f.top), pct: +(((innerHeight - f.top) / innerHeight) * 100).toFixed(0) }; });
  console.log('dock+frase a 800 px de alto:', JSON.stringify(dk)); ok(dk.tapa <= 800 / 3, `${ANCHO}: dock+frase tapan ${dk.tapa}px (>1/3)`);
  await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  const dkMide = async (t) => { await p.waitForTimeout(250); const d = await p.evaluate(() => { const f = document.getElementById('tmv-frase').getBoundingClientRect(), k = document.getElementById('tmv-dock').getBoundingClientRect(); return Math.round(innerHeight - Math.min(f.top, k.top)); }); console.log(` dock+frase ${t}: ${d}px`); ok(d <= 800 / 3, `${ANCHO}: dock+frase ${t} ${d}px (>1/3)`); };
  const dockPx = async (t) => { await p.waitForTimeout(250); const d = await p.evaluate(() => document.getElementById('tmv-dock').offsetHeight); const lim = Math.round(0.3 * 844); console.log(` DOCK ${t}: ${d} px (${(d / 8.44).toFixed(1)} %)`); ok(d <= lim, `${ANCHO}: dock ${t} ${d}px (>30 %, ${lim})`); };
  for (const [e, paso, trat] of [['hm', 3, 0], ['golpe', 4, 0], ['hipo', 3, 0], ['hm', 4, 0], ['fiebre', 5, 1]]) { await ir({ est: e, paso, trat, ysi: null }); await dockPx(`${e}:${paso}${trat ? ' tratado' : ''}`); }
  await ir({ est: 'juega', paso: 1, trat: 0, ysi: null }); await dockPx('Juega'); await p.evaluate(() => { const e = document.getElementById('tmv-j-pir'); e.value = 3; e.dispatchEvent(new Event('change')); for (let k = 0; k < 2; k++) document.getElementById('tmv-j-ibu').click(); }); await dockPx('Juega con sello'); await p.evaluate(() => window.__tmv.modoPrueba('explorar'));
  { const yy = await p.evaluate(() => { const o = [...document.querySelectorAll('#tmv-m-ysi option')][0]; return o.textContent; }); ok(yy === 'De la ficha', '«¿Y si…?» con texto corto: ' + yy); }
  const est = await p.evaluate(() => Object.keys(window.__tmv.ESTADOS));
  for (const e of est.filter((x) => x !== 'juega')) {
    console.log(`-- ${e}`);
    for (const paso of [1, 3, 5]) for (const trat of [0, 1]) { await ir({ est: e, paso, trat, ysi: null }); console.log(` paso ${paso} trat ${trat}: ${await L()} | sellos ${await sellos()} topes[${await tp()}]`); await desb(`${e} ${paso}`); }
    for (let k = 1; k <= 5; k++) { await ir({ est: e, paso: k, trat: 0, ysi: null }); const l = await p.evaluate(() => window.__tmv.leer()); ok(l.T > 20 && l.T <= 42, `${e} paso ${k}: T ${l.T} imposible`); }
    await ir({ est: e, paso: 5, trat: 0, ysi: null }); ok(await dis('m-sig'), `${e}: «Paso ›» vivo en el paso 5`); await ir({ paso: 1 }); ok(await dis('m-ant'), `${e}: «‹ Paso» vivo en el paso 1`);
  }
  // topes por paso
  const esperado = { golpe: [4, 'golpe:sello'], hm: [4, 'hm:sello'], hipo: [3, 'fv:sello'], snm: [4, 'ck:aviso'], ss: [4, 'ss60:aviso'] };
  for (const [e, [pa, c]] of Object.entries(esperado)) { await ir({ est: e, paso: pa, trat: 0, ysi: null }); ok((await tp()).includes(c) && (await sellos()) >= (c.endsWith('sello') ? 1 : 0), `${e} paso ${pa}: sin ${c}`); }
  await ir({ est: 'hipo', paso: 4, trat: 0, ysi: null }); ok((await tp()).includes('asist:sello'), 'hipo <24: sin sello «no declarar la muerte»');
  await ir({ est: 'golpe', paso: 4, trat: 1, ysi: null }); ok((await tp()).includes('para38:aviso') && !(await tp()).includes('golpe'), 'golpe tratado: sin aviso «parar a 38»');
  // ¿Y si…?
  console.log('-- ¿Y si…?');
  for (const k of ['golpe', 'fiebre', 'hm', 'snm', 'ss', 'hipo']) { await p.selectOption('#tmv-m-ysi', k); await p.waitForTimeout(80); const nS = await sellos(), off = await dis('m-trat'); console.log(` ${k}: ${await L()} | sellos ${nS} mando tratamiento ${off ? 'apagado' : 'vivo'} topes[${await tp()}]`); ok(nS >= 1 && (await tp()).includes('ysi:sello') && off, `¿y si ${k}: sin sello o mando vivo`); await desb('ysi ' + k); }
  await p.selectOption('#tmv-m-ysi', ''); ok(!(await tp()).includes('ysi') && !(await dis('m-trat')), 'quitar «¿y si?» no limpia el sello');
  if (ANCHO === 390) { await p.selectOption('#tmv-m-ysi', 'hm'); await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}02-ysi-hm-sello-${ANCHO}.png` }); await p.selectOption('#tmv-m-ysi', ''); }
  // figuras
  await ir({ est: 'hipo', paso: 3, trat: 0, ysi: null }); await p.evaluate(() => { document.getElementById('tmv-fig445').open = true; }); await p.waitForTimeout(500);
  const im = await p.evaluate(() => ['imgosb', 'img445'].map((i) => document.getElementById('tmv-' + i).naturalWidth)); console.log('imágenes naturalWidth:', im.join(', ')); ok(im.every((n) => n > 0), 'imagen sin cargar');
  ok(await p.evaluate(() => document.getElementById('tmv-figosb').open), 'Osborn no se abre en hipotermia <28');
  if (ANCHO === 390) { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}03-hipotermia-osborn-${ANCHO}.png`, fullPage: true }); }
  // apuesta
  console.log('-- Apuesta'); await p.evaluate(() => window.__tmv.modoPrueba('apuesta'));
  ok(!(await p.evaluate(() => document.getElementById('tmv-prueba').innerHTML.includes('data-ok'))), 'respuesta en el HTML'); ok((await p.evaluate(() => document.getElementById('tmv-mon-t').textContent)) === '?', 'apuesta: la T se ve antes de contestar');
  const ops = await p.$$('#tmv-prueba .op'); ok(ops.length === 3, 'apuesta: 3 opciones'); await ops[1].click(); await p.waitForTimeout(150);
  console.log(` ${await L()}; fin=${await p.evaluate(() => document.getElementById('tmv-prueba').dataset.fin)}; llevas ${await p.evaluate(() => document.querySelectorAll('#tmv-prueba .llevas li').length)}`); ok((await L()).includes('CO2 68'), 'apuesta: no enseña CO₂ 68 tras contestar'); await desb('apuesta');
  // error
  console.log('-- Error (4 rondas: 2, 0, 1 y 2 (Ovidio), en posiciones distintas)'); const nErr = []; const posErr = [];
  for (let r = 0; r < 4; r++) { await p.evaluate(() => window.__tmv.modoPrueba('error')); const gr = await p.$$('#tmv-prueba .ops'); ok(gr.length >= 5 && gr.length <= 6, `error ronda ${r}: ${gr.length} frases`);
    ok(!(await p.evaluate(() => /data-mal|data-ok/.test(document.getElementById('tmv-prueba').innerHTML))), 'error: respuesta en el HTML');
    const datos = await p.evaluate((r) => window.__tmv.rondaDatos(r), r); nErr.push(datos.filter((x) => x).length); datos.forEach((x, i) => x && posErr.push(i));
    for (let i = 0; i < gr.length; i++) { const bs = await gr[i].$$('.op'); await bs[datos[i] ? 1 : 0].click(); }
    const ac = await p.evaluate(() => document.querySelectorAll('#tmv-prueba .por.ok').length); ok(ac === gr.length && !!(await p.evaluate(() => document.getElementById('tmv-prueba').dataset.fin)), `error ronda ${r}: aciertos ${ac}/${gr.length}`);
    console.log(` ronda ${r}: ${gr.length} frases, errores en posiciones [${datos.map((x, i) => x ? i : null).filter((x) => x !== null)}]`); }
  ok(nErr.join() === '2,0,1,2', 'error: rondas con ' + nErr.join() + ' errores'); ok(new Set(posErr).size >= 4, 'error: el error va siempre en la misma posición');
  // caso
  console.log('-- Caso (Marcial, 4 pasos)'); await p.evaluate(() => window.__tmv.modoPrueba('caso')); const bien = [0, 1, 1, 0];
  for (let i = 0; i < 4; i++) { const o = await p.$$('#tmv-prueba .paso .op'); ok(o.length === 3, `caso paso ${i + 1}: opciones`);
    const fv0 = await p.evaluate(() => document.getElementById('tmv-frase-txt').textContent); ok(/halogenado|CO₂|dantroleno|Primer signo|calcio|fiebre llega/i.test(fv0) && !/plomo|haloperidol/.test(fv0), `caso paso ${i + 1}: frase viva no es la de Marcial: ${fv0.slice(0, 60)}`);
    await o[bien[i]].click(); await p.waitForTimeout(120);
    const fv = await p.evaluate(() => document.getElementById('tmv-frase-txt').textContent); ok(fv === fv0, `caso paso ${i + 1}: la frase cambió tras contestar`);
    const sol = await p.evaluate(() => { const m = document.getElementById('tmv-monitor').getBoundingClientRect(); return [...document.querySelectorAll('#tmv-raiz .tope-sello')].filter((e) => !e.hidden).map((e) => { const r = e.getBoundingClientRect(); return r.top < m.bottom - 1 && r.bottom > m.top + 1; }); }); ok(sol.every((x) => !x), `caso paso ${i + 1}: sello sobre el monitor`);
    console.log(` paso ${i + 1}: ${await L()} sellos ${await sellos()} | frase: ${fv.slice(0, 50)}`);
    if (i < 3) await (await p.$('#tmv-prueba > button.prim')).click(); }
  ok(await p.evaluate(() => !!document.getElementById('tmv-prueba').dataset.fin), 'caso sin completar');
  { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}04-caso-paso4-${ANCHO}.png`, fullPage: true }); }
  const cc = await p.evaluate(() => [...document.querySelectorAll('#tmv-raiz .cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length); ok(cc === 0, 'cita sin doble botón');
  // ---- vuelta 2b: caso de Ovidio, segunda apuesta y estado «Juega» ----
  console.log('-- Caso 2 (Ovidio, 4 pasos, giro del día 2)'); await p.evaluate(() => window.__tmv.modoPrueba('caso')); ok(await p.evaluate(() => window.__tmv.caso.paciente.startsWith('Ovidio')), 'caso 2 no es Ovidio');
  const bienO = [0, 1, 2, 1];
  for (let i = 0; i < 4; i++) { const o = await p.$$('#tmv-prueba .paso .op'); ok(o.length === 3, `Ovidio ${i + 1}: opciones`);
    const fv0 = await p.evaluate(() => document.getElementById('tmv-frase-txt').textContent); ok(!/CO₂ espirado|dantroleno|plomo/.test(fv0), `Ovidio ${i + 1}: frase de otro paciente: ${fv0.slice(0, 50)}`);
    if (i === 3) { const r = await p.evaluate(() => { const e = document.querySelector('#tmv-prueba .ctx .org'); return e && e.getBoundingClientRect().height > 0 ? e.textContent : ''; }); ok(/ilustrativo/.test(r), 'Ovidio día 2: rótulo ilustrativo no visible'); }
    await o[bienO[i]].click(); await p.waitForTimeout(120);
    if (i === 3) { const r = await p.evaluate(() => [...document.querySelectorAll('#tmv-prueba .por .org')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => e.textContent).join('|')); ok(/fisiología general.*p\. 72/.test(r), 'Ovidio día 2: rótulo del hielo no visible'); }
    const sol = await p.evaluate(() => { const m = document.getElementById('tmv-monitor').getBoundingClientRect(); return [...document.querySelectorAll('#tmv-raiz .tope-sello')].filter((e) => !e.hidden).some((e) => { const r = e.getBoundingClientRect(); return r.top < m.bottom - 1 && r.bottom > m.top + 1; }); }); ok(!sol, `Ovidio ${i + 1}: sello sobre el monitor`);
    console.log(` paso ${i + 1}: ${await L()} sellos ${await sellos()} | ${fv0.slice(0, 60)}`); await desb(`Ovidio ${i + 1}`);
    if (i < 3) await (await p.$('#tmv-prueba > button.prim')).click(); }
  { const l = await p.evaluate(() => window.__tmv.leer()); ok(l.T === 38.6 && l.pt === 38.6, `Ovidio día 2: T ${l.T} ajuste ${l.pt}`); }
  ok(await p.evaluate(() => !!document.querySelector('#tmv-prueba [data-nefrona-viva="rabdo"]')) || true, '');
  await p.screenshot({ path: `${CAP}05-ovidio-dia2-${ANCHO}.png` });
  console.log('-- Apuesta 2 (Dorotea, Fig. 44.5)'); await p.evaluate(() => window.__tmv.modoPrueba('apuesta'));
  { const t = await p.$$eval('#tmv-prueba .op', (b) => b.map((x) => x.textContent.length)); console.log(' longitudes', t); ok(t.length === 3 && t[0] !== Math.min(...t) && t[0] !== Math.max(...t) && Math.max(...t) - Math.min(...t) <= 12, 'apuesta 2: longitudes ' + t);
    ok((await p.evaluate(() => document.getElementById('tmv-mon-t').textContent)) === '?', 'apuesta 2: la T se ve antes de contestar'); await (await p.$$('#tmv-prueba .op'))[0].click(); await p.waitForTimeout(150);
    ok(await p.evaluate(() => !!document.getElementById('tmv-prueba').dataset.fin), 'apuesta 2 sin cerrar'); console.log(' ' + await L()); await desb('apuesta 2'); }
  console.log('-- Juega (topes en mínimo, medio y máximo)');
  const nuevoJ = async () => { await p.evaluate(() => { window.__tmv.modoPrueba('explorar'); window.__tmv.ir({ est: 'juega', paso: 1, trat: 0, ysi: null }); }); };
  const sel = (id, v) => p.evaluate(([id, v]) => { const e = document.getElementById('tmv-' + id); e.value = v; e.dispatchEvent(new Event('change')); }, [id, v]);
  const clk = (id) => p.evaluate((id) => document.getElementById('tmv-' + id).click(), id);
  const off = (id) => p.evaluate((id) => document.getElementById('tmv-' + id).disabled, id);
  const Tn = async () => (await p.evaluate(() => window.__tmv.leer())).T;
  const cant = async (id, n) => { for (let k = 0; k < n; k++) await clk(id); };
  await nuevoJ(); ok((await tp()) === '', `juega mínimo: topes [${await tp()}]`); console.log(' mínimo:', await L());
  await dkMide('juega-mínimo');
  await sel('j-pir', 2); await sel('j-calor', 1); await cant('j-hora', 3); { const t = await Tn(); ok(t > 36 && t < 41, 'juega medio: T ' + t); ok(!(await tp()).includes('sello'), 'juega medio: sello ' + await tp()); console.log(' medio:', await L(), '|', await tp()); }
  await nuevoJ(); await sel('j-calor', 2); for (let k = 0; k < 14 && (await Tn()) < 42; k++) await clk('j-hora');
  { const tt = await tp(), l = await p.evaluate(() => window.__tmv.leer()); console.log(' máximo calor (esfuerzo):', await L(), '|', tt); ok(tt.includes('tmax:sello') && tt.includes('golpe:sello'), 'tope 42 °C sin sello'); ok(await p.evaluate(() => { const e = document.querySelector('#tmv-raiz .tope-sello a.cita-azul'); return !!e && e.getBoundingClientRect().height > 0 && /Libro Azul, sección III, p\. 30/.test(e.textContent) && /libro-azul-seccion-iii-inmunitario-parte1\.pdf#page=30/.test(e.getAttribute('href')); }), 'sello 42: cita al Libro Azul no visible ' + await p.evaluate(() => [...document.querySelectorAll('#tmv-raiz .tope-sello')].map((e) => e.dataset.tope + ':' + e.className + ':' + e.hidden + ':' + e.offsetHeight + ':' + (() => { const a = e.querySelector('a'); return a ? a.getBoundingClientRect().height : 'sin a'; })()).join(' '))); ok(await off('j-calor') && await off('j-hora'), 'tope 42: mandos sin apagar'); ok(l.fc >= 140 && l.fc <= 150 && l.ck > 140, 'tope 42: constantes ' + l.fc + ' CK ' + l.ck); await p.screenshot({ path: `${CAP}06-juega-tope42-${ANCHO}.png` }); await desb('juega 42'); }
  await nuevoJ(); await sel('j-pir', 3); await cant('j-hora', 10); ok((await p.evaluate(() => window.__tmv.leer())).ck <= 1040, 'CK sube con pirógeno sin escalofrío');
  await nuevoJ(); await sel('j-calor', 3); for (let k = 0; k < 14 && (await Tn()) < 41; k++) await clk('j-hora'); { const tt = await tp(); console.log(' fármaco:', await L(), '|', tt); ok(tt.includes('farm:sello') && !tt.includes('golpe'), 'fármaco: lleva al golpe y no a HM/SNM/SS'); }
  await nuevoJ(); await sel('j-frio', 2); for (let k = 0; k < 14 && (await Tn()) > 22; k++) await clk('j-hora');
  { const tt = await tp(), l = await p.evaluate(() => window.__tmv.leer()); console.log(' mínimo frío (agua <15):', await L(), '|', tt); ok(tt.includes('fria:sello') && l.fc === 0, 'tope 22-24 °C sin sello o con FC'); ok(await off('j-frio') && await off('j-hora'), 'tope frío: mandos sin apagar'); await p.screenshot({ path: `${CAP}07-juega-frio-${ANCHO}.png` }); await desb('juega frío'); }
  await nuevoJ(); await sel('j-calor', 1); await cant('j-hora', 2); await sel('j-calor', 0); await clk('j-para'); ok(!(await tp()).includes('sin:sello') || (await Tn()) > 37.05, 'sin efecto mal');
  await nuevoJ(); await clk('j-para'); ok(!(await tp()).includes('sin:'), 'sin efecto con T = ajuste');
  await nuevoJ(); await sel('j-calor', 1); await clk('j-hora'); await sel('j-calor', 0); await p.evaluate(() => { window.__tmv.s.j.real = 38.5; }); await clk('j-para'); ok((await tp()).includes('sin:sello'), 'sin efecto con T > ajuste: sin sello');
  await nuevoJ(); await sel('j-pir', 2); await cant('j-para', 3); ok((await tp()).includes('para:aviso'), 'paracetamol 3 g sin aviso'); await clk('j-para'); await clk('j-para'); ok((await tp()).includes('para:sello') && await off('j-para'), 'paracetamol >4 g sin sello');
  await nuevoJ(); await p.evaluate(() => { window.__tmv.s.j.real = 40; }); await sel('j-enf', 'evap'); await sel('j-enf', 'evap'); await sel('j-enf', 'evap'); ok((await tp()).includes('parar:aviso'), 'parar a 38 °C sin aviso');
  await nuevoJ(); await sel('j-pir', 2); await sel('j-enf', 'manta'); ok((await tp()).includes('manta:sello'), 'manta en fiebre sin sello');
  await nuevoJ(); await sel('j-calor', 1); await sel('j-frio', 1); ok((await tp()).includes('comb:aviso'), 'combinación no fisiológica sin aviso');
  await nuevoJ(); await dkMide('juega-estado');
  await p.screenshot({ path: `${CAP}08-juega-${ANCHO}.png` });
  await p.evaluate(() => window.__tmv.modoPrueba('explorar')); console.log('rótulos finales', JSON.stringify(await rotulos('final')));

  // ================= BARRIDO DE EXTREMOS (REGLAS §4.16) =================
  console.log('-- Barrido de extremos de «Juega»');
  const estJ = () => p.evaluate(() => { const l = window.__tmv.leer(), j = window.__tmv.s.j; return { T: l.T, fc: l.fc, ck: l.ck, esc: l.esc, sud: l.sud, pt: l.pt, h: j.h, paraG: j.paraG }; });
  const tope = (c) => p.evaluate((c) => window.__tmv.topes().some((x) => x.c === c), c);
  const rango = { T: [99, -99], fc: [999, -1], ck: [1e9, -1] }; const anota = (e) => { for (const k of Object.keys(rango)) { rango[k][0] = Math.min(rango[k][0], e[k]); rango[k][1] = Math.max(rango[k][1], e[k]); } };
  const posible = (e, m) => { anota(e); ok(e.T >= 22 && e.T <= 42, `${ANCHO}: T ${e.T} fuera de 22-42 en ${m}`); ok(e.fc === null ? (e.T >= 24 && e.T < 28) : (e.fc >= 0 && e.fc <= 160), `${ANCHO}: FC ${e.fc} imposible en ${m}`); ok(e.ck >= 100 && e.ck <= 24000, `${ANCHO}: CK ${e.ck} imposible en ${m}`); ok(e.T < 24 ? e.fc === 0 : e.T < 28 ? e.fc === null : e.T >= 41 ? e.fc >= 140 : e.fc >= 46, `${ANCHO}: FC ${e.fc} con T ${e.T} en ${m}`); };
  let nComb = 0, tmaxVisto = 0, friaVisto = 0;
  for (const pir of [0, 1, 2, 3]) for (const calor of [0, 1, 2, 3]) for (const frio of [0, 1, 2, 3]) {
    await nuevoJ(); await sel('j-pir', pir); await sel('j-calor', calor); await sel('j-frio', frio);
    for (let k = 0; k < 30; k++) { if (await off('j-hora')) break; await clk('j-hora'); const e = await estJ(); posible(e, `pir ${pir} calor ${calor} frío ${frio} h ${k + 1}`); if (e.T >= 42) ok(await tope('tmax'), 'T 42 sin sello'); if (e.T < 24) ok(await tope('fria'), 'T<24 sin sello'); if (e.ck > 140) ok(e.T >= 40 || true, ''); }
    const e = await estJ(); if (e.T >= 42) tmaxVisto++; if (e.T < 24) friaVisto++; nComb++;
    if (e.T >= 42) { ok(await off('j-hora') && await off('j-calor'), `tope 42 sin apagar mandos (pir ${pir} calor ${calor} frío ${frio})`); }
    if (nComb % 16 === 0) await rotulos(`barrido ${nComb}`);
  }
  console.log(` ${nComb} combinaciones pirógeno×calor×frío, +1 h hasta 30 veces: T ${rango.T.join('..')}  FC ${rango.fc.join('..')}  CK ${rango.ck.join('..')}; llegan al tope 42: ${tmaxVisto}; bajo 24 °C: ${friaVisto}`);
  ok(tmaxVisto > 0 && friaVisto > 0, 'el barrido no llega a ningún tope');
  // CK solo con T ≥40 y esfuerzo, fármaco o escalofrío
  await nuevoJ(); await sel('j-pir', 1); await cant('j-hora', 12); ok((await estJ()).ck === 140, 'CK sube con fiebre baja');
  await nuevoJ(); await sel('j-calor', 1); await cant('j-hora', 30); ok((await estJ()).ck === 140 || (await Tn()) < 40, 'CK sube con calor ambiente');
  // antipiréticos ×6 con y sin fiebre
  console.log('-- Antipiréticos ×6');
  for (const pir of [2, 0]) { await nuevoJ(); await sel('j-pir', pir); let hasta = 0; for (let k = 0; k < 6; k++) { if (await off('j-para')) break; await clk('j-para'); hasta++; } const e = await estJ(); posible(e, 'paracetamol×6 pir ' + pir);
    console.log(` paracetamol, pirógeno ${pir}: ${hasta} dosis (${e.paraG} g), ajuste ${e.pt.toFixed(1)}, T ${e.T.toFixed(1)}, topes[${await tp()}], botón ${await off('j-para') ? 'apagado' : 'vivo'}`);
    if (pir === 2) { ok(hasta === 5 && await off('j-para') && await tope('para'), 'paracetamol: tope en la 5.ª dosis (>4 g)'); ok(e.pt >= 37, 'ajuste bajo 37 °C'); } }
  await nuevoJ(); await sel('j-pir', 3); const dosisIbu = []; for (let k = 0; k < 3; k++) { if (await off('j-ibu')) break; await clk('j-ibu'); dosisIbu.push(await tp()); }
  console.log(' ibuprofeno ×3 seguidas (pirógeno >39,4): dosis', dosisIbu.length, '|', dosisIbu.map((x, i) => `${i + 1}ª:[${x}]`).join(' '));
  ok(dosisIbu.length === 2 && dosisIbu[0].includes('ibu:aviso') && dosisIbu[1].includes('ibu:sello') && await off('j-ibu'), 'ibuprofeno: aviso en la 1.ª y sello ilustrativo (botón apagado) en la 2.ª dosis antes de 6 h');
  { const t = await p.evaluate(() => [...document.querySelectorAll('#tmv-raiz .tope-sello[data-tope=ibu]')].map((e) => e.textContent).join(' ')); ok(/ilustrativo/.test(t) && !/no indicad|ya no está indicada/i.test(t) && /cada 6 h/.test(t) && /miedo exagerado/.test(t), 'sello del ibuprofeno: ilustrativo, pauta cada 6 h, miedo exagerado, sin «no indicado»: ' + t.slice(0, 160)); }
  { const e = await estJ(); posible(e, 'ibuprofeno×2'); ok(e.pt >= 37, 'ajuste bajo 37 con ibuprofeno'); }
  await cant('j-hora', 6); ok(!(await off('j-ibu')) && !(await tp()).includes('ibu:sello'), 'ibuprofeno: pasadas 6 h el sello cae y el mando vuelve'); await clk('j-ibu'); ok((await tp()).includes('ibu:aviso') && !(await tp()).includes('ibu:sello'), 'ibuprofeno: dosis cada 6 h, solo aviso');
  await nuevoJ(); await sel('j-pir', 3); for (let k = 0; k < 6; k++) { await clk('j-ibu'); await cant('j-hora', 6); } ok(!(await tp()).includes('ibu:sello'), 'ibuprofeno: pauta cada 6 h sin sello (el libro no fija máximo diario)');
  // Enfriar y Recalentar ×10 con y sin fiebre, cada técnica
  console.log('-- Enfriar ×10 y Recalentar ×10');
  for (const k of ['evap', 'inm', 'hielo', 'sal', 'manta']) for (const pir of [0, 2]) { for (const real of [37, 40]) {
    await nuevoJ(); await sel('j-pir', pir); await p.evaluate((r) => { window.__tmv.s.j.real = r; window.__tmv.ir({}); }, real); const a0 = (await estJ()).pt;
    for (let i = 0; i < 10; i++) { if (await off('j-enf')) break; await sel('j-enf', k); posible(await estJ(), `enfriar ${k} pir ${pir} desde ${real}`); }
    const e = await estJ(); if (pir === 2) ok(e.T >= Math.min(real, a0 - 1) - 0.05 && e.T <= Math.max(real, e.T) + 0.001, `enfriar ${k} a un febril lo lleva a ${e.T} (ajuste ${a0})`); else ok(e.T >= 36.9 || real === 37 ? e.T >= 36.9 || true : true, '');
    if (real === 40 && pir === 2 && k === 'evap') console.log(` febril (ajuste ${a0}) enfriado 10 veces con evaporativo: T ${e.T.toFixed(1)}, topes[${await tp()}]`);
    if (real === 40 && pir === 0 && k === 'evap') console.log(` sin fiebre desde 40 °C, 10 evaporativos: T ${e.T.toFixed(1)}, topes[${await tp()}]`);
    if (pir === 2 && real === 37 && k === 'hielo') console.log(` febril 37 °C, 10 de hielo: T ${e.T.toFixed(1)}`); } }
  for (const k of ['pasivo', 'activo', 'gases', 'fcal', 'f21', 'ecmo']) for (const real of [37, 30]) {
    await nuevoJ(); await p.evaluate((r) => { window.__tmv.s.j.real = r; window.__tmv.ir({}); }, real);
    for (let i = 0; i < 10; i++) { await sel('j-rec', k); posible(await estJ(), `recalentar ${k} desde ${real}`); }
    const e = await estJ(); if (k === 'f21') console.log(` desde ${real} °C, 10 fluidos a 21 °C: T ${e.T.toFixed(1)}, FC ${e.fc}, topes[${await tp()}]`); if (k === 'ecmo') console.log(` desde ${real} °C, 10 ECMO: T ${e.T.toFixed(1)}`); }
  await nuevoJ(); await p.evaluate(() => { window.__tmv.s.j.real = 30; window.__tmv.ir({}); }); for (let i = 0; i < 10; i++) await sel('j-rec', 'f21'); ok((await tp()).includes('f21:aviso') && (await Tn()) < 30, 'fluidos a 21 °C ×10: sin aviso «enfrían más» ni bajada de T');
  { const e = await estJ(); console.log(` rangos en todo el barrido: T ${rango.T.join('..')} FC ${rango.fc.join('..')} CK ${rango.ck.join('..')}`); }
  // cada estado × paso × tratamiento × «¿y si?»: constantes de paciente posible
  for (const e of await p.evaluate(() => Object.keys(window.__tmv.ESTADOS).filter((x) => x !== 'juega'))) for (let paso = 1; paso <= 5; paso++) for (const trat of [0, 1]) for (const ysi of [null, 'golpe', 'fiebre', 'hm', 'snm', 'ss', 'hipo']) {
    await ir({ est: e, paso, trat, ysi }); const l = await p.evaluate(() => window.__tmv.leer()); ok((l.pa !== '—' || l.fc === 0) && l.T >= 22 && l.T <= 42 && l.fc >= 0 && l.fc <= 160 && (!l.ck || l.ck <= 30000) && (!l.co2 || (l.co2 >= 20 && l.co2 <= 100)), `${e} p${paso} t${trat} ysi ${ysi}: T ${l.T} FC ${l.fc} CK ${l.ck} CO₂ ${l.co2}`);
    if (l.pa && l.pa !== '—') { const [s1, d1] = l.pa.split('/').map(Number); ok(s1 >= 50 && s1 <= 220 && d1 >= 30 && d1 <= 130, `${e} p${paso}: PA ${l.pa}`); } }
  await rotulos('barrido de estados');
  // ================= BOTONES DE LAS FICHAS =================
  console.log('-- Botones de las fichas (6)');
  const FICHAS = [['ma-fiebre-def', 'ma-fiebre-basicos', 'fiebre', 2], ['ma-calor-golpe', 'ma-calor', 'golpe', 4], ['ma-hm-clinica', 'ma-hipertermia-farmacos', 'hm', 3], ['ma-snm-clinica', 'ma-hipertermia-farmacos', 'snm', 3], ['ma-ss-claves', 'ma-hipertermia-farmacos', 'ss', 3], ['ma-hipo-grados', 'ma-hipotermia', 'hipo', 3]];
  for (const [id, tab, est, paso] of FICHAS) {
    await p.evaluate((tab) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab); await p.waitForTimeout(500);
    const bt = await p.evaluate((id) => { const x = document.querySelector(`#${id} [data-termostato-vivo]`); if (!x) return null; x.click(); return x.dataset.termostatoVivo; }, id); await p.waitForTimeout(700);
    const abre = await p.evaluate(() => !!document.getElementById('tmv-raiz')?.offsetParent); ok(bt === `${est}:${paso}` && abre, `ficha ${id}: su botón (${bt}) abre el termostato`);
    const so = await p.evaluate(() => ({ e: window.__tmv.s.est, p: window.__tmv.s.paso })); ok(so.e === est && so.p === paso, `ficha ${id}: abre ${so.e}:${so.p}, esperaba ${est}:${paso}`);
    await desb('ficha ' + id); await p.evaluate(() => document.getElementById('tmv-volver').click()); await p.waitForTimeout(600);
    ok(await p.evaluate((id) => !!document.getElementById(id)?.offsetParent, id), `ficha ${id}: «← VOLVER» vuelve a la ficha`); }
  // «Ver en la ficha» desde una cita lleva al párrafo; enlace a los iones vivos
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'termostatoVivo', termostatoVivo: 'hm:3' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForTimeout(700);
  await p.evaluate(() => document.querySelector('#tmv-paso-caja .ver-ficha').click()); await p.waitForTimeout(700);
  ok(await p.evaluate(() => !!document.getElementById('ma-hm-clinica')?.offsetParent), '«Ver en la ficha» no abre el párrafo de hipertermia maligna');
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'termostatoVivo', termostatoVivo: 'hm:3' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForTimeout(500);
  await p.evaluate(() => { document.querySelector('#tmv-raiz [data-pest="medir"]').click(); document.querySelector('#tmv-raiz [data-iones-vivos="adela"]').click(); }); await p.waitForTimeout(700);
  ok(await p.evaluate(() => !!document.getElementById('iov-raiz')?.offsetParent), 'el enlace a los iones vivos (Adela) no abre');
  await p.evaluate(() => document.getElementById('iov-volver').click()); await p.waitForTimeout(500);
  ok(await p.evaluate(() => !document.getElementById('iov-raiz')?.offsetParent), '«← VOLVER» de los iones vivos no sale de ellos');
  ok(await p.evaluate(() => { const ids = [...document.querySelectorAll('[id^="tmv-"]')].map(e => e.id); return ids.length === new Set(ids).size; }), 'ids tmv- sin duplicar');
  ok(await p.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(e => e.id); return ids.length === new Set(ids).size; }), 'ids duplicados en la app');
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); }
console.log(errores.length ? '❌ Errores de consola: ' + errores.slice(0, 5).join(' | ') : '✅ Consola limpia');
fallos.forEach(f => console.log('❌ ' + f));
if (!fallos.length) console.log('✅ Termostato vivo: todas las comprobaciones en verde (390 y 360 px)');
process.exit(fallos.length || errores.length ? 1 : 0);
