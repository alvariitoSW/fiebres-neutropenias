// Prueba de navegador del hepatocito vivo (juez de autonomo/jueces.mjs --modelo hepatocito-vivo). Sale de la de la maqueta (hepatocito-b.mjs):
// mismas cifras de mín/medio/máx, más el barrido de preset × mando en extremo, el solape de <text> del SVG, los 6 botones de las fichas y los ids.
// A 390 y 360 px. Uso: node autonomo/pruebas/hepatocito-vivo.mjs <url-base> [390|360] [--capturas <carpeta>]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { ERROR, ERROR2 } = await import(new URL('../../js/modules/libros/hepatocito-vivo/pruebas.js', import.meta.url));
const { mayeutica } = await import('./hepatocito-vivo-mayeutica.mjs');
const args = process.argv.slice(2), BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/'), CAP = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : '/tmp/plan-socialista/b5/hepatocito/cap/';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (args.find(a => /^\d+$/.test(a)) ? [+args.find(a => /^\d+$/.test(a))] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
  p.on('response', (r) => r.status() >= 400 && errores.push('HTTP ' + r.status() + ' ' + r.url())); p.on('console', (m) => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'hepatocitoVivo', hepatocitoVivo: '' }); document.body.append(x); x.click(); x.remove(); }); await p.waitForTimeout(1200); await p.waitForTimeout(700);
  const cap = (n) => p.evaluate(() => document.getElementById('hpv-raiz').scrollIntoView({ block: 'start' })).then(() => p.screenshot({ path: `${CAP}${n}-${ANCHO}.png` }));
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__hpv.leer(); return { a: Math.round(l.a), wh: l.wh, carril: l.carril, edema: l.edema, sw: +l.sw.toFixed(2) }; });
  const tp = () => p.evaluate(() => window.__hpv.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const set = (o) => p.evaluate((o) => window.__hpv.set(o), o);
  const reset = (c) => p.evaluate((c) => window.__hpv.ponerPreset(c), c);
  const clic = (q) => p.evaluate((q) => { const e = document.querySelector(q); if (!e || e.disabled) return false; e.click(); return true; }, q);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('hpv-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; }); return { svg: +min.toFixed(1), html: +mh.toFixed(1) }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); return m; };
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio'))); await cap('01-inicio');
  // astrocito visible sin scroll al abrir (preset sano): su círculo y su rótulo dentro de la pantalla y sobre la frase y el dock
  await p.evaluate(() => document.getElementById('hpv-raiz').scrollIntoView({ block: 'start' })); await p.waitForTimeout(150);
  const av = await p.evaluate(() => { const a = document.querySelector('#hpv-svg .astro').getBoundingClientRect(), f = document.getElementById('hpv-frase').getBoundingClientRect(), d = document.getElementById('hpv-dock').getBoundingClientRect(); return { top: Math.round(a.top), bottom: Math.round(a.bottom), limite: Math.round(Math.min(f.top, d.top)), vh: innerHeight }; }); console.log(' astrocito sin scroll:', JSON.stringify(av)); ok(av.top >= 0 && av.bottom <= av.limite, `astrocito no visible al abrir (${av.top}-${av.bottom}, límite ${av.limite})`); await cap('05-abrir');
  // ---- el carril: opacidad de los 4 pasos según los hepatocitos, y Motion
  const ops = async () => p.evaluate(() => [...document.querySelectorAll('#hpv-svg [data-nodo]')].map((g) => g.getAttribute('opacity')).join('/'));
  for (const f of [100, 70, 40, 0]) { await set({ func: f }); console.log(` carril a ${f} %: opacidades ${await ops()}`); }
  await set({ func: 100 }); await p.evaluate(() => document.getElementById('hpv-b-replay').click()); await p.waitForTimeout(500); const mid = await p.evaluate(() => +getComputedStyle(document.querySelector('#hpv-svg [data-nodo="3"]')).opacity); console.log(' Motion a 0,5 s: opacidad del paso 4 =', mid.toFixed(2)); ok(mid < 0.9, 'Motion no anima el carril (paso 4 ya encendido a 0,5 s)'); await p.waitForTimeout(2800); const fin = await ops(); console.log(' tras «Ver el carril» (Motion):', fin); ok(fin === '1/1/1/1', 'el carril no termina encendido');
  await set({ func: 50 }); ok((await ops()).split('/').filter((x) => +x > 0.9).length === 2, 'func 50 no enciende 2 pasos');
  // ---- vías apagadas
  const via = await p.evaluate(() => { const g = document.querySelectorAll('#hpv-svg .via-off'); g[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); return { n: g.length, frase: document.getElementById('hpv-frase-txt').textContent, cand: document.querySelectorAll('#hpv-svg .cand').length }; });
  console.log(` vías apagadas: ${via.n}, candados ${via.cand}; frase: «${via.frase.slice(0, 80)}»`); ok(via.n === 4 && via.cand === 4 && /apagad|enciende|Aquí no hace nada/.test(via.frase), 'vías con candado');
  // ---- mandos: mínimo / medio / máximo
  console.log('-- Hepatocitos vivos (0 / 50 / 100) con producción normal'); await reset('sano');
  for (const f of [0, 50, 100]) { await set({ func: f, prod: 1, dep: 0, rifa: 0, cvvh: 0 }); const l = await L(); console.log(` ${f} %: amonio ${l.a} WH ${l.wh} astrocito ${l.sw} topes[${await tp()}]`); if (f === 0) { ok((await tp()).includes('edema:sello'), '0 % sin edema'); ok(l.a === 300, '0 % no llega al tope 300'); await cap('02-tope-edema'); const off = await p.evaluate(() => [...document.querySelectorAll('[data-dep], #hpv-r-rifa')].every((x) => x.disabled)); ok(off, 'sello edema no apaga lactulosa y rifaximina'); } }
  ok((await L()).a < 60 && (await L()).wh === 0, 'sano no queda <60 y WH 0');
  console.log('-- Producción (baja / normal / alta) con 25 % de hepatocitos');
  for (const pr of [0, 1, 2]) { await set({ func: 25, prod: pr, dep: 0, rifa: 0, cvvh: 0 }); const l = await L(); console.log(` prod ${pr}: amonio ${l.a} topes[${await tp()}]`); }
  await set({ func: 100, prod: 2, dep: 0 }); console.log(` sano + alta: amonio ${(await L()).a} (<60)`); ok((await L()).a < 60, 'producción alta con hígado sano pasa de 60');
  await set({ func: 29, prod: 2, dep: 3, cvvh: 0, rifa: 0 }); const rap = await L(); console.log(` umbral rápido (alta + <30 %): amonio ${rap.a} edema=${rap.edema} topes[${await tp()}]`); ok(rap.a > 120 && rap.a <= 150 && rap.edema, 'producción alta + <30 % no adelanta el sello (120)');
  await set({ func: 29, prod: 1, dep: 3 }); const nor = await L(); console.log(` mismo, producción normal: amonio ${nor.a} edema=${nor.edema}`); ok(!nor.edema, 'con producción normal no debería sellar');
  console.log('-- Lactulosa (0 / 2 / 3 / 4 / 6 deposiciones)'); await set({ func: 40, prod: 1, rifa: 0, cvvh: 0 });
  for (const d of [0, 2, 3, 4, 6]) { await set({ dep: d }); console.log(` ${d}/día: amonio ${(await L()).a} PA ${await p.evaluate(() => document.getElementById('hpv-mon-pa').textContent)} topes[${await tp()}] botón6 ${(await p.evaluate(() => document.querySelector('[data-dep="6"]').disabled)) ? 'apagado' : 'activo'}`); }
  ok((await tp()).includes('hipovol:sello') && (await p.evaluate(() => document.getElementById('hpv-mon-pa').textContent)) === '85/50', 'dep 6 sin hipovolemia'); await set({ dep: 4 }); ok((await tp()).includes('diarrea:aviso'), 'dep 4 sin aviso de diarrea');
  console.log('-- Rifaximina y CVVH'); await set({ func: 40, dep: 0 }); await set({ rifa: 1 }); console.log(` rifaximina: amonio ${(await L()).a} topes[${await tp()}]`); ok((await tp()).includes('rifa:aviso'), 'rifa sin aviso de 10 días');
  await set({ rifa: 10 }); ok(!(await tp()).includes('rifa:'), 'rifaximina 10 días aún avisa'); await set({ rifa: 14 }); ok(!(await tp()).includes('rifa:'), 'rifaximina 14 días avisa'); await set({ rifa: 0, cvvh: 1 }); console.log(` CVVH con 40 %: amonio ${(await L()).a} topes[${await tp()}]`); ok((await tp()).includes('cvvh:aviso'), 'CVVH sin «no indicada todavía»');
  await set({ func: 20, cvvh: 0 }); const sinC = (await L()).a; await set({ cvvh: 1 }); const conC = (await L()).a; console.log(` Casimira (20 %): sin CVVH ${sinC} → con CVVH ${conC} topes[${await tp()}]`); ok(conC < sinC && !(await tp()).includes('cvvh:aviso'), 'la CVVH no baja el amonio o avisa con indicación');
  await set({ func: 20, cvvh: 0, dep: 3, rifa: 1 }); const lr = (await L()).a; console.log(` lactulosa 3 + rifaximina: ${lr} (CVVH da ${conC}): ${conC < lr ? 'CVVH gana' : 'NO'}`); ok(conC < lr, 'CVVH no supera a lactulosa + rifaximina');
  await set({ func: 100, prod: 0, dep: 3, rifa: 1, cvvh: 1 }); console.log(` todo al mínimo con hígado sano: amonio ${(await L()).a} topes[${await tp()}]`); ok((await tp()).includes('nofis:aviso'), 'sin aviso de combinación no fisiológica');
  await reset('casimira'); const cas = await L(); console.log(` Casimira: amonio ${cas.a} WH ${cas.wh} topes[${await tp()}]`); ok(cas.a === 165 && cas.wh === 2, 'Casimira no marca 165 y WH 2');
  // ---- guía de Casimira
  console.log('-- Guía de Casimira'); await reset('casimira'); let pasos = 0, focos = [];
  for (let i = 0; i < 6; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('hpv-guia').hidden, foco: document.querySelectorAll('#hpv-svg .foco').length, citas: document.querySelectorAll('#hpv-guia .ver-ficha[data-resaltar^="#ma-"]').length, pdf: document.querySelectorAll('#hpv-guia .cita-pdf').length, haz: !!document.querySelector('#hpv-guia [data-g="haz"]') }));
    if (!g.vis) break; pasos++; focos.push(g.foco); ok(g.foco > 0, `guía paso ${pasos} sin foco`); ok(g.citas === 1 && g.pdf === 1, `guía paso ${pasos} sin cita doble`);
    if (g.haz) { const a0 = (await L()).a; await clic('#hpv-guia [data-g="haz"]'); const a1 = (await L()).a; console.log(` Hazlo CVVH: ${a0} → ${a1}`); ok(a1 < a0, '«Hazlo» no bajó el amonio'); }
    await clic('#hpv-guia [data-g="sig"]'); }
  console.log(` guía: ${pasos} pasos, focos ${focos.join('/')}`); ok(pasos >= 3 && pasos <= 5, `guía de ${pasos} pasos`);
  await reset('casimira'); await clic('#hpv-guia [data-g="sig"]'); await clic('#hpv-guia [data-g="sig"]'); await cap('03-guia-astrocito');
  // ---- apuesta
  console.log('-- Apuesta'); await p.evaluate(() => window.__hpv.modoPrueba('apuesta'));
  const a0 = await p.evaluate(() => ({ mon: document.getElementById('hpv-mon-nh3').textContent, svg: document.getElementById('hpv-svg').textContent.includes('?'), html: document.getElementById('hpv-prueba').innerHTML.includes('data-ok') })); console.log(` antes de contestar: monitor «${a0.mon}», «?» en el dibujo=${a0.svg}`); ok(a0.mon.includes('?') && a0.svg && !a0.html, 'apuesta: cifra visible o respuesta en el HTML');
  const o3 = await p.$$('#hpv-prueba .op'); ok(o3.length === 3, 'apuesta: 3 opciones'); const tx = await Promise.all(o3.map((o) => o.textContent())); await o3[tx.findIndex((t) => t.startsWith('Unos 110'))].click(); await p.waitForTimeout(200);
  const a1 = await L(); console.log(` tras contestar: amonio ${a1.a}, fin=${await p.evaluate(() => document.getElementById('hpv-prueba').dataset.fin)}`); ok(a1.a === 113, 'apuesta: no llega a 113'); ok(await p.evaluate(() => document.querySelectorAll('#hpv-prueba .llevas li').length >= 2), 'apuesta sin «lo que te llevas»'); await desb('apuesta'); await rotulos('apuesta');
  // ---- error
  console.log('-- Error'); await p.evaluate(() => window.__hpv.modoPrueba('error')); const gr = await p.$$('#hpv-prueba .ops'); ok(gr.length === 5, 'error: 5 frases');
  const e0 = await p.evaluate(() => document.getElementById('hpv-svg').textContent.includes('más ácido')); ok(!e0, 'error: se ve «más ácido» antes de contestar');
  ok(ERROR.frases.filter((f) => f.error).length === 1 && ERROR2.frases.filter((f) => f.error).length === 2, 'rondas: 1 error y 2 errores'); ok(ERROR.frases.findIndex((f) => f.error) !== ERROR2.frases.findIndex((f) => f.error) && ERROR.frases.findIndex((f) => f.error) !== 1, 'el error va siempre en 2.ª posición');
  for (let i = 0; i < 5; i++) { const bs = await gr[i].$$('.op'); await bs[ERROR.frases[i].error ? 0 : 1].click(); }
  await p.waitForTimeout(150); const ef = await p.evaluate(() => ({ fin: document.getElementById('hpv-prueba').dataset.fin, ac: document.getElementById('hpv-svg').textContent.includes('más ácido') })); console.log(` error resuelto: fin=${ef.fin}, colon acidificado visible=${ef.ac}, amonio ${(await L()).a}`); ok(ef.fin && ef.ac, 'error sin completar'); await desb('error');
  // ---- Hilario: 2 errores, y el fluido
  console.log('-- Error de Hilario'); await p.evaluate(() => window.__hpv.modoPrueba('hilario')); const gh = await p.$$('#hpv-prueba .ops'); ok(gh.length === 6, 'hilario: 6 frases');
  for (let i = 0; i < 6; i++) { const bs = await gh[i].$$('.op'); await bs[ERROR2.frases[i].error ? 0 : 1].click(); }
  await p.waitForTimeout(150); const eh = await p.evaluate(() => ({ fin: document.getElementById('hpv-prueba').dataset.fin, fl: window.__hpv.s.fl })); console.log(' hilario resuelto:', JSON.stringify(eh)); ok(eh.fin && eh.fl === 'alb', 'hilario sin completar'); await desb('hilario');
  console.log('-- Fluido, TIPS y guías'); await reset('hilario'); const pa0 = await p.evaluate(() => document.getElementById('hpv-mon-pa').textContent);
  for (const f of ['alb', 'sal', 'rl']) { await clic(`[data-fl="${f}"]`); const x = await p.evaluate(() => ({ pa: document.getElementById('hpv-mon-pa').textContent, fc: document.getElementById('hpv-mon-fc').textContent, sw: +window.__hpv.leer().sw.toFixed(2) })); console.log(` ${f}: PA ${pa0} → ${x.pa}, FC ${x.fc}, astrocito ${x.sw}, topes[${await tp()}]`); ok(x.pa !== pa0, `fluido ${f} no cambia la PA`); if (f === 'rl') { ok((await tp()).includes('fl:aviso'), 'RL sin aviso'); await cap('06-rl'); } if (f === 'alb') ok((await tp()).includes('fl:sello'), 'albúmina sin sello 70 %'); }
  await clic('[data-fl="rl"]'); ok(!(await tp()).includes('fl:'), 'quitar el fluido no quita el tope');
  await reset('sano'); const a00 = (await L()).a; ok(await clic('#hpv-b-tips'), 'TIPS no tocable'); const a01 = (await L()).a; console.log(` TIPS: ${a00} → ${a01} topes[${await tp()}]`); ok(a01 > a00 && (await tp()).includes('tips:aviso'), 'TIPS no sube el amonio o sin aviso'); await cap('07-tips'); await clic('#hpv-b-tips');
  for (const [c, n] of [['sano', 3], ['edema', 3], ['casimira', 4]]) { await reset(c); const k = await p.evaluate(() => document.querySelectorAll('#hpv-guia h3').length && /paso 1 de (\d)/.exec(document.querySelector('#hpv-guia h3').textContent)[1]); console.log(` guía ${c}: ${k} pasos`); ok(+k === n, `guía ${c} sin ${n} pasos`); }
  await reset('edema'); const ed = await L(); ok(ed.edema && ed.sw > 0.9, 'preset edema sin astrocito hinchado'); await cap('08-edema');
  const cw = await p.evaluate(() => ({ svg: document.querySelectorAll('#hpv-mon-wh svg.cara-wh').length, t: document.getElementById('hpv-mon-wh').textContent })); console.log(' cara West Haven:', JSON.stringify(cw)); ok(cw.svg === 1 && /ilustrativo/.test(cw.t), 'cara de West Haven sin icono o sin «ilustrativo»');
  // ---- caso
  console.log('-- Caso (Casimira, 4 pasos)'); await p.evaluate(() => window.__hpv.modoPrueba('caso'));
  const bien = [/^Sí, NAC/, null, /^Albúmina/, /^Consulto/]; let pasosC = 0;
  for (let i = 0; i < 4; i++) {
    if (i === 1) { const c = await L(); console.log(` paso 2 antes: amonio ${c.a} WH ${c.wh}`); ok(c.a === 165, 'paso 2 no marca 165'); ok(await clic('#hpv-b-cvvh'), 'CVVH no tocable en el paso 2'); await p.waitForTimeout(100); }
    else { const o = await p.$$(`#hpv-prueba .paso:nth-of-type(${i + 1}) .op`); ok(o.length === 3, `caso paso ${i + 1}: opciones`); const t = await Promise.all(o.map((x) => x.textContent())); await o[t.findIndex((x) => bien[i].test(x))].click(); await p.waitForTimeout(120); }
    const l = await L(); pasosC++;
    if (i === 3) { const e = await p.evaluate(() => ({ ed: window.__hpv.leer().edema, sello: window.__hpv.topes().some((t) => t.clave === 'edema'), pa: document.getElementById('hpv-mon-pa').textContent, fc: document.getElementById('hpv-mon-fc').textContent, hin: !!document.querySelector('#hpv-svg .astro.hincha'), r: +document.querySelector('#hpv-svg .astro').getAttribute('r'), txt: document.querySelector('.tope-sello, [data-tope="edema"]')?.textContent?.includes('la TC manda') })); await p.locator('#hpv-svg').screenshot({ path: `${CAP}04b-paso4-svg-${ANCHO}.png` }); await p.locator('#hpv-monitor').screenshot({ path: `${CAP}04c-paso4-monitor-${ANCHO}.png` }); console.log(' paso 4 edema:', JSON.stringify(e), 'amonio', l.a); ok(e.ed && e.sello && e.hin, 'paso 4: sin edema, sello o astrocito hinchado'); ok(/vasopresor/.test(e.pa) && e.pa.startsWith('104/60') && e.fc === '92', 'paso 4: PA/FC'); ok(l.a <= 150, 'paso 4 debería mandar el estado, no la cifra'); } console.log(` paso ${i + 1}: amonio ${l.a} WH ${l.wh} PA ${await p.evaluate(() => document.getElementById('hpv-mon-pa').textContent)} topes[${await tp()}]`); await desb('caso ' + (i + 1));
    if (i < 3) await p.evaluate(() => [...document.querySelectorAll('#hpv-prueba .b.prim')].at(-1).click());
  }
  ok(await p.evaluate(() => !!document.getElementById('hpv-prueba').dataset.fin), 'caso sin completar'); ok(await p.evaluate(() => !!document.getElementById('hpv-b-filtro')), 'sin botón al filtro vivo'); await cap('04-caso-final');
  // ---- imagen, citas, dock
  const img = await p.evaluate(() => { const i = document.getElementById('hpv-img-tc'); return { w: i.naturalWidth, abierta: document.getElementById('hpv-fig').open }; }); console.log(` Fig. 39.2: naturalWidth ${img.w}, desplegada al final del caso=${img.abierta}`); ok(img.w > 0, 'imagen sin cargar'); ok(img.abierta, 'la figura no se despliega con el edema');
  const cc = await p.evaluate(() => ({ cita: document.querySelectorAll('#hpv-raiz .cita').length, sin: [...document.querySelectorAll('#hpv-raiz .cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length })); console.log(` citas: ${cc.cita}, sin doble botón: ${cc.sin}`); ok(cc.sin === 0, 'cita sin doble botón');
  const interno = await p.evaluate(() => /mar-|§|maqueta|REGLAS|Caso E|b6b|mt-/.test(document.body.innerText)); ok(!interno, 'nombre interno a la vista');
  await reset('sano');
  await clic('#hpv-b-cvvh'); await p.waitForTimeout(250);
  const vis = await p.evaluate(() => { const f = document.getElementById('hpv-frase').getBoundingClientRect(), d = document.getElementById('hpv-dock').getBoundingClientRect(); return { fraseBajoDock: f.bottom > d.bottom + 1, dock: Math.round(d.height), vh: innerHeight }; }); console.log(' dock', vis.dock, 'de', vis.vh, 'px'); ok(vis.dock < vis.vh * 0.5, 'dock tapa media pantalla'); const tf = await p.evaluate(() => document.getElementById('hpv-dock').offsetHeight); console.log(' dock + frase', tf, 'px (la frase va dentro; máx 253 = 30 % de 844)'); ok(tf <= 253, `dock + frase ${tf} px pasa del 30 % de 844`); ok(!vis.fraseBajoDock, 'frase bajo el dock');
  const ids = await p.evaluate(() => { const m = {}; document.querySelectorAll('[id]').forEach((e) => { m[e.id] = (m[e.id] || 0) + 1; }); return Object.keys(m).filter((k) => m[k] > 1); }); ok(!ids.length, 'ids duplicados ' + ids); await rotulos('final'); await desb('final');
  // ======== Vuelta de la app: solape de <text>, barrido preset × mando en extremo, botones de las fichas, tope del monitor ========
  const solapes = () => p.evaluate(() => {
    const sv = document.getElementById('hpv-svg'), T = [...sv.querySelectorAll('text')].map((t) => { const b = t.getBBox(); return { t: t.textContent.trim(), x: b.x, y: b.y, w: b.width, h: b.height }; });
    const gap = (a, b) => Math.max(Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w)), Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h)));
    const o = []; for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) if (gap(T[i], T[j]) < -0.5) o.push(`«${T[i].t}» × «${T[j].t}»`);
    const rect = (q) => { const e = sv.querySelector(q); return e ? e.getBBox() : null; };
    const c = sv.querySelector('.astro'), cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
    for (const t of T) { const dx = Math.max(t.x - cx, 0, cx - (t.x + t.w)), dy = Math.max(t.y - cy, 0, cy - (t.y + t.h)); if (t.t !== '?' && Math.hypot(dx, dy) < r + 0.5) o.push(`«${t.t}» toca el astrocito`); }
    const pu = sv.querySelector('.puente'), L = pu.getTotalLength();
    for (let k = 0; k <= 60; k++) { const q = pu.getPointAtLength(L * k / 60); for (const t of T) if (q.x > t.x - 1 && q.x < t.x + t.w + 1 && q.y > t.y - 1 && q.y < t.y + t.h + 1) { o.push(`línea del TIPS cruza «${t.t}»`); break; } }
    const m = T.find((x) => x.t === 'Mitocondria'), s = T.find((x) => x.t === 'sinusoide'); const gm = m && s ? Math.round(gap(m, s) * 10) / 10 : null;
    return { n: T.length, o: [...new Set(o)], gapMitoSinus: gm };
  });
  const medSol = async (etq) => { const r = await solapes(); console.log(` solapes [${etq}]: ${r.n} rótulos, ${r.o.length} choques${r.o.length ? ' → ' + r.o.join(' | ') : ''}; Mitocondria–sinusoide ${r.gapMitoSinus} px`); ok(!r.o.length, `${ANCHO}: solape de <text> en ${etq}: ${r.o.join(' | ')}`); if (r.gapMitoSinus !== null) ok(r.gapMitoSinus >= 6, `${ANCHO}: «Mitocondria» y «sinusoide» a ${r.gapMitoSinus} px (<6) en ${etq}`); };
  console.log('-- Solape de <text> del SVG');
  for (const c of ['sano', 'casimira', 'edema', 'hilario', 'alta']) { await reset(c); await medSol(c); }
  await reset('alta'); await set({ tips: 1, cvvh: 1, dep: 3, rifa: 12 }); await medSol('alta + TIPS + CVVH + lactulosa + rifaximina');
  await reset('sano'); await p.evaluate(() => window.__hpv.modoPrueba('apuesta')); await medSol('apuesta (cifras ocultas)');
  await reset('casimira'); await set({ fl: 'rl', func: 0 }); await medSol('RL con 0 % (astrocito máximo)');
  // ---- barrido: cada preset × cada mando en extremo ----
  console.log('-- Barrido preset × mando en extremo (cifras de paciente posible)');
  const EXT = [['func 0', { func: 0 }], ['func 100', { func: 100 }], ['prod 0', { prod: 0 }], ['prod 2', { prod: 2 }], ['dep 0', { dep: 0 }], ['dep 6', { dep: 6 }], ['rifa 0', { rifa: 0 }], ['rifa 1', { rifa: 1 }], ['rifa 14', { rifa: 14 }], ['TIPS', { tips: 1 }], ['CVVH', { cvvh: 1 }], ['alb', { fl: 'alb' }], ['sal', { fl: 'sal' }], ['RL', { fl: 'rl' }]];
  let nB = 0, malos = [], sellos = new Set();
  for (const pre of ['sano', 'casimira', 'edema', 'hilario', 'alta']) for (const [n, o] of EXT) {
    await reset(pre); await set(o); nB++;
    const x = await p.evaluate(() => { const l = window.__hpv.leer(), v = window.__hpv.vitales(); const [sy, di] = v.pa.split('/').map(Number); return { a: l.a, sw: l.sw, sy, di, fc: +v.fc, wh: l.wh, mon: document.getElementById('hpv-mon-nh3').textContent, topes: window.__hpv.topes().map((t) => t.clave + ':' + t.nivel).join(' '), des: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    x.topes.split(' ').filter(Boolean).forEach((t) => sellos.add(t));
    const bad = []; if (!(x.a >= 0 && x.a <= 300)) bad.push('NH₃ ' + x.a); if (!(x.sy >= 50 && x.sy <= 220 && x.di >= 30 && x.di <= 130 && x.sy > x.di)) bad.push(`PA ${x.sy}/${x.di}`); if (!(x.fc >= 30 && x.fc <= 200)) bad.push('FC ' + x.fc); if (x.a >= 300 && !x.mon.includes('≥')) bad.push('tope 300 sin «≥»'); if (x.des > 0) bad.push('desborde ' + x.des);
    if (x.a > 150 && !x.topes.includes('edema:sello')) bad.push('NH₃ >150 sin sello de edema');
    if (x.a >= 300 || (pre === 'edema' && n === 'func 0')) console.log(` ${pre} + ${n}: NH₃ ${x.mon} PA ${x.sy}/${x.di} FC ${x.fc} WH ${x.wh} topes[${x.topes}]`);
    if (bad.length) malos.push(`${pre} + ${n}: ${bad.join(', ')}`);
  }
  console.log(` ${nB} combinaciones; sellos/avisos vistos: ${[...sellos].sort().join(' ')}; malas: ${malos.length}`); malos.forEach((m) => ok(false, `${ANCHO}: barrido ${m}`));
  for (const k of ['edema:sello', 'hipovol:sello', 'cvvh:aviso', 'rifa:aviso', 'tips:aviso', 'fl:sello', 'fl:aviso', 'nofis:aviso', 'diarrea:aviso']) if (k !== 'nofis:aviso' && k !== 'diarrea:aviso' && k !== 'hipovol:sello') ok(sellos.has(k), `${ANCHO}: el barrido no vio ${k}`);
  await reset('sano'); await set({ func: 0 }); ok((await p.evaluate(() => document.getElementById('hpv-mon-nh3').textContent)).startsWith('≥300'), 'tope 300 sin «≥» en el monitor');
  // ---- CVVH «no indicada»: también con la condición «y sin edema» ----
  await reset('sano'); await set({ func: 40, cvvh: 1, edema: false }); ok((await tp()).includes('cvvh:aviso'), 'CVVH sin edema y amonio bajo: sin aviso'); await set({ edema: true }); ok(!(await tp()).includes('cvvh:'), 'CVVH con edema: sale el aviso «no indicada»'); ok((await tp()).includes('edema:sello'), 'edema que manda sin sello');
  console.log(' CVVH no indicada: avisa sin edema, calla con edema ✓');
  // ---- vuelta de arreglos: aviso CVVH con 150, preset edema, sello bajo la escena, caso con fallo, apuesta de cifra
  await reset('sano'); await set({ func: 29, prod: 2, dep: 3, cvvh: 1, edema: false }); { const l = await L(); const av = await p.evaluate(() => document.querySelector('.tope-aviso[data-tope="cvvh"]')?.textContent || ''); console.log(` CVVH con ${l.a} sin ella (120-150): aviso «${av.slice(0, 90)}»`); ok(av.includes('no mide la diuresis') && !av.includes('sin oliguria'), 'aviso CVVH sin la frase de diuresis o afirma «sin oliguria»'); ok(!/120/.test(av), 'el aviso CVVH cita 120'); }
  await reset('edema'); const ee0 = await L(); await set({ cvvh: 1 }); const ee1 = await L(); console.log(` edema + CVVH: amonio ${ee0.a} → ${ee1.a}, astrocito ${ee0.sw} → ${ee1.sw}`); ok(ee1.a < ee0.a && ee1.sw >= 0.8, 'edema + CVVH: no baja la cifra o deshincha al instante');
  { const pos = await p.evaluate(() => { const z = document.getElementById('hpv-sello-zona').getBoundingClientRect(), s = document.getElementById('hpv-escena').getBoundingClientRect(), m = document.getElementById('hpv-monitor').getBoundingClientRect(); return { zona: z.top >= s.bottom - 1, mon: m.height, lineas: [...document.querySelectorAll('#hpv-sello-zona .tope-linea')].some((x) => x.offsetParent) }; }); console.log(` sello bajo la escena=${pos.zona}, monitor ${Math.round(pos.mon)} px, franja duplicada=${pos.lineas}`); ok(pos.zona && !pos.lineas && pos.mon < 150, 'el sello no queda bajo la escena, duplica la franja o el monitor crece'); }
  await reset('casimira'); await p.evaluate(() => window.__hpv.modoPrueba('caso')); for (let i = 0; i < 2; i++) { if (i === 1) { await p.evaluate(() => window.__hpv.hacer('cvvh', 1)); } else { const ops = await p.$$('#hpv-prueba .paso:last-of-type .op'); await ops[0].click(); } await clic('#hpv-prueba .paso:last-of-type .b.prim'); }
  { const ops = await p.$$('#hpv-prueba .paso:last-of-type .op'); const tx = await Promise.all(ops.map((o) => o.textContent())); await ops[tx.findIndex((x) => x.startsWith('Ringer lactato'))].click(); await p.waitForTimeout(150); const r = await p.evaluate(() => ({ fl: window.__hpv.s.fl, t: window.__hpv.topes().map((x) => x.clave + ':' + x.nivel).join(' '), pleg: document.querySelectorAll('#hpv-prueba .paso.plegado').length, txt: document.querySelector('#hpv-prueba .paso.plegado')?.textContent || '' })); console.log(` caso, fallo del Ringer: fluido ${r.fl}, topes[${r.t}], pasos plegados ${r.pleg} «${r.txt}»`); ok(r.fl === 'rl' && r.t.includes('fl:aviso') && r.pleg === 2, 'caso: el Ringer no se ve en el modelo o los pasos no se pliegan'); }
  await p.evaluate(() => window.__hpv.modoPrueba('apuesta')); { const en = await p.evaluate(() => document.querySelector('#hpv-prueba .enun').textContent); ok(!/colon sigue|menos depuración|más producción/i.test(en) && /<60|110|300/.test((await p.$$eval('#hpv-prueba .op', (o) => o.map((x) => x.textContent).join('|')))), 'apuesta: pista en el enunciado o no es de cifra'); console.log(' apuesta de cifra sin pista ✓'); }
  await p.evaluate(() => window.__hpv.modoPrueba('explorar'));
  await reset('sano'); await set({ func: 100 }); ok((await tp()) === '', 'sano sin topes'); await set({ rifa: 0 }); ok(!(await tp()).includes('rifa'), 'rifaximina 0 con aviso');
  // ---- los 6 botones de las fichas: abren su estado y VOLVER vuelve ----
  console.log('-- Botones de las fichas');
  const BOT = [['ma-eh-nh3', 'edema', 'ma-encefalopatia-hepatica'], ['ma-eh-amonio', 'casimira', 'ma-encefalopatia-hepatica'], ['ma-eh-lactulosa', 'casimira', 'ma-encefalopatia-hepatica'], ['ma-eh-cvvh', 'edema', 'ma-encefalopatia-hepatica'], ['ma-var-tips', 'sano:tips', 'ma-varices'], ['ma-fha-hemodinamica', 'casimira:rl', 'ma-fallo-hepatico-agudo']];
  for (const [id, est, tab] of BOT) {
    await p.evaluate((tab) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab); await p.waitForTimeout(500);
    const bt = await p.evaluate((id) => { const x = document.querySelector(`#${id} [data-hepatocito-vivo], [data-hepatocito-vivo][id="${id}"]`) || document.getElementById(id)?.querySelector('[data-hepatocito-vivo]'); if (!x) return null; x.click(); return x.dataset.hepatocitoVivo; }, id); await p.waitForTimeout(800);
    const r = await p.evaluate(() => ({ abre: !!document.getElementById('hpv-raiz')?.offsetParent, tips: window.__hpv.s.tips || 0, a: Math.round(window.__hpv.leer().a), func: window.__hpv.s.func, fl: window.__hpv.s.fl, sw: window.__hpv.leer().sw, frase: document.getElementById('hpv-frase-txt').textContent }));
    ok(bt === est && r.abre, `ficha ${id}: su botón (${bt}) abre el hepatocito`); if (est === 'sano:tips') ok(r.tips === 1 && r.a > 60 && r.a < 100 && /pasa de 3\d a /.test(r.frase), `sano:tips: TIPS ${r.tips}, amonio ${r.a}, frase «${r.frase.slice(0, 60)}»`); else ok(r.tips === 0, `${est} con TIPS puesto`); if (est === 'casimira:rl') ok(r.fl === 'rl' && r.sw > 0.4, `casimira:rl: fluido ${r.fl}, hinchazón ${r.sw}`);
    console.log(` #${id} → ${bt}: abre=${r.abre} amonio ${r.a} func ${r.func} TIPS ${r.tips}`); await desb('ficha ' + id);
    await p.evaluate(() => document.getElementById('hpv-volver').click()); await p.waitForTimeout(600);
    ok(await p.evaluate((tab) => !!document.getElementById(tab)?.offsetParent, tab), `ficha ${id}: «← VOLVER» no vuelve a la ficha`);
  }
  // las 4 vías apagadas llevan a su ficha real
  await reset('sano'); for (let i = 0; i < 4; i++) { const h = await p.evaluate((i) => { document.querySelectorAll('#hpv-svg .via-off')[i].dispatchEvent(new MouseEvent('click', { bubbles: true })); const b = document.querySelector('#hpv-frase-txt .ver-ficha'); return b ? b.dataset.resaltar + ' ' + b.dataset.especialidad + '/' + b.dataset.view : null; }, i); ok(h && /^#(ma-fha-paracetamol|mr-cetoacidosis|mar-lactato-aerobio|mt-alcoholes) libros\//.test(h), `vía ${i} sin enlace cruzado real: ${h}`); console.log(` vía ${i}: ${h}`); }
  await p.evaluate(() => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'hepatocitoVivo', hepatocitoVivo: 'casimira' }); document.body.append(x); x.click(); x.remove(); }); await p.waitForTimeout(900);
  const mp = await p.evaluate(() => { const r = document.getElementById('hpv-raiz'); return { dock: document.getElementById('hpv-dock').offsetHeight, vh: innerHeight, min: Math.min(...[...r.querySelectorAll('#hpv-svg text')].map((t) => parseFloat(getComputedStyle(t).fontSize) * document.getElementById('hpv-svg').getBoundingClientRect().width / 360)) }; }); console.log(` dock+frase ${mp.dock}px de ${mp.vh} (${Math.round(100 * mp.dock / mp.vh)} %), rótulo mínimo ${mp.min.toFixed(1)} px`); ok(mp.dock <= 253, `dock+frase ${mp.dock}px > 30 % de 844`); ok(mp.min >= 8, `rótulo de ${mp.min.toFixed(1)} px en pantalla (<8)`);
  await mayeutica({ p, ok, fallos, desb, ANCHO, cap });
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(errores.length ? '❌ Errores de consola: ' + errores.slice(0, 5).join(' | ') : '✅ Consola limpia');
fallos.forEach((f) => console.log('❌ ' + f));
if (!fallos.length) console.log('✅ Hepatocito vivo: todas las comprobaciones en verde (390 y 360 px)');
process.exit(fallos.length || errores.length ? 1 : 0);
