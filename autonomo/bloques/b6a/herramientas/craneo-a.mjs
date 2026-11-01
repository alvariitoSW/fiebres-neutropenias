// Prueba de la maqueta «cráneo A · La caja cerrada» (390 y 360). Uso: node craneo-a.mjs [ancho]  (servidor propio en 8261, cerrado por su pid)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process'; import { mkdirSync } from 'node:fs';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b6a/capturas/craneo-a/'; mkdirSync(CAP, { recursive: true });
const srv = spawn('python3', ['-m', 'http.server', '8261'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8261/autonomo/maquetas/b6a-craneo-a.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const L = () => p.evaluate(() => { const l = window.__craneo.leer(); return { pam: Math.round(l.pam), pic: +l.pic.toFixed(1), ppc: +l.ppc.toFixed(1), gcs: l.gcs, pup: l.pup }; });
  const tp = () => p.evaluate(() => window.__craneo.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const clic = (id) => p.evaluate((id) => { const e = document.getElementById(id); if (e.disabled) return false; e.click(); return true; }, id);
  const reset = (c) => p.evaluate((c) => window.__craneo.ponerPreset(c), c);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const dibujo = async (t) => {
    const r = await p.evaluate(() => { const sv = document.getElementById('cr-svg'), esc = sv.getBoundingClientRect().width / 360; let min = 99; const bb = [];
      sv.querySelectorAll('text').forEach((x) => { min = Math.min(min, parseFloat(getComputedStyle(x).fontSize) * esc); const b = x.getBBox(); bb.push([x.textContent, b.x, b.y, b.width, b.height]); });
      const sol = []; for (let i = 0; i < bb.length; i++) for (let j = i + 1; j < bb.length; j++) { const a = bb[i], c = bb[j]; const w = Math.min(a[1] + a[3], c[1] + c[3]) - Math.max(a[1], c[1]), h = Math.min(a[2] + a[4], c[2] + c[4]) - Math.max(a[2], c[2]); if (w > 0.8 && h > 1.5) sol.push(a[0] + ' × ' + c[0]); }
      return { min: +min.toFixed(1), n: bb.length, sol }; });
    ok(r.min >= 8, `${ANCHO}: rótulo de ${r.min}px en ${t}`); ok(!r.sol.length, `${ANCHO}: solapes en ${t}: ${r.sol.join('; ')}`); return `${t}: ${r.n} rótulos, mín ${r.min}px, solapes ${r.sol.length}`;
  };
  const sano = async (t) => { const l = await L(); ok(l.pic >= 0 && l.pic <= 80 && l.pic <= l.pam + 0.01 && l.ppc >= -0.01 && l.pam >= 30 && l.pam <= 150, `${ANCHO}: constantes imposibles en ${t}: ${JSON.stringify(l)}`); return l; };
  await desb('inicio'); console.log(await dibujo('inicio')); await p.evaluate(() => scrollTo(0, 150)); await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` }); await p.evaluate(() => scrollTo(0, 0));
  const img = await p.evaluate(() => [...document.querySelectorAll('.figs img')].map((i) => i.naturalWidth)); console.log('imágenes naturalWidth', img); ok(img.length === 2 && img.every((w) => w > 0), 'imagen sin cargar');
  // ---- mandos: mínimo / medio / máximo ----
  console.log('-- Masa (tipo × 0..100, pasos de 10)');
  for (const tipo of ['hematoma', 'hv', 'edema', 'lcr']) { await reset('abundio'); await p.evaluate((t) => window.__craneo.set({ tipo: t, m: 0 }), tipo); const fila = []; for (let m = 0; m <= 100; m += 10) { if (m) await clic('b-masa-mas'); const l = await sano(`masa ${tipo} ${m}`); fila.push(`${m}:${l.pic}/${l.ppc}`); }
    console.log(` ${tipo} (masa:PIC/PPC): ${fila.join(' ')}`); }
  ok((await tp()).includes('pic80:sello'), 'masa a tope sin sello'); await p.evaluate(() => { window.__craneo.ponerPreset('abundio'); window.__craneo.set({ m: 100, pam: 40 }); }); ok((await tp()).includes('flujo:sello'), 'PIC=PAM sin sello de flujo detenido'); console.log(' PAM 40 + masa 100:', await tp(), JSON.stringify(await L())); ok(!(await clic('b-masa-mas')), 'masa + sigue tocable con el sello'); console.log(' tope masa:', await tp(), JSON.stringify(await L())); await desb('masa tope'); await p.evaluate(() => scrollTo(0, 120)); await p.screenshot({ path: `${CAP}02-tope-masa-${ANCHO}.png` });
  console.log('-- PAM 40..150'); await reset('segismundo'); const pf = []; while (await clic('b-pam-menos')) { const l = await sano('pam-'); pf.push(`${l.pam}:${l.pic}/${l.ppc}`); if (pf.length > 30) break; } console.log(' bajando:', pf.join(' '), 'topes[' + await tp() + ']'); ok((await tp()).includes('ppc:sello') && (await tp()).includes('pamn:sello'), 'PPC<50 o PAM 40 sin sello');
  while (await clic('b-pam-mas')) { if (pf.length++ > 60) break; } console.log(' tope alto:', JSON.stringify(await L()), 'topes[' + await tp() + ']'); ok((await L()).pam === 150, 'PAM no llegó a 150');
  console.log('-- Drenaje (0..3)'); await reset('segismundo'); const df = [`0:${(await L()).pic}`]; let n = 0; while (await clic('b-dren')) { n++; df.push(`${n}:${(await L()).pic}`); } console.log(' PIC:', df.join(' '), 'topes[' + await tp() + ']'); ok(n === 3 && (await tp()).includes('dren:aviso'), 'drenaje sin tope en 3');
  console.log('-- Hipertónico (Clotilde, edema)'); await reset('clotilde'); const hf = [`Na138:${(await L()).pic}`]; n = 0; while (await clic('b-hiper')) { n++; const na = await p.evaluate(() => window.__craneo.s.na); hf.push(`Na${na}:${(await L()).pic}`); if (n > 8) break; } console.log(' ', hf.join(' '), 'topes[' + await tp() + ']'); ok((await tp()).includes('na:sello'), 'Na>155 sin sello'); await p.screenshot({ path: `${CAP}03-tope-na-${ANCHO}.png` });
  console.log('-- Respirador, PaCO₂'); await reset('segismundo'); const v0 = await L(); await clic('b-vpp'); const v1 = await L(); console.log(` VPP: PIC ${v0.pic}→${v1.pic} PPC ${v0.ppc}→${v1.ppc}`); ok(v1.pic > v0.pic && v1.ppc < v0.ppc, 'VPP no sube la PIC y baja la PPC'); await clic('b-vpp');
  const cf = []; while (await clic('b-co2-menos')) cf.push(`${await p.evaluate(() => window.__craneo.s.co2)}:${(await L()).pic}`); console.log(' PaCO₂ bajando:', cf.join(' '), 'topes[' + await tp() + ']'); ok((await tp()).includes('co2:sello'), 'PaCO₂<30 sin sello');
  while (await clic('b-co2-mas')) cf.push(await p.evaluate(() => window.__craneo.s.co2)); console.log(' PaCO₂ 50:', JSON.stringify(await L()), 'topes[' + await tp() + ']'); ok((await tp()).includes('co2a:aviso'), 'PaCO₂>45 sin aviso');
  console.log('-- Reloj'); await reset('segismundo'); const rf = []; while (await clic('b-reloj')) rf.push(`${await p.evaluate(() => window.__craneo.s.h)}h:${(await L()).pic}`); console.log(' ', rf.join(' '), 'topes[' + await tp() + ']'); ok((await tp()).includes('hid:aviso'), 'hidrocefalia sin aviso');
  console.log('-- PAM <65 en el ictus (Clotilde)'); await reset('clotilde'); let vio = false; while (await clic('b-pam-menos')) { if ((await tp()).includes('pam:sello')) vio = true; } console.log(' ', JSON.stringify(await L()), 'topes[' + await tp() + ']', 'sello PAM<65 visto:', vio); ok(vio, 'PAM<65 ictus sin sello');
  // combinaciones extremas
  for (const c of ['segismundo', 'abundio', 'clotilde']) for (const tipo of ['hematoma', 'hv', 'edema', 'lcr']) for (const m of [0, 50, 100]) for (const pam of [40, 95, 150]) for (const co2 of [25, 50]) { await p.evaluate(([c, t, m, pam, co2]) => { window.__craneo.ponerPreset(c); window.__craneo.set({ tipo: t, m, pam, co2, vpp: true, h: 72 }); }, [c, tipo, m, pam, co2]); await sano(`combo ${c} ${tipo} ${m} ${pam} ${co2}`); }
  console.log(' 216 combinaciones extremas: constantes dentro de lo posible');
  // ---- dibujo en varios estados: sin solapes ni rótulos pequeños ----
  for (const [c, t, m, h] of [['segismundo', 'hv', 66, 12], ['abundio', 'hematoma', 100, 0], ['clotilde', 'edema', 60, 72], ['abundio', 'lcr', 0, 0]]) { await reset(c); await p.evaluate(([t, m, h]) => window.__craneo.set({ tipo: t, m, h }), [t, m, h]); console.log(' ' + await dibujo(`${c}/${t}/${m}/${h}h`)); await desb(c); }
  // ---- guías y citas ----
  for (const c of ['segismundo', 'abundio', 'clotilde']) { await reset(c); let pasos = 0;
    for (let i = 0; i < 6; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('guia').hidden, foco: document.querySelectorAll('#cr-svg .foco').length, ver: document.querySelectorAll('#guia .ver-ficha[data-resaltar^="#mn-"]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') }));
      if (!g.vis) break; pasos++; ok(g.foco > 0 && g.ver === 1 && g.pdf === 1, `${c}: paso ${pasos} sin foco o cita`); if (g.haz) { const a = await L(); await clic2(p, '#guia [data-g="haz"]'); const d = await L(); ok(JSON.stringify(a) !== JSON.stringify(d), `${c}: «Hazlo» del paso ${pasos} no cambió nada`); } await clic2(p, '#guia [data-g="sig"]'); }
    console.log(` guía ${c}: ${pasos} pasos`); ok(pasos >= 3 && pasos <= 5, `${c}: guía de ${pasos} pasos`); }
  const cc = await p.evaluate(() => ({ n: document.querySelectorAll('.cita').length, mal: [...document.querySelectorAll('.cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length })); console.log(` citas ${cc.n}, sin doble botón ${cc.mal}`); ok(cc.mal === 0, 'cita sin doble botón');
  // ---- apuesta, error, caso ----
  console.log('-- Apuesta'); await p.evaluate(() => window.__craneo.modoPrueba('apuesta')); ok((await p.evaluate(() => document.getElementById('mon-ppc').textContent)) === '?', 'apuesta: la PPC se ve antes de contestar'); ok(!(await p.evaluate(() => document.getElementById('prueba').innerHTML.includes('data-ok'))), 'respuesta en el HTML');
  let ops = await p.$$('#prueba .op'); ok(ops.length === 3, 'apuesta: 3 opciones'); const tt = await Promise.all(ops.map((o) => o.textContent())); await ops[tt.findIndex((t) => t.startsWith('PPC 65'))].click(); await p.waitForTimeout(150);
  console.log(` tras contestar: ${JSON.stringify(await L())} fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)}`); ok((await L()).pam === 110 && (await L()).ppc > 70, 'apuesta: PAM 110 / PPC>70'); await desb('apuesta');
  console.log('-- Error'); await p.evaluate(() => window.__craneo.modoPrueba('error')); const gr = await p.$$('#prueba .ops'); ok(gr.length === 3, 'error: 3 frases'); for (let i = 0; i < 3; i++) { const bs = await gr[i].$$('.op'); await bs[i < 2 ? 0 : 1].click(); } await p.waitForTimeout(150);
  console.log(` error resuelto: fin=${await p.evaluate(() => document.getElementById('prueba').dataset.fin)}`); ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'error sin completar'); await desb('error');
  console.log('-- Caso (Segismundo, 4 pasos)'); await p.evaluate(() => window.__craneo.modoPrueba('caso'));
  const bien = [/^Revertir/, /^Monitorizar/, /^Drenar/, /^Drenaje/];
  for (let i = 0; i < 4; i++) { const o = await p.$$(`#prueba .paso:nth-of-type(${i + 1}) .op`); ok(o.length === 3, `caso paso ${i + 1}: opciones`); const t2 = await Promise.all(o.map((x) => x.textContent())); await o[t2.findIndex((t) => bien[i].test(t))].click(); await p.waitForTimeout(120);
    console.log(`  paso ${i + 1}: ${JSON.stringify(await L())} topes[${await tp()}]`); await sano(`caso ${i + 1}`); await desb(`caso ${i + 1}`); const sg = await p.$(`#prueba .paso:nth-of-type(${i + 1}) .b.prim`); if (sg) await sg.click(); }
  ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'caso sin completar'); await p.screenshot({ path: `${CAP}04-caso-${ANCHO}.png`, fullPage: true });
  // frase viva y dock
  await reset('segismundo'); await p.evaluate(() => scrollTo(0, 0)); await clic('b-dren'); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => { const f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(), s = document.getElementById('cr-svg').getBoundingClientRect(); return { fraseBajoDock: f.bottom > d.top + 1, escenaVisible: s.top < innerHeight - d.height - f.height + 120 }; }); console.log(' frase/dock', JSON.stringify(vis)); ok(!vis.fraseBajoDock, 'frase bajo el dock');
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message + e.stack.split('\n')[1]); } finally { await b.close(); try { process.kill(pid); } catch {} }
async function clic2(p, q) { await p.evaluate((q) => document.querySelector(q).click(), q); }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(fallos.length ? 'FALLOS:\n- ' + [...new Set(fallos)].slice(0, 25).join('\n- ') : 'TODO EN VERDE');
