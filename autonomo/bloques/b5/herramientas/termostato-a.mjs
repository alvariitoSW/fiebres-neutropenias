// Prueba de la maqueta «termostato A · El termostato de pared» (390 y 360): desborde, rótulos, altura del dock, cifras de cada mando (mín/medio/máx), topes, apuesta/error/caso, imágenes, consola.
// Uso: node termostato-a.mjs [ancho]  (lanza su servidor en el puerto 8175 y lo cierra por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b5/capturas/termostato-a/';
const srv = spawn('python3', ['-m', 'http.server', '8175'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 })).newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8175/autonomo/maquetas/b5-termostato-a.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const lee = () => p.evaluate(() => { const L = window.__t.leer(), s = window.__t.s; return `real ${L.t.toFixed(1)} ajuste ${L.aj.toFixed(1)} ${L.estado} FC ${L.fc} esc ${L.tirita ? 'sí' : 'no'} sudor ${L.sudor ? 'sí' : 'no'} CK ${s.ck}`; });
  const tp = () => p.evaluate(() => window.__t.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const H = (a, v) => p.evaluate(([a, v]) => window.__t.hacer(a, v), [a, v]);
  const reset = (c) => p.evaluate((c) => window.__t.ponerPreset(c), c);
  const horas = async (n) => { for (let i = 0; i < n; i++) await H('hora'); };
  const clic = (q) => p.evaluate((q) => { const e = document.querySelector(q); if (!e || e.disabled) return false; e.click(); return true; }, q);
  const off = (q) => p.evaluate((q) => { const e = document.querySelector(q); return !!e && e.disabled; }, q);
  const rotulos = async () => p.evaluate(() => { const sv = document.getElementById('esc'), esc = sv.getBoundingClientRect().width / 360; let min = 99; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); return +min.toFixed(1); });
  await desb('inicio'); const r0 = await rotulos(); console.log('rótulo mínimo en pantalla', r0, 'px'); ok(r0 >= 8, `rótulo ${r0}px <8`);
  // altura del dock + frase (en cada pestaña) ≤ un tercio de 800 px
  for (const t of ['dar', 'tratar', 'medir']) { await clic(`[data-pest="${t}"]`); const h = await p.evaluate(() => Math.round(document.getElementById('dock').getBoundingClientRect().height + document.getElementById('frase').getBoundingClientRect().height)); console.log(` dock + frase, pestaña ${t}: ${h} px (tope 267)`); ok(h <= 267, `dock+frase ${h}px en ${t} >267`); }
  await clic('[data-pest="dar"]'); await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  console.log('-- Pirógeno Sin / 38,3 / 39,4 / >39,4 (3 h)'); for (const v of [0, 1, 2, 3]) { await reset('reposo'); await H('pir', v); await horas(3); console.log(` ${v}: ${await lee()} [${await tp()}]`); }
  ok((await tp()).includes('pir:aviso'), 'pirógeno >39,4 sin aviso de la Fig. 44.5');
  console.log('-- Carga de calor Sin / ambiente / esfuerzo / fármaco (4 h)'); for (const v of [0, 1, 2, 3]) { await reset('reposo'); await H('calor', v); await horas(4); console.log(` ${v}: ${await lee()} [${await tp()}]`); }
  await reset('reposo'); await H('calor', 2); await horas(3); ok((await tp()).includes('golpe:sello'), 'esfuerzo 3 h sin sello Golpe de calor'); await p.screenshot({ path: `${CAP}02-golpe-${ANCHO}.png` });
  await horas(3); const tt = await tp(); ok(tt.includes('tmax:sello') && await off('[data-calor="2"]') && await off('#b-hora'), 'tope 42 °C sin sello o sin apagar mandos'); console.log(` 6 h de esfuerzo: ${await lee()} [${tt}] mandos de calor apagados: ${await off('[data-calor="2"]')}`);
  console.log('-- Carga de frío Sin / aire / agua <15 / alcohol (4 h)'); for (const v of [0, 1, 2, 3]) { await reset('reposo'); await H('frio', v); await horas(4); console.log(` ${v}: ${await lee()} [${await tp()}]`); }
  await reset('reposo'); await H('frio', 2); await horas(4); const tf = await tp(); console.log(` agua 4 h: ${await lee()} [${tf}]`); ok(tf.includes('fria:sello') && await off('[data-frio="2"]'), 'hipotermia <24 sin sello o mandos de frío no apagados'); await p.screenshot({ path: `${CAP}03-hipotermia-${ANCHO}.png` });
  const osb = await p.evaluate(() => { const i = document.querySelector('#fig-osborn img'); return [!document.getElementById('fig-osborn').hidden, i.complete && i.naturalWidth]; }); console.log(' Osborn visible y naturalWidth:', osb.join(' / ')); ok(osb[0] && osb[1] > 0, 'Osborn no visible o no carga');
  await reset('dorotea'); const ns = await p.evaluate(() => { const i = document.querySelector('#fig-sepsis img'); return [!document.getElementById('fig-sepsis').hidden, i.complete && i.naturalWidth]; }); console.log(' Fig. 44.5 (Dorotea) visible y naturalWidth:', ns.join(' / ')); ok(ns[0] && ns[1] > 0, 'Fig. 44.5 no visible o no carga');
  console.log('-- Antipirético: en reposo (hipertermia), en fiebre, y 4 g'); await reset('reposo'); await clic('#b-ibu'); console.log(` reposo + ibuprofeno: ${await lee()} [${await tp()}]`); ok((await tp()).includes('sin:sello') && await off('#b-para'), 'antipirético con dial 37 sin sello/apagado');
  await reset('dorotea'); await clic('#b-para'); console.log(` Dorotea + paracetamol: ${await lee()} [${await tp()}]`); await horas(1); console.log(`   +1 h: ${await lee()}`);
  for (let i = 0; i < 3; i++) await clic('#b-para'); const pt = await tp(); console.log(` 4 g: [${pt}] botón apagado: ${await off('#b-para')}`); ok(pt.includes('para:sello') && await off('#b-para'), 'paracetamol >3 g sin sello/apagado');
  console.log('-- Enfriar (Ovidio 39,6; fiebre con manta; por debajo de 38)');
  for (const k of ['evap', 'inm', 'hielo', 'sal', 'manta']) { await reset('ovidio'); await clic(`[data-enf="${k}"]`); console.log(` ${k}: ${await lee()} [${await tp()}]`); }
  await reset('ovidio'); for (let i = 0; i < 3; i++) await clic('[data-enf="evap"]'); console.log(` evaporativo ×3: ${await lee()} [${await tp()}]`); ok((await tp()).includes('parar:aviso'), 'enfriar bajo 38 sin aviso'); const r1 = await p.evaluate(() => window.__t.s.real); await clic('[data-enf="evap"]'); ok(await p.evaluate((r) => window.__t.s.real > r, r1), 'escalofrío no sube la T al enfriar de más'); console.log(` otra tanda bajo 38: ${await lee()}`);
  await reset('dorotea'); await clic('[data-enf="manta"]'); const tm = await tp(); console.log(` Dorotea + manta: ${await lee()} [${tm}] manta apagada: ${await off('[data-enf="manta"]')}`); ok(tm.includes('manta:sello') && await off('[data-enf="manta"]'), 'manta con fiebre sin sello/apagado');
  console.log('-- Recalentar (Honorato 35,5 y muy frío 26)');
  for (const k of ['pasivo', 'activo', 'gases', 'fcal', 'f21', 'ecmo']) { await reset('honorato'); await p.evaluate(() => window.__t.set({ real: 30 })); await clic(`[data-rec="${k}"]`); console.log(` ${k}: ${await lee()} [${await tp()}]`); if (k === 'gases') ok(/real 32\.5/.test(await lee()), 'gases no suben 2,5 °C'); if (k === 'f21') ok((await tp()).includes('f21:aviso'), 'fluido 21 °C sin aviso'); }
  await reset('honorato'); await p.evaluate(() => window.__t.set({ real: 27 })); console.log(` 27 °C: ${await lee()} [${await tp()}]`); ok((await tp()).includes('fv:aviso'), '<28 sin aviso FV'); await p.evaluate(() => window.__t.set({ real: 31 })); console.log(` 31 °C: ${await lee()} [${await tp()}]`); ok((await tp()).includes('bradi:aviso'), '<32 sin bradicardia');
  await reset('honorato'); await H('calor', 1); await H('frio', 2); ok((await tp()).includes('comb:aviso'), 'calor+frío sin «combinación no fisiológica»');
  // los botones del dock son los mismos nodos tras repintar
  await reset('reposo'); await p.evaluate(() => { window.__b = document.getElementById('b-para'); window.__c = document.querySelector('[data-calor="1"]'); }); await clic('[data-calor="1"]'); await horas(2); ok(await p.evaluate(() => window.__b === document.getElementById('b-para') && window.__c === document.querySelector('[data-calor="1"]')), 'botones del dock rehechos');
  console.log('-- Apuesta');
  await clic('[data-modo="apuesta"]'); const oc = await p.evaluate(() => [document.getElementById('mon-t').textContent, document.getElementById('mon-aj').textContent]); ok(oc[0] === '?' && oc[1] === '?', 'apuesta enseña la cifra antes de contestar'); console.log(' antes de contestar:', oc.join(' / '));
  await clic('#prueba .op'); await clic('#prueba .op:nth-child(2)'); await p.waitForTimeout(100); ok(await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'), 'apuesta no se completa'); console.log(' completa; ', await lee()); await desb('apuesta');
  console.log('-- Error (2 errores en 6 frases)');
  await clic('[data-modo="error"]'); const fr = await p.evaluate(() => document.querySelectorAll('#prueba .ops').length); const frases = ['err', 'err', 'ok', 'ok', 'ok', 'ok'];
  for (let i = 0; i < fr; i++) await p.evaluate(([i, e]) => { const o = document.querySelectorAll('#prueba .ops')[i]; o.children[e ? 0 : 1].click(); }, [i, frases[i] === 'err']);
  ok(await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'), 'error no se completa'); console.log(` ${fr} frases, completado`); await desb('error');
  console.log('-- Caso (4 pasos, respuesta correcta; luego mala)');
  for (const bueno of [true, false]) { await clic('[data-modo="caso"]'); for (let i = 0; i < 4; i++) { const n = await p.evaluate((i) => document.querySelectorAll('#prueba .paso')[i].querySelectorAll('.op').length, i); ok(n === 3, `paso ${i + 1} sin 3 opciones`);
      await p.evaluate(([i, bueno]) => { const ops = [...document.querySelectorAll('#prueba .paso')[i].querySelectorAll('.op')]; const oks = ['Enfriar ya', 'Pararlo', 'Fallo multiorgánico', 'No: ahora']; const k = ops.findIndex((o) => o.textContent.startsWith(oks[i])); (bueno ? ops[k] : ops[(k + 1) % 3]).click(); }, [i, bueno]);
      console.log(` ${bueno ? 'bien' : 'mal'} paso ${i + 1}: ${await lee()} [${await tp()}]`); await desb(`caso paso ${i + 1}`); if (i < 3) await clic('#prueba .paso:last-child .b.prim'); }
    ok(await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'), 'caso no se completa'); if (bueno) await p.screenshot({ path: `${CAP}04-caso-${ANCHO}.png` }); }
  console.log('-- Guía (4 pasos, con foco y cita doble)');
  await clic('#b-guia'); for (let i = 0; i < 4; i++) { const g = await p.evaluate(() => ({ foco: document.querySelectorAll('#esc .foco').length, v: document.querySelectorAll('#guia .ver-ficha[data-resaltar]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') })); ok(g.foco === 1 && g.v === 1 && g.pdf === 1, `guía paso ${i + 1} sin foco/cita`); if (g.haz) { const a = await lee(); await clic('#guia [data-g="haz"]'); ok(a !== await lee(), `guía paso ${i + 1}: «Hazlo» no cambia nada`); console.log(`   hazlo ${i + 1}: ${await lee()} [${await tp()}]`); } await clic('#guia [data-g="sig"]'); }
  const ids = await p.evaluate(() => { const m = {}; document.querySelectorAll('[id]').forEach((e) => { m[e.id] = (m[e.id] || 0) + 1; }); return Object.entries(m).filter(([, n]) => n > 1).map(([k]) => k); }); ok(!ids.length, 'ids duplicados ' + ids); console.log(' ids duplicados:', ids.length);
  const vis = await p.evaluate(() => document.getElementById('frase').getBoundingClientRect().bottom <= document.getElementById('dock').getBoundingClientRect().top + 2); ok(vis, 'frase viva bajo el dock');
  const r2 = await rotulos(); ok(r2 >= 8, `rótulo final ${r2}`);
}
} finally { await b.close(); try { process.kill(pid); } catch {} }
console.log('\nERRORES DE CONSOLA:', errores.length ? errores : 'ninguno'); console.log('FALLOS:', fallos.length ? fallos : 'ninguno'); process.exit(fallos.length || errores.length ? 1 : 0);
