// Prueba de la maqueta «hepatocito A · El sinusoide» (390 y 360): desborde, rótulos, mandos mín/medio/máx, topes, guía, apuesta/error/caso, figuras, consola.
// Uso: node hepatocito-a.mjs [ancho]   (lanza su propio servidor en el puerto 8151 y lo cierra por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b5/capturas/hepatocito-a/';
const srv = spawn('python3', ['-m', 'http.server', '8151'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8151/autonomo/maquetas/b5-hepatocito-a.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__hep.leer(); return { nh3: Math.round(l.nh3), wh: l.wh, hin: l.hinchado, pa: l.pa.join('/'), fc: l.fc, cel: l.celulas }; });
  const tp = () => p.evaluate(() => window.__hep.topes().map((t) => t.c + ':' + t.n).sort().join(' '));
  const sellos = () => p.evaluate(() => [...document.querySelectorAll('.tope-sello')].filter((e) => !e.hidden).length);
  const clic = (id) => p.evaluate((id) => { const e = document.getElementById(id); if (e.disabled) return false; e.click(); return true; }, id);
  const rango = (id, v) => p.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
  const preset = (c) => p.evaluate((c) => { window.__hep.modoPrueba('explorar'); window.__hep.ponerPreset(c); }, c);
  const dis = (id) => p.evaluate((id) => document.getElementById(id).disabled, id);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('hep-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; const tx = [...sv.querySelectorAll('text')]; tx.forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; });
    let pisa = []; const bb = tx.map((x) => ({ t: x.textContent, r: x.getBBox() })).filter((o) => o.t.trim()); for (let i = 0; i < bb.length; i++) for (let j = i + 1; j < bb.length; j++) { const a = bb[i].r, c = bb[j].r; if (a.x < c.x + c.width - 1 && c.x < a.x + a.width - 1 && a.y < c.y + c.height - 1 && c.y < a.y + a.height - 1) pisa.push(bb[i].t + ' × ' + bb[j].t); }
    let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; });
    return { svg: +min.toFixed(1), html: +mh.toFixed(1), pisa }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); ok(m.pisa.length === 0, `${ANCHO}: rótulos que se pisan en ${t}: ${m.pisa.join('; ')}`); return m; };
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio'))); console.log('inicio:', JSON.stringify(await L()), 'topes[' + await tp() + ']');
  if (ANCHO === 390) await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  // ---- mandos: mínimo / medio / máximo ----
  console.log('-- Hepatocitos (100 / 50 / 0 %)');
  for (const v of [100, 50, 20, 0]) { await preset('normal'); await rango('m-fn', v); console.log(` ${v} %: ${JSON.stringify(await L())} sellos ${await sellos()} topes[${await tp()}] lactulosa+ ${(await dis('m-dep-mas')) ? 'apagada' : 'activa'} rifaximina ${(await dis('m-rif')) ? 'apagada' : 'activa'}`); await desb('fn ' + v); await rotulos('fn ' + v); }
  ok((await tp()).includes('edema:sello') && (await sellos()) >= 1, 'fn 0 sin sello de edema'); ok(await dis('m-dep-mas') && await dis('m-rif'), 'edema: lactulosa y rifaximina siguen tocables'); ok((await L()).nh3 <= 300 && (await L()).nh3 > 150, 'fn 0: amonio fuera de 150-300');
  if (ANCHO === 390) await p.screenshot({ path: `${CAP}02-sello-edema-${ANCHO}.png`, fullPage: true });
  await clic('m-cvvh'); console.log(` fn 0 + CVVH: ${JSON.stringify(await L())} topes[${await tp()}] sellos ${await sellos()}`); ok((await L()).nh3 < 150 && !(await tp()).includes('edema'), 'fn 0 + CVVH no baja de 150'); ok(!(await dis('m-rif')), 'CVVH no vuelve a encender la rifaximina');
  console.log('-- Lactulosa (0..6 deposiciones)'); await preset('normal');
  for (let i = 0; i <= 6; i++) { console.log(` ${i} dep: ${JSON.stringify(await L())} sellos ${await sellos()} topes[${await tp()}] «+» ${(await dis('m-dep-mas')) ? 'apagado' : 'activo'}`); if (i < 6) await clic('m-dep-mas'); }
  ok((await tp()).includes('hipovol:sello') && await dis('m-dep-mas'), '6 dep sin sello de hipovolemia o botón vivo'); ok((await L()).pa === '91/54', 'PA a 6 dep: ' + (await L()).pa);
  await clic('m-dep-menos'); await clic('m-dep-menos'); ok((await tp()).includes('diarrea:aviso'), '4 dep sin aviso de diarrea');
  console.log('-- Rifaximina'); await preset('casimira'); const r0 = (await L()).nh3; console.log(` Casimira sin tratar: ${JSON.stringify(await L())} topes[${await tp()}]`);
  await preset('normal'); await rango('m-fn', 40); await clic('m-rif'); await rango('m-rifd', 5); console.log(` rif 5 d: topes[${await tp()}]`); ok((await tp()).includes('rif:aviso'), 'rif <10 d sin aviso'); await rango('m-rifd', 10); ok(!(await tp()).includes('rif:'), 'rif 10 d aún con aviso'); await rango('m-rifd', 14); console.log(` rif 14 d: ${JSON.stringify(await L())}`);
  console.log('-- CVVH y TIPS'); await preset('normal'); await clic('m-cvvh'); console.log(` CVVH con hígado sano: topes[${await tp()}]`); ok((await tp()).includes('cvvh-no:aviso'), 'CVVH sin indicación sin aviso'); await clic('m-cvvh');
  const t0 = (await L()).nh3; await clic('m-tips'); const t1 = (await L()).nh3; console.log(` TIPS: amonio ${t0} → ${t1} topes[${await tp()}]`); ok(t1 > t0 && (await tp()).includes('tips:aviso'), 'TIPS no sube el amonio o sin aviso'); await p.evaluate(() => window.__hep.set({ fn: 0 })); console.log(` TIPS + fn 0: ${JSON.stringify(await L())} topes[${await tp()}]`);
  await preset('casimira'); console.log(` Casimira: ${JSON.stringify(await L())} topes[${await tp()}]`); ok((await L()).nh3 === 165 && (await L()).wh === 2, 'Casimira no da 165 / WH 2'); ok((await tp()).includes('cvvh-ya:aviso'), 'Casimira sin aviso CVVH indicada'); await clic('m-cvvh'); console.log(` Casimira + CVVH: ${JSON.stringify(await L())}`); ok((await L()).nh3 < r0, 'CVVH no baja el amonio de Casimira');
  // ---- guía ----
  console.log('-- Guía'); await preset('normal'); await clic('btn-guia');
  for (let i = 0; i < 5; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('guia').hidden, foco: document.querySelectorAll('#hep-svg .foco').length, cita: document.querySelectorAll('#guia .ver-ficha[data-resaltar]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') }));
    ok(g.vis && g.foco === 1 && g.cita === 1 && g.pdf === 1, `guía paso ${i + 1}: foco ${g.foco} cita ${g.cita}`); if (g.haz) { const a = JSON.stringify(await L()); await p.evaluate(() => document.querySelector('#guia [data-g="haz"]').click()); ok(a !== JSON.stringify(await L()), `guía paso ${i + 1}: «Hazlo» no cambió nada`); } await p.evaluate(() => document.querySelector('#guia [data-g="sig"]').click()); }
  ok(await p.evaluate(() => document.getElementById('guia').hidden), 'guía no se cierra'); console.log(' guía: 5 pasos con foco y cita doble');
  // ---- figuras ----
  await p.evaluate(() => { document.getElementById('fig392').open = true; document.getElementById('fig393').open = true; }); await p.waitForTimeout(500);
  const im = await p.evaluate(() => ['img392', 'img393'].map((i) => document.getElementById(i).naturalWidth)); console.log(' imágenes naturalWidth:', im.join(', ')); ok(im.every((n) => n > 0), 'imagen sin cargar');
  // ---- apuesta, error, caso ----
  console.log('-- Apuesta'); await p.evaluate(() => window.__hep.modoPrueba('apuesta')); ok(!(await p.evaluate(() => document.getElementById('prueba').innerHTML.includes('data-ok'))), 'respuesta en el HTML');
  const a0 = (await L()).nh3; const ops = await p.$$('#prueba .op'); ok(ops.length === 3, 'apuesta: 3 opciones'); const tx = await Promise.all(ops.map((o) => o.textContent())); const iok = tx.findIndex((t) => t.startsWith('CVVH')); await ops[iok].click();
  console.log(` amonio ${a0} → ${(await L()).nh3}; fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)}; llevas ${await p.evaluate(() => document.querySelectorAll('#prueba .llevas li').length)}`); ok((await L()).nh3 < a0, 'apuesta: no baja'); await desb('apuesta'); await rotulos('apuesta');
  console.log('-- Error'); await p.evaluate(() => window.__hep.modoPrueba('error')); const gr = await p.$$('#prueba .ops'); ok(gr.length === 4, 'error: 4 frases'); const mal = [0, 1, 1, 0]; for (let i = 0; i < 4; i++) { const bs = await gr[i].$$('.op'); await bs[mal[i]].click(); }
  console.log(` fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)} aciertos ${await p.evaluate(() => document.querySelectorAll('#prueba .por.ok').length)}/4`); ok(await p.evaluate(() => document.querySelectorAll('#prueba .por.ok').length === 4), 'error: no se corrigen las 4'); await desb('error');
  console.log('-- Caso (Casimira, 4 pasos)'); await p.evaluate(() => window.__hep.modoPrueba('caso')); const bien = [0, 1, 2, 0];
  for (let i = 0; i < 4; i++) { const o = await p.$$('#prueba .paso .op'); ok(o.length === 3, `caso paso ${i + 1}: opciones`); await o[bien[i]].click(); await p.waitForTimeout(100); const l = await L(); console.log(` paso ${i + 1}: ${JSON.stringify(l)} topes[${await tp()}]`); await desb('caso ' + (i + 1)); await rotulos('caso ' + (i + 1)); if (i < 3) await p.evaluate(() => [...document.querySelectorAll('#prueba .b.prim')].at(-1).click()); }
  ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'caso sin completar'); if (ANCHO === 390) { await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}03-caso-paso4-${ANCHO}.png`, fullPage: true }); }
  // citas: todas con doble botón
  const cc = await p.evaluate(() => [...document.querySelectorAll('.cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length); ok(cc === 0, 'cita sin doble botón');
  // frase y dock
  await preset('casimira'); await p.evaluate(() => scrollTo(0, 0)); await clic('m-cvvh'); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => { const f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); return { fraseBajoDock: f.bottom > d.top + 1, dock: Math.round(d.height), vh: innerHeight }; }); console.log(' dock', vis.dock, 'de', vis.vh, 'px'); ok(vis.dock < vis.vh * 0.5, 'dock tapa media pantalla'); ok(!vis.fraseBajoDock, 'frase bajo el dock');
  if (ANCHO === 390) await p.screenshot({ path: `${CAP}04-mandos-${ANCHO}.png` });
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); try { process.kill(pid); } catch {} }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(fallos.length ? 'FALLOS:\n- ' + fallos.join('\n- ') : 'TODO EN VERDE');
