// Prueba de la maqueta «cráneo B · el corte con la cara» (390 y 360): desborde, rótulos <8 px en pantalla, SOLAPES entre cajas <text>,
// cifras de cada mando (mín/medio/máx), cada tope con su sello, apuesta/error/caso, imágenes, consola. Puerto 8262.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b6a/capturas/craneo-b/'; mkdirSync(CAP, { recursive: true });
const srv = spawn('python3', ['-m', 'http.server', '8262'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8262/autonomo/maquetas/b6a-craneo-b.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const tp = () => p.evaluate(() => window.__cr.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const L = () => p.evaluate(() => { const l = window.__cr.leer(); return `PIC ${l.pic} PAM ${l.P} PPC ${l.ppc} est ${l.est} GCS ${l.gcs}`; });
  const pre = (c, o = {}) => p.evaluate(([c, o]) => { window.__cr.ponerPreset(c); window.__cr.set(o); }, [c, o]);
  const clic = (id) => p.evaluate((id) => { const e = document.getElementById(id); if (e.disabled) return false; e.click(); return true; }, id);
  const analiza = async (t) => {
    const r = await p.evaluate(() => {
      const sv = document.getElementById('cr-svg'), R = sv.getBoundingClientRect(), esc = R.width / 390; let min = 99; const cajas = [];
      sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; min = Math.min(min, f); const b = x.getBoundingClientRect(); if (b.width) cajas.push({ t: x.textContent, l: b.left, r: b.right, a: b.top, d: b.bottom }); });
      const sol = []; for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) { const A = cajas[i], B = cajas[j], w = Math.min(A.r, B.r) - Math.max(A.l, B.l), h = Math.min(A.d, B.d) - Math.max(A.a, B.a); if (w > 1.5 && h > 2) sol.push(`«${A.t}» × «${B.t}»`); }
      const fuera = cajas.filter((c) => c.r > R.right + 0.5 || c.l < R.left - 0.5).map((c) => c.t);
      return { min: +min.toFixed(2), sol, fuera };
    });
    ok(r.min >= 8, `${ANCHO} ${t}: rótulo de ${r.min}px`); ok(!r.sol.length, `${ANCHO} ${t}: solapes ${r.sol.join(' | ')}`); ok(!r.fuera.length, `${ANCHO} ${t}: texto fuera del dibujo ${r.fuera.join(',')}`);
    return `min ${r.min}px solapes ${r.sol.length}`;
  };
  await desb('inicio'); console.log('inicio:', await analiza('inicio'), '|', await L(), '| topes', await tp());
  await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });

  // ---- escena entera sobre el dock, sello bajo el monitor, pupila ↔ sello ----
  const escena = async (t) => { const r = await p.evaluate(() => { window.scrollTo(0, 0); const sv = document.getElementById('cr-svg').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(), f = document.getElementById('frase').getBoundingClientRect(), m = document.querySelector('#monitor .mon-fila').getBoundingClientRect(), fila = document.querySelector('#monitor .mon-fila').getBoundingClientRect(); const sel = [...document.querySelectorAll('#monitor .tope-sello')].filter((x) => !x.hidden).map((x) => x.getBoundingClientRect());
      return { svgB: sv.bottom, dockT: d.top, fraseT: f.top, mon: m.height, solSello: sel.some((x) => x.top < fila.bottom - 0.5 && x.bottom > fila.top), dockH: d.height, fraseH: f.height }; });
    ok(r.svgB < Math.min(r.dockT, r.fraseT) - 0.5, `${ANCHO} ${t}: el corte llega a ${Math.round(r.svgB)} y la frase/dock empiezan en ${Math.round(Math.min(r.dockT, r.fraseT))}`); ok(r.mon <= 120, `${ANCHO} ${t}: monitor de ${Math.round(r.mon)}px`); ok(!r.solSello, `${ANCHO} ${t}: el sello tapa el monitor`); return r; };
  const pupilas = async (t) => { const r = await p.evaluate(() => { const c = [...document.querySelectorAll('#cr-svg .pup')], D = c.find((x) => x.dataset.lado === 'D'), I = c.find((x) => x.dataset.lado === 'I'); const act = window.__cr.topes().map((x) => x.clave), l = window.__cr.leer(); return { rD: +D.dataset.r, rI: +I.dataset.r, fD: D.dataset.fija === '1', fI: I.dataset.fija === '1', act, tipo: window.__cr.s.tipo, est: l.est, pup: l.pup, txt: [...document.querySelectorAll('#cr-svg text')].map((x) => x.textContent).filter((x) => /pupila|Reactivas|Dilatadas|Medias|D algo/i.test(x)).join(' ') }; });
    const uncal = r.act.includes('uncal'), desc = r.act.includes('desc'), me = r.act.includes('me');
    ok(uncal === (r.rD > r.rI + 2 && r.fD && !r.fI), `${t}: sello uncal=${uncal} y pupilas D${r.rD}${r.fD ? 'f' : ''} I${r.rI}${r.fI ? 'f' : ''}`);
    if (desc) ok(r.rD >= 9 && r.rI >= 9 && r.fD && r.fI, `${t}: sello descerebración y pupilas no dilatadas fijas`); if (me) ok(r.fD && r.fI && r.rD === r.rI, `${t}: sin flujo y pupilas no medias fijas`);
    if (r.tipo === 'hsa') ok(!uncal && !(r.rD > r.rI + 2), `${t}: HSA con pupila unilateral`); if (r.est === 0 && r.tipo !== 'tronco') ok(r.rD === 4 && r.rI === 4 && !r.fD && !r.fI, `${t}: PIC normal con pupilas anormales`); return r; };
  console.log('escena inicio:', JSON.stringify(await escena('inicio')), JSON.stringify(await pupilas('inicio')));
  for (const [c0, o0] of [['abundio', {}], ['abundio', { masa: 60 }], ['abundio', { masa: 80 }], ['abundio', { masa: 100 }], ['petronila', {}], ['petronila', { pas: 165 }], ['petronila', { masa: 100, pas: 214 }], ['clotilde', { masa: 100 }], ['leovigildo', {}], ['segismundo', {}]]) { await pre(c0, o0); await escena(`${c0} ${JSON.stringify(o0)}`); await pupilas(`${c0} ${JSON.stringify(o0)}`); }
  await pre('abundio'); await p.screenshot({ path: `${CAP}06-uncal-${ANCHO}.png` }); await pre('abundio', { masa: 80 }); await p.screenshot({ path: `${CAP}07-descer-${ANCHO}.png` });
  for (const pas of [70, 214]) for (const m of [0, 100]) { await pre('abundio', { masa: m, pas }); const l = await p.evaluate(() => window.__cr.leer()); ok(l.pic <= 80 && l.P <= 150, 'tope PIC/PAM'); if (l.pic >= l.P) ok((await tp()).includes('me:sello'), 'PIC≥PAM sin sello sin flujo'); }
  const im = await p.evaluate(() => new Promise((r) => { const i = document.getElementById('fig-img'); i.complete ? r(i.naturalWidth) : i.addEventListener('load', () => r(i.naturalWidth)); })); ok(im > 0, 'imagen sin cargar'); console.log('imagen', im);
  // ---- mando masa 0 / medio / 100 en cada tipo ----
  for (const tipo of ['hematoma', 'edema', 'ventricular', 'hsa', 'tronco']) {
    for (const m of [0, 50, 100]) { await pre('abundio'); await p.evaluate(([t, m]) => { window.__cr.ponerTipo(t); window.__cr.set({ masa: m }); }, [tipo, m]); console.log(` ${tipo} masa ${m}: ${await L()} topes[${await tp()}]`); await desb(`${tipo} ${m}`); await analiza(`${tipo} ${m}`); }
  }
  await pre('abundio', { masa: 100, pas: 100 }); ok((await tp()).includes('me:sello'), 'masa 100 sin sello de sin flujo'); ok(!(await clic('b-mas')), 'masa + sigue tocable con el sello'); await p.screenshot({ path: `${CAP}02-sin-flujo-${ANCHO}.png` });
  await pre('abundio'); ok((await tp()).includes('uncal:sello'), 'Abundio sin sello uncal'); ok(!(await clic('b-mas')), 'masa + tocable con sello uncal');
  await pre('abundio', { masa: 80 }); ok((await tp()).includes('desc:sello'), 'sin sello de descerebración'); console.log('desc:', await L(), await tp());
  // ---- PAS mín/medio/máx y la regla PIC<PAM, PPC>0 ----
  for (const pas of [70, 146, 214]) { await pre('abundio', { masa: 20, pas }); console.log(` PAS ${pas}: ${await L()} topes[${await tp()}]`); }
  await pre('abundio', { masa: 0, pas: 70 }); ok((await tp()).includes('ppc:aviso'), 'PPC<50 sin aviso');
  const inv = await p.evaluate(() => { let mal = 0, n = 0; for (const tipo of ['hematoma', 'edema', 'ventricular', 'hsa', 'tronco']) for (let m = 0; m <= 100; m += 5) for (const pas of [70, 100, 140, 180, 214]) for (const d of [0, 3]) for (const h of [0, 3]) for (const v of ['esp', 'vpp', 'hv']) for (const nitro of [false, true]) {
      window.__cr.ponerTipo(tipo); window.__cr.set({ masa: m, pas, drenaje: d, hiper: h, vent: v, nitro }); const l = window.__cr.leer(); n++; if (!(l.pic >= 4 && l.pic <= 80 && l.P <= 150 && (tipo !== 'hsa' || !window.__cr.topes().some((t) => t.clave === 'uncal')) && (l.pic < l.P || l.me) && (l.ppc > 0 || l.me) && (!l.me || window.__cr.topes().some((t) => t.clave === 'me')))) mal++; } return { n, mal }; });
  console.log(` invariantes PIC<PAM / PPC>0 / sello al llegar: ${inv.n} combinaciones, ${inv.mal} fallos`); ok(inv.mal === 0, 'combinación con PIC≥PAM sin sello o PPC≤0');
  // ---- topes uno a uno ----
  await pre('segismundo'); console.log('Segismundo:', await L(), await tp()); for (let i = 0; i < 3; i++) await clic('b-hora'); console.log(' +3 h sin revertir:', await L(), await tp()); ok((await tp()).includes('crece:sello'), 'warfarina sin revertir: sin sello'); ok(!(await clic('b-hora')), 'avanzar tocable con sello crece');
  await clic('b-rev'); ok(!(await tp()).includes('crece'), 'revertir no quitó el sello'); const l1 = await L(); await p.evaluate(() => { for (let i = 0; i < 0; i++); }); console.log(' tras revertir:', l1);
  await pre('abundio'); await clic('b-nitro'); ok((await tp()).includes('nitro:sello'), 'nitroprusiato sin sello'); ok(!(await clic('b-nitro')), 'nitroprusiato tocable'); console.log('nitro:', await L());
  await pre('clotilde'); let n = 0; while (await clic('b-hiper')) { if (++n > 8) break; } console.log(`hipertónico ×${n}:`, await L(), 'Na', await p.evaluate(() => window.__cr.s.na), await tp()); ok((await tp()).includes('na:sello'), 'Na>155 sin sello'); ok(n <= 4, 'hipertónico sin tope');
  await pre('clotilde'); await clic('b-cran'); ok((await tp()).includes('cran:sello'), 'hemicraniectomía sin sello'); ok(!(await clic('b-cran')), 'craniectomía tocable'); console.log('craniectomía:', await L());
  ok((await (async () => { await pre('clotilde'); await p.evaluate(() => window.__cr.set({ sensor: true })); return tp(); })()).includes('edemasens'), 'edema con sensor sin aviso');
  await pre('abundio', { masa: 85, sensor: false }); ok((await tp()).includes('sensor:aviso'), 'GCS≤8 sin sensor sin aviso');
  await pre('abundio', { masa: 20 }); await p.evaluate(() => window.__cr.set({ vent: 'vpp' })); ok((await tp()).includes('vpp:aviso'), 'VPP sin aviso'); await p.evaluate(() => window.__cr.set({ vent: 'hv' })); console.log('hiperventilar:', await L(), await tp());
  await pre('petronila', { pas: 165 }); ok((await tp()).includes('resang:sello'), 'HSA día 0 PAS165 sin resangrado'); ok(!(await clic('b-hora')), 'avanzar tocable con resangrado'); console.log('Petronila inicio:', await L(), await tp()); await pre('petronila'); { const l = await p.evaluate(() => window.__cr.leer()); ok(l.pic <= 25 && l.gcs === 9 && !(await tp()).includes('uncal'), `Petronila nace con PIC ${l.pic} GCS ${l.gcs} ${await tp()}`); await pre('petronila', { pas: 165 }); }
  await clic('b-exc'); ok(!(await tp()).includes('resang'), 'cerrar aneurisma no quita el resangrado'); await p.evaluate(() => window.__cr.set({ t: 5 })); ok((await tp()).includes('vaso:aviso'), 'días 4-14 sin aviso'); console.log('Petronila día 5:', await L(), await tp()); await p.screenshot({ path: `${CAP}03-hsa-dia5-${ANCHO}.png` });
  await pre('petronila', { exc: false, pas: 130, t: 5 }); ok((await tp()).includes('exc:aviso'), 'aneurisma abierto >3 días sin aviso');
  await pre('leovigildo'); console.log('Leovigildo:', await L()); await analiza('leovigildo');
  // ---- guías ----
  for (const c of ['abundio', 'segismundo', 'clotilde', 'petronila', 'leovigildo']) {
    await pre(c); let pasos = 0;
    for (let i = 0; i < 6; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('guia').hidden, foco: document.querySelectorAll('#cr-svg .foco').length, cit: document.querySelectorAll('#guia .ver-ficha[data-resaltar^="#mn-"]').length, pdf: document.querySelectorAll('#guia .cita-pdf').length, haz: !!document.querySelector('#guia [data-g="haz"]') }));
      if (!g.vis) break; pasos++; ok(g.foco > 0, `${c}: paso ${pasos} sin foco`); ok(g.cit === 1 && g.pdf === 1, `${c}: paso ${pasos} sin su cita doble`);
      if (g.haz) { const a = await L(); await clic2('#guia [data-g="haz"]'); } await clic2('#guia [data-g="sig"]'); }
    console.log(` guía ${c}: ${pasos} pasos`); ok(pasos >= 3 && pasos <= 5, `${c}: guía de ${pasos} pasos`);
  }
  async function clic2(q) { await p.evaluate((q) => document.querySelector(q).click(), q); }
  await pre('abundio'); await p.evaluate(() => document.getElementById('cr-svg').scrollIntoView({ block: 'start' })); await p.waitForTimeout(200); await p.screenshot({ path: `${CAP}04-guia-${ANCHO}.png` });
  // ---- apuesta, error, caso ----
  await p.evaluate(() => window.__cr.modoPrueba('apuesta')); const ocu = await p.evaluate(() => document.getElementById('m-pic').textContent === '?' && !document.getElementById('prueba').innerHTML.includes('data-ok')); ok(ocu, 'apuesta: enseña la PIC antes de contestar'); await desb('apuesta');
  const ops = await p.$$('#prueba .op'); ok(ops.length === 3, 'apuesta: 3 opciones'); const tx = await Promise.all(ops.map((o) => o.textContent())); const ia = tx.findIndex((t) => t.startsWith('Derecha, del lado')); await ops[ia].click();
  console.log('apuesta →', await L(), 'fin', await p.evaluate(() => document.getElementById('prueba').dataset.fin)); ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'apuesta sin completar'); await desb('apuesta resuelta'); await analiza('apuesta resuelta');
  await p.evaluate(() => window.__cr.modoPrueba('error')); const fr = await p.$$('#prueba .op'); ok(fr.length === 7, 'error: 6 frases + «no hay más»'); await fr[0].click(); ok(!(await p.evaluate(() => document.getElementById('prueba').dataset.fin)), 'error: acabó con una verdadera'); await fr[2].click(); ok(!(await p.evaluate(() => document.getElementById('prueba').dataset.fin)), 'error: acabó con un solo error de dos'); await fr[5].click();
  ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'error sin resolver'); await desb('error resuelto');
  await p.evaluate(() => window.__cr.modoPrueba('caso'));
  for (let i = 0; i < 5; i++) { const o = await p.$$('#prueba .op'); ok(o.length === 3, `caso paso ${i + 1}`); const tt = await Promise.all(o.map((x) => x.textContent())); const bien = [/^Bolo/, /^Cirugía urgente/, /^Dentro de objetivo/, /^Aún no/, /^PAM ≥75/][i]; await o[tt.findIndex((x) => bien.test(x))].click(); console.log(` caso paso ${i + 1}:`, await L()); await desb(`caso ${i + 1}`); await escena(`caso ${i + 1}`); await pupilas(`caso ${i + 1}`); await analiza(`caso ${i + 1}`); if (i < 4) await clic2('#prueba [data-sig]'); }
  ok(await p.evaluate(() => !!document.getElementById('prueba').dataset.fin), 'caso sin completar'); await p.screenshot({ path: `${CAP}05-caso-${ANCHO}.png`, fullPage: true });
  // ---- citas con doble enlace; frase y dock ----
  const cc = await p.evaluate(() => ({ n: document.querySelectorAll('.cita').length, mal: [...document.querySelectorAll('.cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length })); console.log(' citas', cc); ok(cc.mal === 0, 'cita sin doble enlace');
  await pre('abundio'); await clic('b-mas'); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => { const f = document.getElementById('frase').getBoundingClientRect(), d = document.getElementById('dock').getBoundingClientRect(); return { cruza: f.bottom > d.top + 1, dock: Math.round(d.height), vh: innerHeight }; }); console.log(' frase/dock', vis); ok(!vis.cruza && vis.dock < 400, 'frase bajo el dock o dock enorme');
  const bots = await p.evaluate(() => { const a = document.getElementById('b-mas'); return a.isConnected; }); ok(bots, 'botón del dock rehecho');
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); try { process.kill(pid); } catch {} }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(fallos.length ? 'FALLOS:\n- ' + [...new Set(fallos)].join('\n- ') : 'TODO EN VERDE');
