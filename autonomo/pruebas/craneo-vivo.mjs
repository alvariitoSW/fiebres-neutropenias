// Prueba del cráneo vivo en la app (juez de autonomo/jueces.mjs --modelo craneo-vivo). Sale de la de la maqueta (herramientas/craneo-b.mjs) (390 y 360): desborde, rótulos <8 px en pantalla, SOLAPES entre cajas <text>,
// cifras de cada mando (mín/medio/máx), cada tope con su sello, apuesta/error/caso, imágenes, consola. Puerto 8262.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const RAIZ = new URL('../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b6a/capturas/crv/'; mkdirSync(CAP, { recursive: true });
const ARGS = process.argv.slice(2), URLARG = ARGS.find((a) => /^https?:/.test(a)); const srv = URLARG ? null : spawn('python3', ['-m', 'http.server', '8762'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv?.pid; const BASE = (URLARG || 'http://127.0.0.1:8762/').replace(/\/?$/, '/');
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (ARGS.find((a) => /^\d+$/.test(a)) ? [+ARGS.find((a) => /^\d+$/.test(a))] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200); await abre('abundio'); 
  async function abre(est) { await p.evaluate((est) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'craneoVivo', craneoVivo: est }); document.body.append(t); t.click(); t.remove(); }, est); await p.waitForFunction(() => window.__craneo, null, { timeout: 8000 }); await p.waitForTimeout(500); }
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const tp = () => p.evaluate(() => window.__craneo.topes().map((t) => t.clave + ':' + t.nivel).sort().join(' '));
  const L = () => p.evaluate(() => { const l = window.__craneo.leer(); return `PIC ${l.pic} PAM ${l.P} PPC ${l.ppc} est ${l.est} GCS ${l.gcs}`; });
  const pre = (c, o = {}) => p.evaluate(([c, o]) => { window.__craneo.ponerPreset(c); window.__craneo.set(o); }, [c, o]);
  const clic = (id) => p.evaluate((id) => { const e = document.getElementById('crv-' + id); if (e.disabled) return false; e.click(); return true; }, id);
  const analiza = async (t) => {
    const r = await p.evaluate(() => {
      const sv = document.getElementById('crv-svg'), R = sv.getBoundingClientRect(), esc = R.width / 390; let min = 99; const cajas = [];
      sv.querySelectorAll('text').forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; min = Math.min(min, f); const b = x.getBoundingClientRect(); if (b.width) cajas.push({ t: x.textContent, l: b.left, r: b.right, a: b.top, d: b.bottom }); });
      const sol = []; for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) { const A = cajas[i], B = cajas[j], w = Math.min(A.r, B.r) - Math.max(A.l, B.l), h = Math.min(A.d, B.d) - Math.max(A.a, B.a); if (w > 1.5 && h > 2) sol.push(`«${A.t}» × «${B.t}»`); }
      const fuera = cajas.filter((c) => c.r > R.right + 0.5 || c.l < R.left - 0.5).map((c) => c.t);
      return { min: +min.toFixed(2), sol, fuera };
    });
    ok(r.min >= 9, `${ANCHO} ${t}: rótulo de ${r.min}px`); if (t === 'inicio') console.log('rótulo mínimo del corte:', r.min, 'px en pantalla'); ok(!r.sol.length, `${ANCHO} ${t}: solapes ${r.sol.join(' | ')}`); ok(!r.fuera.length, `${ANCHO} ${t}: texto fuera del dibujo ${r.fuera.join(',')}`);
    return `min ${r.min}px solapes ${r.sol.length}`;
  };
  await desb('inicio'); console.log('inicio:', await analiza('inicio'), '|', await L(), '| topes', await tp());
  await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });

  // ---- escena entera sobre el dock, sello bajo el monitor, pupila ↔ sello ----
  const escena = async (t) => { const r = await p.evaluate(() => { document.getElementById('crv-escena').scrollIntoView({ block: 'start' }); const sv = document.getElementById('crv-svg').getBoundingClientRect(), d = document.getElementById('crv-dock').getBoundingClientRect(), f = document.getElementById('crv-frase').getBoundingClientRect(), m = document.querySelector('#crv-monitor .mon-fila').getBoundingClientRect(), fila = document.querySelector('#crv-monitor .mon-fila').getBoundingClientRect(); const sel = [...document.querySelectorAll('#crv-monitor .tope-sello')].filter((x) => !x.hidden).map((x) => x.getBoundingClientRect());
      return { svgB: sv.bottom, dockT: d.top, fraseT: f.top, mon: m.height, solSello: sel.some((x) => x.top < fila.bottom - 0.5 && x.bottom > fila.top), dockH: d.height, fraseH: f.height }; });
    ok(r.svgB < Math.min(r.dockT, r.fraseT) - 0.5, `${ANCHO} ${t}: el corte llega a ${Math.round(r.svgB)} y la frase/dock empiezan en ${Math.round(Math.min(r.dockT, r.fraseT))}`); ok(r.mon <= 120, `${ANCHO} ${t}: monitor de ${Math.round(r.mon)}px`); ok(!r.solSello, `${ANCHO} ${t}: el sello tapa el monitor`); return r; };
  const pupilas = async (t) => { const r = await p.evaluate(() => { const c = [...document.querySelectorAll('#crv-svg .pup')], D = c.find((x) => x.dataset.lado === 'D'), I = c.find((x) => x.dataset.lado === 'I'); const act = window.__craneo.topes().map((x) => x.clave), l = window.__craneo.leer(); return { rD: +D.dataset.r, rI: +I.dataset.r, fD: D.dataset.fija === '1', fI: I.dataset.fija === '1', act, tipo: window.__craneo.s.tipo, est: l.est, pup: l.pup, txt: [...document.querySelectorAll('#crv-svg text')].map((x) => x.textContent).filter((x) => /pupila|Reactivas|Dilatadas|Medias|D algo/i.test(x)).join(' ') }; });
    const uncal = r.act.includes('uncal'), desc = r.act.includes('desc'), me = r.act.includes('me');
    ok(uncal === (r.rD > r.rI + 2 && r.fD && !r.fI), `${t}: sello uncal=${uncal} y pupilas D${r.rD}${r.fD ? 'f' : ''} I${r.rI}${r.fI ? 'f' : ''}`);
    if (desc) ok(r.rD >= 9 && r.rI >= 9 && r.fD && r.fI, `${t}: sello descerebración y pupilas no dilatadas fijas`); if (me) ok(r.fD && r.fI && r.rD === r.rI, `${t}: sin flujo y pupilas no medias fijas`);
    if (r.tipo === 'hsa') ok(!uncal && !(r.rD > r.rI + 2), `${t}: HSA con pupila unilateral`); if (r.est === 0 && r.tipo !== 'tronco') ok(r.rD === 4 && r.rI === 4 && !r.fD && !r.fI, `${t}: PIC normal con pupilas anormales`); return r; };
  console.log('escena inicio:', JSON.stringify(await escena('inicio')), JSON.stringify(await pupilas('inicio')));
  for (const [c0, o0] of [['abundio', {}], ['abundio', { masa: 60 }], ['abundio', { masa: 80 }], ['abundio', { masa: 100 }], ['petronila', {}], ['petronila', { pas: 165 }], ['petronila', { masa: 100, pas: 214 }], ['clotilde', { masa: 100 }], ['leovigildo', {}], ['segismundo', {}]]) { await pre(c0, o0); await escena(`${c0} ${JSON.stringify(o0)}`); await pupilas(`${c0} ${JSON.stringify(o0)}`); }
  await pre('abundio'); await p.screenshot({ path: `${CAP}06-uncal-${ANCHO}.png` }); await pre('abundio', { masa: 80 }); await p.screenshot({ path: `${CAP}07-descer-${ANCHO}.png` });
  for (const pas of [70, 214]) for (const m of [0, 100]) { await pre('abundio', { masa: m, pas }); const l = await p.evaluate(() => window.__craneo.leer()); ok(l.pic <= 80 && l.P <= 150, 'tope PIC/PAM'); if (l.pic >= l.P) ok((await tp()).includes('me:sello'), 'PIC≥PAM sin sello sin flujo'); }
  const im = await p.evaluate(() => new Promise((r) => { const i = document.getElementById('crv-fig-img'); i.complete ? r(i.naturalWidth) : i.addEventListener('load', () => r(i.naturalWidth)); })); ok(im > 0, 'imagen sin cargar'); console.log('imagen', im);
  // ---- mando masa 0 / medio / 100 en cada tipo ----
  for (const tipo of ['hematoma', 'edema', 'ventricular', 'hsa', 'tronco']) {
    for (const m of [0, 50, 100]) { await pre('abundio'); await p.evaluate(([t, m]) => { window.__craneo.ponerTipo(t); window.__craneo.set({ masa: m }); }, [tipo, m]); console.log(` ${tipo} masa ${m}: ${await L()} topes[${await tp()}]`); await desb(`${tipo} ${m}`); await analiza(`${tipo} ${m}`); }
  }
  await pre('abundio', { masa: 100, pas: 100 }); ok((await tp()).includes('me:sello'), 'masa 100 sin sello de sin flujo'); ok(!(await clic('b-mas')), 'masa + sigue tocable con el sello'); await p.screenshot({ path: `${CAP}02-sin-flujo-${ANCHO}.png` });
  await pre('abundio'); ok((await tp()).includes('uncal:sello'), 'Abundio sin sello uncal'); ok(!(await clic('b-mas')), 'masa + tocable con sello uncal');
  await pre('abundio', { masa: 80 }); ok((await tp()).includes('desc:sello'), 'sin sello de descerebración'); console.log('desc:', await L(), await tp());
  // ---- PAS mín/medio/máx y la regla PIC<PAM, PPC>0 ----
  for (const pas of [70, 146, 214]) { await pre('abundio', { masa: 20, pas }); console.log(` PAS ${pas}: ${await L()} topes[${await tp()}]`); }
  await pre('abundio', { masa: 0, pas: 70 }); ok((await tp()).includes('ppc:aviso'), 'PPC<50 sin aviso');
  const inv = await p.evaluate(() => { let mal = 0, n = 0; for (const tipo of ['hematoma', 'edema', 'ventricular', 'hsa', 'tronco']) for (let m = 0; m <= 100; m += 5) for (const pas of [70, 100, 140, 180, 214]) for (const d of [0, 3]) for (const h of [0, 3]) for (const v of ['esp', 'vpp', 'hv']) for (const nitro of [false, true]) {
      window.__craneo.ponerTipo(tipo); window.__craneo.set({ masa: m, pas, drenaje: d, hiper: h, vent: v, nitro }); const l = window.__craneo.leer(); n++; if (!(l.pic >= 4 && l.pic <= 80 && l.P <= 150 && (tipo !== 'hsa' || !window.__craneo.topes().some((t) => t.clave === 'uncal')) && (l.pic < l.P || l.me) && (l.ppc > 0 || l.me) && (!l.me || window.__craneo.topes().some((t) => t.clave === 'me')))) mal++; } return { n, mal }; });
  console.log(` invariantes PIC<PAM / PPC>0 / sello al llegar: ${inv.n} combinaciones, ${inv.mal} fallos`); ok(inv.mal === 0, 'combinación con PIC≥PAM sin sello o PPC≤0');
  // ---- topes uno a uno ----
  await pre('segismundo'); console.log('Segismundo:', await L(), await tp()); for (let i = 0; i < 3; i++) await clic('b-hora'); console.log(' +3 h sin revertir:', await L(), await tp()); ok((await tp()).includes('crece:sello'), 'warfarina sin revertir: sin sello'); ok(!(await clic('b-hora')), 'avanzar tocable con sello crece');
  await clic('b-rev'); ok(!(await tp()).includes('crece'), 'revertir no quitó el sello'); const l1 = await L(); await p.evaluate(() => { for (let i = 0; i < 0; i++); }); console.log(' tras revertir:', l1);
  await pre('abundio'); await clic('b-nitro'); ok((await tp()).includes('nitro:sello'), 'nitroprusiato sin sello'); ok(!(await clic('b-nitro')), 'nitroprusiato tocable'); console.log('nitro:', await L());
  await pre('clotilde'); let n = 0; while (await clic('b-hiper')) { if (++n > 8) break; } console.log(`hipertónico ×${n}:`, await L(), 'Na', await p.evaluate(() => window.__craneo.s.na), await tp()); ok((await tp()).includes('na:sello'), 'Na>155 sin sello'); ok(n <= 4, 'hipertónico sin tope');
  await pre('clotilde'); await clic('b-cran'); ok((await tp()).includes('cran:sello'), 'hemicraniectomía sin sello'); ok(!(await clic('b-cran')), 'craniectomía tocable'); console.log('craniectomía:', await L());
  ok((await (async () => { await pre('clotilde'); await p.evaluate(() => window.__craneo.set({ sensor: true })); return tp(); })()).includes('edemasens'), 'edema con sensor sin aviso');
  await pre('abundio', { masa: 85, sensor: false }); ok((await tp()).includes('sensor:aviso'), 'GCS≤8 sin sensor sin aviso');
  await pre('abundio', { masa: 20 }); await p.evaluate(() => window.__craneo.set({ vent: 'vpp' })); ok((await tp()).includes('vpp:aviso'), 'VPP sin aviso'); await p.evaluate(() => window.__craneo.set({ vent: 'hv' })); console.log('hiperventilar:', await L(), await tp());
  await pre('petronila', { pas: 165 }); { const a = await tp(); ok(a.includes('resang0:aviso') && !a.includes('resang:sello'), 'HSA hora 0 PAS165: aviso, sin sello ' + a); } await pre('petronila', { pas: 165, t: 1 }); ok((await tp()).includes('resang:sello'), 'HSA t=1 PAS165 sin resangrado'); ok(!(await clic('b-hora')), 'avanzar tocable con resangrado'); console.log('Petronila inicio:', await L(), await tp()); await pre('petronila'); await p.screenshot({ path: `${CAP}11-petronila-inicio-${ANCHO}.png` }); { const l = await p.evaluate(() => window.__craneo.leer()); ok(l.pic <= 25 && l.gcs === 9 && !(await tp()).includes('uncal'), `Petronila nace con PIC ${l.pic} GCS ${l.gcs} ${await tp()}`); await pre('petronila', { pas: 165, t: 1 }); }
  await clic('b-exc'); ok(!(await tp()).includes('resang:'), 'cerrar aneurisma no quita el resangrado'); await p.evaluate(() => window.__craneo.set({ t: 5 })); ok((await tp()).includes('vaso:aviso'), 'días 4-14 sin aviso'); console.log('Petronila día 5:', await L(), await tp()); await p.screenshot({ path: `${CAP}03-hsa-dia5-${ANCHO}.png` });
  await pre('petronila', { exc: false, pas: 130, t: 5 }); ok((await tp()).includes('exc:aviso'), 'aneurisma abierto >3 días sin aviso');
  await pre('leovigildo'); console.log('Leovigildo:', await L()); await analiza('leovigildo');
  // ---- guías ----
  for (const c of ['abundio', 'segismundo', 'clotilde', 'petronila', 'leovigildo']) {
    await pre(c); let pasos = 0;
    for (let i = 0; i < 6; i++) { const g = await p.evaluate(() => ({ vis: !document.getElementById('crv-guia').hidden, foco: document.querySelectorAll('#crv-svg .foco').length, cit: document.querySelectorAll('#crv-guia .ver-ficha[data-resaltar^="#mn-"]').length, pdf: document.querySelectorAll('#crv-guia .cita-pdf').length, haz: !!document.querySelector('#crv-guia [data-g="haz"]') }));
      if (!g.vis) break; pasos++; ok(g.foco > 0, `${c}: paso ${pasos} sin foco`); ok(g.cit === 1 && g.pdf === 1, `${c}: paso ${pasos} sin su cita doble`);
      if (g.haz) { const a = await L(); await clic2('#crv-guia [data-g="haz"]'); } await clic2('#crv-guia [data-g="sig"]'); }
    console.log(` guía ${c}: ${pasos} pasos`); ok(pasos >= 3 && pasos <= 5, `${c}: guía de ${pasos} pasos`);
  }
  async function clic2(q) { await p.evaluate((q) => document.querySelector(q).click(), q); }
  await pre('abundio'); await p.evaluate(() => document.getElementById('crv-svg').scrollIntoView({ block: 'start' })); await p.waitForTimeout(200); await p.screenshot({ path: `${CAP}04-guia-${ANCHO}.png` });
  // ---- apuesta, error, caso ----
  await p.evaluate(() => window.__craneo.modoPrueba('apuesta')); const ocu = await p.evaluate(() => document.getElementById('crv-m-pic').textContent === '?' && !document.getElementById('crv-prueba').innerHTML.includes('data-ok')); ok(ocu, 'apuesta: enseña la PIC antes de contestar'); await desb('apuesta');
  const ops = await p.$$('#crv-prueba .op'); ok(ops.length === 3, 'apuesta: 3 opciones'); const tx = await Promise.all(ops.map((o) => o.textContent())); const ia = tx.findIndex((t) => t.startsWith('Derecha, del lado')); await ops[ia].click();
  console.log('apuesta →', await L(), 'fin', await p.evaluate(() => document.getElementById('crv-prueba').dataset.fin)); ok(await p.evaluate(() => !!document.getElementById('crv-prueba').dataset.fin), 'apuesta sin completar'); await desb('apuesta resuelta'); await analiza('apuesta resuelta');
  await p.evaluate(() => window.__craneo.modoPrueba('error')); const fr = await p.$$('#crv-prueba .op'); ok(fr.length === 7, 'error: 6 frases + «no hay más»'); await fr[0].click(); ok(!(await p.evaluate(() => document.getElementById('crv-prueba').dataset.fin)), 'error: acabó con una verdadera'); await fr[2].click(); ok(!(await p.evaluate(() => document.getElementById('crv-prueba').dataset.fin)), 'error: acabó con un solo error de dos'); await fr[5].click();
  ok(await p.evaluate(() => !!document.getElementById('crv-prueba').dataset.fin), 'error sin resolver'); await desb('error resuelto');
  await p.evaluate(() => window.__craneo.modoPrueba('caso'));
  for (let i = 0; i < 5; i++) { const o = await p.$$('#crv-prueba .op'); ok(o.length === 3, `caso paso ${i + 1}`); const tt = await Promise.all(o.map((x) => x.textContent())); const bien = [/^Bolo/, /^Cirugía urgente/, /^Dentro de objetivo/, /^Aún no/, /^PAM ≥75/][i]; await o[tt.findIndex((x) => bien.test(x))].click(); console.log(` caso paso ${i + 1}:`, await L()); await desb(`caso ${i + 1}`); await escena(`caso ${i + 1}`); await pupilas(`caso ${i + 1}`); await analiza(`caso ${i + 1}`); if (i < 4) await clic2('#crv-prueba [data-sig]'); }
  ok(await p.evaluate(() => !!document.getElementById('crv-prueba').dataset.fin), 'caso sin completar'); await p.screenshot({ path: `${CAP}05-caso-${ANCHO}.png`, fullPage: true });
  // ---- vuelta 2b: injertos ----
  await pre('abundio'); await p.evaluate(() => { document.getElementById('crv-pv-det').open = true; document.getElementById('crv-pa-det').open = true; });
  const svgs = async (t) => { for (const id of ['crv-pv-svg', 'crv-pa-svg', 'crv-pen-svg', 'crv-ppc-cab']) { const r = await p.evaluate((id) => { const sv = document.getElementById(id), R = sv.getBoundingClientRect(); if (!R.width) return null; const esc = R.width / sv.viewBox.baseVal.width, cajas = []; let min = 99;
        sv.querySelectorAll('text').forEach((x) => { min = Math.min(min, parseFloat(x.getAttribute('font-size') || getComputedStyle(x).fontSize) * esc); const b = x.getBoundingClientRect(); if (b.width) cajas.push({ t: x.textContent, l: b.left, r: b.right, a: b.top, d: b.bottom }); });
        const sol = []; for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) { const A = cajas[i], B = cajas[j], w = Math.min(A.r, B.r) - Math.max(A.l, B.l), h = Math.min(A.d, B.d) - Math.max(A.a, B.a); if (w > 1.5 && h > 2) sol.push(`«${A.t}»×«${B.t}»`); }
        const fuera = cajas.filter((c) => c.r > R.right + 0.5 || c.l < R.left - 0.5).map((c) => c.t); return { min, sol, fuera }; }, id);
      if (!r) continue; ok(r.min >= 8, `${ANCHO} ${t} ${id}: rótulo de ${r.min.toFixed(2)}px`); ok(!r.sol.length, `${ANCHO} ${t} ${id}: solapes ${r.sol.join(' | ')}`); ok(!r.fuera.length, `${ANCHO} ${t} ${id}: texto fuera ${r.fuera.join(',')}`); } };
  await svgs('abundio'); await desb('plegables abiertos');
  const cx = async () => p.evaluate(() => +document.querySelector('#crv-pv-svg circle').getAttribute('cx'));
  await pre('abundio', { masa: 0 }); const c0 = await cx(); await pre('abundio', { masa: 100 }); const c1 = await cx(); ok(c1 > c0 + 100, 'curva: el punto no sigue la masa'); await svgs('masa 100');
  const cab = await p.evaluate(() => document.getElementById('crv-ppc-cab').textContent); const l2 = await p.evaluate(() => window.__craneo.leer()); ok(cab.includes('PPC = PAM − PIC') && cab.includes(`${l2.P} − ${l2.pic} = ${l2.ppc}`), 'cabecera PPC no coincide con el monitor: ' + cab);
  // Monro-Kellie: fuentes y cifras visibles; la autorregulación 50 y 150
  const txt = await p.evaluate(() => document.getElementById('crv-pv-txt').textContent + document.getElementById('crv-pa-txt').textContent); for (const k of ['80 %', '1200-1300', '35-180', '55-110', '150 mL', '50 y 150', '3-4 %', 'otra fuente', 'no Marino']) ok(txt.includes(k) || txt.toLowerCase().includes(k.toLowerCase()), 'falta en el panel: ' + k);
  const enl = await p.evaluate(() => [...document.querySelectorAll('#crv-pv-txt a, #crv-pa-txt a')].map((a) => a.href)); ok(enl.length >= 6 && enl.every((h) => /#page=\d+|statpearls/.test(h)), 'enlaces de los paneles sin página: ' + enl.length);
  // penumbra (solo ictus), anillos que se apagan con la PPC, y los topes del ictus con su cita doble
  await pre('clotilde'); const pen = async () => p.evaluate(() => ({ vis: !document.getElementById('crv-pen-caja').hidden, t: document.getElementById('crv-pen-svg').textContent, citas: document.querySelectorAll('#crv-ictus-lista .cita .ver-ficha[data-resaltar]').length }));
  const pa = await pen(); ok(pa.vis && /3 de 3/.test(pa.t) && pa.citas >= 4, 'penumbra Clotilde: ' + JSON.stringify(pa)); await svgs('clotilde'); await pre('clotilde', { pas: 70 }); const pb = await pen(); ok(/[012] de 3/.test(pb.t), 'penumbra no se apaga con PPC baja: ' + pb.t); await svgs('clotilde PAS 70');
  await pre('abundio'); ok(!(await pen()).vis, 'penumbra visible fuera del ictus');
  // Doppler y partículas de las arterias de la base
  const dtc = () => p.evaluate(() => ({ vis: !document.getElementById('crv-dtc-s').hidden, t: document.getElementById('crv-m-dtc').textContent, anim: document.querySelectorAll('#crv-svg animateMotion').length, mon: Math.round(document.querySelector('#crv-monitor .mon-fila').getBoundingClientRect().height) }));
  await pre('petronila'); const d1 = await dtc(); ok(d1.vis && d1.t === '60 cm/s' && d1.anim === 4, 'Doppler día 0: ' + JSON.stringify(d1)); await p.evaluate(() => window.__craneo.set({ t: 5 })); const d2 = await dtc(); ok(d2.t === '90 cm/s' && d2.mon <= 120, 'Doppler día 5: ' + JSON.stringify(d2)); await escena('HSA con Doppler');
  await pre('petronila', { masa: 100, pas: 70 }); const d3 = await dtc(); const l3 = await p.evaluate(() => window.__craneo.leer()); ok(!l3.me || (d3.t === 'sin señal' && d3.anim === 0), 'sin flujo: Doppler/partículas siguen: ' + JSON.stringify(d3));
  await pre('abundio', { masa: 100, pas: 100 }); const d4 = await dtc(); ok(d4.anim === 0 && !d4.vis, 'sin flujo: las partículas no se paran: ' + JSON.stringify(d4)); await pre('abundio'); ok((await dtc()).anim === 4 && !(await dtc()).vis, 'Doppler visible fuera de la HSA o sin partículas');
  // hiperventilar: la frase del 3-4 % por mmHg aparece
  await p.evaluate(() => window.__craneo.set({ vent: 'hv' })); ok((await p.evaluate(() => document.getElementById('crv-co2-txt').textContent)).includes('3-4 % por mmHg'), 'hiperventilar sin la cifra del CO₂');
  // apuesta: opciones de longitud igualada y la correcta no es la más larga
  await p.evaluate(() => window.__craneo.modoPrueba('apuesta')); const L3 = await p.$$eval('#crv-prueba .op', (o) => o.map((x) => ({ n: x.textContent.length, ok: x.textContent.startsWith('Derecha, del lado') }))); const mx = Math.max(...L3.map((x) => x.n)), mn = Math.min(...L3.map((x) => x.n));
  ok(mx / mn <= 1.2, `apuesta: longitudes ${L3.map((x) => x.n)}`); ok(L3.find((x) => x.ok).n < mx, 'apuesta: la correcta es la más larga');
  // caso de Segismundo: cada enunciado con las cifras del monitor, y se completa
  await p.evaluate(() => window.__craneo.modoPrueba('caso', 1)); const seg = [/^Revertir ya/, /^Monitorizar la PIC/, /^Drenar LCR/, /^Drenaje ventricular/]; const cifras = [(l, pa) => pa === '196/108' && l.gcs === 13, (l) => l.gcs === 6, (l) => l.pic === 26 && l.P === 100 && l.ppc === 74, () => true];
  for (let i = 0; i < 4; i++) { const o = await p.$$('#crv-prueba .op'); ok(o.length === 3, `Segismundo paso ${i + 1}: ${o.length} opciones`); const l = await p.evaluate(() => window.__craneo.leer()), pa = await p.evaluate(() => document.getElementById('crv-m-pa').textContent); ok(cifras[i](l, pa), `Segismundo paso ${i + 1}: cifras del enunciado ≠ monitor (${JSON.stringify([l.pic, l.P, l.ppc, l.gcs, pa])})`);
    const tt = await Promise.all(o.map((x) => x.textContent())); await o[tt.findIndex((x) => seg[i].test(x))].click(); await desb(`Segismundo ${i + 1}`); await escena(`Segismundo ${i + 1}`); await pupilas(`Segismundo ${i + 1}`); await svgs(`Segismundo ${i + 1}`); if (i === 2) { const l4 = await p.evaluate(() => window.__craneo.leer()); ok(l4.pic === 18 && l4.P === 80 && l4.ppc === 62, 'Segismundo paso 3: tras drenar PIC/PAM/PPC ' + JSON.stringify([l4.pic, l4.P, l4.ppc])); } if (i < 3) await clic2('#crv-prueba [data-sig]'); }
  ok(await p.evaluate(() => !!document.getElementById('crv-prueba').dataset.fin), 'Segismundo: caso sin completar'); await p.screenshot({ path: `${CAP}08-segismundo-${ANCHO}.png`, fullPage: true });
  // segundo error: 3 frases + «no hay más», dos errores
  await p.evaluate(() => window.__craneo.modoPrueba('error', 1)); const f2 = await p.$$('#crv-prueba .op'); ok(f2.length === 4, 'error 2: 3 frases + «no hay más»'); await f2[2].click(); ok(!(await p.evaluate(() => document.getElementById('crv-prueba').dataset.fin)), 'error 2: acabó con la verdadera');
  await f2[0].click(); ok(!(await p.evaluate(() => document.getElementById('crv-prueba').dataset.fin)), 'error 2: acabó con un solo error de dos'); await f2[1].click(); ok(await p.evaluate(() => !!document.getElementById('crv-prueba').dataset.fin), 'error 2 sin resolver'); await desb('error 2');
  // injertos abiertos: el corte sigue entero sobre el dock, y el dock no crece
  await pre('abundio'); await escena('con plegables abiertos'); await p.evaluate(() => { document.getElementById('crv-pv-det').scrollIntoView({ block: 'start' }); }); await p.waitForTimeout(250); await p.screenshot({ path: `${CAP}09-injertos-${ANCHO}.png` });
  await pre('clotilde'); await p.evaluate(() => document.getElementById('crv-pa-det').scrollIntoView({ block: 'start' })); await p.waitForTimeout(250); await p.screenshot({ path: `${CAP}10-penumbra-${ANCHO}.png` });
  // ---- citas con doble enlace; frase y dock ----
  const cc = await p.evaluate(() => ({ n: document.querySelectorAll('#crv-raiz .cita').length, mal: [...document.querySelectorAll('#crv-raiz .cita')].filter((c) => !c.querySelector('.ver-ficha[data-resaltar]') || !c.querySelector('.cita-pdf')).length })); console.log(' citas', cc); ok(cc.mal === 0, 'cita sin doble enlace');
  await pre('abundio'); await clic('b-mas'); await p.waitForTimeout(300);
  const vis = await p.evaluate(() => { const f = document.getElementById('crv-frase').getBoundingClientRect(), d = document.getElementById('crv-dock').getBoundingClientRect(); return { cruza: f.bottom > d.top + 1, dock: Math.round(d.height), vh: innerHeight }; }); console.log(' frase/dock', vis); ok(!vis.cruza && vis.dock < 400, 'frase bajo el dock o dock enorme');
  const bots = await p.evaluate(() => { const a = document.getElementById('crv-b-mas'); return a.isConnected; }); ok(bots, 'botón del dock rehecho');
  // ---- app: retoques del rejuicio, cambio de paciente y botones de las fichas ----
  const sellos = () => p.evaluate(() => [...document.querySelectorAll('#crv-monitor .tope-sello')].map((x) => x.textContent.toLowerCase()).join(' | '));
  let e4 = null, e5 = null; for (let m = 40; m <= 100; m += 2) { await pre('abundio', { masa: m }); const l = await p.evaluate(() => window.__craneo.leer()); if (l.est === 4 && e4 === null) { e4 = m; ok((await sellos()).includes('descerebr'), `estadio 4 (masa ${m}) sin sello de descerebración: ${await sellos()}`); } if (l.est === 5 && e5 === null) { e5 = m; ok((await sellos()).includes('flácid') && (await sellos()).includes('tronco bajo'), `estadio 5 (masa ${m}) sin «flácido: tronco bajo»: ${await sellos()}`); } }
  console.log(' sellos del tronco: estadio 4 en masa', e4, '· estadio 5 en masa', e5); ok(e4 !== null && e5 !== null, 'no se alcanzan los estadios 4 y 5');
  await pre('petronila'); { const l = await p.evaluate(() => window.__craneo.leer()), s2 = await p.evaluate(() => window.__craneo.s), a = await tp(); console.log(' Petronila al nacer:', `PAS ${s2.pas} PIC ${l.pic} GCS ${l.gcs}`, a); ok(s2.pas <= 140 && l.pic <= 25 && l.gcs === 9 && !a.includes('resang:'), 'Petronila no nace con PAS ≤140, PIC ≤25, GCS 9 y sin resangrado'); }
  await pre('petronila', { pas: 165 }); await p.evaluate(() => window.__craneo.set({ t: 1 })); ok((await tp()).includes('resang:sello'), 'resangrado con t=1 y PAS 165'); await p.evaluate(() => window.__craneo.ponerPreset('abundio')); { const a = await tp(); ok(!a.includes('resang') && !a.includes('vaso'), 'cambio de paciente: quedan avisos del anterior: ' + a); ok(!(await sellos()).includes('resangr'), 'cambio de paciente: queda el sello de resangrado'); }
  await pre('abundio', { masa: 100, pas: 100 }); ok((await tp()).includes('me:sello'), 'sin sello sin flujo'); await p.evaluate(() => window.__craneo.ponerPreset('clotilde')); ok(!(await tp()).includes('me:'), 'cambio de paciente: queda «sin flujo»');
  { await p.evaluate(() => window.__craneo.ponerPreset('abundio', 3)); const g4 = await p.evaluate(() => document.getElementById('crv-guia').textContent); console.log(' Abundio paso 4:', g4.slice(0, 160)); ok(/paso 4 de 5/i.test(g4), 'abundio:4 no abre el paso 4'); }
  // botones de ficha: cada uno llega a su paciente (y paso), y «← VOLVER» lleva a la ficha de origen
  for (const [tab, est, pac, paso] of [['mn-hic', 'abundio', 'abundio', 1], ['mn-hsa', 'petronila', 'petronila', 1], ['mn-ictus-complicaciones', 'clotilde', 'clotilde', 1], ['mn-coma', 'leovigildo', 'leovigildo', 1], ['mn-muerte-encefalica', 'abundio:4', 'abundio', 4]]) {
    await p.evaluate((tab) => { window.scrollTo(0, 0); document.querySelector(`#panel-marino-neuro-tabs`); }, tab);
    await p.evaluate(([tab]) => { const b = document.querySelector(`#${tab} [data-view="craneoVivo"]`); b.scrollIntoView(); b.click(); }, [tab]); await p.waitForTimeout(700);
    const r = await p.evaluate(() => ({ pac: document.querySelector('#crv-presets [aria-pressed="true"]')?.dataset.pre, g: document.getElementById('crv-guia').textContent, vis: document.getElementById('crv-raiz').offsetHeight > 0, volver: document.getElementById('crv-volver').textContent }));
    ok(r.vis && r.pac === pac && new RegExp(`paso ${paso} de`, 'i').test(r.g), `ficha ${tab}: llega a ${r.pac} / ${r.g.slice(0, 40)}`); ok(r.volver.includes('FICHA'), `ficha ${tab}: el VOLVER no dice FICHA`);
    await p.evaluate(() => document.getElementById('crv-volver').click()); await p.waitForTimeout(500);
    ok(await p.evaluate((tab) => document.getElementById(tab).offsetHeight > 0, tab), `ficha ${tab}: VOLVER no regresa a la ficha`); console.log(' ficha', tab, '→', r.pac, 'paso', paso, 'ok');
  }
  await ctx.close();
}
} catch (e) { fallos.push('excepción: ' + e.message); } finally { await b.close(); try { pid && process.kill(pid); } catch {} }
console.log('\nErrores de consola:', errores.length ? errores.slice(0, 5) : 'ninguno');
console.log(fallos.length ? 'FALLOS:\n- ' + [...new Set(fallos)].join('\n- ') : 'TODO EN VERDE');
