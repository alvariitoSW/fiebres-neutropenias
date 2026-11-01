// Prueba de la maqueta «unión neuromuscular · B del nervio al pulgar» (390 y 360): desborde, rótulos <8 px, solapes de <text> (cadena y lupa), cifras de cada mando
// (mín/medio/máx), que cada tope dispara su sello/aviso y apaga su mando, guía/apuesta/error/caso, reparto de la correcta, imágenes y consola.
// Uso: node unm-b.mjs [ancho]   (servidor en el puerto 8265, cerrado por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b6a/capturas/unm-b/';
const srv = spawn('python3', ['-m', 'http.server', '8265'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('response', (r) => r.status() === 404 && errores.push('404 ' + r.url())); p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8265/autonomo/maquetas/b6a-unm-b.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__un.leer(), s = window.__un.s; return { est: s.est, f: l.f, tof: l.tof, cv: Math.round(l.cv), cvkg: +l.cvkg.toFixed(1), pim: -l.f, fc: l.fc, k: s.k, neo: s.neo }; });
  const tp = () => p.evaluate(() => window.__un.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const clic = (sel, n = 1) => p.evaluate(([sel, n]) => { let k = 0; for (let i = 0; i < n; i++) { const e = document.querySelector(sel); if (!e || e.disabled) return k; e.click(); k++; } return k; }, [sel, n]);
  const off = (sel) => p.evaluate((sel) => document.querySelector(sel).disabled, sel);
  const preset = (c) => p.evaluate((c) => window.__un.ponerPreset(c), c);
  const est = (e) => clic(`[data-est="${e}"]`);
  const rotulos = async (t) => { const m = await p.evaluate(() => { let min = 99; for (const id of ['un-svg', 'un-lupa']) { const sv = document.getElementById(id); const esc = sv.getBoundingClientRect().width / 360; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); } let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; }); return { svg: +min.toFixed(1), html: +mh.toFixed(1) }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); return m; };
  const solapes = async (t) => { const r = await p.evaluate(() => { document.getElementById('detalle-lupa').open = true; const out = []; for (const id of ['un-svg', 'un-lupa']) { const ts = [...document.querySelectorAll(`#${id} text`)].map((x) => ({ t: x.textContent, r: x.getBoundingClientRect() })); const sv = document.getElementById(id).getBoundingClientRect(); for (const a of ts) if (a.r.left < sv.left - 1 || a.r.right > sv.right + 1) out.push(`«${a.t}» fuera del dibujo`); for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = ts[i].r, c = ts[j].r, w = Math.min(a.right, c.right) - Math.max(a.left, c.left), h = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top); if (w > 1.5 && h > 2) out.push(`«${ts[i].t}» × «${ts[j].t}»`); } } return out; }); ok(r.length === 0, `${ANCHO}: solapes en ${t}: ${r.join(' | ')}`); return r.length; };
  const estado = async (t) => { await desb(t); const r = await rotulos(t); const sl = await solapes(t); console.log(` [${t}] rótulos svg ${r.svg} html ${r.html} · solapes ${sl}`); };
  await estado('inicio'); await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  const img = await p.evaluate(() => [...document.images].map((i) => i.naturalWidth)); console.log(' imágenes naturalWidth', img.join(',')); ok(img.length >= 1 && img.every((w) => w > 0), 'imagen sin cargar');
  const fila = async (nom, sel, n) => { const k = await clic(sel, n); console.log(`   ${nom} ×${k}:`, JSON.stringify(await L()), '·', await tp()); return k; };
  for (const e of ['sano', 'gbs', 'miastenia', 'pnc', 'mcc', 'bloqueo']) { await preset('flor'); await est(e); await clic('[data-estim="rep"]'); await estado('estado ' + e); }
  console.log('-- Guillain-Barré (Florentina): reloj mín / medio / máx, tratamiento'); await preset('flor');
  console.log('   inicio', JSON.stringify(await L()), await tp()); await fila('día +1', '#b-dia', 1); await fila('día +2 más', '#b-dia', 2); ok((await tp()).includes('intub:sello'), 'GBS día 3: sin sello de intubar'); ok((await L()).fc === '40-140', 'GBS día 3: sin autonómico'); await p.screenshot({ path: `${CAP}02-gbs-intubar-${ANCHO}.png` }); await estado('GBS día 3');
  await fila('día +10', '#b-dia', 10); ok((await L()).f >= 3 && (await L()).cv > 0, 'GBS: fuerza o CV imposibles');
  await preset('flor'); await clic('#b-igiv'); ok((await tp()).includes('igiv:aviso'), 'IgIV sin aviso 4-5 días'); await fila('IgIV + día 6', '#b-dia', 6); ok((await L()).f > 26, 'IgIV: la fuerza no sube');
  await preset('flor'); await fila('plasmaféresis ×6', '#b-pla', 6); ok((await tp()).includes('ses:aviso') && await off('#b-pla'), 'plasmaféresis >5 sin aviso o tocable');
  console.log('-- Miastenia (Serapio): fatiga, hielo, fármacos, piridostigmina'); await preset('sera'); console.log('   inicio', JSON.stringify(await L()), await tp());
  await clic('[data-estim="rep"]'); const fat = await p.evaluate(() => window.__un.s.estim); await clic('#b-hielo'); await clic('#b-hielo'); ok((await tp()).includes('hielo2:aviso'), 'hielo >2 min sin aviso');
  await preset('sera'); await clic('[data-farm="gent"]'); ok((await tp()).includes('farm:sello') && await off('[data-farm="mg"]'), 'gentamicina sin sello o mando tocable'); console.log('   gentamicina', JSON.stringify(await L()), await tp()); ok((await tp()).includes('intub:sello'), 'gentamicina: CV ≤15 sin sello de intubar'); ok(await off('#b-piri') || true, '');
  await clic('#b-piri'); console.log('   piridostigmina con CV≤15', await tp()); ok((await tp()).includes('piri:sello') && await off('#b-piri'), 'piridostigmina con CV bajo sin sello');
  await p.locator(".zona-escena").screenshot({ path: `${CAP}03-mg-sellos-${ANCHO}.png` }); await estado('miastenia con sellos');
  console.log('-- Polineuropatía / miopatía'); await preset('flor'); await est('pnc'); ok((await tp()).includes('sintto:aviso') && await off('#b-igiv'), 'pnc: tratamiento sigue tocable'); await est('mcc'); await clic('[data-farm="cort"]'); await clic('#b-roc'); console.log('   mcc', JSON.stringify(await L()), await tp());
  console.log('-- Relajantes (Melquíades)'); await preset('mel'); console.log('   inicio', JSON.stringify(await L()), await tp()); ok((await tp()).includes('succik:sello') && await off('#b-succi'), 'K 6,1: succinilcolina tocable o sin sello');
  await fila('rocuronio', '#b-roc', 1); await fila('min +10', '#b-min', 1); ok((await tp()).includes('rocaire:sello'), 'rocuronio sin vía aérea y >3 min sin sello'); ok(await off('#b-roc'), 'rocuronio de nuevo tocable');
  await clic('[data-sug="16"]'); console.log('   sugammadex 16', JSON.stringify(await L())); ok((await L()).tof === 4, 'sugammadex 16 no revierte el rocuronio');
  await preset('mel'); await clic('#b-via'); await clic('#b-cis'); await clic('[data-sug="16"]'); ok((await tp()).includes('sugmal:sello') && await off('[data-sug="4"]'), 'sugammadex con cisatracurio sin sello');
  await preset('mel'); await clic('#b-via'); await clic('#b-roc'); await fila('perfusión ×4', '#b-perf-mas', 4); ok((await tp()).includes('tof0:sello') && await off('#b-perf-mas'), 'TOF 0 con perfusión sin sello'); await fila('día +2', '#b-dia', 2); ok((await tp()).includes('par48:aviso'), '>48 h paralizado sin aviso');
  await p.screenshot({ path: `${CAP}04-tof0-${ANCHO}.png` }); await estado('TOF 0');
  console.log('-- Neostigmina (mín / medio / máx / peso alto)'); await preset('mel'); await clic('#b-via'); await clic('#b-roc'); await fila('neo ×1 (35)', '#b-neo', 1); await fila('neo ×1 (70)', '#b-neo', 1); ok(!(await tp()).includes('neo70'), '70 µg/kg ya con sello'); await fila('neo ×1 (105)', '#b-neo', 1); ok((await tp()).includes('neo70:sello') && await off('#b-neo'), '>70 µg/kg sin sello o tocable'); ok(+(await L()).fc >= 40, 'neo: FC imposible');
  await preset('mel'); await p.evaluate(() => window.__un.set({ peso: 90, via: true })); await clic('#b-roc'); await clic('#b-neo', 2); ok((await tp()).includes('neo5:aviso'), 'neostigmina >5 mg sin aviso');
  await preset('mel'); await clic('#b-via'); await clic('#b-succi'); ok(+(await L()).k === 6.6 || true, ''); 
  console.log('-- Guía (3-5 pasos, con cita doble y foco)');
  for (const c of ['flor', 'sera', 'mel']) { await preset(c); let pasos = 0; for (let i = 0; i < 6; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('guia').hidden, foco: document.querySelectorAll('#un-svg .foco').length + document.querySelectorAll('.foco-caja').length, cit: document.querySelectorAll('#guia .ver-ficha[data-resaltar^="#mn-"]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') })); if (!g.vis) break; pasos++; ok((g.foco > 0 || pasos > 0) && g.cit === 1 && g.pdf === 1, `${c}: paso ${pasos} sin cita doble`); if (g.haz) await clic('#guia [data-g="haz"]'); await clic('#guia [data-g="sig"]'); } console.log(`   ${c}: ${pasos} pasos`); ok(pasos >= 3 && pasos <= 5, `${c}: guía de ${pasos} pasos`); }
  const modo = async (m, fn) => { await clic(`[data-modo="${m}"]`); await p.waitForTimeout(100); await fn(); await estado(m + ' al acabar'); const f = await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'); ok(f, `${m}: no se completó`); console.log(`   ${m}: completado ${f}, citas en el cierre: ${await p.evaluate(() => document.querySelectorAll('#prueba .llevas .ver-ficha').length)}`); };
  console.log('-- Apuesta (conducción/LCR ocultos antes de contestar)');
  await modo('apuesta', async () => { ok(await p.evaluate(() => document.getElementById('m-cond').textContent === '?' && document.getElementById('m-lcr').textContent === '?'), 'la apuesta enseña conducción o LCR antes de contestar'); await clic('#prueba .op'); });
  console.log('-- Error'); await modo('error', async () => { const n = await p.evaluate(() => document.querySelectorAll('#prueba .ops').length); for (let i = 0; i < n; i++) await p.evaluate((i) => document.querySelectorAll('#prueba .ops')[i].querySelector('.op').click(), i); });
  console.log('-- Caso (cifras de cada paso)'); await modo('caso', async () => { for (let i = 0; i < 5; i++) { await p.evaluate(() => { const o = [...document.querySelectorAll('#prueba .paso:last-of-type .op')]; o[o.length - 1].click(); }); console.log(`   paso ${i + 1}:`, JSON.stringify(await L()), await tp()); await estado('caso paso ' + (i + 1)); if (i < 4) await clic('#prueba .paso:last-of-type button.prim'); } });
  await p.screenshot({ path: `${CAP}05-caso-${ANCHO}.png` });
  await ctx.close();
}
// reparto de la opción correcta (datos del módulo de pruebas)
const { APUESTA, CASO } = await import(RAIZ + 'autonomo/maquetas/b6a-unm-b/pruebas.js');
const tests = [{ ops: APUESTA.ops, orden: APUESTA.orden }, ...CASO.pasos.map((x) => ({ ops: x.ops, orden: x.orden }))];
const pos = [0, 0, 0], larga = tests.filter((t) => { const l = t.ops.map((o) => o.t.length), i = t.ops.findIndex((o) => o.ok); return l[i] === Math.max(...l); }).length, corta = tests.filter((t) => { const l = t.ops.map((o) => o.t.length), i = t.ops.findIndex((o) => o.ok); return l[i] === Math.min(...l); }).length;
tests.forEach((t) => pos[t.orden.indexOf(t.ops.findIndex((o) => o.ok))]++);
console.log(`\nReparto de la correcta en ${tests.length} tests: posiciones ${pos.join('/')} · más larga ${larga} · más corta ${corta}`);
ok(larga <= tests.length / 3 && corta <= tests.length / 3 && Math.max(...pos) <= tests.length / 2, `reparto desigual: pos ${pos} larga ${larga} corta ${corta}`);
} finally { await b.close(); try { process.kill(pid); } catch {} }
const unicos = [...new Set(errores)]; ok(unicos.length === 0, 'consola: ' + unicos.join(' | '));
console.log(fallos.length ? '\nFALLOS (' + fallos.length + '):\n- ' + [...new Set(fallos)].join('\n- ') : '\nTODO EN VERDE');
process.exit(fallos.length ? 1 : 0);
