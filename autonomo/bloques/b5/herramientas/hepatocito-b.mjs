// Prueba de la maqueta «hepatocito vivo · B» (390 y 360): desborde, rótulos, cifras de cada mando (mín/medio/máx), topes, guía, apuesta/error/caso, imagen, consola.
// Uso: node hepatocito-b.mjs [ancho]   (lanza su propio servidor en el puerto 8157 y lo cierra por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const { ERROR, ERROR2 } = await import(new URL('../../../maquetas/b5-hepatocito-b/pruebas.js', import.meta.url));
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b5/capturas/hepatocito-b/', PORT = 8157;
const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
  p.on('response', (r) => r.status() >= 400 && errores.push('HTTP ' + r.status() + ' ' + r.url())); p.on('console', (m) => m.type() === 'error' && !m.text().startsWith('Failed to load resource') && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto(`http://127.0.0.1:${PORT}/autonomo/maquetas/b5-hepatocito-b.html`, { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const cap = (n) => p.evaluate(() => scrollTo(0, 0)).then(() => p.screenshot({ path: `${CAP}${n}-${ANCHO}.png` }));
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__hep.leer(); return { a: Math.round(l.a), wh: l.wh, carril: l.carril, edema: l.edema, sw: +l.sw.toFixed(2) }; });
  const tp = () => p.evaluate(() => window.__hep.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const set = (o) => p.evaluate((o) => window.__hep.set(o), o);
  const reset = (c) => p.evaluate((c) => window.__hep.ponerPreset(c), c);
  const clic = (q) => p.evaluate((q) => { const e = document.querySelector(q); if (!e || e.disabled) return false; e.click(); return true; }, q);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('hep-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; }); return { svg: +min.toFixed(1), html: +mh.toFixed(1) }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); return m; };
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio'))); await cap('01-inicio');
  // astrocito visible sin scroll al abrir (preset sano): su círculo y su rótulo dentro de la pantalla y sobre la frase y el dock
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(150);
  const av = await p.evaluate(() => { const a = document.querySelector('#hep-svg .astro').getBoundingClientRect(), f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); return { top: Math.round(a.top), bottom: Math.round(a.bottom), limite: Math.round(Math.min(f.top, d.top)), vh: innerHeight }; }); console.log(' astrocito sin scroll:', JSON.stringify(av)); ok(av.top >= 0 && av.bottom <= av.limite, `astrocito no visible al abrir (${av.top}-${av.bottom}, límite ${av.limite})`); await cap('05-abrir');
  // ---- el carril: opacidad de los 4 pasos según los hepatocitos, y Motion
  const ops = async () => p.evaluate(() => [...document.querySelectorAll('#hep-svg [data-nodo]')].map((g) => g.getAttribute('opacity')).join('/'));
  for (const f of [100, 70, 40, 0]) { await set({ func: f }); console.log(` carril a ${f} %: opacidades ${await ops()}`); }
  await set({ func: 100 }); await p.evaluate(() => document.getElementById('b-replay').click()); await p.waitForTimeout(500); const mid = await p.evaluate(() => +getComputedStyle(document.querySelector('#hep-svg [data-nodo="3"]')).opacity); console.log(' Motion a 0,5 s: opacidad del paso 4 =', mid.toFixed(2)); ok(mid < 0.9, 'Motion no anima el carril (paso 4 ya encendido a 0,5 s)'); await p.waitForTimeout(2800); const fin = await ops(); console.log(' tras «Ver el carril» (Motion):', fin); ok(fin === '1/1/1/1', 'el carril no termina encendido');
  await set({ func: 50 }); ok((await ops()).split('/').filter((x) => +x > 0.9).length === 2, 'func 50 no enciende 2 pasos');
  // ---- vías apagadas
  const via = await p.evaluate(() => { const g = document.querySelectorAll('#hep-svg .via-off'); g[0].dispatchEvent(new MouseEvent('click', { bubbles: true })); return { n: g.length, frase: document.getElementById('frase-txt').textContent, cand: document.querySelectorAll('#hep-svg .cand').length }; });
  console.log(` vías apagadas: ${via.n}, candados ${via.cand}; frase: «${via.frase.slice(0, 80)}»`); ok(via.n === 4 && via.cand === 4 && /apagad|enciende|Aquí no hace nada/.test(via.frase), 'vías con candado');
  // ---- mandos: mínimo / medio / máximo
  console.log('-- Hepatocitos vivos (0 / 50 / 100) con producción normal'); await reset('sano');
  for (const f of [0, 50, 100]) { await set({ func: f, prod: 1, dep: 0, rifa: 0, cvvh: 0 }); const l = await L(); console.log(` ${f} %: amonio ${l.a} WH ${l.wh} astrocito ${l.sw} topes[${await tp()}]`); if (f === 0) { ok((await tp()).includes('edema:sello'), '0 % sin edema'); ok(l.a === 300, '0 % no llega al tope 300'); await cap('02-tope-edema'); const off = await p.evaluate(() => [...document.querySelectorAll('[data-dep], #r-rifa')].every((x) => x.disabled)); ok(off, 'sello edema no apaga lactulosa y rifaximina'); } }
  ok((await L()).a < 60 && (await L()).wh === 0, 'sano no queda <60 y WH 0');
  console.log('-- Producción (baja / normal / alta) con 25 % de hepatocitos');
  for (const pr of [0, 1, 2]) { await set({ func: 25, prod: pr, dep: 0, rifa: 0, cvvh: 0 }); const l = await L(); console.log(` prod ${pr}: amonio ${l.a} topes[${await tp()}]`); }
  await set({ func: 100, prod: 2, dep: 0 }); console.log(` sano + alta: amonio ${(await L()).a} (<60)`); ok((await L()).a < 60, 'producción alta con hígado sano pasa de 60');
  await set({ func: 29, prod: 2, dep: 3, cvvh: 0, rifa: 0 }); const rap = await L(); console.log(` umbral rápido (alta + <30 %): amonio ${rap.a} edema=${rap.edema} topes[${await tp()}]`); ok(rap.a > 120 && rap.a <= 150 && rap.edema, 'producción alta + <30 % no adelanta el sello (120)');
  await set({ func: 29, prod: 1, dep: 3 }); const nor = await L(); console.log(` mismo, producción normal: amonio ${nor.a} edema=${nor.edema}`); ok(!nor.edema, 'con producción normal no debería sellar');
  console.log('-- Lactulosa (0 / 2 / 3 / 4 / 6 deposiciones)'); await set({ func: 40, prod: 1, rifa: 0, cvvh: 0 });
  for (const d of [0, 2, 3, 4, 6]) { await set({ dep: d }); console.log(` ${d}/día: amonio ${(await L()).a} PA ${await p.evaluate(() => document.getElementById('mon-pa').textContent)} topes[${await tp()}] botón6 ${(await p.evaluate(() => document.querySelector('[data-dep="6"]').disabled)) ? 'apagado' : 'activo'}`); }
  ok((await tp()).includes('hipovol:sello') && (await p.evaluate(() => document.getElementById('mon-pa').textContent)) === '85/50', 'dep 6 sin hipovolemia'); await set({ dep: 4 }); ok((await tp()).includes('diarrea:aviso'), 'dep 4 sin aviso de diarrea');
  console.log('-- Rifaximina y CVVH'); await set({ func: 40, dep: 0 }); await set({ rifa: 1 }); console.log(` rifaximina: amonio ${(await L()).a} topes[${await tp()}]`); ok((await tp()).includes('rifa:aviso'), 'rifa sin aviso de 10 días');
  await set({ rifa: 10 }); ok(!(await tp()).includes('rifa:'), 'rifaximina 10 días aún avisa'); await set({ rifa: 14 }); ok(!(await tp()).includes('rifa:'), 'rifaximina 14 días avisa'); await set({ rifa: 0, cvvh: 1 }); console.log(` CVVH con 40 %: amonio ${(await L()).a} topes[${await tp()}]`); ok((await tp()).includes('cvvh:aviso'), 'CVVH sin «no indicada todavía»');
  await set({ func: 20, cvvh: 0 }); const sinC = (await L()).a; await set({ cvvh: 1 }); const conC = (await L()).a; console.log(` Casimira (20 %): sin CVVH ${sinC} → con CVVH ${conC} topes[${await tp()}]`); ok(conC < sinC && !(await tp()).includes('cvvh:aviso'), 'la CVVH no baja el amonio o avisa con indicación');
  await set({ func: 20, cvvh: 0, dep: 3, rifa: 1 }); const lr = (await L()).a; console.log(` lactulosa 3 + rifaximina: ${lr} (CVVH da ${conC}): ${conC < lr ? 'CVVH gana' : 'NO'}`); ok(conC < lr, 'CVVH no supera a lactulosa + rifaximina');
  await set({ func: 100, prod: 0, dep: 3, rifa: 1, cvvh: 1 }); console.log(` todo al mínimo con hígado sano: amonio ${(await L()).a} topes[${await tp()}]`); ok((await tp()).includes('nofis:aviso'), 'sin aviso de combinación no fisiológica');
  await reset('casimira'); const cas = await L(); console.log(` Casimira: amonio ${cas.a} WH ${cas.wh} topes[${await tp()}]`); ok(cas.a === 165 && cas.wh === 2, 'Casimira no marca 165 y WH 2');
  // ---- guía de Casimira
  console.log('-- Guía de Casimira'); await reset('casimira'); let pasos = 0, focos = [];
  for (let i = 0; i < 6; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('guia').hidden, foco: document.querySelectorAll('#hep-svg .foco').length, citas: document.querySelectorAll('#guia .ver-ficha[data-resaltar^="#ma-"]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') }));
    if (!g.vis) break; pasos++; focos.push(g.foco); ok(g.foco > 0, `guía paso ${pasos} sin foco`); ok(g.citas === 1 && g.pdf === 1, `guía paso ${pasos} sin cita doble`);
    if (g.haz) { const a0 = (await L()).a; await clic('#guia [data-g="haz"]'); const a1 = (await L()).a; console.log(` Hazlo CVVH: ${a0} → ${a1}`); ok(a1 < a0, '«Hazlo» no bajó el amonio'); }
    await clic('#guia [data-g="sig"]'); }
  console.log(` guía: ${pasos} pasos, focos ${focos.join('/')}`); ok(pasos >= 3 && pasos <= 5, `guía de ${pasos} pasos`);
  await reset('casimira'); await clic('#guia [data-g="sig"]'); await clic('#guia [data-g="sig"]'); await cap('03-guia-astrocito');
  // ---- apuesta
  console.log('-- Apuesta'); await p.evaluate(() => window.__hep.modoPrueba('apuesta'));
  const a0 = await p.evaluate(() => ({ mon: document.getElementById('mon-nh3').textContent, svg: document.getElementById('hep-svg').textContent.includes('?'), html: document.getElementById('prueba').innerHTML.includes('data-ok') })); console.log(` antes de contestar: monitor «${a0.mon}», «?» en el dibujo=${a0.svg}`); ok(a0.mon.includes('?') && a0.svg && !a0.html, 'apuesta: cifra visible o respuesta en el HTML');
  const o3 = await p.$$('#prueba .op'); ok(o3.length === 3, 'apuesta: 3 opciones'); const tx = await Promise.all(o3.map((o) => o.textContent())); await o3[tx.findIndex((t) => t.startsWith('Por menos'))].click(); await p.waitForTimeout(200);
  const a1 = await L(); console.log(` tras contestar: amonio ${a1.a}, fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)}`); ok(a1.a === 113, 'apuesta: no llega a 113'); ok(await p.evaluate(() => document.querySelectorAll('#prueba .llevas li').length >= 2), 'apuesta sin «lo que te llevas»'); await desb('apuesta'); await rotulos('apuesta');
  // ---- error
  console.log('-- Error'); await p.evaluate(() => window.__hep.modoPrueba('error')); const gr = await p.$$('#prueba .ops'); ok(gr.length === 5, 'error: 5 frases');
  const e0 = await p.evaluate(() => document.getElementById('hep-svg').textContent.includes('más ácido')); ok(!e0, 'error: se ve «más ácido» antes de contestar');
  ok(ERROR.frases.filter((f) => f.error).length === 1 && ERROR2.frases.filter((f) => f.error).length === 2, 'rondas: 1 error y 2 errores'); ok(ERROR.frases.findIndex((f) => f.error) !== ERROR2.frases.findIndex((f) => f.error) && ERROR.frases.findIndex((f) => f.error) !== 1, 'el error va siempre en 2.ª posición');
  for (let i = 0; i < 5; i++) { const bs = await gr[i].$$('.op'); await bs[ERROR.frases[i].error ? 0 : 1].click(); }
  await p.waitForTimeout(150); const ef = await p.evaluate(() => ({ fin: document.getElementById('prueba').dataset.fin, ac: document.getElementById('hep-svg').textContent.includes('más ácido') })); console.log(` error resuelto: fin=${ef.fin}, colon acidificado visible=${ef.ac}, amonio ${(await L()).a}`); ok(ef.fin && ef.ac, 'error sin completar'); await desb('error');
  // ---- Hilario: 2 errores, y el fluido
  console.log('-- Error de Hilario'); await p.evaluate(() => window.__hep.modoPrueba('hilario')); const gh = await p.$$('#prueba .ops'); ok(gh.length === 6, 'hilario: 6 frases');
  for (let i = 0; i < 6; i++) { const bs = await gh[i].$$('.op'); await bs[ERROR2.frases[i].error ? 0 : 1].click(); }
  await p.waitForTimeout(150); const eh = await p.evaluate(() => ({ fin: document.getElementById('prueba').dataset.fin, fl: window.__hep.s.fl })); console.log(' hilario resuelto:', JSON.stringify(eh)); ok(eh.fin && eh.fl === 'alb', 'hilario sin completar'); await desb('hilario');
  console.log('-- Fluido, TIPS y guías'); await reset('hilario'); const pa0 = await p.evaluate(() => document.getElementById('mon-pa').textContent);
  for (const f of ['alb', 'sal', 'rl']) { await clic(`[data-fl="${f}"]`); const x = await p.evaluate(() => ({ pa: document.getElementById('mon-pa').textContent, fc: document.getElementById('mon-fc').textContent, sw: +window.__hep.leer().sw.toFixed(2) })); console.log(` ${f}: PA ${pa0} → ${x.pa}, FC ${x.fc}, astrocito ${x.sw}, topes[${await tp()}]`); ok(x.pa !== pa0, `fluido ${f} no cambia la PA`); if (f === 'rl') { ok((await tp()).includes('fl:aviso'), 'RL sin aviso'); await cap('06-rl'); } if (f === 'alb') ok((await tp()).includes('fl:sello'), 'albúmina sin sello 70 %'); }
  await clic('[data-fl="rl"]'); ok(!(await tp()).includes('fl:'), 'quitar el fluido no quita el tope');
  await reset('sano'); const a00 = (await L()).a; ok(await clic('#b-tips'), 'TIPS no tocable'); const a01 = (await L()).a; console.log(` TIPS: ${a00} → ${a01} topes[${await tp()}]`); ok(a01 > a00 && (await tp()).includes('tips:aviso'), 'TIPS no sube el amonio o sin aviso'); await cap('07-tips'); await clic('#b-tips');
  for (const [c, n] of [['sano', 3], ['edema', 3], ['casimira', 4]]) { await reset(c); const k = await p.evaluate(() => document.querySelectorAll('#guia h3').length && /paso 1 de (\d)/.exec(document.querySelector('#guia h3').textContent)[1]); console.log(` guía ${c}: ${k} pasos`); ok(+k === n, `guía ${c} sin ${n} pasos`); }
  await reset('edema'); const ed = await L(); ok(ed.edema && ed.sw > 0.9, 'preset edema sin astrocito hinchado'); await cap('08-edema');
  const cw = await p.evaluate(() => ({ svg: document.querySelectorAll('#mon-wh svg.cara-wh').length, t: document.getElementById('mon-wh').textContent })); console.log(' cara West Haven:', JSON.stringify(cw)); ok(cw.svg === 1 && /ilustrativo/.test(cw.t), 'cara de West Haven sin icono o sin «ilustrativo»');
  // ---- caso
  console.log('-- Caso (Casimira, 4 pasos)'); await p.evaluate(() => window.__hep.modoPrueba('caso'));
  const bien = [/^Sí, NAC/, null, /^Albúmina/, /^Consulto/]; let pasosC = 0;
  for (let i = 0; i < 4; i++) {
    if (i === 1) { const c = await L(); console.log(` paso 2 antes: amonio ${c.a} WH ${c.wh}`); ok(c.a === 165, 'paso 2 no marca 165'); ok(await clic('#b-cvvh'), 'CVVH no tocable en el paso 2'); await p.waitForTimeout(100); }
    else { const o = await p.$$(`#prueba .paso:nth-of-type(${i + 1}) .op`); ok(o.length === 3, `caso paso ${i + 1}: opciones`); const t = await Promise.all(o.map((x) => x.textContent())); await o[t.findIndex((x) => bien[i].test(x))].click(); await p.waitForTimeout(120); }
    const l = await L(); pasosC++;
    if (i === 3) { const e = await p.evaluate(() => ({ ed: window.__hep.leer().edema, sello: window.__hep.topes().some((t) => t.clave === 'edema'), pa: document.getElementById('mon-pa').textContent, fc: document.getElementById('mon-fc').textContent, hin: !!document.querySelector('#hep-svg .astro.hincha'), r: +document.querySelector('#hep-svg .astro').getAttribute('r'), txt: document.querySelector('.tope-sello, [data-tope="edema"]')?.textContent?.includes('la TC manda') })); await p.locator('#hep-svg').screenshot({ path: `${CAP}04b-paso4-svg-${ANCHO}.png` }); await p.locator('#monitor').screenshot({ path: `${CAP}04c-paso4-monitor-${ANCHO}.png` }); console.log(' paso 4 edema:', JSON.stringify(e), 'amonio', l.a); ok(e.ed && e.sello && e.hin, 'paso 4: sin edema, sello o astrocito hinchado'); ok(/noradrenalina/.test(e.pa) && e.pa.startsWith('104/60') && e.fc === '92', 'paso 4: PA/FC'); ok(l.a <= 150, 'paso 4 debería mandar el estado, no la cifra'); } console.log(` paso ${i + 1}: amonio ${l.a} WH ${l.wh} PA ${await p.evaluate(() => document.getElementById('mon-pa').textContent)} topes[${await tp()}]`); await desb('caso ' + (i + 1));
    if (i < 3) await p.evaluate(() => [...document.querySelectorAll('#prueba .b.prim')].at(-1).click());
  }
  ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'caso sin completar'); ok(await p.evaluate(() => !!document.getElementById('b-filtro')), 'sin botón al filtro vivo'); await cap('04-caso-final');
  // ---- imagen, citas, dock
  const img = await p.evaluate(() => { const i = document.getElementById('img-tc'); return { w: i.naturalWidth, abierta: document.getElementById('fig').open }; }); console.log(` Fig. 39.2: naturalWidth ${img.w}, desplegada al final del caso=${img.abierta}`); ok(img.w > 0, 'imagen sin cargar'); ok(img.abierta, 'la figura no se despliega con el edema');
  const cc = await p.evaluate(() => ({ cita: document.querySelectorAll('.cita').length, sin: [...document.querySelectorAll('.cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length })); console.log(` citas: ${cc.cita}, sin doble botón: ${cc.sin}`); ok(cc.sin === 0, 'cita sin doble botón');
  const interno = await p.evaluate(() => /mar-|§|maqueta|REGLAS|Caso E|b6b|mt-/.test(document.body.innerText)); ok(!interno, 'nombre interno a la vista');
  await reset('sano');
  await clic('#b-cvvh'); await p.waitForTimeout(250);
  const vis = await p.evaluate(() => { const f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); return { fraseBajoDock: f.bottom > d.top + 1, dock: Math.round(d.height), vh: innerHeight }; }); console.log(' dock', vis.dock, 'de', vis.vh, 'px'); ok(vis.dock < vis.vh * 0.5, 'dock tapa media pantalla'); const tf = await p.evaluate(() => document.getElementById('dock').offsetHeight + document.getElementById('frase').offsetHeight); console.log(' dock + frase', tf, 'px (máx 267)'); ok(tf <= 270, `dock + frase ${tf} px pasa de ⅓ de 800`); ok(!vis.fraseBajoDock, 'frase bajo el dock');
  const ids = await p.evaluate(() => { const m = {}; document.querySelectorAll('[id]').forEach((e) => { m[e.id] = (m[e.id] || 0) + 1; }); return Object.keys(m).filter((k) => m[k] > 1); }); ok(!ids.length, 'ids duplicados ' + ids); await rotulos('final'); await desb('final');
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); try { process.kill(pid); } catch {} }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(fallos.length ? 'FALLOS:\n- ' + fallos.join('\n- ') : 'TODO EN VERDE');
