// Prueba de la maqueta «hepatocito C · El paciente de la cama 4» (390 y 360): desborde, rótulos, cifras de cada mando (mín/medio/máx), topes, apuesta/error/caso, imágenes, consola.
// Uso: node hepatocito-c.mjs [ancho]  (lanza su servidor en el puerto 8174 y lo cierra por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b5/capturas/hepatocito-c/';
const srv = spawn('python3', ['-m', 'http.server', '8174'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 })).newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8174/autonomo/maquetas/b5-hepatocito-c.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const C = (f, ...a) => p.evaluate(([f, a]) => new Function('C', 'a', 'return (' + f + ')(C,a)')(window.__cama, a), [f.toString(), a]);
  const lee = () => p.evaluate(() => { const L = window.__cama.leer(); return `NH3 ${L.nh.toFixed(0)} WH ${L.wh} PA ${L.sys}/${L.dia} FC ${L.fc} vol ${L.mlTot}`; });
  const tp = () => p.evaluate(() => window.__cama.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const reset = (c) => p.evaluate((c) => window.__cama.ponerPreset(c), c);
  const clic = (q) => p.evaluate((q) => { const e = document.querySelector(q); if (!e || e.disabled) return false; e.click(); return true; }, q);
  const slider = (id, v) => p.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input')); }, [id, v]);
  const rotulos = async () => p.evaluate(() => { const sv = document.getElementById('esc'), esc = sv.getBoundingClientRect().width / 360; let min = 99; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); return +min.toFixed(1); });
  await desb('inicio'); const r0 = await rotulos(); console.log('rótulo mínimo en pantalla', r0, 'px'); ok(r0 >= 8, `rótulo ${r0}px <8`);
  await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  console.log('-- Función hepática 0 / 50 / 100 (Hilario, sin otros mandos)');
  for (const v of [0, 50, 100]) { await reset('hilario'); await slider('r-func', v); console.log(` ${v} %: ${await lee()} topes[${await tp()}]`); if (v === 0) { ok((await tp()).includes('edema:sello'), 'función 0 sin sello edema'); await p.screenshot({ path: `${CAP}02-edema-${ANCHO}.png` }); } }
  console.log('-- Lactulosa Sin / 2-3 / 4-5 / 6+'); for (const v of [0, 3, 5, 7]) { await reset('hilario'); await clic(`[data-lac="${v}"]`); console.log(` ${v}: ${await lee()} topes[${await tp()}]`); if (v === 7) ok((await tp()).includes('lac:sello') && !(await clic('[data-lac="7"]')), 'lactulosa 6+ sin sello/apagado'); }
  console.log('-- Rifaximina 0/5/10 d'); for (const v of [0, 5, 10]) { await reset('hilario'); await clic(`[data-rif="${v}"]`); console.log(` ${v}: ${await lee()} topes[${await tp()}]`); if (v === 5) ok((await tp()).includes('rif:aviso'), 'rifaximina <10 sin aviso'); }
  console.log('-- CVVH (Hilario: no indicada; fallo agudo: indicada; función 0: baja el edema)');
  await reset('hilario'); await clic('#b-cvvh'); console.log(` Hilario CVVH: ${await lee()} topes[${await tp()}]`); ok((await tp()).includes('cvvh:aviso'), 'CVVH sin aviso «no indicada»');
  await reset('fulminante'); await clic('#b-cvvh'); console.log(` Fallo agudo CVVH: ${await lee()} topes[${await tp()}]`); ok(!(await tp()).includes('cvvh:aviso'), 'CVVH con oliguria avisa «no indicada»');
  await reset('hilario'); await slider('r-func', 0); await clic('#b-cvvh'); console.log(` función 0 + CVVH: ${await lee()} topes[${await tp()}]`); ok(!(await tp()).includes('edema:sello'), 'CVVH no quita el sello de edema');
  console.log('-- TIPS'); await reset('hilario'); await clic('#b-tips'); const t1 = await lee(); console.log(` ${t1} topes[${await tp()}]`); ok((await tp()).includes('tips:aviso'), 'TIPS sin aviso'); ok(/WH 2/.test(t1), 'Hilario con TIPS no pasa a WH 2');
  console.log('-- Fluido 0 / 1.000 / 3.000 mL de cada tipo');
  for (const f of ['alb', 'sal', 'rl']) { await reset('hilario'); await p.evaluate((f) => window.__cama.setFl(f), f); const out = []; for (let i = 0; i <= 6; i++) { if (i === 2 || i === 6 || i === 0) out.push(`${i * 500} mL → ${await lee()} [${await tp()}]`); if (i < 6) await clic('#b-fluido'); } console.log(` ${f}: ${out.join(' | ')}`);
    if (f === 'alb') { ok((await tp()).includes('vol:sello'), '3.000 mL sin sello de sobrecarga'); ok(!(await clic('#b-fluido')), 'Dar sigue tocable con el sello de volumen'); await p.screenshot({ path: `${CAP}03-volumen-${ANCHO}.png` }); } if (f === 'rl') ok((await tp()).includes('rl:aviso'), 'Ringer lactato sin aviso'); }
  await reset('hilario'); await p.evaluate(() => window.__cama.setFl('alb')); await clic('#b-fluido'); ok((await tp()).includes('albok:sello'), 'albúmina con alb <3 sin sello verde');
  // los botones del dock son los mismos nodos tras repintar (estables)
  const id0 = await p.evaluate(() => { window.__b = document.getElementById('b-cvvh'); return 1; }); await clic('#b-cvvh'); ok(await p.evaluate(() => window.__b === document.getElementById('b-cvvh')), 'botones del dock rehechos'); 
  console.log('-- Lupas, imágenes y desborde');
  for (const l of ['cabeza', 'higado', 'abdomen']) { await reset('hilario'); await C((C, a) => C.setLupa(a[0]), l); await desb('lupa ' + l); const r = await rotulos(); ok(r >= 8, `lupa ${l}: rótulo ${r}px`); console.log(` lupa ${l}: rótulo mín ${r}px`);
    const im = await p.evaluate((l) => { const i = document.querySelector(`#fig-${l} img`); return i ? i.complete && i.naturalWidth : -1; }, l); if (l !== 'higado') { console.log(`   imagen: naturalWidth ${im}`); ok(im > 0, `imagen de ${l} no carga`); }
    if (l === 'abdomen') await p.screenshot({ path: `${CAP}04-abdomen-${ANCHO}.png` }); }
  console.log('-- Apuesta');
  await clic('[data-modo="apuesta"]'); const oc = await p.evaluate(() => [document.getElementById('mon-nh').textContent, document.getElementById('mon-wh').textContent]); ok(oc[0] === '?' && oc[1] === '?', 'apuesta enseña la cifra antes de contestar'); console.log(' antes de contestar:', oc.join(' / '));
  await clic('#prueba .op'); await clic('#prueba .op:nth-child(2)'); await p.waitForTimeout(100); ok(await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'), 'apuesta no se completa'); console.log(' completa; ', await lee()); await desb('apuesta');
  console.log('-- Error (2 errores en 6 frases)');
  await clic('[data-modo="error"]'); const fr = await p.evaluate(() => document.querySelectorAll('#prueba .ops').length); const frases = ['err', 'err', 'ok', 'ok', 'ok', 'ok'];
  for (let i = 0; i < fr; i++) await p.evaluate(([i, e]) => { const o = document.querySelectorAll('#prueba .ops')[i]; o.children[e ? 0 : 1].click(); }, [i, frases[i] === 'err']);
  ok(await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'), 'error no se completa'); console.log(` ${fr} frases, completado`); await desb('error');
  console.log('-- Caso (4 pasos, respuesta correcta; luego mala)');
  for (const bueno of [true, false]) { await clic('[data-modo="caso"]'); for (let i = 0; i < 4; i++) { const r = await p.evaluate(([i, bueno]) => { const ops = document.querySelectorAll('#prueba .paso')[i].querySelectorAll('.op'); const ordenOk = [...ops].map((o) => o.textContent); return ordenOk.length; }, [i, bueno]); ok(r === 3, `paso ${i + 1} sin 3 opciones`);
      await p.evaluate(([i, bueno]) => { const ops = [...document.querySelectorAll('#prueba .paso')[i].querySelectorAll('.op')]; const oks = ['Albúmina 5 %', 'Lactulosa hasta 2-3', 'TIPS: hemorragia', 'No: ninguna']; const k = ops.findIndex((o) => o.textContent.startsWith(oks[i])); (bueno ? ops[k] : ops[(k + 1) % 3]).click(); }, [i, bueno]);
      if (i === 1 || i === 3) console.log(` ${bueno ? 'bien' : 'mal'} paso ${i + 1}: ${await lee()} [${await tp()}]`); await desb(`caso paso ${i + 1}`); if (i < 3) await clic('#prueba .paso:last-child .b.prim'); }
    ok(await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'), 'caso no se completa'); if (bueno) await p.screenshot({ path: `${CAP}05-caso-${ANCHO}.png` }); }
  console.log('-- Guía (4 pasos, con foco y cita doble)');
  await clic('#b-guia'); for (let i = 0; i < 4; i++) { const g = await p.evaluate(() => ({ foco: document.querySelectorAll('#esc .foco').length, v: document.querySelectorAll('#guia .ver-ficha[data-resaltar]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') })); ok(g.foco === 1 && g.v === 1 && g.pdf === 1, `guía paso ${i + 1} sin foco/cita`); if (g.haz) { const a = await lee(); await clic('#guia [data-g="haz"]'); ok(a !== await lee(), `guía paso ${i + 1}: «Hazlo» no cambia nada`); } await clic('#guia [data-g="sig"]'); }
  const ids = await p.evaluate(() => { const m = {}; document.querySelectorAll('[id]').forEach((e) => { m[e.id] = (m[e.id] || 0) + 1; }); return Object.entries(m).filter(([, n]) => n > 1).map(([k]) => k); }); ok(!ids.length, 'ids duplicados ' + ids); console.log(' ids duplicados:', ids.length);
  const vis = await p.evaluate(() => { const f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); return f.bottom <= d.top + 2; }); ok(vis, 'frase viva bajo el dock');
}
} finally { await b.close(); try { process.kill(pid); } catch {} }
console.log('\nERRORES DE CONSOLA:', errores.length ? errores : 'ninguno'); console.log('FALLOS:', fallos.length ? fallos : 'ninguno'); process.exit(fallos.length || errores.length ? 1 : 0);
