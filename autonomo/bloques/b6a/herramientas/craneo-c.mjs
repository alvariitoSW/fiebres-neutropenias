// Prueba de la maqueta «cráneo vivo · C el flujo» (390 y 360): desborde, rótulos <8 px, solapes entre cajas de <text>, cifras de cada mando
// (mín/medio/máx), que cada tope dispara su sello y apaga su mando, apuesta/error/caso/guía, imágenes y consola.
// Uso: node craneo-c.mjs [ancho]   (lanza su servidor en el puerto 8263 y lo cierra por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b6a/capturas/craneo-c/';
const srv = spawn('python3', ['-m', 'http.server', '8263'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8263/autonomo/maquetas/b6a-craneo-c.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const L = () => p.evaluate(() => { const l = window.__cr.leer(), s = window.__cr.s; return { pam: s.pam, pic: l.picEf, ppc: Math.round(l.ppc), pa: Math.round(l.pas) + '/' + Math.round(l.pad), flujo: Math.round(l.flujo), sat: l.sat, dtc: l.dtc == null ? '∅' : Math.round(l.dtc), anillos: l.vivos, glu: s.glu, T: s.temp, dia: s.dia }; });
  const tp = () => p.evaluate(() => window.__cr.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const sellos = () => p.evaluate(() => [...document.querySelectorAll('.tope-sello')].filter((x) => !x.hidden).length);
  const clic = (sel, n = 1) => p.evaluate(([sel, n]) => { let k = 0; for (let i = 0; i < n; i++) { const e = document.querySelector(sel); if (!e || e.disabled || e.classList.contains('tope-apagado') && e.disabled) return k; e.click(); k++; } return k; }, [sel, n]);
  const off = (sel) => p.evaluate((sel) => document.querySelector(sel).disabled, sel);
  const preset = (c) => p.evaluate((c) => window.__cr.ponerPreset(c), c);
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('cr-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; }); let mh = 99; document.querySelectorAll('body *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; }); return { svg: +min.toFixed(1), html: +mh.toFixed(1) }; }); ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); return m; };
  const solapes = async (t) => { const r = await p.evaluate(() => { const ts = [...document.querySelectorAll('#cr-svg text')].map((x) => ({ t: x.textContent, r: x.getBoundingClientRect() })); const out = []; for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = ts[i].r, c = ts[j].r, w = Math.min(a.right, c.right) - Math.max(a.left, c.left), h = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top); if (w > 1.5 && h > 2) out.push(`«${ts[i].t}» × «${ts[j].t}» (${w.toFixed(0)}×${h.toFixed(0)})`); } return out; }); ok(r.length === 0, `${ANCHO}: solapes de texto en ${t}: ${r.join(' | ')}`); return r.length; };
  const estado = async (t) => { await desb(t); const r = await rotulos(t); const sl = await solapes(t); console.log(` [${t}] rótulos svg ${r.svg} html ${r.html} · solapes ${sl}`); };
  await estado('inicio'); await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  const img = await p.evaluate(() => [...document.images].map((i) => i.naturalWidth)); console.log(' imágenes naturalWidth', img.join(',')); ok(img.length >= 2 && img.every((w) => w > 0), 'imagen sin cargar');
  // ---- mandos ----
  const fila = async (nom, sel, n) => { const k = await clic(sel, n); console.log(`   ${nom} ×${k}:`, JSON.stringify(await L()), '·', await tp()); return k; };
  console.log('-- PA (Hermenegildo con tPA): inicio / bajar hasta el tope / subir hasta el tope');
  await preset('herme'); console.log('   inicio', JSON.stringify(await L()), await tp()); ok((await tp()).includes('tpapa:sello'), 'tPA 188/110 sin sello de hemorragia'); ok(await off('#b-sube'), 'Subir PA sigue tocable con el sello tPA');
  await fila('bajar', '#b-baja', 1); ok((await tp()).includes('tpaok:sello'), 'sin sello verde <180/105'); ok(!(await off('#b-sube')), 'Subir PA no se reabre');
  await estado('tPA ok');
  await fila('bajar a PAM<65', '#b-baja', 8); ok((await tp()).includes('pam65:sello'), 'PAM<65 sin sello'); ok(await off('#b-baja'), 'Bajar sigue tocable con PAM<65'); await p.screenshot({ path: `${CAP}02-tope-pam-${ANCHO}.png` }); await estado('PAM<65');
  await preset('herme'); await fila('subir ×12 (180 de PAM)', '#b-sube', 12); console.log('   (con tPA sube solo hasta el sello)');
  console.log('-- PA sin tPA'); await preset('sin'); console.log('   inicio', JSON.stringify(await L()), await tp());
  await fila('bajar ×1', '#b-baja', 1); ok((await tp()).includes('pasin:sello'), 'sin tPA y <220/120: sin sello «penumbra sin ganar»'); ok(await off('#b-baja'), 'Bajar sigue tocable sin tPA'); await p.screenshot({ path: `${CAP}03-tope-pasin-${ANCHO}.png` });
  await preset('sin'); await fila('subir ×6', '#b-sube', 6); ok((await tp()).includes('pa220:aviso'), 'PA>220 sin aviso');
  console.log('-- Nitroprusiato'); await preset('herme'); await clic('#b-baja', 1); await fila('nitro', '#b-nitro', 1); ok((await tp()).includes('nitro:sello') && await off('#b-nitro'), 'nitro sin sello o sigue tocable');
  console.log('-- PIC (mín / medio / máx)'); await preset('herme'); await fila('bajar ×3', '#b-picd', 3); await fila('subir +5 ×5', '#b-picu', 5); ok((await tp()).includes('pic20:aviso'), 'PIC≥20 sin aviso');
  await fila('+15 hasta el tope', '#b-picx', 12); ok((await tp()).includes('me:sello'), 'PIC=PAM sin sello de muerte encefálica'); ok(await off('#b-picu') && await off('#b-picx'), 'PIC sigue tocable con PIC=PAM'); ok((await L()).ppc === 0 && (await L()).dtc === '∅' && (await L()).flujo === 0, 'PIC=PAM sin flujo 0 / Doppler ∅'); await p.screenshot({ path: `${CAP}04-tope-me-${ANCHO}.png` }); await estado('PIC=PAM');
  await preset('herme'); await clic('#b-baja', 3); await fila('PPC<50: PIC +15 ×3', '#b-picx', 3); console.log('   PPC<50:', (await tp()).includes('ppc50') ? 'sello' : 'sin sello');
  await preset('petro'); await clic('#b-picx', 8); ok((await tp()).includes('me:sello'), 'HSA: PIC alta sin sello'); console.log('   Petronila PIC alta', JSON.stringify(await L()), await tp());
  console.log('-- Oxígeno'); await preset('herme'); for (const v of [21, 30, 60, 100]) { await p.evaluate((v) => document.querySelector(`[data-fio="${v}"]`).click(), v); console.log(`   FiO₂ ${v}:`, JSON.stringify(await L()), await tp()); if (v === 30) { ok((await tp()).includes('sat94:sello'), 'SaO₂>94 con O₂ sin sello'); ok(await off('[data-fio="100"]'), 'FiO₂ 100 tocable con el sello'); } else if (v === 100) { /* apagado tras 30 */ } }
  await preset('herme'); await clic('[data-fio="30"]'); await p.screenshot({ path: `${CAP}05-tope-sat-${ANCHO}.png` });
  console.log('-- Respirador'); await preset('herme'); await clic('#b-vent'); console.log('   VPP:', JSON.stringify(await L()), await tp()); ok((await tp()).includes('vpp:aviso'), 'VPP sin aviso'); ok((await L()).pic > 12, 'VPP no sube la PIC');
  console.log('-- Glucosa'); await preset('herme'); await fila('insulina ×6', '#b-ins', 6); ok((await tp()).includes('gluB:sello') && await off('#b-ins'), 'glucosa<70 sin sello o insulina tocable');
  await preset('herme'); await fila('glucosado ×4', '#b-glu', 4); ok((await tp()).includes('dex:aviso'), 'glucosado sin aviso'); await fila('glucosado hasta el tope', '#b-glu', 6); ok((await tp()).includes('gluM:sello') && await off('#b-glu'), 'glucosa 400 sin sello');
  console.log('-- Temperatura'); await preset('herme'); await fila('fiebre ×2', '#b-fiebre', 2); ok((await tp()).includes('fiebre:aviso'), 'T≥38 sin aviso'); await fila('fiebre hasta el tope', '#b-fiebre', 10); ok((await tp()).includes('tMax:sello') && await off('#b-fiebre'), 'T 40,5 sin sello'); await fila('bajarla ×10', '#b-frio', 10);
  console.log('-- Reloj de la HSA'); await preset('herme'); ok(await off('#b-dia-mas') && await off('#b-dia-'), 'reloj tocable sin HSA');
  await preset('petro'); for (const d of [0, 4, 9, 14, 21]) { await p.evaluate((d) => window.__cr.hacer('dia', { v: d }), d); const l = await L(), g = await p.evaluate(() => document.getElementById('m-gcs').textContent); console.log(`   día ${d}:`, JSON.stringify(l), 'GCS', g, await tp()); if (d === 9) { ok(l.dtc > 100 && g === '12', 'día 9: Doppler no sube o GCS≠12'); await estado('HSA día 9'); await p.screenshot({ path: `${CAP}06-hsa-${ANCHO}.png` }); } if (d === 21) ok(await off('#b-dia-mas'), 'reloj tocable el día 21'); }
  // ---- guía, apuesta, error, caso ----
  console.log('-- Guía (4-5 pasos, con cita doble y foco)');
  for (const c of ['herme', 'petro']) { await preset(c); let pasos = 0; for (let i = 0; i < 6; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('guia').hidden, foco: document.querySelectorAll('#cr-svg .foco').length, cit: document.querySelectorAll('#guia .ver-ficha[data-resaltar^="#mn-"]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') })); if (!g.vis) break; pasos++; ok(g.foco > 0 && g.cit === 1 && g.pdf === 1, `${c}: paso ${pasos} sin foco o sin cita doble`); if (g.haz) await clic('#guia [data-g="haz"]'); await clic('#guia [data-g="sig"]'); } console.log(`   ${c}: ${pasos} pasos`); ok(pasos >= 3 && pasos <= 5, `${c}: guía de ${pasos} pasos`); }
  await preset('herme'); await clic('#guia [data-g="sig"]', 3); await p.screenshot({ path: `${CAP}07-guia-${ANCHO}.png` });
  const modo = async (m, fn) => { await clic(`[data-modo="${m}"]`); await p.waitForTimeout(100); await fn(); await estado(m + ' al acabar'); const f = await p.evaluate(() => document.getElementById('prueba').dataset.fin === '1'); ok(f, `${m}: no se completó`); console.log(`   ${m}: completado ${f}, citas «Ver en la ficha» en el cierre: ${await p.evaluate(() => document.querySelectorAll('#prueba .llevas .ver-ficha').length)}`); };
  console.log('-- Apuesta (cifra oculta antes de contestar)');
  await modo('apuesta', async () => { const oc = await p.evaluate(() => document.getElementById('m-ppc').textContent); ok(oc === '?', 'la apuesta enseña la PPC antes de contestar'); const ops = await p.evaluate(() => [...document.querySelectorAll('#prueba .op')].map((x) => x.textContent.length)); console.log('   longitudes', ops.join('/')); await clic('#prueba .op'); });
  console.log('-- Error'); await modo('error', async () => { const n = await p.evaluate(() => document.querySelectorAll('#prueba .ops').length); for (let i = 0; i < n; i++) await p.evaluate((i) => document.querySelectorAll('#prueba .ops')[i].querySelector('.op').click(), i); });
  console.log('-- Caso'); await modo('caso', async () => { for (let i = 0; i < 5; i++) { await p.evaluate(() => { const o = [...document.querySelectorAll('#prueba .paso:last-of-type .op')]; o[o.length - 1].click(); }); await estado('caso paso ' + (i + 1)); if (i < 4) await clic('#prueba .paso:last-of-type button.prim'); } });
  const pos = await p.evaluate(() => 0); await p.screenshot({ path: `${CAP}08-caso-${ANCHO}.png`, fullPage: false });
  const errs = errores.length; console.log(` errores de consola acumulados: ${errs}`);
  await ctx.close();
}
} finally { await b.close(); try { process.kill(pid); } catch {} }
const unicos = [...new Set(errores)]; ok(unicos.length === 0, 'consola: ' + unicos.join(' | '));
console.log(fallos.length ? '\nFALLOS (' + fallos.length + '):\n- ' + [...new Set(fallos)].join('\n- ') : '\nTODO EN VERDE');
process.exit(fallos.length ? 1 : 0);
